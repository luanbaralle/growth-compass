import { dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type { TeamMember } from "@/lib/auth/types";
import type { OSTask, OSTaskWithRelations } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

async function attachRelations(tasks: OSTask[]): Promise<OSTaskWithRelations[]> {
  const companyIds = [...new Set(tasks.map((task) => task.company_id).filter(Boolean))] as string[];
  const projectIds = [...new Set(tasks.map((task) => task.project_id).filter(Boolean))] as string[];

  const companyMap = new Map<string, string>();
  const projectMap = new Map<string, string>();

  if (companyIds.length > 0) {
    const companies = await dbSelect<{ id: string; name: string }>(
      "companies",
      encodeQuery({
        select: "id,name",
        id: `in.(${companyIds.join(",")})`,
      }),
    );
    for (const company of companies) {
      companyMap.set(company.id, company.name);
    }
  }

  if (projectIds.length > 0) {
    const projects = await dbSelect<{ id: string; title: string }>(
      "projects",
      encodeQuery({
        select: "id,title",
        id: `in.(${projectIds.join(",")})`,
      }),
    );
    for (const project of projects) {
      projectMap.set(project.id, project.title);
    }
  }

  return tasks.map((task) => ({
    ...task,
    companies: task.company_id ? { name: companyMap.get(task.company_id) ?? "—" } : null,
    projects: task.project_id ? { title: projectMap.get(task.project_id) ?? "—" } : null,
  }));
}

export async function findTasksForAssignee(
  assigneeId: TeamMember,
  options: { includeDone?: boolean } = {},
): Promise<OSTaskWithRelations[]> {
  const params: Record<string, string> = {
    select: "*",
    assignee_id: `eq.${assigneeId}`,
    order: "due_date.asc.nullslast,created_at.desc",
  };

  if (!options.includeDone) {
    params.done = "eq.false";
  }

  const tasks = await dbSelect<OSTask>("tasks", encodeQuery(params));
  return attachRelations(tasks);
}

export async function insertManualTask(input: {
  title: string;
  assigneeId: TeamMember;
  dueDate?: string | null;
  companyId?: string | null;
  projectId?: string | null;
}): Promise<OSTask> {
  const [task] = await dbInsert<OSTask>("tasks", {
    title: input.title,
    assignee_id: input.assigneeId,
    due_date: input.dueDate ?? null,
    company_id: input.companyId ?? null,
    project_id: input.projectId ?? null,
    done: false,
    source_event_id: null,
    source_type: "manual",
    urgency: "default",
  });
  return task;
}

export async function updateTaskDone(
  id: string,
  assigneeId: TeamMember,
  done: boolean,
): Promise<OSTask | null> {
  const rows = await dbUpdate<OSTask>(
    "tasks",
    `id=eq.${id}&assignee_id=eq.${assigneeId}`,
    { done },
  );
  return rows[0] ?? null;
}
