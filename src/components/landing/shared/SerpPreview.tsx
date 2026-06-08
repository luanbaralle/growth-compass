import type { SearchResultItem } from "@/config/segments/types";
import { getSerpResults } from "@/lib/api/serp.functions";
import type { SerpFetchResult } from "@/lib/serp/types";
import { useEffect, useState } from "react";
import { SearchResultsMock } from "./SearchResultsMock";

interface SerpPreviewProps {
  searchQuery: string;
  mockCompetitors: SearchResultItem[];
  yourBusinessLabel: string;
  notFoundLabel: string;
}

export function SerpPreview({
  searchQuery,
  mockCompetitors,
  yourBusinessLabel,
  notFoundLabel,
}: SerpPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [serp, setSerp] = useState<SerpFetchResult | null>(null);
  const fallbackKey = mockCompetitors.map((c) => c.name).join("|");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const result = await getSerpResults({
          data: {
            query: searchQuery,
            mockFallback: mockCompetitors,
          },
        });
        if (!cancelled) setSerp(result);
      } catch {
        if (!cancelled) {
          setSerp({
            source: "mock",
            query: searchQuery,
            competitors: mockCompetitors,
            displayMode: "mock",
            fallbackReason: "api_error",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [searchQuery, fallbackKey, mockCompetitors]);

  return (
    <SearchResultsMock
      searchQuery={searchQuery}
      competitors={serp?.competitors ?? mockCompetitors}
      yourBusinessLabel={yourBusinessLabel}
      notFoundLabel={notFoundLabel}
      source={serp?.source ?? "mock"}
      displayMode={serp?.displayMode ?? "mock"}
      loading={loading}
      totalResults={serp?.totalResults}
      searchTime={serp?.searchTime}
    />
  );
}
