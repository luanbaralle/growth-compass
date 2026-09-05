import type { TeamMember } from "@/lib/auth/types";
import type { Project, ProjectStatus } from "../types";
import * as projectRepo from "../repository.server";
import {
  emitProjectStatusChanged,
  emitProjectWaitingClient,
  emitWorkflowPhaseActivated,
  emitWorkflowPhaseCompleted,
  emitWorkflowStarted,
  emitWorkflowTaskCompleted,
  emitWorkflowTaskStatusChanged,
} from "../project-domain-events.server";
import {
  computeWorkflowProgress,
  enrichTasksWithDependencies,
  phaseIsComplete,
  pickNextActions,
  pickPendencies,
  pickPhasePrimaryAction,
  waitingClientDays,
} from "./progress";
import * as repo from "./repository.server";
import { AQUISICAO_DIGITAL_TEMPLATE } from "./template-aquisicao-digital";
import type {
  BriefingStatus,
  ChecklistItemDef,
  ExecutionDashboardStats,
  ProjectBriefing,
  ProjectExecutionView,
  ProjectWorkflowTask,
  TemplatePhaseDef,
  TemplateStudioListItem,
  WorkflowTaskStatus,
  WorkflowTemplate,
  WorkflowTemplateDefinition,
  WorkflowTemplateDetail,
} from "./types";
import type { ProjectPriority, ProjectStatus } from "../types";

const BUILTIN_TEMPLATES: WorkflowTemplateDefinition[] = [AQUISICAO_DIGITAL_TEMPLATE];

function slugifyTemplateName(name: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || "template";
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let candidate = base;
  let n = 2;
  while (await repo.findTemplateBySlug(candidate)) {
    candidate = `${base.slice(0, 70)}-${n}`;
    n += 1;
  }
  return candidate;
}

function assertUniqueStructureKeys(phases: TemplatePhaseDef[]): void {
  const phaseKeys = new Set<string>();
  const taskKeys = new Set<string>();
  for (const phase of phases) {
    if (phaseKeys.has(phase.key)) {
      throw new Error(`Fase duplicada: "${phase.key}". Keys de fase devem ser únicas.`);
    }
    phaseKeys.add(phase.key);
    for (const task of phase.tasks) {
      if (taskKeys.has(task.key)) {
        throw new Error(
          `Tarefa duplicada: "${task.key}". Keys de tarefa devem ser únicas no template todo.`,
        );
      }
      taskKeys.add(task.key);
    }
  }
  for (const phase of phases) {
    for (const task of phase.tasks) {
      for (const dep of task.dependsOnTaskKeys) {
        if (!taskKeys.has(dep)) {
          throw new Error(
            `Dependência inválida em "${task.key}": tarefa "${dep}" não existe no template.`,
          );
        }
        if (dep === task.key) {
          throw new Error(`Tarefa "${task.key}" não pode depender de si mesma.`);
        }
      }
    }
  }
}

async function writeTemplatePhases(templateId: string, phases: TemplatePhaseDef[]): Promise<void> {
  assertUniqueStructureKeys(phases);
  await repo.deleteTemplatePhasesByTemplateId(templateId);

  for (let i = 0; i < phases.length; i++) {
    const phaseDef = phases[i]!;
    const phase = await repo.insertTemplatePhase({
      template_id: templateId,
      key: phaseDef.key,
      name: phaseDef.name,
      objective: phaseDef.objective,
      sort_order: i,
      is_recurring: phaseDef.isRecurring,
      completion_criteria: phaseDef.completionCriteria,
      project_status_on_enter: phaseDef.projectStatusOnEnter,
    });

    for (let j = 0; j < phaseDef.tasks.length; j++) {
      const taskDef = phaseDef.tasks[j]!;
      await repo.insertTemplateTask({
        phase_id: phase.id,
        key: taskDef.key,
        title: taskDef.title,
        description: taskDef.description,
        sort_order: j,
        default_priority: taskDef.defaultPriority,
        default_assignee_id: taskDef.defaultAssigneeId,
        is_recurring: taskDef.isRecurring,
        blocks_phase_completion: taskDef.blocksPhaseCompletion,
        waiting_client_default: taskDef.waitingClientDefault,
        checklist_json: taskDef.checklist,
        depends_on_task_keys: taskDef.dependsOnTaskKeys,
      });
    }

    for (let d = 0; d < phaseDef.deliverables.length; d++) {
      await repo.insertTemplateDeliverable({
        phase_id: phase.id,
        title: phaseDef.deliverables[d]!,
        sort_order: d,
      });
    }
  }
}

