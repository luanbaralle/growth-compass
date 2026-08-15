import { createServerFn } from "@tanstack/react-start";

export const getClientHomeSummary = createServerFn({ method: "GET" }).handler(async () => {
  const { requireClientAuth } = await import("@/lib/client-auth/session.server");
  const { buildClientHomeSummary } = await import("@/domains/client-portal/home.service.server");
  const user = await requireClientAuth();
  return buildClientHomeSummary(user.companyId, user.name);
});
