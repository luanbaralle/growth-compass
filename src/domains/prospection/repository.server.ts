import { dbDelete, dbInsert, dbSelect, dbUpdate, requireSupabaseConfig } from "@/lib/supabase/server";
import type {
  CommercialCase,
  CommercialObjection,
  CommercialQualification,
  CommercialScript,
  CommercialSegment,
  Prospect,
  ProspectChecklistItem,
  ProspectInteraction,
  ProspectListFilters,
  ProspectOpportunityItem,
  ProspectStatus,
  ProspectStatusCounts,
} from "./types";
import { PROSPECT_STATUSES } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function findProspects(filters: ProspectListFilters = {}): Promise<Prospect[]> {
  const params: Record<string, string> = { select: "*" };
  const sort = filters.sort ?? "last_interaction_at";
  const order = filters.order ?? "desc";
  params.order = `${sort}.${order}.nullslast`;

  if (filters.status && filters.status !== "all") {
    params.status = `eq.${filters.status}`;
  }
  if (filters.category) {
    params.category = `eq.${filters.category}`;
  }
  if (filters.city) {
    params.city = `ilike.${filters.city}`;
  }
  if (filters.source) {
    params.source = `eq.${filters.source}`;
  }
  if (filters.ownerId && filters.ownerId !== "all") {
    params.owner_id = `eq.${filters.ownerId}`;
  }

  let prospects = await dbSelect<Prospect>("prospects", encodeQuery(params));

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    prospects = prospects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.whatsapp?.includes(q) ||
        p.instagram?.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return prospects;
}

export async function findProspectsByOpportunity(opportunityKey: string): Promise<Prospect[]> {
  const rows = await dbSelect<{ prospect_id: string }>(
    "prospect_opportunities",
    encodeQuery({
      select: "prospect_id",
      opportunity_key: `eq.${opportunityKey}`,
      checked: "eq.true",
    }),
  );
  if (rows.length === 0) return [];

  const ids = [...new Set(rows.map((r) => r.prospect_id))];
  const all = await dbSelect<Prospect>("prospects", encodeQuery({ select: "*" }));
  return all.filter((p) => ids.includes(p.id));
}

export async function countProspectsByStatus(): Promise<ProspectStatusCounts> {
  const all = await dbSelect<Prospect>("prospects", encodeQuery({ select: "status" }));
  const counts: ProspectStatusCounts = {
    all: all.length,
    novo: 0,
    primeiro_contato: 0,
    respondeu: 0,
    diagnostico_enviado: 0,
    interessado: 0,
    proposta_enviada: 0,
    negociacao: 0,
    cliente: 0,
    perdido: 0,
  };
  for (const row of all) {
    if (row.status in counts) counts[row.status as ProspectStatus]++;
  }
  return counts;
}

export async function findProspectById(id: string): Promise<Prospect | null> {
  const rows = await dbSelect<Prospect>("prospects", encodeQuery({ select: "*", id: `eq.${id}` }));
  return rows[0] ?? null;
}

export async function insertProspect(
  data: Omit<Prospect, "id" | "created_at" | "updated_at">,
): Promise<Prospect> {
  const [row] = await dbInsert<Prospect>("prospects", data);
  return row;
}

export async function patchProspect(
  id: string,
  data: Partial<Omit<Prospect, "id" | "created_at">>,
): Promise<Prospect | null> {
  const rows = await dbUpdate<Prospect>("prospects", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function removeProspect(id: string): Promise<boolean> {
  await dbDelete("prospects", `id=eq.${id}`);
  return true;
}

export async function findInteractions(prospectId: string): Promise<ProspectInteraction[]> {
  return dbSelect<ProspectInteraction>(
    "prospect_interactions",
    encodeQuery({
      select: "*",
      prospect_id: `eq.${prospectId}`,
      order: "occurred_at.desc",
    }),
  );
}

export async function insertInteraction(
  data: Omit<ProspectInteraction, "id" | "created_at">,
): Promise<ProspectInteraction> {
  const [row] = await dbInsert<ProspectInteraction>("prospect_interactions", data);
  return row;
}

export async function findChecklist(prospectId: string): Promise<ProspectChecklistItem[]> {
  return dbSelect<ProspectChecklistItem>(
    "prospect_checklist",
    encodeQuery({ select: "*", prospect_id: `eq.${prospectId}` }),
  );
}

export async function upsertChecklistItem(
  prospectId: string,
  itemKey: string,
  status: ProspectChecklistItem["status"],
  notes?: string | null,
): Promise<void> {
  const { url, key } = requireSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/prospect_checklist`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      prospect_id: prospectId,
      item_key: itemKey,
      status,
      notes: notes ?? null,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`UPSERT checklist: ${res.status} ${text}`);
  }
}

export async function findOpportunities(prospectId: string): Promise<ProspectOpportunityItem[]> {
  return dbSelect<ProspectOpportunityItem>(
    "prospect_opportunities",
    encodeQuery({ select: "*", prospect_id: `eq.${prospectId}` }),
  );
}

export async function upsertOpportunity(
  prospectId: string,
  opportunityKey: string,
  checked: boolean,
): Promise<void> {
  const { url, key } = requireSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/prospect_opportunities`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      prospect_id: prospectId,
      opportunity_key: opportunityKey,
      checked,
      updated_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`UPSERT opportunity: ${res.status} ${text}`);
  }
}

