import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type {
  Project,
  ProjectChecklistItem,
  ProjectComment,
  ProjectListFilters,
  ProjectStatus,
  ProjectStatusCounts,
  ProjectWithCompany,
} from "./types";
import { ACTIVE_STATUSES, PROJECT_STATUSES } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

function isOverdue(project: Project): boolean {
  if (!project.due_date) return false;
  if (project.status === "done" || project.status === "cancelled") return false;
  return project.due_date < new Date().toISOString().slice(0, 10);
}

export async function findProjects(filters: ProjectListFilters = {}): Promise<ProjectWithCompany[]> {
  const params: Record<string, string> = {
    select: "*",
  };

  const sort = filters.sort ?? "due_date";
  const order = filters.order ?? "asc";
  params.order = `${sort}.${order}`;

  if (filters.status && filters.status !== "all") {
    params.status = `eq.${filters.status}`;
  }
  if (filters.companyId) {
    params.company_id = `eq.${filters.companyId}`;
  }
  if (filters.ownerId && filters.ownerId !== "all") {
    params.owner_id = `eq.${filters.ownerId}`;
  }

  const projects = await dbSelect<Project>("projects", encodeQuery(params));

  const companyIds = [...new Set(projects.map((p) => p.company_id))];
  const companyMap = new Map<string, string>();

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

  let result: ProjectWithCompany[] = projects.map((project) => ({
    ...project,
    companies: companyMap.has(project.company_id)
      ? { name: companyMap.get(project.company_id)! }
      : null,
  }));

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.companies?.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    );
  }

  return result;
}

export async function countProjectsByStatus(): Promise<ProjectStatusCounts> {
  const counts: ProjectStatusCounts = {
    all: 0,
    pending: 0,
    in_progress: 0,
    review: 0,
    done: 0,
    blocked: 0,
    cancelled: 0,
    overdue: 0,
  };

  const all = await dbSelect<Project>("projects", encodeQuery({ select: "*" }));
  counts.all = all.length;
  for (const row of all) {
    if (row.status in counts) {
      counts[row.status as ProjectStatus]++;
    }
    if (isOverdue(row)) counts.overdue++;
  }
  return counts;
}

export async function findProjectById(id: string): Promise<Project | null> {
  const rows = await dbSelect<Project>("projects", encodeQuery({ select: "*", id: `eq.${id}` }));
  return rows[0] ?? null;
}

export async function insertProject(
  data: Omit<Project, "id" | "created_at" | "updated_at">,
): Promise<Project> {
  const [row] = await dbInsert<Project>("projects", data);
  return row;
}

export async function patchProject(
  id: string,
  data: Partial<Omit<Project, "id" | "company_id" | "created_at" | "updated_at">>,
): Promise<Project | null> {
  const rows = await dbUpdate<Project>("projects", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function removeProject(id: string): Promise<boolean> {
  await dbDelete("projects", `id=eq.${id}`);
  return true;
}

export async function findChecklistItems(projectId: string): Promise<ProjectChecklistItem[]> {
  return dbSelect<ProjectChecklistItem>(
    "project_checklist_items",
    encodeQuery({
      select: "*",
      project_id: `eq.${projectId}`,
      order: "sort_order.asc",
    }),
  );
}

export async function insertChecklistItem(
  data: Omit<ProjectChecklistItem, "id" | "created_at">,
): Promise<ProjectChecklistItem> {
  const [row] = await dbInsert<ProjectChecklistItem>("project_checklist_items", data);
  return row;
}

export async function patchChecklistItem(
  id: string,
  data: Partial<Pick<ProjectChecklistItem, "text" | "done">>,
): Promise<ProjectChecklistItem | null> {
  const rows = await dbUpdate<ProjectChecklistItem>("project_checklist_items", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function removeChecklistItem(id: string): Promise<boolean> {
  await dbDelete("project_checklist_items", `id=eq.${id}`);
  return true;
}

export async function getNextChecklistOrder(projectId: string): Promise<number> {
  const items = await findChecklistItems(projectId);
  if (items.length === 0) return 0;
  return Math.max(...items.map((i) => i.sort_order)) + 1;
}

export async function findComments(projectId: string): Promise<ProjectComment[]> {
  return dbSelect<ProjectComment>(
    "project_comments",
    encodeQuery({
      select: "*",
      project_id: `eq.${projectId}`,
      order: "created_at.desc",
    }),
  );
}

export async function insertComment(
  data: Omit<ProjectComment, "id" | "created_at">,
): Promise<ProjectComment> {
  const [row] = await dbInsert<ProjectComment>("project_comments", data);
  return row;
}

export async function removeComment(id: string): Promise<boolean> {
  await dbDelete("project_comments", `id=eq.${id}`);
  return true;
}

export async function countActiveProjects(): Promise<number> {
  const all = await dbSelect<Project>("projects", encodeQuery({ select: "status" }));
  return all.filter((p) => ACTIVE_STATUSES.includes(p.status)).length;
}

export async function countOverdueProjects(): Promise<number> {
  const all = await dbSelect<Project>("projects", encodeQuery({ select: "*" }));
  return all.filter(isOverdue).length;
}

export { isOverdue, PROJECT_STATUSES };
