/**
 * Extração de evidências — OpenRouter quando configurado, senão regras.
 */
import { getAllObjectiveKeys } from "../knowledge";
import { chatCompletionJson, isLlmConfigured } from "@/lib/llm/openrouter.server";
import { extractFromText, type ExtractionMatch } from "./rule-based-extractor";

const OBJECTIVE_KEYS = getAllObjectiveKeys();

export async function extractEvidenceFromText(text: string): Promise<ExtractionMatch[]> {
  if (isLlmConfigured()) {
    try {
      const llm = await extractWithLlm(text);
      if (llm.length > 0) return llm;
    } catch {
      // fallback silencioso para regras
    }
  }
  return extractFromText(text);
}

async function extractWithLlm(text: string): Promise<ExtractionMatch[]> {
  const parsed = await chatCompletionJson<{
    matches?: Array<{
      objectiveKey: string;
      value: unknown;
      kind?: "fact" | "inference";
      confidence?: "low" | "medium" | "high";
      quote?: string;
    }>;
  }>({
    messages: [
      {
        role: "system",
        content: `Você extrai discovery objectives de respostas do PROSPECT em reuniões comerciais PT-BR.

Objective keys válidas: ${OBJECTIVE_KEYS.join(", ")}

REGRAS:
- Extraia APENAS o que o prospect DISSE ou pode ser inferido com segurança da frase.
- NÃO extraia de perguntas do consultor.
- "empresas" genérico (ex: "outras empresas") NÃO implica pessoa jurídica.
- Se nada relevante, retorne { "matches": [] }.

JSON: { "matches": [{ "objectiveKey": string, "value": any, "kind": "fact"|"inference", "confidence": "low"|"medium"|"high", "quote": string }] }`,
      },
      { role: "user", content: text },
    ],
    temperature: 0,
    maxTokens: 800,
  });

  if (!parsed?.matches?.length) return [];

  const validKeys = new Set(OBJECTIVE_KEYS);
  return parsed.matches
    .filter((m) => validKeys.has(m.objectiveKey))
    .map((m) => ({
      objectiveKey: m.objectiveKey,
      evidence: {
        value: m.value,
        confidence: m.confidence ?? "medium",
        source: m.kind === "inference" ? ("ai_inference" as const) : ("prospect_statement" as const),
        kind: m.kind ?? "fact",
        quote: m.quote ?? text,
        capturedAt: new Date().toISOString(),
      },
    }));
}
