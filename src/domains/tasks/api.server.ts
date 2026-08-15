import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import { completeTaskSchema, createTaskSchema } from "./schema";

export const getMyAgenda = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async (person) => {
    if (!person) {
      return {
        pending: { overdue: [], today: [], upcoming: [], no_date: [] },
        done: [],
        summary: { overdue: 0, today: 0, upcoming: 0, noDate: 0, done: 0 },
      };
    }
    const service = await import("@/domains/tasks/service.server");
    return service.getMyAgenda(person);
  });
});

export const createTask = createServerFn({ method: "POST" })
  .validator(createTaskSchema)
  .handler(async ({ data }) => {
    return withAuth(async (person) => {
      if (!person) throw new Error("Não autenticado.");
      const service = await import("@/domains/tasks/service.server");
      const task = await service.createManualTask(person, {
        title: data.title,
        dueDate: data.dueDate || undefined,
        companyId: data.companyId,
        projectId: data.projectId,
      });
      return { task };
    });
  });

export const setTaskDone = createServerFn({ method: "POST" })
  .validator(completeTaskSchema)
  .handler(async ({ data }) => {
    return withAuth(async (person) => {
      if (!person) throw new Error("Não autenticado.");
      const service = await import("@/domains/tasks/service.server");
      const task = await service.setTaskDone(person, data.id, data.done);
      return { task };
    });
  });
