import type { EvidenceGraphItem, EvidenceKind } from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GitBranch, Quote } from "lucide-react";
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

const KIND_LABELS: Record<EvidenceKind, string> = {
  fact: "Fato",
  inference: "Inferência",
  hypothesis: "Hipótese",
  opportunity: "Oportunidade",
};

const KIND_STYLES: Record<EvidenceKind, string> = {
  fact: "border-emerald-500/25 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400",
  inference: "border-sky-500/25 bg-sky-500/8 text-sky-700 dark:text-sky-400",
  hypothesis: "border-violet-500/25 bg-violet-500/8 text-violet-700 dark:text-violet-400",
  opportunity: "border-amber-500/25 bg-amber-500/8 text-amber-700 dark:text-amber-400",
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

function groupByDomain(items: EvidenceGraphItem[]): Map<string, EvidenceGraphItem[]> {
  const map = new Map<string, EvidenceGraphItem[]>();
  for (const item of items) {
    const key = item.domain;
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return map;
}

function EvidenceRow({ item }: { item: EvidenceGraphItem }) {
  return (
    <div className="rounded-lg border border-border/40 bg-muted/10 px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className={cn("text-[10px] font-medium", KIND_STYLES[item.kind])}>
          {KIND_LABELS[item.kind]}
        </Badge>
        <Badge variant="outline" className="text-[10px] text-muted-foreground">
          {SOURCE_LABELS[item.source] ?? item.source}
        </Badge>
        <Badge variant="outline" className="text-[10px] text-muted-foreground">
          {CONFIDENCE_LABELS[item.confidence] ?? item.confidence}
        </Badge>
        {item.status === "tentative" && (
          <Badge variant="outline" className="border-amber-500/20 text-[10px] text-amber-600">
            Tentativo
          </Badge>
        )}
        {item.objectiveKey && (
          <Badge variant="outline" className="font-mono text-[9px] text-muted-foreground/80">
            {item.objectiveKey}
          </Badge>
        )}
      </div>
      <p className="mt-2 text-xs font-semibold text-foreground/90">{item.label}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-foreground/80">{item.value}</p>
      {item.quote && (
        <p className="mt-2 flex gap-1.5 text-[11px] italic leading-relaxed text-muted-foreground">
          <Quote className="mt-0.5 h-3 w-3 shrink-0 opacity-60" />
          {item.quote}
        </p>
      )}
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

  const filtered = useMemo(
    () => (kindFilter === "all" ? items : items.filter((i) => i.kind === kindFilter)),
    [items, kindFilter],
  );

  const grouped = useMemo(() => groupByDomain(filtered), [filtered]);

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

  const domains = [...grouped.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  );

  if (items.length === 0) {
    return (
      <Card className={cn("border-border/50 shadow-sm", className)}>
        <CardContent className="py-8 text-center">
          <GitBranch className="mx-auto h-8 w-8 text-muted-foreground/30" />
          <p className="mt-3 text-xs text-muted-foreground/70">
            Evidence graph vazio — reprocessar após encerrar a reunião.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/50 shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Evidence graph</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px] tabular-nums">
            {filtered.length}/{items.length}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Fatos, inferências e oportunidades com fonte e confiança.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex flex-wrap gap-1.5">
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
                label={`${KIND_LABELS[kind]} (${kindCounts[kind]})`}
              />
            ) : null,
          )}
        </div>

        <Accordion type="multiple" defaultValue={domains.slice(0, 2).map(([d]) => d)}>
          {domains.map(([domain, domainItems]) => (
            <AccordionItem key={domain} value={domain} className="border-border/35">
              <AccordionTrigger className="py-2 text-xs font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  {DOMAIN_LABELS[domain] ?? domain}
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                    {domainItems.length}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pb-1">
                  {domainItems.map((item) => (
                    <EvidenceRow key={item.id} item={item} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[10px] font-medium transition",
        active
          ? "border-violet-500/35 bg-violet-500/10 text-violet-700 dark:text-violet-300"
          : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
