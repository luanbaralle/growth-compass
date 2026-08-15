import * as companyRepo from "@/domains/companies/repository.server";
import type { TeamMember } from "@/lib/auth/types";
import {
  emitProjectBlocked,
  emitProjectCreated,
  emitProjectNextActionSet,
  emitProjectStatusChanged,
  emitProjectUnblocked,
} from "./project-domain-events.server";
import * as repo from "./repository.server";
import type {
  Project,
  ProjectBlockedByType,
  ProjectPriority,
  ProjectStatus,
  ProjectType,
} from "./types";

function assertBlockedFields(
  status: ProjectStatus,
  blockedByType?: ProjectBlockedByType | null,
  blockedByDetail?: string | null,
) {
  if (status !== "blocked") return;
  if (!blockedByType) throw new Error("Informe o motivo do bloqueio.");
  if (!blockedByDetail?.trim()) throw new Error("Descreva o bloqueio.");
}

export async function listProjects(filters: Parameters<typeof repo.findProjects>[0]) {
  const [projects, counts] = await Promise.all([
    repo.findProjects(filters),
    repo.countProjectsByStatus(),
  ]);
  return { projects, counts };
}

export async function getProject(id: string) {
  const project = await repo.findProjectById(id);
  if (!project) return null;

  const [company, checklist, comments] = await Promise.all([
    companyRepo.findCompanyById(project.company_id),
    repo.findChecklistItems(id),
    repo.findComments(id),
  ]);

  return { project, company, checklist, comments };
}

export async function createProject(
  input: {
    companyId: string;
    title: string;
    type: ProjectType;
    status?: ProjectStatus;
    ownerId?: TeamMember;
    priority?: ProjectPriority;
    dueDate?: string;
    description?: string;
    blockedByType?: ProjectBlockedByType | null;
    blockedByDetail?: string | null;
    nextAction?: string;
    nextActionDue?: string;
  },
  authorId: TeamMember | null,
) {
  const company = await companyRepo.findCompanyById(input.companyId);
  if (!company) throw new Error("Empresa não encontrada.");

  const status = input.status ?? "pending";
  assertBlockedFields(status, input.blockedByType, input.blockedByDetail);

  const project = await repo.insertProject({
    company_id: input.companyId,
    title: input.title,
    type: input.type,
    status,
    owner_id: input.ownerId ?? null,
    priority: input.priority ?? "medium",
    due_date: input.dueDate || null,
    description: input.description ?? null,
    blocked_by_type: status === "blocked" ? (input.blockedByType ?? null) : null,
    blocked_by_detail:
      status === "blocked" ? input.blockedByDetail?.trim() || null : null,
    next_action: input.nextAction?.trim() || null,
    next_action_due: input.nextActionDue || null,
  });

  await emitProjectCreated(project, { type: input.type }, authorId);

  if (status === "blocked" && input.blockedByType && input.blockedByDetail?.trim()) {
    await emitProjectBlocked(
      project,
      input.blockedByType,
      input.blockedByDetail.trim(),
      authorId,
    );
  }

  if (input.nextAction?.trim()) {
    await emitProjectNextActionSet(
      project,
      input.nextAction.trim(),
      input.nextActionDue || null,
      authorId,
    );
  }

  return project;
}

