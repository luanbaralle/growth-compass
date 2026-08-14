import * as companyRepo from "@/domains/companies/repository.server";
import { emitDomainEvent } from "@/domains/events/emit.server";
import {
  buildIdempotencyKey,
  buildStatusChangeDiscriminator,
} from "@/domains/events/idempotency";
import { DEFAULT_ASSIGNEE, ENTITY_ROUTES } from "@/domains/events/types";
import type { TeamMember } from "@/lib/auth/types";
import type { Project, ProjectBlockedByType, ProjectStatus, ProjectType } from "./types";
import { BLOCKED_BY_LABELS, STATUS_LABELS, TYPE_LABELS } from "./types";

function projectAssignee(project: Project): TeamMember {
  if (
    project.owner_id === "luan" ||
    project.owner_id === "vini" ||
    project.owner_id === "caio"
  ) {
    return project.owner_id;
  }
  return DEFAULT_ASSIGNEE;
}

function projectActionUrl(projectId: string): string {
  return ENTITY_ROUTES.project(projectId);
}

export async function emitProjectCreated(
  project: Project,
  input: { type: ProjectType },
  authorId: TeamMember | null,
) {
  return emitDomainEvent({
    idempotencyKey: buildIdempotencyKey("project.created", "project", project.id),
    eventKey: "project.created",
    entityType: "project",
    entityId: project.id,
    companyId: project.company_id,
    actorId: authorId,
    payload: { type: input.type, title: project.title },
    activityTitle: "Projeto criado",
    activityBody: `"${project.title}" — ${TYPE_LABELS[input.type]}`,
    projections: async () => {
      await companyRepo.insertActivity({
        company_id: project.company_id,
        type: "project_created",
        title: "Projeto criado",
        body: `"${project.title}" — ${TYPE_LABELS[input.type]}`,
        metadata: { projectId: project.id, type: input.type },
        author_id: authorId,
      });
    },
  });
}

export async function emitProjectStatusChanged(
  project: Project,
  from: ProjectStatus,
  to: ProjectStatus,
  authorId: TeamMember | null,
) {
  return emitDomainEvent({
    idempotencyKey: buildIdempotencyKey(
      "project.status_changed",
      "project",
      project.id,
      buildStatusChangeDiscriminator(from, to),
    ),
    eventKey: "project.status_changed",
    entityType: "project",
    entityId: project.id,
    companyId: project.company_id,
    actorId: authorId,
    payload: { from, to, title: project.title },
    activityTitle: "Status do projeto alterado",
    activityBody: `"${project.title}": ${STATUS_LABELS[from]} → ${STATUS_LABELS[to]}`,
    projections: async () => {
      await companyRepo.insertActivity({
        company_id: project.company_id,
        type: "note",
        title: "Status do projeto alterado",
        body: `"${project.title}": ${STATUS_LABELS[from]} → ${STATUS_LABELS[to]}`,
        metadata: { projectId: project.id, from, to },
        author_id: authorId,
      });
    },
  });
}

export async function emitProjectBlocked(
  project: Project,
  blockedByType: ProjectBlockedByType,
  detail: string,
  authorId: TeamMember | null,
) {
  const assignee = projectAssignee(project);
  const actionUrl = projectActionUrl(project.id);

  return emitDomainEvent({
    idempotencyKey: buildIdempotencyKey(
      "project.blocked",
      "project",
      project.id,
      blockedByType,
    ),
    eventKey: "project.blocked",
    entityType: "project",
    entityId: project.id,
    companyId: project.company_id,
    actorId: authorId,
    payload: { blockedByType, detail, title: project.title },
    activityTitle: "Projeto bloqueado",
    activityBody: `"${project.title}": ${BLOCKED_BY_LABELS[blockedByType]} — ${detail}`,
    notifications: [
      {
        assigneeId: assignee,
        title: "Projeto bloqueado",
        body: project.title,
        actionUrl,
        urgency: "warning",
      },
    ],
    tasks: [
      {
        title: `Desbloquear projeto — ${project.title}`,
        assigneeId: assignee,
        dueDate: project.next_action_due ?? project.due_date,
        companyId: project.company_id,
        projectId: project.id,
      },
    ],
    projections: async () => {
      await companyRepo.insertActivity({
        company_id: project.company_id,
        type: "note",
        title: "Projeto bloqueado",
        body: `${BLOCKED_BY_LABELS[blockedByType]}: ${detail}`,
        metadata: { projectId: project.id, blockedByType },
        author_id: authorId,
      });
    },
  });
}

export async function emitProjectUnblocked(
  project: Project,
  previousBlock: { type: ProjectBlockedByType; detail: string | null },
  authorId: TeamMember | null,
) {
  return emitDomainEvent({
    idempotencyKey: buildIdempotencyKey(
      "project.unblocked",
      "project",
      project.id,
      previousBlock.type,
    ),
    eventKey: "project.unblocked",
    entityType: "project",
    entityId: project.id,
    companyId: project.company_id,
    actorId: authorId,
    payload: {
      previousBlock: previousBlock.type,
      detail: previousBlock.detail,
      title: project.title,
    },
    activityTitle: "Projeto desbloqueado",
    activityBody: `"${project.title}" voltou a andar`,
    projections: async () => {
      await companyRepo.insertActivity({
        company_id: project.company_id,
        type: "note",
        title: "Projeto desbloqueado",
        body: `"${project.title}"`,
        metadata: { projectId: project.id },
        author_id: authorId,
      });
    },
  });
}

export async function emitProjectNextActionSet(
  project: Project,
  action: string,
  due: string | null,
  authorId: TeamMember | null,
) {
  const assignee = projectAssignee(project);

  return emitDomainEvent({
    idempotencyKey: buildIdempotencyKey(
      "project.next_action_set",
      "project",
      project.id,
      `${action.slice(0, 40)}:${due ?? "none"}`,
    ),
    eventKey: "project.next_action_set",
    entityType: "project",
    entityId: project.id,
    companyId: project.company_id,
    actorId: authorId,
    payload: { action, due, title: project.title },
    activityTitle: "Próxima ação definida",
    activityBody: `"${project.title}": ${action}`,
    tasks: [
      {
        title: action,
        assigneeId: assignee,
        dueDate: due ?? project.due_date,
        companyId: project.company_id,
        projectId: project.id,
      },
    ],
    projections: async () => {
      await companyRepo.insertActivity({
        company_id: project.company_id,
        type: "note",
        title: "Próxima ação definida",
        body: `"${project.title}": ${action}`,
        metadata: { projectId: project.id, due },
        author_id: authorId,
      });
    },
  });
}
