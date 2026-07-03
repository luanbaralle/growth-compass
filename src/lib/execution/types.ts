import type { HoursSnapshot } from "./hours-types";

export type TeamMember = "luan" | "vini" | "caio";

export type { HoursSnapshot };

export type DelegationTarget = TeamMember | "freelancer" | "sistema" | "editor";

export type DelegationStatus = "not_started" | "in_transition" | "delegated";

export type TaskStatus = "pending" | "in_progress" | "done" | "blocked";

export type BacklogColumn = "agora" | "proximo" | "depois" | "nao_agora";

export type ProductionStage =
  | "briefing"
  | "editando"
  | "revisao"
  | "aprovado"
  | "agendado"
  | "publicado";

export type ProductionType = "imovel" | "prova_social" | "autoridade";

export type ClientStatus = "active" | "prospect" | "paused";

export interface DependencySplit {
  vini: number;
  caio: number;
  sistema: number;
  luan?: number;
}

export interface ProductionCard {
  id: string;
  title: string;
  clientId: string;
  type: ProductionType;
  stage: ProductionStage;
  owner: TeamMember;
  dueDate: string;
  daysInStage: number;
  stageEnteredAt: string;
  briefing?: string;
  notes?: string;
  publishDate?: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  owners: TeamMember[];
  type: string;
  status: ClientStatus;
  observation: string;
  nextAction: string;
  dependencyToday: DependencySplit;
  dependencyTarget: DependencySplit;
}

export interface TeamCapacityEntry {
  member: TeamMember;
  totalHours: number;
  committedHours: number;
  freeHours: number;
}

export interface SopChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface SopDefinition {
  id: string;
  title: string;
  trigger: string;
  owner: TeamMember;
  items: SopChecklistItem[];
}

export interface CheckinSession {
  queueVideos: number;
  delayedCount: number;
  blockedPerson?: TeamMember;
  outOfScopeAppeared: boolean;
  outOfScopeDetail?: string;
  editorStatus: string;
  updatedAt: string;
}

export interface ReviewSession {
  week: number;
  weekLabel: string;
  completed: string[];
  notCompleted: { text: string; reason: string }[];
  queueVideos: number;
  avgDelayDays: number;
  outOfScopeTotal: number;
  outOfScopeRejected: number;
  nextWeekPriorities: string[];
  updatedAt: string;
}

export type BottleneckSeverity = "critical" | "high" | "medium";

export interface DelegationItem {
  id: string;
  activity: string;
  todayOwner: string;
  targetOwner: DelegationTarget;
  hoursPerWeek: number;
  status: DelegationStatus;
  hoursRecovered: number;
  transitionOwner?: TeamMember;
  dueDate?: string;
}

export interface Bottleneck {
  id: string;
  name: string;
  severity: BottleneckSeverity;
  impact: string;
  owner: TeamMember;
  targetDate?: string;
  queueCount?: number;
  avgDelayDays?: number;
  status: "active" | "monitoring" | "resolved";
  order: number;
}

export interface PlanDelivery {
  id: string;
  week: number;
  number: number;
  title: string;
  owner: TeamMember;
  dueDate: string;
  doneWhen: string;
  status: TaskStatus;
  delegationId?: string;
}

export interface BacklogItem {
  id: string;
  title: string;
  owner: TeamMember;
  column: BacklogColumn;
  source?: string;
  dependency?: string;
}

export interface ImmediateAction {
  id: string;
  title: string;
  owner: TeamMember;
  done: boolean;
}

export interface PlanningSession {
  week: number;
  weekLabel: string;
  priorities: { text: string; owner: TeamMember; dueDate: string }[];
  blockers: string;
  queueVideos: number;
  avgDelayDays: number;
  updatedAt: string;
}

export interface ExecutionState {
  version: number;
  planStartDate: string;
  currentWeek: number;
  northStar: {
    priorityOne: string;
    hoursGoalMonthly: number;
    clientSlotsGoal: number;
    clientSlotsCurrent: number;
  };
  bottlenecks: Bottleneck[];
  delegations: DelegationItem[];
  planDeliveries: PlanDelivery[];
  backlog: BacklogItem[];
  immediateActions: ImmediateAction[];
  metrics: {
    productionQueue: number;
    avgDelayDays: number;
  };
  planningSession?: PlanningSession;
  productions: ProductionCard[];
  clients: ClientRecord[];
  teamCapacity: TeamCapacityEntry[];
  sops: SopDefinition[];
  checkinSession?: CheckinSession;
  reviewSession?: ReviewSession;
  hoursHistory: HoursSnapshot[];
  updatedAt: string;
}

export const TEAM_LABELS: Record<TeamMember, string> = {
  luan: "Luan",
  vini: "Vini",
  caio: "Caio",
};

export const DELEGATION_TARGET_LABELS: Record<DelegationTarget, string> = {
  luan: "Luan",
  vini: "Vini",
  caio: "Caio",
  freelancer: "Freelancer",
  sistema: "Sistema",
  editor: "Editor",
};

export const DELEGATION_STATUS_LABELS: Record<DelegationStatus, string> = {
  not_started: "Não iniciado",
  in_transition: "Em transição",
  delegated: "Delegado",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  done: "Feito",
  blocked: "Bloqueado",
};

export const BACKLOG_COLUMN_LABELS: Record<BacklogColumn, string> = {
  agora: "Agora",
  proximo: "Próximo",
  depois: "Depois",
  nao_agora: "Não agora",
};

export const PRODUCTION_STAGE_LABELS: Record<ProductionStage, string> = {
  briefing: "Briefing",
  editando: "Editando",
  revisao: "Revisão",
  aprovado: "Aprovado",
  agendado: "Agendado",
  publicado: "Publicado",
};

export const PRODUCTION_STAGE_ORDER: ProductionStage[] = [
  "briefing",
  "editando",
  "revisao",
  "aprovado",
  "agendado",
  "publicado",
];

export const PRODUCTION_TYPE_LABELS: Record<ProductionType, string> = {
  imovel: "Imóvel",
  prova_social: "Prova social",
  autoridade: "Autoridade",
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Ativo",
  prospect: "Prospect",
  paused: "Pausado",
};
