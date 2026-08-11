import * as companyRepo from "@/domains/companies/repository.server";
import { getSegmentCopilot } from "@/domains/prospection/copilot/data";
import { resolveSegmentSlug } from "@/domains/prospection/copilot/resolve-segment";
import type {
  AssistantStep,
  CopilotBundle,
  ProspectAssistantState,
  ReplyStatus,
} from "@/domains/prospection/copilot/types";
import { SEGMENT_OPTIONS } from "@/domains/prospection/copilot/types";
import { DB_TO_SCRIPT_TYPE, LEGACY_SCRIPT_TYPES } from "@/domains/prospection/content/db-map";
import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import type {
  ChecklistStatus,
  CommercialScript,
  InteractionType,
  ProspectStatus,
  ProspectionMetrics,
  ScriptType,
} from "./types";
import { CHECKLIST_ITEMS, OPPORTUNITY_ITEMS } from "./types";

export async function listProspects(filters: Parameters<typeof repo.findProspects>[0]) {
  const [prospects, counts] = await Promise.all([
    repo.findProspects(filters),
    repo.countProspectsByStatus(),
  ]);
  return { prospects, counts };
}

export async function getProspect(id: string) {
  const prospect = await repo.findProspectById(id);
  if (!prospect) return null;

  const [interactions, checklist, opportunities] = await Promise.all([
    repo.findInteractions(id),
    repo.findChecklist(id),
    repo.findOpportunities(id),
  ]);

  return { prospect, interactions, checklist, opportunities };
}

export async function createProspect(
  input: {
    name: string;
    segmentSlug?: string;
    category?: string;
    city?: string;
    state?: string;
    phone?: string;
    whatsapp?: string;
    instagram?: string;
    website?: string;
    googleMapsUrl?: string;
    ownerId?: TeamMember;
    source?: string;
    notes?: string;
    tags?: string[];
  },
  authorId: TeamMember | null,
) {
  const now = new Date().toISOString();
  const slug = resolveSegmentSlug(input.segmentSlug, input.category);
  const segmentLabel =
    SEGMENT_OPTIONS.find((s) => s.slug === slug)?.name ?? input.category?.trim() ?? null;

  const prospect = await repo.insertProspect({
    name: input.name.trim(),
    category: segmentLabel,
    segment_slug: slug,
    city: input.city?.trim() || null,
    state: input.state?.trim() || null,
    phone: input.phone?.trim() || null,
    whatsapp: input.whatsapp?.trim() || null,
    instagram: input.instagram?.trim() || null,
    website: input.website?.trim() || null,
    google_maps_url: input.googleMapsUrl?.trim() || null,
    owner_id: input.ownerId ?? null,
    source: input.source?.trim() || null,
    notes: input.notes?.trim() || null,
    status: "novo",
    tags: input.tags ?? [],
    next_action: null,
    next_action_date: null,
    company_id: null,
    converted_at: null,
    last_interaction_at: now,
  });

  await repo.insertInteraction({
    prospect_id: prospect.id,
    type: "registered",
    title: "Empresa cadastrada",
    body: `Prospect "${prospect.name}" adicionado ao pipeline.`,
    direction: "internal",
    occurred_at: now,
    author_id: authorId,
  });

  for (const item of CHECKLIST_ITEMS) {
    await repo.upsertChecklistItem(prospect.id, item.key, "no", null);
  }
  for (const item of OPPORTUNITY_ITEMS) {
    await repo.upsertOpportunity(prospect.id, item.key, false);
  }

  return prospect;
}

