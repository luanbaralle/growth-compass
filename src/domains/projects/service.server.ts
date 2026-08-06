import * as companyRepo from "@/domains/companies/repository.server";
import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import type { Project, ProjectPriority, ProjectStatus, ProjectType } from "./types";

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
  },
  authorId: TeamMember | null,
) {
  const company = await companyRepo.findCompanyById(input.companyId);
  if (!company) throw new Error("Empresa não encontrada.");

  const project = await repo.insertProject({
    company_id: input.companyId,
    title: input.title,
    type: input.type,
    status: input.status ?? "pending",
    owner_id: input.ownerId ?? null,
    priority: input.priority ?? "medium",
    due_date: input.dueDate || null,
    description: input.description ?? null,
  });

  await companyRepo.insertActivity({
    company_id: input.companyId,
    type: "project_created",
    title: "Projeto criado",
    body: `"${project.title}" — ${input.type}`,
    metadata: { projectId: project.id, type: input.type },
    author_id: authorId,
  });

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
  }>,
  authorId: TeamMember | null,
) {
  const existing = await repo.findProjectById(id);
  if (!existing || existing.company_id !== companyId) return null;

  const data: Partial<Project> = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.type !== undefined) data.type = patch.type;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.ownerId !== undefined) data.owner_id = patch.ownerId;
  if (patch.priority !== undefined) data.priority = patch.priority;
  if (patch.dueDate !== undefined) data.due_date = patch.dueDate || null;
  if (patch.description !== undefined) data.description = patch.description || null;

  const project = await repo.patchProject(id, data);
  if (!project) return null;

  if (patch.status && patch.status !== existing.status) {
    await companyRepo.insertActivity({
      company_id: companyId,
      type: "note",
      title: "Status do projeto alterado",
      body: `"${project.title}": ${existing.status} → ${patch.status}`,
      metadata: { projectId: id },
      author_id: authorId,
    });
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
