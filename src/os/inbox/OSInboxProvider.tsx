import type { TeamMember } from "@/lib/auth/types";
import type { OSNotification } from "@/domains/events/types";
import {
  getOSInboxNotifications,
  markOSInboxNotificationRead,
} from "@/domains/events/notifications.functions";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface OSInboxContextValue {
  inbox: OSNotification[];
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
  markRead: (notificationId: string) => Promise<void>;
}

const OSInboxContext = createContext<OSInboxContextValue | null>(null);

export function OSInboxProvider({
  activePerson,
  children,
}: {
  activePerson: TeamMember | null;
  children: ReactNode;
}) {
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

  const markRead = useCallback(
    async (notificationId: string) => {
      setInbox((prev) => prev.filter((item) => item.id !== notificationId));
      try {
        const result = await markOSInboxNotificationRead({ data: { notificationId } });
        if (!result.ok) {
          await reload();
        }
      } catch {
        await reload();
      }
    },
    [reload],
  );

  const value = useMemo(
    () => ({ inbox, loading, error, reload, markRead }),
    [inbox, loading, error, reload, markRead],
  );

  return <OSInboxContext.Provider value={value}>{children}</OSInboxContext.Provider>;
}

export function useOSInbox(): OSInboxContextValue {
  const context = useContext(OSInboxContext);
  if (!context) {
    throw new Error("useOSInbox must be used within OSInboxProvider");
  }
  return context;
}
