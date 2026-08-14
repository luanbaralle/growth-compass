import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import type { TeamMember } from "@/lib/auth/types";
import type { OSNotification } from "@/domains/events/types";
import {
  getOSInboxNotifications,
  markOSInboxNotificationRead,
} from "@/domains/events/notifications.functions";
import { useCallback, useEffect, useState } from "react";

export function useOSInbox(activePerson: TeamMember | null) {
  const [inbox, setInbox] = useState<OSNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!activePerson) {
      setInbox([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const items = await getOSInboxNotifications();
      setInbox(items);
    } catch (err) {
      if (!isUnauthorizedError(err)) {
        setError(getErrorMessage(err, "Erro ao carregar notificações."));
      }
      setInbox([]);
    } finally {
      setLoading(false);
    }
  }, [activePerson]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const markRead = useCallback(async (notificationId: string) => {
    try {
      await markOSInboxNotificationRead({ data: { notificationId } });
      setInbox((prev) => prev.filter((item) => item.id !== notificationId));
    } catch {
      // Mantém item visível se falhar — usuário pode tentar de novo
    }
  }, []);

  return { inbox, loading, error, reload, markRead };
}
