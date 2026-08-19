import { generateCreativeBrief } from "@/domains/copilot/engine/creative-brief.server";
import * as copilotRepo from "@/domains/copilot/meeting/repository.server";
import { rowToSnapshot, transcriptRowToSegment } from "@/domains/copilot/meeting/session-mapper";
import { buildBlueprintFromArtifact } from "./blueprint-from-artifact";
import { countBlueprintFields } from "./evidence-rules";
import { mergeBlueprintData, mergeBlueprintSuggestions, bumpVersion } from "./merge-blueprint-data";
import * as blueprintRepo from "./repository.server";
import { renderProposalFromBlueprint } from "./render-proposal-from-blueprint";
import type {
  BlueprintReadiness,
  BlueprintStatus,
  CommercialBlueprint,
  CommercialBlueprintData,
} from "./types";
import { rowToBlueprint } from "./types";
import * as proposalRepo from "../repository.server";
import { buildSuggestedSlug } from "../engine/artifact-to-proposal";
import { getR1CommercialConfig } from "../pricing/commercial-defaults.server";
import type { Proposal } from "../types";

async function loadCopilotContext(sessionId: string) {
  const row = await copilotRepo.findSessionById(sessionId);
  if (!row) throw new Error("Sessão Copilot não encontrada.");
  if (row.status !== "completed") {
    throw new Error("Blueprint disponível apenas após encerrar a reunião.");
  }
  const artifact = await copilotRepo.findArtifact(sessionId);
  if (!artifact) throw new Error("Diagnóstico indisponível — reprocesse a sessão.");
  const segments = await copilotRepo.findTranscriptSegments(sessionId);
  const session = rowToSnapshot(row, segments.map(transcriptRowToSegment));
  return { row, session, artifact };
}

function recomputeReadiness(
  session: Awaited<ReturnType<typeof loadCopilotContext>>["session"],
  artifact: Awaited<ReturnType<typeof loadCopilotContext>>["artifact"],
  data: CommercialBlueprintData,
): BlueprintReadiness {
  const { total, approved } = countBlueprintFields(data);
  return {
    coveragePercent: session.overallCoverage,
    knowledgeDepth: session.knowledgeDepth,
    unknownsCount: artifact.unknowns?.length ?? 0,
    approvedFieldsCount: approved,
    totalFieldsCount: total,
    modulesSelected: data.modules.length,
    criticalAssumptionsPending: data.assumptions.filter((a) => a.critical && !a.approved).length,
  };
}

function normalizeSlug(raw: string): string {
  return buildSuggestedSlug(raw);
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = normalizeSlug(base) || "proposta";
  let suffix = 0;
  while (await proposalRepo.slugExists(slug)) {
    suffix += 1;
    slug = `${normalizeSlug(base)}-${suffix}`;
  }
  return slug;
}

export async function getBlueprintForSession(sessionId: string): Promise<CommercialBlueprint | null> {
  return blueprintRepo.findLatestBlueprintBySessionId(sessionId);
}

export async function getBlueprint(id: string): Promise<CommercialBlueprint | null> {
  return blueprintRepo.findBlueprintById(id);
}

export async function createBlueprintFromCopilotSession(
  sessionId: string,
): Promise<CommercialBlueprint> {
  const existing = await blueprintRepo.findEditableBlueprintBySessionId(sessionId);
  if (existing) return existing;

  const { session, artifact } = await loadCopilotContext(sessionId);
  const config = await getR1CommercialConfig();
  const built = buildBlueprintFromArtifact({
    session,
    artifact,
    commercial: config.commercial,
  });

  return blueprintRepo.insertBlueprint({
    copilot_session_id: sessionId,
    company_name: built.companyName,
    client_name: built.clientName,
    archetype: built.archetype,
    blueprint: built.data,
    readiness: built.readiness,
    internal_notes: built.internalNotes,
  });
}

export async function updateBlueprint(
  id: string,
  patch: {
    status?: BlueprintStatus;
    blueprint?: CommercialBlueprintData;
    internal_notes?: string | null;
  },
): Promise<CommercialBlueprint | null> {
  const existing = await blueprintRepo.findBlueprintById(id);
  if (!existing) return null;

  if (existing.status === "approved" && patch.blueprint) {
    const { session, artifact } = await loadCopilotContext(existing.copilot_session_id);
    return blueprintRepo.insertBlueprint({
      copilot_session_id: existing.copilot_session_id,
      proposal_id: existing.proposal_id,
      company_name: existing.company_name,
      client_name: existing.client_name,
      archetype: existing.archetype,
      status: patch.status ?? "draft",
      version: bumpVersion(existing.version),
      parent_version_id: existing.id,
      author: "human",
      blueprint: patch.blueprint,
      readiness: recomputeReadiness(session, artifact, patch.blueprint),
      internal_notes: patch.internal_notes ?? existing.internal_notes,
    });
  }

  let readiness = existing.readiness;
  if (patch.blueprint) {
    const { session, artifact } = await loadCopilotContext(existing.copilot_session_id);
    readiness = recomputeReadiness(session, artifact, patch.blueprint);
  }

  return blueprintRepo.patchBlueprint(id, {
    status: patch.status,
    blueprint: patch.blueprint,
    readiness,
    internal_notes: patch.internal_notes,
  });
}

