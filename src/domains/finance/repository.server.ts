import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type {
  FinanceEntry,
  FinanceEntryStatus,
  FinanceEntryWithCompany,
  FinanceListFilters,
  FinanceStatusCounts,
  FinanceSummary,
} from "./types";
import { effectiveFinanceStatus, FINANCE_STATUSES } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthStartIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

async function attachCompanyNames(
  entries: FinanceEntry[],
): Promise<FinanceEntryWithCompany[]> {
  const companyIds = [...new Set(entries.map((entry) => entry.company_id))];
  const companyMap = new Map<string, string>();

  if (companyIds.length > 0) {
    const companies = await dbSelect<{ id: string; name: string }>(
      "companies",
      encodeQuery({
        select: "id,name",
        id: `in.(${companyIds.join(",")})`,
      }),
    );
    for (const company of companies) {
      companyMap.set(company.id, company.name);
    }
  }

  return entries.map((entry) => ({
    ...entry,
    companies: companyMap.has(entry.company_id)
      ? { name: companyMap.get(entry.company_id)! }
      : null,
  }));
}

export async function findFinanceEntries(
  filters: FinanceListFilters = {},
): Promise<FinanceEntryWithCompany[]> {
  const params: Record<string, string> = { select: "*" };
  const sort = filters.sort ?? "due_date";
  const order = filters.order ?? "asc";
  params.order = `${sort}.${order}`;

  if (filters.type && filters.type !== "all") {
    params.type = `eq.${filters.type}`;
  }
  if (filters.companyId) {
    params.company_id = `eq.${filters.companyId}`;
  }

  let entries = await dbSelect<FinanceEntry>("finance_entries", encodeQuery(params));

  if (filters.status && filters.status !== "all") {
    entries = entries.filter((entry) => effectiveFinanceStatus(entry) === filters.status);
  }

  entries = await attachCompanyNames(entries);

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    entries = entries.filter(
      (entry) =>
        entry.description.toLowerCase().includes(q) ||
        entry.companies?.name.toLowerCase().includes(q),
    );
  }

  return entries;
}

export async function countFinanceByStatus(
  companyId?: string,
): Promise<FinanceStatusCounts> {
  const params: Record<string, string> = { select: "*" };
  if (companyId) {
    params.company_id = `eq.${companyId}`;
  }

  const all = await dbSelect<FinanceEntry>("finance_entries", encodeQuery(params));
  const counts: FinanceStatusCounts = {
    all: all.length,
    paid: 0,
    pending: 0,
    overdue: 0,
    cancelled: 0,
  };

  for (const entry of all) {
    const status = effectiveFinanceStatus(entry);
    if (status in counts) {
      counts[status as FinanceEntryStatus]++;
    }
  }

  return counts;
}

export async function getFinanceSummary(companyId?: string): Promise<FinanceSummary> {
  const params: Record<string, string> = { select: "*" };
  if (companyId) {
    params.company_id = `eq.${companyId}`;
  }

  const all = await dbSelect<FinanceEntry>("finance_entries", encodeQuery(params));
  const monthStart = monthStartIso();

  let pendingCents = 0;
  let overdueCents = 0;
  let paidThisMonthCents = 0;

  for (const entry of all) {
    const status = effectiveFinanceStatus(entry);
    if (status === "pending") pendingCents += entry.amount_cents;
    if (status === "overdue") overdueCents += entry.amount_cents;
    if (
      entry.status === "paid" &&
      entry.paid_at &&
      entry.paid_at >= monthStart
    ) {
      paidThisMonthCents += entry.amount_cents;
    }
  }

  return { pendingCents, overdueCents, paidThisMonthCents };
}

export async function findFinanceEntryById(id: string): Promise<FinanceEntry | null> {
  const rows = await dbSelect<FinanceEntry>(
    "finance_entries",
    encodeQuery({ select: "*", id: `eq.${id}` }),
  );
  return rows[0] ?? null;
}

export async function insertFinanceEntry(
  data: Omit<FinanceEntry, "id" | "created_at" | "updated_at">,
): Promise<FinanceEntry> {
  const [row] = await dbInsert<FinanceEntry>("finance_entries", data);
  return row;
}

export async function patchFinanceEntry(
  id: string,
  data: Partial<Omit<FinanceEntry, "id" | "company_id" | "created_at" | "updated_at">>,
): Promise<FinanceEntry | null> {
  const rows = await dbUpdate<FinanceEntry>("finance_entries", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function removeFinanceEntry(id: string): Promise<boolean> {
  await dbDelete("finance_entries", `id=eq.${id}`);
  return true;
}

export { FINANCE_STATUSES, todayIso };
