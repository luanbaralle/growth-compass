/**
 * Síntese pós-reunião — analisa transcript normalizado e produz evidence graph + diagnóstico.
 */
import { randomUUID } from "node:crypto";
import { getAllObjectiveKeys } from "../knowledge";
import { chatCompletionJson, isLlmConfigured } from "@/lib/llm/openrouter.server";
import type {
  DiagnosticDomain,
  DiagnosticState,
  EvidenceGraphItem,
  EvidenceKind,
  EvidenceSource,
  MeetingSynthesis,
  TranscriptSegment,
} from "../types";
import {
  normalizeTranscript,
  normalizedTurnsToText,
  type NormalizedTurn,
} from "./transcript-normalizer";
import {
  refineTranscript,
  refinedTurnsToText,
  type RefinedTurn,
} from "./transcript-refiner";
import { computeKnowledgeDepth } from "./knowledge-depth";
import { upsertEvidence } from "./diagnostic-engine";
import { buildBusinessProfileFromGraph } from "./business-profile-builder";
import { computeDomainCoverage, computeOverallCoverage, computeProposalReadiness } from "./diagnostic-engine";

const OBJECTIVE_KEYS = getAllObjectiveKeys();

const VALID_DOMAINS = new Set<string>([
  "business",
  "offer",
  "customer",
  "commercial",
  "economics",
  "acquisition",
  "marketing",
  "brand",
  "content",
  "goals",
  "expectations",
  "investment",
  "risks",
  "opportunities",
]);

interface SynthesisLlmItem {
  domain: string;
  label: string;
  value: string;
  kind: "fact" | "inference" | "hypothesis" | "opportunity";
  source: "prospect" | "consultant" | "r1" | "ai";
  confidence: "low" | "medium" | "high";
  quote?: string;
  objectiveKey?: string;
}

interface SynthesisLlmResponse {
  items?: SynthesisLlmItem[];
  diagnosis?: {
    situation?: string;
    mainProblem?: string;
    constraint?: string;
    opportunity?: string;
  };
  whatWeLearned?: string[];
  criticalUnknowns?: string[];
  secondaryUnknowns?: string[];
  summary?: string;
}

function mapSource(s: SynthesisLlmItem["source"]): EvidenceSource {
  if (s === "prospect") return "prospect_statement";
  if (s === "consultant") return "consultant_statement";
  if (s === "r1") return "r1_team";
  return "ai_inference";
}

type TurnForSynthesis = NormalizedTurn | RefinedTurn;

function findSegmentIdsForQuote(quote: string | undefined, turns: TurnForSynthesis[]): string[] {
  if (!quote || quote.length < 8) return [];
  const needle = quote.slice(0, 40).toLowerCase();
  for (const turn of turns) {
    if (turn.text.toLowerCase().includes(needle)) {
      return turn.segmentIds;
    }
  }
  return [];
}

function llmItemsToGraph(
  items: SynthesisLlmItem[],
  turns: TurnForSynthesis[],
): EvidenceGraphItem[] {
  return items
    .filter((i) => i.value && i.label && VALID_DOMAINS.has(i.domain))
    .map((i) => ({
      id: randomUUID(),
      domain: i.domain as EvidenceGraphItem["domain"],
      label: i.label,
      value: i.value,
      kind: i.kind as EvidenceKind,
      source: mapSource(i.source),
      status: i.kind === "fact" && i.source === "prospect" ? "confirmed" : "tentative",
      confidence: i.confidence ?? "medium",
      quote: i.quote,
      segmentIds: findSegmentIdsForQuote(i.quote, turns),
      objectiveKey:
        i.objectiveKey && OBJECTIVE_KEYS.includes(i.objectiveKey)
          ? i.objectiveKey
          : undefined,
    }));
}

