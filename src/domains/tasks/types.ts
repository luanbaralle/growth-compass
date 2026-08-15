import type { TeamMember } from "@/lib/auth/types";

export interface OSTask {
  id: string;
  title: string;
  due_date: string | null;
  assignee_id: string | null;
  company_id: string | null;
  project_id: string | null;
  done: boolean;
  source_event_id: string | null;
  source_type: string | null;
  urgency: string;
  created_at: string;
}

export interface OSTaskWithRelations extends OSTask {
  companies: { name: string } | null;
  projects: { title: string } | null;
}

export type AgendaBucket = "overdue" | "today" | "upcoming" | "no_date";

export type AgendaSummary = {
  overdue: number;
  today: number;
  upcoming: number;
  noDate: number;
  done: number;
};

export type GroupedAgendaTasks = Record<AgendaBucket, OSTaskWithRelations[]>;

export const AGENDA_BUCKET_LABELS: Record<AgendaBucket, string> = {
  overdue: "Atrasadas",
  today: "Hoje",
  upcoming: "Próximas",
  no_date: "Sem prazo",
};

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function classifyTaskBucket(task: OSTask, today = todayIso()): AgendaBucket | "done" {
  if (task.done) return "done";
  if (!task.due_date) return "no_date";
  if (task.due_date < today) return "overdue";
  if (task.due_date === today) return "today";
  return "upcoming";
}

export function groupAgendaTasks(tasks: OSTaskWithRelations[]): {
  pending: GroupedAgendaTasks;
  done: OSTaskWithRelations[];
  summary: AgendaSummary;
} {
  const pending: GroupedAgendaTasks = {
    overdue: [],
    today: [],
    upcoming: [],
    no_date: [],
  };
  const done: OSTaskWithRelations[] = [];
  const today = todayIso();

  for (const task of tasks) {
    const bucket = classifyTaskBucket(task, today);
    if (bucket === "done") {
      done.push(task);
      continue;
    }
    pending[bucket].push(task);
  }

  const sortByDue = (a: OSTaskWithRelations, b: OSTaskWithRelations) => {
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return a.created_at.localeCompare(b.created_at);
  };

  pending.overdue.sort(sortByDue);
  pending.today.sort(sortByDue);
  pending.upcoming.sort(sortByDue);
  pending.no_date.sort((a, b) => b.created_at.localeCompare(a.created_at));
  done.sort((a, b) => b.created_at.localeCompare(a.created_at));

  return {
    pending,
    done,
    summary: {
      overdue: pending.overdue.length,
      today: pending.today.length,
      upcoming: pending.upcoming.length,
      noDate: pending.no_date.length,
      done: done.length,
    },
  };
}

export function formatTaskDueDate(iso: string | null): string {
  if (!iso) return "Sem prazo";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function isTaskOverdue(task: OSTask, today = todayIso()): boolean {
  return !task.done && !!task.due_date && task.due_date < today;
}

export function resolveTaskAssignee(assigneeId: string | null): TeamMember | null {
  if (assigneeId === "luan" || assigneeId === "vini" || assigneeId === "caio") {
    return assigneeId;
  }
  return null;
}
