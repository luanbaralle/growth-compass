import { generateCreativeBrief } from "@/domains/copilot/engine/creative-brief.server";
import * as copilotRepo from "@/domains/copilot/meeting/repository.server";
import { rowToSnapshot, transcriptRowToSegment } from "@/domains/copilot/meeting/session-mapper";
import type { TeamMember } from "@/lib/auth/types";
import {
  approveBlueprint as approveBlueprintCore,
  createBlueprintFromCopilotSession as createBlueprintCore,
  enrichBlueprintFromCopilot,
  generateProposalFromBlueprint,
  getBlueprint,
  getBlueprintForSession,
  rebuildBlueprintFromCopilot,
  updateBlueprint as updateBlueprintCore,
} from "./blueprint/service.server";
import type { BlueprintStatus, CommercialBlueprintData } from "./blueprint/types";
import {
  buildProposalContentFromArtifact,
  buildSuggestedSlug,
} from "./engine/artifact-to-proposal";
import { ensureAccelerationPlaybookBackfill } from "./engine/acceleration-playbook";
import { buildDemandKeywords, buildLandingMockup } from "./engine/proposal-visuals";
import { mergeProposalContent, isRichProposalSection } from "./engine/merge-proposal-content";
import { getR1CommercialConfig } from "./pricing/commercial-defaults.server";
import { applyAccelerationEnhancements } from "./pricing/r1-pricing";
import * as repo from "./repository.server";
import { briefToProposalContent, type Proposal, type ProposalContent, type ProposalPresentationOutcome } from "./types";

function injectCommercialIntoContent(
  content: ProposalContent,
  config: Awaited<ReturnType<typeof getR1CommercialConfig>>,
): ProposalContent {
  return applyAccelerationEnhancements(content, {
    commercial: config.commercial,
    pricing: config.pricing,
    simulator: config.simulator,
    whatsappPhone: config.whatsappPhone || undefined,
  });
}

export async function enrichProposalForDisplay(proposal: Proposal): Promise<Proposal> {
  const config = await getR1CommercialConfig();
  const raw = proposal.content as ProposalContent;
  let content = injectCommercialIntoContent(raw, config);
  if (!Array.isArray(content.sections)) {
    content = { ...content, sections: [] };
  }
  content = ensureAccelerationPlaybookBackfill({
    content,
    companyName: proposal.company_name,
    template: proposal.template,
  });
  const opportunitySection = content.sections.find((s) => s.key === "opportunity");

  return {
    ...proposal,
    content: {
      ...content,
      demandKeywords:
        content.demandKeywords ??
        buildDemandKeywords({
          companyName: proposal.company_name,
          opportunityText: opportunitySection?.narrative,
          bullets: opportunitySection?.bullets,
        }),
      landingMockup:
        content.landingMockup ??
        buildLandingMockup({
          companyName: proposal.company_name,
          heroTitle: content.hero.title,
          heroSubtitle: content.hero.subtitle,
        }),
    },
  };
}

function normalizeSlug(raw: string): string {
  return buildSuggestedSlug(raw);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = normalizeSlug(base) || "proposta";
  let suffix = 0;
  while (await repo.slugExists(slug)) {
    suffix += 1;
    slug = `${normalizeSlug(base)}-${suffix}`;
  }
  return slug;
}

export async function listProposals(filters?: { status?: Proposal["status"] | "all" }) {
  return repo.findProposals(filters);
}

