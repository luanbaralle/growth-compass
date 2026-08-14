import type { TeamMember } from "@/lib/auth/types";

/**
 * Raise One OS — Domain Event Contract (Sprint 0)
 *
 * Fonte da verdade TypeScript para Sprint A+.
 * Ver docs/os/domain-contract.md
 */

// ── Entity types ──────────────────────────────────────────────

export type DomainEntityType =
  | "company"
  | "prospect"
  | "project"
  | "content_task"
  | "finance_entry"
  | "marketing_snapshot"
  | "task"
  | "meeting";

// ── Event keys (catálogo fechado — adicionar só com revisão) ──

export type DomainEventKey =
  // Company
  | "company.created"
  | "company.lead_captured"
  | "company.stage_changed"
  | "company.note_added"
  | "company.file_added"
  // Prospect
  | "prospect.created"
  | "prospect.status_changed"
  | "prospect.message_sent"
  | "prospect.message_received"
  | "prospect.converted"
  | "prospect.next_action_due"
  // Project
  | "project.created"
  | "project.status_changed"
  | "project.blocked"
  | "project.unblocked"
  | "project.overdue"
  | "project.next_action_set"
  // Content
  | "content.created"
  | "content.status_changed"
  | "content.sent_for_approval"
  | "content.approved"
  | "content.scheduled"
  | "content.published"
  | "content.note_added"
  // Finance
  | "finance.entry_created"
  | "finance.payment_received"
  | "finance.payment_overdue"
  | "finance.payment_due_soon"
  // Marketing
  | "marketing.snapshot_created"
  | "marketing.synced"
  // Task / Meeting
  | "task.created"
  | "task.completed"
  | "meeting.scheduled";

export type NotificationUrgency = "critical" | "warning" | "default";

export type WorkQueueUrgency = "critical" | "today" | "watch";

export type WorkQueueSource =
  | "project"
  | "prospect"
  | "content_task"
  | "finance_entry"
  | "task"
  | "notification";

// ── Core records (Sprint A schema) ────────────────────────────

export interface DomainEvent {
  id: string;
  idempotency_key: string;
  event_key: DomainEventKey;
  entity_type: DomainEntityType;
  entity_id: string;
  company_id: string | null;
  prospect_id: string | null;
  actor_id: TeamMember | null;
  payload: Record<string, unknown>;
  activity_title: string;
  activity_body: string | null;
  occurred_at: string;
}

export interface OSNotification {
  id: string;
  domain_event_id: string | null;
  assignee_id: TeamMember;
  title: string;
  body: string | null;
  action_url: string;
  urgency: NotificationUrgency;
  read_at: string | null;
  dismissed_at: string | null;
  created_at: string;
}

export interface WorkQueueItem {
  id: string;
  source: WorkQueueSource;
  entityId: string;
  companyId: string | null;
  companyName: string | null;
  title: string;
  subtitle: string;
  nextActionLabel: string;
  actionUrl: string;
  assigneeId: TeamMember | null;
  urgency: WorkQueueUrgency;
  dueAt: string | null;
}

// ── Emit input (Sprint A service) ─────────────────────────────

export interface EmitDomainEventInput {
  /** Chave única da operação — evita duplicar side effects em retry */
  idempotencyKey: string;
  eventKey: DomainEventKey;
  entityType: DomainEntityType;
  entityId: string;
  actorId: TeamMember | null;
  companyId?: string | null;
  prospectId?: string | null;
  payload?: Record<string, unknown>;
  activityTitle: string;
  activityBody?: string | null;
  /** Se omitido, derivado do catálogo de eventos */
  notifications?: Array<{
    assigneeId: TeamMember;
    title: string;
    body?: string | null;
    actionUrl: string;
    urgency?: NotificationUrgency;
  }>;
  /** Side effects — tasks automáticas (sem emitir task.created) */
  tasks?: Array<{
    title: string;
    assigneeId: TeamMember;
    dueDate?: string | null;
    companyId?: string | null;
    projectId?: string | null;
  }>;
  /** Projections legadas — executadas só na primeira emissão (não duplicate) */
  projections?: (event: DomainEvent) => Promise<void>;
}

// ── Event metadata helpers ────────────────────────────────────

export type StatusChangePayload = {
  from: string;
  to: string;
};

export type BlockedPayload = {
  blockedByType: "client" | "access" | "approval" | "internal" | "other";
  detail: string;
};

export type PaymentPayload = {
  financeEntryId: string;
  amountCents: number;
  type?: string;
};

/** Mapeia entity_type → rota base do OS */
export const ENTITY_ROUTES: Record<DomainEntityType, (id: string) => string> = {
  company: (id) => `/os/empresas/${id}`,
  prospect: (id) => `/os/prospeccao/${id}`,
  project: (id) => `/os/projetos/${id}`,
  content_task: (id) => `/os/producao?task=${id}`,
  finance_entry: () => `/os/financeiro`,
  marketing_snapshot: () => `/os/marketing`,
  task: () => `/os/agenda`,
  meeting: () => `/os/agenda`,
};

/** Responsável fallback quando entidade não tem owner */
export const DEFAULT_ASSIGNEE: TeamMember = "luan";

export const PRODUCTION_DEFAULT_ASSIGNEE: TeamMember = "vini";
