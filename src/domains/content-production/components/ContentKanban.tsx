import { moveContentTask } from "@/domains/content-production/api.server";
import { ContentTaskCard } from "@/domains/content-production/components/ContentTaskCard";
import type { ContentTaskQuickActions } from "@/domains/content-production/components/ContentTaskContextMenu";
import type { ContentTaskStatus, ContentTaskWithCompany } from "@/domains/content-production/types";
import {
  CONTENT_PHASES,
  STATUS_ACCENT,
  STATUS_LABELS,
} from "@/domains/content-production/types";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { useState } from "react";

export function ContentKanban({
  tasks,
  onMoved,
  onTaskClick,
  onDuplicate,
  taskActions,
}: {
  tasks: ContentTaskWithCompany[];
  onMoved: () => void;
  onTaskClick: (task: ContentTaskWithCompany) => void;
  onDuplicate?: (task: ContentTaskWithCompany) => void;
  taskActions?: ContentTaskQuickActions;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<ContentTaskStatus | null>(null);
  const [moving, setMoving] = useState(false);

  const byStatus = CONTENT_PHASES.reduce(
    (acc, phase) => {
      for (const status of phase.statuses) {
        acc[status] = tasks.filter((t) => t.status === status);
      }
      return acc;
    },
    {} as Record<ContentTaskStatus, ContentTaskWithCompany[]>,
  );

  const draggingTask = draggingId ? tasks.find((t) => t.id === draggingId) : null;
  const isDragging = !!draggingId;

  const clearDragState = () => {
    setDraggingId(null);
    setOverColumn(null);
  };

  const handleDrop = async (status: ContentTaskStatus, taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === status) return;

    setMoving(true);
    try {
      await moveContentTask({ data: { id: taskId, status } });
      onMoved();
    } finally {
      setMoving(false);
    }
  };

  return (
    <div className="relative space-y-6">
      {moving && (
        <div className="pointer-events-none absolute inset-0 z-10 animate-in fade-in duration-200">
          <div className="absolute inset-0 rounded-xl bg-background/30 backdrop-blur-[2px]" />
        </div>
      )}
      {CONTENT_PHASES.map((phase) => (
        <div key={phase.id}>
          <div className="mb-3 flex items-center gap-2 px-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
              {phase.label}
            </p>
            <div className="h-px flex-1 bg-border/40" />
          </div>
          <div
            className={cn(
              "pipeline-board -mx-6 px-6 sm:-mx-7 sm:px-7",
              isDragging && "pipeline-board-dragging",
            )}
          >
            {phase.statuses.map((status) => {
              const items = byStatus[status];
              const isOver = overColumn === status;
              const isValidDrop = draggingTask != null && draggingTask.status !== status;
              const showDropHint = isDragging && isOver && isValidDrop;
              return (
                <div
                  key={status}
                  className={cn(
                    "pipeline-column",
                    showDropHint && "pipeline-column-over",
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setOverColumn(status);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOverColumn((c) => (c === status ? null : c));
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    clearDragState();
                    const id = e.dataTransfer.getData("text/content-task-id");
                    if (id) void handleDrop(status, id);
                  }}
                >
                  <div className="pipeline-column-header">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn("h-2 w-2 shrink-0 rounded-full", STATUS_ACCENT[status])}
                        aria-hidden
                      />
                      <p className="truncate text-xs font-semibold tracking-wide text-foreground/90">
                        {STATUS_LABELS[status]}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium tabular-nums",
                        items.length > 0
                          ? "bg-surface-elevated text-foreground/80"
                          : "text-muted-foreground/60",
                      )}
                    >
                      {items.length}
                    </span>
                  </div>
                  <div className="pipeline-column-body">
                    {items.length === 0 ? (
                      <div
                        className={cn("pipeline-drop-zone", showDropHint && "pipeline-drop-zone-active")}
                      >
                        <Inbox className="h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />
                        <p className="text-[11px] text-muted-foreground/50">
                          {showDropHint ? "Solte aqui" : "Arraste aqui"}
                        </p>
                      </div>
                    ) : (
                      <>
                        {items.map((task) => (
                          <ContentTaskCard
                            key={task.id}
                            task={task}
                            dragging={draggingId === task.id}
                            onDragStart={() => setDraggingId(task.id)}
                            onDragEnd={clearDragState}
                            onClick={() => onTaskClick(task)}
                            onDuplicate={onDuplicate}
                            taskActions={taskActions}
                          />
                        ))}
                        {showDropHint && <div className="content-task-drop-placeholder" aria-hidden />}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
