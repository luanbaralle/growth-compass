import { updateProspectChecklist } from "@/domains/prospection/api.server";
import type { ChecklistStatus, ProspectChecklistItem } from "@/domains/prospection/types";
import { CHECKLIST_ITEMS } from "@/domains/prospection/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useRef, useState } from "react";

const STATUS_OPTIONS: { value: ChecklistStatus; label: string }[] = [
  { value: "yes", label: "Sim" },
  { value: "no", label: "Não" },
  { value: "partial", label: "Parcial" },
];

export function ProspectChecklist({
  prospectId,
  items,
  onUpdated,
}: {
  prospectId: string;
  items: ProspectChecklistItem[];
  onUpdated: () => void;
}) {
  const itemMap = new Map(items.map((i) => [i.item_key, i]));
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const save = useCallback(
    (itemKey: string, status: ChecklistStatus, notes?: string) => {
      const existing = timers.current.get(itemKey);
      if (existing) clearTimeout(existing);
      timers.current.set(
        itemKey,
        setTimeout(async () => {
          await updateProspectChecklist({
            data: { prospectId, itemKey, status, notes },
          });
          onUpdated();
        }, 400),
      );
    },
    [prospectId, onUpdated],
  );

  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div>
      {CHECKLIST_ITEMS.map((item) => {
        const row = itemMap.get(item.key);
        const status = row?.status ?? "no";
        const notes = row?.notes ?? "";
        return (
          <ChecklistRow
            key={item.key}
            label={item.label}
            status={status}
            notes={notes}
            onStatusChange={(s) => save(item.key, s, notes || undefined)}
            onNotesChange={(n) => save(item.key, status, n || undefined)}
          />
        );
      })}
    </div>
  );
}

function ChecklistRow({
  label,
  status,
  notes,
  onStatusChange,
  onNotesChange,
}: {
  label: string;
  status: ChecklistStatus;
  notes: string;
  onStatusChange: (s: ChecklistStatus) => void;
  onNotesChange: (n: string) => void;
}) {
  const [localNotes, setLocalNotes] = useState(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  return (
    <div className="prospect-checklist-row">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-foreground/90">{label}</p>
        <div className="prospect-segmented">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                status === opt.value
                  ? opt.value === "yes"
                    ? "bg-emerald-400/15 text-emerald-400 shadow-sm"
                    : opt.value === "no"
                      ? "bg-red-400/12 text-red-400 shadow-sm"
                      : "bg-amber-400/12 text-amber-400 shadow-sm"
                  : "text-muted-foreground/60 hover:text-muted-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <Input
        className="h-8 border-border/20 bg-background/30 text-xs"
        placeholder="Observação rápida..."
        value={localNotes}
        onChange={(e) => {
          setLocalNotes(e.target.value);
          onNotesChange(e.target.value);
        }}
      />
    </div>
  );
}
