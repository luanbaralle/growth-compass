import { getKnowledgeGraph, getObjectiveByKey } from "../knowledge";
import {
  DIAGNOSTIC_DOMAIN_LABELS,
  DIAGNOSTIC_DOMAIN_ORDER,
} from "../knowledge/domains";
import type {
  DiagnosticDomain,
  DiagnosticState,
  DomainCoverage,
  ObjectiveRecord,
  ObjectiveState,
  ProposalReadiness,
  ProposalReadinessItem,
} from "../types";
import { CRITICAL_GATE_OBJECTIVES } from "../knowledge/objectives/qualification-v1";

export function createEmptyDiagnosticState(): DiagnosticState {
  const state: DiagnosticState = {};
  for (const obj of getKnowledgeGraph()) {
    state[obj.key] = { state: "unknown", evidence: null, history: [] };
  }
  return state;
}

export function isObjectiveSatisfied(record: ObjectiveRecord | undefined): boolean {
  if (!record) return false;
  return record.state === "captured" || record.state === "verified";
}

export function dependenciesMet(
  objectiveKey: string,
  diagnosticState: DiagnosticState,
): boolean {
  const obj = getObjectiveByKey(objectiveKey);
  if (!obj?.dependencies?.length) return true;
  return obj.dependencies.every((dep) => isObjectiveSatisfied(diagnosticState[dep]));
}

export function computeDomainCoverage(diagnosticState: DiagnosticState): DomainCoverage[] {
  return DIAGNOSTIC_DOMAIN_ORDER.map((domain) => {
    const objectives = getKnowledgeGraph().filter((o) => o.domain === domain);
    const captured = objectives.filter((o) =>
      isObjectiveSatisfied(diagnosticState[o.key]),
    ).length;
    const total = objectives.length;
    const percent = total === 0 ? 0 : Math.round((captured / total) * 100);
    return {
      domain,
      label: DIAGNOSTIC_DOMAIN_LABELS[domain],
      percent,
      captured,
      total,
    };
  }).filter((d) => d.total > 0);
}

export function computeOverallCoverage(coverage: DomainCoverage[]): number {
  const withObjectives = coverage.filter((c) => c.total > 0);
  if (withObjectives.length === 0) return 0;
  const sum = withObjectives.reduce((acc, c) => acc + c.percent, 0);
  return Math.round(sum / withObjectives.length);
}

export function computeProposalReadiness(
  diagnosticState: DiagnosticState,
): ProposalReadiness {
  const criticalKeys = getKnowledgeGraph().filter((o) => o.proposalCritical);
  const items: ProposalReadinessItem[] = criticalKeys.map((obj) => {
    const record = diagnosticState[obj.key];
    let status: ProposalReadinessItem["status"] = "missing";
    if (record?.state === "verified") status = "ready";
    else if (record?.state === "captured") {
      status =
        record.evidence?.confidence === "high" ? "ready" : "partial";
    } else if (record?.state === "exploring") status = "partial";
    return { key: obj.key, label: obj.label, status };
  });

  const missing = items.filter((i) => i.status === "missing");
  const partial = items.filter((i) => i.status === "partial");

  let status: ProposalReadiness["status"] = "ready";
  if (missing.length > 0) status = "not_ready";
  else if (partial.length > 0) status = "partial";

  const blockers = missing.map((i) => i.label);

  if (blockers.length > 0) {
    blockers.unshift(
      "Antes de montar a proposta, esclareça os pontos críticos abaixo.",
    );
  }

  return { items, status, blockers };
}

export function getUnknownObjectives(diagnosticState: DiagnosticState): string[] {
  return getKnowledgeGraph()
    .filter((o) => {
      const s = diagnosticState[o.key]?.state;
      return s === "unknown" || s === "exploring";
    })
    .map((o) => o.label);
}

export function getCriticalGateProgress(diagnosticState: DiagnosticState): {
  captured: number;
  total: number;
} {
  const captured = CRITICAL_GATE_OBJECTIVES.filter((key) =>
    isObjectiveSatisfied(diagnosticState[key]),
  ).length;
  return { captured, total: CRITICAL_GATE_OBJECTIVES.length };
}

export function upsertEvidence(
  diagnosticState: DiagnosticState,
  objectiveKey: string,
  evidence: NonNullable<ObjectiveRecord["evidence"]>,
): DiagnosticState {
  const existing = diagnosticState[objectiveKey] ?? {
    state: "unknown" as ObjectiveState,
    evidence: null,
    history: [],
  };

  const nextState: ObjectiveState =
    evidence.source === "human_verified"
      ? "verified"
      : evidence.confidence === "high"
        ? "captured"
        : "captured";

  return {
    ...diagnosticState,
    [objectiveKey]: {
      state: nextState,
      evidence,
      history: existing.evidence
        ? [...existing.history, existing.evidence]
        : existing.history,
    },
  };
}

export function markExploring(
  diagnosticState: DiagnosticState,
  objectiveKey: string,
): DiagnosticState {
  const existing = diagnosticState[objectiveKey];
  if (existing?.state === "captured" || existing?.state === "verified") {
    return diagnosticState;
  }
  return {
    ...diagnosticState,
    [objectiveKey]: {
      ...existing,
      state: "exploring",
      evidence: existing?.evidence ?? null,
      history: existing?.history ?? [],
    },
  };
}

export function getActiveDomain(
  diagnosticState: DiagnosticState,
): DiagnosticDomain | null {
  const coverage = computeDomainCoverage(diagnosticState);
  const incomplete = coverage.filter((c) => c.percent < 100 && c.percent > 0);
  if (incomplete.length > 0) {
    return incomplete.sort((a, b) => a.percent - b.percent)[0]!.domain;
  }
  const empty = coverage.filter((c) => c.percent === 0);
  if (empty.length > 0) return empty[0]!.domain;
  return null;
}