export async function findUpcomingActions(limit = 10): Promise<Prospect[]> {
  const today = new Date().toISOString().slice(0, 10);
  const all = await dbSelect<Prospect>(
    "prospects",
    encodeQuery({
      select: "*",
      next_action_date: `not.is.null`,
      order: "next_action_date.asc",
    }),
  );
  return all
    .filter((p) => p.status !== "cliente" && p.status !== "perdido")
    .filter((p) => !p.next_action_date || p.next_action_date >= today || p.next_action_date <= today)
    .slice(0, limit);
}

export async function findCommercialSegments(): Promise<CommercialSegment[]> {
  return dbSelect<CommercialSegment>(
    "commercial_segments",
    encodeQuery({ select: "*", order: "sort_order.asc" }),
  );
}

export async function findSegmentScripts(segmentId: string): Promise<CommercialScript[]> {
  return dbSelect<CommercialScript>(
    "commercial_scripts",
    encodeQuery({ select: "*", segment_id: `eq.${segmentId}` }),
  );
}

export async function findSegmentObjections(segmentId: string): Promise<CommercialObjection[]> {
  return dbSelect<CommercialObjection>(
    "commercial_objections",
    encodeQuery({
      select: "*",
      segment_id: `eq.${segmentId}`,
      order: "sort_order.asc",
    }),
  );
}

export async function findSegmentQualifications(
  segmentId: string,
): Promise<CommercialQualification[]> {
  return dbSelect<CommercialQualification>(
    "commercial_qualifications",
    encodeQuery({
      select: "*",
      segment_id: `eq.${segmentId}`,
      order: "sort_order.asc",
    }),
  );
}

export async function findSegmentCase(segmentId: string): Promise<CommercialCase | null> {
  const rows = await dbSelect<CommercialCase>(
    "commercial_cases",
    encodeQuery({ select: "*", segment_id: `eq.${segmentId}` }),
  );
  return rows[0] ?? null;
}

export async function patchScript(id: string, content: string): Promise<CommercialScript | null> {
  const rows = await dbUpdate<CommercialScript>("commercial_scripts", `id=eq.${id}`, { content });
  return rows[0] ?? null;
}

export async function patchObjection(
  id: string,
  data: Partial<Pick<CommercialObjection, "objection" | "response" | "objective">>,
): Promise<CommercialObjection | null> {
  const rows = await dbUpdate<CommercialObjection>("commercial_objections", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function insertObjection(
  data: Omit<CommercialObjection, "id" | "updated_at">,
): Promise<CommercialObjection> {
  const [row] = await dbInsert<CommercialObjection>("commercial_objections", data);
  return row;
}

export async function patchQualification(
  id: string,
  question: string,
): Promise<CommercialQualification | null> {
  const rows = await dbUpdate<CommercialQualification>("commercial_qualifications", `id=eq.${id}`, {
    question,
  });
  return rows[0] ?? null;
}

export async function upsertCase(
  segmentId: string,
  caseSlug: string,
  title: string,
): Promise<void> {
  const { url, key } = requireSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/commercial_cases`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({ segment_id: segmentId, case_slug: caseSlug, title }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`UPSERT case: ${res.status} ${text}`);
  }
}

export { PROSPECT_STATUSES };
