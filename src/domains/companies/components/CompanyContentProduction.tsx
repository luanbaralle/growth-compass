import { listContentTasks } from "@/domains/content-production/api.server";
import { ContentChannelBadgeGroup } from "@/domains/content-production/components/ContentChannelBadgeGroup";
import {
  formatPostDate,
  STATUS_ACCENT,
  STATUS_LABELS,
} from "@/domains/content-production/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { Link } from "@tanstack/react-router";
import { Clapperboard, ExternalLink, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PIPELINE_STATUSES = new Set([
  "ideia",
  "definicao",
  "agendamento",
  "gravacao",
  "edicao",
  "aprovacao",
  "correcao",
  "aprovado",
  "programado",
]);

export function CompanyContentProduction({
  companyId,
  companyName,
  refreshKey = 0,
}: {
  companyId: string;
  companyName: string;
  refreshKey?: number;
}) {
  const [tasks, setTasks] = useState<Awaited<ReturnType<typeof listContentTasks>>["tasks"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    listContentTasks({ data: { companyId } })
      .then((result) => setTasks(result.tasks))
      .catch((err) => {
        if (!isUnauthorizedError(err)) {
          setError(getErrorMessage(err, "Erro ao carregar produção."));
        }
      })
      .finally(() => setLoading(false));
  }, [companyId, refreshKey]);

  const pipelineTasks = useMemo(
    () => tasks.filter((task) => PIPELINE_STATUSES.has(task.status)),
    [tasks],
  );

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando produção...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Conteúdo de <strong className="text-foreground">{companyName}</strong>
        </p>
        <Button size="sm" variant="outline" asChild>
          <Link to="/os/producao">
            <ExternalLink className="h-4 w-4" />
            Abrir produção
          </Link>
        </Button>
      </div>

      {pipelineTasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/60 py-10 text-center">
          <Clapperboard className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhuma peça em produção para este cliente.</p>
          <Button size="sm" asChild>
            <Link to="/os/producao">
              <Plus className="h-4 w-4" />
              Criar na produção
            </Link>
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
          {pipelineTasks.map((task) => (
            <li key={task.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <Link
                  to="/os/producao"
                  search={{ task: task.id }}
                  className="font-medium hover:text-brand"
                >
                  {task.title}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <ContentChannelBadgeGroup channels={task.channels} size="sm" />
                  {task.post_date && (
                    <span className="text-xs text-muted-foreground">
                      {formatPostDate(task.post_date)}
                    </span>
                  )}
                </div>
              </div>
              <ContentStatusBadge status={task.status} />
            </li>
          ))}
        </ul>
      )}

      {tasks.some((task) => task.status === "publicado") && (
        <p className="text-xs text-muted-foreground">
          {tasks.filter((task) => task.status === "publicado").length} peça(s) já publicada(s).
        </p>
      )}
    </div>
  );
}

function ContentStatusBadge({ status }: { status: keyof typeof STATUS_LABELS }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-2.5 py-0.5 text-xs font-medium">
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_ACCENT[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}
