import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  DEFAULT_DASHBOARD_DATE_FILTER,
  getDashboardDateFilterBounds,
  type DashboardDateFilter,
  type DashboardDatePreset,
} from "@/os/dashboard-date";
import { z } from "zod";

const dateStrSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const dashboardFilterSchema = z
  .object({
    preset: z.enum(["today", "yesterday", "last7", "thisMonth"]).optional(),
    startDate: dateStrSchema.optional(),
    endDate: dateStrSchema.optional(),
  })
  .optional();

function parseDashboardDateFilter(data: z.infer<typeof dashboardFilterSchema>): DashboardDateFilter {
  if (!data) return DEFAULT_DASHBOARD_DATE_FILTER;

  if (data.startDate && data.endDate) {
    if (data.startDate === data.endDate) {
      return { kind: "day", date: data.startDate };
    }
    return { kind: "range", start: data.startDate, end: data.endDate };
  }

  if (data.preset) {
    return { kind: "preset", preset: data.preset };
  }

  return DEFAULT_DASHBOARD_DATE_FILTER;
}

export const getOSDashboard = createServerFn({ method: "GET" })
  .validator(dashboardFilterSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const filter = parseDashboardDateFilter(data);
      const dashboardService = await import("@/os/dashboard.service.server");
      return dashboardService.getOSDashboardData(filter);
    });
  });

export type { DashboardDateFilter, DashboardDatePreset };
