import { updateContentTask } from "@/domains/content-production/api.server";
import { ContentCalendarTaskCard } from "@/domains/content-production/components/ContentCalendarTaskCard";
import type { ContentTaskWithCompany } from "@/domains/content-production/types";
import { cn } from "@/lib/utils";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ChevronUp, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const VISIBLE_TASKS = 2;

export function ContentCalendar({
  tasks,
  onTaskClick,
  onDayClick,
  onRescheduled,
}: {
  tasks: ContentTaskWithCompany[];
  onTaskClick: (task: ContentTaskWithCompany) => void;
  onDayClick: (date: string) => void;
  onRescheduled: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [expandedDates, setExpandedDates] = useState<Set<string>>(() => new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overDate, setOverDate] = useState<string | null>(null);
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    setExpandedDates(new Set());
  }, [currentMonth]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, ContentTaskWithCompany[]>();
    for (const task of tasks) {
      if (!task.post_date) continue;
      const list = map.get(task.post_date) ?? [];
      list.push(task);
      map.set(task.post_date, list);
    }
    return map;
  }, [tasks]);

  const taskMap = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);

  const unscheduled = useMemo(
    () => tasks.filter((t) => !t.post_date),
    [tasks],
  );

  const toDateKey = (date: Date) => format(date, "yyyy-MM-dd");

  const expandDay = (dateKey: string) => {
    setExpandedDates((prev) => new Set(prev).add(dateKey));
  };

  const collapseDay = (dateKey: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      next.delete(dateKey);
      return next;
    });
  };

  const clearDragState = () => {
    setDraggingId(null);
    setOverDate(null);
  };

  const handleDrop = async (targetDate: string, taskId: string) => {
    const task = taskMap.get(taskId);
    if (!task || task.post_date === targetDate) return;

    setRescheduling(true);
    try {
      await updateContentTask({
        data: {
          id: task.id,
          companyId: task.company_id,
          postDate: targetDate,
        },
      });
      onRescheduled();
    } finally {
      setRescheduling(false);
      clearDragState();
    }
  };

  const renderTaskCard = (task: ContentTaskWithCompany) => (
    <ContentCalendarTaskCard
      key={task.id}
      task={task}
      draggable
      dragging={draggingId === task.id}
      onDragStart={() => setDraggingId(task.id)}
      onDragEnd={clearDragState}
      onClick={() => onTaskClick(task)}
    />
  );

  return (
    <div className="relative space-y-6">
      {rescheduling && (
        <div className="pointer-events-none absolute inset-0 z-40 rounded-xl bg-background/40 backdrop-blur-[1px]" />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => addDays(startOfMonth(m), -1))}
            className="dashboard-btn-ghost !p-2"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="min-w-[160px] text-center font-display text-lg font-semibold capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h3>
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => addDays(endOfMonth(m), 1))}
            className="dashboard-btn-ghost !p-2"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setCurrentMonth(startOfMonth(new Date()))}
          className="dashboard-btn-ghost text-xs"
        >
          Hoje
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Arraste uma tarefa para outro dia para reagendar. Expanda quantos dias quiser com
        &quot;+N mais&quot; — cada um recolhe independentemente.
      </p>

      <div className="overflow-hidden rounded-xl border border-border/40 bg-surface/20">
        <div className="grid grid-cols-7 border-b border-border/40 bg-surface-elevated/40">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 items-stretch">
          {calendarDays.map((day) => {
            const dateKey = toDateKey(day);
            const dayTasks = tasksByDate.get(dateKey) ?? [];
            const inMonth = isSameMonth(day, currentMonth);
            const today = isToday(day);
            const isExpanded = expandedDates.has(dateKey);
            const isOver = overDate === dateKey;
            const hiddenCount = Math.max(0, dayTasks.length - VISIBLE_TASKS);
            const visibleTasks = isExpanded ? dayTasks : dayTasks.slice(0, VISIBLE_TASKS);

            return (
              <div
                key={dateKey}
                className={cn(
                  "group flex min-h-[9rem] flex-col border-b border-r border-border/25 p-1.5 sm:min-h-[10.5rem] sm:p-2",
                  !inMonth && "bg-background/30 opacity-50",
                  isExpanded && "bg-brand/[0.03] ring-1 ring-inset ring-brand/20",
                  isOver && "bg-brand/5 ring-1 ring-inset ring-brand/25",
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setOverDate(dateKey);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOverDate((d) => (d === dateKey ? null : d));
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/content-task-id");
                  if (id) void handleDrop(dateKey, id);
                  else clearDragState();
                }}
              >
                <div className="mb-1.5 flex shrink-0 items-center justify-between gap-1">
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                      today && "bg-brand text-brand-foreground",
                      !today && "text-muted-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDayClick(dateKey)}
                    className="rounded-md p-0.5 opacity-0 transition-opacity hover:bg-surface-elevated group-hover:opacity-100"
                    title="Nova tarefa neste dia"
                  >
                    <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col gap-1.5">
                  {visibleTasks.map((task) => renderTaskCard(task))}

                  {!isExpanded && hiddenCount > 0 && (
                    <button
                      type="button"
                      onClick={() => expandDay(dateKey)}
                      className="w-full shrink-0 rounded-md border border-dashed border-border/40 px-1.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                    >
                      +{hiddenCount} mais — ver todas
                    </button>
                  )}

                  {isExpanded && hiddenCount > 0 && (
                    <button
                      type="button"
                      onClick={() => collapseDay(dateKey)}
                      className="mt-auto flex w-full shrink-0 items-center justify-center gap-1 rounded-md border border-border/30 px-1.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
                    >
                      <ChevronUp className="h-3 w-3" />
                      Recolher
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {unscheduled.length > 0 && (
        <div className="rounded-xl border border-border/40 bg-surface/20 p-4 sm:p-5">
          <h4 className="text-sm font-semibold text-foreground/90">
            Sem data de postagem ({unscheduled.length})
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Arraste para um dia no calendário para agendar, ou clique para editar.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {unscheduled.map((task) => renderTaskCard(task))}
          </div>
        </div>
      )}
    </div>
  );
}