export async function generateProposalFromBlueprint(blueprintId: string): Promise<Proposal> {
  const blueprint = await blueprintRepo.findBlueprintById(blueprintId);
  if (!blueprint) throw new Error("Blueprint não encontrado.");

  const { row, session, artifact } = await loadCopilotContext(blueprint.copilot_session_id);
  const config = await getR1CommercialConfig();
  const rendered = renderProposalFromBlueprint({
    blueprint,
    commercial: config.commercial,
    pricing: config.pricing,
    simulator: config.simulator,
    whatsappPhone: config.whatsappPhone || undefined,
    session,
    artifact,
  });

  let companyId: string | null = null;
  if (row.prospect_id) {
    const prospectRepo = await import("@/domains/prospection/repository.server");
    const prospect = await prospectRepo.findProspectById(row.prospect_id);
    companyId = prospect?.company_id ?? null;
  }

  const existingProposal = blueprint.proposal_id
    ? await proposalRepo.findProposalById(blueprint.proposal_id)
    : await proposalRepo.findProposalByCopilotSession(blueprint.copilot_session_id);

  if (existingProposal) {
    const updated = await proposalRepo.patchProposal(existingProposal.id, {
      title: rendered.title,
      template: rendered.template,
      content: rendered.content,
      client_name: blueprint.client_name,
      company_name: blueprint.company_name,
      company_id: companyId ?? existingProposal.company_id,
      commercial_blueprint_id: blueprint.id,
    });
    if (!updated) throw new Error("Falha ao atualizar proposta.");
    if (!blueprint.proposal_id) {
      await blueprintRepo.patchBlueprint(blueprint.id, { proposal_id: updated.id });
    }
    return updated;
  }

  const slug = await uniqueSlug(rendered.slugBase);
  const proposal = await proposalRepo.insertProposal({
    slug,
    title: rendered.title,
    template: rendered.template,
    status: "draft",
    company_id: companyId,
    prospect_id: row.prospect_id,
    copilot_session_id: blueprint.copilot_session_id,
    commercial_blueprint_id: blueprint.id,
    client_name: blueprint.client_name,
    company_name: blueprint.company_name,
    creative_brief: null,
    content: rendered.content,
  });

  await blueprintRepo.patchBlueprint(blueprint.id, { proposal_id: proposal.id });
  return proposal;
}

export async function approveBlueprint(id: string): Promise<{
  blueprint: CommercialBlueprint;
  proposal: Proposal;
}> {
  const blueprint = await blueprintRepo.findBlueprintById(id);
  if (!blueprint) throw new Error("Blueprint não encontrado.");

  const updated = await blueprintRepo.patchBlueprint(id, {
    status: "approved",
    approved_at: new Date().toISOString(),
  });
  if (!updated) throw new Error("Falha ao aprovar blueprint.");

  const proposal = await generateProposalFromBlueprint(id);
  return { blueprint: updated, proposal };
}

export async function rebuildBlueprintFromCopilot(
  blueprintId: string,
): Promise<CommercialBlueprint> {
  const existing = await blueprintRepo.findBlueprintById(blueprintId);
  if (!existing) throw new Error("Blueprint não encontrado.");

  const { session, artifact } = await loadCopilotContext(existing.copilot_session_id);
  const config = await getR1CommercialConfig();
  const built = buildBlueprintFromArtifact({
    session,
    artifact,
    commercial: config.commercial,
  });

  const merged = mergeBlueprintData(existing.data, built.data);
  const readiness = recomputeReadiness(session, artifact, merged);

  if (existing.status === "approved") {
    return blueprintRepo.insertBlueprint({
      copilot_session_id: existing.copilot_session_id,
      proposal_id: existing.proposal_id,
      company_name: built.companyName,
      client_name: built.clientName,
      archetype: built.archetype,
      status: "draft",
      version: bumpVersion(existing.version),
      parent_version_id: existing.id,
      author: "copilot",
      blueprint: merged,
      readiness,
      internal_notes: built.internalNotes,
    });
  }

  const updated = await blueprintRepo.patchBlueprint(blueprintId, {
    blueprint: merged,
    readiness,
    internal_notes: built.internalNotes,
  });
  if (!updated) throw new Error("Falha ao reconstruir blueprint.");
  return updated;
}

export async function enrichBlueprintFromCopilot(blueprintId: string): Promise<CommercialBlueprint> {
  const existing = await blueprintRepo.findBlueprintById(blueprintId);
  if (!existing) throw new Error("Blueprint não encontrado.");

  const { session, artifact } = await loadCopilotContext(existing.copilot_session_id);
  const brief = await generateCreativeBrief({ session, artifact });
  const config = await getR1CommercialConfig();
  const built = buildBlueprintFromArtifact({
    session,
    artifact,
    commercial: config.commercial,
  });

  const suggestions: Partial<CommercialBlueprintData> = {
    diagnosis: {
      problem: {
        value: String(brief.sections.find((s) => s.key === "diagnosis")?.narrative ?? built.data.diagnosis.problem.value),
        source: "inference",
        approved: false,
      },
      objective: {
        value: brief.projectTitle,
        source: "inference",
        approved: false,
      },
    },
    strategy: {
      priority1: {
        value: brief.sections.find((s) => s.key === "strategy")?.narrative ?? built.data.strategy.priority1.value,
        source: "inference",
        approved: false,
      },
      future: built.data.strategy.future,
    },
  };

  const merged = mergeBlueprintSuggestions(existing.data, suggestions);
  const readiness = recomputeReadiness(session, artifact, merged);

  const updated = await blueprintRepo.patchBlueprint(blueprintId, {
    blueprint: merged,
    readiness,
    internal_notes: `${existing.internal_notes ?? ""}\n\nEnriquecido com IA em ${new Date().toISOString()}`.trim(),
  });
  if (!updated) throw new Error("Falha ao enriquecer blueprint.");
  return updated;
}
