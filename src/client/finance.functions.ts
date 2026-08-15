import { createServerFn } from "@tanstack/react-start";

export const getClientFinanceOverview = createServerFn({ method: "GET" }).handler(async () => {
  const { requireClientAuth } = await import("@/lib/client-auth/session.server");
  const { getClientFinanceOverview: load } = await import(
    "@/domains/client-portal/finance.service.server"
  );
  const user = await requireClientAuth();
  return load(user.companyId);
});