async function loadTemplateDetail(templateId: string): Promise<WorkflowTemplateDetail | null> {
  const template = await repo.findTemplateById(templateId);
  if (!template) return null;

  const phases = await repo.findTemplatePhases(template.id);
  const phaseIds = phases.map((p) => p.id);
  const [tasks, deliverables, usageCount] = await Promise.all([
    repo.findTemplateTasks(phaseIds),
    repo.findTemplateDeliverables(phaseIds),
    repo.countWorkflowsByTemplateId(template.id),
  ]);

  return {
    template,
    usageCount,
    phases: phases.map((phase) => ({
      ...phase,
      tasks: tasks.filter((t) => t.phase_id === phase.id),
      deliverables: deliverables.filter((d) => d.phase_id === phase.id),
    })),
  };
}

export async function ensureBuiltinTemplates(): Promise<void> {
  for (const def of BUILTIN_TEMPLATES) {
    await ensureTemplate(def);
  }
}

export async function ensureTemplate(def: WorkflowTemplateDefinition): Promise<WorkflowTemplate> {
  const existing = await repo.findTemplateBySlug(def.slug);
  if (existing) {
    const phases = await repo.findTemplatePhases(existing.id);
    if (phases.length > 0) return existing;
  }

  const template =
    existing ??
    (await repo.insertTemplate({
      slug: def.slug,
      name: def.name,
      description: def.description,
      is_active: true,
    }));

  await writeTemplatePhases(template.id, def.phases);
  return template;
}

export async function listWorkflowTemplates(): Promise<WorkflowTemplate[]> {
  await ensureBuiltinTemplates();
  return repo.listActiveTemplates();
}

export async function listTemplatesForStudio(): Promise<TemplateStudioListItem[]> {
  await ensureBuiltinTemplates();
  const templates = await repo.listAllTemplates();
  const items: TemplateStudioListItem[] = [];

  for (const template of templates) {
    const phases = await repo.findTemplatePhases(template.id);
    const tasks = await repo.findTemplateTasks(phases.map((p) => p.id));
    const usageCount = await repo.countWorkflowsByTemplateId(template.id);
    items.push({
      ...template,
      phaseCount: phases.length,
      taskCount: tasks.length,
      usageCount,
    });
  }

  return items;
}

export async function getWorkflowTemplateDetail(
  templateId: string,
): Promise<WorkflowTemplateDetail | null> {
  await ensureBuiltinTemplates();
  return loadTemplateDetail(templateId);
}

export async function createWorkflowTemplate(input: {
  name: string;
  description?: string | null;
  slug?: string;
}): Promise<WorkflowTemplateDetail> {
  await ensureBuiltinTemplates();
  const slug = await ensureUniqueSlug(input.slug ?? slugifyTemplateName(input.name));
  const template = await repo.insertTemplate({
    slug,
    name: input.name.trim(),
    description: input.description?.trim() || null,
    is_active: true,
  });

  await writeTemplatePhases(template.id, [
    {
      key: "fase_1",
      name: "Fase 1",
      objective: "Descreva o objetivo desta fase.",
      isRecurring: false,
      completionCriteria: null,
      projectStatusOnEnter: "in_progress",
      deliverables: [],
      tasks: [
        {
          key: "primeira_tarefa",
          title: "Primeira tarefa",
          description: null,
          defaultPriority: "medium",
          defaultAssigneeId: null,
          isRecurring: false,
          blocksPhaseCompletion: true,
          waitingClientDefault: false,
          checklist: [],
          dependsOnTaskKeys: [],
        },
      ],
    },
  ]);

  const detail = await loadTemplateDetail(template.id);
  if (!detail) throw new Error("Falha ao criar template.");
  return detail;
}

export async function updateWorkflowTemplateMeta(input: {
  templateId: string;
  name?: string;
  description?: string | null;
  isActive?: boolean;
}): Promise<WorkflowTemplateDetail> {
  const existing = await repo.findTemplateById(input.templateId);
  if (!existing) throw new Error("Template não encontrado.");

  const patched = await repo.patchTemplate(input.templateId, {
    ...(input.name !== undefined ? { name: input.name.trim() } : {}),
    ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
    ...(input.isActive !== undefined ? { is_active: input.isActive } : {}),
  });
  if (!patched) throw new Error("Falha ao atualizar template.");

  const detail = await loadTemplateDetail(input.templateId);
  if (!detail) throw new Error("Template não encontrado.");
  return detail;
}

