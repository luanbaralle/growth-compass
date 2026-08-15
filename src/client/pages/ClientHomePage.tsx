import { ClientEmptyState } from "@/client/components/ClientEmptyState";
import { ClientKpiCard } from "@/client/components/ClientKpiCard";
import { ClientPageSkeleton } from "@/client/components/ClientPageSkeleton";
import { ClientSection } from "@/client/components/ClientSection";
import { deltaTone, formatDelta, greetingPrefix } from "@/client/components/client-utils";
import { getClientHomeSummary } from "@/client/home.functions";
import { useClientContext } from "@/client/shell/use-client-context";
import { formatMoney } from "@/domains/marketing/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clapperboard,
  FolderKanban,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

export function ClientHomePage() {
  const { user } = useClientContext();
  const { data, isLoading } = useQuery({
    queryKey: ["client-home", user.companyId],
    queryFn: () => getClientHomeSummary(),
  });

  if (isLoading) {
    return <ClientPageSkeleton />;
  }

  const greetingName = data?.greetingName ?? user.name.split(/\s+/)[0] ?? user.name;
  const metrics = data?.metrics;
  const work = data?.workSummary;

  return (
    <div className="client-page client-stagger space-y-6">
      <section className="client-hero">
        <div className="client-hero-content">
          <p className="client-eyebrow">
            {greetingPrefix()}, {greetingName}.
          </p>
          <h1 className="client-hero-title">Seu marketing em movimento</h1>
          <p className="client-hero-desc">
            Acompanhe resultados, aprove conteúdos e veja o progresso da operação da Raise One
            para {user.companyName}.
          </p>
          {data?.periodLabel ? (
            <span className="client-period-chip">{data.periodLabel}</span>
          ) : null}
        </div>
      </section>

      <div className="client-kpi-grid">
        <ClientKpiCard
          label="Leads"
          hint="Período atual"
          icon={Users}
          value={metrics?.hasData ? String(metrics.leads) : "—"}
          delta={metrics?.hasData ? metrics.leadsDeltaPct : undefined}
        />
        <ClientKpiCard
          label="Investimento"
          hint="Mídia administrada"
          icon={Wallet}
          value={metrics?.hasData ? formatMoney(metrics.investmentCents) : "—"}
        />
        <ClientKpiCard
          label="CPL"
          hint="Custo por lead"
          icon={Target}
          value={metrics?.cplCents != null ? formatMoney(metrics.cplCents) : "—"}
        />
        <ClientKpiCard
          label="Variação"
          hint="Leads vs. mês anterior"
          icon={TrendingUp}
          accent="amber"
          value={formatDelta(metrics?.leadsDeltaPct ?? null)}
          delta={metrics?.leadsDeltaPct}
        />
      </div>

      {metrics && !metrics.hasData && (
        <ClientEmptyState
          icon={BarChart3}
          title="Resultados em preparação"
          description="Ainda não há dados de marketing para este período. Assim que a operação registrar métricas, elas aparecem aqui automaticamente."
        />
      )}

      <ClientSection
        title="Precisa de você"
        icon={Zap}
        iconTone="amber"
        badgeCount={data?.pendingActions.length || undefined}
        actionLabel={data?.pendingActions.length ? "Ver conteúdo" : undefined}
        actionTo={data?.pendingActions.length ? "/client/conteudo" : undefined}
      >
        {data?.pendingActions.length ? (
          <ul className="space-y-3">
            {data.pendingActions.map((action) => (
              <li key={action.id}>
                <Link to={action.href} className="client-action-card">
                  <p className="client-action-title">{action.title}</p>
                  <p className="client-action-sub">{action.subtitle}</p>
                  <span className="client-action-cta">
                    Revisar agora
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ClientEmptyState
            compact
            tone="success"
            icon={CheckCircle2}
            title="Tudo em dia por aqui"
            description="Quando houver conteúdo para aprovar ou alguma informação necessária, avisamos neste bloco."
          />
        )}
      </ClientSection>

      <ClientSection title="O que fizemos por você" icon={Sparkles} iconTone="primary">
        {work ? (
          <div className="client-work-grid">
            <WorkTile label="Conteúdos publicados" value={String(work.contentsProduced)} />
            <WorkTile label="Peças em produção" value={String(work.contentsInPipeline)} />
            <WorkTile label="Atualizações de campanha" value={String(work.campaignOptimizations)} />
            <WorkTile label="Melhorias de landing" value={String(work.landingImprovements)} />
            <WorkTile label="Leads gerados" value={String(work.leadsGenerated)} />
            <WorkTile label="Investimento administrado" value={formatMoney(work.investmentManagedCents)} />
          </div>
        ) : null}
      </ClientSection>

      {data?.monthReport && (
        <ClientSection
          featured
          title={`Seu mês · ${data.monthReport.periodLabel}`}
          icon={BarChart3}
          actionLabel="Ver resultados"
          actionTo="/client/resultados"
        >
          <div className="client-month-grid">
            <MonthStat
              label="Leads gerados"
              value={String(data.monthReport.leads)}
              delta={data.monthReport.leadsDeltaPct}
            />
            <MonthStat
              label="Investimento"
              value={formatMoney(data.monthReport.investmentCents)}
            />
            <MonthStat
              label="CPL"
              value={
                data.monthReport.cplCents != null ? formatMoney(data.monthReport.cplCents) : "—"
              }
              delta={data.monthReport.cplDeltaPct}
              invertDelta
            />
          </div>
          {data.monthReport.highlight ? (
            <p className="mt-4 text-sm leading-relaxed text-foreground/90">
              {data.monthReport.highlight}
            </p>
          ) : null}
          {data.monthReport.nextFocus ? (
            <div className="client-focus-card mt-4">
              <p className="client-focus-label">Próximo foco</p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                {data.monthReport.nextFocus}
              </p>
            </div>
          ) : null}
        </ClientSection>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <ClientSection
          title="Projetos"
          icon={FolderKanban}
          actionLabel="Ver todos"
          actionTo="/client/projetos"
        >
          {data?.projects.length ? (
            <ul className="space-y-3">
              {data.projects.map((project) => (
                <li key={project.id}>
                  <Link
                    to="/client/projetos/$projectId"
                    params={{ projectId: project.id }}
                    className="client-project-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{project.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{project.typeLabel}</p>
                      </div>
                      <span className="client-status-pill shrink-0">{project.statusLabel}</span>
                    </div>
                    {project.progressPct != null && (
                      <div className="mt-3">
                        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                          <span>Progresso</span>
                          <span className="font-medium tabular-nums text-foreground/80">
                            {project.progressPct}%
                          </span>
                        </div>
                        <div className="client-progress-track">
                          <div
                            className="client-progress-fill"
                            style={{ width: `${project.progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ClientEmptyState
              compact
              icon={FolderKanban}
              title="Nenhum projeto ativo"
              description="Quando iniciarmos uma nova entrega, ela aparece aqui com status e progresso."
            />
          )}
        </ClientSection>

        {data && (
          <ClientSection
            title="Conteúdo"
            icon={Clapperboard}
            actionLabel="Ver pipeline"
            actionTo="/client/conteudo"
          >
            <div className="client-pipeline-grid">
              <PipelineStat label="Em produção" value={data.contentCounts.emProducao} />
              <PipelineStat
                label="Aguardando aprovação"
                value={data.contentCounts.aguardandoAprovacao}
                highlight={data.contentCounts.aguardandoAprovacao > 0}
              />
              <PipelineStat label="Programados" value={data.contentCounts.programados} />
              <PipelineStat label="Publicados" value={data.contentCounts.publicados} />
            </div>
          </ClientSection>
        )}
      </section>
    </div>
  );
}

function WorkTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="client-work-item">
      <p className="client-work-value">{value}</p>
      <p className="client-work-label">{label}</p>
    </div>
  );
}

function PipelineStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={cn("client-pipeline-stat", highlight && "border-amber-500/25 bg-amber-500/5")}>
      <p className={cn("client-pipeline-value", highlight && "text-amber-300")}>{value}</p>
      <p className="client-pipeline-label">{label}</p>
    </div>
  );
}

function MonthStat({
  label,
  value,
  delta,
  invertDelta,
}: {
  label: string;
  value: string;
  delta?: number | null;
  invertDelta?: boolean;
}) {
  const tone = deltaTone(delta, invertDelta);

  return (
    <div className="client-month-stat">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="client-month-value mt-1">{value}</p>
      {delta != null && (
        <p
          className={cn(
            "mt-1.5 text-xs font-semibold tabular-nums",
            tone === "positive" && "text-emerald-400",
            tone === "negative" && "text-rose-400",
            tone === "neutral" && "text-muted-foreground",
          )}
        >
          {formatDelta(delta)} vs. mês anterior
        </p>
      )}
    </div>
  );
}