function mergeIntoDiagnosticState(
  diagnosticState: DiagnosticState,
  graph: EvidenceGraphItem[],
): DiagnosticState {
  let state = { ...diagnosticState };

  for (const item of graph) {
    if (!item.objectiveKey) continue;
    if (item.source === "consultant_statement" || item.source === "r1_team") {
      if (item.kind !== "fact") continue;
    }
    if (item.kind === "opportunity" || item.kind === "hypothesis") continue;

    const existing = state[item.objectiveKey];
    if (existing?.state === "verified") continue;

    state = upsertEvidence(state, item.objectiveKey, {
      value: item.value,
      confidence: item.confidence,
      source: item.source,
      kind: item.kind === "opportunity" ? "inference" : item.kind,
      status: item.status,
      quote: item.quote ?? item.value,
      capturedAt: new Date().toISOString(),
      segmentIds: item.segmentIds,
    });
  }

  return state;
}

function fallbackSynthesis(
  turns: TurnForSynthesis[],
  prospectName: string,
  companyName: string,
  reason: string,
): MeetingSynthesisResult {
  return {
    graph: [],
    synthesis: {
      diagnosis: {
        situation: `Reunião com ${prospectName} (${companyName}) — ${turns.length} turnos processados.`,
        mainProblem: "Síntese LLM indisponível — verifique OPENROUTER_API_KEY e reprocessar.",
        constraint: "",
        opportunity: "",
      },
      whatWeLearned: [],
      criticalUnknowns: [],
      secondaryUnknowns: [],
      synthesizedAt: new Date().toISOString(),
      synthesisError: reason,
    },
    summary: `${turns.length} turnos na reunião com ${prospectName}.`,
    diagnosticState: null,
    businessProfile: null,
    coverage: null,
    knowledgeDepth: 0,
  };
}

export interface MeetingSynthesisResult {
  graph: EvidenceGraphItem[];
  synthesis: MeetingSynthesis;
  summary: string;
  diagnosticState: DiagnosticState | null;
  businessProfile: ReturnType<typeof buildBusinessProfileFromGraph> | null;
  coverage: ReturnType<typeof computeDomainCoverage> | null;
  knowledgeDepth: number;
}

