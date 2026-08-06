import type { TeamMember } from "@/lib/auth/types";

export type ProjectStatus =
  | "pending"
  | "in_progress"
  | "review"
  | "done"
  | "blocked"
  | "cancelled";

export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export type ProjectType =
  | "landing_page"
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
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  seo: "SEO",
  crm: "CRM",
  consultoria: "Consultoria",
  producao_conteudo: "Produção de Conteúdo",
  outro: "Outro",
};

export const ACTIVE_STATUSES: ProjectStatus[] = ["pending", "in_progress", "review", "blocked"];
