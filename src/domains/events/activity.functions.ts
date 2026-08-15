import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import type { ActivityFeedWindow } from "@/domains/events/activity-feed";
import { z } from "zod";

const activityFeedSchema = z
  .object({
    window: z.enum(["24h", "7d"]).optional(),
  })
  .optional();

export const getOSActivityFeed = createServerFn({ method: "GET" })
  .validator(activityFeedSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const window = (data?.window ?? "24h") as ActivityFeedWindow;
      const service = await import("@/domains/events/activity-feed.service.server");
      return service.getActivityFeed(window);
    });
  });
