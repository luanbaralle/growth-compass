import type { DomainCoverage } from "../types";
import { cn } from "@/lib/utils";

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

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        Métricas do diagnóstico
      </p>

      {knowledgeDepth != null && knowledgeDepth > 0 && (
        <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Knowledge depth</span>
            <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {knowledgeDepth}%
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full rounded-full bg-emerald-500/80 transition-all duration-500"
              style={{ width: `${knowledgeDepth}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground/70">
            Riqueza do conhecimento extraído da reunião
          </p>
        </div>
      )}

      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        Diagnostic coverage
      </p>
      <div className="space-y-2">
        {visible.map((item) => (
          <div key={item.domain}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="tabular-nums text-muted-foreground/80">{item.percent}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-foreground/70 transition-all duration-500"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-t border-border/50 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground/80">Coverage overall</span>
          <span className="text-sm font-semibold tabular-nums">{overall}%</span>
        </div>
        {proposalStatus && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Proposal readiness</span>
            <span className="capitalize text-muted-foreground/80">
              {proposalStatus.replace("_", " ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
