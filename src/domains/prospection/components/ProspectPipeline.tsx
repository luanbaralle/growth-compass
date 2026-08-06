import { moveProspect } from "@/domains/prospection/api.server";
import type { Prospect, ProspectStatus } from "@/domains/prospection/types";
import { PROSPECT_STATUSES, STATUS_LABELS } from "@/domains/prospection/types";
import { ProspectCard } from "@/domains/prospection/components/ProspectCard";
import { cn } from "@/lib/utils";
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

  const handleDrop = async (status: ProspectStatus, prospectId: string) => {
    const prospect = prospects.find((p) => p.id === prospectId);
    if (!prospect || prospect.status === status) return;

    setMoving(true);
    try {
      await moveProspect({ data: { id: prospectId, status } });
      onMoved();
    } finally {
      setMoving(false);
      setDraggingId(null);
      setOverColumn(null);
    }
  };

  return (
    <div className="relative">
      {moving && (
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-background/40" />
      )}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {PROSPECT_STATUSES.map((status) => {
          const items = byStatus[status];
          const isOver = overColumn === status;
          return (
            <div
              key={status}
              className={cn(
                "flex w-[240px] shrink-0 flex-col rounded-xl border border-border/50 bg-surface-elevated/20",
                isOver && "border-brand/40 bg-brand-soft/20",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setOverColumn(status);
              }}
              onDragLeave={() => setOverColumn((c) => (c === status ? null : c))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/prospect-id");
                if (id) void handleDrop(status, id);
              }}
            >
              <div className="flex items-center justify-between border-b border-border/40 px-3 py-2.5">
                <p className="text-xs font-semibold">{STATUS_LABELS[status]}</p>
                <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="flex min-h-[120px] flex-1 flex-col gap-2 p-2">
                {items.length === 0 ? (
                  <p className="px-1 py-4 text-center text-[11px] text-muted-foreground">
                    Arraste aqui
                  </p>
                ) : (
                  items.map((prospect) => (
                    <ProspectCard
                      key={prospect.id}
                      prospect={prospect}
                      dragging={draggingId === prospect.id}
                      onDragStart={() => setDraggingId(prospect.id)}
                      onDragEnd={() => setDraggingId(null)}
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