export async function saveWorkflowTemplateStructure(input: {
  templateId: string;
  phases: Array<{
    key: string;
    name: string;
    objective?: string | null;
    isRecurring?: boolean;
    completionCriteria?: string | null;
    projectStatusOnEnter?: ProjectStatus | null;
    deliverables?: string[];
    tasks: Array<{
      key: string;
      title: string;
      description?: string | null;
      defaultPriority?: ProjectPriority;
      defaultAssigneeId?: import("@/lib/auth/types").TeamMember | null;
      isRecurring?: boolean;
      blocksPhaseCompletion?: boolean;
      waitingClientDefault?: boolean;
      checklist?: ChecklistItemDef[];
      dependsOnTaskKeys?: string[];
    }>;
  }>;
}): Promise<WorkflowTemplateDetail> {
  const existing = await repo.findTemplateById(input.templateId);
  if (!existing) throw new Error("Template não encontrado.");

  const phases: TemplatePhaseDef[] = input.phases.map((phase) => ({
    key: phase.key,
    name: phase.name.trim(),
    objective: phase.objective?.trim() || "",
    isRecurring: phase.isRecurring ?? false,
    completionCriteria: phase.completionCriteria?.trim() || null,
    projectStatusOnEnter: phase.projectStatusOnEnter ?? null,
    deliverables: (phase.deliverables ?? []).map((d) => d.trim()).filter(Boolean),
    tasks: phase.tasks.map((task) => ({
      key: task.key,
      title: task.title.trim(),
      description: task.description?.trim() || null,
      defaultPriority: task.defaultPriority ?? "medium",
      defaultAssigneeId: task.defaultAssigneeId ?? null,
      isRecurring: task.isRecurring ?? false,
      blocksPhaseCompletion: task.blocksPhaseCompletion ?? true,
      waitingClientDefault: task.waitingClientDefault ?? false,
      checklist: task.checklist ?? [],
      dependsOnTaskKeys: task.dependsOnTaskKeys ?? [],
    })),
  }));

  await writeTemplatePhases(input.templateId, phases);
  await repo.patchTemplate(input.templateId, {});

  const detail = await loadTemplateDetail(input.templateId);
  if (!detail) throw new Error("Falha ao salvar estrutura do template.");
  return detail;
}

export async function duplicateWorkflowTemplate(input: {
  templateId: string;
  name?: string;
}): Promise<WorkflowTemplateDetail> {
  const source = await loadTemplateDetail(input.templateId);
  if (!source) throw new Error("Template não encontrado.");

  const name = (input.name?.trim() || `${source.template.name} (cópia)`).slice(0, 160);
  const slug = await ensureUniqueSlug(slugifyTemplateName(name));
  const template = await repo.insertTemplate({
    slug,
    name,
    description: source.template.description,
    is_active: true,
  });

  await writeTemplatePhases(
    template.id,
    source.phases.map((phase) => ({
      key: phase.key,
      name: phase.name,
      objective: phase.objective ?? "",
      isRecurring: phase.is_recurring,
      completionCriteria: phase.completion_criteria,
      projectStatusOnEnter: phase.project_status_on_enter as ProjectStatus | null,
      deliverables: phase.deliverables.map((d) => d.title),
      tasks: phase.tasks.map((task) => ({
        key: task.key,
        title: task.title,
        description: task.description,
        defaultPriority: task.default_priority,
        defaultAssigneeId: task.default_assignee_id as import("@/lib/auth/types").TeamMember | null,
        isRecurring: task.is_recurring,
        blocksPhaseCompletion: task.blocks_phase_completion,
        waitingClientDefault: task.waiting_client_default,
        checklist: task.checklist_json,
        dependsOnTaskKeys: task.depends_on_task_keys,
      })),
    })),
  );

  const detail = await loadTemplateDetail(template.id);
  if (!detail) throw new Error("Falha ao duplicar template.");
  return detail;
}

export async function deactivateWorkflowTemplate(
  templateId: string,
): Promise<WorkflowTemplateDetail> {
  return updateWorkflowTemplateMeta({ templateId, isActive: false });
}

