import { dbDelete, dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type {
  ChecklistItemDef,
  ProjectBriefing,
  ProjectDeliverable,
  ProjectWorkflow,
  ProjectWorkflowPhase,
  ProjectWorkflowTask,
  ProjectWorkflowTaskDependency,
  WorkflowTemplate,
  WorkflowTemplateDeliverable,
  WorkflowTemplatePhase,
  WorkflowTemplateTask,
} from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

function parseChecklist(value: unknown): ChecklistItemDef[] {
  if (!Array.isArray(value)) return [];
  return value as ChecklistItemDef[];
}

function normalizeTask(row: ProjectWorkflowTask): ProjectWorkflowTask {
  return {
    ...row,
    checklist_json: parseChecklist(row.checklist_json),
  };
}

function normalizeTemplateTask(row: WorkflowTemplateTask): WorkflowTemplateTask {
  return {
    ...row,
    checklist_json: parseChecklist(row.checklist_json),
    depends_on_task_keys: Array.isArray(row.depends_on_task_keys)
      ? row.depends_on_task_keys
      : [],
  };
}

export async function findTemplateBySlug(slug: string): Promise<WorkflowTemplate | null> {
  const rows = await dbSelect<WorkflowTemplate>(
    "workflow_templates",
    encodeQuery({ select: "*", slug: `eq.${slug}`, limit: "1" }),
  );
  return rows[0] ?? null;
}

export async function listActiveTemplates(): Promise<WorkflowTemplate[]> {
  return dbSelect<WorkflowTemplate>(
    "workflow_templates",
    encodeQuery({
      select: "*",
      is_active: "eq.true",
      order: "name.asc",
    }),
  );
}

export async function insertTemplate(
  data: Omit<WorkflowTemplate, "id" | "created_at" | "updated_at">,
): Promise<WorkflowTemplate> {
  const [row] = await dbInsert<WorkflowTemplate>("workflow_templates", data);
  return row;
}

export async function insertTemplatePhase(
  data: Omit<WorkflowTemplatePhase, "id">,
): Promise<WorkflowTemplatePhase> {
  const [row] = await dbInsert<WorkflowTemplatePhase>("workflow_template_phases", data);
  return row;
}

export async function insertTemplateTask(
  data: Omit<WorkflowTemplateTask, "id">,
): Promise<WorkflowTemplateTask> {
  const [row] = await dbInsert<WorkflowTemplateTask>("workflow_template_tasks", {
    ...data,
    checklist_json: data.checklist_json,
    depends_on_task_keys: data.depends_on_task_keys,
  });
  return normalizeTemplateTask(row);
}

export async function insertTemplateDeliverable(
  data: Omit<WorkflowTemplateDeliverable, "id">,
): Promise<WorkflowTemplateDeliverable> {
  const [row] = await dbInsert<WorkflowTemplateDeliverable>(
    "workflow_template_deliverables",
    data,
  );
  return row;
}

export async function findTemplatePhases(
  templateId: string,
): Promise<WorkflowTemplatePhase[]> {
  return dbSelect<WorkflowTemplatePhase>(
    "workflow_template_phases",
    encodeQuery({
      select: "*",
      template_id: `eq.${templateId}`,
      order: "sort_order.asc",
    }),
  );
}

export async function findTemplateTasks(
  phaseIds: string[],
): Promise<WorkflowTemplateTask[]> {
  if (phaseIds.length === 0) return [];
  const rows = await dbSelect<WorkflowTemplateTask>(
    "workflow_template_tasks",
    encodeQuery({
      select: "*",
      phase_id: `in.(${phaseIds.join(",")})`,
      order: "sort_order.asc",
    }),
  );
  return rows.map(normalizeTemplateTask);
}

export async function findTemplateDeliverables(
  phaseIds: string[],
): Promise<WorkflowTemplateDeliverable[]> {
  if (phaseIds.length === 0) return [];
  return dbSelect<WorkflowTemplateDeliverable>(
    "workflow_template_deliverables",
    encodeQuery({
      select: "*",
      phase_id: `in.(${phaseIds.join(",")})`,
      order: "sort_order.asc",
    }),
  );
}

export async function findWorkflowByProjectId(
  projectId: string,
): Promise<ProjectWorkflow | null> {
  const rows = await dbSelect<ProjectWorkflow>(
    "project_workflows",
    encodeQuery({ select: "*", project_id: `eq.${projectId}`, limit: "1" }),
  );
  return rows[0] ?? null;
}

export async function findWorkflowById(id: string): Promise<ProjectWorkflow | null> {
  const rows = await dbSelect<ProjectWorkflow>(
    "project_workflows",
    encodeQuery({ select: "*", id: `eq.${id}`, limit: "1" }),
  );
  return rows[0] ?? null;
}

export async function insertWorkflow(
  data: Omit<ProjectWorkflow, "id" | "created_at" | "updated_at">,
): Promise<ProjectWorkflow> {
  const [row] = await dbInsert<ProjectWorkflow>("project_workflows", data);
  return row;
}

export async function patchWorkflow(
  id: string,
  data: Partial<Omit<ProjectWorkflow, "id" | "project_id" | "created_at">>,
): Promise<ProjectWorkflow | null> {
  const rows = await dbUpdate<ProjectWorkflow>("project_workflows", `id=eq.${id}`, {
    ...data,
    updated_at: new Date().toISOString(),
  });
  return rows[0] ?? null;
}

export async function insertWorkflowPhase(
  data: Omit<ProjectWorkflowPhase, "id">,
): Promise<ProjectWorkflowPhase> {
  const [row] = await dbInsert<ProjectWorkflowPhase>("project_workflow_phases", data);
  return row;
}

export async function patchWorkflowPhase(
  id: string,
  data: Partial<Omit<ProjectWorkflowPhase, "id" | "workflow_id">>,
): Promise<ProjectWorkflowPhase | null> {
  const rows = await dbUpdate<ProjectWorkflowPhase>(
    "project_workflow_phases",
    `id=eq.${id}`,
    data,
  );
  return rows[0] ?? null;
}

export async function findWorkflowPhases(
  workflowId: string,
): Promise<ProjectWorkflowPhase[]> {
  return dbSelect<ProjectWorkflowPhase>(
    "project_workflow_phases",
    encodeQuery({
      select: "*",
      workflow_id: `eq.${workflowId}`,
      order: "sort_order.asc",
    }),
  );
}

export async function insertWorkflowTask(
  data: Omit<ProjectWorkflowTask, "id" | "created_at" | "updated_at">,
): Promise<ProjectWorkflowTask> {
  const [row] = await dbInsert<ProjectWorkflowTask>("project_workflow_tasks", {
    ...data,
    checklist_json: data.checklist_json,
  });
  return normalizeTask(row);
}

export async function patchWorkflowTask(
  id: string,
  data: Partial<Omit<ProjectWorkflowTask, "id" | "workflow_id" | "created_at">>,
): Promise<ProjectWorkflowTask | null> {
  const rows = await dbUpdate<ProjectWorkflowTask>("project_workflow_tasks", `id=eq.${id}`, {
    ...data,
    updated_at: new Date().toISOString(),
  });
  return rows[0] ? normalizeTask(rows[0]) : null;
}

export async function findWorkflowTasks(workflowId: string): Promise<ProjectWorkflowTask[]> {
  const rows = await dbSelect<ProjectWorkflowTask>(
    "project_workflow_tasks",
    encodeQuery({
      select: "*",
      workflow_id: `eq.${workflowId}`,
      order: "sort_order.asc",
    }),
  );
  return rows.map(normalizeTask);
}

export async function findWorkflowTaskById(
  id: string,
): Promise<ProjectWorkflowTask | null> {
  const rows = await dbSelect<ProjectWorkflowTask>(
    "project_workflow_tasks",
    encodeQuery({ select: "*", id: `eq.${id}`, limit: "1" }),
  );
  return rows[0] ? normalizeTask(rows[0]) : null;
}

export async function insertTaskDependency(
  data: Omit<ProjectWorkflowTaskDependency, "id">,
): Promise<ProjectWorkflowTaskDependency> {
  const [row] = await dbInsert<ProjectWorkflowTaskDependency>(
    "project_workflow_task_dependencies",
    data,
  );
  return row;
}

export async function findTaskDependencies(
  taskIds: string[],
): Promise<ProjectWorkflowTaskDependency[]> {
  if (taskIds.length === 0) return [];
  return dbSelect<ProjectWorkflowTaskDependency>(
    "project_workflow_task_dependencies",
    encodeQuery({
      select: "*",
      task_id: `in.(${taskIds.join(",")})`,
    }),
  );
}

export async function insertDeliverable(
  data: Omit<ProjectDeliverable, "id" | "created_at">,
): Promise<ProjectDeliverable> {
  const [row] = await dbInsert<ProjectDeliverable>("project_deliverables", data);
  return row;
}

export async function patchDeliverable(
  id: string,
  data: Partial<Omit<ProjectDeliverable, "id" | "project_id" | "created_at">>,
): Promise<ProjectDeliverable | null> {
  const rows = await dbUpdate<ProjectDeliverable>("project_deliverables", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function findDeliverablesByProject(
  projectId: string,
): Promise<ProjectDeliverable[]> {
  return dbSelect<ProjectDeliverable>(
    "project_deliverables",
    encodeQuery({
      select: "*",
      project_id: `eq.${projectId}`,
      order: "sort_order.asc",
    }),
  );
}

export async function findBriefingByProject(
  projectId: string,
): Promise<ProjectBriefing | null> {
  const rows = await dbSelect<ProjectBriefing>(
    "project_briefings",
    encodeQuery({ select: "*", project_id: `eq.${projectId}`, limit: "1" }),
  );
  return rows[0] ?? null;
}

export async function insertBriefing(
  data: Omit<ProjectBriefing, "id" | "created_at" | "updated_at">,
): Promise<ProjectBriefing> {
  const [row] = await dbInsert<ProjectBriefing>("project_briefings", data);
  return row;
}

export async function patchBriefing(
  id: string,
  data: Partial<Omit<ProjectBriefing, "id" | "project_id" | "created_at">>,
): Promise<ProjectBriefing | null> {
  const rows = await dbUpdate<ProjectBriefing>("project_briefings", `id=eq.${id}`, {
    ...data,
    updated_at: new Date().toISOString(),
  });
  return rows[0] ?? null;
}

export async function listAllWorkflows(): Promise<ProjectWorkflow[]> {
  return dbSelect<ProjectWorkflow>(
    "project_workflows",
    encodeQuery({ select: "*", order: "started_at.desc" }),
  );
}

export async function removeWorkflowByProjectId(projectId: string): Promise<void> {
  await dbDelete("project_workflows", `project_id=eq.${projectId}`);
}
