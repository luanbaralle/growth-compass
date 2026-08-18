import { useOSContext } from "@/os/shell/use-os-context";
import { OSLogo } from "@/os/shell/OSLogo";
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
  LayoutDashboard,
  LogOut,
  Megaphone,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/os", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/os/atividade", label: "Atividade", icon: Activity },
  { to: "/os/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/os/prospeccao", label: "Prospecção", icon: Target },
  { to: "/os/copilot", label: "Copilot", icon: Sparkles },
  { to: "/os/empresas", label: "Empresas", icon: Building2 },
  { to: "/os/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/os/producao", label: "Produção", icon: Clapperboard },
  { to: "/os/marketing", label: "Marketing", icon: Megaphone },
  { to: "/os/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/os/configuracoes", label: "Configurações", icon: Settings },
] as const;

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

  return (
    <OSInboxProvider activePerson={activePerson}>
      <OSShellLayout
        activePerson={activePerson}
        switchPerson={switchPerson}
        onLogout={handleLogout}
        location={location}
        navigate={navigate}
      />
    </OSInboxProvider>
  );
}

function OSShellLayout({
  activePerson,
  switchPerson,
  onLogout,
  location,
  navigate,
}: {
  activePerson: TeamMember | null;
  switchPerson: (person: TeamMember, pin?: string) => Promise<void>;
  onLogout: () => Promise<void>;
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { inbox, loading: inboxLoading, markRead } = useOSInbox();
  const shellNotifications = inbox.map(persistedNotificationToDashboard);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
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
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
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

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border/60 bg-surface/20 px-4 py-3 backdrop-blur-sm md:hidden">
          <div className="min-w-0 flex-1">
            <OSLogo variant="mobile" />
            {activePerson && (
              <p className="truncate text-xs text-muted-foreground">
                {TEAM_LABELS[activePerson]}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <OSSearchTrigger compact className="md:hidden" />
            {activePerson && (
              <OSNotificationsInbox
                notifications={shellNotifications}
                loading={inboxLoading}
                onMarkRead={(id) => void markRead(id)}
                emptyHint="Alertas de produção e operação aparecem aqui."
                triggerClassName="h-9 w-9"
              />
            )}
            <Select
            value={location.pathname}
            onValueChange={(v) => navigate({ to: v })}
          >
            <SelectTrigger className="h-8 w-[160px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NAV_ITEMS.map((item) => (
                <SelectItem key={item.to} value={item.to}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
        </header>
        <main className="dashboard-page-bg flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl animate-fade-up p-4 sm:p-6 lg:p-8">
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
          <SelectTrigger className="h-8 w-full text-xs">
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
