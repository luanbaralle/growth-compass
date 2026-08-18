import type { ConversationSegmentKind, TranscriptSegment } from "../types";

const STORY_PATTERNS = [
  /\bcomecei\b/i,
  /\bminha mãe\b/i,
  /\bminha mae\b/i,
  /\bhistória\b/i,
  /\bhistoria\b/i,
  /\bquando eu\b/i,
  /\bno começo\b/i,
  /\bno comeco\b/i,
  /\bmeu pai\b/i,
  /\bfamília\b/i,
  /\bfamilia\b/i,
];

const EMOTIONAL_PATTERNS = [
  /\bsinto\b/i,
  /\bsentir\b/i,
  /\bfrustra/i,
  /\bdifícil\b/i,
  /\bdificil\b/i,
  /\bsonho\b/i,
  /\bmotivação\b/i,
  /\bmotivacao\b/i,
];

const NUMERIC_PATTERNS = [
  /\d+\s*(clientes|leads|contatos|vendas|propostas)/i,
  /\d+\s*\/\s*m[eê]s/i,
  /\d+\s*por m[eê]s/i,
  /uns?\s*\d+/i,
  /aproximadamente\s*\d+/i,
];

const CONSULTANT_QUESTION_START =
  /^(o que|como|qual|quais|quem|onde|quando|por que|porque|me conta|me fala|me diz|você acha|voce acha|pode me|poderia me)/i;

export function isLikelyConsultantQuestion(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (trimmed.endsWith("?")) return true;
  if (CONSULTANT_QUESTION_START.test(trimmed)) return true;
  if (/\b(você|voce)\b.*\b(acha|pensa|sente|imagina|considera)\b/i.test(trimmed)) return true;
  if (/\b(o que|como|qual|quem)\b.*\b(você|voce|vocês|voces)\b/i.test(trimmed)) return true;
  return false;
}

