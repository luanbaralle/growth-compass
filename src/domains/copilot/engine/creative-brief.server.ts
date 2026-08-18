/**
 * Gera brief criativo estruturado para montagem manual de proposta (template UNIP / aceleração).
 */
import { buildBriefingQaContext } from "./briefing-qa.server";
import { chatCompletionJson, isLlmConfigured } from "@/lib/llm/openrouter.server";
import type { CopilotMeetingArtifact } from "../meeting/types";
import type { CopilotSessionSnapshot, CreativeBrief, CreativeBriefSection } from "../types";

const UNIP_SECTION_KEYS = [
  { key: "diagnosis", number: "01", title: "Diagnóstico — Onde Estamos Hoje" },
  { key: "opportunity", number: "02", title: "Oportunidade — Existe Demanda" },
  { key: "behavior", number: "03", title: "Comportamento do Cliente" },
  { key: "mechanism", number: "04", title: "O Mecanismo — Sistema de Aquisição" },
  { key: "strategy", number: "05", title: "Estratégia — Como Vamos Atrair" },
  { key: "deliverables", number: "06", title: "Entregáveis" },
  { key: "validation", number: "07", title: "Validação — Primeiros 30 Dias" },
  { key: "investment", number: "08", title: "Investimento — Estrutura de Preços" },
  { key: "implementation", number: "09", title: "Implementação — Plano de Execução" },
  { key: "next_steps", number: "10", title: "Próximos Passos" },
] as const;

interface CreativeBriefLlmSection {
  key?: string;
  narrative?: string;
  bullets?: string[];
  editorNotes?: string;
}

interface CreativeBriefLlmResponse {
  projectTitle?: string;
  templateArchetype?: "acceleration" | "custom_solution";
  suggestedProjectName?: string;
  sections?: CreativeBriefLlmSection[];
  gapsForMeeting2?: string[];
}

function fallbackBrief(
  session: CopilotSessionSnapshot,
  reason: string,
): CreativeBrief {
  const diagnosis = reason;
  return {
    clientName: session.meetingObjective.prospectName,
    companyName: session.meetingObjective.companyName,
    projectTitle: `Projeto de Aceleração — ${session.meetingObjective.companyName}`,
    templateArchetype: "acceleration",
    suggestedProjectName: session.meetingObjective.companyName.toLowerCase().replace(/\s+/g, "-"),
    sections: UNIP_SECTION_KEYS.map((s) => ({
      key: s.key,
      number: s.number,
      title: s.title,
      narrative: s.key === "diagnosis" ? diagnosis : "Preencher manualmente com base no briefing.",
      bullets: [],
      editorNotes: "Gerado parcialmente — revise antes da Reunião 2.",
    })),
    gapsForMeeting2: [],
    generatedAt: new Date().toISOString(),
    generationError: reason,
  };
}

function mergeSections(llmSections: CreativeBriefLlmSection[]): CreativeBriefSection[] {
  const byKey = new Map(llmSections.filter((s) => s.key).map((s) => [s.key!, s]));

  return UNIP_SECTION_KEYS.map((template) => {
    const llm = byKey.get(template.key);
    return {
      key: template.key,
      number: template.number,
      title: template.title,
      narrative: llm?.narrative?.trim() || "A desenvolver com base no diagnóstico.",
      bullets: (llm?.bullets ?? []).map((b) => b.trim()).filter(Boolean).slice(0, 8),
      editorNotes: llm?.editorNotes?.trim() || undefined,
    };
  });
}

export async function generateCreativeBrief(input: {
  session: CopilotSessionSnapshot;
  artifact: CopilotMeetingArtifact;
}): Promise<CreativeBrief> {
  if (!isLlmConfigured()) {
    return fallbackBrief(input.session, "OPENROUTER_API_KEY não configurada.");
  }

  const context = buildBriefingQaContext(input);

  const parsed = await chatCompletionJson<CreativeBriefLlmResponse>({
    messages: [
      {
        role: "system",
        content: `Você gera um BRIEF CRIATIVO para a equipe Raise One montar uma proposta comercial (Reunião 2).

O brief alimenta uma página estilo UNIP (diagnóstico → oportunidade → mecanismo → entregáveis → investimento).
Use templateArchetype "acceleration" para clientes que precisam ser educados sobre marketing/aquisição (ex.: clínicas, imobiliárias genéricas).
Use "custom_solution" apenas se a reunião foi sobre produto/software sob medida específico.

REGRAS:
1. Baseie-se SOMENTE no contexto — não invente números, preços ou métricas de mercado.
2. Seção 08 (investment): NÃO invente valores R$ — use editorNotes pedindo preenchimento manual e bullets com estrutura (implementação, mídia, gestão).
3. Seção 07 (validation): foque no que validar nos primeiros 30 dias com base no que foi dito.
4. narrative: 2-4 frases por seção, tom consultivo em PT-BR.
5. bullets: 3-6 itens concretos quando aplicável.
6. gapsForMeeting2: lacunas críticas para validar antes de apresentar proposta.
7. suggestedProjectName: slug curto para URL (ex.: saude-cia, unip-caraguatatuba).

Seções obrigatórias (keys): ${UNIP_SECTION_KEYS.map((s) => s.key).join(", ")}

JSON:
{
  "projectTitle": "Título da proposta",
  "templateArchetype": "acceleration|custom_solution",
  "suggestedProjectName": "slug",
  "sections": [{ "key": "diagnosis", "narrative": "", "bullets": ["..."], "editorNotes": "opcional" }],
  "gapsForMeeting2": ["..."]
}`,
      },
      {
        role: "user",
        content: `CONTEXTO DA REUNIÃO DE BRIEFING:\n${context}`,
      },
    ],
    temperature: 0.35,
    maxTokens: 8192,
  });

  if (!parsed?.sections?.length) {
    return fallbackBrief(input.session, "Resposta LLM vazia ou JSON inválido.");
  }

  return {
    clientName: input.session.meetingObjective.prospectName,
    companyName: input.session.meetingObjective.companyName,
    projectTitle:
      parsed.projectTitle?.trim() ||
      `Projeto de Aceleração — ${input.session.meetingObjective.companyName}`,
    templateArchetype:
      parsed.templateArchetype === "custom_solution" ? "custom_solution" : "acceleration",
    suggestedProjectName:
      parsed.suggestedProjectName?.trim().replace(/[^\w-]/g, "-").slice(0, 48) ||
      "projeto-cliente",
    sections: mergeSections(parsed.sections),
    gapsForMeeting2: (parsed.gapsForMeeting2 ?? []).slice(0, 12),
    generatedAt: new Date().toISOString(),
  };
}
