import {
  getProspectionMetrics,
  listProspects,
  listProspectsWithoutOpportunity,
} from "@/domains/prospection/api.server";
import { ProspectFormSheet } from "@/domains/prospection/components/ProspectFormSheet";
import { ProspectMetricsBar } from "@/domains/prospection/components/ProspectMetrics";
import { ProspectPipeline } from "@/domains/prospection/components/ProspectPipeline";
import type { Prospect, ProspectionMetrics } from "@/domains/prospection/types";
import { OPPORTUNITY_ITEMS } from "@/domains/prospection/types";
import {
  NEXT_ACTION_URGENCY_LABELS,
  formatProspectDate,
  getNextActionUrgency,
} from "@/domains/prospection/types";
import { useOSContext } from "@/os/shell/use-os-context";
import { EmptyState, ListItem, PageHeader, PageSkeleton, Section, OSPage, OSRefreshButton, OSPrimaryButton, FilterRow, FilterSearch } from "@/os/ui";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Target,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

function NextActionUrgencyBadge({ date }: { date: string | null }) {
  const urgency = getNextActionUrgency(date);
  if (!urgency) return null;
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
        urgency === "overdue" && "bg-red-400/15 text-red-400",
        urgency === "today" && "bg-amber-400/15 text-amber-400",
        urgency === "future" && "bg-muted text-muted-foreground",
      )}
    >
      {NEXT_ACTION_URGENCY_LABELS[urgency]}
    </span>
  );
}

export function ProspectPipelinePage() {
  const navigate = useNavigate();
  const { activePerson } = useOSContext();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [metrics, setMetrics] = useState<ProspectionMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [source, setSource] = useState("");
  const [ownerId, setOwnerId] = useState<TeamMember | "all">("all");
  const [sort, setSort] = useState<"last_interaction_at" | "created_at" | "name" | "next_action_date">(
    "last_interaction_at",
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [opportunityFilter, setOpportunityFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const categories = useMemo(
    () => [...new Set(prospects.map((p) => p.category).filter(Boolean))] as string[],
    [prospects],
  );
  const cities = useMemo(
    () => [...new Set(prospects.map((p) => p.city).filter(Boolean))] as string[],
    [prospects],
  );
  const sources = useMemo(
    () => [...new Set(prospects.map((p) => p.source).filter(Boolean))] as string[],
    [prospects],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [listResult, metricsResult] = await Promise.all([
        listProspects({
          data: {
            search: search || undefined,
            category: category || undefined,
            city: city || undefined,
            source: source || undefined,
            ownerId,
            sort,
            order,
          },
        }),
        getProspectionMetrics(),
      ]);
      let filtered = listResult.prospects;
      if (opportunityFilter) {
        const withoutOpp = await listProspectsWithoutOpportunity({
          data: { opportunityKey: opportunityFilter },
        });
        const withoutOppIds = new Set(withoutOpp.map((p) => p.id));
        filtered = filtered.filter((p) => withoutOppIds.has(p.id));
      }
      setProspects(filtered);
      setMetrics(metricsResult);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar prospecção."));
    } finally {
      setLoading(false);
    }
  }, [search, category, city, source, ownerId, sort, order, opportunityFilter, navigate]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  if (loading && !metrics) {
    return <PageSkeleton title="Prospecção" metricCount={5} />;
  }

  return (
    <OSPage>
      <PageHeader
        title="Prospecção"
        description="Pipeline comercial — do Google Maps ao cliente"
        icon={Target}
        actions={
          <>
            <Link to="/os/prospeccao/biblioteca" className="dashboard-btn-ghost">
              <BookOpen className="h-4 w-4" />
              Copilot
            </Link>
            <OSRefreshButton loading={loading} onClick={load} />
            <button
              type="button"
              disabled
              title="Em breve"
              className="dashboard-btn-ghost cursor-not-allowed opacity-50"
            >
              <Upload className="h-4 w-4" />
              Importar
            </button>
            <OSPrimaryButton label="Adicionar" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      {error && <EmptyState title="Erro" description={error} />}

      {metrics && <ProspectMetricsBar metrics={metrics} />}

      {metrics && metrics.upcomingActions.length > 0 && (
        <Section title="Próximas ações" noPadding>
          <div className="divide-y divide-border/40">
            {metrics.upcomingActions.map((p) => (
              <ListItem key={p.id}>
                <Link
                  to="/os/prospeccao/$id"
                  params={{ id: p.id }}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.next_action ?? "Sem descrição"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <NextActionUrgencyBadge date={p.next_action_date} />
                    <span className="text-xs text-muted-foreground">
                      {formatProspectDate(p.next_action_date)}
                    </span>
                  </div>
                </Link>
              </ListItem>
            ))}
          </div>
        </Section>
      )}

      <Section
        title="Pipeline"
        description={
          prospects.length > 0
            ? `${prospects.length} prospect${prospects.length === 1 ? "" : "s"} no funil`
            : undefined
        }
        noPadding
      >
        <div className="dashboard-card overflow-hidden p-0">
          <div className="os-filters !rounded-none !border-0">
            <FilterRow>
              <FilterSearch
                value={search}
                onChange={setSearch}
                placeholder="Buscar empresa, cidade, telefone..."
              />
              <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
                <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_interaction_at">Última interação</SelectItem>
                    <SelectItem value="next_action_date">Próxima ação</SelectItem>
                    <SelectItem value="created_at">Cadastro</SelectItem>
                    <SelectItem value="name">Nome</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={order} onValueChange={(v) => setOrder(v as "asc" | "desc")}>
                  <SelectTrigger className="h-9 w-[90px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Desc</SelectItem>
                    <SelectItem value="asc">Asc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FilterRow>
            <div className="pipeline-filters-scroll">
            <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
              <SelectTrigger className="h-9 w-[130px] shrink-0">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Categoria</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={city || "all"} onValueChange={(v) => setCity(v === "all" ? "" : v)}>
              <SelectTrigger className="h-9 w-[120px] shrink-0">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cidade</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={source || "all"} onValueChange={(v) => setSource(v === "all" ? "" : v)}>
              <SelectTrigger className="h-9 w-[120px] shrink-0">
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Origem</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ownerId} onValueChange={(v) => setOwnerId(v as TeamMember | "all")}>
              <SelectTrigger className="h-9 w-[140px] shrink-0">
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Responsável</SelectItem>
                {TEAM_MEMBERS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {TEAM_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={opportunityFilter || "all"}
              onValueChange={(v) => setOpportunityFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="h-9 w-[150px] shrink-0">
                <SelectValue placeholder="Oportunidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Oportunidade</SelectItem>
                {OPPORTUNITY_ITEMS.map((o) => (
                  <SelectItem key={o.key} value={o.key}>
                    Sem {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
          </div>
        </div>
        <div className="px-6 py-6 sm:px-7">
          {prospects.length === 0 && !loading ? (
            <EmptyState
              icon={Target}
              title="Nenhum prospect"
              description="Adicione uma empresa para começar o pipeline."
            />
          ) : (
            <ProspectPipeline prospects={prospects} onMoved={load} />
          )}
        </div>
      </Section>

      <ProspectFormSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultOwnerId={activePerson ?? undefined}
        onCreated={(id) => {
          void load();
          navigate({ to: "/os/prospeccao/$id", params: { id } });
        }}
      />
    </OSPage>
  );
}
