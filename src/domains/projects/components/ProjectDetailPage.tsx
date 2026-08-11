import {
  addChecklistItem,
  addProjectComment,
  deleteChecklistItem,
  deleteProjectComment,
  getProject,
  updateChecklistItem,
  updateProject,
} from "@/domains/projects/api.server";
import {
  formatDueDate,
  isDueOverdue,
  ProjectPriorityLabel,
  ProjectStatusBadge,
} from "@/domains/projects/components/ProjectBadges";
import {
  formToPayload,
  ProjectFormDialog,
  projectToFormValues,
  type ProjectFormValues,
} from "@/domains/projects/components/ProjectFormDialog";
import type { ProjectChecklistItem, ProjectComment } from "@/domains/projects/types";
import { TYPE_LABELS } from "@/domains/projects/types";
import { TEAM_LABELS } from "@/lib/auth/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { PageHeader, PageSkeleton, Section, OSPage } from "@/os/ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FolderKanban, Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function ProjectDetailPage({ projectId }: { projectId: string }) {
  const navigate = useNavigate();
  const [data, setData] = useState<Awaited<ReturnType<typeof getProject>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getProject({ data: { id: projectId } });
      setData(result);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar projeto."));
    } finally {
      setLoading(false);
    }
  }, [projectId, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <PageSkeleton title="Projeto" metricCount={0} />;
  }

  if (error || !data) {
    return (
      <OSPage>
        <Link to="/os/projetos" className="dashboard-btn-ghost w-fit">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <p className="text-sm text-destructive">
          {error || "Projeto não encontrado."}
        </p>
      </OSPage>
    );
  }

  const { project, company, checklist, comments } = data;
  const overdue = isDueOverdue(project.due_date, project.status);
  const doneCount = checklist.filter((i) => i.done).length;

  const handleEdit = async (form: ProjectFormValues) => {
    await updateProject({
      data: { id: projectId, ...formToPayload(form) },
    });
    toast.success("Projeto atualizado");
    await load();
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    await addChecklistItem({
      data: { projectId, companyId: project.company_id, text: newItem.trim() },
    });
    setNewItem("");
    await load();
  };

  const handleToggleItem = async (item: ProjectChecklistItem) => {
    await updateChecklistItem({
      data: {
        id: item.id,
        projectId,
        companyId: project.company_id,
        done: !item.done,
      },
    });
    await load();
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteChecklistItem({
      data: { id: itemId, projectId, companyId: project.company_id },
    });
    await load();
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await addProjectComment({
      data: { projectId, companyId: project.company_id, body: newComment.trim() },
    });
    setNewComment("");
    toast.success("Comentário adicionado");
    await load();
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteProjectComment({
      data: { id: commentId, projectId, companyId: project.company_id },
    });
    await load();
  };

  return (
    <OSPage>
      <Link to="/os/projetos" className="dashboard-btn-ghost w-fit">
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <PageHeader
        title={project.title}
        description={
          company
            ? `${company.name} · ${TYPE_LABELS[project.type]}`
            : TYPE_LABELS[project.type]
        }
        icon={FolderKanban}
        actions={
          <>
            {company && (
              <Link
                to="/os/empresas/$id"
                params={{ id: company.id }}
                className="dashboard-btn-ghost"
              >
                Ver empresa
              </Link>
            )}
            <button type="button" onClick={() => setEditOpen(true)} className="dashboard-btn-ghost">
              <Pencil className="h-4 w-4" />
              Editar
            </button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <ProjectStatusBadge status={project.status} />
        <ProjectPriorityLabel priority={project.priority} />
        <span className={`text-sm ${overdue ? "font-medium text-red-400" : "text-muted-foreground"}`}>
          Prazo: {formatDueDate(project.due_date)}
          {overdue && " · Atrasado"}
        </span>
        {project.owner_id && (
          <span className="text-sm text-muted-foreground">
            {TEAM_LABELS[project.owner_id as keyof typeof TEAM_LABELS]}
          </span>
        )}
      </div>

      {project.description && (
        <Section title="Descrição">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </Section>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Section
          title="Checklist"
          action={
            checklist.length > 0 ? (
              <span className="text-xs text-muted-foreground">
                {doneCount}/{checklist.length}
              </span>
            ) : undefined
          }
        >
          <form onSubmit={handleAddItem} className="mb-4 flex gap-2">
            <Input
              placeholder="Novo item..."
              className="h-9"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <Button type="submit" size="sm" disabled={!newItem.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
          {checklist.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum item no checklist.</p>
          ) : (
            <ul>
              {checklist.map((item) => (
                <li key={item.id} className="os-list-row">
                  <Checkbox
                    checked={item.done}
                    onCheckedChange={() => handleToggleItem(item)}
                    className="mt-0.5"
                  />
                  <span
                    className={`flex-1 text-[13px] ${item.done ? "text-muted-foreground/70 line-through" : "text-foreground/90"}`}
                  >
                    {item.text}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Comentários">
          <form onSubmit={handleAddComment} className="mb-4 space-y-2">
            <Textarea
              placeholder="Adicionar comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
            />
            <Button type="submit" size="sm" disabled={!newComment.trim()}>
              Comentar
            </Button>
          </form>
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum comentário.</p>
          ) : (
            <ul className="space-y-3">
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  onDelete={() => handleDeleteComment(c.id)}
                />
              ))}
            </ul>
          )}
        </Section>
      </div>

      <ProjectFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Editar projeto"
        initial={projectToFormValues(project)}
        onSubmit={handleEdit}
      />
    </OSPage>
  );
}

function CommentItem({
  comment,
  onDelete,
}: {
  comment: ProjectComment;
  onDelete: () => void;
}) {
  const date = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(comment.created_at));

  return (
    <li className="rounded-lg border border-border/20 bg-surface-elevated/30 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground/90">{comment.body}</p>
        <Button size="sm" variant="ghost" className="shrink-0 text-destructive" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        {comment.author_id
          ? TEAM_LABELS[comment.author_id as keyof typeof TEAM_LABELS]
          : "Sistema"}{" "}
        · {date}
      </p>
    </li>
  );
}
