import {
  BACKLOG_COLUMN_LABELS,
  DELEGATION_STATUS_LABELS,
  DELEGATION_TARGET_LABELS,
  TASK_STATUS_LABELS,
  TEAM_LABELS,
  type BacklogColumn,
  type DelegationStatus,
  type TaskStatus,
  type TeamMember,
} from "@/lib/execution/types";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const PERSON_COLORS: Record<string, string> = {
  vini: "border-brand/30 bg-brand/10 text-brand",
  caio: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  luan: "border-purple-400/30 bg-purple-400/10 text-purple-300",
  sistema: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
};

export function PersonBadge({ person }: { person: TeamMember | string }) {
  const label =
    person in TEAM_LABELS ? TEAM_LABELS[person as TeamMember] : String(person);
  const color = PERSON_COLORS[person] ?? "border-border bg-surface-elevated text-foreground";
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-1.5 py-0.5 text-[11px] font-medium capitalize",
        color,
      )}
    >
      {label}
    </span>
  );
}

const delegationColors: Record<DelegationStatus, string> = {
  not_started: "text-red-400 border-red-400/30 bg-red-400/10",
  in_transition: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  delegated: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
};

const delegationDots: Record<DelegationStatus, string> = {
  not_started: "bg-red-400",
  in_transition: "bg-amber-400",
  delegated: "bg-emerald-400",
};

export function DelegationStatusBadge({ status }: { status: DelegationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors hover:opacity-80",
        delegationColors[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", delegationDots[status])} />
      {DELEGATION_STATUS_LABELS[status]}
    </span>
  );
}

const taskColors: Record<TaskStatus, string> = {
  pending: "border-border/80 text-muted-foreground bg-surface-elevated/50",
  in_progress: "border-amber-400/40 text-amber-300 bg-amber-400/10",
  done: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  blocked: "border-red-400/40 text-red-300 bg-red-400/10",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
        taskColors[status],
      )}
    >
      {TASK_STATUS_LABELS[status]}
    </span>
  );
}

/** @deprecated Use StatCard from ui-kit instead */
export function MetricCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "brand" | "danger" | "success" | "warning";
  icon?: LucideIcon;
}) {
  const Icon = icon;
  const accentClass = {
    brand: "border-brand/25 bg-brand-soft/60",
    danger: "border-red-400/25 bg-red-400/[0.06]",
    success: "border-emerald-400/25 bg-emerald-400/[0.06]",
    warning: "border-amber-400/25 bg-amber-400/[0.06]",
  }[accent ?? "brand"];

  return (
    <div className={cn("rounded-xl border p-4", accentClass)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const overGoal = value > max;
  return (
    <div className="admin-card p-4">
      {label && (
        <div className="mb-2.5 flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className={cn("font-medium tabular-nums", overGoal && "text-emerald-400")}>
            {value}/{max}h ({pct}%)
          </span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            overGoal ? "bg-emerald-400" : "bg-brand",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function TargetLabel({ target }: { target: string }) {
  const label =
    target in DELEGATION_TARGET_LABELS
      ? DELEGATION_TARGET_LABELS[target as keyof typeof DELEGATION_TARGET_LABELS]
      : target;
  return <span>{label}</span>;
}

export function BacklogColumnBadge({ column }: { column: BacklogColumn }) {
  const colors: Record<BacklogColumn, string> = {
    agora: "border-red-400/40 text-red-300 bg-red-400/10",
    proximo: "border-amber-400/40 text-amber-300 bg-amber-400/10",
    depois: "border-blue-400/40 text-blue-300 bg-blue-400/10",
    nao_agora: "border-border text-muted-foreground bg-surface-elevated/50",
  };
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", colors[column])}>
      {BACKLOG_COLUMN_LABELS[column]}
    </span>
  );
}

export { TEAM_LABELS, TASK_STATUS_LABELS, BACKLOG_COLUMN_LABELS };
