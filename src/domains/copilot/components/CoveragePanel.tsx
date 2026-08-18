import type { DomainCoverage } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

function barColor(percent: number): string {
  if (percent >= 50) return "bg-emerald-500/85";
  if (percent >= 25) return "bg-amber-500/85";
  return "bg-foreground/45";
}

function ReadinessPill({ status }: { status?: string }) {
  const label = status?.replace("_", " ") ?? "—";
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        status === "ready" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        status === "partial" && "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        status === "not_ready" && "bg-red-500/12 text-red-500/90 dark:text-red-400",
        !status && "bg-muted text-muted-foreground",
      )}
    >
      {label}
    </span>
  );
}

export function CoveragePanel({
  coverage,
  overall,
  knowledgeDepth,
  proposalStatus,
  className,
}: {
  coverage: DomainCoverage[];
  overall: number;
  knowledgeDepth?: number;
  proposalStatus?: string;
  className?: string;
}) {
  const visible = coverage.filter((c) => c.total > 0);
  const sorted = [...visible].sort((a, b) => b.percent - a.percent);

  return (
    <Card className={cn("border-border/50 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Métricas</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Hero metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/40 bg-muted/15 px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Coverage
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight">{overall}%</p>
            <Progress value={overall} className="mt-2 h-1.5" />
          </div>
          <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Profundidade
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">
              {knowledgeDepth ?? 0}%
            </p>
            <Progress
              value={knowledgeDepth ?? 0}
              className="mt-2 h-1.5 [&>div]:bg-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/35 px-3 py-2">
          <span className="text-xs text-muted-foreground">Proposta</span>
          <ReadinessPill status={proposalStatus} />
        </div>

        {/* Domain bars */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            Por domínio
          </p>
          {sorted.map((item) => (
            <div key={item.domain}>
              <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-muted-foreground">{item.label}</span>
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
      </CardContent>
    </Card>
  );
}