export async function synthesizeMeeting(input: {
  transcript: TranscriptSegment[];
  prospectName: string;
  companyName: string;
  existingDiagnosticState: DiagnosticState;
}): Promise<MeetingSynthesisResult> {
  const normalized = normalizeTranscript(input.transcript, {
    prospectName: input.prospectName,
    companyName: input.companyName,
  });

  if (normalized.length === 0) {
    return fallbackSynthesis([], input.prospectName, input.companyName, "Transcript vazio");
  }

  if (!isLlmConfigured()) {
    return fallbackSynthesis(
      normalized,
      input.prospectName,
      input.companyName,
      "OPENROUTER_API_KEY não configurada no servidor",
    );
  }

  const { turns: refined, error: refineError } = await refineTranscript(normalized, {
    prospectName: input.prospectName,
    companyName: input.companyName,
  });

  const turns: TurnForSynthesis[] = refined.length > 0 ? refined : normalized;
  const transcriptText =
    refined.length > 0 ? refinedTurnsToText(refined) : normalizedTurnsToText(normalized);
  const truncated =
    transcriptText.length > 48000
      ? transcriptText.slice(0, 48000) + "\n[... transcript truncado ...]"
      : transcriptText;

  const parsed = await chatCompletionJson<SynthesisLlmResponse>({
    messages: [
      {
        role: "system",
        content: `Você é o motor de síntese do Raise One Copilot. Analise a reunião comercial COMPLETA e extraia conhecimento estruturado.

Objective keys válidas (opcional): ${OBJECTIVE_KEYS.join(", ")}

REGRAS:
1. Extraia fatos do PROSPECT como kind=fact, source=prospect.
2. Falas do CONSULTOR/R1 sobre estratégia = source=consultant ou r1 — use kind=hypothesis ou opportunity, NUNCA fact do negócio do prospect.
3. Oportunidades de mercado sugeridas pela R1 = kind=opportunity, source=r1.
4. Inferências seguras = kind=inference.
5. whatWeLearned: 8-15 bullets curtos em PT-BR com os principais aprendizados (NUNCA copie trechos crus do transcript).
6. diagnosis: situation (2-3 frases), mainProblem, constraint (restrição operacional), opportunity (para R1).
7. criticalUnknowns: o que falta para proposta (comissão, ticket, orçamento, conversão).
8. secondaryUnknowns: gaps secundários.
9. items: máximo 40 itens, priorize fatos do prospect.

JSON:
{
  "items": [{ "domain": "business|commercial|...", "label": "", "value": "", "kind": "fact|inference|hypothesis|opportunity", "source": "prospect|consultant|r1|ai", "confidence": "low|medium|high", "quote": "trecho", "objectiveKey": "opcional" }],
  "diagnosis": { "situation": "", "mainProblem": "", "constraint": "", "opportunity": "" },
  "whatWeLearned": ["..."],
  "criticalUnknowns": ["..."],
  "secondaryUnknowns": ["..."],
  "summary": "3-5 frases para o consultor"
}`,
      },
      {
        role: "user",
        content: `Prospect: ${input.prospectName}\nEmpresa: ${input.companyName}\nTurnos refinados: ${refined.length || normalized.length}\n\nTRANSCRIPT REFINADO:\n${truncated}`,
      },
    ],
    temperature: 0.2,
    maxTokens: 8192,
  });

  if (!parsed?.items?.length && !parsed?.whatWeLearned?.length) {
    const reason = refineError
      ? `Refino: ${refineError}; síntese: resposta LLM vazia ou JSON inválido`
      : "Resposta LLM vazia ou JSON inválido — verifique logs do servidor";
    console.error("[meeting-synthesizer] fallback:", reason);
    return fallbackSynthesis(turns, input.prospectName, input.companyName, reason);
  }

  const graph = llmItemsToGraph(parsed.items ?? [], turns);
  const knowledgeDepth = computeKnowledgeDepth(graph);

  const synthesis: MeetingSynthesis = {
    diagnosis: {
      situation: parsed.diagnosis?.situation ?? "Situação em análise.",
      mainProblem: parsed.diagnosis?.mainProblem ?? "",
      constraint: parsed.diagnosis?.constraint ?? "",
      opportunity: parsed.diagnosis?.opportunity ?? "",
    },
    whatWeLearned: parsed.whatWeLearned ?? [],
    criticalUnknowns: parsed.criticalUnknowns ?? [],
    secondaryUnknowns: parsed.secondaryUnknowns ?? [],
    synthesizedAt: new Date().toISOString(),
    refinedTurnCount: refined.length || normalized.length,
    refinedTranscript: refined.slice(0, 120).map((t) => ({
      speaker: t.speaker,
      text: t.text,
    })),
    ...(refineError ? { synthesisError: `Refino parcial: ${refineError}` } : {}),
  };

  const diagnosticState = mergeIntoDiagnosticState(input.existingDiagnosticState, graph);
  const businessProfile = buildBusinessProfileFromGraph(graph, {
    companyName: input.companyName,
    contactName: input.prospectName,
  });
  const coverage = computeDomainCoverage(diagnosticState);

  return {
    graph,
    synthesis,
    summary: parsed.summary ?? synthesis.diagnosis.situation,
    diagnosticState,
    businessProfile,
    coverage,
    knowledgeDepth,
  };
}

export function applySynthesisToSnapshot(
  snapshot: import("../types").CopilotSessionSnapshot,
  result: MeetingSynthesisResult,
): import("../types").CopilotSessionSnapshot {
  if (!result.diagnosticState || !result.businessProfile || !result.coverage) {
    return {
      ...snapshot,
      evidenceGraph: result.graph,
      knowledgeDepth: result.knowledgeDepth,
    };
  }

  return {
    ...snapshot,
    diagnosticState: result.diagnosticState,
    businessProfile: result.businessProfile,
    coverage: result.coverage,
    overallCoverage: computeOverallCoverage(result.coverage),
    proposalReadiness: computeProposalReadiness(result.diagnosticState),
    evidenceGraph: result.graph,
    knowledgeDepth: result.knowledgeDepth,
  };
}
