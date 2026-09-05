import {
  applyWorkflowTemplate,
  completeDeliverable,
  completeWorkflowTask,
  resumeWorkflowTask,
  setWaitingClient,
  updateWorkflowTask,
  upsertProjectBriefing,
} from "@/domains/projects/execution/api.server";
import { bucketPhaseTasks, pickPhasePrimaryAction } from "@/domains/projects/execution/progress";
import type {
  ChecklistItemDef,
  ProjectBriefing,
  ProjectExecutionView,
  WorkflowTaskView,
} from "@/domains/projects/execution/types";
import { BRIEFING_STATUS_LABELS } from "@/domains/projects/execution/types";
import type { Project } from "@/domains/projects/types";
import { STATUS_LABELS } from "@/domains/projects/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { getErrorMessage } from "@/lib/api/client-errors";
import { cn } from "@/lib/utils";
import { Section } from "@/os/ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  Loader2,
  Lock,
  Play,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

type FocusFilter = "all" | "now" | "waiting" | "mine";

export function ProjectExecutionView({
  project,
  companyName,
  clientContactName,
  execution,
  onChanged,
  currentMemberId,
}: {
  project: Project;
  companyName: string | null;
  clientContactName?: string | null;
  execution: ProjectExecutionView | null;
  onChanged: () => Promise<void>;
  currentMemberId?: TeamMember | null;
}) {
  if (!execution) {
    return <StartWorkflowPanel projectId={project.id} onChanged={onChanged} />;
  }

  return (
    <ExecutionCockpit
      project={project}
      companyName={companyName}
      clientContactName={clientContactName}
      execution={execution}
      onChanged={onChanged}
      currentMemberId={currentMemberId}
    />
  );
}

