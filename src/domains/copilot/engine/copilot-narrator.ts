import { randomUUID } from "node:crypto";
import { getObjectiveByKey } from "../knowledge";
import type { CopilotNarratorMessage, CopilotNarratorTone, InsightCard } from "../types";
import { chatCompletionJson, isLlmConfigured } from "@/lib/llm/openrouter.server";
import { buildCopilotTurnContext, type CopilotTurnContext } from "./session-context-builder";
import type { CopilotSessionSnapshot, TranscriptSegment } from "../types";

interface NarratorLlmResponse {
  message: string;
  tone: CopilotNarratorTone;
  suggestedQuestion?: string;
  objectiveKey?: string;
}

const NARRATOR_SYSTEM = `Você é o Raise One Copilot — copiloto de diagnóstico comercial em tempo real para consultores da Raise One.

Seu papel: conversar naturalmente com o consultor DURANTE a reunião, como um ChatGPT especializado em discovery comercial.

REGRAS INVIOLÁVEIS:
1. NUNCA invente fatos sobre o negócio do prospect. Use APENAS evidências em "captured" e o transcript.
2. Diferencie claramente o que foi DITO (fact) do que você INFERE (inference).
3. Se o consultor fez uma pergunta, reconheça brevemente — não extraia discovery da pergunta.
4. Se o prospect está contando história (storytelling) ou suppressSuggestion=true, recomende SILÊNCIO — deixe falar.
5. Se houve nova captura (newCapturesThisTurn), comente o que isso significa para o diagnóstico.
6. Se há inconsistência, alerte com clareza.
7. Sugira próxima pergunta APENAS quando fizer sentido — em tom natural, não robótico.
8. Respostas em PT-BR, 2-4 frases, tom de parceiro experiente (direto, humano, sem jargão vazio).
9. Não repita literalmente o transcript. Interprete e oriente.

Retorne JSON:
{
  "message": "texto conversacional para o consultor",
  "tone": "welcome"|"observation"|"insight"|"suggestion"|"hold"|"warning",
  "suggestedQuestion": "pergunta opcional se tone=suggestion",
  "objectiveKey": "key do objective relacionado, se houver"
}`;

export async function generateWelcomeMessage(
  snapshot: CopilotSessionSnapshot,
): Promise<CopilotNarratorMessage> {
  const { prospectName, companyName } = snapshot.meetingObjective;

  if (isLlmConfigured()) {
    const result = await chatCompletionJson<NarratorLlmResponse>({
      messages: [
        { role: "system", content: NARRATOR_SYSTEM },
        {
          role: "user",
          content: `Início de reunião de qualificação com ${prospectName} (${companyName}). Gere mensagem de boas-vindas ao consultor explicando como você vai ajudar nesta reunião. tone=welcome.`,
        },
      ],
      temperature: 0.5,
    });

    if (result?.message) {
      return {
        id: randomUUID(),
        role: "copilot",
        content: result.message,
        tone: "welcome",
        createdAt: new Date().toISOString(),
      };
    }
  }

  return {
    id: randomUUID(),
    role: "copilot",
    content: `Estou acompanhando sua reunião com ${prospectName} (${companyName}). Conduza naturalmente — registro evidências, mapeio gaps e te oriento sobre o que explorar a seguir.`,
    tone: "welcome",
    createdAt: new Date().toISOString(),
  };
}

export async function generateNarratorTurn(input: {
  snapshot: CopilotSessionSnapshot;
  lastSegment: TranscriptSegment;
  capturedObjectives: string[];
  newInsights: InsightCard[];
  action?: import("../types").CopilotAction;
}): Promise<CopilotNarratorMessage | null> {
  if (input.action === "observe" && input.snapshot.meetingPhase === "opening") {
    return null;
  }

  if (input.action === "observe" && input.capturedObjectives.length === 0) {
    return null;
  }

  const context = buildCopilotTurnContext(
    input.snapshot,
    input.lastSegment,
    input.capturedObjectives,
  );

  if (isLlmConfigured()) {
    const llm = await generateWithLlm(context);
    if (llm) {
      return {
        id: randomUUID(),
        role: "copilot",
        content: llm.message,
        tone: llm.tone,
        suggestedQuestion: llm.suggestedQuestion,
        objectiveKey: llm.objectiveKey,
        createdAt: new Date().toISOString(),
        turnSegmentId: input.lastSegment.id,
      };
    }
  }

  return buildFallbackMessage(context, input.lastSegment.id, input.action);
}

