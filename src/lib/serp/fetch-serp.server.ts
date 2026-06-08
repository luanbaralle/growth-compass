import type { SearchResultItem } from "@/config/segments/types";
import { getCachedSerp, setCachedSerp } from "./cache.server";
import { fetchGoogleCse } from "./google-cse.server";
import {
  consumeSerpLiveQuota,
  resolveClientIp,
} from "./rate-limit.server";
import { fetchSerper, getSerpPrefer, pickSerperResults } from "./serper.server";
import type { GoogleCseItem, SerpFallbackReason, SerpFetchResult } from "./types";

function mapCseItems(items: GoogleCseItem[]): SearchResultItem[] {
  return items.slice(0, 5).map((item) => ({
    name: item.title ?? item.displayLink ?? "Resultado",
    url: item.link,
    snippet: item.snippet,
    isAd: false,
  }));
}

function mockResult(
  query: string,
  competitors: SearchResultItem[],
  fallbackReason: SerpFallbackReason,
): SerpFetchResult {
  return {
    source: "mock",
    query,
    competitors,
    displayMode: "mock",
    fallbackReason,
  };
}

function liveResult(
  query: string,
  competitors: SearchResultItem[],
  displayMode: SerpFetchResult["displayMode"],
  searchTime?: number,
): SerpFetchResult {
  return {
    source: "google",
    query,
    competitors,
    displayMode,
    searchTime,
  };
}

async function trySerper(
  trimmed: string,
  ip: string,
): Promise<{ result: SerpFetchResult | null; rateLimited: boolean }> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return { result: null, rateLimited: false };

  const quota = await consumeSerpLiveQuota(ip);
  if (!quota.allowed) return { result: null, rateLimited: true };

  const data = await fetchSerper(trimmed, apiKey);
  const picked = pickSerperResults(data, getSerpPrefer());
  if (!picked) return { result: null, rateLimited: false };

  return {
    result: liveResult(trimmed, picked.items, picked.displayMode, 1.2),
    rateLimited: false,
  };
}

async function tryGoogleCse(
  trimmed: string,
  ip: string,
): Promise<{ result: SerpFetchResult | null; rateLimited: boolean }> {
  const apiKey = process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_CSE_CX;
  if (!apiKey || !cx) return { result: null, rateLimited: false };

  const quota = await consumeSerpLiveQuota(ip);
  if (!quota.allowed) return { result: null, rateLimited: true };

  const data = await fetchGoogleCse(trimmed, apiKey, cx);
  if (!data.items?.length) return { result: null, rateLimited: false };

  return {
    result: {
      source: "google",
      query: trimmed,
      competitors: mapCseItems(data.items),
      displayMode: "organic",
      totalResults: data.searchInformation?.totalResults,
      searchTime: data.searchInformation?.searchTime,
    },
    rateLimited: false,
  };
}

function isQuotaError(error: unknown): boolean {
  const err = error as Error & { status?: number; reason?: string };
  return (
    err.status === 429 ||
    err.status === 402 ||
    err.reason === "dailyLimitExceeded" ||
    err.reason === "rateLimitExceeded" ||
    err.reason === "userRateLimitExceeded"
  );
}

export async function fetchSerpResults(
  query: string,
  mockFallback: SearchResultItem[],
): Promise<SerpFetchResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return mockResult(trimmed, mockFallback, "empty_query");
  }

  const cached = await getCachedSerp(trimmed);
  if (cached) return cached;

  const serperKey = process.env.SERPER_API_KEY;
  const cseKey = process.env.GOOGLE_CSE_API_KEY;
  const cseCx = process.env.GOOGLE_CSE_CX;

  if (!serperKey && (!cseKey || !cseCx)) {
    return mockResult(trimmed, mockFallback, "not_configured");
  }

  const ip = resolveClientIp();
  let rateLimited = false;

  try {
    if (serperKey) {
      const serper = await trySerper(trimmed, ip);
      rateLimited = rateLimited || serper.rateLimited;
      if (serper.result) {
        await setCachedSerp(trimmed, serper.result);
        return serper.result;
      }
    }

    if (cseKey && cseCx) {
      const cse = await tryGoogleCse(trimmed, ip);
      rateLimited = rateLimited || cse.rateLimited;
      if (cse.result) {
        await setCachedSerp(trimmed, cse.result);
        return cse.result;
      }
    }

    if (rateLimited) {
      return mockResult(trimmed, mockFallback, "rate_limited");
    }

    return mockResult(trimmed, mockFallback, "empty_results");
  } catch (error) {
    return mockResult(
      trimmed,
      mockFallback,
      isQuotaError(error) ? "quota_exceeded" : "api_error",
    );
  }
}
