import type { ContentTaskStatus } from "@/domains/content-production/types";
import type { DomainEventKey } from "@/domains/events/types";
import type { ProjectBlockedByType, ProjectStatus } from "@/domains/projects/types";

/** Labels client-facing — nunca expor status internos crus na UI. */

export function translateContentStatus(status: ContentTaskStatus): string {
  const map: Record<ContentTaskStatus, string> = {
    ideia: "Em planejamento",
    definicao: "Em definição",
    agendamento: "Agendado",
    gravacao: "Em gravação",
    edicao: "Em edição",
    aprovacao: "Aguardando sua aprovação",
    correcao: "Em ajuste pela Raise One",
    aprovado: "Aprovado",
    programado: "Programado",
    publicado: "Publicado",
  };
  return map[status];
}

export function translateProjectBlocked(type: ProjectBlockedByType | null): string | null {
  if (!type) return null;
  const map: Record<ProjectBlockedByType, string> = {
    client: "Precisamos de uma informação sua para continuar",
    access: "Aguardando acesso ou permissão",
    approval: "Aguardando sua aprovação",
    internal: "Em andamento pela Raise One",
    other: "Aguardando próximo passo",
  };
  return map[type];
}

export function translateProjectStatus(status: ProjectStatus): string {
  const map: Record<ProjectStatus, string> = {
    pending: "Preparando início",
    in_progress: "Em andamento",
    review: "Aguardando sua revisão",
    done: "Concluído",
    blocked: "Precisamos de você",
    cancelled: "Encerrado",
  };
  return map[status];
}

export function translateProjectStatusChange(from: string, to: string): string {
  const fromLabel = translateProjectStatus(from as ProjectStatus);
  const toLabel = translateProjectStatus(to as ProjectStatus);
  return `${fromLabel} → ${toLabel}`;
}

/** Eventos visíveis no portal — subset do catálogo OS. */
export const CLIENT_VISIBLE_EVENT_KEYS: DomainEventKey[] = [
  "content.sent_for_approval",
  "content.approved",
  "content.revision_requested",
  "content.scheduled",
  "content.published",
  "project.status_changed",
  "project.blocked",
  "project.unblocked",
  "project.created",
  "finance.payment_received",
  "finance.payment_overdue",
  "finance.payment_due_soon",
  "marketing.synced",
  "marketing.snapshot_created",
];

export function translateClientEventTitle(eventKey: DomainEventKey): string {
  const map: Partial<Record<DomainEventKey, string>> = {
    "content.sent_for_approval": "Novo conteúdo para aprovação",
    "content.approved": "Conteúdo aprovado",
    "content.revision_requested": "Alteração enviada",
    "content.scheduled": "Conteúdo programado",
    "content.published": "Conteúdo publicado",
    "project.status_changed": "Projeto atualizado",
    "project.created": "Projeto iniciado",
    "project.blocked": "Precisamos de você",
    "project.unblocked": "Projeto retomado",
    "finance.payment_received": "Pagamento confirmado",
    "finance.payment_overdue": "Pagamento pendente",
    "finance.payment_due_soon": "Cobrança em breve",
    "marketing.synced": "Resultados atualizados",
    "marketing.snapshot_created": "Novos resultados disponíveis",
  };
  return map[eventKey] ?? "Atualização";
}

export function isClientVisibleEvent(eventKey: DomainEventKey): boolean {
  return CLIENT_VISIBLE_EVENT_KEYS.includes(eventKey);
}

export function translateFinanceStatusClient(
  status: import("@/domains/finance/types").FinanceEntryStatus,
): string {
  const map: Record<import("@/domains/finance/types").FinanceEntryStatus, string> = {
    paid: "Pago",
    pending: "Pendente",
    overdue: "Pagamento pendente",
    cancelled: "Cancelado",
  };
  return map[status];
}

export function translateSubscriptionStatus(hasOverdue: boolean, hasPendingSoon: boolean): {
  label: string;
  tone: "ok" | "warning" | "critical";
} {
  if (hasOverdue) {
    return { label: "Pagamento pendente", tone: "critical" };
  }
  if (hasPendingSoon) {
    return { label: "Cobrança em breve", tone: "warning" };
  }
  return { label: "Em dia", tone: "ok" };
}