export async function deleteWorkflowTemplate(templateId: string): Promise<void> {
  const existing = await repo.findTemplateById(templateId);
  if (!existing) throw new Error("Template não encontrado.");

  const usageCount = await repo.countWorkflowsByTemplateId(templateId);
  if (usageCount > 0) {
    throw new Error(
      `Não é possível apagar: ${usageCount} projeto(s) ainda usam este template. Desative-o em vez disso.`,
    );
  }

  await repo.deleteTemplate(templateId);
}

export async function getProjectExecution(projectId: string): Promise<ProjectExecutionView | null> {
  const workflow = await repo.findWorkflowByProjectId(projectId);
  if (!workflow) return null;

  const [phases, tasks, deliverables, briefing, template] = await Promise.all([
    repo.findWorkflowPhases(workflow.id),
    repo.findWorkflowTasks(workflow.id),
    repo.findDeliverablesByProject(projectId),
    repo.findBriefingByProject(projectId),
    repo.findTemplateById(workflow.template_id),
  ]);

  if (!template) return null;

  const deps = await repo.findTaskDependencies(tasks.map((t) => t.id));
  const enriched = enrichTasksWithDependencies(tasks, phases, deps);
  const progress = computeWorkflowProgress(phases, tasks, workflow.current_phase_key);
  const currentPhase =
    phases.find((p) => p.key === workflow.current_phase_key) ??
    phases.find((p) => p.status === "active") ??
    null;

  const phasePrimary = pickPhasePrimaryAction(enriched, currentPhase?.id);
  const phaseScopedNext = phasePrimary
    ? [
        phasePrimary,
        ...pickNextActions(
          enriched.filter(
            (t) =>
              t.phase_id === currentPhase?.id &&
              t.id !== phasePrimary.id &&
              t.status !== "waiting_client",
          ),
          4,
        ),
      ]
    : pickNextActions(
        enriched.filter((t) => t.phase_id === currentPhase?.id),
        5,
      );

  return {
    workflow,
    template,
    phases,
    tasks: enriched,
    deliverables,
    progress,
    currentPhase,
    nextActions: phaseScopedNext,
    pendencies: pickPendencies(enriched).filter(
      (t) => t.phase_id === currentPhase?.id || t.status === "waiting_client",
    ),
    waitingClientDays: waitingClientDays(tasks),
    briefing,
  };
}

