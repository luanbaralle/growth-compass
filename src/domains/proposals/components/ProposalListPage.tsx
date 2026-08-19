import { listProposals } from "@/domains/proposals/api.server";
import {
  PROPOSAL_PRESENTATION_OUTCOME_LABELS,
  PROPOSAL_STATUS_LABELS,
  PROPOSAL_TEMPLATE_LABELS,
  type Proposal,
  type ProposalPresentationOutcome,
  type ProposalStatus,
  type ProposalTemplate,
} from "@/domains/proposals/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  FilterPill,
  FilterPillsRow,
  FilterRow,
  FilterSearch,
  FilterToolbar,
  OSMetricGrid,
  OSPage,
  OSRefreshButton,
  PageHeader,
  PageSkeleton,
  StatCard,
} from "@/os/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ExternalLink,
  FileText,
  Layers,
  Presentation,
  Rocket,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type StatusFilter = ProposalStatus | "all";

const STATUS_ORDER: ProposalStatus[] = ["draft", "published", "archived"];

const STATUS_BADGE: Record<ProposalStatus, string> = {
  draft: "border-amber-400/35 bg-amber-400/10 text-amber-300",
  published: "border-emerald-400/35 bg-emerald-400/10 text-emerald-300",
  archived: "border-zinc-500/35 bg-zinc-500/10 text-zinc-400",
};

const STATUS_BAR: Record<ProposalStatus, string> = {
  draft: "bg-amber-400",
  published: "bg-emerald-400",
  archived: "bg-zinc-500",
};

const STATUS_ACCENT: Record<ProposalStatus, "warning" | "success" | "neutral"> = {
  draft: "warning",
  published: "success",
  archived: "neutral",
};

const OUTCOME_BADGE: Record<ProposalPresentationOutcome, string> = {
  approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  adjustments: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  postponed: "border-sky-400/30 bg-sky-400/10 text-sky-300",
};

const TEMPLATE_ICON: Record<ProposalTemplate, typeof Rocket> = {
  acceleration: Rocket,
  custom_solution: Layers,
};

function companyInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays <= 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays}d atrás`;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date);
}

function ProposalStatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
        STATUS_BADGE[status],
      )}
    >
      {status === "published" ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {PROPOSAL_STATUS_LABELS[status]}
    </span>
  );
}

function ProposalRow({ proposal }: { proposal: Proposal }) {
  const TemplateIcon = TEMPLATE_ICON[proposal.template];
  const outcome = proposal.content.presentation?.outcome;
  const publicUrl = `/propostas/${proposal.slug}`;

  return (
    <article
      className={cn(
        "dashboard-card dashboard-card-interactive group relative overflow-hidden",
        proposal.status === "archived" && "opacity-70",
      )}
    >
      <div className={cn("absolute inset-y-0 left-0 w-[3px]", STATUS_BAR[proposal.status])} />
      <Link
        to="/os/propostas/$id"
        params={{ id: proposal.id }}
        className="absolute inset-0 z-0"
        aria-label={`Abrir ${proposal.title}`}
      />

      <div className="pointer-events-none relative z-10 flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:pl-6">
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 text-xs font-semibold tracking-wide text-brand">
            {companyInitials(proposal.company_name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground/95">{proposal.title}</p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground/70">
              {proposal.company_name}
              {proposal.client_name && proposal.client_name !== proposal.company_name
                ? ` · ${proposal.client_name}`
                : ""}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-muted-foreground/55">
              <span className="inline-flex items-center gap-1">
                <TemplateIcon className="h-3 w-3" />
                {PROPOSAL_TEMPLATE_LABELS[proposal.template]}
              </span>
              <span className="text-border">·</span>
              <span className="font-mono tracking-tight">/{proposal.slug}</span>
              <span className="text-border">·</span>
              <span>
                {proposal.status === "published" && proposal.published_at
                  ? `Publicada ${formatRelativeDate(proposal.published_at)}`
                  : `Atualizada ${formatRelativeDate(proposal.updated_at)}`}
              </span>
              {outcome && (
                <>
                  <span className="text-border">·</span>
                  <span
                    className={cn(
                      "rounded-full border px-1.5 py-px text-[10px] font-medium",
                      OUTCOME_BADGE[outcome],
                    )}
                  >
                    R2 · {PROPOSAL_PRESENTATION_OUTCOME_LABELS[outcome]}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <ProposalStatusBadge status={proposal.status} />
          <div className="pointer-events-auto flex items-center gap-1.5">
            <Link
              to="/os/propostas/$id/apresentacao"
              params={{ id: proposal.id }}
              title="Apresentar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground/70 transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
              <Presentation className="h-4 w-4" />
            </Link>
            {proposal.status === "published" && (
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                title="Abrir página pública"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground/80 transition-colors hover:bg-surface-elevated hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Página
              </a>
            )}
            <span className="inline-flex h-9 w-9 items-center justify-center text-muted-foreground/40 transition-colors group-hover:text-foreground/80">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProposalListPage() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await listProposals({ data: {} });
      setProposals(rows);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar propostas."));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const next: Record<StatusFilter, number> = {
      all: proposals.length,
      draft: 0,
      published: 0,
      archived: 0,
    };
    for (const proposal of proposals) next[proposal.status] += 1;
    return next;
  }, [proposals]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return proposals.filter((proposal) => {
      if (status !== "all" && proposal.status !== status) return false;
      if (!query) return true;
      return [proposal.title, proposal.company_name, proposal.client_name ?? "", proposal.slug]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [proposals, search, status]);

  if (loading && proposals.length === 0 && !error) {
    return <PageSkeleton title="Propostas" metricCount={3} />;
  }

  return (
    <OSPage>
      <PageHeader
        title="Propostas"
        description="Páginas comerciais para Reunião 2 — pitch e fechamento."
        icon={FileText}
        actions={
          <>
            <OSRefreshButton loading={loading} onClick={() => void load()} />
            <Link to="/os/copilot" className="dashboard-btn-primary">
              <Sparkles className="h-4 w-4" />
              Nova proposta
            </Link>
          </>
        }
      />

      <OSMetricGrid>
        <StatCard
          label="Total"
          value={String(counts.all)}
          sub="Páginas no pipeline"
          icon={FileText}
          accent="neutral"
        />
        <StatCard
          label="Publicadas"
          value={String(counts.published)}
          sub="No ar para o cliente"
          icon={ExternalLink}
          accent={STATUS_ACCENT.published}
        />
        <StatCard
          label="Rascunhos"
          value={String(counts.draft)}
          sub="Aguardando publicação"
          icon={FileText}
          accent={STATUS_ACCENT.draft}
        />
      </OSMetricGrid>

      {error && (
        <EmptyState title="Não foi possível carregar as propostas" description={error} />
      )}

      <FilterToolbar>
        <FilterRow>
          <FilterSearch
            value={search}
            onChange={setSearch}
            placeholder="Buscar por empresa, título ou slug..."
          />
        </FilterRow>
      </FilterToolbar>

      <FilterPillsRow>
        <FilterPill
          active={status === "all"}
          onClick={() => setStatus("all")}
          label={`Todas (${counts.all})`}
        />
        {STATUS_ORDER.map((item) => (
          <FilterPill
            key={item}
            active={status === item}
            onClick={() => setStatus(item)}
            label={`${PROPOSAL_STATUS_LABELS[item]} (${counts[item]})`}
          />
        ))}
      </FilterPillsRow>

      {error ? null : filtered.length === 0 ? (
        proposals.length === 0 ? (
          <div className="dashboard-card flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/10 bg-brand/[0.04] text-brand/45">
              <FileText className="h-8 w-8" strokeWidth={1.25} />
            </div>
            <p className="text-sm font-medium text-foreground/90">Nenhuma proposta ainda</p>
            <p className="dashboard-sub mt-2 max-w-sm leading-relaxed">
              Encerrar uma sessão no Copilot gera o rascunho comercial para a Reunião 2.
            </p>
            <Link to="/os/copilot" className="dashboard-btn-primary mt-6">
              <Sparkles className="h-4 w-4" />
              Ir ao Copilot
            </Link>
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="Nenhuma proposta encontrada"
            description="Tente outro status ou ajuste a busca por empresa, título ou slug."
          />
        )
      ) : (
        <div className="space-y-2.5">
          {filtered.map((proposal) => (
            <ProposalRow key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </OSPage>
  );
}
