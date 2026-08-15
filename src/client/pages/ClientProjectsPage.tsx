import { getClientProject, listClientProjects } from "@/client/project.functions";
import { ClientEmptyState } from "@/client/components/ClientEmptyState";
import { ClientFilterPills } from "@/client/components/ClientFilterPills";
import { ClientPageHeader } from "@/client/components/ClientPageHeader";
import { ClientPageSkeleton } from "@/client/components/ClientPageSkeleton";
import { ClientSection } from "@/client/components/ClientSection";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, FolderKanban, History } from "lucide-react";
import { useMemo, useState } from "react";

type ProjectFilter = "all" | "active" | "done" | "needs_you";

const FILTERS: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "active", label: "Em andamento" },
  { id: "needs_you", label: "Precisa de você" },
  { id: "done", label: "Concluídos" },
];

function matchesFilter(
  item: Awaited<ReturnType<typeof listClientProjects>>[number],
  filter: ProjectFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "needs_you") return item.needsClient;
  if (filter === "done") return item.status === "done";
  return ["pending", "in_progress", "review", "blocked"].includes(item.status);
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ClientProjetosPage() {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const { data, isLoading } = useQuery({
    queryKey: ["client-projects"],
    queryFn: () => listClientProjects(),
  });

  const items = useMemo(
    () => (data ?? []).filter((item) => matchesFilter(item, filter)),
    [data, filter],
  );

  return (
    <div className="client-page space-y-6">
      <ClientPageHeader
        eyebrow="Entregas em andamento"
        title="Projetos"
        description="Acompanhe o progresso do que a Raise One está construindo para você."
      />

      <ClientFilterPills options={FILTERS} value={filter} onChange={setFilter} />

      {isLoading ? (
        <ClientPageSkeleton />
      ) : items.length === 0 ? (
        <ClientEmptyState
          icon={FolderKanban}
          title="Nenhum projeto neste filtro"
          description="Tente outro filtro ou volte mais tarde — novas entregas aparecem aqui automaticamente."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to="/client/projetos/$projectId"
                params={{ projectId: item.id }}
                className="client-project-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.typeLabel}</p>
                  </div>
                  <span
                    className={cn(
                      "client-status-chip",
                      item.needsClient
                        ? "client-status-chip-amber"
                        : item.status === "done"
                          ? "client-status-chip-emerald"
                          : "client-status-chip-muted",
                    )}
                  >
                    {item.statusLabel}
                  </span>
                </div>
                {item.progressPct != null && (
                  <div className="mt-3">
                    <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>Progresso</span>
                      <span className="font-medium tabular-nums text-foreground/80">
                        {item.progressPct}%
                      </span>
                    </div>
                    <div className="client-progress-track">
                      <div
                        className="client-progress-fill"
                        style={{ width: `${item.progressPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ClientProjectDetailPage({ projectId }: { projectId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["client-project", projectId],
    queryFn: () => getClientProject({ data: { projectId } }),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando…</p>;
  }

  if (error || !data) {
    return (
      <div className="client-panel space-y-3">
        <p className="text-sm text-muted-foreground">Projeto não encontrado.</p>
        <Link to="/client/projetos" className="text-sm text-primary hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="client-page space-y-6">
      <Link to="/client/projetos" className="client-text-link inline-flex items-center gap-1">
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar aos projetos
      </Link>

      <header className="space-y-2">
        <span
          className={cn(
            "client-status-chip",
            data.needsClient ? "client-status-chip-amber" : "client-status-chip-muted",
          )}
        >
          {data.statusLabel}
        </span>
        <h1 className="client-page-title">{data.title}</h1>
        <p className="client-page-desc">{data.typeLabel}</p>
      </header>

      <ClientSection title="Resumo do projeto" icon={FolderKanban}>
        <div className="grid gap-4 sm:grid-cols-2">
        {data.progressPct != null && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Progresso
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="client-progress-track h-2 flex-1">
                  <div
                    className="client-progress-fill"
                    style={{ width: `${data.progressPct}%` }}
                  />
                </div>
                <span className="text-sm font-semibold tabular-nums">{data.progressPct}%</span>
              </div>
            </div>
        )}

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Última atualização
          </p>
          <p className="mt-2 text-sm">{formatRelativeDate(data.lastUpdatedAt)}</p>
        </div>

        {data.forecastDate && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Previsão
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              {data.forecastDate}
            </p>
          </div>
        )}

        {data.nextStepLabel && (
          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Próxima etapa
            </p>
            <p className="mt-2 text-sm text-foreground/90">{data.nextStepLabel}</p>
          </div>
        )}
        </div>
      </ClientSection>

      <ClientSection title="Histórico" icon={History}>
        {data.history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Atualizações aparecerão aqui conforme o projeto avança.
          </p>
        ) : (
          <ul className="space-y-4">
            {data.history.map((entry) => (
              <li key={entry.id} className="border-l-2 border-border/60 pl-4">
                <p className="text-xs text-muted-foreground">{formatRelativeDate(entry.occurredAt)}</p>
                <p className="mt-0.5 text-sm font-medium">{entry.title}</p>
                {entry.body && (
                  <p className="mt-1 text-sm text-muted-foreground">{entry.body}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </ClientSection>
    </div>
  );
}
