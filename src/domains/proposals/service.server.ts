import { generateCreativeBrief } from "@/domains/copilot/engine/creative-brief.server";
import * as copilotRepo from "@/domains/copilot/meeting/repository.server";
import { rowToSnapshot, transcriptRowToSegment } from "@/domains/copilot/meeting/session-mapper";
import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import { briefToProposalContent, type Proposal, type ProposalContent } from "./types";

function normalizeSlug(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64);
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
  return repo.findProposalById(id);
}

export async function getPublishedProposalBySlug(slug: string): Promise<Proposal | null> {
  const proposal = await repo.findProposalBySlug(slug);
  if (!proposal || proposal.status !== "published") return null;
  return proposal;
}

export async function getProposalBySlug(slug: string): Promise<Proposal | null> {
  return repo.findProposalBySlug(slug);
}

export async function createDraftFromCopilotSession(
  sessionId: string,
  options?: { slug?: string },
  _actor?: TeamMember | null,
): Promise<Proposal> {
  const existing = await repo.findProposalByCopilotSession(sessionId);
  if (existing) return existing;

  const row = await copilotRepo.findSessionById(sessionId);
  if (!row) throw new Error("Sessão Copilot não encontrada.");
  if (row.status !== "completed") {
    throw new Error("Crie a proposta apenas após encerrar a reunião.");
  }

  const artifact = await copilotRepo.findArtifact(sessionId);
  if (!artifact) throw new Error("Diagnóstico indisponível — reprocesse a sessão.");

  const segments = await copilotRepo.findTranscriptSegments(sessionId);
  const session = rowToSnapshot(row, segments.map(transcriptRowToSegment));

  const brief = await generateCreativeBrief({ session, artifact });
  const content = briefToProposalContent(brief);
  const slug = options?.slug
    ? normalizeSlug(options.slug)
    : await uniqueSlug(brief.suggestedProjectName);

  if (await repo.slugExists(slug)) {
    throw new Error(`Slug "${slug}" já está em uso. Escolha outro.`);
  }

  return repo.insertProposal({
    slug,
    title: brief.projectTitle,
    template: brief.templateArchetype,
    status: "draft",
    company_id: null,
    prospect_id: row.prospect_id,
    copilot_session_id: sessionId,
    client_name: brief.clientName,
    company_name: brief.companyName,
    creative_brief: brief,
    content,
  });
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

export async function publishProposal(id: string): Promise<Proposal | null> {
  return updateProposal(id, { status: "published" });
}

export async function archiveProposal(id: string): Promise<Proposal | null> {
  return updateProposal(id, { status: "archived" });
}
