import { randomUUID } from "node:crypto";
import * as events from "./copilot-domain-events.server";
import {
  generateMeetingSummary,
  generateNarratorTurn,
  generateWelcomeMessage,
} from "./engine/copilot-narrator";
import { extractEvidenceFromText } from "./engine/evidence-extractor";
import {
  resolveEffectiveSpeaker,
  isLikelyConsultantQuestion,
} from "./engine/conversation-intelligence";
import {
  analyzeTranscriptSegment,
  buildTranscriptSegment,
  createCopilotSession,
} from "./engine/session-processor";
import { extractFromText } from "./engine/rule-based-extractor";
import { isSubstantiveSegment } from "./engine/meeting-phase";
import { getObjectiveByKey } from "./knowledge";
import { upsertEvidence } from "./engine/diagnostic-engine";
import { buildMeetingArtifact } from "./meeting/artifact-builder";
import * as repo from "./meeting/repository.server";
import {
  rowToSnapshot,
  snapshotToRowPatch,
  transcriptRowToSegment,
} from "./meeting/session-mapper";
import type { CopilotSessionDetail } from "./meeting/types";
import type { Evidence, MeetingMode, TranscriptSegment } from "./types";
import type { TeamMember } from "@/lib/auth/types";
import { dbInsert } from "@/lib/supabase/server";
import { transcribeAudioBase64, isSttConfigured } from "@/lib/llm/openrouter-stt.server";

export async function startSession(
  input: {
    prospectName: string;
    companyName: string;
    prospectId?: string | null;
    mode?: MeetingMode;
  },
  actor: TeamMember | null,
): Promise<CopilotSessionDetail> {
  const snapshot = createCopilotSession({
    prospectName: input.prospectName,
    companyName: input.companyName,
    mode: input.mode,
  });

  const sessionId = randomUUID();
  snapshot.id = sessionId;

  let meetingId: string | null = null;
  if (input.prospectId) {
    const [meeting] = await dbInsert<{ id: string }>("meetings", {
      id: randomUUID(),
      title: snapshot.meetingObjective.title,
      starts_at: new Date().toISOString(),
      prospect_id: input.prospectId,
      company_id: null,
      mode: input.mode ?? "discovery_qualification",
      objective: snapshot.meetingObjective.purpose,
      status: "live",
      attendees: [],
      notes: null,
    });
    meetingId = meeting?.id ?? null;
  }

  const welcome = await generateWelcomeMessage(snapshot);

  const row = await repo.insertSession({
    id: sessionId,
    prospect_id: input.prospectId ?? null,
    meeting_id: meetingId,
    mode: input.mode ?? "discovery_qualification",
    status: "live",
    meeting_objective: snapshot.meetingObjective,
    diagnostic_state: snapshot.diagnosticState,
    business_profile: snapshot.businessProfile,
    coverage: snapshot.coverage,
    proposal_readiness: snapshot.proposalReadiness,
    current_thread: null,
    latest_insight: null,
    orb_state: snapshot.orbState,
    suppress_suggestion: false,
    suppress_reason: null,
    inconsistencies: [],
    elapsed_seconds: 0,
    narrator_messages: [welcome],
    meeting_phase: "opening",
    copilot_action: "observe",
    last_intelligence_at: null,
    started_at: new Date().toISOString(),
  });

  await events.emitCopilotSessionStarted({
    sessionId: row.id,
    prospectId: input.prospectId ?? null,
    companyName: input.companyName,
    actorId: actor,
  });

  return {
    session: rowToSnapshot(row, []),
    prospectId: input.prospectId ?? null,
    status: "live",
    artifact: null,
  };
}

export async function getSession(sessionId: string): Promise<CopilotSessionDetail | null> {
  const row = await repo.findSessionById(sessionId);
  if (!row) return null;

  const segments = await repo.findTranscriptSegments(sessionId);
  const artifact = await repo.findArtifact(sessionId);

  if (artifact && !artifact.transcript_segments) {
    artifact.transcript_segments = [];
  }

  const snapshot = rowToSnapshot(
    row,
    segments.map(transcriptRowToSegment),
  );

  const { resolveNextBestQuestion } = await import("./engine/next-question");
  const { getActiveDomain } = await import("./engine/diagnostic-engine");
  const { actionPermitsSuggestion } = await import("./engine/copilot-action");
  const activeDomain = getActiveDomain(snapshot.diagnosticState);
  const candidate = snapshot.suppressSuggestion
    ? null
    : resolveNextBestQuestion(snapshot.diagnosticState, {
        activeDomain,
        meetingPhase: snapshot.meetingPhase,
      });
  snapshot.suggestion =
    candidate && actionPermitsSuggestion(snapshot.copilotAction) ? candidate : null;

  return {
    session: snapshot,
    prospectId: row.prospect_id,
    status: row.status,
    artifact,
  };
}

