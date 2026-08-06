import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";

export const getOSDashboard = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const dashboardService = await import("@/os/dashboard.service.server");
    return dashboardService.getOSDashboardData();
  });
});
