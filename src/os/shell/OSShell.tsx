import { useOSContext } from "@/os/shell/use-os-context";
import { OSLogo } from "@/os/shell/OSLogo";
import { OSMeetingModeProvider, useOSMeetingMode } from "@/os/shell/OSMeetingMode";
import { OSGlobalSearch, OSSearchTrigger } from "@/os/components/OSGlobalSearch";
import { OSNotificationsInbox } from "@/os/components/OSNotificationsInbox";
import { persistedNotificationToDashboard } from "@/os/dashboard-notifications";
import { OSInboxProvider, useOSInbox } from "@/os/inbox/OSInboxProvider";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Building2,
  CalendarDays,
  Clapperboard,
  FolderKanban,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";

const NAV_ITEMS = [
  { to: "/os", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/os/atividade", label: "Atividade", icon: Activity },
  { to: "/os/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/os/prospeccao", label: "Prospecção", icon: Target },
  { to: "/os/copilot", label: "Copilot", icon: Sparkles },
  { to: "/os/propostas", label: "Propostas", icon: FileText },
  { to: "/os/empresas", label: "Empresas", icon: Building2 },
  { to: "/os/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/os/producao", label: "Produção", icon: Clapperboard },
  { to: "/os/marketing", label: "Marketing", icon: Megaphone },
  { to: "/os/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/os/configuracoes", label: "Configurações", icon: Settings },
] as const;

function isNavActive(pathname: string, item: (typeof NAV_ITEMS)[number]): boolean {
  if (item.exact) return pathname === item.to;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

function resolveActiveNavLabel(pathname: string): string {
  const match = NAV_ITEMS.find((item) => isNavActive(pathname, item));
  return match?.label ?? "OS";
}

export function OSShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activePerson, switchPerson, logout } = useOSContext();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/os/login" });
  };

  if (location.pathname === "/os/login") {
    return <Outlet />;
  }

  const isProposalPresentation = /^\/os\/propostas\/[^/]+\/apresentacao\/?$/.test(location.pathname);
  if (isProposalPresentation) {
    return (
      <>
        <Outlet />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  return (
    <OSInboxProvider activePerson={activePerson}>
      <OSMeetingModeProvider>
        <OSShellLayout
          activePerson={activePerson}
          switchPerson={switchPerson}
          onLogout={handleLogout}
          location={location}
        />
      </OSMeetingModeProvider>
    </OSInboxProvider>
  );
}

function OSShellLayout({
  activePerson,
  switchPerson,
  onLogout,
  location,
}: {
  activePerson: TeamMember | null;
  switchPerson: (person: TeamMember, pin?: string) => Promise<void>;
  onLogout: () => Promise<void>;
  location: ReturnType<typeof useLocation>;
}) {
  const { inbox, loading: inboxLoading, markRead } = useOSInbox();
  const { meetingMode } = useOSMeetingMode();
  const [navOpen, setNavOpen] = useState(false);
  const shellNotifications = inbox.map(persistedNotificationToDashboard);
  const activeNavLabel = useMemo(
    () => resolveActiveNavLabel(location.pathname),
    [location.pathname],
  );

  return (
    <div
      className={cn(
        "flex bg-background text-foreground",
        meetingMode
          ? "h-dvh max-h-dvh overflow-hidden md:h-auto md:max-h-none md:min-h-dvh md:overflow-visible"
          : "min-h-dvh",
      )}
    >
      <aside className="admin-sidebar hidden w-56 shrink-0 flex-col border-r border-border/60 md:flex">
        <div className="border-b border-border/60 px-4 py-4">
          <div className="flex items-start justify-between gap-2">
            <OSLogo variant="sidebar" />
            {activePerson && (
              <OSNotificationsInbox
                notifications={shellNotifications}
                loading={inboxLoading}
                onMarkRead={(id) => void markRead(id)}
                emptyHint="Alertas de produção e operação aparecem aqui."
                triggerClassName="h-9 w-9"
              />
            )}
          </div>
          {activePerson && (
            <div className="mt-4 space-y-3">
              <OSSearchTrigger />
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                  Você
                </p>
                <div className="mb-3 flex items-center gap-3 rounded-xl border border-border/30 bg-surface/30 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                    {TEAM_LABELS[activePerson].charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{TEAM_LABELS[activePerson]}</p>
                    <p className="text-[11px] text-muted-foreground">Administrador</p>
                  </div>
                </div>
                <PersonSwitcher activePerson={activePerson} onSwitch={switchPerson} />
              </div>
            </div>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(location.pathname, item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                  active
                    ? "admin-nav-active font-medium"
                    : "text-muted-foreground transition-all duration-200 hover:bg-surface-elevated/60 hover:text-foreground hover:shadow-[inset_0_0_0_1px_oklch(1_0_0/0.04)]",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-3">
          <button
            type="button"
            onClick={() => void onLogout()}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header
          className={cn(
            "items-center justify-between border-b border-border/60 bg-surface/20 px-3 py-2.5 backdrop-blur-sm md:hidden",
            meetingMode ? "hidden" : "flex",
          )}
        >
          <div className="min-w-0 flex-1">
            <OSLogo variant="mobile" />
            {activePerson && (
              <p className="truncate text-xs text-muted-foreground">
                {TEAM_LABELS[activePerson]} · {activeNavLabel}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <OSSearchTrigger compact className="md:hidden" />
            {activePerson && (
              <OSNotificationsInbox
                notifications={shellNotifications}
                loading={inboxLoading}
                onMarkRead={(id) => void markRead(id)}
                emptyHint="Alertas de produção e operação aparecem aqui."
                triggerClassName="h-10 w-10"
              />
            )}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => setNavOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent side="left" className="flex w-[min(100vw,20rem)] flex-col gap-0 p-0">
            <SheetHeader className="border-b border-border/60 px-4 py-4 text-left">
              <SheetTitle className="sr-only">Navegação</SheetTitle>
              <SheetDescription className="sr-only">
                Menu principal do Raise One OS
              </SheetDescription>
              <OSLogo variant="mobile" />
              {activePerson && (
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-surface/30 p-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                      {TEAM_LABELS[activePerson].charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {TEAM_LABELS[activePerson]}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Administrador</p>
                    </div>
                  </div>
                  <PersonSwitcher activePerson={activePerson} onSwitch={switchPerson} />
                </div>
              )}
            </SheetHeader>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {NAV_ITEMS.map((item) => {
                const active = isNavActive(location.pathname, item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setNavOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "admin-nav-active font-medium"
                        : "text-muted-foreground hover:bg-surface-elevated/60 hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border/60 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => {
                  setNavOpen(false);
                  void onLogout();
                }}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <main
          className={cn(
            "dashboard-page-bg min-h-0 flex-1",
            meetingMode ? "overflow-hidden md:overflow-auto" : "overflow-auto",
          )}
        >
          <div
            className={cn(
              meetingMode
                ? "flex h-full min-h-0 flex-col p-0 md:mx-auto md:h-auto md:max-w-7xl md:animate-fade-up md:p-6 lg:p-8"
                : "mx-auto max-w-7xl animate-fade-up p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6 lg:p-8",
            )}
          >
            <Outlet />
          </div>
        </main>
      </div>
      <OSGlobalSearch />
      <Toaster richColors position="top-right" />
    </div>
  );
}

function PersonSwitcher({
  activePerson,
  onSwitch,
}: {
  activePerson: TeamMember;
  onSwitch: (person: TeamMember, pin?: string) => Promise<void>;
}) {
  const [pendingPerson, setPendingPerson] = useState<TeamMember | null>(null);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelect = (value: string) => {
    if (value === activePerson) return;
    setPendingPerson(value as TeamMember);
    setPin("");
  };

  const handleConfirm = async () => {
    if (!pendingPerson) return;
    setLoading(true);
    try {
      await onSwitch(pendingPerson, pin || undefined);
      setPendingPerson(null);
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-1.5">
        <Select value={activePerson} onValueChange={handleSelect}>
          <SelectTrigger className="h-10 w-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(TEAM_LABELS) as TeamMember[]).map((m) => (
              <SelectItem key={m} value={m}>
                {TEAM_LABELS[m]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Dialog open={!!pendingPerson} onOpenChange={(open) => !open && setPendingPerson(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Trocar para {pendingPerson ? TEAM_LABELS[pendingPerson] : ""}
            </DialogTitle>
            <DialogDescription>
              Digite o PIN pessoal se estiver configurado no servidor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="pin-switch">PIN (opcional)</Label>
            <Input
              id="pin-switch"
              type="password"
              inputMode="numeric"
              placeholder="Deixe vazio se não configurado"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void handleConfirm()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingPerson(null)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleConfirm()} disabled={loading}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
