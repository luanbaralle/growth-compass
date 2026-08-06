import { useOSContext } from "@/os/shell/use-os-context";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Settings,
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
  { to: "/os/empresas", label: "Empresas", icon: Building2 },
  { to: "/os/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/os/marketing", label: "Marketing", icon: Megaphone },
  { to: "/os/financeiro", label: "Financeiro", icon: Wallet },
  { to: "/os/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function OSShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activePerson, switchPerson, logout } = useOSContext();

  if (location.pathname === "/os/login") {
    return <Outlet />;
  }

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/os/login" });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="admin-sidebar hidden w-56 shrink-0 flex-col border-r border-border/60 md:flex">
        <div className="border-b border-border/60 px-5 py-5">
          <p className="font-display text-base font-bold tracking-tight">Raise One</p>
          <p className="text-xs text-muted-foreground">OS v2</p>
          {activePerson && (
            <div className="mt-4">
              <PersonSwitcher activePerson={activePerson} onSwitch={switchPerson} />
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
                    : "text-muted-foreground hover:bg-surface-elevated/60 hover:text-foreground",
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
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border/60 bg-surface/20 px-4 py-3 backdrop-blur-sm md:hidden">
          <div className="min-w-0">
            <p className="text-sm font-bold">Raise One OS</p>
            {activePerson && (
              <p className="truncate text-xs text-muted-foreground">
                {TEAM_LABELS[activePerson]}
              </p>
            )}
          </div>
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
        </header>
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl animate-fade-up p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
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
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Você
        </p>
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
