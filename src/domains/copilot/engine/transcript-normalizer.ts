/**
 * Normaliza transcript bruto: limpa ruído STT, re-atribui speakers, merge de chunks.
 */
import { inferSpeakerFromText, isLikelyConsultantQuestion } from "./conversation-intelligence";
import type { TranscriptSegment } from "../types";

const NOISE_ONLY =
  /^(tchau|obrigad[oa]|oi|olá|ola|e aí|e ai|bom dia|boa tarde|boa noite|tudo bem|tudo bom|legal|maravilha|perfeito|show|sim|não|nao|uhum|hum|amém|amen|tá|ta|ok|okay|alô|alo|teste)[!.?\s]*$/i;

const FILLER_START =
  /^(tchau|obrigad[oa]|oi|tudo bem|legal|maravilha|perfeito|show|sim)\b[.,!\s]*/i;

export interface NormalizeContext {
  prospectName: string;
  companyName: string;
}

export interface NormalizedTurn {
  id: string;
  speaker: TranscriptSegment["speaker"];
  text: string;
  segmentIds: string[];
  startedAt: string;
}

function isNoiseSegment(text: string): boolean {
  const t = text.trim();
  if (t.length < 3) return true;
  if (NOISE_ONLY.test(t)) return true;
  if (t.length < 12 && /^(tchau|obrigad)/i.test(t)) return true;
  return false;
}

function stripFillerPrefix(text: string): string {
  return text.replace(FILLER_START, "").trim();
}

function resolveSpeaker(
  segment: TranscriptSegment,
  ctx: NormalizeContext,
): TranscriptSegment["speaker"] {
  const text = segment.text.trim();
  if (!text) return segment.speaker;

  const prospectFirst = ctx.prospectName.split(/\s+/)[0] ?? ctx.prospectName;
  const prospectPattern = new RegExp(
    `\\b(${escapeRegex(prospectFirst)}|${escapeRegex(ctx.prospectName)})\\b`,
    "i",
  );

  if (prospectPattern.test(text) && isLikelyConsultantQuestion(text)) {
    return "consultant";
  }

  if (
    prospectPattern.test(text) &&
    /\b(deixa eu te perguntar|me conta|me fala|você tem|voce tem|hoje você|como que funciona)\b/i.test(
      text,
    )
  ) {
    return "consultant";
  }

  const inferred = inferSpeakerFromText(text, ctx);
  if (inferred !== "unknown") return inferred;

  if (segment.speaker === "consultant" || segment.speaker === "prospect") {
    return segment.speaker;
  }

  return "unknown";
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeTranscript(
  segments: TranscriptSegment[],
  ctx: NormalizeContext,
): NormalizedTurn[] {
  const filtered = segments
    .filter((s) => !isNoiseSegment(s.text))
    .map((s) => ({
      ...s,
      text: stripFillerPrefix(s.text.trim()),
    }))
    .filter((s) => s.text.length >= 8);

  const turns: NormalizedTurn[] = [];

  for (const seg of filtered) {
    const speaker = resolveSpeaker(seg, ctx);
    const last = turns[turns.length - 1];

    if (
      last &&
      last.speaker === speaker &&
      last.text.length + seg.text.length < 600
    ) {
      last.text = `${last.text} ${seg.text}`.replace(/\s+/g, " ").trim();
      last.segmentIds.push(seg.id);
      continue;
    }

    turns.push({
      id: seg.id,
      speaker,
      text: seg.text,
      segmentIds: [seg.id],
      startedAt: seg.startedAt,
    });
  }

  return turns;
}

export function normalizedTurnsToText(turns: NormalizedTurn[]): string {
  return turns
    .map((t) => {
      const who =
        t.speaker === "prospect"
          ? "PROSPECT"
          : t.speaker === "consultant"
            ? "CONSULTOR"
            : "DESCONHECIDO";
      return `[${who}] ${t.text}`;
    })
    .join("\n");
}

/** Limpeza leve em segmento individual (live pipeline). */
export function cleanSttSegmentText(text: string): string {
  const cleaned = stripFillerPrefix(text.trim());
  if (isNoiseSegment(cleaned)) return "";
  return cleaned;
}
