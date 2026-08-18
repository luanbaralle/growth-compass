import type { EvidenceGraphItem, EvidenceKind } from "../types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GitBranch, Quote, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

const DOMAIN_LABELS: Record<string, string> = {
  business: "Negócio",
  offer: "Oferta",
  customer: "Cliente",
  commercial: "Comercial",
  economics: "Economics",
  acquisition: "Aquisição",
  marketing: "Marketing",
  brand: "Marca",
  content: "Conteúdo",
  goals: "Objetivos",
  expectations: "Expectativas",
  investment: "Investimento",
  risks: "Riscos",
  opportunities: "Oportunidades",
};

const DOMAIN_DOTS: Record<string, string> = {
  business: "bg-violet-500",
  offer: "bg-sky-500",
  customer: "bg-emerald-500",
  commercial: "bg-amber-500",
  economics: "bg-lime-500",
  acquisition: "bg-orange-500",
  marketing: "bg-pink-500",
  brand: "bg-fuchsia-500",
  content: "bg-cyan-500",
  goals: "bg-indigo-500",
  expectations: "bg-teal-500",
  investment: "bg-yellow-500",
  risks: "bg-red-500",
  opportunities: "bg-amber-400",
};
const DOMAIN_ACCENTS: Record<string, string> = {
  business: "border-l-violet-500",
  offer: "border-l-sky-500",
  customer: "border-l-emerald-500",
  commercial: "border-l-amber-500",
  economics: "border-l-lime-500",
  acquisition: "border-l-orange-500",
  marketing: "border-l-pink-500",
  brand: "border-l-fuchsia-500",
  content: "border-l-cyan-500",
  goals: "border-l-indigo-500",
  expectations: "border-l-teal-500",
  investment: "border-l-yellow-500",
  risks: "border-l-red-500",
  opportunities: "border-l-amber-400",
};

const KIND_LABELS: Record<EvidenceKind, string> = {
  fact: "Fato",
  inference: "Inferência",
  hypothesis: "Hipótese",
  opportunity: "Oportunidade",
};

const KIND_STYLES: Record<EvidenceKind, string> = {
  fact: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  inference: "bg-sky-500/12 text-sky-700 dark:text-sky-400 border-sky-500/25",
  hypothesis: "bg-violet-500/12 text-violet-700 dark:text-violet-400 border-violet-500/25",
  opportunity: "bg-amber-500/12 text-amber-700 dark:text-amber-400 border-amber-500/25",
};

const KIND_DOT: Record<EvidenceKind, string> = {
  fact: "bg-emerald-500",
  inference: "bg-sky-500",
  hypothesis: "bg-violet-500",
  opportunity: "bg-amber-500",
};

const SOURCE_LABELS: Record<string, string> = {
  prospect_statement: "Prospect",
  consultant_statement: "Consultor",
  r1_team: "R1",
  ai_inference: "IA",
  human_verified: "Verificado",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

type KindFilter = "all" | EvidenceKind;

function groupByDomain(items: EvidenceGraphItem[]): Array<[string, EvidenceGraphItem[]]> {
  const map = new Map<string, EvidenceGraphItem[]>();
  for (const item of items) {
    const list = map.get(item.domain) ?? [];
    list.push(item);
    map.set(item.domain, list);
  }
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
}

function EvidenceCard({
  item,
  selected,
  dimmed,
  onSelect,
}: {
  item: EvidenceGraphItem;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border border-border/50 bg-card/80 p-3.5 text-left transition-all",
        "hover:border-border hover:bg-card hover:shadow-sm",
        selected && "border-violet-500/40 bg-violet-500/[0.06] ring-1 ring-violet-500/20",
        dimmed && "opacity-35 hover:opacity-60",
        DOMAIN_ACCENTS[item.domain] ?? "border-l-muted-foreground",
        "border-l-[3px]",
      )}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
            KIND_STYLES[item.kind],
          )}
        >
          {KIND_LABELS[item.kind]}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {SOURCE_LABELS[item.source] ?? item.source}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold leading-snug text-foreground">{item.label}</p>
      <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.value}</p>
      {item.quote && (
        <p className="mt-2 line-clamp-2 text-[11px] italic text-muted-foreground/80">
          &ldquo;{item.quote}&rdquo;
        </p>
      )}
    </button>
  );
}