export async function updateProspect(
  id: string,
  patch: Partial<{
    name: string;
    segmentSlug: string;
    category: string;
    city: string;
    state: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    website: string;
    googleMapsUrl: string;
    ownerId: TeamMember;
    source: string;
    notes: string;
    tags: string[];
    status: ProspectStatus;
    nextAction: string;
    nextActionDate: string;
  }>,
  authorId: TeamMember | null,
) {
  const existing = await repo.findProspectById(id);
  if (!existing) return null;

  const data: Record<string, unknown> = {};
  if (patch.name !== undefined) data.name = patch.name.trim();
  if (patch.segmentSlug !== undefined) {
    const slug = patch.segmentSlug.trim();
    data.segment_slug = slug || null;
    const label = SEGMENT_OPTIONS.find((s) => s.slug === slug)?.name;
    if (label) data.category = label;
  }
  if (patch.category !== undefined) data.category = patch.category.trim() || null;
  if (patch.city !== undefined) data.city = patch.city.trim() || null;
  if (patch.state !== undefined) data.state = patch.state.trim() || null;
  if (patch.phone !== undefined) data.phone = patch.phone.trim() || null;
  if (patch.whatsapp !== undefined) data.whatsapp = patch.whatsapp.trim() || null;
  if (patch.instagram !== undefined) data.instagram = patch.instagram.trim() || null;
  if (patch.website !== undefined) data.website = patch.website.trim() || null;
  if (patch.googleMapsUrl !== undefined) data.google_maps_url = patch.googleMapsUrl.trim() || null;
  if (patch.ownerId !== undefined) data.owner_id = patch.ownerId;
  if (patch.source !== undefined) data.source = patch.source.trim() || null;
  if (patch.notes !== undefined) data.notes = patch.notes.trim() || null;
  if (patch.tags !== undefined) data.tags = patch.tags;
  if (patch.nextAction !== undefined) data.next_action = patch.nextAction.trim() || null;
  if (patch.nextActionDate !== undefined) {
    data.next_action_date = patch.nextActionDate || null;
  }

  if (patch.status !== undefined && patch.status !== existing.status) {
    data.status = patch.status;
    data.last_interaction_at = new Date().toISOString();
    await repo.insertInteraction({
      prospect_id: id,
      type: "status_change",
      title: "Status alterado",
      body: `${existing.status} → ${patch.status}`,
      direction: "internal",
      occurred_at: new Date().toISOString(),
      author_id: authorId,
    });
  }

  const prospect = await repo.patchProspect(id, data);
  return prospect;
}

export async function moveProspect(
  id: string,
  status: ProspectStatus,
  authorId: TeamMember | null,
) {
  return updateProspect(id, { status }, authorId);
}

export async function deleteProspect(id: string) {
  const existing = await repo.findProspectById(id);
  if (!existing) return false;
  return repo.removeProspect(id);
}

export async function updateChecklistItem(
  prospectId: string,
  itemKey: string,
  status: ChecklistStatus,
  notes?: string,
) {
  await repo.upsertChecklistItem(prospectId, itemKey, status, notes ?? null);
  await repo.patchProspect(prospectId, { last_interaction_at: new Date().toISOString() });
}

export async function updateOpportunityItem(
  prospectId: string,
  opportunityKey: string,
  checked: boolean,
) {
  await repo.upsertOpportunity(prospectId, opportunityKey, checked);
  await repo.patchProspect(prospectId, { last_interaction_at: new Date().toISOString() });
}

export async function addInteraction(
  prospectId: string,
  input: {
    type: InteractionType;
    title: string;
    body?: string;
    direction?: "out" | "in" | "internal";
    occurredAt?: string;
  },
  authorId: TeamMember | null,
) {
  const prospect = await repo.findProspectById(prospectId);
  if (!prospect) throw new Error("Prospect não encontrado.");

  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const interaction = await repo.insertInteraction({
    prospect_id: prospectId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    direction: input.direction ?? null,
    occurred_at: occurredAt,
    author_id: authorId,
  });

  await repo.patchProspect(prospectId, { last_interaction_at: occurredAt });
  return interaction;
}

