import { getKnowledgeGraph } from "../knowledge";
import { isObjectiveSatisfied } from "./diagnostic-engine";
import type { CopilotSessionSnapshot, TranscriptSegment } from "../types";

export interface CopilotTurnContext {
  companyName: string;
  prospectName: string;
  overallCoverage: number;
  proposalStatus: string;
  proposalBlockers: string[];
  lastTurn: {
    speaker: string;
    text: string;
    kind?: string;
  };
  recentTranscript: Array<{ speaker: string; text: string }>;
  captured: Array<{ key: string; label: string; value: unknown; kind: string; confidence: string }>;
  criticalGaps: Array<{ key: string; label: string; whyItMatters: string }>;
  currentThread: { label: string; summary: string } | null;
  suggestedQuestion: string | null;
  suggestionReason: string | null;
  suggestionObjectiveKey: string | null;
  suppressSuggestion: boolean;
  suppressReason: string | null;
  inconsistencies: Array<{ label: string; previous: string; current: string }>;
  newCapturesThisTurn: string[];
}

export function buildCopilotTurnContext(
  snapshot: CopilotSessionSnapshot,
  lastSegment: TranscriptSegment,
  newCaptures: string[] = [],
): CopilotTurnContext {
  const graph = getKnowledgeGraph();

  const captured = graph
    .filter((o) => isObjectiveSatisfied(snapshot.diagnosticState[o.key]))
    .map((o) => {
      const ev = snapshot.diagnosticState[o.key]!.evidence!;
      return {
        key: o.key,
        label: o.label,
        value: ev.value,
        kind: ev.kind,
        confidence: ev.confidence,
      };
    });

  const criticalGaps = graph
    .filter(
      (o) =>
        (o.proposalCritical || o.importance === "critical") &&
        !isObjectiveSatisfied(snapshot.diagnosticState[o.key]),
    )
    .slice(0, 8)
    .map((o) => ({
      key: o.key,
      label: o.label,
      whyItMatters: o.whyItMatters,
    }));

  return {
    companyName: snapshot.meetingObjective.companyName,
    prospectName: snapshot.meetingObjective.prospectName,
    overallCoverage: snapshot.overallCoverage,
    proposalStatus: snapshot.proposalReadiness.status,
    proposalBlockers: snapshot.proposalReadiness.blockers,
    lastTurn: {
      speaker: lastSegment.speaker,
      text: lastSegment.text,
      kind: lastSegment.kind,
    },
    recentTranscript: snapshot.transcript.slice(-8).map((s) => ({
      speaker: s.speaker,
      text: s.text,
    })),
    captured,
    criticalGaps,
    currentThread: snapshot.currentThread
      ? { label: snapshot.currentThread.label, summary: snapshot.currentThread.summary }
      : null,
    suggestedQuestion: snapshot.suggestion?.suggestedQuestion ?? null,
    suggestionReason: snapshot.suggestion?.reason ?? null,
    suggestionObjectiveKey: snapshot.suggestion?.objectiveKey ?? null,
    suppressSuggestion: snapshot.suppressSuggestion,
    suppressReason: snapshot.suppressReason ?? null,
    inconsistencies: snapshot.inconsistencies.map((i) => ({
      label: i.label,
      previous: i.previousValue,
      current: i.newValue,
    })),
    newCapturesThisTurn: newCaptures,
  };
}
