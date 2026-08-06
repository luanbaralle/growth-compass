import { cn } from "@/lib/utils";
import type { ProjectPriority, ProjectStatus } from "@/domains/projects/types";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/domains/projects/types";

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

export function formatDueDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function isDueOverdue(dueDate: string | null, status: ProjectStatus): boolean {
  if (!dueDate) return false;
  if (status === "done" || status === "cancelled") return false;
  return dueDate < new Date().toISOString().slice(0, 10);
}
