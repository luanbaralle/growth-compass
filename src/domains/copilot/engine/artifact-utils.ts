import { getKnowledgeGraph } from "../knowledge";
import { isObjectiveSatisfied } from "./diagnostic-engine";
import type { DiagnosticState, EvidenceGraphItem } from "../types";

function normalizeUnknown(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const UNKNOWN_SYNONYMS: Array<[RegExp, RegExp]> = [
  [/ticket|valor m[eé]dio.*venda|m[eé]dia de ticket/i, /valor m[eé]dio|ticket/i],
  [/comiss/i, /comiss/i],
  [/or[cç]amento|budget|invest.*marketing/i, /or[cç]amento|marketing/i],
  [/volume de venda|vendas.*m[eê]s/i, /volume de venda/i],
  [/tipo de cliente|icp|p[uú]blico/i, /tipo de cliente|icp/i],
  [/meta.*cresc|leads.*vendas/i, /meta|volume de lead/i],
];

function areSimilarUnknowns(a: string, b: string): boolean {
  const na = normalizeUnknown(a);
  const nb = normalizeUnknown(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;

  for (const [pa, pb] of UNKNOWN_SYNONYMS) {
    if ((pa.test(a) || pa.test(na)) && (pb.test(b) || pb.test(nb))) return true;
    if ((pa.test(b) || pa.test(nb)) && (pb.test(a) || pb.test(na))) return true;
  }
  return false;
}

function pushUnique(list: string[], item: string): void {
  if (!item.trim()) return;
  if (list.some((existing) => areSimilarUnknowns(existing, item))) return;
  list.push(item.trim());
}

export function buildPrioritizedUnknowns(
  criticalFromSynthesis: string[],
  secondaryFromSynthesis: string[],
  diagnosticState: DiagnosticState,
  maxTotal = 10,
): { critical: string[]; secondary: string[] } {
  const critical: string[] = [];
  const secondary: string[] = [];

  for (const u of criticalFromSynthesis) pushUnique(critical, u);
  for (const u of secondaryFromSynthesis) {
    if (!critical.some((c) => areSimilarUnknowns(c, u))) {
      pushUnique(secondary, u);
    }
  }

  for (const obj of getKnowledgeGraph()) {
    if (!obj.proposalCritical) continue;
    if (isObjectiveSatisfied(diagnosticState[obj.key])) continue;
    const label = obj.label;
    const inCritical = critical.some((c) => areSimilarUnknowns(c, label));
    const inSecondary = secondary.some((s) => areSimilarUnknowns(s, label));
    if (!inCritical && !inSecondary) {
      pushUnique(secondary, label);
    }
  }

  return {
    critical: critical.slice(0, maxTotal),
    secondary: secondary.slice(0, Math.max(0, maxTotal - critical.length)),
  };
}

export function formatOpportunityItem(item: EvidenceGraphItem): {
  label: string;
  summary: string;
  detail?: string;
} {
  const value = item.value?.trim() ?? "";
  const label = item.label?.trim() ?? "Oportunidade";
  const quote = item.quote?.trim();

  const summary =
    value.length >= 12 && value.length <= 200
      ? value
      : `${label}: ${value}`.replace(/:\s*$/, "");

  const detail =
    quote && quote.length >= 20 && quote.length <= 140 && quote !== value
      ? quote
      : undefined;

  return { label, summary, detail };
}
