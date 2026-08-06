export type MarketingChannel =
  | "google_ads"
  | "meta_ads"
  | "landing_page"
  | "seo"
  | "google_business";

export type MarketingSyncSource = "manual" | "api";

export interface MarketingSnapshot {
  id: string;
  company_id: string;
  channel: MarketingChannel;
  period_start: string;
  period_end: string;
  investment_cents: number | null;
  leads: number | null;
  conversions: number | null;
  ctr: number | null;
  cpc_cents: number | null;
  cpa_cents: number | null;
  metrics: Record<string, unknown>;
  sync_source: MarketingSyncSource;
  created_at: string;
}

export interface MarketingSnapshotWithCompany extends MarketingSnapshot {
  companies: { name: string } | null;
}

export interface MarketingListFilters {
  search?: string;
  channel?: MarketingChannel | "all";
  companyId?: string;
  sort?: "period_start" | "created_at" | "investment_cents";
  order?: "asc" | "desc";
}

export interface MarketingChannelCounts {
  all: number;
  google_ads: number;
  meta_ads: number;
  landing_page: number;
  seo: number;
  google_business: number;
}

export interface MarketingSummary {
  investmentCents: number;
  leads: number;
  conversions: number;
}

export const MARKETING_CHANNELS: MarketingChannel[] = [
  "google_ads",
  "meta_ads",
  "landing_page",
  "seo",
  "google_business",
];

export const CHANNEL_LABELS: Record<MarketingChannel, string> = {
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  landing_page: "Landing Page",
  seo: "SEO",
  google_business: "Google Meu Negócio",
};

export function formatMoney(cents: number | null): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function parseMoneyToCents(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;
  const amount = Number.parseFloat(normalized.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(amount)) return null;
  return Math.round(amount * 100);
}

export function centsToFormAmount(cents: number | null): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
}

export function formatPercent(value: number | null): string {
  if (value == null) return "—";
  return `${(value * 100).toFixed(2)}%`;
}

export function parsePercent(value: string): number | null {
  const trimmed = value.trim().replace("%", "");
  if (!trimmed) return null;
  const num = Number.parseFloat(trimmed.replace(",", "."));
  if (!Number.isFinite(num)) return null;
  return num > 1 ? num / 100 : num;
}

export function formatPeriod(start: string, end: string): string {
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export function getSnapshotNotes(snapshot: MarketingSnapshot): string | null {
  const notes = snapshot.metrics?.notes;
  return typeof notes === "string" && notes.trim() ? notes : null;
}
