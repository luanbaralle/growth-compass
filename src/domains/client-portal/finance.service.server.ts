import { findFinanceEntries } from "@/domains/finance/repository.server";
import type { FinanceEntry } from "@/domains/finance/types";
import {
  effectiveFinanceStatus,
  formatMoney,
  TYPE_LABELS,
} from "@/domains/finance/types";
import { findMarketingSnapshots } from "@/domains/marketing/repository.server";
import type { MarketingSnapshot } from "@/domains/marketing/types";
import {
  translateFinanceStatusClient,
  translateSubscriptionStatus,
} from "./translate";
import type {
  ClientFinanceHistoryItem,
  ClientFinanceMediaInvestment,
  ClientFinanceOverview,
  ClientFinanceSubscription,
} from "./types";

function monthRange(): { start: string; end: string; label: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    label: start.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  };
}

function snapshotOverlapsMonth(snapshot: MarketingSnapshot, start: string, end: string): boolean {
  return snapshot.period_start <= end && snapshot.period_end >= start;
}

function formatDueDate(iso: string | null): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return null;
  return `${d}/${m}/${y}`;
}

function historyPeriodLabel(entry: FinanceEntry): string {
  const [y, m] = entry.due_date.split("-");
  if (!y || !m) return entry.description;
  const date = new Date(Number(y), Number(m) - 1, 1);
  const month = date.toLocaleDateString("pt-BR", { month: "long" });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${y}`;
}

function buildSubscription(entries: FinanceEntry[]): ClientFinanceSubscription | null {
  const monthly = entries
    .filter((e) => e.type === "monthly" && effectiveFinanceStatus(e) !== "cancelled")
    .sort((a, b) => b.due_date.localeCompare(a.due_date));

  if (monthly.length === 0) return null;

  const reference = monthly[0];
  const open = monthly.filter((e) => {
    const status = effectiveFinanceStatus(e);
    return status === "pending" || status === "overdue";
  });

  const overdue = open.some((e) => effectiveFinanceStatus(e) === "overdue");
  const today = new Date().toISOString().slice(0, 10);
  const pendingSoon = open.some((e) => {
    const status = effectiveFinanceStatus(e);
    return status === "pending" && e.due_date >= today;
  });

  const nextOpen = open.sort((a, b) => a.due_date.localeCompare(b.due_date))[0];
  const subscriptionStatus = translateSubscriptionStatus(overdue, pendingSoon);

  return {
    label: reference.description.trim() || TYPE_LABELS.monthly,
    amountCents: reference.amount_cents,
    nextDueDate: nextOpen?.due_date ?? null,
    nextDueDateLabel: formatDueDate(nextOpen?.due_date ?? null),
    statusLabel: subscriptionStatus.label,
    statusTone: subscriptionStatus.tone,
  };
}

function buildMediaInvestment(snapshots: MarketingSnapshot[]): ClientFinanceMediaInvestment {
  const period = monthRange();
  const current = snapshots.filter((s) => snapshotOverlapsMonth(s, period.start, period.end));

  let googleAdsCents = 0;
  let metaAdsCents = 0;
  for (const row of current) {
    const amount = row.investment_cents ?? 0;
    if (row.channel === "google_ads") googleAdsCents += amount;
    if (row.channel === "meta_ads") metaAdsCents += amount;
  }

  return {
    periodLabel: period.label,
    googleAdsCents,
    metaAdsCents,
    totalCents: googleAdsCents + metaAdsCents,
  };
}

function buildHistory(entries: FinanceEntry[]): ClientFinanceHistoryItem[] {
  return entries
    .filter((e) => e.type !== "other" && effectiveFinanceStatus(e) !== "cancelled")
    .sort((a, b) => b.due_date.localeCompare(a.due_date))
    .slice(0, 12)
    .map((entry) => {
      const status = effectiveFinanceStatus(entry);
      return {
        id: entry.id,
        periodLabel: historyPeriodLabel(entry),
        description: entry.description,
        amountCents: entry.amount_cents,
        status,
        statusLabel: translateFinanceStatusClient(status),
      };
    });
}

export async function getClientFinanceOverview(companyId: string): Promise<ClientFinanceOverview> {
  const [entries, snapshots] = await Promise.all([
    findFinanceEntries({ companyId, sort: "due_date", order: "desc" }),
    findMarketingSnapshots({ companyId }),
  ]);

  return {
    subscription: buildSubscription(entries),
    mediaInvestment: buildMediaInvestment(snapshots),
    history: buildHistory(entries),
  };
}

export { formatMoney };