function EvidenceDetail({ item, onClose }: { item: EvidenceGraphItem; onClose: () => void }) {
  return (
    <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.06] to-transparent p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
            {DOMAIN_LABELS[item.domain] ?? item.domain} · detalhe
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">{item.label}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border/50 p-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          aria-label="Fechar detalhe"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{item.value}</p>

      {item.quote && (
        <blockquote className="mt-4 flex gap-2 rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
          <Quote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" />
          <p className="text-sm italic leading-relaxed text-muted-foreground">{item.quote}</p>
        </blockquote>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline" className={cn("text-xs", KIND_STYLES[item.kind])}>
          {KIND_LABELS[item.kind]}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {SOURCE_LABELS[item.source] ?? item.source}
        </Badge>
        <Badge variant="outline" className="text-xs">
          Confiança {CONFIDENCE_LABELS[item.confidence] ?? item.confidence}
        </Badge>
        {item.status === "tentative" && (
          <Badge variant="outline" className="border-amber-500/25 text-xs text-amber-600">
            Tentativo
          </Badge>
        )}
        {item.objectiveKey && (
          <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground">
            {item.objectiveKey}
          </Badge>
        )}
      </div>
    </div>
  );
}

export function EvidenceGraphPanel({
  items,
  className,
}: {
  items: EvidenceGraphItem[];
  className?: string;
}) {
  const [kindFilter, setKindFilter] = useState<KindFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const kindCounts = useMemo(() => {
    const counts: Record<EvidenceKind, number> = {
      fact: 0,
      inference: 0,
      hypothesis: 0,
      opportunity: 0,
    };
    for (const item of items) counts[item.kind]++;
    return counts;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (kindFilter !== "all" && item.kind !== kindFilter) return false;
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        (item.quote?.toLowerCase().includes(q) ?? false) ||
        (DOMAIN_LABELS[item.domain]?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [items, kindFilter, query]);

  const domains = useMemo(() => groupByDomain(filtered), [filtered]);
  const selected = items.find((i) => i.id === selectedId) ?? null;
  const domainCount = domains.length;

  if (items.length === 0) {
    return (
      <section
        className={cn(
          "rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-14 text-center",
          className,
        )}
      >
        <GitBranch className="mx-auto h-10 w-10 text-muted-foreground/25" />
        <p className="mt-4 text-sm font-medium text-foreground/80">Mapa de evidências vazio</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Encerre e reprocesse a reunião para gerar fatos, inferências e oportunidades rastreáveis.
        </p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-muted/[0.12] to-transparent shadow-sm",
        className,
      )}
    >
      <div className="border-b border-border/40 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-violet-500/80" />
              <h2 className="text-base font-semibold">Mapa de evidências</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} de {items.length} itens · {domainCount} domínios com cobertura
            </p>
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar evidência..."
              className="h-10 w-full rounded-lg border border-border/50 bg-background/80 pl-9 pr-3 text-sm outline-none ring-violet-500/20 focus:ring-2"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip
            active={kindFilter === "all"}
            onClick={() => setKindFilter("all")}
            label={`Todos (${items.length})`}
          />
          {(Object.keys(KIND_LABELS) as EvidenceKind[]).map((kind) =>
            kindCounts[kind] > 0 ? (
              <FilterChip
                key={kind}
                active={kindFilter === kind}
                onClick={() => setKindFilter(kind)}
                label={KIND_LABELS[kind]}
                count={kindCounts[kind]}
                dotClass={KIND_DOT[kind]}
              />
            ) : null,
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(Object.keys(KIND_LABELS) as EvidenceKind[]).map((kind) => (
            <div
              key={kind}
              className="flex items-center gap-2 rounded-lg border border-border/30 bg-background/50 px-3 py-2"
            >
              <span className={cn("h-2 w-2 rounded-full", KIND_DOT[kind])} />
              <span className="text-xs text-muted-foreground">{KIND_LABELS[kind]}</span>
              <span className="ml-auto text-sm font-semibold tabular-nums">{kindCounts[kind]}</span>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="border-b border-border/40 px-5 py-4 sm:px-6">
          <EvidenceDetail item={selected} onClose={() => setSelectedId(null)} />
        </div>
      )}

      <div className="p-4 sm:p-5">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma evidência corresponde aos filtros.
          </p>
        ) : (
          <>
            <div className="hidden gap-4 overflow-x-auto pb-2 md:flex md:snap-x md:snap-mandatory">
              {domains.map(([domain, domainItems]) => (
                <DomainColumn
                  key={domain}
                  domain={domain}
                  items={domainItems}
                  kindFilter={kindFilter}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              ))}
            </div>

            <div className="space-y-6 md:hidden">
              {domains.map(([domain, domainItems]) => (
                <DomainColumn
                  key={domain}
                  domain={domain}
                  items={domainItems}
                  kindFilter={kindFilter}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  stacked
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function DomainColumn({
  domain,
  items,
  kindFilter,
  selectedId,
  onSelect,
  stacked,
}: {
  domain: string;
  items: EvidenceGraphItem[];
  kindFilter: KindFilter;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  stacked?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col",
        stacked ? "w-full" : "w-[min(100%,280px)] snap-start",
      )}
    >
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={cn("h-2 w-2 rounded-full", DOMAIN_DOTS[domain] ?? "bg-muted-foreground")} />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/85">
          {DOMAIN_LABELS[domain] ?? domain}
        </h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground">
          {items.length}
        </span>
      </div>
      <div className={cn("space-y-2.5", !stacked && "max-h-[520px] overflow-y-auto pr-1")}>
        {items.map((item) => (
          <EvidenceCard
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            dimmed={kindFilter !== "all" && item.kind !== kindFilter}
            onSelect={() => onSelect(selectedId === item.id ? null : item.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  dotClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  dotClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition",
        active
          ? "border-violet-500/35 bg-violet-500/10 text-violet-700 dark:text-violet-300"
          : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {dotClass && <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />}
      {label}
      {count != null && <span className="tabular-nums opacity-60">({count})</span>}
    </button>
  );
}
