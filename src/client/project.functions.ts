import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const listClientProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { requireClientAuth } = await import("@/lib/client-auth/session.server");
  const { listClientProjects: list } = await import("@/domains/client-portal/projects.service.server");
  const user = await requireClientAuth();
  return list(user.companyId);
});

export const getClientProject = createServerFn({ method: "GET" })
  .validator(z.object({ projectId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { requireClientAuth } = await import("@/lib/client-auth/session.server");
    const { getClientProjectDetail } = await import(
      "@/domains/client-portal/projects.service.server"
    );
    const user = await requireClientAuth();
    return getClientProjectDetail(user.companyId, data.projectId);
  });
