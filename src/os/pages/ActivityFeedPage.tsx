import { getOSActivityFeed } from "@/domains/events/activity.functions";
import type { ActivityFeedItem, ActivityFeedWindow } from "@/domains/events/activity-feed";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  FilterPill,
  FilterPillsRow,
  OSPage,
  OSRefreshButton,
  PageHeader,
  PageSkeleton,
} from "@/os/ui";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Building2,
  Clapperboard,
  FolderKanban,
  Target,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { DomainEntityType } from "@/domains/events/types";

const WINDOW_OPTIONS: { id: ActivityFeedWindow; label: string }[] = [
  { id: "24h", label: "Últimas 24h" },
  { id: "7d", label: "7 dias" },
];

const ENTITY_ICONS: Record<DomainEntityType, typeof Activity> = {
  company: Building2,
  prospect: Target,
  project: FolderKanban,
  content_task: Clapperboard,
  finance_entry: Wallet,
  marketing_snapshot: Activity,
  task: Activity,
  meeting: Activity,
};

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function formatSinceLabel(since: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(since));
}

export function ActivityFeedPage() {
  const navigate = useNavigate();
  const [window, setWindow] = useState<ActivityFeedWindow>("24h");
  const [items, setItems] = useState<ActivityFeedItem[]>([]);
  const [since, setSince] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (feedWindow: ActivityFeedWindow) => {
    setLoading(true);
    setError("");
    try {
      const result = await getOSActivityFeed({ data: { window: feedWindow } });
      setItems(result.items);
      setSince(result.since);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar atividade."));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void load(window);
  }, [window, load]);

  if (loading && items.length === 0 && !error) {
    return <PageSkeleton title="Atividade" metricCount={0} />;
  }

  return (
    <OSPage className="space-y-6">
      <PageHeader
        title="Atividade"
        description="Feed central do OS — eventos de domínio das últimas horas"
        actions={<OSRefreshButton onClick={() => void load(window)} loading={loading} />}
      />

      <FilterPillsRow>
        {WINDOW_OPTIONS.map((option) => (
          <FilterPill
            key={option.id}
            active={window === option.id}
            onClick={() => setWindow(option.id)}
          >
            {option.label}
          </FilterPill>
        ))}
      </FilterPillsRow>

      {since && (
        <p className="text-xs text-muted-foreground">
          Desde {formatSinceLabel(since)} · {items.length} evento(s)
        </p>
      )}

      {error && <EmptyState title="Erro ao carregar" description={error} />}

      {!error && !loading && items.length === 0 && (
        <EmptyState
          title="Nenhuma atividade no período"
          description="Eventos aparecem aqui quando projetos, produção ou outros módulos emitem domain events."
        />
      )}

      {!error && items.length > 0 && (
        <ul className="space-y-0 divide-y divide-border/40 rounded-xl border border-border/40 bg-surface/20">
          {items.map((item) => (
            <ActivityFeedRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </OSPage>
  );
}

function ActivityFeedRow({ item }: { item: ActivityFeedItem }) {
  const Icon = ENTITY_ICONS[item.entityType] ?? Activity;

  return (
    <li className="relative px-4 py-4 sm:px-5">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-muted/20 text-brand">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border/40 bg-muted/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {item.entityTypeLabel}
            </span>
            <span className="text-[10px] text-muted-foreground">{item.eventLabel}</span>
            <time className="text-[10px] text-muted-foreground">{formatDateTime(item.occurredAt)}</time>
          </div>

          <p className="mt-1 font-medium">{item.title}</p>

          {item.body && (
            <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{item.body}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {item.actorName && <span>{item.actorName}</span>}
            {item.companyName && item.companyId && (
              <>
                {item.actorName && <span>·</span>}
                <Link
                  to="/os/empresas/$id"
                  params={{ id: item.companyId }}
                  className="text-brand hover:underline"
                >
                  {item.companyName}
                </Link>
              </>
            )}
          </div>

          <a
            href={item.actionUrl}
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline",
            )}
          >
            Abrir registro
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </li>
  );
}