export async function getProposal(id: string): Promise<Proposal | null> {
  const proposal = await repo.findProposalById(id);
  if (!proposal) return null;
  return enrichProposalForDisplay(proposal);
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getProposalByIdOrSlug(idOrSlug: string): Promise<Proposal | null> {
  if (UUID_RE.test(idOrSlug)) {
    return getProposal(idOrSlug);
  }
  const bySlug = await repo.findProposalBySlug(idOrSlug);
  if (!bySlug) return null;
  return enrichProposalForDisplay(bySlug);
}

export async function getPublishedProposalBySlug(slug: string): Promise<Proposal | null> {
  const proposal = await repo.findProposalBySlug(slug);
  if (!proposal || proposal.status !== "published") return null;
  return enrichProposalForDisplay(proposal);
}

export async function getProposalBySlug(slug: string): Promise<Proposal | null> {
  return repo.findProposalBySlug(slug);
}

export async function getProposalByCopilotSession(sessionId: string): Promise<Proposal | null> {
  return repo.findProposalByCopilotSession(sessionId);
}

async function loadCopilotContext(sessionId: string) {
  const row = await copilotRepo.findSessionById(sessionId);
  if (!row) throw new Error("Sessão Copilot não encontrada.");
  if (row.status !== "completed") {
    throw new Error("Proposta disponível apenas após encerrar a reunião.");
  }
  const artifact = await copilotRepo.findArtifact(sessionId);
  if (!artifact) throw new Error("Diagnóstico indisponível — reprocesse a sessão.");
  const segments = await copilotRepo.findTranscriptSegments(sessionId);
  const session = rowToSnapshot(row, segments.map(transcriptRowToSegment));
  return { row, session, artifact };
}

export async function createDraftFromCopilotSession(
  sessionId: string,
  options?: { slug?: string; enrichWithLlm?: boolean },
  _actor?: TeamMember | null,
): Promise<Proposal> {
  const existing = await repo.findProposalByCopilotSession(sessionId);
  if (existing && !options?.enrichWithLlm) return existing;

  const { row, session, artifact } = await loadCopilotContext(sessionId);

  let companyId: string | null = null;
  if (row.prospect_id) {
    const prospectRepo = await import("@/domains/prospection/repository.server");
    const prospect = await prospectRepo.findProspectById(row.prospect_id);
    companyId = prospect?.company_id ?? null;
  }

  if (options?.enrichWithLlm && existing) {
    const brief = await generateCreativeBrief({ session, artifact });
    const config = await getR1CommercialConfig();
    const generated = injectCommercialIntoContent(briefToProposalContent(brief), config);
    const previous = existing.content as ProposalContent;
    const enrichedSections = generated.sections.filter(isRichProposalSection).length;
    if (enrichedSections === 0) {
      throw new Error(
        "A IA não gerou conteúdo utilizável para a proposta. O rascunho anterior foi preservado.",
      );
    }
    const content = mergeProposalContent(previous, generated);
    const withPlaybook = ensureAccelerationPlaybookBackfill({
      content,
      companyName: brief.companyName,
      template: brief.templateArchetype,
    });
    const updated = await repo.patchProposal(existing.id, {
      title: existing.title || brief.projectTitle,
      template: brief.templateArchetype,
      creative_brief: brief,
      content: withPlaybook,
      client_name: brief.clientName,
      company_name: brief.companyName,
      company_id: companyId ?? existing.company_id,
    });
    return enrichProposalForDisplay(updated!);
  }

  if (existing) return existing;

  if (options?.enrichWithLlm) {
    const brief = await generateCreativeBrief({ session, artifact });
    const config = await getR1CommercialConfig();
    const content = injectCommercialIntoContent(briefToProposalContent(brief), config);
    const withPlaybook = ensureAccelerationPlaybookBackfill({
      content,
      companyName: brief.companyName,
      template: brief.templateArchetype,
    });
    const slug = options?.slug
      ? normalizeSlug(options.slug)
      : await uniqueSlug(brief.suggestedProjectName);
    if (await repo.slugExists(slug)) {
      throw new Error(`Slug "${slug}" já está em uso.`);
    }
    return repo.insertProposal({
      slug,
      title: brief.projectTitle,
      template: brief.templateArchetype,
      status: "draft",
      company_id: companyId,
      prospect_id: row.prospect_id,
      copilot_session_id: sessionId,
      commercial_blueprint_id: null,
      client_name: brief.clientName,
      company_name: brief.companyName,
      creative_brief: brief,
      content: withPlaybook,
    });
  }

  const config = await getR1CommercialConfig();
  const built = buildProposalContentFromArtifact({
    session,
    artifact,
    commercial: config.commercial,
    pricing: config.pricing,
    simulator: config.simulator,
    whatsappPhone: config.whatsappPhone || undefined,
  });
  const slug = options?.slug ? normalizeSlug(options.slug) : await uniqueSlug(built.slugBase);

  if (await repo.slugExists(slug)) {
    throw new Error(`Slug "${slug}" já está em uso. Escolha outro.`);
  }

  return repo.insertProposal({
    slug,
    title: built.title,
    template: built.template,
    status: "draft",
    company_id: companyId,
    prospect_id: row.prospect_id,
    copilot_session_id: sessionId,
    commercial_blueprint_id: null,
    client_name: session.meetingObjective.prospectName,
    company_name: session.meetingObjective.companyName,
    creative_brief: null,
    content: built.content,
  });
}

export async function enrichProposalFromCopilot(proposalId: string): Promise<Proposal> {
  const proposal = await repo.findProposalById(proposalId);
  if (!proposal?.copilot_session_id) {
    throw new Error("Proposta sem sessão Copilot vinculada.");
  }

  if (proposal.commercial_blueprint_id) {
    await enrichBlueprintFromCopilot(proposal.commercial_blueprint_id);
    const refreshed = await generateProposalFromBlueprint(proposal.commercial_blueprint_id);
    return enrichProposalForDisplay(refreshed);
  }

  return createDraftFromCopilotSession(proposal.copilot_session_id, { enrichWithLlm: true });
}

export async function rebuildProposalFromCopilot(proposalId: string): Promise<Proposal> {
  const proposal = await repo.findProposalById(proposalId);
  if (!proposal?.copilot_session_id) {
    throw new Error("Proposta sem sessão Copilot vinculada.");
  }

  if (proposal.commercial_blueprint_id) {
    const blueprint = await rebuildBlueprintFromCopilot(proposal.commercial_blueprint_id);
    const rendered = await generateProposalFromBlueprint(blueprint.id);
    return enrichProposalForDisplay(rendered);
  }

  const { row, session, artifact } = await loadCopilotContext(proposal.copilot_session_id);
  const config = await getR1CommercialConfig();
  const built = buildProposalContentFromArtifact({
    session,
    artifact,
    commercial: config.commercial,
    pricing: config.pricing,
    simulator: config.simulator,
    whatsappPhone: config.whatsappPhone || undefined,
  });

  const previous = proposal.content as ProposalContent;
  const content: ProposalContent = {
    ...built.content,
    pricing: previous.pricing ?? built.content.pricing,
    simulator: previous.simulator ?? built.content.simulator,
    cta: {
      ...built.content.cta,
      label: previous.cta.label,
      whatsappMessage: previous.cta.whatsappMessage,
      whatsappPhone: previous.cta.whatsappPhone ?? built.content.cta.whatsappPhone,
    },
    presentation: previous.presentation,
  };

  let companyId = proposal.company_id;
  if (!companyId && row.prospect_id) {
    const prospectRepo = await import("@/domains/prospection/repository.server");
    const prospect = await prospectRepo.findProspectById(row.prospect_id);
    companyId = prospect?.company_id ?? null;
  }

  const updated = await repo.patchProposal(proposalId, {
    title: built.title,
    template: built.template,
    content,
    client_name: session.meetingObjective.prospectName,
    company_name: session.meetingObjective.companyName,
    company_id: companyId,
  });
  if (!updated) throw new Error("Falha ao reconstruir proposta.");
  return enrichProposalForDisplay(updated);
}

export async function updateProposal(
  id: string,
  patch: {
    title?: string;
    slug?: string;
    status?: Proposal["status"];
    content?: ProposalContent;
  },
): Promise<Proposal | null> {
  const existing = await repo.findProposalById(id);
  if (!existing) return null;

  if (patch.slug && patch.slug !== existing.slug) {
    const slug = normalizeSlug(patch.slug);
    if (await repo.slugExists(slug, id)) {
      throw new Error(`Slug "${slug}" já está em uso.`);
    }
    patch.slug = slug;
  }

  const data: Partial<Proposal> = { ...patch };
  if (patch.status === "published" && existing.status !== "published") {
    data.published_at = new Date().toISOString();
  }
  if (patch.status === "draft") {
    data.published_at = null;
  }

  return repo.patchProposal(id, data);
}

export async function syncProposalFromCopilotSession(sessionId: string): Promise<Proposal | null> {
  const existing = await repo.findProposalByCopilotSession(sessionId);
  if (!existing) return null;

  const { row, session, artifact } = await loadCopilotContext(sessionId);
  const config = await getR1CommercialConfig();
  const built = buildProposalContentFromArtifact({
    session,
    artifact,
    commercial: config.commercial,
    pricing: config.pricing,
    simulator: config.simulator,
    whatsappPhone: config.whatsappPhone || undefined,
  });

  const previous = existing.content as ProposalContent;
  const merged: ProposalContent = {
    ...built.content,
    pricing: previous.pricing ?? built.content.pricing,
    simulator: previous.simulator ?? built.content.simulator,
    cta: {
      ...built.content.cta,
      label: previous.cta.label,
      whatsappMessage: previous.cta.whatsappMessage,
      whatsappPhone: previous.cta.whatsappPhone ?? built.content.cta.whatsappPhone,
    },
    presentation: previous.presentation,
  };

  let companyId = existing.company_id;
  if (!companyId && row.prospect_id) {
    const prospectRepo = await import("@/domains/prospection/repository.server");
    const prospect = await prospectRepo.findProspectById(row.prospect_id);
    companyId = prospect?.company_id ?? null;
  }

  const updated = await repo.patchProposal(existing.id, {
    title: built.title,
    template: built.template,
    content: merged,
    client_name: session.meetingObjective.prospectName,
    company_name: session.meetingObjective.companyName,
    company_id: companyId,
  });
  if (!updated) return null;
  return enrichProposalForDisplay(updated);
}

export async function saveProposalPresentation(
  id: string,
  input: {
    outcome?: ProposalPresentationOutcome;
    notes?: string;
    publishFirst?: boolean;
  },
): Promise<Proposal | null> {
  const existing = await repo.findProposalById(id);
  if (!existing) return null;

  const content = existing.content as ProposalContent;
  const nextContent: ProposalContent = {
    ...content,
    presentation: {
      ...content.presentation,
      outcome: input.outcome ?? content.presentation?.outcome,
      notes: input.notes?.trim() ?? content.presentation?.notes,
      presentedAt: new Date().toISOString(),
    },
  };

  if (input.publishFirst && existing.status === "draft") {
    return updateProposal(id, { status: "published", content: nextContent });
  }

  return updateProposal(id, { content: nextContent });
}

export async function publishProposal(id: string): Promise<Proposal | null> {
  return updateProposal(id, { status: "published" });
}

export async function archiveProposal(id: string): Promise<Proposal | null> {
  return updateProposal(id, { status: "archived" });
}

export {
  createBlueprintCore as createBlueprintFromCopilotSession,
  getBlueprintForSession,
  getBlueprint,
  approveBlueprintCore as approveBlueprint,
  generateProposalFromBlueprint,
  rebuildBlueprintFromCopilot,
  enrichBlueprintFromCopilot,
};

export async function updateBlueprint(
  id: string,
  patch: {
    status?: BlueprintStatus;
    blueprint?: CommercialBlueprintData;
    internal_notes?: string | null;
  },
) {
  return updateBlueprintCore(id, patch);
}
