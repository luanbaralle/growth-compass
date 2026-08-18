import type { CopilotAction, CopilotSessionSnapshot, InsightCard, TranscriptSegment } from "../types";
import { inferSpeakerFromText } from "./conversation-intelligence";
import {
  inferMeetingPhase,
  isSmallTalk,
  isSubstantiveSegment,
  phaseAllowsSuggestions,
} from "./meeting-phase";

export interface CopilotActionDecision {
  action: CopilotAction;
  reason: string;
}

export function decideCopilotAction(input: {
  snapshot: CopilotSessionSnapshot;
  segment: TranscriptSegment;
  capturedObjectives: string[];
  newInsights: InsightCard[];
  suppressSuggestion: boolean;
}): CopilotActionDecision {
  const phase = inferMeetingPhase(input.snapshot);
  const { segment, capturedObjectives, newInsights, suppressSuggestion } = input;

  if (newInsights.some((i) => i.type === "warning")) {
    return { action: "clarify", reason: "Inconsistência detectada — validar com o prospect." };
  }

  if (capturedObjectives.length > 0) {
    return {
      action: "capture",
      reason: `Evidência registrada: ${capturedObjectives.join(", ")}.`,
    };
  }

  if (phase === "opening" || isSmallTalk(segment.text)) {
    return { action: "observe", reason: "Construindo contexto da reunião…" };
  }

  if (suppressSuggestion) {
    return { action: "observe", reason: "Conversa fluindo — acompanhar sem interromper." };
  }

  if (!phaseAllowsSuggestions(phase)) {
    return { action: "observe", reason: "Aguardando momento adequado para explorar." };
  }

  if (segment.speaker === "consultant") {
    return { action: "observe", reason: "Consultor conduzindo — aguardando resposta." };
  }

  const effectiveSpeaker =
    segment.speaker === "unknown" ? inferSpeakerFromText(segment.text) : segment.speaker;

  if (
    (effectiveSpeaker === "prospect" || effectiveSpeaker === "unknown") &&
    isSubstantiveSegment(segment) &&
    input.snapshot.suggestion
  ) {
    return {
      action: "explore",
      reason: "Informação substantiva — vale aprofundar.",
    };
  }

  if (input.snapshot.overallCoverage >= 40 && phase === "synthesis") {
    return { action: "recommend", reason: "Coverage suficiente para síntese." };
  }

  return { action: "observe", reason: "Continuo acompanhando a conversa." };
}

export function actionPermitsSuggestion(action: CopilotAction): boolean {
  return action === "explore" || action === "clarify";
}
