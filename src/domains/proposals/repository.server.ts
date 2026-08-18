import { dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type { Proposal, ProposalStatus } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function findProposals(filters?: {
  status?: ProposalStatus | "all";
  limit?: number;
}): Promise<Proposal[]> {
  const params: Record<string, string> = {
    select: "*",
    order: "updated_at.desc",
  };
  if (filters?.status && filters.status !== "all") {
    params.status = `eq.${filters.status}`;
  }
  if (filters?.limit) params.limit = String(filters.limit);
  return dbSelect<Proposal>("proposals", encodeQuery(params));
}

export async function findProposalById(id: string): Promise<Proposal | null> {
  const rows = await dbSelect<Proposal>("proposals", encodeQuery({ select: "*", id: `eq.${id}` }));
  return rows[0] ?? null;
}

export async function findProposalBySlug(slug: string): Promise<Proposal | null> {
  const rows = await dbSelect<Proposal>(
    "proposals",
    encodeQuery({ select: "*", slug: `eq.${slug}` }),
  );
  return rows[0] ?? null;
}

export async function findProposalByCopilotSession(sessionId: string): Promise<Proposal | null> {
  const rows = await dbSelect<Proposal>(
    "proposals",
    encodeQuery({ select: "*", copilot_session_id: `eq.${sessionId}`, limit: "1" }),
  );
  return rows[0] ?? null;
}

export async function findProposalsByCopilotSessionIds(
  sessionIds: string[],
): Promise<Array<Pick<Proposal, "id" | "copilot_session_id" | "status">>> {
  if (sessionIds.length === 0) return [];
  const filter = sessionIds.join(",");
  return dbSelect<Pick<Proposal, "id" | "copilot_session_id" | "status">>(
    "proposals",
    encodeQuery({
      select: "id,copilot_session_id,status",
      copilot_session_id: `in.(${filter})`,
    }),
  );
}

export async function insertProposal(
  data: Omit<Proposal, "id" | "created_at" | "updated_at" | "published_at"> & {
    published_at?: string | null;
  },
): Promise<Proposal> {
  const [row] = await dbInsert<Proposal>("proposals", data);
  if (!row) throw new Error("Falha ao criar proposta.");
  return row;
}

export async function patchProposal(
  id: string,
  data: Partial<Omit<Proposal, "id" | "created_at" | "updated_at">>,
): Promise<Proposal | null> {
  const rows = await dbUpdate<Proposal>("proposals", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const rows = await dbSelect<{ id: string }>(
    "proposals",
    encodeQuery({ select: "id", slug: `eq.${slug}` }),
  );
  if (!rows[0]) return false;
  if (excludeId && rows[0].id === excludeId) return false;
  return true;
}
