import type { Prospect } from "@/domains/prospection/types";
import {
  formatRelativeDate,
  getNextActionUrgency,
} from "@/domains/prospection/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Clock, MapPin, User } from "lucide-react";
import { useRef } from "react";

export function ProspectCard({
  prospect,
  dragging,
  onDragStart,
  onDragEnd,
}: {
  prospect: Prospect;
  dragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}) {
  const blockClickRef = useRef(false);
  const actionUrgency = getNextActionUrgency(prospect.next_action_date);

  return (
    <Link
      to="/os/prospeccao/$id"
      params={{ id: prospect.id }}
      draggable
      onDragStart={(e) => {
        blockClickRef.current = true;
        e.dataTransfer.setData("text/prospect-id", prospect.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDragEnd={() => {
        onDragEnd?.();
        setTimeout(() => {
          blockClickRef.current = false;
        }, 0);
      }}
      onClick={(e) => {
        if (blockClickRef.current) {
          e.preventDefault();
        }
      }}
      className={cn(
        "group relative block overflow-hidden rounded-lg border border-border/30 bg-surface-elevated/80 p-3.5 transition-all duration-200",
        "hover:border-border/50 hover:bg-surface-elevated hover:shadow-[0_4px_16px_-6px_oklch(0_0_0/0.5)]",
        dragging && "scale-[0.98] opacity-40 shadow-none",
        actionUrgency === "overdue" && "border-red-400/25",
      )}
    >
      {actionUrgency === "overdue" && (
        <span className="absolute inset-y-0 left-0 w-0.5 bg-red-400/70" aria-hidden />
      )}
      {actionUrgency === "today" && (
        <span className="absolute inset-y-0 left-0 w-0.5 bg-amber-400/70" aria-hidden />
      )}

      <p className="truncate text-[13px] font-medium leading-snug text-foreground">
        {prospect.name}
      </p>

      {(prospect.city || prospect.category) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground">
          {prospect.city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0 opacity-50" strokeWidth={1.75} />
              <span className="truncate">{prospect.city}</span>
            </span>
          )}
          {prospect.city && prospect.category && (
            <span className="text-muted-foreground/30">·</span>
          )}
          {prospect.category && <span className="truncate">{prospect.category}</span>}
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/20 pt-2 text-[10px] text-muted-foreground/70">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3 shrink-0 opacity-50" strokeWidth={1.75} />
          {formatRelativeDate(prospect.last_interaction_at)}
        </span>
        {prospect.owner_id && (
          <span className="inline-flex max-w-[45%] items-center gap-1 truncate">
            <User className="h-3 w-3 shrink-0 opacity-50" strokeWidth={1.75} />
            {TEAM_LABELS[prospect.owner_id as TeamMember] ?? prospect.owner_id}
          </span>
        )}
      </div>

      {prospect.next_action && (
        <p
          className={cn(
            "mt-2 truncate rounded-md px-2 py-1 text-[10px] font-medium leading-relaxed",
            actionUrgency === "overdue" && "bg-red-400/12 text-red-400",
            actionUrgency === "today" && "bg-amber-400/12 text-amber-400",
            (actionUrgency === "future" || !actionUrgency) && "bg-brand/8 text-brand/90",
          )}
        >
          {prospect.next_action}
        </p>
      )}

      {prospect.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {prospect.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-background/40 px-1.5 py-0.5 text-[10px] text-muted-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
