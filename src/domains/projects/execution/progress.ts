import type {
  PhaseProgress,
  ProjectWorkflowPhase,
  ProjectWorkflowTask,
  WorkflowProgress,
  WorkflowTaskView,
} from "./types";

export function computePhaseProgress(
  phase: ProjectWorkflowPhase,
  tasks: ProjectWorkflowTask[],
): PhaseProgress {
  const phaseTasks = tasks.filter((t) => t.phase_id === phase.id && !t.is_recurring);
  const total = phaseTasks.length;
  const done = phaseTasks.filter((t) => t.status === "done").length;
  const percent =
    phase.status === "done"
      ? 100
      : total === 0
        ? phase.is_recurring
          ? phase.status === "active"
            ? 100
            : 0
          : 0
        : Math.round((done / total) * 100);

  return {
    phaseKey: phase.key,
    phaseName: phase.name,
    status: phase.status,
    isRecurring: phase.is_recurring,
    total,
    done,
    percent,
  };
}

export function computeWorkflowProgress(
  phases: ProjectWorkflowPhase[],
  tasks: ProjectWorkflowTask[],
  currentPhaseKey: string | null,
): WorkflowProgress {
  const countable = tasks.filter((t) => !t.is_recurring);
  const totalTasks = countable.length;
  const doneTasks = countable.filter((t) => t.status === "done").length;
  const pendingTasks = countable.filter((t) => t.status !== "done").length;
  const blockedTasks = tasks.filter(
    (t) => t.status === "blocked" || t.status === "waiting_client",
  ).length;
  const waitingClientTasks = tasks.filter((t) => t.status === "waiting_client").length;

  const phaseProgress = [...phases]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => computePhaseProgress(p, tasks));

  const nonRecurringPhases = phaseProgress.filter((p) => !p.isRecurring);
  const overallPercent =
    nonRecurringPhases.length === 0
      ? 0
      : Math.round(
          nonRecurringPhases.reduce((sum, p) => sum + p.percent, 0) / nonRecurringPhases.length,
        );

  return {
    overallPercent,
    totalTasks,
    doneTasks,
    pendingTasks,
    blockedTasks,
    waitingClientTasks,
    phases: phaseProgress,
    currentPhaseKey,
  };
}

export function enrichTasksWithDependencies(
  tasks: ProjectWorkflowTask[],
  phases: ProjectWorkflowPhase[],
  deps: { task_id: string; depends_on_task_id: string }[],
): WorkflowTaskView[] {
  const taskById = new Map(tasks.map((t) => [t.id, t]));
  const phaseById = new Map(phases.map((p) => [p.id, p]));

  return tasks.map((task) => {
    const phase = phaseById.get(task.phase_id);
    const depIds = deps.filter((d) => d.task_id === task.id).map((d) => d.depends_on_task_id);
    const incomplete = depIds
      .map((id) => taskById.get(id))
      .filter((t): t is ProjectWorkflowTask => !!t && t.status !== "done");

    const isBlockedByDependencies =
      !task.dependency_override && incomplete.length > 0 && task.status !== "done";

    return {
      ...task,
      phase_key: phase?.key ?? "",
      phase_name: phase?.name ?? "",
      incompleteDependencyCount: incomplete.length,
      incompleteDependencyTitles: incomplete.map((t) => t.title),
      isBlockedByDependencies,
    };
  });
}

export function pickNextActions(tasks: WorkflowTaskView[], limit = 5): WorkflowTaskView[] {
  const actionable = tasks.filter(
    (t) =>
      t.status !== "done" &&
      !t.isBlockedByDependencies &&
      (t.status === "todo" ||
        t.status === "in_progress" ||
        t.status === "waiting_client" ||
        t.status === "blocked"),
  );

  const priorityRank: Record<string, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return actionable
    .sort((a, b) => {
      // Prefer in_progress, then todo — waiting_client is important but not "do now"
      const statusRank = (s: string) =>
        s === "in_progress" ? 0 : s === "todo" ? 1 : s === "waiting_client" ? 2 : 3;
      const sr = statusRank(a.status) - statusRank(b.status);
      if (sr !== 0) return sr;
      const pr = (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
      if (pr !== 0) return pr;
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      return a.sort_order - b.sort_order;
    })
    .slice(0, limit);
}

/** Próxima ação operacional da fase (ignora waiting_client e bloqueadas). */
export function pickPhasePrimaryAction(
  tasks: WorkflowTaskView[],
  phaseId: string | null | undefined,
): WorkflowTaskView | null {
  if (!phaseId) return null;
  const phaseTasks = tasks.filter((t) => t.phase_id === phaseId);
  const now = phaseTasks.filter(
    (t) =>
      t.status !== "done" &&
      t.status !== "waiting_client" &&
      !t.isBlockedByDependencies &&
      (t.status === "todo" || t.status === "in_progress" || t.status === "blocked"),
  );
  return pickNextActions(now, 1)[0] ?? null;
}

export type PhaseTaskBuckets = {
  now: WorkflowTaskView[];
  waitingClient: WorkflowTaskView[];
  blocked: WorkflowTaskView[];
  done: WorkflowTaskView[];
};

export function bucketPhaseTasks(
  tasks: WorkflowTaskView[],
  phaseId: string | null | undefined,
): PhaseTaskBuckets {
  const phaseTasks = tasks
    .filter((t) => t.phase_id === phaseId)
    .sort((a, b) => a.sort_order - b.sort_order);

  const now: WorkflowTaskView[] = [];
  const waitingClient: WorkflowTaskView[] = [];
  const blocked: WorkflowTaskView[] = [];
  const done: WorkflowTaskView[] = [];

  for (const t of phaseTasks) {
    if (t.status === "done") {
      done.push(t);
      continue;
    }
    if (t.status === "waiting_client") {
      waitingClient.push(t);
      continue;
    }
    if (t.isBlockedByDependencies || t.status === "blocked") {
      blocked.push(t);
      continue;
    }
    now.push(t);
  }

  return { now, waitingClient, blocked, done };
}

export function pickPendencies(tasks: WorkflowTaskView[]): WorkflowTaskView[] {
  return tasks.filter(
    (t) => t.status === "waiting_client" || t.status === "blocked" || t.isBlockedByDependencies,
  );
}

export function waitingClientDays(tasks: ProjectWorkflowTask[]): number | null {
  const waiting = tasks.filter((t) => t.status === "waiting_client" && t.waiting_client_since);
  if (waiting.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  let maxDays = 0;
  for (const t of waiting) {
    const since = t.waiting_client_since!;
    const ms = Date.parse(today) - Date.parse(since);
    const days = Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
    if (days > maxDays) maxDays = days;
  }
  return maxDays;
}

export function phaseIsComplete(
  phase: ProjectWorkflowPhase,
  tasks: ProjectWorkflowTask[],
): boolean {
  if (phase.is_recurring) return false;
  const required = tasks.filter(
    (t) => t.phase_id === phase.id && t.blocks_phase_completion && !t.is_recurring,
  );
  if (required.length === 0) return false;
  return required.every((t) => t.status === "done");
}
