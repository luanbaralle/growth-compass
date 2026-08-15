import { createTask, getMyAgenda, setTaskDone } from "@/domains/tasks/api.server";
import type { AgendaBucket, OSTaskWithRelations } from "@/domains/tasks/types";
import {
  AGENDA_BUCKET_LABELS,
  formatTaskDueDate,
  groupAgendaTasks,
  isTaskOverdue,
} from "@/domains/tasks/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  FilterPill,
  FilterPillsRow,
  OSPage,
  OSPrimaryButton,
  OSRefreshButton,
  PageHeader,
  PageSkeleton,
  StatCard,
} from "@/os/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { CalendarDays, Check, Circle, ListTodo, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type AgendaView = "pending" | "done";

const BUCKET_ORDER: AgendaBucket[] = ["overdue", "today", "upcoming", "no_date"];

export function AgendaPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<AgendaView>("pending");
  const [agenda, setAgenda] = useState<Awaited<ReturnType<typeof getMyAgenda>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getMyAgenda();
      setAgenda(result);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar agenda."));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      await createTask({
        data: {
          title: title.trim(),
          dueDate: dueDate || "",
        },
      });
      setTitle("");
      setDueDate("");
      toast.success("Tarefa adicionada");
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao criar tarefa."));
    } finally {
      setCreating(false);
    }
  };

  const handleToggleDone = async (task: OSTaskWithRelations, done: boolean) => {
    setTogglingId(task.id);
    try {
      await setTaskDone({ data: { id: task.id, done } });
      setAgenda((current) => {
        if (!current) return current;
        const allTasks = [
          ...current.pending.overdue,
          ...current.pending.today,
          ...current.pending.upcoming,
          ...current.pending.no_date,
          ...current.done,
        ].map((item) => (item.id === task.id ? { ...item, done } : item));
        return groupAgendaTasks(allTasks);
      });
      toast.success(done ? "Tarefa concluída" : "Tarefa reaberta");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao atualizar tarefa."));
      await load();
    } finally {
      setTogglingId(null);
    }
  };

  if (loading && !agenda) {
    return <PageSkeleton title="Minha agenda" metricCount={4} />;
  }

  const summary = agenda?.summary ?? {
    overdue: 0,
    today: 0,
    upcoming: 0,
    noDate: 0,
    done: 0,
  };
  const pendingTotal = summary.overdue + summary.today + summary.upcoming + summary.noDate;

  return (
    <OSPage className="space-y-6">
      <PageHeader
        title="Minha agenda"
        description="Suas tarefas do dia — manuais e automáticas do OS"
        actions={<OSRefreshButton onClick={() => void load()} loading={loading} />}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Atrasadas"
          value={String(summary.overdue)}
          sub={summary.overdue > 0 ? "Precisam de ação" : "Nada atrasado"}
          icon={ListTodo}
          accent={summary.overdue > 0 ? "danger" : "success"}
        />
        <StatCard
          label="Hoje"
          value={String(summary.today)}
          sub="Vencem hoje"
          icon={CalendarDays}
          accent={summary.today > 0 ? "warning" : "neutral"}
        />
        <StatCard
          label="Próximas"
          value={String(summary.upcoming)}
          sub="Futuro"
          icon={CalendarDays}
          accent="brand"
        />
        <StatCard
          label="Concluídas"
          value={String(summary.done)}
          sub={`${pendingTotal} pendente(s)`}
          icon={Check}
          accent="success"
        />
      </section>

      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-xl border border-border/40 bg-surface/20 p-4 sm:flex-row sm:items-end"
      >
        <div className="min-w-0 flex-1 space-y-1.5">
          <label htmlFor="agenda-title" className="text-xs font-medium text-muted-foreground">
            Nova tarefa
          </label>
          <input
            id="agenda-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Cobrar cliente, revisar LP..."
            className="dashboard-control h-10 w-full px-3 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="agenda-due" className="text-xs font-medium text-muted-foreground">
            Prazo
          </label>
          <input
            id="agenda-due"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="dashboard-control h-10 w-full px-3 text-sm sm:w-[160px]"
          />
        </div>
        <OSPrimaryButton type="submit" disabled={creating || !title.trim()} className="h-10">
          <Plus className="h-4 w-4" />
          {creating ? "Salvando..." : "Adicionar"}
        </OSPrimaryButton>
      </form>

      <FilterPillsRow>
        <FilterPill
          active={view === "pending"}
          onClick={() => setView("pending")}
          label={`Pendentes (${pendingTotal})`}
        />
        <FilterPill
          active={view === "done"}
          onClick={() => setView("done")}
          label={`Concluídas (${summary.done})`}
        />
      </FilterPillsRow>

      {error && <EmptyState title="Erro ao carregar" description={error} />}

      {!error && view === "pending" && pendingTotal === 0 && (
        <EmptyState
          title="Agenda livre"
          description="Nenhuma tarefa pendente. Adicione uma acima ou conclua o que veio dos eventos automáticos."
        />
      )}

      {!error && view === "done" && summary.done === 0 && (
        <EmptyState title="Nenhuma concluída" description="Tarefas finalizadas aparecem aqui." />
      )}

      {!error && view === "pending" && agenda && pendingTotal > 0 && (
        <div className="space-y-6">
          {BUCKET_ORDER.map((bucket) => {
            const items = agenda.pending[bucket];
            if (items.length === 0) return null;
            return (
              <AgendaSection
                key={bucket}
                title={AGENDA_BUCKET_LABELS[bucket]}
                tasks={items}
                togglingId={togglingId}
                onToggleDone={handleToggleDone}
              />
            );
          })}
        </div>
      )}

      {!error && view === "done" && agenda && summary.done > 0 && (
        <AgendaSection
          title="Concluídas recentemente"
          tasks={agenda.done}
          togglingId={togglingId}
          onToggleDone={handleToggleDone}
          doneView
        />
      )}
    </OSPage>
  );
}

