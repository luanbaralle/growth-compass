import type { SearchResultItem } from "@/config/segments/types";
import type { SerpDisplayMode, SerpSource } from "@/lib/serp/types";
import { Search } from "lucide-react";

interface SearchResultsMockProps {
  searchQuery: string;
  competitors: SearchResultItem[];
  yourBusinessLabel: string;
  notFoundLabel: string;
  source?: SerpSource;
  displayMode?: SerpDisplayMode;
  loading?: boolean;
  totalResults?: string;
  searchTime?: number;
}

function displayHost(item: SearchResultItem): string {
  if (item.url) {
    try {
      return new URL(item.url).hostname.replace(/^www\./, "");
    } catch {
      return item.url;
    }
  }
  return `www.${item.name.toLowerCase().replace(/\s+/g, "")}.com.br`;
}

function formatTotalResults(total?: string): string {
  if (!total) return "Cerca de 1.240.000 resultados";
  const n = Number.parseInt(total, 10);
  if (Number.isNaN(n)) return `Cerca de ${total} resultados`;
  return `Cerca de ${n.toLocaleString("pt-BR")} resultados`;
}

/**
 * Simula ou exibe resultados reais de pesquisa do Google.
 * Quando alimentado via Google CSE, usa título, URL e snippet reais.
 */
export function SearchResultsMock({
  searchQuery,
  competitors,
  yourBusinessLabel,
  notFoundLabel,
  source = "mock",
  displayMode = "mock",
  loading = false,
  totalResults,
  searchTime,
}: SearchResultsMockProps) {
  const metaLine =
    searchTime != null
      ? `${formatTotalResults(totalResults)} · ${searchTime.toFixed(2).replace(".", ",")} segundos`
      : `${formatTotalResults(totalResults)} · 0,42 segundos`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border bg-background/80 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="mx-auto flex max-w-md flex-1 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate font-mono text-sm text-foreground">{searchQuery}</span>
        </div>
        <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:block">
          Google
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-xs text-muted-foreground">{loading ? "Buscando resultados..." : metaLine}</p>
          {!loading && source === "google" && (
            <span className="rounded-full border border-brand/30 bg-brand-soft px-2 py-0.5 text-[10px] font-medium text-brand">
              {displayMode === "ads" ? "Anúncios reais" : "Resultados reais"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-border bg-background/60 p-4"
              >
                <div className="h-3 w-16 rounded bg-surface-elevated" />
                <div className="mt-3 h-4 w-3/4 rounded bg-surface-elevated" />
                <div className="mt-2 h-3 w-1/3 rounded bg-surface-elevated" />
                <div className="mt-3 h-3 w-full rounded bg-surface-elevated" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {competitors.map((item, index) =>
              item.screenshotUrl ? (
                <img
                  key={`${item.name}-${index}`}
                  src={item.screenshotUrl}
                  alt={`Resultado: ${item.name}`}
                  className="w-full rounded-lg border border-border"
                />
              ) : (
                <div
                  key={`${item.name}-${index}`}
                  className="group rounded-xl border border-border bg-background/60 p-4 transition-colors hover:border-segment/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {item.isAd ? "Anúncio" : "Resultado"}
                        </span>
                        {item.isAd && (
                          <span className="rounded border border-border px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                            Patrocinado
                          </span>
                        )}
                      </div>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="mt-1 block text-base font-medium text-segment transition-colors hover:underline"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <p className="mt-1 text-base font-medium text-segment transition-colors group-hover:underline">
                          {item.name}
                        </p>
                      )}
                      <p className="mt-1 truncate text-xs text-muted-foreground">{displayHost(item)}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {item.snippet ??
                          "Atendimento especializado na sua região. Agende sua avaliação e descubra nossos serviços."}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              ),
            )}

            <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-destructive/40 bg-destructive/5 p-4">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_8px,oklch(0.6_0.22_27/0.03)_8px,oklch(0.6_0.22_27/0.03)_16px)]" />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-destructive/80">
                    Sua posição
                  </span>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {yourBusinessLabel}: <span className="text-destructive">{notFoundLabel}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enquanto isso, seus concorrentes capturam esses cliques.
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
                  <span className="text-lg font-bold text-destructive">✕</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