/** Fase 2 — persiste segmento bruto sem rodar inteligência. */
export async function appendSegment(
  sessionId: string,
  input: {
    segmentId?: string;
    speaker: TranscriptSegment["speaker"];
    text: string;
    source?: "manual_paste" | "live_stt";
    startedAt?: string;
    confidence?: number;
    speakerConfidence?: number;
  },
): Promise<{ segment: TranscriptSegment; detail: CopilotSessionDetail }> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (detail.status !== "live") throw new Error("Sessão já encerrada.");

  const sequence = (await repo.countTranscriptSegments(sessionId)) + 1;
  const segment = buildTranscriptSegment({
    id: input.segmentId ?? randomUUID(),
    speaker: input.speaker,
    text: input.text,
    startedAt: input.startedAt,
    endedAt: new Date().toISOString(),
    sequence,
    confidence: input.confidence,
    speakerConfidence: input.speakerConfidence,
    source: input.source,
    suggestedQuestion: detail.session.suggestion?.suggestedQuestion,
  });

  await repo.insertTranscriptSegment({
    id: segment.id,
    session_id: sessionId,
    speaker: segment.speaker,
    text: segment.text,
    segment_kind: segment.kind ?? null,
    source: input.source ?? "manual_paste",
    sequence,
    started_at: segment.startedAt,
    ended_at: segment.endedAt ?? null,
    confidence: input.confidence ?? null,
    speaker_confidence: input.speakerConfidence ?? null,
  });

  const updated = await getSession(sessionId);
  if (!updated) throw new Error("Sessão não encontrada após append.");
  return { segment, detail: updated };
}

/** Fase 2 — analisa um segmento já persistido (intelligence layer). */
export async function analyzeSegment(
  sessionId: string,
  segmentId: string,
  actor: TeamMember | null,
): Promise<CopilotSessionDetail> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (detail.status !== "live") throw new Error("Sessão já encerrada.");

  const segment = detail.session.transcript.find((s) => s.id === segmentId);
  if (!segment) throw new Error("Segmento não encontrado.");
  if (segment.analyzedAt) return detail;

  let extractions = undefined;
  const effectiveSpeaker = resolveEffectiveSpeaker(segment);
  const canTryExtract =
    (effectiveSpeaker === "prospect" ||
      (effectiveSpeaker === "unknown" && isSubstantiveSegment(segment))) &&
    !isLikelyConsultantQuestion(segment.text);

  if (canTryExtract) {
    const rules = extractFromText(segment.text);
    extractions =
      rules.length > 0
        ? rules
        : segment.text.length >= 40
          ? await extractEvidenceFromText(segment.text)
          : [];
  }

  const result = analyzeTranscriptSegment(detail.session, segment, extractions);

  const narratorMessage = await generateNarratorTurn({
    snapshot: result.snapshot,
    lastSegment: segment,
    capturedObjectives: result.capturedObjectives,
    newInsights: result.newInsights,
    action: result.actionDecision?.action,
  });

  const narratorMessages = narratorMessage
    ? [...detail.session.narratorMessages, narratorMessage]
    : detail.session.narratorMessages;
  result.snapshot.narratorMessages = narratorMessages;

  await repo.markSegmentAnalyzed(segmentId);
  await repo.updateSession(sessionId, {
    ...snapshotToRowPatch(result.snapshot),
    narrator_messages: narratorMessages,
    last_intelligence_at: new Date().toISOString(),
    status: "live",
  });

  for (const key of result.capturedObjectives) {
    const obj = getObjectiveByKey(key);
    await events.emitCopilotDiscoveryCaptured({
      sessionId,
      prospectId: detail.prospectId,
      objectiveKey: key,
      label: obj?.label ?? key,
      actorId: actor,
      discriminator: key,
    });
  }

  if (result.newInsights.some((i) => i.type === "warning")) {
    const warn = result.newInsights.find((i) => i.type === "warning");
    if (warn) {
      await events.emitCopilotInconsistency({
        sessionId,
        prospectId: detail.prospectId,
        label: warn.body,
        actorId: actor,
        discriminator: warn.objectiveKey ?? Date.now().toString(),
      });
    }
  }

  return (await getSession(sessionId))!;
}

