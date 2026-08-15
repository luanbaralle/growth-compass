import { createServerFn } from "@tanstack/react-start";

export const getClientResultsOverview = createServerFn({ method: "GET" }).handler(async () => {
  const { requireClientAuth } = await import("@/lib/client-auth/session.server");
  const { getClientResultsOverview: load } = await import(
    "@/domains/client-portal/results.service.server"
  );
  const user = await requireClientAuth();
  return load(user.companyId);
});
