import type { TeamMember } from "@/lib/auth/types";
import type { ProjectPriority, ProjectStatus } from "../types";

export type WorkflowPhaseStatus = "pending" | "active" | "done" | "skipped";

export type WorkflowTaskStatus =
  | "todo"
  | "in_progress"
  | "blocked"
  | "waiting_client"
  | "done";

export type WorkflowInstanceStatus = "active" | "paused" | "completed" | "cancelled";

export type DeliverableStatus = "pending" | "in_progress" | "done";

export type BriefingStatus = "draft" | "sent" | "received" | "approved";

export type TaskOrigin = "template" | "manual" | "automation";

export interface ChecklistItemDef {
  id: string;
  label: string;
  done: boolean;
  group?: string;
}

export interface WorkflowTemplateDefinition {
  slug: string;
  name: string;
  description: string;
  phases: TemplatePhaseDef[];
}

export interface TemplatePhaseDef {
  key: string;
  name: string;
  objective: string;
  isRecurring: boolean;
  completionCriteria: string | null;
  projectStatusOnEnter: ProjectStatus | null;
  deliverables: string[];
  tasks: TemplateTaskDef[];
}

export interface TemplateTaskDef {
  key: string;
  title: string;
  description: string | null;
  defaultPriority: ProjectPriority;
  defaultAssigneeId: TeamMember | null;
  isRecurring: boolean;
  blocksPhaseCompletion: boolean;
  waitingClientDefault: boolean;
  checklist: ChecklistItemDef[];
  dependsOnTaskKeys: string[];
}

export interface WorkflowTemplate {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowTemplatePhase {
  id: string;
  template_id: string;
  key: string;
  name: string;
  objective: string | null;
  sort_order: number;
  is_recurring: boolean;
  completion_criteria: string | null;
  project_status_on_enter: string | null;
}

export interface WorkflowTemplateTask {
  id: string;
  phase_id: string;
  key: string;
  title: string;
  description: string | null;
  sort_order: number;
  default_priority: ProjectPriority;
  default_assignee_id: string | null;
  is_recurring: boolean;
  blocks_phase_completion: boolean;
  waiting_client_default: boolean;
  checklist_json: ChecklistItemDef[];
  depends_on_task_keys: string[];
}

export interface WorkflowTemplateDeliverable {
  id: string;
  phase_id: string;
  title: string;
  sort_order: number;
}

export interface ProjectWorkflow {
  id: string;
  project_id: string;
  template_id: string;
  status: WorkflowInstanceStatus;
  current_phase_key: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWorkflowPhase {
  id: string;
  workflow_id: string;
  key: string;
  name: string;
  objective: string | null;
  sort_order: number;
  status: WorkflowPhaseStatus;
  is_recurring: boolean;
  completion_criteria: string | null;
  project_status_on_enter: string | null;
  owner_id: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface ProjectWorkflowTask {
  id: string;
  workflow_id: string;
  phase_id: string;
  key: string;
  title: string;
  description: string | null;
  sort_order: number;
  status: WorkflowTaskStatus;
  priority: ProjectPriority;
  assignee_id: string | null;
  due_date: string | null;
  checklist_json: ChecklistItemDef[];
  is_recurring: boolean;
  blocks_phase_completion: boolean;
  dependency_override: boolean;
  waiting_client_name: string | null;
  waiting_client_since: string | null;
  waiting_client_due: string | null;
  notes: string | null;
  origin: TaskOrigin;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWorkflowTaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
}

export interface ProjectDeliverable {
  id: string;
  project_id: string;
  phase_id: string | null;
  title: string;
  status: DeliverableStatus;
  sort_order: number;
  completed_at: string | null;
  created_at: string;
}

export interface ProjectBriefing {
  id: string;
  project_id: string;
  objective: string | null;
  offer: string | null;
  audience: string | null;
  location: string | null;
  differentials: string | null;
  services: string | null;
  hours: string | null;
  pricing: string | null;
  availability: string | null;
  commercial_process: string | null;
  current_channels: string | null;
  competitors: string | null;
  notes: string | null;
  status: BriefingStatus;
  sent_at: string | null;
  received_at: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PhaseProgress {
  phaseKey: string;
  phaseName: string;
  status: WorkflowPhaseStatus;
  isRecurring: boolean;
  total: number;
  done: number;
  percent: number;
}

export interface WorkflowProgress {
  overallPercent: number;
  totalTasks: number;
  doneTasks: number;
  pendingTasks: number;
  blockedTasks: number;
  waitingClientTasks: number;
  phases: PhaseProgress[];
  currentPhaseKey: string | null;
}

export interface WorkflowTaskView extends ProjectWorkflowTask {
  phase_key: string;
  phase_name: string;
  incompleteDependencyCount: number;
  incompleteDependencyTitles: string[];
  isBlockedByDependencies: boolean;
}

export interface ProjectExecutionView {
  workflow: ProjectWorkflow;
  template: WorkflowTemplate;
  phases: ProjectWorkflowPhase[];
  tasks: WorkflowTaskView[];
  deliverables: ProjectDeliverable[];
  progress: WorkflowProgress;
  currentPhase: ProjectWorkflowPhase | null;
  nextActions: WorkflowTaskView[];
  pendencies: WorkflowTaskView[];
  waitingClientDays: number | null;
  briefing: ProjectBriefing | null;
}

export interface ExecutionDashboardRow {
  projectId: string;
  title: string;
  companyName: string | null;
  status: string;
  ownerId: string | null;
  currentPhaseName: string | null;
  currentPhaseKey: string | null;
  progressPercent: number;
  nextTaskTitle: string | null;
  waitingClient: boolean;
  overdue: boolean;
}

export interface ExecutionDashboardStats {
  active: number;
  waitingClient: number;
  overdue: number;
  inProduction: number;
  inAcquisition: number;
  inManagement: number;
  rows: ExecutionDashboardRow[];
}

export const WORKFLOW_TASK_STATUSES: WorkflowTaskStatus[] = [
  "todo",
  "in_progress",
  "blocked",
  "waiting_client",
  "done",
];

export const WORKFLOW_TASK_STATUS_LABELS: Record<WorkflowTaskStatus, string> = {
  todo: "A fazer",
  in_progress: "Em andamento",
  blocked: "Bloqueada",
  waiting_client: "Aguardando cliente",
  done: "Concluída",
};

export const PHASE_STATUS_LABELS: Record<WorkflowPhaseStatus, string> = {
  pending: "Pendente",
  active: "Ativa",
  done: "Concluída",
  skipped: "Ignorada",
};

export const BRIEFING_STATUS_LABELS: Record<BriefingStatus, string> = {
  draft: "Rascunho",
  sent: "Enviado",
  received: "Recebido",
  approved: "Aprovado",
};

export const AQUISICAO_PHASE_KEYS = [
  "formalization",
  "onboarding",
  "content_production",
  "digital_structure",
  "measurement",
  "acquisition",
  "management",
  "optimization",
] as const;

export type AquisicaoPhaseKey = (typeof AQUISICAO_PHASE_KEYS)[number];
