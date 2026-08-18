/**
 * Calcula Knowledge Depth — riqueza do conhecimento adquirido na reunião.
 */
import type { DiagnosticDomain, EvidenceGraphItem } from "../types";

const DOMAIN_WEIGHT: Record<string, number> = {
  business: 1.2,
  offer: 1.1,
  customer: 1,
  commercial: 1.3,
  economics: 1.4,
  acquisition: 1.3,
  marketing: 1.1,
  brand: 0.9,
  content: 0.8,
  goals: 1.2,
  expectations: 1,
  investment: 1.3,
  risks: 1.1,
  opportunities: 1,
};

const KIND_WEIGHT: Record<string, number> = {
  fact: 1,
  inference: 0.7,
  hypothesis: 0.5,
  opportunity: 0.6,
};

const CONF_WEIGHT: Record<string, number> = {
  high: 1,
  medium: 0.75,
  low: 0.4,
};

export function computeKnowledgeDepth(items: EvidenceGraphItem[]): number {
  if (items.length === 0) return 0;

  let score = 0;
  const domainsSeen = new Set<string>();

  for (const item of items) {
    const dw = DOMAIN_WEIGHT[item.domain] ?? 1;
    const kw = KIND_WEIGHT[item.kind] ?? 0.5;
    const cw = CONF_WEIGHT[item.confidence] ?? 0.5;
    score += dw * kw * cw * 4;
    domainsSeen.add(item.domain);
  }

  const domainBonus = Math.min(15, domainsSeen.size * 2);
  const raw = score + domainBonus;
  return Math.min(100, Math.round(raw));
}

export function groupEvidenceByDomain(
  items: EvidenceGraphItem[],
): Partial<Record<DiagnosticDomain | "risks" | "opportunities", EvidenceGraphItem[]>> {
  const map: Partial<Record<DiagnosticDomain | "risks" | "opportunities", EvidenceGraphItem[]>> =
    {};
  for (const item of items) {
    const list = map[item.domain] ?? [];
    list.push(item);
    map[item.domain] = list;
  }
  return map;
}
