import * as companyRepo from "@/domains/companies/repository.server";
import { getSegmentCopilot } from "@/domains/prospection/copilot/data";
import {
  buildConversationContext,
  mergeDiscovery,
  resolveNextObjective,
  usesConversationGraph,
} from "@/domains/prospection/copilot/conversation-engine";
import type { SaloesDiscoveries } from "@/domains/prospection/copilot/graph/types";
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
import type { LinkType } from "@/domains/companies/types";
import type {
  ChecklistStatus,
  CommercialScript,
  InteractionType,
  Prospect,
  ProspectStatus,
  ProspectionMetrics,
  ScriptType,
} from "./types";
import { CHECKLIST_ITEMS, OPPORTUNITY_ITEMS } from "./types";

type PresenceLinkType = Extract<
  LinkType,
  "website" | "instagram" | "facebook" | "tiktok" | "youtube" | "google_business"
>;

const PRESENCE_LINK_LABELS: Record<PresenceLinkType, string> = {
  website: "Website",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  google_business: "Google Meu Negócio",
};

function stripHandle(value: string): string {
  return value.trim().replace(/^@/, "");
}

function looksLikeUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

/** Normaliza website: URL completa ou domínio → https://… */
export function normalizeWebsiteUrl(value: string | null | undefined): string | null {
  const v = value?.trim();
  if (!v) return null;
  if (looksLikeUrl(v)) return v;
  return `https://${v}`;
}

/** Instagram: URL ou @handle / handle → https://instagram.com/x */
export function normalizeInstagramUrl(value: string | null | undefined): string | null {
  const v = value?.trim();
  if (!v) return null;
  if (looksLikeUrl(v)) return v;
  return `https://instagram.com/${stripHandle(v)}`;
}

/** Facebook: URL ou handle → https://facebook.com/x */
export function normalizeFacebookUrl(value: string | null | undefined): string | null {
  const v = value?.trim();
  if (!v) return null;
  if (looksLikeUrl(v)) return v;
  return `https://facebook.com/${stripHandle(v)}`;
}

/** TikTok: URL ou handle → https://tiktok.com/@x */
export function normalizeTiktokUrl(value: string | null | undefined): string | null {
  const v = value?.trim();
  if (!v) return null;
  if (looksLikeUrl(v)) return v;
  return `https://tiktok.com/@${stripHandle(v)}`;
}

/** YouTube: URL ou @handle / handle → https://youtube.com/@x */
export function normalizeYoutubeUrl(value: string | null | undefined): string | null {
  const v = value?.trim();
  if (!v) return null;
  if (looksLikeUrl(v)) return v;
  const handle = stripHandle(v);
  return `https://youtube.com/@${handle}`;
}

function presenceLinksFromProspect(input: {
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  google_maps_url?: string | null;
}): Partial<Record<PresenceLinkType, string>> {
  const links: Partial<Record<PresenceLinkType, string>> = {};
  const website = normalizeWebsiteUrl(input.website);
  const instagram = normalizeInstagramUrl(input.instagram);
  const facebook = normalizeFacebookUrl(input.facebook);
  const tiktok = normalizeTiktokUrl(input.tiktok);
  const youtube = normalizeYoutubeUrl(input.youtube);
  const gmb = input.google_maps_url?.trim();
  if (website) links.website = website;
  if (instagram) links.instagram = instagram;
  if (facebook) links.facebook = facebook;
  if (tiktok) links.tiktok = tiktok;
  if (youtube) links.youtube = youtube;
  if (gmb) links.google_business = gmb;
  return links;
}

async function ensureCompanyPresenceLinks(
  companyId: string,
  links: Partial<Record<PresenceLinkType, string | null | undefined>>,
) {
  const existing = await companyRepo.findCompanyLinks(companyId);
  const existingTypes = new Set(existing.map((l) => l.type));

  for (const [type, url] of Object.entries(links) as [PresenceLinkType, string | null | undefined][]) {
    const trimmed = url?.trim();
    if (!trimmed || existingTypes.has(type)) continue;
    await companyRepo.insertCompanyLink({
      company_id: companyId,
      type,
      label: PRESENCE_LINK_LABELS[type],
      url: trimmed,
    });
    existingTypes.add(type);
  }
}

