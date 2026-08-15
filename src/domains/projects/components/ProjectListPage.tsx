import {
  createProject,
  deleteProject,
  listProjects,
} from "@/domains/projects/api.server";
import {
  formToPayload,
  ProjectFormDialog,
  type ProjectFormValues,
} from "@/domains/projects/components/ProjectFormDialog";
import {
  formatDueDate,
  formatNextActionDue,
  isDueOverdue,
  ProjectOperationalAlert,
  ProjectPriorityLabel,
  ProjectStatusBadge,
} from "@/domains/projects/components/ProjectBadges";
import type { ProjectStatus, ProjectWithCompany } from "@/domains/projects/types";
import { PROJECT_STATUSES, STATUS_LABELS } from "@/domains/projects/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { EmptyState, PageHeader, PageSkeleton, OSPage, OSRefreshButton, OSPrimaryButton, FilterToolbar, FilterRow, FilterSearch, FilterPillsRow, FilterPill, DataTable } from "@/os/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "@tanstack/react-router";
import { FolderKanban, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function ProjectListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectWithCompany[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [ownerId, setOwnerId] = useState<TeamMember | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listProjects({
        data: {
          search: search || undefined,
          ...(status !== "all" ? { status } : {}),
          ...(ownerId !== "all" ? { ownerId } : {}),
          sort: "due_date",
          order: "asc",
        },
      });
      setProjects(result.projects);
      setCounts(result.counts as Record<string, number>);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar projetos."));
    } finally {
      setLoading(false);
    }
  }, [search, status, ownerId, navigate]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const handleCreate = async (form: ProjectFormValues) => {
    await createProject({ data: formToPayload(form) });
    await load();
  };

  const handleDelete = async (project: ProjectWithCompany) => {
    await deleteProject({ data: { id: project.id, companyId: project.company_id } });
    await load();
  };

  return (
    <OSPage>
      <PageHeader
        title="Projetos"
        description="Execução por empresa — checklist, prazos e comentários"
        icon={FolderKanban}
        actions={
          <>
            <OSRefreshButton loading={loading} onClick={load} />
            <OSPrimaryButton label="Novo projeto" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      {error && (
        <EmptyState
          title="Não foi possível carregar os projetos"
          description={error}
        />
      )}

      <FilterToolbar>
        <FilterRow>
          <FilterSearch
            value={search}
            onChange={setSearch}
            placeholder="Buscar por título ou empresa..."
          />
          <Select value={ownerId} onValueChange={(v) => setOwnerId(v as typeof ownerId)}>
            <SelectTrigger className="h-9 w-[140px] shrink-0 sm:ml-auto">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {(Object.keys(TEAM_LABELS) as TeamMember[]).map((m) => (
                <SelectItem key={m} value={m}>
                  {TEAM_LABELS[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterRow>
      </FilterToolbar>

      <FilterPillsRow>
        <FilterPill
          active={status === "all"}
          onClick={() => setStatus("all")}
          label={`Todos (${counts.all ?? 0})`}
        />
        {PROJECT_STATUSES.map((s) => (
          <FilterPill
            key={s}
            active={status === s}
            onClick={() => setStatus(s)}
            label={`${STATUS_LABELS[s]} (${counts[s] ?? 0})`}
          />
        ))}
        {(counts.overdue ?? 0) > 0 && (
          <span className="rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-1.5 text-xs font-medium text-red-300">
            {counts.overdue} atrasado(s)
          </span>
        )}
        {(counts.needsAction ?? 0) > 0 && (
          <span className="rounded-lg border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300">
            {counts.needsAction} sem próxima ação
          </span>
        )}
      </FilterPillsRow>

      {loading ? (
        <PageSkeleton title="Projetos" metricCount={0} />
      ) : error ? null : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Nenhum projeto encontrado"
          description="Crie um projeto vinculado a uma empresa para acompanhar a execução."
        />
      ) : (
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Próxima ação</TableHead>
                <TableHead>Resp.</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      to="/os/projetos/$id"
                      params={{ id: project.id }}
                      className="font-medium hover:text-brand"
                    >
                      {project.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/os/empresas/$id"
                      params={{ id: project.company_id }}
                      className="text-sm text-muted-foreground hover:text-brand"
                    >
                      {project.companies?.name ?? "—"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <ProjectStatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    <ProjectPriorityLabel priority={project.priority} />
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        isDueOverdue(project.due_date, project.status)
                          ? "font-medium text-red-400"
                          : ""
                      }
                    >
                      {formatDueDate(project.due_date)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[220px] space-y-1">
                      <p className="truncate text-sm">
                        {project.next_action || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </p>
                      {project.next_action_due && (
                        <p className="text-xs text-muted-foreground">
                          {formatNextActionDue(project.next_action_due)}
                        </p>
                      )}
                      <ProjectOperationalAlert project={project} />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {project.owner_id
                      ? TEAM_LABELS[project.owner_id as TeamMember]
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            <strong>{project.title}</strong> será removido permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(project)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTable>
      )}

      <ProjectFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Novo projeto"
        onSubmit={handleCreate}
      />
    </OSPage>
  );
}