function AgendaSection({
  title,
  tasks,
  togglingId,
  onToggleDone,
  doneView = false,
}: {
  title: string;
  tasks: OSTaskWithRelations[];
  togglingId: string | null;
  onToggleDone: (task: OSTaskWithRelations, done: boolean) => Promise<void>;
  doneView?: boolean;
}) {
  return (
    <section className="rounded-xl border border-border/40 bg-surface/20">
      <div className="border-b border-border/40 px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>
      <ul className="divide-y divide-border/40">
        {tasks.map((task) => (
          <AgendaTaskRow
            key={task.id}
            task={task}
            toggling={togglingId === task.id}
            onToggleDone={onToggleDone}
            doneView={doneView}
          />
        ))}
      </ul>
    </section>
  );
}

function AgendaTaskRow({
  task,
  toggling,
  onToggleDone,
  doneView,
}: {
  task: OSTaskWithRelations;
  toggling: boolean;
  onToggleDone: (task: OSTaskWithRelations, done: boolean) => Promise<void>;
  doneView?: boolean;
}) {
  const overdue = isTaskOverdue(task);

  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <button
        type="button"
        disabled={toggling}
        onClick={() => void onToggleDone(task, !doneView)}
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
          doneView
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
            : "border-border/40 bg-muted/20 text-muted-foreground hover:border-brand/30 hover:text-brand",
        )}
        aria-label={doneView ? "Reabrir tarefa" : "Concluir tarefa"}
      >
        {doneView ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      </button>

      <div className="min-w-0 flex-1">
        <p className={cn("font-medium", doneView && "text-muted-foreground line-through")}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <span className={cn(overdue && !doneView && "text-red-400")}>
            {formatTaskDueDate(task.due_date)}
          </span>
          {task.source_type === "manual" ? (
            <span>· Manual</span>
          ) : task.source_event_id ? (
            <span>· Automática</span>
          ) : null}
          {task.companies && task.company_id && (
            <>
              <span>·</span>
              <Link
                to="/os/empresas/$id"
                params={{ id: task.company_id }}
                className="text-brand hover:underline"
              >
                {task.companies.name}
              </Link>
            </>
          )}
          {task.projects && task.project_id && (
            <>
              <span>·</span>
              <Link
                to="/os/projetos/$id"
                params={{ id: task.project_id }}
                className="text-brand hover:underline"
              >
                {task.projects.title}
              </Link>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
