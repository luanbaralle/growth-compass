import type { DomainCoverage, ProposalReadiness } from "../types";
import { resolveDomainLabel } from "../knowledge/domains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import { computeProposalReadinessPercent } from "./diagnosis-helpers";

function barColor(percent: number): string {
  if (percent >= 50) return "bg-emerald-500/85";
  if (percent >= 25) return "bg-amber-500/85";
  return "bg-foreground/45";
}

export function CoveragePanel({
  coverage,
  overall,
  knowledgeDepth,
  proposalReadiness,
  className,
}: {
  coverage: DomainCoverage[];
  overall: number;
  knowledgeDepth?: number;
  proposalReadiness?: ProposalReadiness;
  className?: string;
}) {
  const visible = coverage.filter((c) => c.total > 0);
  const sorted = [...visible].sort((a, b) => b.percent - a.percent);
  const readinessPercent = proposalReadiness
    ? computeProposalReadinessPercent(proposalReadiness)
    : 0;

  return (
    <Card className={cn("border-border/50 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Indicadores</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <MetricRow
            label="Cobertura diagnóstica"
            value={overall}
            hint="Quanto do roteiro comercial foi explorado"
          />
          <MetricRow
            label="Confiança do conhecimento"
            value={knowledgeDepth ?? 0}
            accent="emerald"
            hint="Profundidade das evidências coletadas"
          />
          <MetricRow
            label="Prontidão p/ proposta"
            value={readinessPercent}
            accent="amber"
            hint={
              proposalReadiness?.blockers[0] ??
              `${proposalReadiness?.items.filter((i) => i.status !== "ready").length ?? 0} itens pendentes`
            }
          />
        </div>

        {sorted.length > 0 && (
          <div className="space-y-2.5 border-t border-border/35 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Por domínio
            </p>
            {sorted.map((item) => (
              <div key={item.domain}>
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate text-muted-foreground">
                    {resolveDomainLabel(item.domain, item.label)}
                  </span>
                  <span className="shrink-0 tabular-nums font-medium text-foreground/75">
                    {item.percent}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      barColor(item.percent),
                    )}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricRow({
  label,
  value,
  accent,
  hint,
}: {
  label: string;
  value: number;
  accent?: "emerald" | "amber";
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border/35 bg-muted/10 px-3 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            "text-lg font-bold tabular-nums",
            accent === "emerald" && "text-emerald-600 dark:text-emerald-400",
            accent === "amber" && "text-amber-600 dark:text-amber-400",
          )}
        >
          {value}%
        </p>
      </div>
      <Progress
        value={value}
        className={cn(
          "mt-2 h-1.5",
          accent === "emerald" && "[&>div]:bg-emerald-500",
          accent === "amber" && "[&>div]:bg-amber-500",
        )}
      />
      {hint && <p className="mt-1.5 text-[10px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}