export async function updateProject(
  id: string,
  companyId: string,
  patch: Partial<{
    title: string;
    type: ProjectType;
    status: ProjectStatus;
    ownerId: TeamMember;
    priority: ProjectPriority;
    dueDate: string;
    description: string;
    blockedByType: ProjectBlockedByType | null;
    blockedByDetail: string | null;
    nextAction: string;
    nextActionDue: string;
  }>,
  authorId: TeamMember | null,
) {
  const existing = await repo.findProjectById(id);
  if (!existing || existing.company_id !== companyId) return null;

  const nextStatus = patch.status ?? existing.status;
  const nextBlockedType =
    patch.blockedByType !== undefined ? patch.blockedByType : existing.blocked_by_type;
  const nextBlockedDetail =
    patch.blockedByDetail !== undefined
      ? patch.blockedByDetail
      : existing.blocked_by_detail;

  assertBlockedFields(nextStatus, nextBlockedType, nextBlockedDetail);

  const data: Partial<Project> = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.type !== undefined) data.type = patch.type;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.ownerId !== undefined) data.owner_id = patch.ownerId;
  if (patch.priority !== undefined) data.priority = patch.priority;
  if (patch.dueDate !== undefined) data.due_date = patch.dueDate || null;
  if (patch.description !== undefined) data.description = patch.description || null;
  if (patch.nextAction !== undefined) data.next_action = patch.nextAction.trim() || null;
  if (patch.nextActionDue !== undefined) {
    data.next_action_due = patch.nextActionDue || null;
  }

  if (patch.status !== undefined && patch.status !== "blocked") {
    data.blocked_by_type = null;
    data.blocked_by_detail = null;
  } else {
    if (patch.blockedByType !== undefined) data.blocked_by_type = patch.blockedByType;
    if (patch.blockedByDetail !== undefined) {
      data.blocked_by_detail = patch.blockedByDetail?.trim() || null;
    }
  }

  const project = await repo.patchProject(id, data);
  if (!project) return null;

  if (patch.status !== undefined && patch.status !== existing.status) {
    await emitProjectStatusChanged(project, existing.status, patch.status, authorId);

    if (patch.status === "blocked" && existing.status !== "blocked") {
      await emitProjectBlocked(
        project,
        project.blocked_by_type!,
        project.blocked_by_detail ?? "",
        authorId,
      );
    }

    if (existing.status === "blocked" && patch.status !== "blocked" && existing.blocked_by_type) {
      await emitProjectUnblocked(
        project,
        {
          type: existing.blocked_by_type,
          detail: existing.blocked_by_detail,
        },
        authorId,
      );
    }
  } else if (
    nextStatus === "blocked" &&
    existing.status === "blocked" &&
    (patch.blockedByType !== undefined || patch.blockedByDetail !== undefined) &&
    (patch.blockedByType !== existing.blocked_by_type ||
      (patch.blockedByDetail ?? existing.blocked_by_detail) !== existing.blocked_by_detail)
  ) {
    await emitProjectBlocked(
      project,
      project.blocked_by_type!,
      project.blocked_by_detail ?? "",
      authorId,
    );
  }

  const nextActionValue =
    patch.nextAction !== undefined ? patch.nextAction.trim() || null : existing.next_action;
  const nextActionDueValue =
    patch.nextActionDue !== undefined
      ? patch.nextActionDue || null
      : existing.next_action_due;

  if (
    nextActionValue &&
    (patch.nextAction !== undefined || patch.nextActionDue !== undefined) &&
    (nextActionValue !== existing.next_action ||
      nextActionDueValue !== existing.next_action_due)
  ) {
    await emitProjectNextActionSet(
      project,
      nextActionValue,
      nextActionDueValue,
      authorId,
    );
  }

  return project;
}

export async function deleteProject(id: string, companyId: string) {
  const existing = await repo.findProjectById(id);
  if (!existing || existing.company_id !== companyId) return false;
  return repo.removeProject(id);
}

export async function addChecklistItem(
  projectId: string,
  companyId: string,
  text: string,
) {
  const project = await repo.findProjectById(projectId);
  if (!project || project.company_id !== companyId) throw new Error("Projeto não encontrado.");

  const sortOrder = await repo.getNextChecklistOrder(projectId);
  return repo.insertChecklistItem({
    project_id: projectId,
    text,
    done: false,
    sort_order: sortOrder,
  });
}

export async function updateChecklistItem(
  id: string,
  projectId: string,
  companyId: string,
  patch: { text?: string; done?: boolean },
) {
  const project = await repo.findProjectById(projectId);
  if (!project || project.company_id !== companyId) return null;
  return repo.patchChecklistItem(id, patch);
}

export async function deleteChecklistItem(
  id: string,
  projectId: string,
  companyId: string,
) {
  const project = await repo.findProjectById(projectId);
  if (!project || project.company_id !== companyId) return false;
  return repo.removeChecklistItem(id);
}

export async function addComment(
  projectId: string,
  companyId: string,
  body: string,
  authorId: TeamMember | null,
) {
  const project = await repo.findProjectById(projectId);
  if (!project || project.company_id !== companyId) throw new Error("Projeto não encontrado.");

  return repo.insertComment({
    project_id: projectId,
    body,
    author_id: authorId,
  });
}

export async function deleteComment(
  id: string,
  projectId: string,
  companyId: string,
) {
  const project = await repo.findProjectById(projectId);
  if (!project || project.company_id !== companyId) return false;
  return repo.removeComment(id);
}

export async function getProjectDashboardStats() {
  const [inProgress, overdue] = await Promise.all([
    repo.countActiveProjects(),
    repo.countOverdueProjects(),
  ]);
  return { inProgress, overdue };
}
