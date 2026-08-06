import * as companyRepo from "@/domains/companies/repository.server";
import * as repo from "./repository.server";
import type { MarketingChannel } from "./types";

export async function listMarketingSnapshots(
  filters: Parameters<typeof repo.findMarketingSnapshots>[0],
) {
  const [snapshots, counts, summary] = await Promise.all([
    repo.findMarketingSnapshots(filters),
    repo.countMarketingByChannel(filters?.companyId),
    repo.getMarketingSummary(filters?.companyId),
  ]);
  return { snapshots, counts, summary };
}

export async function createMarketingSnapshot(input: {
  companyId: string;
  channel: MarketingChannel;
  periodStart: string;
  periodEnd: string;
  investmentCents?: number | null;
  leads?: number | null;
  conversions?: number | null;
  ctr?: number | null;
  cpcCents?: number | null;
  cpaCents?: number | null;
  notes?: string;
}) {
  const company = await companyRepo.findCompanyById(input.companyId);
  if (!company) throw new Error("Empresa não encontrada.");

  if (input.periodEnd < input.periodStart) {
    throw new Error("A data final deve ser igual ou posterior à inicial.");
  }

  return repo.insertMarketingSnapshot({
    company_id: input.companyId,
    channel: input.channel,
    period_start: input.periodStart,
    period_end: input.periodEnd,
    investment_cents: input.investmentCents ?? null,
    leads: input.leads ?? null,
    conversions: input.conversions ?? null,
    ctr: input.ctr ?? null,
    cpc_cents: input.cpcCents ?? null,
    cpa_cents: input.cpaCents ?? null,
    metrics: input.notes?.trim() ? { notes: input.notes.trim() } : {},
    sync_source: "manual",
  });
}

export async function updateMarketingSnapshot(
  id: string,
  companyId: string,
  patch: Partial<{
    channel: MarketingChannel;
    periodStart: string;
    periodEnd: string;
    investmentCents: number | null;
    leads: number | null;
    conversions: number | null;
    ctr: number | null;
    cpcCents: number | null;
    cpaCents: number | null;
    notes: string;
  }>,
) {
  const existing = await repo.findMarketingSnapshotById(id);
  if (!existing || existing.company_id !== companyId) return null;

  const periodStart = patch.periodStart ?? existing.period_start;
  const periodEnd = patch.periodEnd ?? existing.period_end;
  if (periodEnd < periodStart) {
    throw new Error("A data final deve ser igual ou posterior à inicial.");
  }

  const data: Record<string, unknown> = {};
  if (patch.channel !== undefined) data.channel = patch.channel;
  if (patch.periodStart !== undefined) data.period_start = patch.periodStart;
  if (patch.periodEnd !== undefined) data.period_end = patch.periodEnd;
  if (patch.investmentCents !== undefined) data.investment_cents = patch.investmentCents;
  if (patch.leads !== undefined) data.leads = patch.leads;
  if (patch.conversions !== undefined) data.conversions = patch.conversions;
  if (patch.ctr !== undefined) data.ctr = patch.ctr;
  if (patch.cpcCents !== undefined) data.cpc_cents = patch.cpcCents;
  if (patch.cpaCents !== undefined) data.cpa_cents = patch.cpaCents;
  if (patch.notes !== undefined) {
    data.metrics = patch.notes.trim() ? { notes: patch.notes.trim() } : {};
  }

  return repo.patchMarketingSnapshot(id, data);
}

export async function deleteMarketingSnapshot(id: string, companyId: string) {
  const existing = await repo.findMarketingSnapshotById(id);
  if (!existing || existing.company_id !== companyId) return false;
  return repo.removeMarketingSnapshot(id);
}

export async function getMarketingDashboardStats() {
  const summary = await repo.getMarketingSummary();
  const counts = await repo.countMarketingByChannel();
  return {
    investmentCents: summary.investmentCents,
    leads: summary.leads,
    conversions: summary.conversions,
    snapshotCount: counts.all,
  };
}
