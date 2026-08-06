import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type {
  MarketingChannel,
  MarketingChannelCounts,
  MarketingListFilters,
  MarketingSnapshot,
  MarketingSnapshotWithCompany,
  MarketingSummary,
} from "./types";
import { MARKETING_CHANNELS } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

async function attachCompanyNames(
  snapshots: MarketingSnapshot[],
): Promise<MarketingSnapshotWithCompany[]> {
  const companyIds = [...new Set(snapshots.map((s) => s.company_id))];
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

  return snapshots.map((snapshot) => ({
    ...snapshot,
    companies: companyMap.has(snapshot.company_id)
      ? { name: companyMap.get(snapshot.company_id)! }
      : null,
  }));
}

export async function findMarketingSnapshots(
  filters: MarketingListFilters = {},
): Promise<MarketingSnapshotWithCompany[]> {
  const params: Record<string, string> = { select: "*" };
  const sort = filters.sort ?? "period_start";
  const order = filters.order ?? "desc";
  params.order = `${sort}.${order}`;

  if (filters.channel && filters.channel !== "all") {
    params.channel = `eq.${filters.channel}`;
  }
  if (filters.companyId) {
    params.company_id = `eq.${filters.companyId}`;
  }

  let snapshots = await dbSelect<MarketingSnapshot>(
    "marketing_snapshots",
    encodeQuery(params),
  );
  snapshots = await attachCompanyNames(snapshots);

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    snapshots = snapshots.filter((s) => s.companies?.name.toLowerCase().includes(q));
  }

  return snapshots;
}

export async function countMarketingByChannel(
  companyId?: string,
): Promise<MarketingChannelCounts> {
  const params: Record<string, string> = { select: "channel" };
  if (companyId) {
    params.company_id = `eq.${companyId}`;
  }

  const all = await dbSelect<Pick<MarketingSnapshot, "channel">>(
    "marketing_snapshots",
    encodeQuery(params),
  );

  const counts: MarketingChannelCounts = {
    all: all.length,
    google_ads: 0,
    meta_ads: 0,
    landing_page: 0,
    seo: 0,
    google_business: 0,
  };

  for (const row of all) {
    if (row.channel in counts) {
      counts[row.channel as MarketingChannel]++;
    }
  }

  return counts;
}

export async function getMarketingSummary(companyId?: string): Promise<MarketingSummary> {
  const params: Record<string, string> = { select: "*" };
  if (companyId) {
    params.company_id = `eq.${companyId}`;
  }

  const all = await dbSelect<MarketingSnapshot>("marketing_snapshots", encodeQuery(params));

  let investmentCents = 0;
  let leads = 0;
  let conversions = 0;

  for (const row of all) {
    investmentCents += row.investment_cents ?? 0;
    leads += row.leads ?? 0;
    conversions += row.conversions ?? 0;
  }

  return { investmentCents, leads, conversions };
}

export async function findMarketingSnapshotById(id: string): Promise<MarketingSnapshot | null> {
  const rows = await dbSelect<MarketingSnapshot>(
    "marketing_snapshots",
    encodeQuery({ select: "*", id: `eq.${id}` }),
  );
  return rows[0] ?? null;
}

export async function insertMarketingSnapshot(
  data: Omit<MarketingSnapshot, "id" | "created_at">,
): Promise<MarketingSnapshot> {
  const [row] = await dbInsert<MarketingSnapshot>("marketing_snapshots", data);
  return row;
}

export async function patchMarketingSnapshot(
  id: string,
  data: Partial<Omit<MarketingSnapshot, "id" | "company_id" | "created_at">>,
): Promise<MarketingSnapshot | null> {
  const rows = await dbUpdate<MarketingSnapshot>("marketing_snapshots", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function removeMarketingSnapshot(id: string): Promise<boolean> {
  await dbDelete("marketing_snapshots", `id=eq.${id}`);
  return true;
}

export { MARKETING_CHANNELS };
