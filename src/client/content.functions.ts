import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const listClientContent = createServerFn({ method: "GET" }).handler(async () => {
  const { requireClientAuth } = await import("@/lib/client-auth/session.server");
  const { listClientContentTasks } = await import("@/domains/client-portal/content.service.server");
  const user = await requireClientAuth();
  return listClientContentTasks(user.companyId);
});

export const getClientContent = createServerFn({ method: "GET" })
  .validator(z.object({ taskId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { requireClientAuth } = await import("@/lib/client-auth/session.server");
    const { getClientContentDetail } = await import("@/domains/client-portal/content.service.server");
    const user = await requireClientAuth();
    return getClientContentDetail(user.companyId, data.taskId, user.companyName);
  });

export const approveClientContent = createServerFn({ method: "POST" })
  .validator(z.object({ taskId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { requireClientAuth } = await import("@/lib/client-auth/session.server");
    const { approveClientContentTask } = await import(
      "@/domains/client-portal/content.service.server"
    );
    const user = await requireClientAuth();
    return approveClientContentTask(user.companyId, data.taskId, user.name);
  });

export const requestClientContentRevision = createServerFn({ method: "POST" })
  .validator(
    z.object({
      taskId: z.string().uuid(),
      message: z.string().min(3).max(2000),
    }),
  )
  .handler(async ({ data }) => {
    const { requireClientAuth } = await import("@/lib/client-auth/session.server");
    const { requestClientContentRevision: requestRevision } = await import(
      "@/domains/client-portal/content.service.server"
    );
    const user = await requireClientAuth();
    return requestRevision(user.companyId, data.taskId, data.message, user.name);
  });
