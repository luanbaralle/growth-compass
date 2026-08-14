import { cn } from "@/lib/utils";
import type { ProjectBlockedByType, ProjectPriority, ProjectStatus } from "@/domains/projects/types";
import {
  BLOCKED_BY_LABELS,
  formatNextActionDue,
  isDueOverdue,
  PRIORITY_LABELS,
  projectNeedsBlockReason,
  projectNeedsNextAction,
  STATUS_LABELS,
} from "@/domains/projects/types";
import { AlertTriangle } from "lucide-react";

export { formatNextActionDue, isDueOverdue };

const statusStyles: Record<ProjectStatus, string> = {
  pending: "border-zinc-400/40 text-zinc-300 bg-zinc-400/10",
  in_progress: "border-blue-400/40 text-blue-300 bg-blue-400/10",
  review: "border-violet-400/40 text-violet-300 bg-violet-400/10",
  done: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  blocked: "border-red-400/40 text-red-300 bg-red-400/10",
  cancelled: "border-zinc-500/40 text-zinc-500 bg-zinc-500/10",
};

const priorityStyles: Record<ProjectPriority, string> = {
  low: "text-zinc-400",
  medium: "text-blue-300",
  high: "text-amber-300",
  urgent: "text-red-400",
};

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
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

export function ProjectPriorityLabel({
  priority,
  className,
}: {
  priority: ProjectPriority;
  className?: string;
}) {
  return (
    <span className={cn("text-xs font-medium", priorityStyles[priority], className)}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

export function ProjectBlockedByBadge({
  type,
  className,
}: {
  type: ProjectBlockedByType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-red-400/30 bg-red-400/10 px-2.5 py-0.5 text-xs font-medium text-red-300",
        className,
      )}
    >
      {BLOCKED_BY_LABELS[type]}
    </span>
  );
}

export function formatDueDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function ProjectOperationalAlert({
  project,
}: {
  project: {
    due_date: string | null;
    status: ProjectStatus;
    next_action: string | null;
    blocked_by_type: ProjectBlockedByType | null;
  };
}) {
  const needsAction = projectNeedsNextAction(project);
  const needsBlock = projectNeedsBlockReason(project);

  if (!needsAction && !needsBlock) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {needsBlock && (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/25 bg-red-400/10 px-2.5 py-1 text-xs text-red-300">
          <AlertTriangle className="h-3.5 w-3.5" />
          Bloqueado sem motivo registrado
        </span>
      )}
      {needsAction && (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-300">
          <AlertTriangle className="h-3.5 w-3.5" />
          Atrasado — defina a próxima ação
        </span>
      )}
    </div>
  );
}
