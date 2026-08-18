import { getKnowledgeGraph, getObjectiveByKey } from "../knowledge";
import { DIAGNOSTIC_DOMAIN_LABELS } from "../knowledge/domains";
import {
  dependenciesMet,
  isObjectiveSatisfied,
} from "./diagnostic-engine";
import type {
  ConversationThread,
  DiagnosticDomain,
  DiagnosticState,
  SuggestionCard,
} from "../types";

const IMPORTANCE_WEIGHT: Record<string, number> = {
  critical: 1,
  high: 0.75,
  medium: 0.5,
  low: 0.25,
};

function missingnessWeight(state: DiagnosticState[string] | undefined): number {
  if (!state || state.state === "unknown") return 1;
  if (state.state === "exploring") return 0.7;
  if (state.state === "captured" && state.evidence?.confidence === "low") return 0.4;
  return 0;
}

function contextualBoost(
  objectiveKey: string,
  activeDomain: DiagnosticDomain | null,
  recentObjectiveKeys: string[],
): number {
  const obj = getObjectiveByKey(objectiveKey);
  if (!obj) return 1;

  let boost = 1;

  if (activeDomain && obj.domain === activeDomain) {
    boost *= 1.35;
  }

  for (const related of obj.relatedObjectives ?? []) {
    if (recentObjectiveKeys.includes(related)) {
      boost *= 1.25;
      break;
    }
  }

  if (recentObjectiveKeys.some((k) => obj.dependencies?.includes(k))) {
    boost *= 1.2;
  }

  return boost;
}

export function scoreNextQuestion(
  objectiveKey: string,
  diagnosticState: DiagnosticState,
  activeDomain: DiagnosticDomain | null,
  recentObjectiveKeys: string[],
): number {
  const obj = getObjectiveByKey(objectiveKey);
  if (!obj) return 0;
  if (isObjectiveSatisfied(diagnosticState[objectiveKey])) return 0;
  if (!dependenciesMet(objectiveKey, diagnosticState)) return 0;

  const importance = IMPORTANCE_WEIGHT[obj.importance] ?? 0.5;
  const missing = missingnessWeight(diagnosticState[objectiveKey]);
  const context = contextualBoost(objectiveKey, activeDomain, recentObjectiveKeys);

  return importance * missing * context;
}

export function resolveNextBestQuestion(
  diagnosticState: DiagnosticState,
  options: {
    activeDomain?: DiagnosticDomain | null;
    recentObjectiveKeys?: string[];
    meetingPhase?: import("../types").MeetingPhase;
    suppress?: boolean;
  } = {},
): SuggestionCard | null {
  if (options.suppress) return null;

  const phase = options.meetingPhase ?? "discovery";
  if (phase === "opening" || phase === "closing" || phase === "context") {
    return null;
  }

  const activeDomain = options.activeDomain ?? null;
  const recent = options.recentObjectiveKeys ?? [];

  let best: SuggestionCard | null = null;
  let bestScore = 0;

  for (const obj of getKnowledgeGraph()) {
    const score = scoreNextQuestion(obj.key, diagnosticState, activeDomain, recent);
    if (score <= bestScore) continue;

    const question = obj.questions[0] ?? `Aprofundar: ${obj.label}`;
    bestScore = score;
    best = {
      objectiveKey: obj.key,
      exploreLabel: "Explore",
      suggestedQuestion: question,
      reason: buildReason(obj.key, diagnosticState, activeDomain),
      score,
    };
  }

  return bestScore > 0.35 ? best : null;
}

function buildReason(
  objectiveKey: string,
  diagnosticState: DiagnosticState,
  activeDomain: DiagnosticDomain | null,
): string {
  const obj = getObjectiveByKey(objectiveKey);
  if (!obj) return "";

  if (objectiveKey === "lead_volume" && isObjectiveSatisfied(diagnosticState.referral_dependency)) {
    return "Dependência de indicação identificada — quantificar volume destrava conversão e meta.";
  }

  if (activeDomain && obj.domain === activeDomain) {
    return `Thread atual: ${DIAGNOSTIC_DOMAIN_LABELS[activeDomain]} — falta evidência sobre ${obj.label.toLowerCase()}.`;
  }

  if (obj.proposalCritical) {
    return `Crítico para proposal readiness: ${obj.whyItMatters}`;
  }

  return obj.whyItMatters;
}

export function buildCurrentThread(
  activeDomain: DiagnosticDomain | null,
  diagnosticState: DiagnosticState,
  latestInsightSummary?: string,
): ConversationThread | null {
  if (!activeDomain) return null;

  const label = DIAGNOSTIC_DOMAIN_LABELS[activeDomain];
  const inDomain = getKnowledgeGraph().filter((o) => o.domain === activeDomain);
  const captured = inDomain.filter((o) => isObjectiveSatisfied(diagnosticState[o.key]));

  const summary =
    latestInsightSummary ??
    (captured.length > 0
      ? `${captured.length} ponto(s) mapeado(s) em ${label}.`
      : `Explorando ${label}.`);

  return { domain: activeDomain, label, summary };
}
