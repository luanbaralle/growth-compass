import type { DomainCoverage } from "../types";
import { cn } from "@/lib/utils";

export function CoveragePanel({
  coverage,
  overall,
  className,
}: {
  coverage: DomainCoverage[];
  overall: number;
  className?: string;
}) {
  const visible = coverage.filter((c) => c.total > 0);

  return (
    <div className={cn("space-y-3", className)}>
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
      <div className="border-t border-border/50 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground/80">Overall</span>
          <span className="text-sm font-semibold tabular-nums">{overall}%</span>
        </div>
      </div>
    </div>
  );
}
