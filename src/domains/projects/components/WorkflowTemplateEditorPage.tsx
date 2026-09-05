import {
  getWorkflowTemplateDetail,
  saveWorkflowTemplateStructure,
  updateWorkflowTemplateMeta,
} from "@/domains/projects/execution/api.server";
import type { ChecklistItemDef, WorkflowTemplateDetail } from "@/domains/projects/execution/types";
import {
  PRIORITY_LABELS,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  STATUS_LABELS,
  type ProjectPriority,
  type ProjectStatus,
} from "@/domains/projects/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { EmptyState, OSPage, PageHeader, PageSkeleton, Section } from "@/os/ui";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowLeft, ArrowUp, GitBranch, Loader2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type DraftTask = {
  clientId: string;
  key: string;
  title: string;
  description: string;
  defaultPriority: ProjectPriority;
  defaultAssigneeId: TeamMember | "";
  isRecurring: boolean;
  blocksPhaseCompletion: boolean;
  waitingClientDefault: boolean;
  checklist: ChecklistItemDef[];
  dependsOnTaskKeys: string[];
};

type DraftPhase = {
  clientId: string;
  key: string;
  name: string;
  objective: string;
  isRecurring: boolean;
  completionCriteria: string;
  projectStatusOnEnter: ProjectStatus | "";
  deliverablesText: string;
  tasks: DraftTask[];
};

function newId(): string {
  return crypto.randomUUID();
}

function slugKey(value: string, fallback: string): string {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return base || fallback;
}

function detailToDraft(detail: WorkflowTemplateDetail): DraftPhase[] {
  return detail.phases.map((phase) => ({
    clientId: phase.id,
    key: phase.key,
    name: phase.name,
    objective: phase.objective ?? "",
    isRecurring: phase.is_recurring,
    completionCriteria: phase.completion_criteria ?? "",
    projectStatusOnEnter: (phase.project_status_on_enter as ProjectStatus | null) ?? "",
    deliverablesText: phase.deliverables.map((d) => d.title).join("\n"),
    tasks: phase.tasks.map((task) => ({
      clientId: task.id,
      key: task.key,
      title: task.title,
      description: task.description ?? "",
      defaultPriority: task.default_priority,
      defaultAssigneeId: (task.default_assignee_id as TeamMember | null) ?? "",
      isRecurring: task.is_recurring,
      blocksPhaseCompletion: task.blocks_phase_completion,
      waitingClientDefault: task.waiting_client_default,
      checklist: task.checklist_json ?? [],
      dependsOnTaskKeys: task.depends_on_task_keys ?? [],
    })),
  }));
}

function emptyTask(index: number): DraftTask {
  return {
    clientId: newId(),
    key: `tarefa_${index + 1}`,
    title: "",
    description: "",
    defaultPriority: "medium",
    defaultAssigneeId: "",
    isRecurring: false,
    blocksPhaseCompletion: true,
    waitingClientDefault: false,
    checklist: [],
    dependsOnTaskKeys: [],
  };
}

function emptyPhase(index: number): DraftPhase {
  return {
    clientId: newId(),
    key: `fase_${index + 1}`,
    name: `Fase ${index + 1}`,
    objective: "",
    isRecurring: false,
    completionCriteria: "",
    projectStatusOnEnter: "",
    deliverablesText: "",
    tasks: [emptyTask(0)],
  };
}

