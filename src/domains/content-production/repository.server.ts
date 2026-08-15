import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import { randomUUID } from "node:crypto";
import {
  storageDelete,
  storageSignUrl,
  storageUpload,
} from "@/lib/supabase/server";
import type {
  ContentTask,
  ContentTaskEvent,
  ContentTaskEventType,
  ContentTaskFile,
  ContentTaskFileType,
  ContentTaskListFilters,
  ContentTaskWithCompany,
} from "./types";
import { normalizeChannels, normalizePublication } from "./types";

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
    publication: normalizePublication(task.publication),
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
        t.notes?.toLowerCase().includes(q) ||
        t.briefing_hook?.toLowerCase().includes(q) ||
        t.briefing_script?.toLowerCase().includes(q) ||
        t.briefing_caption?.toLowerCase().includes(q),
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

export async function removeContentTaskStorage(taskId: string): Promise<void> {
  const files = await findContentTaskFiles(taskId);
  for (const file of files) {
    try {
      await storageDelete(file.storage_path);
    } catch {
      // storage may already be gone
    }
  }
}

export async function removeContentTask(id: string): Promise<boolean> {
  await removeContentTaskStorage(id);
  await dbDelete("content_tasks", `id=eq.${id}`);
  return true;
}

export async function findContentTaskEvents(taskId: string): Promise<ContentTaskEvent[]> {
  return dbSelect<ContentTaskEvent>(
    "content_task_events",
    encodeQuery({
      select: "*",
      content_task_id: `eq.${taskId}`,
      order: "created_at.desc",
    }),
  );
}

export async function insertContentTaskEvent(input: {
  content_task_id: string;
  type: ContentTaskEventType;
  title: string;
  body?: string | null;
  metadata?: Record<string, unknown>;
  author_id?: string | null;
}): Promise<ContentTaskEvent> {
  const [event] = await dbInsert<ContentTaskEvent>("content_task_events", {
    content_task_id: input.content_task_id,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    metadata: input.metadata ?? {},
    author_id: input.author_id ?? null,
  });
  return event;
}

export async function findContentTaskFiles(taskId: string): Promise<ContentTaskFile[]> {
  return dbSelect<ContentTaskFile>(
    "content_task_files",
    encodeQuery({
      select: "*",
      content_task_id: `eq.${taskId}`,
      order: "created_at.desc",
    }),
  );
}

export async function findContentTaskFile(
  fileId: string,
  taskId: string,
): Promise<ContentTaskFile | null> {
  const rows = await dbSelect<ContentTaskFile>(
    "content_task_files",
    encodeQuery({
      select: "*",
      id: `eq.${fileId}`,
      content_task_id: `eq.${taskId}`,
      limit: "1",
    }),
  );
  return rows[0] ?? null;
}

export async function insertContentTaskFile(input: {
  content_task_id: string;
  file_type: ContentTaskFileType;
  name: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string | null;
}): Promise<ContentTaskFile> {
  const [row] = await dbInsert<ContentTaskFile>("content_task_files", input);
  return row;
}

export async function uploadContentTaskFile(
  taskId: string,
  name: string,
  fileType: ContentTaskFileType,
  mimeType: string,
  buffer: Buffer,
  uploadedBy: string | null,
): Promise<ContentTaskFile> {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  const storagePath = `content-tasks/${taskId}/${randomUUID()}${ext}`;

  await storageUpload(storagePath, buffer, mimeType);

  return insertContentTaskFile({
    content_task_id: taskId,
    file_type: fileType,
    name,
    storage_path: storagePath,
    mime_type: mimeType,
    size_bytes: buffer.length,
    uploaded_by: uploadedBy,
  });
}

export async function removeContentTaskFile(fileId: string, taskId: string): Promise<boolean> {
  const file = await findContentTaskFile(fileId, taskId);
  if (!file) return false;
  try {
    await storageDelete(file.storage_path);
  } catch {
    // storage may already be gone
  }
  await dbDelete("content_task_files", `id=eq.${fileId}`);
  return true;
}

export async function getContentTaskFileSignedUrl(storagePath: string): Promise<string> {
  return storageSignUrl(storagePath);
}
