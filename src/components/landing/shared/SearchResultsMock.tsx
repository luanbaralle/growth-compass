import type { SearchResultItem } from "@/config/segments/types";
import type { SerpDisplayMode, SerpSource } from "@/lib/serp/types";
import { Loader2, Mic, Search, SlidersHorizontal } from "lucide-react";

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
  return `${item.name.toLowerCase().replace(/\s+/g, "")}.com.br`;
}

function displayPath(item: SearchResultItem): string {
  if (item.url) {
    try {
      const u = new URL(item.url);
      const path = u.pathname === "/" ? "" : u.pathname;
      return `https://${u.hostname.replace(/^www\./, "")}${path}`;
    } catch {
      return item.url;
    }
  }
  return `https://www.${displayHost(item)}`;
}

function faviconForHost(host: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=32`;
}

function formatTotalResults(total?: string): string {
  if (!total) return "Cerca de 1.240.000 resultados";
  const n = Number.parseInt(total, 10);
  if (Number.isNaN(n)) return `Cerca de ${total} resultados`;
  return `Cerca de ${n.toLocaleString("pt-BR")} resultados`;
}

function GoogleLogo() {
  return (
    <span className="hidden text-sm font-medium tracking-tight sm:inline">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}

function SerpSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-surface-elevated" />
            <div className="space-y-2">
              <div className="h-2.5 w-28 rounded bg-surface-elevated" />
              <div className="h-2 w-40 rounded bg-surface-elevated/70" />
            </div>
          </div>
          <div className="mt-3 h-4 w-2/3 rounded bg-surface-elevated" />
          <div className="mt-2 h-3 w-full rounded bg-surface-elevated/60" />
          <div className="mt-1.5 h-3 w-4/5 rounded bg-surface-elevated/60" />
        </div>
      ))}
      <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />
        Buscando resultados reais...
      </div>
    </div>
  );
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
      ? `${formatTotalResults(totalResults)} (${searchTime.toFixed(2).replace(".", ",")} segundos)`
      : `${formatTotalResults(totalResults)} (0,42 segundos)`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-[oklch(0.16_0.005_60)] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]">
      {/* Chrome bar */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-[oklch(0.13_0.005_60)] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="mx-auto flex max-w-lg flex-1 items-center gap-2 rounded-full border border-border/80 bg-[oklch(0.18_0.005_60)] px-4 py-2 shadow-inner">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">{searchQuery}</span>
          <Mic className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        </div>
      </div>

      {/* Google header */}
      <div className="border-b border-border/40 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <GoogleLogo />
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border/60 bg-[oklch(0.18_0.005_60)] px-4 py-2.5 shadow-sm">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm text-foreground">{searchQuery}</span>
          </div>
        </div>
        <div className="mt-3 flex gap-5 border-b border-border/30 pb-0 text-xs">
          {["Tudo", "Imagens", "Maps", "Notícias"].map((tab, i) => (
            <span
              key={tab}
              className={`border-b-2 pb-2 ${i === 0 ? "border-brand text-brand" : "border-transparent text-muted-foreground"}`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-xs text-muted-foreground">{loading ? "Buscando..." : metaLine}</p>
          {!loading && source === "google" && (
            <span className="rounded-full border border-brand/30 bg-brand-soft px-2 py-0.5 text-[10px] font-medium text-brand">
              {displayMode === "ads" ? "Anúncios reais" : "Resultados reais"}
            </span>
          )}
        </div>

        {loading ? (
          <SerpSkeleton />
        ) : (
          <div className="space-y-5">
            {competitors.map((item, index) => {
              const host = displayHost(item);
              const path = displayPath(item);

              if (item.screenshotUrl) {
                return (
                  <img
                    key={`${item.name}-${index}`}
                    src={item.screenshotUrl}
                    alt={`Resultado: ${item.name}`}
                    className="w-full rounded-lg border border-border"
                  />
                );
              }

              const isTop = index === 0;

              return (
                <div
                  key={`${item.name}-${index}`}
                  className={`group rounded-xl transition-all ${
                    isTop
                      ? "border border-brand/15 bg-brand-soft/5 p-4 shadow-[0_2px_16px_-4px] shadow-brand/10"
                      : "px-1 py-1"
                  }`}
                >
                  {item.isAd && (
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="rounded border border-border/80 bg-background/60 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        Patrocinado
                      </span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <img
                      src={faviconForHost(host)}
                      alt=""
                      width={28}
                      height={28}
                      className="mt-0.5 h-7 w-7 shrink-0 rounded-full bg-background/80 p-1"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs text-muted-foreground">{host}</p>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="mt-0.5 block truncate text-lg font-normal text-[#8ab4f8] transition-colors hover:underline"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <p className="mt-0.5 truncate text-lg font-normal text-[#8ab4f8] group-hover:underline">
                          {item.name}
                        </p>
                      )}
                      <p className="mt-0.5 truncate text-xs text-muted-foreground/80">{path}</p>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {item.snippet ??
                          "Atendimento especializado na sua região. Agende sua avaliação e descubra nossos serviços."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-destructive/35 bg-destructive/5 p-4">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_8px,oklch(0.6_0.22_27/0.03)_8px,oklch(0.6_0.22_27/0.03)_16px)]" />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-destructive/80">
                    Sua posição
                  </span>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {yourBusinessLabel}:{" "}
                    <span className="text-destructive">{notFoundLabel}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enquanto isso, quem aparece captura esses cliques.
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
