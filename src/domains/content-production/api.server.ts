import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  addContentTaskNoteSchema,
  createContentTaskSchema,
  deleteContentTaskSchema,
  listContentTasksSchema,
  moveContentTaskSchema,
  contentTaskIdSchema,
  updateContentTaskSchema,
} from "@/domains/content-production/schema";

export const listContentTasks = createServerFn({ method: "GET" })
  .validator(listContentTasksSchema.optional())
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/content-production/service.server");
      return service.listContentTasks(data ?? {});
    });
  });

export const getContentTask = createServerFn({ method: "GET" })
  .validator(contentTaskIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/content-production/service.server");
      const result = await service.getContentTask(data.id);
      if (!result) throw new Error("Tarefa não encontrada.");
      return result;
    });
  });

export const createContentTask = createServerFn({ method: "POST" })
  .validator(createContentTaskSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/content-production/service.server");
      return service.createContentTask(
        {
          companyId: data.companyId,
          title: data.title,
          status: data.status,
          channels: data.channels,
          themeObjective: data.themeObjective,
          contentType: data.contentType,
          postDate: data.postDate || undefined,
          productionOwnerId: data.productionOwnerId,
          notes: data.notes,
        },
        author,
      );
    });
  });

export const updateContentTask = createServerFn({ method: "POST" })
  .validator(updateContentTaskSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/content-production/service.server");
      const { id, ...patch } = data;
      const task = await service.updateContentTask(id, patch, author);
      if (!task) throw new Error("Tarefa não encontrada.");
      return task;
    });
  });

export const moveContentTask = createServerFn({ method: "POST" })
  .validator(moveContentTaskSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/content-production/service.server");
      const task = await service.moveContentTask(data.id, data.status, author);
      if (!task) throw new Error("Tarefa não encontrada.");
      return task;
    });
  });

export const deleteContentTask = createServerFn({ method: "POST" })
  .validator(deleteContentTaskSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/content-production/service.server");
      const removed = await service.deleteContentTask(data.id, data.companyId);
      if (!removed) throw new Error("Tarefa não encontrada.");
      return { ok: true };
    });
  });

export const listContentTaskEvents = createServerFn({ method: "GET" })
  .validator(contentTaskIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/content-production/service.server");
      const result = await service.listContentTaskEvents(data.id);
      if (!result) throw new Error("Tarefa não encontrada.");
      return result;
    });
  });

export const addContentTaskNote = createServerFn({ method: "POST" })
  .validator(addContentTaskNoteSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/content-production/service.server");
      const event = await service.addContentTaskNote(data.taskId, data.body, author);
      if (!event) throw new Error("Tarefa não encontrada.");
      return event;
    });
  });