export async function convertProspectToCompany(id: string, authorId: TeamMember | null) {
  const detail = await getProspect(id);
  if (!detail) throw new Error("Prospect não encontrado.");
  const { prospect, interactions, checklist, opportunities } = detail;

  if (prospect.company_id) {
    return { companyId: prospect.company_id, alreadyConverted: true };
  }

  const checklistSummary = checklist
    .filter((c) => c.status !== "yes")
    .map((c) => `${c.item_key}: ${c.status}`)
    .join(", ");

  const oppsSummary = opportunities
    .filter((o) => o.checked)
    .map((o) => o.opportunity_key)
    .join(", ");

  const notesParts = [
    prospect.notes,
    checklistSummary && `Diagnóstico pendente: ${checklistSummary}`,
    oppsSummary && `Oportunidades: ${oppsSummary}`,
    `Convertido da Prospecção em ${new Date().toLocaleDateString("pt-BR")}`,
  ].filter(Boolean);

  const company = await companyRepo.insertCompany({
    name: prospect.name,
    legal_name: null,
    cnpj: null,
    city: prospect.city,
    city_state: prospect.state,
    responsible_name: null,
    whatsapp: prospect.whatsapp ?? prospect.phone,
    email: null,
    website: prospect.website,
    origin: prospect.source ?? "prospeccao",
    segment: prospect.category,
    stage: "ativo",
    notes: notesParts.join("\n\n"),
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    template_slug: null,
    microvertical_id: null,
    match_level: null,
  });

  await companyRepo.insertActivity({
    company_id: company.id,
    type: "system",
    title: "Convertido da Prospecção",
    body: `Prospect "${prospect.name}" convertido em cliente ativo.`,
    metadata: { prospectId: prospect.id },
    author_id: authorId,
  });

  for (const interaction of interactions) {
    await companyRepo.insertActivity({
      company_id: company.id,
      type: interaction.type === "message_sent" || interaction.type === "message_received"
        ? "note"
        : "system",
      title: interaction.title,
      body: interaction.body,
      metadata: {
        prospectInteractionId: interaction.id,
        prospectType: interaction.type,
        direction: interaction.direction,
      },
      author_id: interaction.author_id as TeamMember | null,
    });
  }

  const now = new Date().toISOString();
  await repo.patchProspect(id, {
    status: "cliente",
    company_id: company.id,
    converted_at: now,
    last_interaction_at: now,
  });

  await repo.insertInteraction({
    prospect_id: id,
    type: "converted",
    title: "Cliente convertido",
    body: `Vinculado à empresa ${company.name}.`,
    direction: "internal",
    occurred_at: now,
    author_id: authorId,
  });

  return { companyId: company.id, alreadyConverted: false };
}

export async function getProspectionMetrics(): Promise<ProspectionMetrics> {
  const [prospects, interactions, upcomingActions] = await Promise.all([
    repo.findProspects(),
    dbAllInteractions(),
    repo.findUpcomingActions(8),
  ]);

  const messagesSent = interactions.filter((i) => i.type === "message_sent").length;
  const responses = interactions.filter((i) => i.type === "message_received").length;
  const diagnosesSent = prospects.filter((p) =>
    ["diagnostico_enviado", "interessado", "proposta_enviada", "negociacao", "cliente"].includes(
      p.status,
    ),
  ).length;
  const proposals = prospects.filter((p) =>
    ["proposta_enviada", "negociacao", "cliente"].includes(p.status),
  ).length;
  const clients = prospects.filter((p) => p.status === "cliente" || p.company_id).length;
  const lost = prospects.filter((p) => p.status === "perdido").length;

  const contacted = prospects.filter((p) => p.status !== "novo").length;
  const responseRate = contacted > 0 ? Math.round((responses / contacted) * 100) : 0;
  const conversionRate =
    prospects.length > 0 ? Math.round((clients / prospects.length) * 100) : 0;

  return {
    prospected: prospects.length,
    messagesSent,
    responses,
    diagnosesSent,
    proposals,
    clients,
    lost,
    responseRate,
    conversionRate,
    upcomingActions,
  };
}

async function dbAllInteractions() {
  return repo.findProspects().then(async (prospects) => {
    const all = await Promise.all(prospects.map((p) => repo.findInteractions(p.id)));
    return all.flat();
  });
}

export async function getCommercialLibrary() {
  const segments = await repo.findCommercialSegments();
  const enriched = await Promise.all(
    segments.map(async (segment) => {
      const [rawScripts, objections, qualifications, caseItem] = await Promise.all([
        repo.findSegmentScripts(segment.id),
        repo.findSegmentObjections(segment.id),
        repo.findSegmentQualifications(segment.id),
        repo.findSegmentCase(segment.id),
      ]);
      const scripts = rawScripts
        .filter((s) => !LEGACY_SCRIPT_TYPES.includes(s.script_type as (typeof LEGACY_SCRIPT_TYPES)[number]))
        .map((s) => ({
          ...s,
          script_type: (DB_TO_SCRIPT_TYPE[s.script_type] ?? s.script_type) as ScriptType,
        })) as CommercialScript[];
      return { segment, scripts, objections, qualifications, case: caseItem };
    }),
  );
  return enriched;
}