function buildConversionNotes(
  prospect: Prospect,
  checklist: { item_key: string; status: string }[],
  opportunities: { opportunity_key: string; checked: boolean }[],
): string {
  const checklistSummary = checklist
    .filter((c) => c.status !== "yes")
    .map((c) => `${c.item_key}: ${c.status}`)
    .join(", ");

  const oppsSummary = opportunities
    .filter((o) => o.checked)
    .map((o) => o.opportunity_key)
    .join(", ");

  return [
    prospect.notes,
    checklistSummary && `Diagnóstico pendente: ${checklistSummary}`,
    oppsSummary && `Oportunidades: ${oppsSummary}`,
    `Convertido da Prospecção em ${new Date().toLocaleDateString("pt-BR")}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

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
    facebook?: string;
    tiktok?: string;
    youtube?: string;
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

  const name = input.name.trim();
  const city = input.city?.trim() || null;
  const state = input.state?.trim() || null;
  const whatsapp = input.whatsapp?.trim() || null;
  const website = input.website?.trim() || null;
  const instagram = input.instagram?.trim() || null;
  const facebook = input.facebook?.trim() || null;
  const tiktok = input.tiktok?.trim() || null;
  const youtube = input.youtube?.trim() || null;
  const googleMapsUrl = input.googleMapsUrl?.trim() || null;
  const notes = input.notes?.trim() || null;
  const source = input.source?.trim() || null;

  const company = await companyRepo.insertCompany({
    name,
    legal_name: null,
    cnpj: null,
    city,
    city_state: state,
    responsible_name: null,
    whatsapp: whatsapp || input.phone?.trim() || null,
    email: null,
    website,
    origin: source ?? "prospeccao",
    segment: segmentLabel,
    stage: "lead",
    notes,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    template_slug: null,
    microvertical_id: null,
    match_level: null,
  });

  await ensureCompanyPresenceLinks(
    company.id,
    presenceLinksFromProspect({
      website,
      instagram,
      facebook,
      tiktok,
      youtube,
      google_maps_url: googleMapsUrl,
    }),
  );

  const prospect = await repo.insertProspect({
    name,
    category: segmentLabel,
    segment_slug: slug,
    city,
    state,
    phone: input.phone?.trim() || null,
    whatsapp,
    instagram,
    facebook,
    tiktok,
    youtube,
    website,
    google_maps_url: googleMapsUrl,
    owner_id: input.ownerId ?? null,
    source,
    notes,
    status: "novo",
    tags: input.tags ?? [],
    next_action: null,
    next_action_date: null,
    company_id: company.id,
    converted_at: null,
    last_interaction_at: now,
  });

  await companyRepo.insertActivity({
    company_id: company.id,
    type: "system",
    title: "Empresa criada a partir de prospect",
    body: `Lead "${prospect.name}" criado automaticamente na prospecção.`,
    metadata: { prospectId: prospect.id },
    author_id: authorId,
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
    facebook: string;
    tiktok: string;
    youtube: string;
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
  if (patch.facebook !== undefined) data.facebook = patch.facebook.trim() || null;
  if (patch.tiktok !== undefined) data.tiktok = patch.tiktok.trim() || null;
  if (patch.youtube !== undefined) data.youtube = patch.youtube.trim() || null;
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
  if (!prospect) return null;

  if (prospect.company_id) {
    const companyPatch: Parameters<typeof companyRepo.patchCompany>[1] = {};
    if (patch.name !== undefined) companyPatch.name = prospect.name;
    if (patch.city !== undefined) companyPatch.city = prospect.city;
    if (patch.state !== undefined) companyPatch.city_state = prospect.state;
    if (patch.website !== undefined) companyPatch.website = prospect.website;
    if (patch.notes !== undefined) companyPatch.notes = prospect.notes;
    if (patch.whatsapp !== undefined || patch.phone !== undefined) {
      companyPatch.whatsapp = prospect.whatsapp ?? prospect.phone;
    }
    if (Object.keys(companyPatch).length > 0) {
      await companyRepo.patchCompany(prospect.company_id, companyPatch);
    }

    const linkUpdates: Partial<Record<PresenceLinkType, string | null>> = {};
    if (patch.website !== undefined) {
      linkUpdates.website = normalizeWebsiteUrl(prospect.website);
    }
    if (patch.instagram !== undefined) {
      linkUpdates.instagram = normalizeInstagramUrl(prospect.instagram);
    }
    if (patch.facebook !== undefined) {
      linkUpdates.facebook = normalizeFacebookUrl(prospect.facebook);
    }
    if (patch.tiktok !== undefined) {
      linkUpdates.tiktok = normalizeTiktokUrl(prospect.tiktok);
    }
    if (patch.youtube !== undefined) {
      linkUpdates.youtube = normalizeYoutubeUrl(prospect.youtube);
    }
    if (patch.googleMapsUrl !== undefined) {
      linkUpdates.google_business = prospect.google_maps_url;
    }
    if (Object.keys(linkUpdates).length > 0) {
      await ensureCompanyPresenceLinks(prospect.company_id, linkUpdates);
    }
  }

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

  if (prospect.converted_at || prospect.status === "cliente") {
    if (prospect.company_id) {
      return { companyId: prospect.company_id, alreadyConverted: true };
    }
  }

  const notes = buildConversionNotes(prospect, checklist, opportunities);
  const now = new Date().toISOString();
  const presence = presenceLinksFromProspect(prospect);

  // Prospect already linked to a lead company — promote to ativo
  if (prospect.company_id) {
    const companyId = prospect.company_id;
    await companyRepo.patchCompany(companyId, {
      stage: "ativo",
      notes,
    });

    await ensureCompanyPresenceLinks(companyId, presence);

    await companyRepo.insertActivity({
      company_id: companyId,
      type: "system",
      title: "Convertido da Prospecção",
      body: `Prospect "${prospect.name}" convertido em cliente ativo.`,
      metadata: { prospectId: prospect.id },
      author_id: authorId,
    });

    await repo.patchProspect(id, {
      status: "cliente",
      converted_at: now,
      last_interaction_at: now,
    });

    await repo.insertInteraction({
      prospect_id: id,
      type: "converted",
      title: "Cliente convertido",
      body: `Empresa vinculada promovida a cliente ativo.`,
      direction: "internal",
      occurred_at: now,
      author_id: authorId,
    });

    return { companyId, alreadyConverted: false };
  }

  // Legacy: no company_id — create company as before
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
    notes,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    template_slug: null,
    microvertical_id: null,
    match_level: null,
  });

  await ensureCompanyPresenceLinks(company.id, presence);

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
  const clients = prospects.filter((p) => p.status === "cliente" || Boolean(p.converted_at)).length;
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
    current_objective_key: null,
    discoveries: {},
    updated_at: new Date().toISOString(),
  };
}

function normalizeAssistantState(
  state: Partial<ProspectAssistantState> & { prospect_id: string },
): ProspectAssistantState {
  return {
    ...defaultAssistantState(state.prospect_id),
    ...state,
    discoveries: state.discoveries ?? {},
    current_objective_key: state.current_objective_key ?? null,
  };
}

export async function getCopilotBundle(prospectId: string): Promise<CopilotBundle | null> {
  const prospect = await repo.findProspectById(prospectId);
  if (!prospect) return null;

  const slug = resolveSegmentSlug(prospect.segment_slug, prospect.category);
  const segment = getSegmentCopilot(slug);

  let state: ProspectAssistantState;
  try {
    const raw = await repo.findAssistantState(prospectId);
    state = raw ? normalizeAssistantState(raw) : defaultAssistantState(prospectId);
  } catch {
    state = defaultAssistantState(prospectId);
  }

  const bundle: CopilotBundle = {
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

  if (usesConversationGraph(slug)) {
    bundle.conversation = buildConversationContext(state, {
      name: prospect.name,
      city: prospect.city,
    });
  }

  return bundle;
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
  currentObjectiveKey?: string | null;
  discoveries?: Record<string, string>;
  registerDiscovery?: {
    discoveryKey: string;
    discoveryValue: string;
    inboundReplyText?: string;
  };
}): Promise<ProspectAssistantState> {
  const existingRaw =
    (await repo.findAssistantState(input.prospectId).catch(() => null)) ??
    defaultAssistantState(input.prospectId);
  const existing = normalizeAssistantState(existingRaw);

  let discoveries = input.discoveries ?? existing.discoveries;
  let step = input.step ?? existing.step;
  let currentObjectiveKey =
    input.currentObjectiveKey !== undefined
      ? input.currentObjectiveKey
      : existing.current_objective_key;

  if (input.registerDiscovery) {
    const { discoveryKey, discoveryValue, inboundReplyText } = input.registerDiscovery;
    discoveries = mergeDiscovery(
      discoveries as SaloesDiscoveries,
      discoveryKey as keyof SaloesDiscoveries,
      discoveryValue,
    ) as Record<string, string>;
    const resolved = resolveNextObjective(discoveries as SaloesDiscoveries);
    currentObjectiveKey = resolved.key;
    step =
      resolved.key === "close_respectful"
        ? "conversation"
        : resolved.step === "raise_one"
          ? "raise_one"
          : resolved.step === "done"
            ? "done"
            : "conversation";

    if (inboundReplyText?.trim()) {
      await addInteraction(
        input.prospectId,
        {
          type: "message_received",
          title: "Resposta recebida",
          body: inboundReplyText.trim(),
          direction: "in",
        },
        null,
      );
    }
  }

  const next: Omit<ProspectAssistantState, "updated_at"> = {
    prospect_id: input.prospectId,
    step,
    selected_observations: input.selectedObservations ?? existing.selected_observations,
    selected_opening_id:
      input.selectedOpeningId !== undefined ? input.selectedOpeningId : existing.selected_opening_id,
    opening_text: input.openingText !== undefined ? input.openingText : existing.opening_text,
    opening_used: input.openingUsed ?? existing.opening_used,
    reply_status: input.replyStatus !== undefined ? input.replyStatus : existing.reply_status,
    response_state_key:
      input.responseStateKey !== undefined ? input.responseStateKey : existing.response_state_key,
    current_objective_key: currentObjectiveKey,
    discoveries,
  };

  try {
    return normalizeAssistantState(await repo.upsertAssistantState(next));
  } catch {
    return normalizeAssistantState({ ...next, updated_at: new Date().toISOString() });
  }
}

export { STATUS_LABELS } from "./types";
