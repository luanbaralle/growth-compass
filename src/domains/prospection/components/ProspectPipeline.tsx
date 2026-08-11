import { moveProspect } from "@/domains/prospection/api.server";
import type { Prospect, ProspectStatus } from "@/domains/prospection/types";
import { PROSPECT_STATUSES, STATUS_ACCENT, STATUS_LABELS } from "@/domains/prospection/types";
import { ProspectCard } from "@/domains/prospection/components/ProspectCard";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { useState } from "react";

export function ProspectPipeline({
  prospects,
  onMoved,
}: {
  prospects: Prospect[];
  onMoved: () => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<ProspectStatus | null>(null);
  const [moving, setMoving] = useState(false);

  const byStatus = PROSPECT_STATUSES.reduce(
    (acc, status) => {
      acc[status] = prospects.filter((p) => p.status === status);
      return acc;
    },
    {} as Record<ProspectStatus, Prospect[]>,
  );

  const clearDragState = () => {
    setDraggingId(null);
    setOverColumn(null);
  };

  const handleDrop = async (status: ProspectStatus, prospectId: string) => {
    const prospect = prospects.find((p) => p.id === prospectId);
    if (!prospect || prospect.status === status) return;

    setMoving(true);
    try {
      await moveProspect({ data: { id: prospectId, status } });
      onMoved();
    } finally {
      setMoving(false);
    }
  };

  return (
    <div className="relative">
      {moving && (
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-background/50 backdrop-blur-[1px]" />
      )}
      <div className="pipeline-board -mx-6 px-6 sm:-mx-7 sm:px-7">
        {PROSPECT_STATUSES.map((status) => {
          const items = byStatus[status];
          const isOver = overColumn === status;
          return (
            <div
              key={status}
              className={cn("pipeline-column", isOver && "pipeline-column-over")}
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
                const id = e.dataTransfer.getData("text/prospect-id");
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
                  <div className="pipeline-drop-zone">
                    <Inbox className="h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />
                    <p className="text-[11px] text-muted-foreground/50">Arraste aqui</p>
                  </div>
                ) : (
                  items.map((prospect) => (
                    <ProspectCard
                      key={prospect.id}
                      prospect={prospect}
                      dragging={draggingId === prospect.id}
                      onDragStart={() => setDraggingId(prospect.id)}
                      onDragEnd={clearDragState}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
