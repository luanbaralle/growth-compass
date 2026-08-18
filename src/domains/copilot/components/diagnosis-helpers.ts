import type { EvidenceGraphItem, EvidenceKind, ProposalReadiness } from "../types";

export function computeProposalReadinessPercent(readiness: ProposalReadiness): number {
  if (readiness.items.length === 0) return 0;
  const score = readiness.items.reduce((acc, item) => {
    if (item.status === "ready") return acc + 1;
    if (item.status === "partial") return acc + 0.5;
    return acc;
  }, 0);
  return Math.round((score / readiness.items.length) * 100);
}

export const KIND_META: Record<
  EvidenceKind,
  { label: string; dot: string; badge: string }
> = {
  fact: {
    label: "Fato",
    dot: "bg-emerald-500",
    badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  inference: {
    label: "Inferência",
    dot: "bg-violet-500",
    badge: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
  hypothesis: {
    label: "Hipótese",
    dot: "bg-amber-500",
    badge: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  opportunity: {
    label: "Oportunidade",
    dot: "bg-sky-500",
    badge: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
};

export function inferKindFromText(text: string): EvidenceKind {
  const lower = text.toLowerCase();
  if (/oportunidad|potencial|nicho|escalar|validar demanda/.test(lower)) return "opportunity";
  if (/pode |talvez|hipótese|provavelmente|parece que|acredito/.test(lower)) return "hypothesis";
  if (/depende|infer|indica|sugere|significa/.test(lower)) return "inference";
  return "fact";
}

export interface LearnedDisplayItem {
  id: string;
  text: string;
  kind: EvidenceKind;
  segmentIds: string[];
}

export function buildLearnedItems(
  whatWeLearned: string[],
  evidenceGraph: EvidenceGraphItem[],
): LearnedDisplayItem[] {
  if (evidenceGraph.length > 0) {
    const priority: Record<EvidenceKind, number> = {
      fact: 0,
      inference: 1,
      hypothesis: 2,
      opportunity: 3,
    };
    return [...evidenceGraph]
      .sort((a, b) => priority[a.kind] - priority[b.kind])
      .map((item) => ({
        id: item.id,
        text: item.value || item.label,
        kind: item.kind,
        segmentIds: item.segmentIds,
      }));
  }

  return whatWeLearned.map((text, index) => ({
    id: `learned-${index}`,
    text,
    kind: inferKindFromText(text),
    segmentIds: [],
  }));
}

export function groupUnknowns(input: {
  critical: string[];
  secondary: string[];
  all: string[];
}): { critical: string[]; important: string[]; secondary: string[] } {
  const critical = input.critical;
  const important = input.secondary.filter((item) => !critical.includes(item));
  const known = new Set([...critical, ...important]);
  const secondary = input.all.filter((item) => !known.has(item));
  return { critical, important, secondary };
}