/** Compat — append + analyze em sequência. */
export async function addTurn(
  sessionId: string,
  input: {
    speaker: TranscriptSegment["speaker"];
    text: string;
    source?: "manual_paste" | "live_stt";
    segmentId?: string;
  },
  actor: TeamMember | null,
): Promise<CopilotSessionDetail> {
  const { segment } = await appendSegment(sessionId, input);
  return analyzeSegment(sessionId, segment.id, actor);
}

export async function endSession(
  sessionId: string,
  actor: TeamMember | null,
): Promise<CopilotSessionDetail> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");

  const llmSummary = await generateMeetingSummary(detail.session);
  const artifactData = buildMeetingArtifact(detail.session, llmSummary);
  const artifact = await repo.upsertArtifact(artifactData);

  await repo.updateSession(sessionId, {
    status: "completed",
    ended_at: new Date().toISOString(),
    orb_state: "idle",
    meeting_phase: "closing",
  });

  await events.emitCopilotSessionCompleted({
    sessionId,
    prospectId: detail.prospectId,
    companyName: detail.session.meetingObjective.companyName,
    overallCoverage: detail.session.overallCoverage,
    proposalStatus: detail.session.proposalReadiness.status,
    actorId: actor,
  });

  return (await getSession(sessionId))!;
}

export async function overrideEvidence(
  sessionId: string,
  input: { objectiveKey: string; value: string },
  actor: TeamMember,
): Promise<CopilotSessionDetail> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");

  const evidence: Evidence = {
    value: input.value,
    confidence: "high",
    source: "human_verified",
    kind: "fact",
    quote: `Correção manual: ${input.value}`,
    capturedAt: new Date().toISOString(),
  };

  const diagnosticState = upsertEvidence(
    detail.session.diagnosticState,
    input.objectiveKey,
    evidence,
  );

  const { buildBusinessProfile } = await import("./engine/business-profile-builder");
  const { computeDomainCoverage, computeProposalReadiness } =
    await import("./engine/diagnostic-engine");

  const businessProfile = buildBusinessProfile(diagnosticState, {
    companyName: detail.session.meetingObjective.companyName,
    contactName: detail.session.meetingObjective.prospectName,
  });
  const coverage = computeDomainCoverage(diagnosticState);
  const proposalReadiness = computeProposalReadiness(diagnosticState);

  await repo.updateSession(sessionId, {
    diagnostic_state: diagnosticState,
    business_profile: businessProfile,
    coverage,
    proposal_readiness: proposalReadiness,
  });

  const obj = getObjectiveByKey(input.objectiveKey);
  await events.emitCopilotEvidenceVerified({
    sessionId,
    prospectId: detail.prospectId,
    objectiveKey: input.objectiveKey,
    label: obj?.label ?? input.objectiveKey,
    actor: actor,
  });

  return (await getSession(sessionId))!;
}

export async function transcribeAudioChunk(input: {
  audioBase64: string;
  format: string;
}): Promise<{ text: string } | null> {
  if (!isSttConfigured()) {
    throw new Error("OPENROUTER_API_KEY não configurada — STT indisponível.");
  }
  const text = await transcribeAudioBase64(input.audioBase64, input.format);
  if (!text) return null;
  return { text };
}

export async function listRecentSessions(limit = 25) {
  const rows = await repo.findRecentSessions(limit);
  return rows.map((row) => ({
    id: row.id,
    prospectId: row.prospect_id,
    status: row.status,
    title: row.meeting_objective.title,
    prospectName: row.meeting_objective.prospectName,
    companyName: row.meeting_objective.companyName,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    elapsedSeconds: row.elapsed_seconds,
  }));
}

export async function listProspectSessions(prospectId: string) {
  return repo.findSessionsByProspect(prospectId);
}
