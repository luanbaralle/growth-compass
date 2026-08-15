import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { deltaTone, formatDelta } from "@/client/components/client-utils";

export function ClientKpiCard({
  label,
  value,
  hint,
  icon: Icon,
  delta,
  invertDelta,
  accent = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  delta?: number | null;
  invertDelta?: boolean;
  accent?: "default" | "amber" | "emerald" | "rose";
}) {
  const tone = deltaTone(delta, invertDelta);

  return (
    <div className={cn("client-kpi", accent !== "default" && `client-kpi-${accent}`)}>
      <div className="client-kpi-top">
        <span className="client-kpi-icon">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        {delta != null && (
          <span
            className={cn(
              "client-kpi-delta",
              tone === "positive" && "client-kpi-delta-up",
              tone === "negative" && "client-kpi-delta-down",
            )}
          >
            {formatDelta(delta)}
          </span>
        )}
      </div>
      <p className="client-kpi-value">{value}</p>
      <p className="client-kpi-label">{label}</p>
      {hint ? <p className="client-kpi-hint">{hint}</p> : null}
    </div>
  );
}
