import * as companyRepo from "@/domains/companies/repository.server";
import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import { buildUpdateEvents, logEvents } from "./content-task-events.server";
import {
  emitContentCreated,
  emitContentStatusChanged,
} from "./content-domain-events.server";
import type {
  ContentChannel,
  ContentPublication,
  ContentTaskFileType,
  ContentTaskStatus,
  ContentType,
} from "./types";

export async function listContentTasks(filters: Parameters<typeof repo.findContentTasks>[0]) {
  const tasks = await repo.findContentTasks(filters);
  return { tasks };
}

export async function getContentTask(id: string) {
  const task = await repo.findContentTaskById(id);
  if (!task) return null;

  const company = await companyRepo.findCompanyById(task.company_id);
  return { task, company };
}

export async function createContentTask(
  input: {
    companyId: string;
    title: string;
    status?: ContentTaskStatus;
    channels: ContentChannel[];
    themeObjective?: string;
    contentType: ContentType;
    postDate?: string;
    productionOwnerId?: TeamMember;
    notes?: string;
    briefingHook?: string;
    briefingScript?: string;
    briefingCta?: string;
    briefingReferences?: string;
  },
  authorId: TeamMember | null,
) {
  const company = await companyRepo.findCompanyById(input.companyId);
  if (!company) throw new Error("Empresa não encontrada.");

  const task = await repo.insertContentTask({
    company_id: input.companyId,
    title: input.title,
    status: input.status ?? "ideia",
    channels: input.channels,
    theme_objective: input.themeObjective ?? null,
    content_type: input.contentType,
    post_date: input.postDate || null,
    production_owner_id: input.productionOwnerId ?? null,
    notes: input.notes ?? null,
    briefing_hook: input.briefingHook ?? null,
    briefing_script: input.briefingScript ?? null,
    briefing_cta: input.briefingCta ?? null,
    briefing_references: input.briefingReferences ?? null,
    client_approved_at: null,
    client_approved_by: null,
    publication: {},
    sort_order: 0,
  });

  await emitContentCreated(
    task,
    { channels: input.channels, contentType: input.contentType },
    authorId,
  );

  return task;
}

export async function updateContentTask(
  id: string,
  patch: Partial<{
    companyId: string;
    title: string;
    status: ContentTaskStatus;
    channels: ContentChannel[];
    themeObjective: string;
    contentType: ContentType;
    postDate: string;
    productionOwnerId: TeamMember;
    notes: string;
    briefingHook: string;
    briefingScript: string;
    briefingCta: string;
    briefingReferences: string;
    clientApprovedAt: string | null;
    clientApprovedBy: string;
    publication: ContentPublication;
  }>,
  authorId: TeamMember | null,
) {
  const existing = await repo.findContentTaskById(id);
  if (!existing) return null;

  if (patch.companyId !== undefined && patch.companyId !== existing.company_id) {
    const company = await companyRepo.findCompanyById(patch.companyId);
    if (!company) throw new Error("Empresa não encontrada.");
  }

  const dbPatch: Record<string, unknown> = {};
  if (patch.companyId !== undefined) dbPatch.company_id = patch.companyId;
  if (patch.title !== undefined) dbPatch.title = patch.title;
  if (patch.status !== undefined) dbPatch.status = patch.status;
  if (patch.channels !== undefined) dbPatch.channels = patch.channels;
  if (patch.themeObjective !== undefined) dbPatch.theme_objective = patch.themeObjective || null;
  if (patch.contentType !== undefined) dbPatch.content_type = patch.contentType;
  if (patch.postDate !== undefined) dbPatch.post_date = patch.postDate || null;
  if (patch.productionOwnerId !== undefined) {
    dbPatch.production_owner_id = patch.productionOwnerId || null;
  }
  if (patch.notes !== undefined) dbPatch.notes = patch.notes || null;
  if (patch.briefingHook !== undefined) dbPatch.briefing_hook = patch.briefingHook || null;
  if (patch.briefingScript !== undefined) dbPatch.briefing_script = patch.briefingScript || null;
  if (patch.briefingCta !== undefined) dbPatch.briefing_cta = patch.briefingCta || null;
  if (patch.briefingReferences !== undefined) {
    dbPatch.briefing_references = patch.briefingReferences || null;
  }
  if (patch.clientApprovedAt !== undefined) {
    dbPatch.client_approved_at = patch.clientApprovedAt || null;
  }
  if (patch.clientApprovedBy !== undefined) {
    dbPatch.client_approved_by = patch.clientApprovedBy || null;
  }
  if (patch.publication !== undefined) dbPatch.publication = patch.publication;

  const task = await repo.patchContentTask(id, dbPatch);
  if (!task) return null;

  const events = buildUpdateEvents(existing, patch);

  if (patch.companyId !== undefined && patch.companyId !== existing.company_id) {
    const [fromCompany, toCompany] = await Promise.all([
      companyRepo.findCompanyById(existing.company_id),
      companyRepo.findCompanyById(patch.companyId),
    ]);
    events.push({
      type: "company_changed",
      title: "Cliente alterado",
      body: `${fromCompany?.name ?? "—"} → ${toCompany?.name ?? "—"}`,
      metadata: { from: existing.company_id, to: patch.companyId },
    });
  }

  const nonStatusEvents = events.filter((event) => event.type !== "status_changed");

  if (nonStatusEvents.length > 0) {
    await logEvents(id, authorId, nonStatusEvents);
  }

  if (patch.status && patch.status !== existing.status) {
    await emitContentStatusChanged(task, existing.status, patch.status, authorId);
  }

  return task;
}

