import { listFinanceEntries, markFinanceEntryPaid } from "@/domains/finance/api.server";
import {
  FinanceStatusBadge,
  formatDueDate,
  formatMoney,
} from "@/domains/finance/components/FinanceBadges";
import { effectiveFinanceStatus } from "@/domains/finance/types";
import { listMarketingSnapshots } from "@/domains/marketing/api.server";
import {
  formatMoney as formatMarketingMoney,
  MarketingChannelBadge,
} from "@/domains/marketing/components/MarketingBadges";
import { formatPeriod } from "@/domains/marketing/types";
import { listProjects } from "@/domains/projects/api.server";
import {
  formatDueDate as formatProjectDueDate,
  isDueOverdue,
  ProjectStatusBadge,
} from "@/domains/projects/components/ProjectBadges";
import { ACTIVE_STATUSES, TYPE_LABELS } from "@/domains/projects/types";
import type { Company, CompanyActivity, CompanyLink } from "@/domains/companies/types";
import { LINK_TYPE_LABELS } from "@/domains/companies/types";
import { TEAM_LABELS } from "@/lib/auth/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { cn } from "@/lib/utils";
import { StatCard, Section, EmptyState } from "@/os/ui";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ExternalLink,
  FolderKanban,
  Megaphone,
  MessageSquarePlus,
  Plus,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function formatActivityTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function CompanyOverview({
  company,
  activities,
  links,
  filesCount,
  refreshKey = 0,
  onGoToTab,
  onCreateProject,
  onCreateFinance,
  onCreateMarketing,
  onAddNote,
}: {
  company: Company;
  activities: CompanyActivity[];
  links: CompanyLink[];
  filesCount: number;
  refreshKey?: number;
  onGoToTab: (tab: string) => void;
  onCreateProject: () => void;
  onCreateFinance: () => void;
  onCreateMarketing: () => void;
  onAddNote: (body: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<Awaited<ReturnType<typeof listProjects>>["projects"]>([]);
  const [financeEntries, setFinanceEntries] = useState<
    Awaited<ReturnType<typeof listFinanceEntries>>["entries"]
  >([]);
  const [financeSummary, setFinanceSummary] = useState({
    receivableCents: 0,
    overdueCents: 0,
    paidThisMonthCents: 0,
    mrrCents: 0,
    futurePendingCents: 0,
  });
  const [snapshots, setSnapshots] = useState<
    Awaited<ReturnType<typeof listMarketingSnapshots>>["snapshots"]
  >([]);
  const [marketingSummary, setMarketingSummary] = useState({
    investmentCents: 0,
    leads: 0,
    conversions: 0,
  });
  const [note, setNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      listProjects({ data: { companyId: company.id, sort: "due_date", order: "asc" } }),
      listFinanceEntries({ data: { companyId: company.id, sort: "due_date", order: "asc" } }),
      listMarketingSnapshots({
        data: { companyId: company.id, sort: "period_start", order: "desc" },
      }),
    ])
      .then(([projectsResult, financeResult, marketingResult]) => {
        setProjects(projectsResult.projects);
        setFinanceEntries(financeResult.entries);
        setFinanceSummary(financeResult.summary);
        setSnapshots(marketingResult.snapshots);
        setMarketingSummary(marketingResult.summary);
      })
      .catch((err) => {
        if (!isUnauthorizedError(err)) {
          setError(getErrorMessage(err, "Erro ao carregar painel."));
        }
      })
      .finally(() => setLoading(false));
  }, [company.id, refreshKey]);

  const activeProjects = useMemo(
    () => projects.filter((p) => ACTIVE_STATUSES.includes(p.status)),
    [projects],
  );

  const openFinance = useMemo(
    () =>
      financeEntries.filter((e) => {
        const status = effectiveFinanceStatus(e);
        return status === "pending" || status === "overdue";
      }),
    [financeEntries],
  );

  const overdueFinance = openFinance.filter((e) => effectiveFinanceStatus(e) === "overdue");
  const latestSnapshot = snapshots[0] ?? null;
  const recentActivities = activities.slice(0, 5);

  const handleMarkPaid = async (entryId: string) => {
    await markFinanceEntryPaid({ data: { id: entryId, companyId: company.id } });
    toast.success("Marcado como pago");
    const result = await listFinanceEntries({
      data: { companyId: company.id, sort: "due_date", order: "asc" },
    });
    setFinanceEntries(result.entries);
    setFinanceSummary(result.summary);
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setNoteLoading(true);
    try {
      await onAddNote(note.trim());
      setNote("");
    } finally {
      setNoteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="dashboard-kpi-secondary h-28 animate-pulse" />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="dashboard-card h-64 animate-pulse lg:col-span-2" />
          <div className="dashboard-card h-64 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Erro ao carregar painel" description={error} />;
  }

  return (
    <div className="space-y-5">
      {overdueFinance.length > 0 && (
        <div className="company-alert-banner">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-sm">
            <strong className="font-medium text-foreground">
              {overdueFinance.length} cobrança(s) atrasada(s)
            </strong>
            {" — "}
            {formatMoney(overdueFinance.reduce((sum, e) => sum + e.amount_cents, 0))} pendente
          </p>
          <button
            type="button"
            onClick={() => onGoToTab("finance")}
            className="company-alert-banner-action"
          >
            Ver financeiro
          </button>
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projetos ativos"
          value={String(activeProjects.length)}
          sub={`${projects.filter((p) => p.status === "done").length} concluído(s)`}
          icon={FolderKanban}
          accent={activeProjects.length > 0 ? "brand" : "neutral"}
        />
        <StatCard
          label="A receber"
          value={formatMoney(financeSummary.receivableCents)}
          sub={
            financeSummary.mrrCents > 0
              ? `MRR ${formatMoney(financeSummary.mrrCents)}`
              : financeSummary.overdueCents > 0
                ? `${formatMoney(financeSummary.overdueCents)} atrasado`
                : "Este mês + atrasados"
          }
          icon={Wallet}
          accent={financeSummary.overdueCents > 0 ? "danger" : "success"}
        />
        <StatCard
          label="Marketing"
          value={formatMarketingMoney(marketingSummary.investmentCents)}
          sub={`${marketingSummary.leads} leads · ${marketingSummary.conversions} conv.`}
          icon={Megaphone}
          accent="purple"
        />
        <StatCard
          label="Recursos"
          value={String(links.length + filesCount)}
          sub={`${links.length} link(s) · ${filesCount} arquivo(s)`}
          icon={ExternalLink}
          accent="info"
        />
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Section
            title="Projetos em andamento"
            description="O que está ativo agora neste cliente"
            action={
              <button type="button" onClick={() => onGoToTab("projects")} className="dashboard-link">
                Ver todos
                <ArrowRight className="h-3 w-3" />
              </button>
            }
          >
            {activeProjects.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <FolderKanban className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Nenhum projeto em andamento.</p>
                <button type="button" onClick={onCreateProject} className="dashboard-btn-primary h-9 px-3 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Criar projeto
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-border/40">
                {activeProjects.map((project) => (
                  <li key={project.id}>
                    <Link
                      to="/os/projetos/$id"
                      params={{ id: project.id }}
                      className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-brand"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{project.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {TYPE_LABELS[project.type]}
                          {project.due_date && (
                            <span
                              className={cn(
                                "ml-2",
                                isDueOverdue(project.due_date, project.status) && "text-red-400",
                              )}
                            >
                              · {formatProjectDueDate(project.due_date)}
                            </span>
                          )}
                        </p>
                      </div>
                      <ProjectStatusBadge status={project.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section
            title="Cobranças em aberto"
            action={
              <button type="button" onClick={() => onGoToTab("finance")} className="dashboard-link">
                Ver financeiro
                <ArrowRight className="h-3 w-3" />
              </button>
            }
          >
            {openFinance.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">Nenhuma cobrança pendente.</p>
            ) : (
              <ul className="divide-y divide-border/40">
                {openFinance.slice(0, 4).map((entry) => {
                  const status = effectiveFinanceStatus(entry);
                  return (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{entry.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatMoney(entry.amount_cents)} · {formatDueDate(entry.due_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FinanceStatusBadge status={status} />
                        <button
                          type="button"
                          title="Marcar como pago"
                          onClick={() => void handleMarkPaid(entry.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 text-emerald-400 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/10"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="Ações rápidas">
            <div className="grid gap-2">
              <button type="button" onClick={onCreateProject} className="company-quick-action">
                <FolderKanban className="h-4 w-4 text-brand" />
                Novo projeto
              </button>
              <button type="button" onClick={onCreateFinance} className="company-quick-action">
                <Wallet className="h-4 w-4 text-emerald-400" />
                Registrar cobrança
              </button>
              <button type="button" onClick={onCreateMarketing} className="company-quick-action">
                <Megaphone className="h-4 w-4 text-violet-400" />
                Métricas de marketing
              </button>
            </div>
          </Section>

          {links.length > 0 && (
            <Section
              title="Acesso rápido"
              action={
                <button type="button" onClick={() => onGoToTab("cadastro")} className="dashboard-link">
                  Gerenciar
                </button>
              }
            >
              <ul className="space-y-1.5">
                {links.slice(0, 5).map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="company-link-row"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{link.label}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {LINK_TYPE_LABELS[link.type]}
                        </p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-40" />
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {latestSnapshot && (
            <Section
              title="Último marketing"
              action={
                <button type="button" onClick={() => onGoToTab("marketing")} className="dashboard-link">
                  Ver histórico
                </button>
              }
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <MarketingChannelBadge channel={latestSnapshot.channel} />
                  <span className="text-xs text-muted-foreground">
                    {formatPeriod(latestSnapshot.period_start, latestSnapshot.period_end)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatMarketingMoney(latestSnapshot.investment_cents)} investidos ·{" "}
                  {latestSnapshot.leads ?? 0} leads · {latestSnapshot.conversions ?? 0} conv.
                </p>
              </div>
            </Section>
          )}

          <Section title="Nota rápida">
            <form onSubmit={handleNoteSubmit} className="space-y-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Registre uma conversa, decisão ou follow-up..."
                rows={3}
                className="company-note-input"
              />
              <button
                type="submit"
                disabled={noteLoading || !note.trim()}
                className="dashboard-btn-primary h-9 w-full text-xs disabled:opacity-40"
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                {noteLoading ? "Salvando..." : "Salvar nota"}
              </button>
            </form>
          </Section>
        </div>
      </div>

      <Section
        title="Atividade recente"
        action={
          <button type="button" onClick={() => onGoToTab("history")} className="dashboard-link">
            Ver histórico completo
            <ArrowRight className="h-3 w-3" />
          </button>
        }
      >
        {recentActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma atividade registrada ainda.</p>
        ) : (
          <ul className="divide-y divide-border/40">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{activity.title}</span>
                  <span>·</span>
                  <time>{formatActivityTime(activity.created_at)}</time>
                  {activity.author_id && (
                    <>
                      <span>·</span>
                      <span>
                        {TEAM_LABELS[activity.author_id as keyof typeof TEAM_LABELS] ??
                          activity.author_id}
                      </span>
                    </>
                  )}
                </div>
                {activity.body && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground/80">
                    {activity.body}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