async function generateWithLlm(context: CopilotTurnContext): Promise<NarratorLlmResponse | null> {
  return chatCompletionJson<NarratorLlmResponse>({
    messages: [
      { role: "system", content: NARRATOR_SYSTEM },
      {
        role: "user",
        content: `Contexto atual da reunião:\n${JSON.stringify(context, null, 2)}`,
      },
    ],
    temperature: 0.4,
    maxTokens: 600,
  });
}

function buildFallbackMessage(
  context: CopilotTurnContext,
  turnSegmentId: string,
  action?: import("../types").CopilotAction,
): CopilotNarratorMessage | null {
  if (action === "observe") return null;
  const { lastTurn, newCapturesThisTurn, suppressSuggestion, suppressReason } = context;

  if (lastTurn.speaker === "consultant" && lastTurn.kind === "question") {
    return msg(
      "Boa pergunta. Aguardo a resposta dela para mapear evidências.",
      "observation",
      turnSegmentId,
    );
  }

  if (context.inconsistencies.length > 0) {
    const inc = context.inconsistencies[context.inconsistencies.length - 1]!;
    return msg(
      `Atenção: ${inc.label} mudou de "${inc.previous}" para "${inc.current}". Vale validar antes de fechar diagnóstico.`,
      "warning",
      turnSegmentId,
    );
  }

  if (newCapturesThisTurn.length > 0) {
    const labels = newCapturesThisTurn
      .map((k) => getObjectiveByKey(k)?.label ?? k)
      .join(", ");
    return msg(
      `Registrei: ${labels}. Isso avança o diagnóstico — coverage em ${context.overallCoverage}%.`,
      "insight",
      turnSegmentId,
    );
  }

  if (suppressSuggestion && suppressReason) {
    return msg(suppressReason, "hold", turnSegmentId);
  }

  if (context.suggestedQuestion && action !== "explore" && action !== "clarify") {
    return null;
  }

  if (context.suggestedQuestion) {
    return msg(
      `Próximo passo que destrava o diagnóstico: "${context.suggestedQuestion}"`,
      "suggestion",
      turnSegmentId,
      context.suggestedQuestion,
      context.suggestionObjectiveKey ?? undefined,
    );
  }

  if (lastTurn.speaker === "prospect") {
    return msg("Continuo acompanhando. Nada crítico capturado neste turno ainda.", "observation", turnSegmentId);
  }

  return msg("Acompanhando a conversa.", "observation", turnSegmentId);
}

function msg(
  content: string,
  tone: CopilotNarratorTone,
  turnSegmentId: string,
  suggestedQuestion?: string,
  objectiveKey?: string,
): CopilotNarratorMessage {
  return {
    id: randomUUID(),
    role: "copilot",
    content,
    tone,
    suggestedQuestion,
    objectiveKey,
    createdAt: new Date().toISOString(),
    turnSegmentId,
  };
}

export async function generateMeetingSummary(snapshot: CopilotSessionSnapshot): Promise<string | null> {
  if (!isLlmConfigured() || snapshot.transcript.length === 0) return null;

  const context = buildCopilotTurnContext(
    snapshot,
    snapshot.transcript[snapshot.transcript.length - 1]!,
  );

  const result = await chatCompletionJson<{ summary: string }>({
    messages: [
      {
        role: "system",
        content:
          "Resuma a reunião comercial em 3-5 frases para o consultor. Use apenas fatos do contexto. PT-BR. JSON: { summary: string }",
      },
      { role: "user", content: JSON.stringify(context) },
    ],
    temperature: 0.3,
    maxTokens: 400,
  });

  return result?.summary ?? null;
}
