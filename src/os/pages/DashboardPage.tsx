import { getOSConfigStatus } from "@/lib/api/auth.functions";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { TEAM_LABELS } from "@/lib/auth/types";
import {
  Building2,
  DashboardEmptyState,
  DashboardFinanceHighlight,
  DashboardHero,
  DashboardKpiCard,
  DashboardMarketingChart,
  DashboardPanel,
  DashboardPipeline,
  DashboardQuickAccess,
  DashboardSuccessState,
  DashboardTopBar,
  FolderKanban,
  formatFinanceMoney,
  Megaphone,
  Target,
  UserPlus,
  Users,
  Wallet,
} from "@/os/components/dashboard";
import { getOSDashboard } from "@/os/dashboard.functions";
import type { OSDashboardData } from "@/os/dashboard.service.server";
import { useOSContext } from "@/os/shell/use-os-context";
import { EmptyState } from "@/os/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { activePerson } = useOSContext();
  const [data, setData] = useState<OSDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [setup, setSetup] = useState<{ supabaseConfigured: boolean; supabaseHost: string | null } | null>(
    null,
  );

  useEffect(() => {
    getOSConfigStatus()
      .then(setSetup)
      .catch(() => setSetup({ supabaseConfigured: false, supabaseHost: null }));

    getOSDashboard()
      .then(setData)
      .catch((err) => {
        if (isUnauthorizedError(err)) {
          navigate({ to: "/os/login" });
          return;
        }
        setError(getErrorMessage(err, "Erro ao carregar dashboard."));
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const userName = activePerson ? TEAM_LABELS[activePerson] : "Operador";

  const totalCompanies = useMemo(() => {
    if (!data) return 0;
    return Object.values(data.companies.pipeline).reduce((sum, count) => sum + count, 0);
  }, [data]);

  const totalProjects = useMemo(() => {
    if (!data) return 0;
    return data.projects.inProgress + data.projects.overdue;
  }, [data]);

  const quickAccessItems = [
    {
      title: "Empresas",
      description: `${loading ? "—" : totalCompanies} registros`,
      href: "/os/empresas",
      icon: Building2,
      accent: "brand" as const,
    },
    {
      title: "Projetos",
      description: `${loading ? "—" : totalProjects} projetos`,
      href: "/os/projetos",
      icon: FolderKanban,
      accent: "warning" as const,
    },
    {
      title: "Financeiro",
      description: `${loading ? "—" : formatFinanceMoney(data?.finance.paidThisMonthCents ?? 0)} recebidos`,
      href: "/os/financeiro",
      icon: Wallet,
      accent: "success" as const,
    },
    {
      title: "Marketing",
      description: `${loading ? "—" : data?.marketing.snapshotCount ?? 0} campanhas ativas`,
      href: "/os/marketing",
      icon: Megaphone,
      accent: "info" as const,
    },
    {
      title: "Prospecção",
      description: `${loading ? "—" : data?.prospection.prospected ?? 0} leads novos`,
      href: "/os/prospeccao",
      icon: Target,
      accent: "purple" as const,
    },
    {
      title: "Leads hoje",
      description: `${loading ? "—" : data?.companies.leadsToday ?? 0} leads`,
      href: "/os/empresas",
      icon: Users,
      accent: "brand" as const,
    },
    {
      title: "Conversões",
      description: `${loading ? "—" : data?.marketing.conversions ?? 0} conversões`,
      href: "/os/marketing",
      icon: Target,
      accent: "success" as const,
    },
  ];

  return (
    <div className="dashboard-page space-y-10 pb-6">
      <DashboardTopBar
        activePerson={activePerson}
        supabaseConnected={setup?.supabaseConfigured ?? false}
      />

      {setup && !setup.supabaseConfigured && (
        <EmptyState
          title="Supabase não configurado"
          description="Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env e execute as migrations."
        />
      )}

      {error && <EmptyState title="Não foi possível carregar o dashboard" description={error} />}

      {!error && (
        <>
          <DashboardHero userName={userName} />

          {/* KPIs principais */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardKpiCard
              label="Leads hoje"
              value={loading ? "—" : String(data?.companies.leadsToday ?? 0)}
              sub="Novas empresas hoje"
              icon={Users}
              accent="brand"
              size="lg"
              sparkSeed={1}
            />
            <DashboardKpiCard
              label="Clientes ativos"
              value={loading ? "—" : String(data?.companies.activeClients ?? 0)}
              sub="Estágio: Cliente ativo"
              icon={Users}
              accent="success"
              subTone="success"
              size="lg"
              sparkSeed={2}
            />
            <DashboardKpiCard
              label="Projetos"
              value={loading ? "—" : String(totalProjects)}
              sub={`${data?.projects.inProgress ?? 0} em andamento`}
              icon={FolderKanban}
              accent="warning"
              subTone="warning"
              size="lg"
              sparkSeed={3}
            />
            <DashboardKpiCard
              label="Recebimentos no mês"
              value={loading ? "—" : formatFinanceMoney(data?.finance.paidThisMonthCents ?? 0)}
              sub="0% vs mês anterior"
              icon={Wallet}
              accent="gold"
              size="lg"
              sparkSeed={4}
            />
          </section>

          {/* KPIs secundários */}
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardKpiCard
              label="Taxa de conversão"
              value={loading ? "—" : `${data?.prospection.conversionRate ?? 0}%`}
              sub={`${data?.prospection.clients ?? 0} clientes`}
              icon={Target}
              accent="purple"
              size="sm"
              sparkSeed={5}
            />
            <DashboardKpiCard
              label="Investimento (marketing)"
              value={loading ? "—" : formatFinanceMoney(data?.marketing.investmentCents ?? 0)}
              sub={`${data?.marketing.leads ?? 0} leads`}
              icon={Megaphone}
              accent="brand"
              size="sm"
              sparkSeed={6}
            />
            <DashboardKpiCard
              label="Mensagens enviadas"
              value={loading ? "—" : String(data?.prospection.messagesSent ?? 0)}
              sub="Registradas no pipeline"
              icon={Target}
              accent="info"
              size="sm"
              sparkSeed={7}
            />
            <DashboardKpiCard
              label="Projetos atrasados"
              value={loading ? "—" : String(data?.projects.overdue ?? 0)}
              sub={(data?.projects.overdue ?? 0) > 0 ? "Precisam de atenção" : "Tudo em dia"}
              icon={FolderKanban}
              accent={(data?.projects.overdue ?? 0) > 0 ? "danger" : "success"}
              size="sm"
              sparkSeed={8}
              showSparkline={(data?.projects.overdue ?? 0) > 0}
              trailing={
                !loading && (data?.projects.overdue ?? 0) === 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400/80" strokeWidth={1.75} />
                ) : undefined
              }
            />
          </section>

          {/* Pipeline comercial */}
          {!loading && data && <DashboardPipeline pipeline={data.companies.pipeline} />}

          {/* O que precisa de atenção hoje */}
          <div className="grid gap-5 lg:grid-cols-2">
            <DashboardPanel
              title="Leads recentes"
              description="Aguardando contato"
              action={{ label: "Ver todos →", href: "/os/empresas" }}
            >
              {loading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : (data?.companies.recentLeads.length ?? 0) === 0 ? (
                <DashboardEmptyState
                  icon={UserPlus}
                  title="Nenhum lead aguardando contato."
                  description="Quando novos leads chegarem, eles aparecerão aqui automaticamente."
                />
              ) : (
                <ul className="divide-y divide-border/40">
                  {data?.companies.recentLeads.map((lead) => (
                    <li key={lead.id}>
                      <Link
                        to="/os/empresas/$id"
                        params={{ id: lead.id }}
                        className="flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-brand"
                      >
                        <span className="font-medium">{lead.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {lead.city ?? formatDate(lead.created_at)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardPanel>

            <DashboardPanel
              title="Projetos atrasados"
              action={{ label: "Ver todos →", href: "/os/projetos" }}
            >
              {loading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : (data?.projects.overdueItems.length ?? 0) === 0 ? (
                <DashboardSuccessState
                  title="Tudo em dia!"
                  subtitle="Nenhum projeto atrasado."
                />
              ) : (
                <ul className="divide-y divide-border/40">
                  {data?.projects.overdueItems.map((project) => (
                    <li key={project.id}>
                      <Link
                        to="/os/projetos/$id"
                        params={{ id: project.id }}
                        className="block py-3 text-sm transition-colors hover:text-brand"
                      >
                        <p className="font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.companyName ?? "—"}
                          {project.due_date &&
                            ` · venc. ${project.due_date.split("-").reverse().join("/")}`}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardPanel>
          </div>

          {/* Financeiro & Marketing */}
          <div className="grid gap-5 lg:grid-cols-3">
            <DashboardFinanceHighlight
              label="Cobranças atrasadas"
              value={loading ? "—" : formatFinanceMoney(data?.finance.overdueCents ?? 0)}
              icon={Wallet}
              href="/os/financeiro"
              actionLabel="Ver cobranças"
            />
            <DashboardMarketingChart hasData={(data?.marketing.snapshotCount ?? 0) > 0} />
            <DashboardFinanceHighlight
              label="Recebido no mês"
              value={loading ? "—" : formatFinanceMoney(data?.finance.paidThisMonthCents ?? 0)}
              icon={Building2}
              href="/os/financeiro"
              actionLabel="Ver financeiro"
            />
          </div>

          {/* Próximas ações de prospecção (se houver) */}
          {(data?.prospection.upcomingActions.length ?? 0) > 0 && (
            <DashboardPanel
              title="Próximas ações — Prospecção"
              action={{ label: "Ver pipeline →", href: "/os/prospeccao" }}
            >
              <ul className="divide-y divide-border/40">
                {data?.prospection.upcomingActions.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/os/prospeccao/$id"
                      params={{ id: p.id }}
                      className="block py-3 text-sm transition-colors hover:text-brand"
                    >
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.next_action ?? "—"} · {p.next_action_date ?? "sem data"}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </DashboardPanel>
          )}

          {/* Acesso rápido */}
          <DashboardQuickAccess items={quickAccessItems} />
        </>
      )}
    </div>
  );
}
