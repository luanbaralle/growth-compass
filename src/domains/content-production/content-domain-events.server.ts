import * as companyRepo from "@/domains/companies/repository.server";
import { emitDomainEvent } from "@/domains/events/emit.server";
import {
  buildIdempotencyKey,
  buildStatusChangeDiscriminator,
} from "@/domains/events/idempotency";
import {
  ENTITY_ROUTES,
  PRODUCTION_DEFAULT_ASSIGNEE,
  type DomainEventKey,
} from "@/domains/events/types";
import type { TeamMember } from "@/lib/auth/types";
import { logEvents } from "./content-task-events.server";
import type { ContentChannel, ContentTask, ContentTaskStatus, ContentType } from "./types";
import { formatChannels, STATUS_LABELS } from "./types";

function productionAssignee(task: ContentTask): TeamMember {
  if (
    task.production_owner_id === "luan" ||
    task.production_owner_id === "vini" ||
    task.production_owner_id === "caio"
  ) {
    return task.production_owner_id;
  }
  return PRODUCTION_DEFAULT_ASSIGNEE;
}

function contentActionUrl(taskId: string): string {
  return ENTITY_ROUTES.content_task(taskId);
}

function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function resolveContentStatusEventKey(to: ContentTaskStatus): DomainEventKey {
  switch (to) {
    case "aprovacao":
      return "content.sent_for_approval";
    case "aprovado":
      return "content.approved";
    case "programado":
      return "content.scheduled";
    case "publicado":
      return "content.published";
    default:
      return "content.status_changed";
  }
}

function buildContentStatusSideEffects(task: ContentTask, eventKey: DomainEventKey) {
  const assignee = productionAssignee(task);
  const actionUrl = contentActionUrl(task.id);

  switch (eventKey) {
    case "content.sent_for_approval":
      return {
        notifications: [
          {
            assigneeId: assignee,
            title: "Aguardando aprovação do cliente",
            body: task.title,
            actionUrl,
            urgency: "warning" as const,
          },
        ],
        tasks: [],
      };
    case "content.approved":
      return {
        notifications: [
          {
            assigneeId: assignee,
            title: "Conteúdo aprovado",
            body: task.title,
            actionUrl,
            urgency: "default" as const,
          },
        ],
        tasks: [
          {
            title: `Programar publicação — ${task.title}`,
            assigneeId: assignee,
            dueDate: task.post_date,
            companyId: task.company_id,
          },
        ],
      };
    case "content.scheduled":
      return {
        notifications: [
          {
            assigneeId: assignee,
            title: "Conteúdo programado",
            body: task.title,
            actionUrl,
            urgency: "default" as const,
          },
        ],
        tasks: [
          {
            title: `Publicar — ${task.title}`,
            assigneeId: assignee,
            dueDate: task.post_date,
            companyId: task.company_id,
          },
        ],
      };
    case "content.published":
      return {
        notifications: [],
        tasks: [
          {
            title: `Analisar desempenho em 7 dias — ${task.title}`,
            assigneeId: assignee,
            dueDate: addDaysIso(todayIso(), 7),
            companyId: task.company_id,
          },
        ],
      };
    default:
      return { notifications: [], tasks: [] };
  }
}

