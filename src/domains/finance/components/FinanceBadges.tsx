import { cn } from "@/lib/utils";
import type { FinanceEntryStatus, FinanceEntryType } from "@/domains/finance/types";
import { STATUS_LABELS, TYPE_LABELS, formatMoney } from "@/domains/finance/types";

const statusStyles: Record<FinanceEntryStatus, string> = {
  paid: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  pending: "border-amber-400/40 text-amber-300 bg-amber-400/10",
  overdue: "border-red-400/40 text-red-300 bg-red-400/10",
  cancelled: "border-zinc-500/40 text-zinc-500 bg-zinc-500/10",
};

export function FinanceStatusBadge({
  status,
  className,
}: {
  status: FinanceEntryStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function FinanceTypeLabel({
  type,
  className,
}: {
  type: FinanceEntryType;
  className?: string;
}) {
  return (
    <span className={cn("text-xs text-muted-foreground", className)}>
      {TYPE_LABELS[type]}
    </span>
  );
}

export function formatDueDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export { formatMoney };
