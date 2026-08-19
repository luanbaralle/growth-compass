import { dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type {
  BlueprintStatus,
  CommercialBlueprint,
  CommercialBlueprintData,
  CommercialBlueprintRow,
  BlueprintReadiness,
} from "./types";
import { rowToBlueprint } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function findBlueprintById(id: string): Promise<CommercialBlueprint | null> {
  const rows = await dbSelect<CommercialBlueprintRow>(
    "commercial_blueprints",
    encodeQuery({ select: "*", id: `eq.${id}` }),
  );
  const row = rows[0];
  return row ? rowToBlueprint(row) : null;
}

export async function findLatestBlueprintBySessionId(
  sessionId: string,
): Promise<CommercialBlueprint | null> {
  const rows = await dbSelect<CommercialBlueprintRow>(
    "commercial_blueprints",
    encodeQuery({
      select: "*",
      copilot_session_id: `eq.${sessionId}`,
      order: "created_at.desc",
      limit: "1",
    }),
  );
  const row = rows[0];
  return row ? rowToBlueprint(row) : null;
}

export async function findEditableBlueprintBySessionId(
  sessionId: string,
): Promise<CommercialBlueprint | null> {
  const rows = await dbSelect<CommercialBlueprintRow>(
    "commercial_blueprints",
    encodeQuery({
      select: "*",
      copilot_session_id: `eq.${sessionId}`,
      status: "in.(draft,in_review)",
      order: "created_at.desc",
      limit: "1",
    }),
  );
  const row = rows[0];
  return row ? rowToBlueprint(row) : null;
}

export async function insertBlueprint(data: {
  copilot_session_id: string;
  proposal_id?: string | null;
  company_name: string;
  client_name?: string | null;
  archetype: CommercialBlueprintRow["archetype"];
  status?: BlueprintStatus;
  version?: string;
  parent_version_id?: string | null;
  author?: CommercialBlueprintRow["author"];
  blueprint: CommercialBlueprintData;
  readiness: BlueprintReadiness;
  internal_notes?: string | null;
}): Promise<CommercialBlueprint> {
  const [row] = await dbInsert<CommercialBlueprintRow>("commercial_blueprints", {
    ...data,
    status: data.status ?? "draft",
    version: data.version ?? "0.1",
    author: data.author ?? "copilot",
    proposal_id: data.proposal_id ?? null,
    internal_notes: data.internal_notes ?? null,
  });
  if (!row) throw new Error("Falha ao criar blueprint comercial.");
  return rowToBlueprint(row);
}

export async function patchBlueprint(
  id: string,
  data: Partial<{
    proposal_id: string | null;
    status: BlueprintStatus;
    blueprint: CommercialBlueprintData;
    readiness: BlueprintReadiness;
    internal_notes: string | null;
    approved_at: string | null;
    author: CommercialBlueprintRow["author"];
  }>,
): Promise<CommercialBlueprint | null> {
  const rows = await dbUpdate<CommercialBlueprintRow>(
    "commercial_blueprints",
    `id=eq.${id}`,
    data,
  );
  const row = rows[0];
  return row ? rowToBlueprint(row) : null;
}

export async function findBlueprintByProposalId(
  proposalId: string,
): Promise<CommercialBlueprint | null> {
  const rows = await dbSelect<CommercialBlueprintRow>(
    "commercial_blueprints",
    encodeQuery({
      select: "*",
      proposal_id: `eq.${proposalId}`,
      order: "created_at.desc",
      limit: "1",
    }),
  );
  const row = rows[0];
  return row ? rowToBlueprint(row) : null;
}
