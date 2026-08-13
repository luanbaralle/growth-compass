import * as companyRepo from "@/domains/companies/repository.server";
import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import { buildUpdateEvents, logEvents } from "./content-task-events.server";
import type {
  ContentChannel,
  ContentTaskStatus,
  ContentType,
} from "./types";
import { formatChannels, STATUS_LABELS } from "./types";

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
    sort_order: 0,
  });

  await logEvents(task.id, authorId, [
    {
      type: "created",
      title: "Tarefa criada",
      body: input.title,
      metadata: {
        status: task.status,
        channels: input.channels,
        contentType: input.contentType,
      },
    },
  ]);

  await companyRepo.insertActivity({
    company_id: input.companyId,
    type: "note",
    title: "Conteúdo criado",
    body: `"${task.title}" — ${formatChannels(input.channels)}`,
    metadata: { contentTaskId: task.id, channels: input.channels },
    author_id: authorId,
  });

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

  if (events.length > 0) {
    await logEvents(id, authorId, events);
  }

  if (patch.status && patch.status !== existing.status) {
    await companyRepo.insertActivity({
      company_id: task.company_id,
      type: "note",
      title: "Status de conteúdo atualizado",
      body: `"${task.title}": ${STATUS_LABELS[existing.status]} → ${STATUS_LABELS[patch.status]}`,
      metadata: { contentTaskId: id, from: existing.status, to: patch.status },
      author_id: authorId,
    });
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
