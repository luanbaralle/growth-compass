import { findMarketingSnapshots } from "@/domains/marketing/repository.server";
import type { MarketingChannel, MarketingSnapshot } from "@/domains/marketing/types";
import { CHANNEL_LABELS } from "@/domains/marketing/types";
import {
  aggregateSnapshots,
  buildLeadsTrend,
  buildMonthNarrative,
  monthRange,
  pctDelta,
  snapshotOverlapsMonth,
} from "./marketing-metrics.server";
import type { ClientResultsOverview } from "./types";

function channelMetrics(snapshots: MarketingSnapshot[], channel: MarketingChannel) {
  const filtered = snapshots.filter((s) => s.channel === channel);
  const metrics = aggregateSnapshots(filtered);
  const primary = filtered.sort((a, b) => b.period_end.localeCompare(a.period_end))[0];

  return {
    channel,
    label: CHANNEL_LABELS[channel],
    hasData: filtered.length > 0,
    periodLabel: primary
      ? `${primary.period_start.split("-").reverse().slice(0, 2).join("/")} – ${primary.period_end.split("-").reverse().slice(0, 2).join("/")}`
      : null,
    investmentCents: metrics.investmentCents,
    leads: metrics.leads,
    conversions: metrics.conversions,
    cplCents: metrics.cplCents,
    ctr: metrics.ctr,
  };
}

export async function getClientResultsOverview(companyId: string): Promise<ClientResultsOverview> {
  const snapshots = await findMarketingSnapshots({ companyId });
  const current = monthRange(0);
  const previous = monthRange(-1);

  const currentSnapshots = snapshots.filter((s) =>
    snapshotOverlapsMonth(s, current.start, current.end),
  );
  const previousSnapshots = snapshots.filter((s) =>
    snapshotOverlapsMonth(s, previous.start, previous.end),
  );

  const currentMetrics = aggregateSnapshots(currentSnapshots);
  const previousMetrics = aggregateSnapshots(previousSnapshots);
  const leadsDeltaPct = pctDelta(currentMetrics.leads, previousMetrics.leads);
  const investmentDeltaPct = pctDelta(
    currentMetrics.investmentCents,
    previousMetrics.investmentCents,
  );
  const cplDeltaPct =
    currentMetrics.cplCents != null && previousMetrics.cplCents != null
      ? pctDelta(currentMetrics.cplCents, previousMetrics.cplCents)
      : null;

  const narrative = buildMonthNarrative({
    leadsDeltaPct,
    cplDeltaPct,
    leads: currentMetrics.leads,
  });

  return {
    periodLabel: current.label,
    previousPeriodLabel: previous.label,
    hasData: currentSnapshots.length > 0,
    summary: {
      investmentCents: currentMetrics.investmentCents,
      leads: currentMetrics.leads,
      conversions: currentMetrics.conversions,
      cplCents: currentMetrics.cplCents,
      ctr: currentMetrics.ctr,
    },
    comparison: {
      leads: {
        current: currentMetrics.leads,
        previous: previousMetrics.leads,
        deltaPct: leadsDeltaPct,
      },
      investment: {
        current: currentMetrics.investmentCents,
        previous: previousMetrics.investmentCents,
        deltaPct: investmentDeltaPct,
      },
      cpl: {
        current: currentMetrics.cplCents,
        previous: previousMetrics.cplCents,
        deltaPct: cplDeltaPct,
      },
    },
    channels: [
      channelMetrics(currentSnapshots, "google_ads"),
      channelMetrics(currentSnapshots, "meta_ads"),
    ],
    leadsTrend: buildLeadsTrend(snapshots),
    monthReport: {
      periodLabel: current.label,
      leads: currentMetrics.leads,
      leadsDeltaPct,
      investmentCents: currentMetrics.investmentCents,
      cplCents: currentMetrics.cplCents,
      cplDeltaPct,
      highlight: narrative.highlight,
      nextFocus: narrative.nextFocus,
    },
  };
}
