import type { Prospect } from "@/domains/prospection/types";
import {
  formatRelativeDate,
  getNextActionUrgency,
} from "@/domains/prospection/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
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
        "dashboard-card-interactive block p-3",
        dragging && "opacity-50 ring-1 ring-brand/40",
        actionUrgency === "overdue" && "ring-1 ring-red-400/40",
      )}
    >
      <p className="truncate text-sm font-medium">{prospect.name}</p>
      <div className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
        {prospect.city && <p className="truncate">{prospect.city}</p>}
        {prospect.category && <p className="truncate">{prospect.category}</p>}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
        <span>{formatRelativeDate(prospect.last_interaction_at)}</span>
        {prospect.owner_id && (
          <span className="truncate">
            {TEAM_LABELS[prospect.owner_id as TeamMember] ?? prospect.owner_id}
          </span>
        )}
      </div>
      {prospect.next_action && (
        <p
          className={cn(
            "mt-2 truncate rounded-md px-2 py-1 text-[10px] font-medium",
            actionUrgency === "overdue" && "bg-red-400/15 text-red-400",
            actionUrgency === "today" && "bg-amber-400/15 text-amber-400",
            actionUrgency === "future" && "bg-brand-soft/40 text-brand",
            !actionUrgency && "bg-brand-soft/40 text-brand",
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
              className="rounded-full border border-border/50 px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
