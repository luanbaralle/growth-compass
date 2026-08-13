import type { ContentTaskWithCompany } from "@/domains/content-production/types";
import { STATUS_ACCENT, STATUS_LABELS } from "@/domains/content-production/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import { Building2, User } from "lucide-react";
import { useRef } from "react";

export function ContentCalendarTaskCard({
  task,
  onClick,
  draggable = false,
  dragging = false,
  onDragStart,
  onDragEnd,
}: {
  task: ContentTaskWithCompany;
  onClick?: () => void;
  draggable?: boolean;
  dragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const blockClickRef = useRef(false);

  const ownerLabel = task.production_owner_id
    ? (TEAM_LABELS[task.production_owner_id as TeamMember] ?? task.production_owner_id)
    : null;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      draggable={draggable}
      onDragStart={(e) => {
        if (!draggable) return;
        blockClickRef.current = true;
        e.dataTransfer.setData("text/content-task-id", task.id);
        e.dataTransfer.setData("text/content-task-date", task.post_date ?? "");
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDragEnd={() => {
        onDragEnd?.();
        setTimeout(() => {
          blockClickRef.current = false;
        }, 0);
      }}
      onClick={() => {
        if (blockClickRef.current || !onClick) return;
        onClick();
      }}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group/card relative w-full overflow-hidden rounded-md border border-border/30 bg-surface-elevated/90",
        "px-2 py-1.5 text-left transition-colors",
        onClick && "cursor-pointer hover:border-border/50 hover:bg-surface-elevated",
        draggable && "cursor-grab active:cursor-grabbing",
        dragging && "scale-[0.98] opacity-40",
      )}
    >
      <span
        className={cn("absolute inset-y-0 left-0 w-0.5", STATUS_ACCENT[task.status])}
        aria-hidden
      />

      <p className="truncate pl-1.5 text-[11px] font-semibold leading-snug text-foreground">
        {task.title}
      </p>

      <div className="mt-1 space-y-0.5 pl-1.5">
        <p className="flex min-w-0 items-center gap-1 text-[10px] text-muted-foreground">
          <Building2 className="h-3 w-3 shrink-0 opacity-50" strokeWidth={1.75} />
          <span className="truncate">{task.companies?.name ?? "Sem cliente"}</span>
        </p>
        <p className="flex min-w-0 items-center gap-1 text-[10px] text-muted-foreground">
          <User className="h-3 w-3 shrink-0 opacity-50" strokeWidth={1.75} />
          <span className="truncate">{ownerLabel ?? "Sem responsável"}</span>
        </p>
      </div>

      <div className="mt-1.5 pl-1.5">
        <span
          className={cn(
            "inline-flex max-w-full items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-medium leading-none",
            "bg-background/60 text-foreground/80 ring-1 ring-border/30",
          )}
        >
          <span
            className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_ACCENT[task.status])}
            aria-hidden
          />
          <span className="truncate">{STATUS_LABELS[task.status]}</span>
        </span>
      </div>
    </div>
  );
}
