import type { DomainEntityType, DomainEventKey } from "./types";

export const EVENT_LABELS: Record<DomainEventKey, string> = {
  "company.created": "Empresa criada",
  "company.lead_captured": "Lead captado",
  "company.stage_changed": "Estágio alterado",
  "company.note_added": "Nota adicionada",
  "company.file_added": "Arquivo adicionado",
  "prospect.created": "Prospect criado",
  "prospect.status_changed": "Status do prospect",
  "prospect.message_sent": "Mensagem enviada",
  "prospect.message_received": "Resposta recebida",
  "prospect.converted": "Prospect convertido",
  "prospect.next_action_due": "Próxima ação comercial",
  "project.created": "Projeto criado",
  "project.status_changed": "Status do projeto",
  "project.blocked": "Projeto bloqueado",
  "project.unblocked": "Projeto desbloqueado",
  "project.overdue": "Projeto atrasado",
  "project.next_action_set": "Próxima ação definida",
  "content.created": "Conteúdo criado",
  "content.status_changed": "Status do conteúdo",
  "content.sent_for_approval": "Enviado para aprovação",
  "content.approved": "Conteúdo aprovado",
  "content.revision_requested": "Alteração solicitada",
  "content.scheduled": "Publicação programada",
  "content.published": "Conteúdo publicado",
  "content.note_added": "Nota no conteúdo",
  "finance.entry_created": "Cobrança criada",
  "finance.payment_received": "Pagamento recebido",
  "finance.payment_overdue": "Cobrança atrasada",
  "finance.payment_due_soon": "Cobrança vence em breve",
  "marketing.snapshot_created": "Métricas registradas",
  "marketing.synced": "Marketing sincronizado",
  "task.created": "Tarefa criada",
  "task.completed": "Tarefa concluída",
  "meeting.scheduled": "Reunião agendada",
};

export const ENTITY_TYPE_LABELS: Record<DomainEntityType, string> = {
  company: "Empresa",
  prospect: "Prospect",
  project: "Projeto",
  content_task: "Conteúdo",
  finance_entry: "Financeiro",
  marketing_snapshot: "Marketing",
  task: "Tarefa",
  meeting: "Reunião",
};

export type ActivityFeedWindow = "24h" | "7d";

export type ActivityFeedItem = {
  id: string;
  eventKey: DomainEventKey;
  eventLabel: string;
  entityType: DomainEntityType;
  entityTypeLabel: string;
  entityId: string;
  companyId: string | null;
  companyName: string | null;
  actorId: string | null;
  actorName: string | null;
  title: string;
  body: string | null;
  occurredAt: string;
  actionUrl: string;
};

export function activityFeedWindowToSince(window: ActivityFeedWindow): string {
  const hours = window === "7d" ? 24 * 7 : 24;
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}