export async function applyWorkflowTemplate(
  projectId: string,
  templateSlug: string | undefined,
  authorId: TeamMember | null,
): Promise<ProjectExecutionView | null> {
  const project = await projectRepo.findProjectById(projectId);
  if (!project) throw new Error("Projeto não encontrado.");

  const existing = await repo.findWorkflowByProjectId(projectId);
  if (existing) throw new Error("Este projeto já possui um workflow.");

  await ensureBuiltinTemplates();
  const slug = templateSlug ?? AQUISICAO_DIGITAL_TEMPLATE.slug;
  const template = await repo.findTemplateBySlug(slug);
  if (!template) throw new Error("Template de workflow não encontrado.");

  const templatePhases = await repo.findTemplatePhases(template.id);
  const templateTasks = await repo.findTemplateTasks(templatePhases.map((p) => p.id));
  const templateDeliverables = await repo.findTemplateDeliverables(templatePhases.map((p) => p.id));

  const firstPhase = templatePhases[0];
  const workflow = await repo.insertWorkflow({
    project_id: projectId,
    template_id: template.id,
    status: "active",
    current_phase_key: firstPhase?.key ?? null,
    started_at: new Date().toISOString(),
    completed_at: null,
  });

  const phaseIdByKey = new Map<string, string>();
  const now = new Date().toISOString();

  for (const tp of templatePhases) {
    const isFirst = tp.key === firstPhase?.key;
    const phase = await repo.insertWorkflowPhase({
      workflow_id: workflow.id,
      key: tp.key,
      name: tp.name,
      objective: tp.objective,
      sort_order: tp.sort_order,
      status: isFirst ? "active" : "pending",
      is_recurring: tp.is_recurring,
      completion_criteria: tp.completion_criteria,
      project_status_on_enter: tp.project_status_on_enter,
      owner_id: project.owner_id,
      started_at: isFirst ? now : null,
      completed_at: null,
    });
    phaseIdByKey.set(tp.key, phase.id);

    const phaseDeliverables = templateDeliverables.filter((d) => d.phase_id === tp.id);
    for (const d of phaseDeliverables) {
      await repo.insertDeliverable({
        project_id: projectId,
        phase_id: phase.id,
        title: d.title,
        status: "pending",
        sort_order: d.sort_order,
        completed_at: null,
      });
    }
  }

  const taskIdByKey = new Map<string, string>();
  const tasksByPhaseId = new Map<string, typeof templateTasks>();
  for (const tt of templateTasks) {
    const list = tasksByPhaseId.get(tt.phase_id) ?? [];
    list.push(tt);
    tasksByPhaseId.set(tt.phase_id, list);
  }

  for (const tp of templatePhases) {
    const phaseId = phaseIdByKey.get(tp.key)!;
    const ttasks = tasksByPhaseId.get(tp.id) ?? [];
    for (const tt of ttasks) {
      const created = await repo.insertWorkflowTask({
        workflow_id: workflow.id,
        phase_id: phaseId,
        key: tt.key,
        title: tt.title,
        description: tt.description,
        sort_order: tt.sort_order,
        status: "todo",
        priority: tt.default_priority,
        assignee_id: tt.default_assignee_id ?? project.owner_id,
        due_date: null,
        checklist_json: tt.checklist_json as ChecklistItemDef[],
        is_recurring: tt.is_recurring,
        blocks_phase_completion: tt.blocks_phase_completion,
        dependency_override: false,
        waiting_client_name: null,
        waiting_client_since: null,
        waiting_client_due: null,
        notes: null,
        origin: "template",
        completed_at: null,
      });
      taskIdByKey.set(tt.key, created.id);
    }
  }

  for (const tt of templateTasks) {
    const taskId = taskIdByKey.get(tt.key);
    if (!taskId) continue;
    for (const depKey of tt.depends_on_task_keys) {
      const depId = taskIdByKey.get(depKey);
      if (!depId) continue;
      await repo.insertTaskDependency({
        task_id: taskId,
        depends_on_task_id: depId,
      });
    }
  }

  const enterStatus = (firstPhase?.project_status_on_enter ?? "formalization") as ProjectStatus;
  let updatedProject = project;
  if (project.status !== enterStatus) {
    updatedProject =
      (await projectRepo.patchProject(projectId, {
        status: enterStatus,
        start_date: project.start_date ?? now.slice(0, 10),
      })) ?? project;
    await emitProjectStatusChanged(updatedProject, project.status, enterStatus, authorId);
  }

  await syncProjectNextAction(updatedProject, workflow.id, authorId);
  await emitWorkflowStarted(updatedProject, template.name, authorId);
  if (firstPhase) {
    await emitWorkflowPhaseActivated(updatedProject, firstPhase.name, authorId);
  }

  return getProjectExecution(projectId);
}

async function syncProjectNextAction(
  project: Project,
  workflowId: string,
  _authorId: TeamMember | null,
): Promise<Project> {
  const phases = await repo.findWorkflowPhases(workflowId);
  const tasks = await repo.findWorkflowTasks(workflowId);
  const deps = await repo.findTaskDependencies(tasks.map((t) => t.id));
  const enriched = enrichTasksWithDependencies(tasks, phases, deps);
  const workflow = await repo.findWorkflowById(workflowId);
  const currentPhase =
    phases.find((p) => p.key === workflow?.current_phase_key) ??
    phases.find((p) => p.status === "active") ??
    null;
  const next = pickPhasePrimaryAction(enriched, currentPhase?.id);

  const nextAction = next?.title ?? null;
  const nextActionDue = next?.due_date ?? next?.waiting_client_due ?? null;

  if (nextAction === project.next_action && nextActionDue === project.next_action_due) {
    return project;
  }

  const patched = await projectRepo.patchProject(project.id, {
    next_action: nextAction,
    next_action_due: nextActionDue,
  });

  return patched ?? project;
}

export async function completeWorkflowTask(
  projectId: string,
  taskId: string,
  authorId: TeamMember | null,
  overrideDependencies = false,
): Promise<ProjectExecutionView | null> {
  return updateWorkflowTask(
    projectId,
    taskId,
    {
      status: "done",
      dependencyOverride: overrideDependencies || undefined,
    },
    authorId,
  );
}

