import type { TeamMember } from "@/lib/auth/types";

export type ProjectStatus =
  | "pending"
  | "in_progress"
  | "review"
  | "done"
  | "blocked"
  | "cancelled";

export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export type ProjectBlockedByType = "client" | "access" | "approval" | "internal" | "other";

export type ProjectType =
  | "landing_page"
  | "website"
  | "google_ads"
  | "meta_ads"
  | "seo"
  | "crm"
  | "consultoria"
  | "producao_conteudo"
  | "outro";

export interface Project {
  id: string;
  company_id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  owner_id: string | null;
  priority: ProjectPriority;
  due_date: string | null;
  description: string | null;
  blocked_by_type: ProjectBlockedByType | null;
  blocked_by_detail: string | null;
  next_action: string | null;
  next_action_due: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithCompany extends Project {
  companies: { name: string } | null;
}

export interface ProjectChecklistItem {
  id: string;
  project_id: string;
  text: string;
  done: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProjectComment {
  id: string;
  project_id: string;
  body: string;
  author_id: string | null;
  created_at: string;
}

export interface ProjectListFilters {
  search?: string;
  status?: ProjectStatus | "all";
  companyId?: string;
  ownerId?: TeamMember | "all";
  sort?: "due_date" | "created_at" | "title" | "priority";
  order?: "asc" | "desc";
}

export interface ProjectStatusCounts {
  all: number;
  pending: number;
  in_progress: number;
  review: number;
  done: number;
  blocked: number;
  cancelled: number;
  overdue: number;
  needsAction: number;
}

export const PROJECT_STATUSES: ProjectStatus[] = [
  "pending",
  "in_progress",
  "review",
  "done",
  "blocked",
  "cancelled",
];

export const PROJECT_PRIORITIES: ProjectPriority[] = ["low", "medium", "high", "urgent"];

export const PROJECT_TYPES: ProjectType[] = [
  "landing_page",
  "website",
  "google_ads",
  "meta_ads",
  "seo",
  "crm",
  "consultoria",
  "producao_conteudo",
  "outro",
];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  review: "Revisão",
  done: "Concluído",
  blocked: "Bloqueado",
  cancelled: "Cancelado",
};

export const PRIORITY_LABELS: Record<ProjectPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

export const TYPE_LABELS: Record<ProjectType, string> = {
  landing_page: "Landing Page",
  website: "Website",
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  seo: "SEO",
  crm: "CRM",
  consultoria: "Consultoria",
  producao_conteudo: "Produção de Conteúdo",
  outro: "Outro",
};

export const PROJECT_BLOCKED_BY_TYPES: ProjectBlockedByType[] = [
  "client",
  "access",
  "approval",
  "internal",
  "other",
];

export const BLOCKED_BY_LABELS: Record<ProjectBlockedByType, string> = {
  client: "Cliente",
  access: "Acesso / credencial",
  approval: "Aprovação pendente",
  internal: "Interno (agência)",
  other: "Outro",
};

export function isDueOverdue(dueDate: string | null, status: ProjectStatus): boolean {
  if (!dueDate) return false;
  if (status === "done" || status === "cancelled") return false;
  return dueDate < new Date().toISOString().slice(0, 10);
}

export function projectNeedsNextAction(project: {
  due_date: string | null;
  status: ProjectStatus;
  next_action: string | null;
}): boolean {
  return isDueOverdue(project.due_date, project.status) && !project.next_action?.trim();
}

export function projectNeedsBlockReason(project: {
  status: ProjectStatus;
  blocked_by_type: ProjectBlockedByType | null;
}): boolean {
  return project.status === "blocked" && !project.blocked_by_type;
}

export function formatNextActionDue(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export const ACTIVE_STATUSES: ProjectStatus[] = ["pending", "in_progress", "review", "blocked"];
