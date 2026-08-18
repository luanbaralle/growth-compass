import type { CopilotSessionRow, CopilotTranscriptRow } from "./types";
import type { CopilotSessionSnapshot, TranscriptSegment } from "../types";

export function rowToSnapshot(
  row: CopilotSessionRow,
  transcript: TranscriptSegment[],
): CopilotSessionSnapshot {
  return {
    id: row.id,
    mode: row.mode,
    meetingObjective: row.meeting_objective,
    orbState: row.orb_state,
    transcript,
    diagnosticState: row.diagnostic_state,
    businessProfile: row.business_profile,
    coverage: row.coverage,
    overallCoverage:
      row.coverage.length > 0
        ? Math.round(
            row.coverage.reduce((a, c) => a + c.percent, 0) / row.coverage.length,
          )
        : 0,
    proposalReadiness: row.proposal_readiness,
    currentThread: row.current_thread,
    latestInsight: row.latest_insight,
    suggestion: null,
    inconsistencies: row.inconsistencies,
    suppressSuggestion: row.suppress_suggestion,
    suppressReason: row.suppress_reason ?? undefined,
    elapsedSeconds: row.elapsed_seconds,
    narratorMessages: row.narrator_messages ?? [],
    meetingPhase: row.meeting_phase ?? "opening",
    copilotAction: row.copilot_action ?? "observe",
  };
}

export function snapshotToRowPatch(snapshot: CopilotSessionSnapshot): Partial<CopilotSessionRow> {
  return {
    diagnostic_state: snapshot.diagnosticState,
    business_profile: snapshot.businessProfile,
    coverage: snapshot.coverage,
    proposal_readiness: snapshot.proposalReadiness,
    current_thread: snapshot.currentThread,
    latest_insight: snapshot.latestInsight,
    orb_state: snapshot.orbState,
    suppress_suggestion: snapshot.suppressSuggestion,
    suppress_reason: snapshot.suppressReason ?? null,
    inconsistencies: snapshot.inconsistencies,
    elapsed_seconds: snapshot.elapsedSeconds,
    narrator_messages: snapshot.narratorMessages,
    meeting_phase: snapshot.meetingPhase,
    copilot_action: snapshot.copilotAction,
    meeting_objective: snapshot.meetingObjective,
  };
}

export function transcriptRowToSegment(row: CopilotTranscriptRow): TranscriptSegment {
  return {
    id: row.id,
    speaker: row.speaker,
    text: row.text,
    startedAt: row.started_at,
    endedAt: row.ended_at ?? undefined,
    sequence: row.sequence ?? undefined,
    confidence: row.confidence ?? undefined,
    speakerConfidence: row.speaker_confidence ?? undefined,
    source: row.source,
    analyzedAt: row.analyzed_at ?? undefined,
    kind: row.segment_kind as TranscriptSegment["kind"],
  };
}