export async function updateWorkflowTask(
  projectId: string,
  taskId: string,
  patch: {
    status?: WorkflowTaskStatus;
    priority?: ProjectWorkflowTask["priority"];
    assigneeId?: TeamMember | null;
    dueDate?: string | null;
    notes?: string | null;
    checklistJson?: ChecklistItemDef[];
    dependencyOverride?: boolean;
    waitingClientName?: string | null;
    waitingClientDue?: string | null;
  },
  authorId: TeamMember | null,
): Promise<ProjectExecutionView | null> {
  const project = await projectRepo.findProjectById(projectId);
  if (!project) throw new Error("Projeto não encontrado.");

  const workflow = await repo.findWorkflowByProjectId(projectId);
  if (!workflow) throw new Error("Workflow não encontrado.");

  const task = await repo.findWorkflowTaskById(taskId);
  if (!task || task.workflow_id !== workflow.id) {
    throw new Error("Tarefa não encontrada.");
  }

  const phases = await repo.findWorkflowPhases(workflow.id);
  const allTasks = await repo.findWorkflowTasks(workflow.id);
  const deps = await repo.findTaskDependencies(allTasks.map((t) => t.id));
  const enriched = enrichTasksWithDependencies(allTasks, phases, deps);
  const view = enriched.find((t) => t.id === taskId)!;

  if (patch.status === "done") {
    const allowOverride = patch.dependencyOverride === true || task.dependency_override;
    if (view.isBlockedByDependencies && !allowOverride) {
      throw new Error(
        `Bloqueada por ${view.incompleteDependencyCount} pendência(s): ${view.incompleteDependencyTitles.join(", ")}`,
      );
    }
  }

  const data: Partial<ProjectWorkflowTask> = {};
  if (patch.priority !== undefined) data.priority = patch.priority;
  if (patch.assigneeId !== undefined) data.assignee_id = patch.assigneeId;
  if (patch.dueDate !== undefined) data.due_date = patch.dueDate || null;
  if (patch.notes !== undefined) data.notes = patch.notes;
  if (patch.checklistJson !== undefined) data.checklist_json = patch.checklistJson;
  if (patch.dependencyOverride !== undefined) {
    data.dependency_override = patch.dependencyOverride;
  }
  if (patch.waitingClientName !== undefined) {
    data.waiting_client_name = patch.waitingClientName;
  }
  if (patch.waitingClientDue !== undefined) {
    data.waiting_client_due = patch.waitingClientDue || null;
  }

  const prevStatus = task.status;
  if (patch.status !== undefined) {
    data.status = patch.status;
    if (patch.status === "done") {
      data.completed_at = new Date().toISOString();
    } else if (prevStatus === "done") {
      data.completed_at = null;
    }

    if (patch.status === "waiting_client") {
      data.waiting_client_since =
        task.waiting_client_since ?? new Date().toISOString().slice(0, 10);
    }
  }

  const updated = await repo.patchWorkflowTask(taskId, data);
  if (!updated) throw new Error("Falha ao atualizar tarefa.");

  if (patch.status && patch.status !== prevStatus) {
    await emitWorkflowTaskStatusChanged(project, updated, prevStatus, patch.status, authorId);
    if (patch.status === "done") {
      await emitWorkflowTaskCompleted(project, updated, authorId);
    }
    if (patch.status === "waiting_client") {
      await setProjectWaitingClient(project, updated, authorId);
    } else if (prevStatus === "waiting_client") {
      await clearProjectWaitingClientIfNeeded(project, workflow.id, authorId);
    }
  }

  if (patch.status === "done") {
    await maybeAdvancePhase(project, workflow.id, updated.phase_id, authorId);
  }

  const refreshed = await projectRepo.findProjectById(projectId);
  if (refreshed) {
    await syncProjectNextAction(refreshed, workflow.id, authorId);
  }

  return getProjectExecution(projectId);
}

export async function setWaitingClient(
  projectId: string,
  taskId: string,
  input: { clientName: string; dueDate?: string; notes?: string },
  authorId: TeamMember | null,
): Promise<ProjectExecutionView | null> {
  return updateWorkflowTask(
    projectId,
    taskId,
    {
      status: "waiting_client",
      waitingClientName: input.clientName,
      waitingClientDue: input.dueDate || null,
      notes: input.notes ?? undefined,
    },
    authorId,
  );
}

export async function resumeWorkflowTask(
  projectId: string,
  taskId: string,
  authorId: TeamMember | null,
  status: "todo" | "in_progress" = "in_progress",
): Promise<ProjectExecutionView | null> {
  return updateWorkflowTask(projectId, taskId, { status }, authorId);
}

async function setProjectWaitingClient(
  project: Project,
  task: ProjectWorkflowTask,
  authorId: TeamMember | null,
): Promise<void> {
  await emitProjectWaitingClient(project, task, authorId);

  if (project.status === "waiting_client") return;

  const patched = await projectRepo.patchProject(project.id, {
    status: "waiting_client",
    blocked_by_type: "client",
    blocked_by_detail: task.title,
  });
  if (patched) {
    await emitProjectStatusChanged(patched, project.status, "waiting_client", authorId);
  }
}

