import type { SearchResultItem } from "@/config/segments/types";

export type SerpSource = "google" | "mock";

/** ads = anúncios primeiro, orgânico se vazio; organic = só orgânico; hybrid = anúncios + orgânico */
export type SerpPrefer = "ads" | "organic" | "hybrid";

/** O que foi exibido na prévia após resolver o waterfall */
export type SerpDisplayMode = "ads" | "organic" | "hybrid" | "mock";

export type SerpFallbackReason =
  | "not_configured"
  | "empty_query"
  | "empty_results"
  | "quota_exceeded"
  | "api_error"
  | "cache_miss_fallback"
  | "rate_limited";

export interface SerpFetchResult {
  source: SerpSource;
  query: string;
  competitors: SearchResultItem[];
  totalResults?: string;
  searchTime?: number;
  fallbackReason?: SerpFallbackReason;
  displayMode?: SerpDisplayMode;
}

export interface GoogleCseItem {
  title?: string;
  link?: string;
  displayLink?: string;
  snippet?: string;
}

export interface GoogleCseResponse {
  items?: GoogleCseItem[];
  searchInformation?: {
    totalResults?: string;
    searchTime?: number;
  };
  error?: {
    code?: number;
    message?: string;
    errors?: { reason?: string }[];
  };
}