function ExecutionCockpit({
  project,
  companyName,
  clientContactName,
  execution,
  onChanged,
  currentMemberId,
}: {
  project: Project;
  companyName: string | null;
  clientContactName?: string | null;
  execution: ProjectExecutionView;
  onChanged: () => Promise<void>;
  currentMemberId?: TeamMember | null;
}) {
  const { progress, currentPhase, deliverables, waitingClientDays, phases } = execution;
  const [selectedPhaseKey, setSelectedPhaseKey] = useState(
    currentPhase?.key ?? progress.currentPhaseKey ?? phases[0]?.key ?? "",
  );
  const [filter, setFilter] = useState<FocusFilter>("now");
  const [showDone, setShowDone] = useState(false);
  const prevPhaseKey = useRef(currentPhase?.key);

  useEffect(() => {
    if (currentPhase?.key) setSelectedPhaseKey(currentPhase.key);
  }, [currentPhase?.key]);

  useEffect(() => {
    const prev = prevPhaseKey.current;
    if (prev && currentPhase?.key && prev !== currentPhase.key) {
      toast.success(`${phaseNameByKey(prev, progress.phases)} concluída`, {
        description: `Próxima fase: ${currentPhase.name}`,
      });
    }
    prevPhaseKey.current = currentPhase?.key;
  }, [currentPhase?.key, currentPhase?.name, progress.phases]);

  const selectedPhase =
    phases.find((p) => p.key === selectedPhaseKey) ?? currentPhase ?? phases[0] ?? null;
  const isActivePhase = selectedPhase?.key === currentPhase?.key;
  const buckets = useMemo(
    () => bucketPhaseTasks(execution.tasks, selectedPhase?.id),
    [execution.tasks, selectedPhase?.id],
  );
  const primary = useMemo(
    () => (isActivePhase ? pickPhasePrimaryAction(execution.tasks, selectedPhase?.id) : null),
    [execution.tasks, selectedPhase?.id, isActivePhase],
  );
  const phaseProgress = progress.phases.find((p) => p.phaseKey === selectedPhase?.key);
  const phaseDeliverables = deliverables.filter((d) => d.phase_id === selectedPhase?.id);

  const visibleNow =
    filter === "waiting"
      ? []
      : filterTasks(buckets.now, filter === "mine" ? "mine" : "all", currentMemberId);
  const visibleWaiting =
    filter === "now"
      ? []
      : filterTasks(buckets.waitingClient, filter === "mine" ? "mine" : "all", currentMemberId);
  const visibleBlocked =
    filter === "waiting" || filter === "now"
      ? []
      : filterTasks(buckets.blocked, filter === "mine" ? "mine" : "all", currentMemberId);
  const defaultClient = clientContactName?.trim() || "Cliente";

  const showNow = filter !== "waiting";
  const showWaiting = filter !== "now";
  const showBlocked = filter === "all" || filter === "mine";

  return (
    <div className="space-y-4">
      <CommandHero
        phaseName={currentPhase?.name ?? "—"}
        phasePercent={progress.phases.find((p) => p.phaseKey === currentPhase?.key)?.percent ?? 0}
        overallPercent={progress.overallPercent}
        statusLabel={STATUS_LABELS[project.status]}
        ownerLabel={
          project.owner_id
            ? (TEAM_LABELS[project.owner_id as TeamMember] ?? project.owner_id)
            : null
        }
        companyName={companyName}
        waitingClientDays={waitingClientDays}
        primary={primary}
        projectId={project.id}
        defaultClientName={defaultClient}
        onChanged={onChanged}
      />

      <WorkflowPhaseRail
        phases={progress.phases}
        currentKey={currentPhase?.key ?? null}
        selectedKey={selectedPhaseKey}
        onSelect={setSelectedPhaseKey}
      />

      {selectedPhase && (
        <section className="rounded-xl border border-border/25 bg-surface-elevated/15 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">{selectedPhase.name}</h3>
                {isActivePhase ? (
                  <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-200">
                    Fase atual
                  </span>
                ) : (
                  <span className="rounded-full border border-border/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Visualizando
                  </span>
                )}
              </div>
              {selectedPhase.objective && (
                <p className="mt-1 text-sm text-muted-foreground">{selectedPhase.objective}</p>
              )}
              {phaseProgress && !selectedPhase.is_recurring && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {phaseProgress.done}/{phaseProgress.total} · {phaseProgress.percent}%
                </p>
              )}
            </div>
            <FocusFilters value={filter} onChange={setFilter} />
          </div>

          {showNow && (
            <TaskBucket
              title="Agora"
              empty="Nada desbloqueado nesta fase."
              count={visibleNow.length}
              accent="now"
            >
              {visibleNow.map((task) => (
                <WorkflowTaskCard
                  key={task.id}
                  projectId={project.id}
                  task={task}
                  onChanged={onChanged}
                  defaultClientName={defaultClient}
                  emphasize={primary?.id === task.id}
                />
              ))}
            </TaskBucket>
          )}

          {showWaiting && (
            <TaskBucket
              title="Aguardando cliente"
              empty="Nenhuma pendência com o cliente."
              count={visibleWaiting.length}
              accent="waiting"
              className={showNow ? "mt-4" : undefined}
            >
              {visibleWaiting.map((task) => (
                <WorkflowTaskCard
                  key={task.id}
                  projectId={project.id}
                  task={task}
                  onChanged={onChanged}
                  defaultClientName={defaultClient}
                />
              ))}
            </TaskBucket>
          )}

          {showBlocked && (
            <TaskBucket
              title="Depois / bloqueadas"
              empty="Nada bloqueado."
              count={visibleBlocked.length}
              accent="blocked"
              className="mt-4"
            >
              {visibleBlocked.map((task) => (
                <WorkflowTaskCard
                  key={task.id}
                  projectId={project.id}
                  task={task}
                  onChanged={onChanged}
                  defaultClientName={defaultClient}
                />
              ))}
            </TaskBucket>
          )}

          {buckets.done.length > 0 && (
            <div className="mt-4">
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setShowDone((v) => !v)}
              >
                {showDone ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
                Ver feitas ({buckets.done.length})
              </button>
              {showDone && (
                <div className="mt-2 space-y-2">
                  {buckets.done.map((task) => (
                    <WorkflowTaskCard
                      key={task.id}
                      projectId={project.id}
                      task={task}
                      onChanged={onChanged}
                      defaultClientName={defaultClient}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {phaseDeliverables.length > 0 && (
            <div className="mt-5 border-t border-border/20 pt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Entregáveis
              </p>
              <ul className="space-y-2">
                {phaseDeliverables.map((d) => (
                  <li key={d.id} className="os-list-row text-sm">
                    <Checkbox
                      checked={d.status === "done"}
                      onCheckedChange={async () => {
                        if (d.status === "done") return;
                        try {
                          await completeDeliverable({
                            data: { projectId: project.id, deliverableId: d.id },
                          });
                          toast.success("Entregável concluído");
                          await onChanged();
                        } catch (err) {
                          toast.error(getErrorMessage(err, "Erro ao concluir entregável."));
                        }
                      }}
                    />
                    <span
                      className={d.status === "done" ? "line-through text-muted-foreground" : ""}
                    >
                      {d.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function CommandHero({
  phaseName,
  phasePercent,
  overallPercent,
  statusLabel,
  ownerLabel,
  companyName,
  waitingClientDays,
  primary,
  projectId,
  defaultClientName,
  onChanged,
}: {
  phaseName: string;
  phasePercent: number;
  overallPercent: number;
  statusLabel: string;
  ownerLabel: string | null;
  companyName: string | null;
  waitingClientDays: number | null;
  primary: WorkflowTaskView | null;
  projectId: string;
  defaultClientName: string;
  onChanged: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  const completePrimary = async () => {
    if (!primary) return;
    setBusy(true);
    try {
      await completeWorkflowTask({
        data: { projectId, taskId: primary.id, overrideDependencies: false },
      });
      toast.success("Tarefa concluída");
      await onChanged();
    } catch (err) {
      toast.error(getErrorMessage(err, "Não foi possível concluir."));
    } finally {
      setBusy(false);
    }
  };

  const waitOnPrimary = async () => {
    if (!primary) return;
    setBusy(true);
    try {
      const due = addDaysIso(3);
      await setWaitingClient({
        data: {
          projectId,
          taskId: primary.id,
          clientName: defaultClientName,
          dueDate: due,
        },
      });
      toast.success(`Aguardando ${defaultClientName}`);
      await onChanged();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao marcar aguardando."));
    } finally {
      setBusy(false);
    }
  };

  const startPrimary = async () => {
    if (!primary || primary.status !== "todo") return;
    setBusy(true);
    try {
      await updateWorkflowTask({
        data: { projectId, taskId: primary.id, status: "in_progress" },
      });
      await onChanged();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao iniciar."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-xl border border-border/30 bg-gradient-to-br from-surface-elevated/40 to-surface/20 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {phaseName} · {phasePercent}%
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {companyName ?? "—"} · {statusLabel}
            {ownerLabel ? ` · ${ownerLabel}` : ""} · Geral {overallPercent}%
          </p>
        </div>
        {waitingClientDays !== null && (
          <span className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs text-amber-200">
            Aguardando cliente há {waitingClientDays}d
          </span>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-border/25 bg-background/40 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Próxima ação
        </p>
        {primary ? (
          <>
            <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
              {primary.title}
            </p>
            {primary.assignee_id && (
              <p className="mt-1 text-xs text-muted-foreground">
                Resp.: {TEAM_LABELS[primary.assignee_id as TeamMember] ?? primary.assignee_id}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={completePrimary} disabled={busy}>
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Concluir
              </Button>
              {primary.status === "todo" && (
                <Button variant="outline" onClick={startPrimary} disabled={busy}>
                  <Play className="h-4 w-4" />
                  Iniciar
                </Button>
              )}
              <Button variant="outline" onClick={waitOnPrimary} disabled={busy}>
                <UserRound className="h-4 w-4" />
                Cobrar cliente
              </Button>
            </div>
          </>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            Nenhuma ação desbloqueada na fase atual. Veja pendências com o cliente ou tarefas
            bloqueadas abaixo.
          </p>
        )}
      </div>
    </section>
  );
}

function WorkflowPhaseRail({
  phases,
  currentKey,
  selectedKey,
  onSelect,
}: {
  phases: ProjectExecutionView["progress"]["phases"];
  currentKey: string | null;
  selectedKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {phases.map((phase) => {
        const done = phase.status === "done" || phase.percent === 100;
        const active = phase.phaseKey === currentKey;
        const selected = phase.phaseKey === selectedKey;
        return (
          <button
            key={phase.phaseKey}
            type="button"
            onClick={() => onSelect(phase.phaseKey)}
            className={cn(
              "flex min-w-[132px] flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
              done && "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
              !done && active && "border-blue-400/40 bg-blue-400/10 text-blue-100",
              !done &&
                !active &&
                "border-border/30 bg-surface-elevated/20 text-muted-foreground hover:border-border/50",
              selected && "ring-1 ring-brand/50",
            )}
          >
            {done ? (
              <Check className="h-3.5 w-3.5 shrink-0" />
            ) : active ? (
              <Circle className="h-3.5 w-3.5 shrink-0 fill-current" />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0 opacity-40" />
            )}
            <div className="min-w-0">
              <p className="truncate font-medium">{phase.phaseName}</p>
              <p className="text-xs opacity-80">
                {phase.isRecurring
                  ? "Recorrente"
                  : `${phase.percent}% · ${phase.total - phase.done} rest.`}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function FocusFilters({
  value,
  onChange,
}: {
  value: FocusFilter;
  onChange: (v: FocusFilter) => void;
}) {
  const items: { id: FocusFilter; label: string }[] = [
    { id: "now", label: "Agora" },
    { id: "waiting", label: "Cliente" },
    { id: "mine", label: "Minhas" },
    { id: "all", label: "Todas" },
  ];
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
            value === item.id
              ? "border-brand/40 bg-brand/10 text-foreground"
              : "border-border/30 text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function TaskBucket({
  title,
  empty,
  count,
  accent,
  children,
  className,
}: {
  title: string;
  empty: string;
  count: number;
  accent: "now" | "waiting" | "blocked";
  children: ReactNode;
  className?: string;
}) {
  const accentClass =
    accent === "now"
      ? "text-blue-200"
      : accent === "waiting"
        ? "text-amber-200"
        : "text-muted-foreground";

  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-2">
        <p className={cn("text-[11px] font-semibold uppercase tracking-wide", accentClass)}>
          {title}
        </p>
        <span className="text-[11px] tabular-nums text-muted-foreground">{count}</span>
      </div>
      {count === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}

function WorkflowTaskCard({
  projectId,
  task,
  onChanged,
  defaultClientName,
  emphasize,
  compact,
}: {
  projectId: string;
  task: WorkflowTaskView;
  onChanged: () => Promise<void>;
  defaultClientName: string;
  emphasize?: boolean;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [waitOpen, setWaitOpen] = useState(false);
  const [clientName, setClientName] = useState(task.waiting_client_name ?? defaultClientName);
  const [waitDue, setWaitDue] = useState(task.waiting_client_due ?? addDaysIso(3));

  const complete = async (override = false) => {
    setBusy(true);
    try {
      if (task.status === "done") {
        await updateWorkflowTask({
          data: { projectId, taskId: task.id, status: "todo" },
        });
      } else {
        await completeWorkflowTask({
          data: { projectId, taskId: task.id, overrideDependencies: override },
        });
        toast.success("Tarefa concluída");
      }
      await onChanged();
    } catch (err) {
      const message = getErrorMessage(err, "Não foi possível atualizar.");
      if (message.includes("Bloqueada") && confirm(`${message}\n\nForçar conclusão?`)) {
        await complete(true);
      } else {
        toast.error(message);
      }
    } finally {
      setBusy(false);
    }
  };

  const quickWait = async () => {
    setBusy(true);
    try {
      await setWaitingClient({
        data: {
          projectId,
          taskId: task.id,
          clientName: defaultClientName,
          dueDate: addDaysIso(3),
        },
      });
      toast.success(`Aguardando ${defaultClientName}`);
      await onChanged();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao salvar."));
    } finally {
      setBusy(false);
    }
  };

  const primaryLabel =
    task.status === "done"
      ? "Reabrir"
      : task.status === "waiting_client"
        ? "Cliente entregou"
        : "Concluir";

  const onPrimary = async () => {
    if (task.status === "waiting_client") {
      setBusy(true);
      try {
        await resumeWorkflowTask({
          data: { projectId, taskId: task.id, status: "in_progress" },
        });
        toast.success("Tarefa retomada");
        await onChanged();
      } catch (err) {
        toast.error(getErrorMessage(err, "Erro ao retomar."));
      } finally {
        setBusy(false);
      }
      return;
    }
    await complete(false);
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-surface-elevated/25 p-3",
        emphasize ? "border-brand/40 bg-brand/5" : "border-border/25",
        compact && "opacity-70",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={cn(
                "text-sm font-medium",
                task.status === "done" && "text-muted-foreground line-through",
              )}
            >
              {task.title}
            </p>
            {task.isBlockedByDependencies && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-300">
                <Lock className="h-3 w-3" />
                Desbloqueia com: {task.incompleteDependencyTitles.slice(0, 2).join(", ")}
                {task.incompleteDependencyCount > 2 ? "…" : ""}
              </span>
            )}
            {task.status === "waiting_client" && (
              <span className="text-xs text-amber-300">
                Com {task.waiting_client_name ?? "cliente"}
                {task.waiting_client_since
                  ? ` desde ${formatIsoDate(task.waiting_client_since)}`
                  : ""}
              </span>
            )}
            {task.status === "in_progress" && (
              <span className="text-[10px] font-medium uppercase tracking-wide text-blue-300">
                Em andamento
              </span>
            )}
          </div>

          {!compact && (
            <div className="mt-2 flex flex-wrap gap-2">
              <Button size="sm" onClick={onPrimary} disabled={busy || task.isBlockedByDependencies}>
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {primaryLabel}
              </Button>
              {task.status !== "waiting_client" && task.status !== "done" && (
                <Button size="sm" variant="outline" onClick={quickWait} disabled={busy}>
                  Cobrar cliente
                </Button>
              )}
              {task.status === "todo" && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={async () => {
                    await updateWorkflowTask({
                      data: { projectId, taskId: task.id, status: "in_progress" },
                    });
                    await onChanged();
                  }}
                >
                  Iniciar
                </Button>
              )}
              {(task.checklist_json.length > 0 || task.description) && (
                <Button size="sm" variant="ghost" onClick={() => setExpanded((v) => !v)}>
                  {expanded ? "Menos" : "Detalhes"}
                </Button>
              )}
              {task.status !== "waiting_client" && task.status !== "done" && (
                <Button size="sm" variant="ghost" onClick={() => setWaitOpen(true)}>
                  Ajustar prazo…
                </Button>
              )}
            </div>
          )}

          {expanded && (
            <div className="mt-3 space-y-2 border-t border-border/20 pt-3">
              {task.description && (
                <p className="text-xs text-muted-foreground">{task.description}</p>
              )}
              {task.checklist_json.length > 0 && (
                <ul className="space-y-1">
                  {groupChecklist(task.checklist_json).map(([group, items]) => (
                    <li key={group}>
                      {group !== "_default" && (
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {group}
                        </p>
                      )}
                      <ul className="space-y-1">
                        {items.map((item) => (
                          <li key={item.id} className="flex items-center gap-2 text-xs">
                            <Checkbox
                              checked={item.done}
                              onCheckedChange={async () => {
                                const next = task.checklist_json.map((c) =>
                                  c.id === item.id ? { ...c, done: !c.done } : c,
                                );
                                await updateWorkflowTask({
                                  data: {
                                    projectId,
                                    taskId: task.id,
                                    checklistJson: next,
                                  },
                                });
                                await onChanged();
                              }}
                            />
                            <span className={item.done ? "line-through text-muted-foreground" : ""}>
                              {item.label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {task.assignee_id
            ? (TEAM_LABELS[task.assignee_id as TeamMember] ?? task.assignee_id)
            : "—"}
        </span>
      </div>

      <Dialog open={waitOpen} onOpenChange={setWaitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aguardando cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Responsável no cliente</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Prazo</Label>
              <Input type="date" value={waitDue} onChange={(e) => setWaitDue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWaitOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!clientName.trim()}
              onClick={async () => {
                try {
                  await setWaitingClient({
                    data: {
                      projectId,
                      taskId: task.id,
                      clientName: clientName.trim(),
                      dueDate: waitDue || undefined,
                    },
                  });
                  setWaitOpen(false);
                  toast.success("Marcado como aguardando cliente");
                  await onChanged();
                } catch (err) {
                  toast.error(getErrorMessage(err, "Erro ao salvar."));
                }
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StartWorkflowPanel({
  projectId,
  onChanged,
}: {
  projectId: string;
  onChanged: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <Section title="Execução">
      <p className="mb-4 text-sm text-muted-foreground">
        Este projeto ainda não tem workflow. Inicie o template para gerar fases e tarefas.
      </p>
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            await applyWorkflowTemplate({
              data: { projectId, templateSlug: "projeto-aquisicao-digital" },
            });
            toast.success("Workflow iniciado");
            await onChanged();
          } catch (err) {
            toast.error(getErrorMessage(err, "Erro ao iniciar workflow."));
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Iniciar Projeto de Aquisição Digital
      </Button>
    </Section>
  );
}

export function ProjectBriefingPanel({
  projectId,
  briefing,
  onChanged,
}: {
  projectId: string;
  briefing: ProjectBriefing | null;
  onChanged: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    objective: briefing?.objective ?? "",
    offer: briefing?.offer ?? "",
    audience: briefing?.audience ?? "",
    location: briefing?.location ?? "",
    differentials: briefing?.differentials ?? "",
    services: briefing?.services ?? "",
    hours: briefing?.hours ?? "",
    pricing: briefing?.pricing ?? "",
    availability: briefing?.availability ?? "",
    commercialProcess: briefing?.commercial_process ?? "",
    currentChannels: briefing?.current_channels ?? "",
    competitors: briefing?.competitors ?? "",
    notes: briefing?.notes ?? "",
    status: briefing?.status ?? "draft",
  });

  const fields: { key: keyof typeof form; label: string }[] = [
    { key: "objective", label: "Objetivo" },
    { key: "offer", label: "Oferta" },
    { key: "audience", label: "Público" },
    { key: "location", label: "Localização" },
    { key: "differentials", label: "Diferenciais" },
    { key: "services", label: "Serviços" },
    { key: "hours", label: "Horários" },
    { key: "pricing", label: "Preços" },
    { key: "availability", label: "Disponibilidade" },
    { key: "commercialProcess", label: "Processo comercial" },
    { key: "currentChannels", label: "Canais atuais" },
    { key: "competitors", label: "Concorrentes" },
    { key: "notes", label: "Observações" },
  ];

  return (
    <Section
      title="Briefing"
      action={
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          {briefing ? "Editar" : "Criar briefing"}
        </Button>
      }
    >
      {briefing ? (
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">Status: {BRIEFING_STATUS_LABELS[briefing.status]}</p>
          {briefing.objective && <p>{briefing.objective}</p>}
          {briefing.offer && <p className="text-muted-foreground">Oferta: {briefing.offer}</p>}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum briefing associado.</p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Briefing do projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label>{f.label}</Label>
                <Textarea
                  rows={2}
                  value={form[f.key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <DialogFooter className="flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await upsertProjectBriefing({
                    data: { projectId, ...form, status: "draft" },
                  });
                  toast.success("Briefing salvo");
                  setOpen(false);
                  await onChanged();
                } catch (err) {
                  toast.error(getErrorMessage(err, "Erro ao salvar briefing."));
                } finally {
                  setSaving(false);
                }
              }}
            >
              Salvar rascunho
            </Button>
            <Button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await upsertProjectBriefing({
                    data: { projectId, ...form, status: "approved" },
                  });
                  toast.success("Briefing aprovado");
                  setOpen(false);
                  await onChanged();
                } catch (err) {
                  toast.error(getErrorMessage(err, "Erro ao salvar briefing."));
                } finally {
                  setSaving(false);
                }
              }}
            >
              Salvar e aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  );
}

export function ProjectTimelinePanel({
  timeline,
}: {
  timeline: { id: string; title: string; body: string | null; occurredAt: string }[];
}) {
  return (
    <Section title="Histórico">
      {timeline.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sem eventos ainda.</p>
      ) : (
        <ol className="space-y-3">
          {timeline.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              <span className="w-20 shrink-0 tabular-nums text-muted-foreground">
                {formatShortDate(item.occurredAt)}
              </span>
              <div>
                <p className="text-foreground/90">{item.title}</p>
                {item.body && <p className="text-xs text-muted-foreground">{item.body}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}

export function ExecutionDashboardCards({
  stats,
}: {
  stats: {
    active: number;
    waitingClient: number;
    overdue: number;
    inProduction: number;
    inAcquisition: number;
    inManagement: number;
  };
}) {
  const cards = useMemo(
    () => [
      { label: "Projetos ativos", value: stats.active },
      { label: "Aguardando cliente", value: stats.waitingClient },
      { label: "Atrasados", value: stats.overdue },
      { label: "Em produção", value: stats.inProduction },
      { label: "Em aquisição", value: stats.inAcquisition },
      { label: "Em gestão", value: stats.inManagement },
    ],
    [stats],
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border/25 bg-surface-elevated/25 px-4 py-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {card.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function filterTasks(
  tasks: WorkflowTaskView[],
  filter: FocusFilter,
  memberId?: TeamMember | null,
): WorkflowTaskView[] {
  if (filter === "all" || filter === "now") {
    if (filter === "now") return tasks;
    return tasks;
  }
  if (filter === "waiting") {
    return tasks.filter((t) => t.status === "waiting_client");
  }
  if (filter === "mine") {
    if (!memberId) return tasks;
    return tasks.filter((t) => t.assignee_id === memberId);
  }
  return tasks;
}

function phaseNameByKey(key: string, phases: ProjectExecutionView["progress"]["phases"]): string {
  return phases.find((p) => p.phaseKey === key)?.phaseName ?? key;
}

function groupChecklist(items: ChecklistItemDef[]): [string, ChecklistItemDef[]][] {
  const map = new Map<string, ChecklistItemDef[]>();
  for (const item of items) {
    const g = item.group ?? "_default";
    const list = map.get(g) ?? [];
    list.push(item);
    map.set(g, list);
  }
  return [...map.entries()];
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(d);
}

function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function addDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
