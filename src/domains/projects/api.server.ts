import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  createChecklistItemSchema,
  createCommentSchema,
  createProjectSchema,
  deleteChecklistItemSchema,
  deleteCommentSchema,
  listProjectsSchema,
  projectCompanyIdSchema,
  projectIdSchema,
  updateChecklistItemSchema,
  updateProjectSchema,
} from "@/domains/projects/schema";

export const listProjects = createServerFn({ method: "GET" })
  .validator(listProjectsSchema.optional())
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const projectService = await import("@/domains/projects/service.server");
      return projectService.listProjects(data ?? {});
    });
  });

export const getProject = createServerFn({ method: "GET" })
  .validator(projectIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const projectService = await import("@/domains/projects/service.server");
      const result = await projectService.getProject(data.id);
      if (!result) throw new Error("Projeto não encontrado.");
      return result;
    });
  });

export const createProject = createServerFn({ method: "POST" })
  .validator(createProjectSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const projectService = await import("@/domains/projects/service.server");
      return projectService.createProject(
        {
          companyId: data.companyId,
          title: data.title,
          type: data.type,
          status: data.status,
          ownerId: data.ownerId,
          priority: data.priority,
          dueDate: data.dueDate || undefined,
          description: data.description,
        },
        author,
      );
    });
  });

export const updateProject = createServerFn({ method: "POST" })
  .validator(updateProjectSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const projectService = await import("@/domains/projects/service.server");
      const { id, companyId, ...patch } = data;
      const project = await projectService.updateProject(
        id,
        companyId,
        {
          title: patch.title,
          type: patch.type,
          status: patch.status,
          ownerId: patch.ownerId,
          priority: patch.priority,
          dueDate: patch.dueDate,
          description: patch.description,
        },
        author,
      );
      if (!project) throw new Error("Projeto não encontrado.");
      return project;
    });
  });

export const deleteProject = createServerFn({ method: "POST" })
  .validator(projectCompanyIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const projectService = await import("@/domains/projects/service.server");
      const removed = await projectService.deleteProject(data.id, data.companyId);
      if (!removed) throw new Error("Projeto não encontrado.");
      return { ok: true };
    });
  });

export const addChecklistItem = createServerFn({ method: "POST" })
  .validator(createChecklistItemSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const projectService = await import("@/domains/projects/service.server");
      return projectService.addChecklistItem(data.projectId, data.companyId, data.text);
    });
  });

export const updateChecklistItem = createServerFn({ method: "POST" })
  .validator(updateChecklistItemSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const projectService = await import("@/domains/projects/service.server");
      const { id, projectId, companyId, ...patch } = data;
      const item = await projectService.updateChecklistItem(id, projectId, companyId, patch);
      if (!item) throw new Error("Item não encontrado.");
      return item;
    });
  });

export const deleteChecklistItem = createServerFn({ method: "POST" })
  .validator(deleteChecklistItemSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const projectService = await import("@/domains/projects/service.server");
      const removed = await projectService.deleteChecklistItem(
        data.id,
        data.projectId,
        data.companyId,
      );
      if (!removed) throw new Error("Item não encontrado.");
      return { ok: true };
    });
  });

export const addProjectComment = createServerFn({ method: "POST" })
  .validator(createCommentSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const projectService = await import("@/domains/projects/service.server");
      return projectService.addComment(data.projectId, data.companyId, data.body, author);
    });
  });

export const deleteProjectComment = createServerFn({ method: "POST" })
  .validator(deleteCommentSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const projectService = await import("@/domains/projects/service.server");
      const removed = await projectService.deleteComment(
        data.id,
        data.projectId,
        data.companyId,
      );
      if (!removed) throw new Error("Comentário não encontrado.");
      return { ok: true };
    });
  });

export const getProjectDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const projectService = await import("@/domains/projects/service.server");
    return projectService.getProjectDashboardStats();
  });
});
