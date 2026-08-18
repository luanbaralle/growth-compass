/**
 * Fases conversacionais da reunião — inferidas dinamicamente.
 */
import type { ConversationSegmentKind, TranscriptSegment } from "../types";
import { isLikelyConsultantQuestion } from "./conversation-intelligence";

const OPENING_PATTERNS =
  /\b(oi|olá|ola|tudo bem|bom dia|boa tarde|boa noite|prazer|obrigad|agrade|separar esse tempo|conseguir falar|disponibilidade)\b/i;

const CLOSING_PATTERNS =
  /\b(encerr|finaliz|próximos passos|proximos passos|fechar|até logo|ate logo|obrigad.*tempo)\b/i;

export function isSmallTalk(text: string): boolean {
  const t = text.trim();
  if (t.length < 80 && OPENING_PATTERNS.test(t)) return true;
  if (/^(oi|olá|ola|tudo bem|tudo bom|e aí|e ai)[!.?\s]*$/i.test(t)) return true;
  return false;
}

export function isSubstantiveSegment(segment: TranscriptSegment): boolean {
  const kind = segment.kind;
  if (kind === "numeric_data") return true;
  if (kind === "storytelling" && segment.text.length > 120) return true;

  return /\b(trabalhamos|vendemos|clientes|leads|faturamento|produto|consórcio|consorcio|plano|indicação|indicacao|google|instagram|equipe|operação|operacao|clínica|clinica|implante|odonto|dentista|agência|agencia|campanha|captar|prospecção|prospeccao|consultório|consultorio)\b/i.test(
    segment.text,
  );
}

export function inferMeetingPhase(snapshot: CopilotSessionSnapshot): MeetingPhase {
  const transcript = snapshot.transcript;
  if (transcript.length === 0) return "opening";

  const last = transcript[transcript.length - 1]!;
  if (CLOSING_PATTERNS.test(last.text)) return "closing";

  const capturedCount = Object.values(snapshot.diagnosticState).filter(
    (r) => r.state === "captured" || r.state === "verified",
  ).length;

  const substantiveCount = transcript.filter(isSubstantiveSegment).length;

  if (transcript.length <= 3 && capturedCount === 0 && substantiveCount === 0) {
    return "opening";
  }

  if (capturedCount === 0 && substantiveCount <= 1) {
    return "context";
  }

  if (capturedCount < 5 || snapshot.overallCoverage < 25) {
    return "discovery";
  }

  if (snapshot.overallCoverage < 55) {
    return "deep_discovery";
  }

  if (snapshot.proposalReadiness.status !== "ready") {
    return "qualification";
  }

  if (capturedCount >= 8) {
    return "synthesis";
  }

  return "discovery";
}

export function phaseAllowsSuggestions(phase: MeetingPhase): boolean {
  return phase !== "opening" && phase !== "closing";
}

export function phaseAllowsExtraction(phase: MeetingPhase, segment: TranscriptSegment): boolean {
  if (phase === "opening" && isSmallTalk(segment.text)) return false;
  if (segment.speaker === "consultant") return false;
  if (segment.speaker === "prospect") return true;
  return isSubstantiveSegment(segment) && !isLikelyConsultantQuestion(segment.text);
}
