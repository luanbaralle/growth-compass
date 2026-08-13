import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type {
  ContentTask,
  ContentTaskListFilters,
  ContentTaskWithCompany,
} from "./types";
import { normalizeChannels } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

function mapTaskRow(task: ContentTask & { channel?: string }): ContentTask {
  const { channel: _legacy, ...rest } = task;
  return {
    ...rest,
    channels: normalizeChannels(task.channels ?? task.channel),
  };
}

export async function findContentTasks(
  filters: ContentTaskListFilters = {},
): Promise<ContentTaskWithCompany[]> {
  const params: Record<string, string> = {
    select: "*",
    order: "post_date.asc.nullslast,created_at.desc",
  };

  if (filters.status && filters.status !== "all") {
    params.status = `eq.${filters.status}`;
  }
  if (filters.channel && filters.channel !== "all") {
    params.channels = `cs.{${filters.channel}}`;
  }
  if (filters.companyId) {
    params.company_id = `eq.${filters.companyId}`;
  }
  if (filters.productionOwnerId && filters.productionOwnerId !== "all") {
    params.production_owner_id = `eq.${filters.productionOwnerId}`;
  }
  const tasks = (await dbSelect<ContentTask & { channel?: string }>(
    "content_tasks",
    encodeQuery(params),
  )).map(mapTaskRow);

  const companyIds = [...new Set(tasks.map((t) => t.company_id))];
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

  let result: ContentTaskWithCompany[] = tasks.map((task) => ({
    ...task,
    companies: companyMap.has(task.company_id)
      ? { name: companyMap.get(task.company_id)! }
      : null,
  }));

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.companies?.name.toLowerCase().includes(q) ||
        t.theme_objective?.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q),
    );
  }

  if (filters.postDateFrom) {
    result = result.filter((t) => t.post_date && t.post_date >= filters.postDateFrom!);
  }
  if (filters.postDateTo) {
    result = result.filter((t) => t.post_date && t.post_date <= filters.postDateTo!);
  }

  return result;
}

export async function findContentTaskById(id: string): Promise<ContentTask | null> {
  const rows = await dbSelect<ContentTask & { channel?: string }>(
    "content_tasks",
    encodeQuery({ select: "*", id: `eq.${id}`, limit: "1" }),
  );
  const row = rows[0];
  return row ? mapTaskRow(row) : null;
}

export async function insertContentTask(
  row: Omit<ContentTask, "id" | "created_at" | "updated_at">,
): Promise<ContentTask> {
  const [task] = await dbInsert<ContentTask>("content_tasks", row);
  return mapTaskRow(task);
}

export async function patchContentTask(
  id: string,
  patch: Partial<Omit<ContentTask, "id" | "created_at" | "updated_at">>,
): Promise<ContentTask | null> {
  const rows = await dbUpdate<ContentTask>("content_tasks", `id=eq.${id}`, patch);
  const row = rows[0];
  return row ? mapTaskRow(row) : null;
}

export async function removeContentTask(id: string): Promise<boolean> {
  await dbDelete("content_tasks", `id=eq.${id}`);
  return true;
}
