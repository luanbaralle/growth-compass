import { dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type {
  CopilotMeetingArtifact,
  CopilotSessionRow,
  CopilotTranscriptRow,
} from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function insertSession(
  row: Omit<CopilotSessionRow, "created_at" | "updated_at" | "ended_at">,
): Promise<CopilotSessionRow> {
  const [created] = await dbInsert<CopilotSessionRow>("copilot_sessions", row);
  if (!created) throw new Error("Falha ao criar sessão Copilot.");
  return created;
}

export async function findSessionById(id: string): Promise<CopilotSessionRow | null> {
  const rows = await dbSelect<CopilotSessionRow>(
    "copilot_sessions",
    encodeQuery({ select: "*", id: `eq.${id}` }),
  );
  return rows[0] ?? null;
}

export async function updateSession(
  id: string,
  patch: Partial<CopilotSessionRow>,
): Promise<CopilotSessionRow | null> {
  const rows = await dbUpdate<CopilotSessionRow>("copilot_sessions", `id=eq.${id}`, patch);
  return rows[0] ?? null;
}

export async function findSessionsByProspect(prospectId: string): Promise<CopilotSessionRow[]> {
  return dbSelect<CopilotSessionRow>(
    "copilot_sessions",
    encodeQuery({
      select: "*",
      prospect_id: `eq.${prospectId}`,
      order: "started_at.desc",
    }),
  );
}

export async function countTranscriptSegments(sessionId: string): Promise<number> {
  const rows = await findTranscriptSegments(sessionId);
  return rows.length;
}

export async function markSegmentAnalyzed(id: string): Promise<void> {
  await dbUpdate<CopilotTranscriptRow>("copilot_transcript_segments", `id=eq.${id}`, {
    analyzed_at: new Date().toISOString(),
  });
}

export async function insertTranscriptSegment(
  row: Omit<CopilotTranscriptRow, "created_at" | "analyzed_at"> & {
    analyzed_at?: string | null;
  },
): Promise<CopilotTranscriptRow> {
  const [created] = await dbInsert<CopilotTranscriptRow>("copilot_transcript_segments", row);
  if (!created) throw new Error("Falha ao salvar segmento de transcript.");
  return created;
}

export async function findTranscriptSegments(sessionId: string): Promise<CopilotTranscriptRow[]> {
  return dbSelect<CopilotTranscriptRow>(
    "copilot_transcript_segments",
    encodeQuery({
      select: "*",
      session_id: `eq.${sessionId}`,
      order: "started_at.asc",
    }),
  );
}

export async function upsertArtifact(
  artifact: Omit<CopilotMeetingArtifact, "created_at">,
): Promise<CopilotMeetingArtifact> {
  try {
    return await upsertArtifactRow(artifact, true);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("transcript_segments") && message.includes("PGRST204")) {
      console.warn(
        "[copilot] Coluna transcript_segments ausente — aplique migration 023. Salvando artifact sem snapshot.",
      );
      return upsertArtifactRow(artifact, false);
    }
    throw err;
  }
}

async function upsertArtifactRow(
  artifact: Omit<CopilotMeetingArtifact, "created_at">,
  includeTranscriptSegments: boolean,
): Promise<CopilotMeetingArtifact> {
  const payload: Record<string, unknown> = { ...artifact };
  if (!includeTranscriptSegments) {
    delete payload.transcript_segments;
  }

  const existing = await dbSelect<CopilotMeetingArtifact>(
    "copilot_meeting_artifacts",
    encodeQuery({ select: "*", session_id: `eq.${artifact.session_id}` }),
  );
  if (existing[0]) {
    const rows = await dbUpdate<CopilotMeetingArtifact>(
      "copilot_meeting_artifacts",
      `session_id=eq.${artifact.session_id}`,
      payload,
    );
    const row = rows[0]!;
    return {
      ...row,
      transcript_segments: row.transcript_segments ?? artifact.transcript_segments ?? [],
    };
  }
  const [created] = await dbInsert<CopilotMeetingArtifact>("copilot_meeting_artifacts", payload);
  if (!created) throw new Error("Falha ao salvar artifact.");
  return {
    ...created,
    transcript_segments: created.transcript_segments ?? artifact.transcript_segments ?? [],
  };
}

export async function findRecentSessions(limit = 25): Promise<CopilotSessionRow[]> {
  return dbSelect<CopilotSessionRow>(
    "copilot_sessions",
    encodeQuery({
      select: "*",
      order: "started_at.desc",
      limit: String(limit),
    }),
  );
}

export async function findArtifact(sessionId: string): Promise<CopilotMeetingArtifact | null> {
  const rows = await dbSelect<CopilotMeetingArtifact>(
    "copilot_meeting_artifacts",
    encodeQuery({ select: "*", session_id: `eq.${sessionId}` }),
  );
  return rows[0] ?? null;
}
