import type { SearchResultItem } from "@/config/segments/types";
import type { SerpDisplayMode, SerpPrefer } from "./types";

const SERPER_ENDPOINT = "https://google.serper.dev/search";

export interface SerperOrganicResult {
  title: string;
  link: string;
  snippet?: string;
  position?: number;
}

export interface SerperAdResult {
  title: string;
  link: string;
  snippet?: string;
  displayLink?: string;
  position?: number;
}

export interface SerperResponse {
  organic?: SerperOrganicResult[];
  ads?: SerperAdResult[];
  credits?: number;
  message?: string;
}

export function getSerpPrefer(): SerpPrefer {
  const value = process.env.SERP_PREFER?.toLowerCase();
  if (value === "organic" || value === "hybrid") return value;
  return "ads";
}

export function mapSerperOrganic(items: SerperOrganicResult[]): SearchResultItem[] {
  return items.slice(0, 5).map((item) => ({
    name: item.title,
    url: item.link,
    snippet: item.snippet,
    isAd: false,
  }));
}

export function mapSerperAds(items: SerperAdResult[]): SearchResultItem[] {
  return items
    .filter((item) => item.title && item.link)
    .slice(0, 5)
    .map((item) => ({
      name: item.title,
      url: item.link,
      snippet: item.snippet,
      isAd: true,
    }));
}

export interface SerperPickResult {
  items: SearchResultItem[];
  displayMode: Exclude<SerpDisplayMode, "mock">;
}

/** Waterfall: ads → organic (modo ads) ou conforme SERP_PREFER */
export function pickSerperResults(
  data: SerperResponse,
  prefer: SerpPrefer,
  limit = 5,
): SerperPickResult | null {
  const ads = mapSerperAds(data.ads ?? []);
  const organic = mapSerperOrganic(data.organic ?? []);

  if (prefer === "organic") {
    if (!organic.length) return null;
    return { items: organic.slice(0, limit), displayMode: "organic" };
  }

  if (prefer === "hybrid") {
    const merged = [...ads, ...organic].slice(0, limit);
    if (!merged.length) return null;
    return { items: merged, displayMode: "hybrid" };
  }

  if (ads.length) {
    return { items: ads.slice(0, limit), displayMode: "ads" };
  }

  if (organic.length) {
    return { items: organic.slice(0, limit), displayMode: "organic" };
  }

  return null;
}

export async function fetchSerper(query: string, apiKey: string, num = 5): Promise<SerperResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(SERPER_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        gl: "br",
        hl: "pt-br",
        num: Math.min(num, 10),
      }),
    });

    const data = (await res.json()) as SerperResponse;

    if (!res.ok) {
      const err = new Error(data.message ?? `Serper HTTP ${res.status}`);
      (err as Error & { status?: number }).status = res.status;
      throw err;
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}