export async function moveContentTask(
  id: string,
  status: ContentTaskStatus,
  authorId: TeamMember | null,
) {
  const existing = await repo.findContentTaskById(id);
  if (!existing) return null;
  if (existing.status === status) return existing;

  return updateContentTask(
    id,
    { status },
    authorId,
  );
}

export async function deleteContentTask(id: string, companyId: string) {
  const existing = await repo.findContentTaskById(id);
  if (!existing || existing.company_id !== companyId) return false;
  await repo.removeContentTask(id);
  return true;
}

export { listContentTaskEvents, addContentTaskNote } from "./content-task-events.server";

const CONTENT_TASK_FILE_MAX_BYTES = 50 * 1024 * 1024;

export async function listContentTaskFiles(taskId: string) {
  const task = await repo.findContentTaskById(taskId);
  if (!task) return null;
  const files = await repo.findContentTaskFiles(taskId);
  return { files };
}

export async function uploadContentTaskFile(
  taskId: string,
  name: string,
  fileType: ContentTaskFileType,
  mimeType: string,
  base64: string,
  authorId: TeamMember | null,
) {
  const task = await repo.findContentTaskById(taskId);
  if (!task) throw new Error("Tarefa não encontrada.");

  const buffer = Buffer.from(base64, "base64");
  if (buffer.length > CONTENT_TASK_FILE_MAX_BYTES) {
    throw new Error("Arquivo máximo: 50 MB.");
  }

  const file = await repo.uploadContentTaskFile(
    taskId,
    name,
    fileType,
    mimeType,
    buffer,
    authorId,
  );

  const { logEvents } = await import("./content-task-events.server");
  await logEvents(taskId, authorId, [
    {
      type: "file_added",
      title: "Arquivo adicionado",
      body: file.name,
      metadata: { fileType: file.file_type, fileId: file.id },
    },
  ]);

  return file;
}

export async function deleteContentTaskFile(
  taskId: string,
  fileId: string,
  authorId: TeamMember | null,
) {
  const task = await repo.findContentTaskById(taskId);
  if (!task) return false;

  const file = await repo.findContentTaskFile(fileId, taskId);
  if (!file) return false;

  const removed = await repo.removeContentTaskFile(fileId, taskId);
  if (!removed) return false;

  const { logEvents } = await import("./content-task-events.server");
  await logEvents(taskId, authorId, [
    {
      type: "file_removed",
      title: "Arquivo removido",
      body: file.name,
      metadata: { fileType: file.file_type, fileId: file.id },
    },
  ]);

  return true;
}

export async function getContentTaskFileUrl(taskId: string, fileId: string) {
  const file = await repo.findContentTaskFile(fileId, taskId);
  if (!file) return null;
  const url = await repo.getContentTaskFileSignedUrl(file.storage_path);
  return { url, name: file.name };
}
