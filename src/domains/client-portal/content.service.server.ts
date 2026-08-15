import {
  emitContentRevisionRequested,
  emitContentStatusChanged,
} from "@/domains/content-production/content-domain-events.server";
import * as contentRepo from "@/domains/content-production/repository.server";
import type { ContentTask, ContentTaskFile, ContentTaskStatus } from "@/domains/content-production/types";
import {
  CHANNEL_LABELS,
  formatChannels,
  TYPE_LABELS,
} from "@/domains/content-production/types";
import { translateContentStatus } from "./translate";
import type { ClientContentDetail, ClientContentListItem } from "./types";

/** Status visíveis no portal — oculta fase interna "ideia". */
export const CLIENT_CONTENT_STATUSES: ContentTaskStatus[] = [
  "definicao",
  "agendamento",
  "gravacao",
  "edicao",
  "aprovacao",
  "correcao",
  "aprovado",
  "programado",
  "publicado",
];

function pickPreviewFile(files: ContentTaskFile[]): ContentTaskFile | null {
  const priority: ContentTaskFile["file_type"][] = ["edit", "raw_video", "thumbnail", "other"];
  for (const type of priority) {
    const match = files.find((f) => f.file_type === type);
    if (match) return match;
  }
  return files[0] ?? null;
}

function toListItem(task: ContentTask): ClientContentListItem {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    statusLabel: translateContentStatus(task.status),
    contentTypeLabel: TYPE_LABELS[task.content_type],
    channelsLabel: formatChannels(task.channels),
    postDate: task.post_date,
    canApprove: task.status === "aprovacao",
  };
}

export async function listClientContentTasks(companyId: string): Promise<ClientContentListItem[]> {
  const tasks = await contentRepo.findContentTasks({ companyId });
  return tasks
    .filter((t) => CLIENT_CONTENT_STATUSES.includes(t.status))
    .sort((a, b) => {
      if (a.status === "aprovacao" && b.status !== "aprovacao") return -1;
      if (b.status === "aprovacao" && a.status !== "aprovacao") return 1;
      return (b.updated_at ?? "").localeCompare(a.updated_at ?? "");
    })
    .map(toListItem);
}

async function requireClientTask(
  companyId: string,
  taskId: string,
): Promise<ContentTask> {
  const task = await contentRepo.findContentTaskById(taskId);
  if (!task || task.company_id !== companyId) {
    throw new Error("Conteúdo não encontrado.");
  }
  if (!CLIENT_CONTENT_STATUSES.includes(task.status)) {
    throw new Error("Conteúdo não disponível.");
  }
  return task;
}

export async function getClientContentDetail(
  companyId: string,
  taskId: string,
  companyName: string,
): Promise<ClientContentDetail> {
  const task = await requireClientTask(companyId, taskId);
  const files = await contentRepo.findContentTaskFiles(taskId);
  const previewFile = pickPreviewFile(files);
  let previewMediaUrl: string | null = null;
  let previewMimeType: string | null = null;

  if (previewFile) {
    previewMediaUrl = await contentRepo.getContentTaskFileSignedUrl(previewFile.storage_path);
    previewMimeType = previewFile.mime_type;
  }

  return {
    ...toListItem(task),
    companyName,
    channels: task.channels.map((c) => ({ id: c, label: CHANNEL_LABELS[c] })),
    contentType: task.content_type,
    briefingCaption: task.briefing_caption ?? "",
    briefingCta: task.briefing_cta ?? "",
    raiseOneNote: task.theme_objective?.trim() || null,
    previewChannel: task.channels[0] ?? "instagram",
    previewMediaUrl,
    previewMimeType,
    clientApprovedAt: task.client_approved_at,
    clientApprovedBy: task.client_approved_by,
  };
}

export async function approveClientContentTask(
  companyId: string,
  taskId: string,
  clientName: string,
): Promise<ClientContentListItem> {
  const task = await requireClientTask(companyId, taskId);
  if (task.status !== "aprovacao") {
    throw new Error("Este conteúdo não está aguardando sua aprovação.");
  }

  const from = task.status;
  const now = new Date().toISOString();
  const updated = await contentRepo.patchContentTask(taskId, {
    status: "aprovado",
    client_approved_at: now,
    client_approved_by: clientName,
  });
  if (!updated) throw new Error("Não foi possível aprovar o conteúdo.");

  await emitContentStatusChanged(updated, from, "aprovado", null);
  return toListItem(updated);
}

export async function requestClientContentRevision(
  companyId: string,
  taskId: string,
  message: string,
  clientName: string,
): Promise<ClientContentListItem> {
  const trimmed = message.trim();
  if (trimmed.length < 3) {
    throw new Error("Descreva o que precisa ser ajustado.");
  }

  const task = await requireClientTask(companyId, taskId);
  if (task.status !== "aprovacao") {
    throw new Error("Este conteúdo não está aguardando sua aprovação.");
  }

  const from = task.status;
  const updated = await contentRepo.patchContentTask(taskId, {
    status: "correcao",
    client_approved_at: null,
    client_approved_by: null,
  });
  if (!updated) throw new Error("Não foi possível registrar a solicitação.");

  await emitContentRevisionRequested(updated, from, trimmed, clientName);
  return toListItem(updated);
}

export async function getClientContentCounts(companyId: string) {
  const items = await listClientContentTasks(companyId);
  return {
    emProducao: items.filter((t) =>
      ["definicao", "agendamento", "gravacao", "edicao", "correcao"].includes(t.status),
    ).length,
    aguardandoAprovacao: items.filter((t) => t.status === "aprovacao").length,
    programados: items.filter((t) => t.status === "programado" || t.status === "aprovado").length,
    publicados: items.filter((t) => t.status === "publicado").length,
  };
}
