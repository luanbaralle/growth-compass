import { chatCompletion, isLlmConfigured } from "@/lib/llm/openrouter.server";
import type { CopilotMeetingArtifact } from "../meeting/types";
import type { BriefingQaMessage, CopilotSessionSnapshot } from "../types";

const MAX_TRANSCRIPT_CHARS = 12000;
const MAX_GRAPH_ITEMS = 24;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "\n[... truncado ...]";
}

export function buildBriefingQaContext(input: {
  session: CopilotSessionSnapshot;
  artifact: CopilotMeetingArtifact;
}): string {
  const { session, artifact } = input;
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  const synthesis = artifact.meeting_synthesis;
  const engagement = artifact.recommended_engagement as Record<string, unknown> | null;

  const graphLines = (artifact.evidence_graph ?? [])
    .slice(0, MAX_GRAPH_ITEMS)
    .map((item) => `- [${item.domain}/${item.kind}] ${item.label}: ${item.value}`);

  const refinedText =
    synthesis?.refinedTranscript
      ?.map((t) => `${t.speaker}: ${t.text}`)
      .join("\n") ?? "";

  const transcriptFallback = artifact.transcript_segments
    .slice(-40)
    .map((s) => `${s.speaker}: ${s.text}`)
    .join("\n");

  const engagementText =
    engagement && Array.isArray(engagement.phases)
      ? [
          `Estratégia: ${String(engagement.strategy ?? "")}`,
          ...(engagement.phases as Array<{ name?: string; items?: string[] }>).map(
            (p) => `${p.name ?? "Fase"}: ${(p.items ?? []).join("; ")}`,
          ),
        ].join("\n")
      : "";

  return [
    `Prospect: ${session.meetingObjective.prospectName}`,
    `Empresa: ${session.meetingObjective.companyName}`,
    `Objetivo: ${session.meetingObjective.title}`,
    `Cobertura: ${session.overallCoverage}% · Profundidade: ${session.knowledgeDepth}% · Proposta: ${session.proposalReadiness.status}`,
    "",
    "=== DIAGNÓSTICO ===",
    `Situação: ${diagnosis.situation ?? artifact.transcript_summary ?? "—"}`,
    diagnosis.mainProblem ? `Problema: ${diagnosis.mainProblem}` : "",
    diagnosis.constraint ? `Restrição: ${diagnosis.constraint}` : "",
    diagnosis.opportunity ? `Oportunidade R1: ${diagnosis.opportunity}` : "",
    "",
    "=== O QUE APRENDEMOS ===",
    ...(artifact.what_we_learned ?? []).map((item) => `- ${item}`),
    "",
    "=== LACUNAS ===",
    ...(artifact.unknowns ?? []).map((item) => `- ${item}`),
    "",
    "=== EVIDÊNCIAS (grafo) ===",
    ...graphLines,
    engagementText ? `\n=== ENGAJAMENTO RECOMENDADO ===\n${engagementText}` : "",
    "",
    "=== TRANSCRIPT (refinado ou bruto) ===",
    truncate(refinedText || transcriptFallback, MAX_TRANSCRIPT_CHARS),
  ]
    .filter(Boolean)
    .join("\n");
}

export async function answerBriefingQuestion(input: {
  question: string;
  context: string;
  history: BriefingQaMessage[];
  prospectName: string;
  companyName: string;
}): Promise<string> {
  if (!isLlmConfigured()) {
    return "Configure OPENROUTER_API_KEY no servidor para usar o Q&A pós-reunião.";
  }

  const recentHistory = input.history.slice(-8).map((msg) => ({
    role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
    content: msg.content,
  }));

  const answer = await chatCompletion({
    messages: [
      {
        role: "system",
        content: `Você é o Raise One Copilot em modo pós-reunião. Responda perguntas do consultor comercial SOBRE o briefing/diagnóstico já gerado.

REGRAS:
1. Baseie-se APENAS no contexto fornecido (diagnóstico, evidências, transcript, lacunas).
2. Se a informação não estiver no contexto, diga claramente que não foi capturada na reunião — não invente.
3. Diferencie fatos do prospect vs hipóteses/sugestões da R1 quando relevante.
4. Respostas em PT-BR, concisas (2-6 frases), tom de consultor sênior.
5. Quando útil, cite lacunas ou próximos passos.
6. Não repita o briefing inteiro — responda só o que foi perguntado.

Prospect: ${input.prospectName} · Empresa: ${input.companyName}`,
      },
      {
        role: "user",
        content: `CONTEXTO DO BRIEFING:\n${input.context}`,
      },
      ...recentHistory,
      { role: "user", content: input.question.trim() },
    ],
    temperature: 0.25,
    maxTokens: 768,
  });

  return (
    answer?.trim() ||
    "Não consegui gerar uma resposta — tente reformular a pergunta ou reprocesse a sessão."
  );
}
