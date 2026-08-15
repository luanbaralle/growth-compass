import { useClientContext } from "@/client/shell/use-client-context";
import { Logo } from "@/components/landing/shared/Logo";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  Clapperboard,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Wallet,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const NAV_ITEMS = [
  { to: "/client", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/client/resultados", label: "Resultados", icon: BarChart3 },
  { to: "/client/conteudo", label: "Conteúdo", icon: Clapperboard },
  { to: "/client/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/client/financeiro", label: "Financeiro", icon: Wallet },
] as const;

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function ClientShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useClientContext();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/client/login" });
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="client-shell flex min-h-screen">
      <aside className="client-sidebar hidden md:flex">
        <div className="client-sidebar-brand">
          <Logo size="sidebar" />
          <div className="client-sidebar-tag">
            <span className="client-sidebar-tag-dot" />
            Portal do cliente
          </div>
        </div>

        <div className="client-company-card">
          <p className="client-company-label">Sua operação</p>
          <p className="client-company-name">{user.companyName}</p>
        </div>

        <nav className="client-nav" aria-label="Navegação principal">
          <ul className="client-nav-list">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.to, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn("client-nav-link", active && "client-nav-link-active")}
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.25 : 2} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="client-sidebar-footer">
          <div className="client-user-chip">
            <span className="client-user-avatar">{userInitials(user.name)}</span>
            <span className="client-user-name truncate">{user.name}</span>
          </div>
          <button type="button" onClick={handleLogout} className="client-logout-btn">
            <LogOut className="h-3.5 w-3.5" />
            Sair da conta
          </button>
        </div>
      </aside>

      <div className="client-main-wrap">
        <div className="client-mobile-top md:hidden">
          <Logo size="nav" />
          <button type="button" onClick={handleLogout} className="client-logout-btn mt-0 w-auto px-3">
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>

        <main className="client-main dashboard-page-bg">
          <div className="client-main-inner mx-auto max-w-5xl px-4 py-6 pb-28 md:pb-8 md:px-6">
            <Outlet />
          </div>
        </main>

        <nav className="client-mobile-nav md:hidden" aria-label="Navegação mobile">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn("client-mobile-nav-link", active && "client-mobile-nav-link-active")}
              >
                <Icon className="h-4 w-4" strokeWidth={active ? 2.25 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