export function WorkflowTemplateEditorPage({ templateId }: { templateId: string }) {
  const navigate = useNavigate();
  const [detail, setDetail] = useState<WorkflowTemplateDetail | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [phases, setPhases] = useState<DraftPhase[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getWorkflowTemplateDetail({ data: { templateId } });
      if (!data) {
        setError("Template não encontrado.");
        setDetail(null);
        return;
      }
      setDetail(data);
      setName(data.template.name);
      setDescription(data.template.description ?? "");
      setIsActive(data.template.is_active);
      const draft = detailToDraft(data);
      setPhases(draft);
      setSelectedPhaseId(draft[0]?.clientId ?? null);
      setSelectedTaskId(draft[0]?.tasks[0]?.clientId ?? null);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar template."));
    } finally {
      setLoading(false);
    }
  }, [navigate, templateId]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedPhase = useMemo(
    () => phases.find((p) => p.clientId === selectedPhaseId) ?? null,
    [phases, selectedPhaseId],
  );

  const selectedTask = useMemo(() => {
    if (!selectedPhase) return null;
    return selectedPhase.tasks.find((t) => t.clientId === selectedTaskId) ?? null;
  }, [selectedPhase, selectedTaskId]);

  const allTaskOptions = useMemo(
    () =>
      phases.flatMap((phase) =>
        phase.tasks.map((task) => ({
          key: task.key,
          title: task.title || task.key,
          phaseName: phase.name,
          clientId: task.clientId,
        })),
      ),
    [phases],
  );

  const updatePhase = (clientId: string, patch: Partial<DraftPhase>) => {
    setPhases((prev) => prev.map((p) => (p.clientId === clientId ? { ...p, ...patch } : p)));
  };

  const updateTask = (phaseClientId: string, taskClientId: string, patch: Partial<DraftTask>) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.clientId !== phaseClientId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.clientId === taskClientId ? { ...task, ...patch } : task,
          ),
        };
      }),
    );
  };

  const movePhase = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= phases.length) return;
    setPhases((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item!);
      return copy;
    });
  };

  const moveTask = (phaseClientId: string, index: number, dir: -1 | 1) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.clientId !== phaseClientId) return phase;
        const next = index + dir;
        if (next < 0 || next >= phase.tasks.length) return phase;
        const copy = [...phase.tasks];
        const [item] = copy.splice(index, 1);
        copy.splice(next, 0, item!);
        return { ...phase, tasks: copy };
      }),
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome do template.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateWorkflowTemplateMeta({
        data: {
          templateId,
          name: name.trim(),
          description: description.trim() || null,
          isActive,
        },
      });

      const payload = phases.map((phase) => ({
        key: phase.key.trim() || slugKey(phase.name, "fase"),
        name: phase.name.trim(),
        objective: phase.objective.trim() || null,
        isRecurring: phase.isRecurring,
        completionCriteria: phase.completionCriteria.trim() || null,
        projectStatusOnEnter: phase.projectStatusOnEnter || null,
        deliverables: phase.deliverablesText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        tasks: phase.tasks.map((task) => ({
          key: task.key.trim() || slugKey(task.title, "tarefa"),
          title: task.title.trim(),
          description: task.description.trim() || null,
          defaultPriority: task.defaultPriority,
          defaultAssigneeId: task.defaultAssigneeId || null,
          isRecurring: task.isRecurring,
          blocksPhaseCompletion: task.blocksPhaseCompletion,
          waitingClientDefault: task.waitingClientDefault,
          checklist: task.checklist
            .map((item, i) => ({
              ...item,
              id: item.id || `item_${i + 1}`,
              label: item.label.trim(),
              done: false,
            }))
            .filter((item) => item.label.length > 0),
          dependsOnTaskKeys: task.dependsOnTaskKeys,
        })),
      }));

      const saved = await saveWorkflowTemplateStructure({
        data: { templateId, phases: payload },
      });
      setDetail(saved);
      const draft = detailToDraft(saved);
      setPhases(draft);
      setSelectedPhaseId((prev) => {
        const still = draft.find((p) => p.key === selectedPhase?.key);
        return still?.clientId ?? draft[0]?.clientId ?? null;
      });
      toast.success("Template salvo.");
    } catch (err) {
      const message = getErrorMessage(err, "Erro ao salvar template.");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <OSPage>
        <PageSkeleton />
      </OSPage>
    );
  }

  if (!detail) {
    return (
      <OSPage>
        <EmptyState title="Template não encontrado" description={error || undefined} />
        <Button variant="ghost" asChild className="mt-4">
          <Link to="/os/projetos/templates">Voltar</Link>
        </Button>
      </OSPage>
    );
  }

  return (
    <OSPage>
      <PageHeader
        title={name || "Template"}
        description={`Slug: ${detail.template.slug} · ${detail.usageCount} projeto(s) usando`}
        icon={GitBranch}
        actions={
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/os/projetos/templates">
                <ArrowLeft className="mr-1.5 size-4" />
                Templates
              </Link>
            </Button>
            <Button type="button" onClick={() => void handleSave()} disabled={saving}>
              {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </>
        }
      />

      {error && (
        <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Section title="Identidade">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Descrição</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isActive} onCheckedChange={setIsActive} id="template-active" />
            <Label htmlFor="template-active">Ativo na criação de projetos</Label>
          </div>
        </div>
      </Section>

      <div className="mt-6 grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="space-y-2 rounded-lg border border-border/40 p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Fases</p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => {
                const phase = emptyPhase(phases.length);
                setPhases((prev) => [...prev, phase]);
                setSelectedPhaseId(phase.clientId);
                setSelectedTaskId(phase.tasks[0]?.clientId ?? null);
              }}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <ul className="space-y-1">
            {phases.map((phase, index) => (
              <li key={phase.clientId}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhaseId(phase.clientId);
                    setSelectedTaskId(phase.tasks[0]?.clientId ?? null);
                  }}
                  className={
                    phase.clientId === selectedPhaseId
                      ? "w-full rounded-md bg-brand/15 px-2.5 py-2 text-left text-sm font-medium"
                      : "w-full rounded-md px-2.5 py-2 text-left text-sm text-muted-foreground hover:bg-surface/40"
                  }
                >
                  <span className="block truncate">{phase.name || `Fase ${index + 1}`}</span>
                  <span className="text-[11px] opacity-70">{phase.tasks.length} tarefa(s)</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {selectedPhase ? (
          <div className="space-y-4">
            <Section title="Fase selecionada">
              <div className="mb-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    movePhase(
                      phases.findIndex((p) => p.clientId === selectedPhase.clientId),
                      -1,
                    )
                  }
                >
                  <ArrowUp className="mr-1 size-3.5" />
                  Subir
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    movePhase(
                      phases.findIndex((p) => p.clientId === selectedPhase.clientId),
                      1,
                    )
                  }
                >
                  <ArrowDown className="mr-1 size-3.5" />
                  Descer
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  disabled={phases.length <= 1}
                  onClick={() => {
                    const next = phases.filter((p) => p.clientId !== selectedPhase.clientId);
                    setPhases(next);
                    setSelectedPhaseId(next[0]?.clientId ?? null);
                    setSelectedTaskId(next[0]?.tasks[0]?.clientId ?? null);
                  }}
                >
                  <Trash2 className="mr-1 size-3.5" />
                  Remover fase
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Nome</Label>
                  <Input
                    value={selectedPhase.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      updatePhase(selectedPhase.clientId, {
                        name: value,
                        key: selectedPhase.key.startsWith("fase_")
                          ? slugKey(value, selectedPhase.key)
                          : selectedPhase.key,
                      });
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Key (snake_case)</Label>
                  <Input
                    value={selectedPhase.key}
                    onChange={(e) =>
                      updatePhase(selectedPhase.clientId, {
                        key: e.target.value.replace(/[^a-z0-9_]/g, ""),
                      })
                    }
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Objetivo</Label>
                  <Textarea
                    value={selectedPhase.objective}
                    onChange={(e) =>
                      updatePhase(selectedPhase.clientId, { objective: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status do projeto ao entrar</Label>
                  <Select
                    value={selectedPhase.projectStatusOnEnter || "none"}
                    onValueChange={(v) =>
                      updatePhase(selectedPhase.clientId, {
                        projectStatusOnEnter: v === "none" ? "" : (v as ProjectStatus),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {PROJECT_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <Switch
                    checked={selectedPhase.isRecurring}
                    onCheckedChange={(v) => updatePhase(selectedPhase.clientId, { isRecurring: v })}
                    id="phase-recurring"
                  />
                  <Label htmlFor="phase-recurring">Fase recorrente</Label>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Critério de conclusão</Label>
                  <Input
                    value={selectedPhase.completionCriteria}
                    onChange={(e) =>
                      updatePhase(selectedPhase.clientId, {
                        completionCriteria: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Entregáveis (um por linha)</Label>
                  <Textarea
                    value={selectedPhase.deliverablesText}
                    onChange={(e) =>
                      updatePhase(selectedPhase.clientId, {
                        deliverablesText: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
            </Section>

            <Section title="Tarefas da fase">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Keys de tarefa precisam ser únicas em todo o template.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const task = emptyTask(selectedPhase.tasks.length);
                    updatePhase(selectedPhase.clientId, {
                      tasks: [...selectedPhase.tasks, task],
                    });
                    setSelectedTaskId(task.clientId);
                  }}
                >
                  <Plus className="mr-1 size-3.5" />
                  Tarefa
                </Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                <ul className="space-y-1">
                  {selectedPhase.tasks.map((task, index) => (
                    <li key={task.clientId} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedTaskId(task.clientId)}
                        className={
                          task.clientId === selectedTaskId
                            ? "min-w-0 flex-1 truncate rounded-md bg-surface/60 px-2 py-1.5 text-left text-sm"
                            : "min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-surface/30"
                        }
                      >
                        {task.title || `Tarefa ${index + 1}`}
                      </button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        onClick={() => moveTask(selectedPhase.clientId, index, -1)}
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        onClick={() => moveTask(selectedPhase.clientId, index, 1)}
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>

                {selectedTask ? (
                  <div className="space-y-3 rounded-lg border border-border/40 p-3">
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        disabled={selectedPhase.tasks.length <= 1}
                        onClick={() => {
                          const nextTasks = selectedPhase.tasks.filter(
                            (t) => t.clientId !== selectedTask.clientId,
                          );
                          updatePhase(selectedPhase.clientId, { tasks: nextTasks });
                          setSelectedTaskId(nextTasks[0]?.clientId ?? null);
                        }}
                      >
                        <Trash2 className="mr-1 size-3.5" />
                        Remover
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Título</Label>
                        <Input
                          value={selectedTask.title}
                          onChange={(e) => {
                            const value = e.target.value;
                            updateTask(selectedPhase.clientId, selectedTask.clientId, {
                              title: value,
                              key: selectedTask.key.startsWith("tarefa_")
                                ? slugKey(value, selectedTask.key)
                                : selectedTask.key,
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Key</Label>
                        <Input
                          value={selectedTask.key}
                          onChange={(e) =>
                            updateTask(selectedPhase.clientId, selectedTask.clientId, {
                              key: e.target.value.replace(/[^a-z0-9_]/g, ""),
                            })
                          }
                          className="font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label>Descrição</Label>
                        <Textarea
                          value={selectedTask.description}
                          onChange={(e) =>
                            updateTask(selectedPhase.clientId, selectedTask.clientId, {
                              description: e.target.value,
                            })
                          }
                          rows={2}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Prioridade padrão</Label>
                        <Select
                          value={selectedTask.defaultPriority}
                          onValueChange={(v) =>
                            updateTask(selectedPhase.clientId, selectedTask.clientId, {
                              defaultPriority: v as ProjectPriority,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_PRIORITIES.map((p) => (
                              <SelectItem key={p} value={p}>
                                {PRIORITY_LABELS[p]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Responsável padrão</Label>
                        <Select
                          value={selectedTask.defaultAssigneeId || "none"}
                          onValueChange={(v) =>
                            updateTask(selectedPhase.clientId, selectedTask.clientId, {
                              defaultAssigneeId: v === "none" ? "" : (v as TeamMember),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Dono do projeto" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Dono do projeto</SelectItem>
                            {(Object.keys(TEAM_LABELS) as TeamMember[]).map((member) => (
                              <SelectItem key={member} value={member}>
                                {TEAM_LABELS[member]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={selectedTask.waitingClientDefault}
                          onCheckedChange={(v) =>
                            updateTask(selectedPhase.clientId, selectedTask.clientId, {
                              waitingClientDefault: v === true,
                            })
                          }
                        />
                        Aguarda cliente
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={selectedTask.blocksPhaseCompletion}
                          onCheckedChange={(v) =>
                            updateTask(selectedPhase.clientId, selectedTask.clientId, {
                              blocksPhaseCompletion: v === true,
                            })
                          }
                        />
                        Bloqueia fase
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={selectedTask.isRecurring}
                          onCheckedChange={(v) =>
                            updateTask(selectedPhase.clientId, selectedTask.clientId, {
                              isRecurring: v === true,
                            })
                          }
                        />
                        Recorrente
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Depende de</Label>
                      <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-border/40 p-2">
                        {allTaskOptions
                          .filter((opt) => opt.clientId !== selectedTask.clientId)
                          .map((opt) => {
                            const checked = selectedTask.dependsOnTaskKeys.includes(opt.key);
                            return (
                              <label key={opt.clientId} className="flex items-start gap-2 text-sm">
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(v) => {
                                    const next = new Set(selectedTask.dependsOnTaskKeys);
                                    if (v === true) next.add(opt.key);
                                    else next.delete(opt.key);
                                    updateTask(selectedPhase.clientId, selectedTask.clientId, {
                                      dependsOnTaskKeys: [...next],
                                    });
                                  }}
                                />
                                <span>
                                  <span className="font-medium">{opt.title}</span>
                                  <span className="ml-1 text-xs text-muted-foreground">
                                    ({opt.phaseName} · {opt.key})
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        {allTaskOptions.length <= 1 && (
                          <p className="text-xs text-muted-foreground">
                            Adicione mais tarefas para criar dependências.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label>Checklist</Label>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateTask(selectedPhase.clientId, selectedTask.clientId, {
                              checklist: [
                                ...selectedTask.checklist,
                                {
                                  id: `item_${selectedTask.checklist.length + 1}`,
                                  label: "",
                                  done: false,
                                },
                              ],
                            })
                          }
                        >
                          <Plus className="mr-1 size-3.5" />
                          Item
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {selectedTask.checklist.map((item, idx) => (
                          <div key={`${item.id}-${idx}`} className="flex gap-2">
                            <Input
                              value={item.label}
                              placeholder="Item do checklist"
                              onChange={(e) => {
                                const checklist = selectedTask.checklist.map((c, i) =>
                                  i === idx ? { ...c, label: e.target.value } : c,
                                );
                                updateTask(selectedPhase.clientId, selectedTask.clientId, {
                                  checklist,
                                });
                              }}
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                updateTask(selectedPhase.clientId, selectedTask.clientId, {
                                  checklist: selectedTask.checklist.filter((_, i) => i !== idx),
                                })
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState title="Selecione uma tarefa" />
                )}
              </div>
            </Section>
          </div>
        ) : (
          <EmptyState title="Adicione uma fase para começar" />
        )}
      </div>

      {saving && (
        <div className="pointer-events-none fixed bottom-6 right-6 flex items-center gap-2 rounded-full border border-border/50 bg-background/90 px-3 py-2 text-sm shadow-lg">
          <Loader2 className="size-4 animate-spin" />
          Salvando…
        </div>
      )}
    </OSPage>
  );
}
