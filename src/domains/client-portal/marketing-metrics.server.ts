import type { MarketingSnapshot } from "@/domains/marketing/types";

export function monthRange(offsetMonths = 0): { start: string; end: string; label: string } {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const label = start.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    label,
  };
}

export function snapshotOverlapsMonth(
  snapshot: MarketingSnapshot,
  start: string,
  end: string,
): boolean {
  return snapshot.period_start <= end && snapshot.period_end >= start;
}

export type AggregatedMetrics = {
  investmentCents: number;
  leads: number;
  conversions: number;
  cplCents: number | null;
  ctr: number | null;
};

export function aggregateSnapshots(snapshots: MarketingSnapshot[]): AggregatedMetrics {
  let investmentCents = 0;
  let leads = 0;
  let conversions = 0;
  let ctrSum = 0;
  let ctrCount = 0;

  for (const row of snapshots) {
    investmentCents += row.investment_cents ?? 0;
    leads += row.leads ?? 0;
    conversions += row.conversions ?? 0;
    if (row.ctr != null) {
      ctrSum += row.ctr;
      ctrCount++;
    }
  }

  return {
    investmentCents,
    leads,
    conversions,
    cplCents: leads > 0 ? Math.round(investmentCents / leads) : null,
    ctr: ctrCount > 0 ? ctrSum / ctrCount : null,
  };
}

export function pctDelta(current: number, previous: number): number | null {
  if (previous <= 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function buildLeadsTrend(
  snapshots: MarketingSnapshot[],
  monthCount = 6,
): Array<{ key: string; label: string; leads: number }> {
  const points: Array<{ key: string; label: string; leads: number }> = [];

  for (let offset = monthCount - 1; offset >= 0; offset -= 1) {
    const range = monthRange(-offset);
    const monthSnapshots = snapshots.filter((s) =>
      snapshotOverlapsMonth(s, range.start, range.end),
    );
    const leads = monthSnapshots.reduce((sum, row) => sum + (row.leads ?? 0), 0);
    const shortLabel = new Date(`${range.start}T12:00:00`).toLocaleDateString("pt-BR", {
      month: "short",
    });
    points.push({
      key: range.start.slice(0, 7),
      label: shortLabel.charAt(0).toUpperCase() + shortLabel.slice(1),
      leads,
    });
  }

  return points;
}

export function buildMonthNarrative(input: {
  leadsDeltaPct: number | null;
  cplDeltaPct: number | null;
  leads: number;
}): { highlight: string | null; nextFocus: string | null } {
  const { leadsDeltaPct, cplDeltaPct, leads } = input;

  if (leadsDeltaPct != null && cplDeltaPct != null && leadsDeltaPct > 0 && cplDeltaPct < 0) {
    return {
      highlight: `Seu custo por lead caiu ${Math.abs(cplDeltaPct)}% enquanto o volume de leads aumentou ${leadsDeltaPct}%.`,
      nextFocus:
        "Para o próximo ciclo, a Raise One vai concentrar esforços em escalar os conjuntos de anúncios com menor custo por lead.",
    };
  }

  if (leadsDeltaPct != null && leadsDeltaPct > 0) {
    return {
      highlight: `Seus leads aumentaram ${leadsDeltaPct}% em relação ao mês anterior.`,
      nextFocus: "Próximo foco: manter o volume e melhorar a qualificação dos contatos gerados.",
    };
  }

  if (leadsDeltaPct != null && leadsDeltaPct < 0) {
    return {
      highlight: `O volume de leads ficou ${Math.abs(leadsDeltaPct)}% abaixo do mês anterior.`,
      nextFocus: "Próximo foco: ajustar campanhas e criativos para recuperar a geração de leads.",
    };
  }

  if (leads > 0) {
    return {
      highlight: `Seu marketing gerou ${leads} leads neste período.`,
      nextFocus: null,
    };
  }

  return { highlight: null, nextFocus: null };
}
