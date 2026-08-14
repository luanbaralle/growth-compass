import { listProjects } from "@/domains/projects/api.server";
import {
  formatDueDate,
  isDueOverdue,
  ProjectStatusBadge,
} from "@/domains/projects/components/ProjectBadges";
import { TYPE_LABELS } from "@/domains/projects/types";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FolderKanban, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";

export function CompanyProjects({
  companyId,
  companyName,
  onCreateClick,
  refreshKey = 0,
}: {
  companyId: string;
  companyName: string;
  onCreateClick: () => void;
  refreshKey?: number;
}) {
  const [projects, setProjects] = useState<Awaited<ReturnType<typeof listProjects>>["projects"]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    listProjects({ data: { companyId, sort: "due_date", order: "asc" } })
      .then((r) => setProjects(r.projects))
      .catch((err) => {
        if (!isUnauthorizedError(err)) {
          setError(getErrorMessage(err, "Erro ao carregar projetos."));
        }
      })
      .finally(() => setLoading(false));
  }, [companyId, refreshKey]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando projetos...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Projetos de <strong className="text-foreground">{companyName}</strong>
        </p>
        <Button size="sm" variant="outline" onClick={onCreateClick}>
          <Plus className="h-4 w-4" />
          Novo projeto
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/60 py-10 text-center">
          <FolderKanban className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum projeto para esta empresa.</p>
          <Button size="sm" onClick={onCreateClick}>
            Criar primeiro projeto
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
          {projects.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <Link
                  to="/os/projetos/$id"
                  params={{ id: p.id }}
                  className="font-medium hover:text-brand"
                >
                  {p.title}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {TYPE_LABELS[p.type]}
                  {p.due_date && (
                    <span
                      className={
                        isDueOverdue(p.due_date, p.status) ? " ml-2 text-red-400" : " ml-2"
                      }
                    >
                      · {formatDueDate(p.due_date)}
                    </span>
                  )}
                  {p.next_action && (
                    <span className="ml-2 block truncate sm:inline">
                      → {p.next_action}
                    </span>
                  )}
                </p>
              </div>
              <ProjectStatusBadge status={p.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
