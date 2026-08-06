import { STAGE_LABELS, COMPANY_STAGES } from "@/domains/companies/types";
import { formatMoney as formatFinanceMoney } from "@/domains/finance/types";
import { CHANNEL_LABELS, formatPeriod, type MarketingChannel } from "@/domains/marketing/types";
import { getOSConfigStatus } from "@/lib/api/auth.server";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { getOSDashboard } from "@/os/dashboard.api.server";
import type { OSDashboardData } from "@/os/dashboard.service.server";
import {
  AlertBanner,
  EmptyState,
  ListItem,
  PageHeader,
  QuickLinkButton,
  QuickLinkCard,
  Section,
  StatCard,
} from "@/os/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  FolderKanban,
  LayoutDashboard,
  Megaphone,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function DashboardPage() {
  const navigate = useNavigate();
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

  const attentionCount =
    (data?.projects.overdue ?? 0) + (data?.finance.overdueCount ?? 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral da operação — empresas, projetos, financeiro e marketing"
        icon={LayoutDashboard}
      />

      {setup && !setup.supabaseConfigured && (
        <EmptyState
          title="Supabase não configurado"
          description="Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env e execute as migrations."
        />
      )}

      {setup?.supabaseHost && (
        <p className="text-xs text-muted-foreground">Banco conectado: {setup.supabaseHost}</p>
      )}

      {error && <EmptyState title="Não foi possível carregar o dashboard" description={error} />}

      {!error && attentionCount > 0 && data && (
        <AlertBanner
          variant="danger"
          title={`${attentionCount} item(ns) precisam de atenção`}
          description={`${data.projects.overdue} projeto(s) atrasado(s) e ${data.finance.overdueCount} cobrança(s) vencida(s).`}
        />
      )}

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Operação
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Leads hoje"
            value={loading ? "—" : String(data?.companies.leadsToday ?? 0)}
            sub="Novas empresas hoje"
            icon={Building2}
          />
          <StatCard
            label="Clientes ativos"
            value={loading ? "—" : String(data?.companies.activeClients ?? 0)}
            sub="Estágio: Cliente ativo"
            accent="success"
            icon={Users}
          />
          <StatCard
            label="Projetos em andamento"
            value={loading ? "—" : String(data?.projects.inProgress ?? 0)}
            sub="Pendentes, ativos, revisão ou bloqueados"
            accent="brand"
            icon={FolderKanban}
          />
          <StatCard
            label="Projetos atrasados"
            value={loading ? "—" : String(data?.projects.overdue ?? 0)}
            sub="Prazo vencido"
            accent={(data?.projects.overdue ?? 0) > 0 ? "danger" : "warning"}
            icon={AlertTriangle}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Financeiro & Marketing
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="A receber"
            value={loading ? "—" : formatFinanceMoney(data?.finance.pendingCents ?? 0)}
            sub="Cobranças pendentes"
            accent="warning"
            icon={Wallet}
          />
          <StatCard
            label="Cobranças atrasadas"
            value={loading ? "—" : formatFinanceMoney(data?.finance.overdueCents ?? 0)}
            sub={`${data?.finance.overdueCount ?? 0} lançamento(s)`}
            accent={(data?.finance.overdueCount ?? 0) > 0 ? "danger" : "neutral"}
            icon={Wallet}
          />
          <StatCard
            label="Recebido no mês"
            value={loading ? "—" : formatFinanceMoney(data?.finance.paidThisMonthCents ?? 0)}
            sub="Pagamentos confirmados"
            accent="success"
            icon={Wallet}
          />
          <StatCard
            label="Investimento (marketing)"
            value={loading ? "—" : formatFinanceMoney(data?.marketing.investmentCents ?? 0)}
            sub={`${data?.marketing.leads ?? 0} leads · ${data?.marketing.conversions ?? 0} conv.`}
            accent="brand"
            icon={Megaphone}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Pipeline comercial" description="Empresas por estágio">
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {COMPANY_STAGES.map((stage) => (
                <Link
                  key={stage}
                  to="/os/empresas"
                  className="rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-brand/30 hover:text-brand"
                >
                  {STAGE_LABELS[stage]}{" "}
                  <span className="font-semibold text-foreground">
                    ({data?.companies.pipeline[stage] ?? 0})
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Section>

        <Section title="Leads recentes" description="Aguardando contato">
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (data?.companies.recentLeads.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum lead no pipeline.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {data?.companies.recentLeads.map((lead) => (
                <ListItem key={lead.id}>
                  <Link
                    to="/os/empresas/$id"
                    params={{ id: lead.id }}
                    className="flex w-full items-center justify-between gap-3 py-3 text-sm"
                  >
                    <span className="font-medium hover:text-brand">{lead.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {lead.city ?? formatDate(lead.created_at)}
                    </span>
                  </Link>
                </ListItem>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Projetos atrasados"
          action={
            <Link to="/os/projetos" className="text-xs text-brand hover:underline">
              Ver todos
            </Link>
          }
        >
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (data?.projects.overdueItems.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum projeto atrasado.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {data?.projects.overdueItems.map((project) => (
                <ListItem key={project.id}>
                  <Link
                    to="/os/projetos/$id"
                    params={{ id: project.id }}
                    className="block py-3 text-sm"
                  >
                    <p className="font-medium hover:text-brand">{project.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {project.companyName ?? "—"}
                      {project.due_date && ` · venc. ${project.due_date.split("-").reverse().join("/")}`}
                    </p>
                  </Link>
                </ListItem>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title="Cobranças atrasadas"
          action={
            <Link to="/os/financeiro" className="text-xs text-brand hover:underline">
              Ver todas
            </Link>
          }
        >
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (data?.finance.overdueItems.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma cobrança atrasada.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {data?.finance.overdueItems.map((entry) => (
                <ListItem key={entry.id}>
                  <Link
                    to="/os/empresas/$id"
                    params={{ id: entry.company_id }}
                    className="block py-3 text-sm"
                  >
                    <p className="font-medium hover:text-brand">{entry.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.companyName ?? "—"} · {formatFinanceMoney(entry.amount_cents)} · venc.{" "}
                      {entry.due_date.split("-").reverse().join("/")}
                    </p>
                  </Link>
                </ListItem>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <Section
        title="Marketing recente"
        description={`${data?.marketing.snapshotCount ?? 0} registro(s) no total`}
        action={
          <Link to="/os/marketing" className="text-xs text-brand hover:underline">
            Ver todos
          </Link>
        }
      >
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : (data?.marketing.recentSnapshots.length ?? 0) === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma métrica registrada ainda.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {data?.marketing.recentSnapshots.map((snapshot) => (
              <ListItem key={snapshot.id}>
                <Link
                  to="/os/empresas/$id"
                  params={{ id: snapshot.company_id }}
                  className="block py-3 text-sm"
                >
                  <p className="font-medium hover:text-brand">
                    {snapshot.companyName ?? "—"} ·{" "}
                    {CHANNEL_LABELS[snapshot.channel as MarketingChannel]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPeriod(snapshot.period_start, snapshot.period_end)} ·{" "}
                    {formatFinanceMoney(snapshot.investment_cents)} · {snapshot.leads ?? 0} leads
                  </p>
                </Link>
              </ListItem>
            ))}
          </ul>
        )}
      </Section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Acesso rápido
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <QuickLinkCard title="Empresas" description="Leads, clientes e pipeline" href="/os/empresas" icon={Building2}>
            <QuickLinkButton href="/os/empresas" label="Abrir empresas" />
          </QuickLinkCard>
          <QuickLinkCard title="Projetos" description="Execução e prazos" href="/os/projetos" icon={FolderKanban}>
            <QuickLinkButton href="/os/projetos" label="Abrir projetos" />
          </QuickLinkCard>
          <QuickLinkCard title="Financeiro" description="Mensalidades e cobranças" href="/os/financeiro" icon={Wallet}>
            <QuickLinkButton href="/os/financeiro" label="Abrir financeiro" />
          </QuickLinkCard>
          <QuickLinkCard title="Marketing" description="Métricas por canal" href="/os/marketing" icon={Megaphone}>
            <QuickLinkButton href="/os/marketing" label="Abrir marketing" />
          </QuickLinkCard>
          <QuickLinkCard title="Leads hoje" description="Captação do site" href="/os/empresas" icon={Target}>
            <p className="mt-2 font-display text-2xl font-bold">
              {loading ? "—" : data?.companies.leadsToday ?? 0}
            </p>
          </QuickLinkCard>
          <QuickLinkCard title="Conversões" description="Total registrado em marketing" href="/os/marketing" icon={TrendingUp}>
            <p className="mt-2 font-display text-2xl font-bold">
              {loading ? "—" : data?.marketing.conversions ?? 0}
            </p>
          </QuickLinkCard>
        </div>
      </section>
    </div>
  );
}
