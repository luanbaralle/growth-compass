import {
  createWorkflowTemplate,
  deactivateWorkflowTemplate,
  deleteWorkflowTemplate,
  duplicateWorkflowTemplate,
  listTemplatesForStudio,
} from "@/domains/projects/execution/api.server";
import type { TemplateStudioListItem } from "@/domains/projects/execution/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import {
  EmptyState,
  OSPage,
  OSPrimaryButton,
  OSRefreshButton,
  PageHeader,
  PageSkeleton,
} from "@/os/ui";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy, GitBranch, Loader2, Plus, Power, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function WorkflowTemplateListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<TemplateStudioListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await listTemplatesForStudio();
      setItems(rows);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar templates."));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const detail = await createWorkflowTemplate({
        data: { name: name.trim(), description: description.trim() || null },
      });
      setCreateOpen(false);
      setName("");
      setDescription("");
      navigate({
        to: "/os/projetos/templates/$id",
        params: { id: detail.template.id },
      });
    } catch (err) {
      setError(getErrorMessage(err, "Erro ao criar template."));
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (item: TemplateStudioListItem) => {
    try {
      const detail = await duplicateWorkflowTemplate({
        data: { templateId: item.id },
      });
      navigate({
        to: "/os/projetos/templates/$id",
        params: { id: detail.template.id },
      });
    } catch (err) {
      setError(getErrorMessage(err, "Erro ao duplicar template."));
    }
  };

  const handleDeactivate = async (item: TemplateStudioListItem) => {
    try {
      await deactivateWorkflowTemplate({ data: { templateId: item.id } });
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Erro ao desativar template."));
    }
  };

  const handleDelete = async (item: TemplateStudioListItem) => {
    try {
      await deleteWorkflowTemplate({ data: { templateId: item.id } });
      await load();
    } catch (err) {
      setError(getErrorMessage(err, "Erro ao apagar template."));
    }
  };

  return (
    <OSPage>
      <PageHeader
        title="Templates de workflow"
        description="Crie e edite formatos de projeto — fases, tarefas e dependências"
        icon={GitBranch}
        actions={
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/os/projetos">
                <ArrowLeft className="mr-1.5 size-4" />
                Projetos
              </Link>
            </Button>
            <OSRefreshButton loading={loading} onClick={load} />
            <OSPrimaryButton label="Novo template" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      {error && <EmptyState title="Algo deu errado" description={error} />}

      {loading ? (
        <PageSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nenhum template"
          description="Crie o primeiro formato de workflow para projetos."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Fases</TableHead>
                <TableHead>Tarefas</TableHead>
                <TableHead>Em uso</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link
                      to="/os/projetos/templates/$id"
                      params={{ id: item.id }}
                      className="font-medium hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    {item.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.slug}
                  </TableCell>
                  <TableCell className="tabular-nums text-sm">{item.phaseCount}</TableCell>
                  <TableCell className="tabular-nums text-sm">{item.taskCount}</TableCell>
                  <TableCell className="tabular-nums text-sm">{item.usageCount}</TableCell>
                  <TableCell>
                    <span
                      className={
                        item.is_active
                          ? "text-xs text-emerald-300"
                          : "text-xs text-muted-foreground"
                      }
                    >
                      {item.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Duplicar"
                        onClick={() => void handleDuplicate(item)}
                      >
                        <Copy className="size-4" />
                      </Button>
                      {item.is_active && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" title="Desativar">
                              <Power className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Desativar template?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ele deixa de aparecer na criação de projetos. Projetos que já usam
                                este template continuam intactos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => void handleDeactivate(item)}>
                                Desativar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {item.usageCount === 0 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              title="Apagar"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Apagar template?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Isso remove permanentemente “{item.name}” e todas as fases/tarefas.
                                Não dá para desfazer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => void handleDelete(item)}>
                                Apagar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo template de workflow</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Landing Page"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Quando usar este formato"
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving || !name.trim()}>
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}
                Criar e editar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </OSPage>
  );
}
