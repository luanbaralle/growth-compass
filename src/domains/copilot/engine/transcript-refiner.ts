/**
 * Refina transcript normalizado via LLM — corrige STT, speakers e ruído antes da síntese.
 */
import { chatCompletionJson, isLlmConfigured } from "@/lib/llm/openrouter.server";
import type { NormalizedTurn } from "./transcript-normalizer";

export interface RefinedTurn {
  speaker: "prospect" | "consultant" | "unknown";
  text: string;
  segmentIds: string[];
}

interface RefineBatchResponse {
  turns?: Array<{
    speaker: "prospect" | "consultant" | "unknown";
    text: string;
    sourceIds?: string[];
  }>;
}

const BATCH_SIZE = 35;

function turnsToBatchText(turns: NormalizedTurn[]): string {
  return turns
    .map(
      (t, i) =>
        `[${i}] ids=${t.segmentIds.join(",")} | ${t.speaker.toUpperCase()} | ${t.text}`,
    )
    .join("\n");
}

function mergeRefinedTurns(chunks: RefinedTurn[]): RefinedTurn[] {
  const merged: RefinedTurn[] = [];
  for (const turn of chunks) {
    const text = turn.text.trim();
    if (text.length < 4) continue;
    const last = merged[merged.length - 1];
    if (last && last.speaker === turn.speaker && last.text.length + text.length < 500) {
      last.text = `${last.text} ${text}`.replace(/\s+/g, " ").trim();
      last.segmentIds = [...new Set([...last.segmentIds, ...turn.segmentIds])];
    } else {
      merged.push({ ...turn, text });
    }
  }
  return merged;
}

async function refineBatch(
  batch: NormalizedTurn[],
  ctx: { prospectName: string; companyName: string; consultantHint: string },
  batchIndex: number,
): Promise<RefinedTurn[]> {
  const parsed = await chatCompletionJson<RefineBatchResponse>({
    messages: [
      {
        role: "system",
        content: `Você corrige transcripts de reuniões comerciais gravadas via STT (português BR).

CONTEXTO DA REUNIÃO:
- Prospect/cliente: ${ctx.prospectName} (${ctx.companyName})
- Consultores: ${ctx.consultantHint} (equipe Raise One / R1)

TAREFA — para cada turno [n]:
1. Corrija erros óbvios de STT (ex: "Yanaha"→"Yamaha", "polúcia pediplana"→"plano populacional", "Bom sorte"→"Bom, o consórcio").
2. Reatribua speaker corretamente:
   - PROSPECT = ${ctx.prospectName} falando sobre SEU negócio (minha corretora, eu trabalho, a gente...)
   - CONSULTANT = equipe R1/Raise One (perguntas, pitch, pilares, proposta, "nós como agência")
3. Remova ruído ("Tchau", "Obrigado" soltos, "Oi Oi").
4. Una fragmentos que claramente são a mesma frase.
5. NÃO invente informações. Só corrija o que está implícito no texto.

Retorne JSON:
{ "turns": [{ "speaker": "prospect|consultant|unknown", "text": "texto corrigido", "sourceIds": ["uuid", ...] }] }

Use sourceIds dos ids originais quando possível. Pode combinar vários [n] em um turno.`,
      },
      {
        role: "user",
        content: `Lote ${batchIndex + 1}:\n${turnsToBatchText(batch)}`,
      },
    ],
    temperature: 0.1,
    maxTokens: 4096,
  });

  if (!parsed?.turns?.length) {
    return batch.map((t) => ({
      speaker: t.speaker,
      text: t.text,
      segmentIds: t.segmentIds,
    }));
  }

  return parsed.turns
    .filter((t) => t.text?.trim())
    .map((t) => ({
      speaker: t.speaker ?? "unknown",
      text: t.text.trim(),
      segmentIds:
        t.sourceIds?.length && t.sourceIds.every(Boolean)
          ? t.sourceIds
          : batch.flatMap((b) => b.segmentIds).slice(0, 3),
    }));
}

export async function refineTranscript(
  turns: NormalizedTurn[],
  ctx: {
    prospectName: string;
    companyName: string;
    consultantHint?: string;
  },
): Promise<{ turns: RefinedTurn[]; error?: string }> {
  if (turns.length === 0) return { turns: [] };

  if (!isLlmConfigured()) {
    return {
      turns: turns.map((t) => ({
        speaker: t.speaker,
        text: t.text,
        segmentIds: t.segmentIds,
      })),
      error: "OPENROUTER_API_KEY não configurada",
    };
  }

  const consultantHint =
    ctx.consultantHint ?? "Luan e equipe Raise One (R1)";

  const refinedChunks: RefinedTurn[] = [];

  for (let i = 0; i < turns.length; i += BATCH_SIZE) {
    const batch = turns.slice(i, i + BATCH_SIZE);
    const refined = await refineBatch(
      batch,
      { ...ctx, consultantHint },
      Math.floor(i / BATCH_SIZE),
    );
    refinedChunks.push(...refined);
  }

  return { turns: mergeRefinedTurns(refinedChunks) };
}

export function refinedTurnsToText(turns: RefinedTurn[]): string {
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