async function clearProjectWaitingClientIfNeeded(
  project: Project,
  workflowId: string,
  authorId: TeamMember | null,
): Promise<void> {
  const tasks = await repo.findWorkflowTasks(workflowId);
  const stillWaiting = tasks.some((t) => t.status === "waiting_client");
  if (stillWaiting) return;
  if (project.status !== "waiting_client") return;

  const workflow = await repo.findWorkflowById(workflowId);
  const phases = await repo.findWorkflowPhases(workflowId);
  const current = phases.find((p) => p.key === workflow?.current_phase_key);
  const nextStatus = (current?.project_status_on_enter ?? "in_progress") as ProjectStatus;

  const patched = await projectRepo.patchProject(project.id, {
    status: nextStatus,
    blocked_by_type: null,
    blocked_by_detail: null,
  });
  if (patched) {
    await emitProjectStatusChanged(patched, project.status, nextStatus, authorId);
  }
}

async function maybeAdvancePhase(
  project: Project,
  workflowId: string,
  phaseId: string,
  authorId: TeamMember | null,
): Promise<void> {
  const phases = await repo.findWorkflowPhases(workflowId);
  const tasks = await repo.findWorkflowTasks(workflowId);
  const phase = phases.find((p) => p.id === phaseId);
  if (!phase || phase.status !== "active") return;
  if (!phaseIsComplete(phase, tasks)) return;

  const now = new Date().toISOString();
  await repo.patchWorkflowPhase(phase.id, {
    status: "done",
    completed_at: now,
  });
  await emitWorkflowPhaseCompleted(project, phase.name, authorId);

  const next = phases
    .filter((p) => p.sort_order > phase.sort_order)
    .sort((a, b) => a.sort_order - b.sort_order)[0];

  if (!next) {
    await repo.patchWorkflow(workflowId, {
      status: "completed",
      completed_at: now,
      current_phase_key: phase.key,
    });
    await projectRepo.patchProject(project.id, { status: "done" });
    return;
  }

  await repo.patchWorkflowPhase(next.id, {
    status: "active",
    started_at: now,
  });
  await repo.patchWorkflow(workflowId, {
    current_phase_key: next.key,
  });
  await emitWorkflowPhaseActivated(project, next.name, authorId);

  if (next.project_status_on_enter) {
    const nextStatus = next.project_status_on_enter as ProjectStatus;
    if (project.status !== nextStatus && project.status !== "waiting_client") {
      const patched = await projectRepo.patchProject(project.id, { status: nextStatus });
      if (patched) {
        await emitProjectStatusChanged(patched, project.status, nextStatus, authorId);
      }
    }
  }

  if (next.is_recurring) {
    const following = phases.filter((p) => p.sort_order > next.sort_order && p.is_recurring);
    for (const f of following) {
      if (f.status === "pending") {
        await repo.patchWorkflowPhase(f.id, {
          status: "active",
          started_at: now,
        });
      }
    }
  }
}

export async function completeDeliverable(
  projectId: string,
  deliverableId: string,
): Promise<ProjectExecutionView | null> {
  const project = await projectRepo.findProjectById(projectId);
  if (!project) throw new Error("Projeto não encontrado.");
  const items = await repo.findDeliverablesByProject(projectId);
  const item = items.find((d) => d.id === deliverableId);
  if (!item) throw new Error("Entregável não encontrado.");

  await repo.patchDeliverable(deliverableId, {
    status: "done",
    completed_at: new Date().toISOString(),
  });
  return getProjectExecution(projectId);
}