function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function textsSimilar(a: string, b: string): boolean {
  const na = normalizeForMatch(a);
  const nb = normalizeForMatch(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;

  const wordsA = new Set(na.split(" ").filter((w) => w.length > 2));
  const wordsB = nb.split(" ").filter((w) => w.length > 2);
  if (wordsB.length === 0) return false;
  const overlap = wordsB.filter((w) => wordsA.has(w)).length;
  return overlap / wordsB.length >= 0.55;
}

const CONSULTANT_PITCH_PATTERNS = [
  /\b(raise one|meu preço|taxa de serviço|taxa de servico|997|1\.297|prospecção ativa|prospeccao ativa)\b/i,
  /\b(tá entendendo|ta entendendo|entendeu\?|o ponto é|o ponto e|primeiro pilar|80.?20)\b/i,
  /\b(funil de vendas real|processo ativo de venda|bater meta|ir atrás do cliente)\b/i,
  /\b(eu posso te ajudar|certeza absoluta|solucionar esse problema|como eu trabalho)\b/i,
  /\b(de que forma que eu trabalho|investimento em anúncio|investimento em anuncio)\b/i,
];

const PROSPECT_SIGNAL_PATTERNS = [
  /\b(minha clínica|minha clinica|minha empresa|minha corretora|meu consultório|meu consultorio|minha esposa|minha filha)\b/i,
  /\b(a gente|nós temos|nos temos|nosso|nossa clínica|nossa clinica|eu abri|eu trabalho)\b/i,
  /\b(não conseguimos|nao conseguimos|não sabemos|nao sabemos|não temos|nao temos)\b/i,
  /\b(primeira vez|primeiro negócio|primeiro negocio|primeira empresa)\b/i,
  /\b(implante|odonto|dentista|consórcio|consorcio|seguro|plano de saúde|plano de saude)\b/i,
  /\b(agência|agencia).*(contrat|pegamos|trocamos|saiu|tentei)\b/i,
  /\b(representante|itanhaém|itanhaem|yamaha|rodobens)\b/i,
];

export interface SpeakerContext {
  prospectName?: string;
  companyName?: string;
}

export function inferSpeakerFromText(
  text: string,
  ctx?: SpeakerContext,
): "prospect" | "consultant" | "unknown" {
  const trimmed = text.trim();
  if (!trimmed) return "unknown";
  if (isLikelyConsultantQuestion(trimmed)) return "consultant";

  if (ctx?.prospectName) {
    const first = ctx.prospectName.split(/\s+/)[0] ?? ctx.prospectName;
    const namePat = new RegExp(`\\b(${first}|${ctx.prospectName})\\b`, "i");
    if (namePat.test(trimmed) && /\b(deixa eu|me conta|me fala|você tem|hoje você)\b/i.test(trimmed)) {
      return "consultant";
    }
  }

  let consultantScore = 0;
  let prospectScore = 0;

  for (const p of CONSULTANT_PITCH_PATTERNS) {
    if (p.test(trimmed)) consultantScore += 2;
  }
  for (const p of PROSPECT_SIGNAL_PATTERNS) {
    if (p.test(trimmed)) prospectScore += 2;
  }

  if (/\b(raise one|r1|nós trabalhamos|pilares|geração de demanda)\b/i.test(trimmed)) {
    consultantScore += 3;
  }

  if (consultantScore > prospectScore && consultantScore >= 2) return "consultant";
  if (prospectScore > consultantScore && prospectScore >= 2) return "prospect";
  if (prospectScore >= 2 && consultantScore === 0) return "prospect";
  return "unknown";
}

export function resolveEffectiveSpeaker(
  segment: TranscriptSegment,
): "prospect" | "consultant" | "unknown" {
  if (segment.speaker !== "unknown") return segment.speaker;
  return inferSpeakerFromText(segment.text);
}

export function resolveSpeakerForTurn(
  selected: "prospect" | "consultant" | "unknown",
  text: string,
  suggestedQuestion?: string | null,
  ctx?: SpeakerContext,
): "prospect" | "consultant" | "unknown" {
  if (isLikelyConsultantQuestion(text)) return "consultant";
  if (suggestedQuestion && textsSimilar(text, suggestedQuestion)) return "consultant";
  if (selected !== "unknown") return selected;
  return inferSpeakerFromText(text, ctx);
}

export function classifySegment(text: string): ConversationSegmentKind {
  const trimmed = text.trim();
  if (!trimmed) return "silence";
  if (isLikelyConsultantQuestion(trimmed)) return "question";
  if (NUMERIC_PATTERNS.some((p) => p.test(trimmed))) return "numeric_data";
  if (STORY_PATTERNS.some((p) => p.test(trimmed))) return "storytelling";
  if (EMOTIONAL_PATTERNS.some((p) => p.test(trimmed))) return "emotional_narrative";
  return "statement";
}

export function shouldSuppressSuggestion(
  segment: TranscriptSegment,
  recentSegments: TranscriptSegment[],
): { suppress: boolean; reason?: string } {
  const kind = segment.kind ?? classifySegment(segment.text);

  if (kind === "storytelling" || kind === "emotional_narrative") {
    return {
      suppress: true,
      reason: "História relevante — acompanhar sem interromper.",
    };
  }

  const lastThree = recentSegments.slice(-3);
  const allProspect = lastThree.every((s) => s.speaker === "prospect");
  const midNarrative = lastThree.some(
    (s) =>
      (s.kind ?? classifySegment(s.text)) === "storytelling" ||
      (s.kind ?? classifySegment(s.text)) === "emotional_narrative",
  );

  if (allProspect && midNarrative && segment.text.length < 80) {
    return {
      suppress: true,
      reason: "Narrativa em andamento — aguardar conclusão.",
    };
  }

  return { suppress: false };
}

export function describeLiveContext(
  segment: TranscriptSegment,
  threadLabel?: string,
): string {
  const kind = segment.kind ?? classifySegment(segment.text);
  const who = segment.speaker === "prospect" ? "Prospect" : "Consultor";

  if (kind === "question" && segment.speaker === "consultant") {
    return "Consultor conduzindo a conversa…";
  }

  if (threadLabel && segment.speaker === "prospect") {
    return `${who} está falando sobre ${threadLabel.toLowerCase()}.`;
  }

  if (kind === "storytelling") {
    return `${who} compartilha contexto e história.`;
  }

  if (kind === "numeric_data") {
    return `${who} menciona números e volumes.`;
  }

  return `${who} em conversa.`;
}

export function suggestSoftFollowUp(segment: TranscriptSegment): string | null {
  const kind = segment.kind ?? classifySegment(segment.text);
  if (kind === "storytelling" && /entrar nesse mercado|comecei/i.test(segment.text)) {
    return "Aprofunde a motivação para entrar nesse mercado.";
  }
  return null;
}
