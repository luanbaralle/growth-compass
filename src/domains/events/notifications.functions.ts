import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import { z } from "zod";

export const getOSInboxNotifications = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async (person) => {
    if (!person) return [];
    const service = await import("@/domains/events/notifications.service.server");
    return service.listInboxNotifications(person);
  });
});

export const markOSInboxNotificationRead = createServerFn({ method: "POST" })
  .validator(z.object({ notificationId: z.string().uuid() }))
  .handler(async ({ data }) => {
    return withAuth(async (person) => {
      if (!person) return { ok: false as const };
      const service = await import("@/domains/events/notifications.service.server");
      const notification = await service.markInboxNotificationRead(data.notificationId, person);
      return { ok: !!notification };
    });
  });
