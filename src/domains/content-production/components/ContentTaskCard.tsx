import type { ContentTaskWithCompany } from "@/domains/content-production/types";
import {
  CHANNEL_LABELS,
  formatPostDate,
  STATUS_ACCENT,
  TYPE_LABELS,
} from "@/domains/content-production/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import { Calendar, User } from "lucide-react";
import { useRef } from "react";

export function ContentTaskCard({
  task,
  dragging,
  onDragStart,
  onDragEnd,
  onClick,
}: {
  task: ContentTaskWithCompany;
  dragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onClick?: () => void;
}) {
  const blockClickRef = useRef(false);

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        blockClickRef.current = true;
        e.dataTransfer.setData("text/content-task-id", task.id);
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
        if (blockClickRef.current) return;
        onClick?.();
      }}
      className={cn(
        "group relative w-full cursor-grab overflow-hidden rounded-lg border border-border/30 bg-surface-elevated/80 p-3.5 text-left transition-all duration-200 active:cursor-grabbing",
        "hover:border-border/50 hover:bg-surface-elevated hover:shadow-[0_4px_16px_-6px_oklch(0_0_0/0.5)]",
        dragging && "scale-[0.98] opacity-40 shadow-none",
      )}
    >
      <div className="flex items-start gap-2">
        <span
          className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", STATUS_ACCENT[task.status])}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium leading-snug text-foreground">
            {task.title}
          </p>
          {task.companies?.name && (
            <p className="mt-1 truncate text-[11px] text-muted-foreground">{task.companies.name}</p>
          )}
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1">
        {task.channels.map((channel) => (
          <span
            key={channel}
            className="rounded-md bg-background/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
          >
            {CHANNEL_LABELS[channel]}
          </span>
        ))}
        <span className="rounded-md bg-background/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          {TYPE_LABELS[task.content_type]}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/20 pt-2 text-[10px] text-muted-foreground/70">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3 shrink-0 opacity-50" strokeWidth={1.75} />
          {formatPostDate(task.post_date)}
        </span>
        {task.production_owner_id && (
          <span className="inline-flex max-w-[45%] items-center gap-1 truncate">
            <User className="h-3 w-3 shrink-0 opacity-50" strokeWidth={1.75} />
            {TEAM_LABELS[task.production_owner_id as TeamMember] ?? task.production_owner_id}
          </span>
        )}
      </div>

      {task.theme_objective && (
        <p className="mt-2 line-clamp-2 rounded-md bg-brand/8 px-2 py-1 text-[10px] leading-relaxed text-brand/90">
          {task.theme_objective}
        </p>
      )}
    </button>
  );
}