export async function upsertBriefing(
  projectId: string,
  input: Partial<{
    objective: string | null;
    offer: string | null;
    audience: string | null;
    location: string | null;
    differentials: string | null;
    services: string | null;
    hours: string | null;
    pricing: string | null;
    availability: string | null;
    commercialProcess: string | null;
    currentChannels: string | null;
    competitors: string | null;
    notes: string | null;
    status: BriefingStatus;
  }>,
): Promise<ProjectBriefing> {
  const project = await projectRepo.findProjectById(projectId);
  if (!project) throw new Error("Projeto não encontrado.");

  const existing = await repo.findBriefingByProject(projectId);
  const now = new Date().toISOString();
  const status = input.status;

  const fields = {
    objective: input.objective !== undefined ? input.objective : (existing?.objective ?? null),
    offer: input.offer !== undefined ? input.offer : (existing?.offer ?? null),
    audience: input.audience !== undefined ? input.audience : (existing?.audience ?? null),
    location: input.location !== undefined ? input.location : (existing?.location ?? null),
    differentials:
      input.differentials !== undefined ? input.differentials : (existing?.differentials ?? null),
    services: input.services !== undefined ? input.services : (existing?.services ?? null),
    hours: input.hours !== undefined ? input.hours : (existing?.hours ?? null),
    pricing: input.pricing !== undefined ? input.pricing : (existing?.pricing ?? null),
    availability:
      input.availability !== undefined ? input.availability : (existing?.availability ?? null),
    commercial_process:
      input.commercialProcess !== undefined
        ? input.commercialProcess
        : (existing?.commercial_process ?? null),
    current_channels:
      input.currentChannels !== undefined
        ? input.currentChannels
        : (existing?.current_channels ?? null),
    competitors:
      input.competitors !== undefined ? input.competitors : (existing?.competitors ?? null),
    notes: input.notes !== undefined ? input.notes : (existing?.notes ?? null),
    status: status ?? existing?.status ?? ("draft" as BriefingStatus),
    sent_at: status === "sent" ? now : (existing?.sent_at ?? null),
    received_at:
      status === "received" || status === "approved"
        ? (existing?.received_at ?? now)
        : (existing?.received_at ?? null),
    approved_at: status === "approved" ? now : (existing?.approved_at ?? null),
  };

  if (existing) {
    const updated = await repo.patchBriefing(existing.id, fields);
    if (!updated) throw new Error("Falha ao atualizar briefing.");
    return updated;
  }

  return repo.insertBriefing({
    project_id: projectId,
    ...fields,
  });
}

export async function getExecutionDashboard(): Promise<ExecutionDashboardStats> {
  const [workflows, projects] = await Promise.all([
    repo.listAllWorkflows(),
    projectRepo.findProjects({}),
  ]);

  const projectMap = new Map(projects.map((p) => [p.id, p]));
  const rows: ExecutionDashboardStats["rows"] = [];

  let waitingClient = 0;
  let overdue = 0;
  let inProduction = 0;
  let inAcquisition = 0;
  let inManagement = 0;
  let active = 0;

  for (const wf of workflows) {
    if (wf.status !== "active") continue;
    active++;
    const project = projectMap.get(wf.project_id);
    if (!project) continue;

    const [phases, tasks] = await Promise.all([
      repo.findWorkflowPhases(wf.id),
      repo.findWorkflowTasks(wf.id),
    ]);
    const deps = await repo.findTaskDependencies(tasks.map((t) => t.id));
    const enriched = enrichTasksWithDependencies(tasks, phases, deps);
    const progress = computeWorkflowProgress(phases, tasks, wf.current_phase_key);
    const current = phases.find((p) => p.key === wf.current_phase_key);
    const next = pickPhasePrimaryAction(enriched, current?.id);
    const isWaiting =
      project.status === "waiting_client" || tasks.some((t) => t.status === "waiting_client");
    const isOverdue =
      (!!project.due_date &&
        project.due_date < new Date().toISOString().slice(0, 10) &&
        project.status !== "done" &&
        project.status !== "cancelled") ||
      enriched.some(
        (t) =>
          t.status !== "done" && !!t.due_date && t.due_date < new Date().toISOString().slice(0, 10),
      );

    if (isWaiting) waitingClient++;
    if (isOverdue) overdue++;
    if (current?.key === "content_production" || current?.key === "digital_structure") {
      inProduction++;
    }
    if (current?.key === "acquisition" || current?.key === "measurement") {
      inAcquisition++;
    }
    if (current?.key === "management" || current?.key === "optimization") {
      inManagement++;
    }

    rows.push({
      projectId: project.id,
      title: project.title,
      companyName: project.companies?.name ?? null,
      status: project.status,
      ownerId: project.owner_id,
      currentPhaseName: current?.name ?? null,
      currentPhaseKey: current?.key ?? null,
      progressPercent: progress.overallPercent,
      nextTaskTitle: next?.title ?? null,
      waitingClient: isWaiting,
      overdue: isOverdue,
    });
  }

  return {
    active,
    waitingClient,
    overdue,
    inProduction,
    inAcquisition,
    inManagement,
    rows,
  };
}
