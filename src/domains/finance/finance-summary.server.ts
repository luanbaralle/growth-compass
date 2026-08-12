import type { FinanceEntry } from "./types";
import { effectiveFinanceStatus } from "./types";

export function monthEndIso(date = new Date()): string {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;
}

export function calculateMrrCents(
  entries: FinanceEntry[],
  activeCompanyIds?: Set<string>,
): { mrrCents: number; mrrClientCount: number } {
  const latestMonthlyByCompany = new Map<string, FinanceEntry>();

  for (const entry of entries) {
    if (entry.type !== "monthly" || entry.status === "cancelled") continue;
    if (activeCompanyIds && !activeCompanyIds.has(entry.company_id)) continue;

    const existing = latestMonthlyByCompany.get(entry.company_id);
    if (!existing || entry.due_date > existing.due_date) {
      latestMonthlyByCompany.set(entry.company_id, entry);
    }
  }

  let mrrCents = 0;
  for (const entry of latestMonthlyByCompany.values()) {
    mrrCents += entry.amount_cents;
  }

  return { mrrCents, mrrClientCount: latestMonthlyByCompany.size };
}

export function summarizeFinanceEntries(
  entries: FinanceEntry[],
  monthStart: string,
  monthEnd: string,
  activeCompanyIds?: Set<string>,
) {
  let dueThisMonthCents = 0;
  let overdueCents = 0;
  let paidThisMonthCents = 0;
  let futurePendingCents = 0;

  for (const entry of entries) {
    const status = effectiveFinanceStatus(entry);

    if (status === "overdue") {
      overdueCents += entry.amount_cents;
    } else if (status === "pending") {
      if (entry.due_date > monthEnd) {
        futurePendingCents += entry.amount_cents;
      } else if (entry.due_date >= monthStart) {
        dueThisMonthCents += entry.amount_cents;
      }
    }

    if (entry.status === "paid" && entry.paid_at && entry.paid_at >= monthStart) {
      paidThisMonthCents += entry.amount_cents;
    }
  }

  const { mrrCents, mrrClientCount } = calculateMrrCents(entries, activeCompanyIds);

  return {
    dueThisMonthCents,
    overdueCents,
    receivableCents: dueThisMonthCents + overdueCents,
    paidThisMonthCents,
    mrrCents,
    mrrClientCount,
    futurePendingCents,
  };
}