export async function updateCommercialScript(id: string, content: string) {
  const script = await repo.patchScript(id, content);
  if (!script) throw new Error("Script não encontrado.");
  return script;
}

export async function updateCommercialObjection(
  id: string,
  data: { objection?: string; response?: string; objective?: string },
) {
  const row = await repo.patchObjection(id, data);
  if (!row) throw new Error("Objeção não encontrada.");
  return row;
}

export async function addCommercialObjection(
  segmentId: string,
  data: { objection: string; response?: string; objective?: string },
) {
  const existing = await repo.findSegmentObjections(segmentId);
  return repo.insertObjection({
    segment_id: segmentId,
    objection: data.objection,
    response: data.response ?? "",
    objective: data.objective ?? "",
    sort_order: existing.length,
  });
}

export async function updateCommercialQualification(id: string, question: string) {
  const row = await repo.patchQualification(id, question);
  if (!row) throw new Error("Pergunta não encontrada.");
  return row;
}

export async function updateCommercialCase(
  segmentId: string,
  caseSlug: string,
  title: string,
) {
  await repo.upsertCase(segmentId, caseSlug, title);
}

export async function listProspectsWithoutOpportunity(opportunityKey: string) {
  const withOpp = await repo.findProspectsByOpportunity(opportunityKey);
  const withOppIds = new Set(withOpp.map((p) => p.id));
  const all = await repo.findProspects();
  return all.filter((p) => !withOppIds.has(p.id) && p.status !== "cliente" && p.status !== "perdido");
}

function defaultAssistantState(prospectId: string): ProspectAssistantState {
  return {
    prospect_id: prospectId,
    step: "observations",
    selected_observations: [],
    selected_opening_id: null,
    opening_text: null,
    opening_used: false,
    reply_status: null,
    response_state_key: null,
    updated_at: new Date().toISOString(),
  };
}

export async function getCopilotBundle(prospectId: string): Promise<CopilotBundle | null> {
  const prospect = await repo.findProspectById(prospectId);
  if (!prospect) return null;

  const slug = resolveSegmentSlug(prospect.segment_slug, prospect.category);
  const segment = getSegmentCopilot(slug);

  let state: ProspectAssistantState;
  try {
    state = (await repo.findAssistantState(prospectId)) ?? defaultAssistantState(prospectId);
  } catch {
    state = defaultAssistantState(prospectId);
  }

  return {
    segment,
    segmentSlug: slug,
    state,
    prospect: {
      id: prospect.id,
      name: prospect.name,
      city: prospect.city,
      category: prospect.category,
      segmentSlug: prospect.segment_slug,
    },
  };
}

export async function saveAssistantState(input: {
  prospectId: string;
  step?: AssistantStep;
  selectedObservations?: string[];
  selectedOpeningId?: string | null;
  openingText?: string | null;
  openingUsed?: boolean;
  replyStatus?: ReplyStatus | null;
  responseStateKey?: string | null;
}): Promise<ProspectAssistantState> {
  const existing =
    (await repo.findAssistantState(input.prospectId).catch(() => null)) ??
    defaultAssistantState(input.prospectId);

  const next: Omit<ProspectAssistantState, "updated_at"> = {
    prospect_id: input.prospectId,
    step: input.step ?? existing.step,
    selected_observations: input.selectedObservations ?? existing.selected_observations,
    selected_opening_id:
      input.selectedOpeningId !== undefined ? input.selectedOpeningId : existing.selected_opening_id,
    opening_text: input.openingText !== undefined ? input.openingText : existing.opening_text,
    opening_used: input.openingUsed ?? existing.opening_used,
    reply_status: input.replyStatus !== undefined ? input.replyStatus : existing.reply_status,
    response_state_key:
      input.responseStateKey !== undefined ? input.responseStateKey : existing.response_state_key,
  };

  try {
    return await repo.upsertAssistantState(next);
  } catch {
    return { ...next, updated_at: new Date().toISOString() };
  }
}

export { STATUS_LABELS } from "./types";
