import { getObjectiveByKey } from "../knowledge";
import type { DataInconsistency, DiagnosticState, Evidence } from "../types";
import { isObjectiveSatisfied } from "./diagnostic-engine";

function formatEvidenceValue(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "object" && value !== null && "min" in value) {
    const r = value as { min?: number; max?: number };
    return r.min != null && r.max != null ? `~${r.min}-${r.max}` : `~${r.min ?? r.max}`;
  }
  return String(value);
}

function numericRangeOverlaps(a: unknown, b: unknown): boolean {
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
  const ra = a as { min?: number; max?: number };
  const rb = b as { min?: number; max?: number };
  if (ra.min == null || rb.min == null) return false;
  const aMax = ra.max ?? ra.min;
  const bMax = rb.max ?? rb.min;
  return !(aMax < rb.min * 0.5 || bMax < ra.min * 0.5);
}

export function detectInconsistencies(
  diagnosticState: DiagnosticState,
  objectiveKey: string,
  incoming: Evidence,
): DataInconsistency[] {
  const existing = diagnosticState[objectiveKey];
  if (!existing?.evidence || !isObjectiveSatisfied(existing)) return [];

  const obj = getObjectiveByKey(objectiveKey);
  const label = obj?.label ?? objectiveKey;
  const prev = existing.evidence;
  const prevStr = formatEvidenceValue(prev.value);
  const nextStr = formatEvidenceValue(incoming.value);

  if (prevStr === nextStr) return [];

  if (
    typeof prev.value === "object" &&
    typeof incoming.value === "object" &&
    numericRangeOverlaps(prev.value, incoming.value)
  ) {
    return [];
  }

  return [
    {
      objectiveKey,
      label,
      previousValue: prevStr,
      newValue: nextStr,
      previousQuote: prev.quote,
      newQuote: incoming.quote,
    },
  ];
}

export function markContradicted(
  diagnosticState: DiagnosticState,
  objectiveKey: string,
  incoming: Evidence,
): DiagnosticState {
  const existing = diagnosticState[objectiveKey];
  return {
    ...diagnosticState,
    [objectiveKey]: {
      state: "contradicted",
      evidence: incoming,
      history: existing?.evidence
        ? [...(existing.history ?? []), existing.evidence]
        : (existing?.history ?? []),
    },
  };
}
