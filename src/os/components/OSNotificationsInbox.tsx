import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { OSDashboardNotification } from "@/os/dashboard-notifications";
import { parseNotificationHref } from "@/os/inbox/notification-href";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useState } from "react";

export function OSNotificationsInbox({
  notifications,
  loading = false,
  onMarkRead,
  emptyHint = "Leads, projetos atrasados e cobranças aparecem aqui.",
  triggerClassName,
}: {
  notifications: OSDashboardNotification[];
  loading?: boolean;
  onMarkRead?: (id: string, persisted: boolean) => void | Promise<void>;
  emptyHint?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const notificationCount = notifications.length;

  const handleItemClick = (item: OSDashboardNotification) => {
    setOpen(false);
    if (item.persisted && onMarkRead) {
      void onMarkRead(item.id, true);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "dashboard-control relative flex h-10 w-10 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50",
            triggerClassName,
          )}
          aria-label="Notificações"
          disabled={loading}
        >
          <Bell className="h-4 w-4" />
          {!loading && notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-brand-foreground">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border/40 px-4 py-3">
          <p className="text-sm font-semibold">Notificações</p>
          <p className="text-xs text-muted-foreground">
            {loading
              ? "Carregando..."
              : notificationCount > 0
                ? `${notificationCount} item(ns) precisam de atenção`
                : "Nada pendente no momento"}
          </p>
        </div>
        {loading ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">Carregando alertas...</p>
        ) : notificationCount === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">{emptyHint}</p>
        ) : (
          <ul className="max-h-72 divide-y divide-border/40 overflow-y-auto">
            {notifications.map((item) => {
              const { to, search } = parseNotificationHref(item.href);
              return (
                <li key={item.id}>
                  <Link
                    to={to}
                    search={search}
                    className="block px-4 py-3 transition-colors hover:bg-surface-elevated/40"
                    onClick={() => handleItemClick(item)}
                  >
                    <p
                      className={cn(
                        "text-sm font-medium leading-snug",
                        item.tone === "danger" && "text-red-400",
                        item.tone === "warning" && "text-amber-400",
                      )}
                    >
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.subtitle}</p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
