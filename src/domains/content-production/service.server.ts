import * as companyRepo from "@/domains/companies/repository.server";
import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
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
  companyId: string,
  patch: Partial<{
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
  if (!existing || existing.company_id !== companyId) return null;

  const dbPatch: Record<string, unknown> = {};
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

  if (patch.status && patch.status !== existing.status) {
    await companyRepo.insertActivity({
      company_id: companyId,
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
    existing.company_id,
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
