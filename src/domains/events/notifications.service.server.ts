import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import type { OSNotification } from "./types";

export async function listInboxNotifications(assigneeId: TeamMember): Promise<OSNotification[]> {
  return repo.findUnreadNotificationsForAssignee(assigneeId);
}

export async function markInboxNotificationRead(
  notificationId: string,
  assigneeId: TeamMember,
): Promise<OSNotification | null> {
  const existing = await repo.findNotificationById(notificationId);
  if (!existing || existing.assignee_id !== assigneeId) return null;
  return repo.markNotificationRead(notificationId, assigneeId);
}