export async function emitContentRevisionRequested(
  task: ContentTask,
  from: ContentTaskStatus,
  message: string,
  clientName: string,
) {
  const assignee = productionAssignee(task);
  const actionUrl = contentActionUrl(task.id);

  return emitDomainEvent({
    idempotencyKey: buildIdempotencyKey(
      "content.revision_requested",
      "content_task",
      task.id,
      buildStatusChangeDiscriminator(from, "correcao"),
    ),
    eventKey: "content.revision_requested",
    entityType: "content_task",
    entityId: task.id,
    companyId: task.company_id,
    actorId: null,
    payload: { from, to: "correcao", title: task.title, message, clientName },
    activityTitle: "Cliente solicitou alteração",
    activityBody: `"${task.title}": ${message}`,
    notifications: [
      {
        assigneeId: assignee,
        title: "Cliente solicitou alteração",
        body: task.title,
        actionUrl,
        urgency: "warning",
      },
    ],
    tasks: [
      {
        title: `Revisar feedback — ${task.title}`,
        assigneeId: assignee,
        companyId: task.company_id,
      },
    ],
    projections: async () => {
      await logEvents(task.id, null, [
        {
          type: "status_changed",
          title: "Status alterado",
          body: `${STATUS_LABELS[from]} → ${STATUS_LABELS.correcao}`,
          metadata: { from, to: "correcao", clientRevision: true },
        },
        {
          type: "note",
          title: "Alteração solicitada pelo cliente",
          body: message,
          metadata: { clientName },
        },
      ]);

      await companyRepo.insertActivity({
        company_id: task.company_id,
        type: "note",
        title: "Alteração solicitada no conteúdo",
        body: `"${task.title}": ${message}`,
        metadata: { contentTaskId: task.id, clientName },
        author_id: null,
      });
    },
  });
}

export async function emitContentCreated(
  task: ContentTask,
  input: {
    channels: ContentChannel[];
    contentType: ContentType;
  },
  authorId: TeamMember | null,
) {
  return emitDomainEvent({
    idempotencyKey: buildIdempotencyKey("content.created", "content_task", task.id),
    eventKey: "content.created",
    entityType: "content_task",
    entityId: task.id,
    companyId: task.company_id,
    actorId: authorId,
    payload: {
      status: task.status,
      channels: input.channels,
      contentType: input.contentType,
    },
    activityTitle: "Conteúdo criado",
    activityBody: `"${task.title}" — ${formatChannels(input.channels)}`,
    projections: async () => {
      await logEvents(task.id, authorId, [
        {
          type: "created",
          title: "Tarefa criada",
          body: task.title,
          metadata: {
            status: task.status,
            channels: input.channels,
            contentType: input.contentType,
          },
        },
      ]);

      await companyRepo.insertActivity({
        company_id: task.company_id,
        type: "note",
        title: "Conteúdo criado",
        body: `"${task.title}" — ${formatChannels(input.channels)}`,
        metadata: { contentTaskId: task.id, channels: input.channels },
        author_id: authorId,
      });
    },
  });
}

export async function emitContentStatusChanged(
  task: ContentTask,
  from: ContentTaskStatus,
  to: ContentTaskStatus,
  authorId: TeamMember | null,
) {
  const eventKey = resolveContentStatusEventKey(to);
  const sideEffects = buildContentStatusSideEffects(task, eventKey);

  return emitDomainEvent({
    idempotencyKey: buildIdempotencyKey(
      eventKey,
      "content_task",
      task.id,
      buildStatusChangeDiscriminator(from, to),
    ),
    eventKey,
    entityType: "content_task",
    entityId: task.id,
    companyId: task.company_id,
    actorId: authorId,
    payload: { from, to, title: task.title },
    activityTitle: "Status de conteúdo atualizado",
    activityBody: `"${task.title}": ${STATUS_LABELS[from]} → ${STATUS_LABELS[to]}`,
    notifications: sideEffects.notifications,
    tasks: sideEffects.tasks,
    projections: async () => {
      await logEvents(task.id, authorId, [
        {
          type: "status_changed",
          title: "Status alterado",
          body: `${STATUS_LABELS[from]} → ${STATUS_LABELS[to]}`,
          metadata: { from, to },
        },
      ]);

      await companyRepo.insertActivity({
        company_id: task.company_id,
        type: "note",
        title: "Status de conteúdo atualizado",
        body: `"${task.title}": ${STATUS_LABELS[from]} → ${STATUS_LABELS[to]}`,
        metadata: { contentTaskId: task.id, from, to },
        author_id: authorId,
      });
    },
  });
}
