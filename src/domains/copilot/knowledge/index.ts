import { QUALIFICATION_V1_OBJECTIVES } from "./objectives/qualification-v1";
import { DIAGNOSTIC_DOMAIN_ORDER } from "./domains";
import type { DiagnosticDomain, DiscoveryObjective } from "../types";

const byKey = new Map<string, DiscoveryObjective>(
  QUALIFICATION_V1_OBJECTIVES.map((o) => [o.key, o]),
);

export function getKnowledgeGraph(mode: "discovery_qualification" = "discovery_qualification") {
  if (mode !== "discovery_qualification") {
    return QUALIFICATION_V1_OBJECTIVES;
  }
  return QUALIFICATION_V1_OBJECTIVES;
}

export function getObjectiveByKey(key: string): DiscoveryObjective | undefined {
  return byKey.get(key);
}

export function getObjectivesByDomain(domain: DiagnosticDomain): DiscoveryObjective[] {
  return QUALIFICATION_V1_OBJECTIVES.filter((o) => o.domain === domain);
}

export function getAllObjectiveKeys(): string[] {
  return QUALIFICATION_V1_OBJECTIVES.map((o) => o.key);
}

export function countObjectivesByDomain(): Record<DiagnosticDomain, number> {
  const counts = Object.fromEntries(
    DIAGNOSTIC_DOMAIN_ORDER.map((d) => [d, 0]),
  ) as Record<DiagnosticDomain, number>;
  for (const o of QUALIFICATION_V1_OBJECTIVES) {
    counts[o.domain]++;
  }
  return counts;
}

export { QUALIFICATION_V1_OBJECTIVES, CRITICAL_GATE_OBJECTIVES } from "./objectives/qualification-v1";
