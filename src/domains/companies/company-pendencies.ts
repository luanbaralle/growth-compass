import type { ContentTask } from "@/domains/content-production/types";
import { effectiveFinanceStatus } from "@/domains/finance/types";
import type { FinanceEntry } from "@/domains/finance/types";
import {
  ACTIVE_STATUSES,
  projectNeedsBlockReason,
  projectNeedsNextAction,
} from "@/domains/projects/types";
import type { Project } from "@/domains/projects/types";

export type CompanyPendencyKind =
  | "project_blocked"
  | "project_needs_action"
  | "finance_overdue"
  | "content_approval"
  | "content_ready_schedule"
  | "content_overdue_post";

export type CompanyPendency = {
  id: string;
  kind: CompanyPendencyKind;
  title: string;
  subtitle: string;
  urgency: "critical" | "warning";
  projectId?: string;
  contentTaskId?: string;
  financeEntryId?: string;
};

export function buildCompanyPendencies(input: {
  projects: Project[];
  financeEntries: FinanceEntry[];
  contentTasks: ContentTask[];
}): CompanyPendency[] {
  const pendencies: CompanyPendency[] = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const project of input.projects) {
    if (!ACTIVE_STATUSES.includes(project.status)) continue;

    if (project.status === "blocked") {
      pendencies.push({
        id: `project-blocked-${project.id}`,
        kind: "project_blocked",
        title: project.title,
        subtitle: projectNeedsBlockReason(project)
          ? "Bloqueado sem motivo registrado"
          : project.blocked_by_detail?.trim() || "Projeto bloqueado",
        urgency: "critical",
        projectId: project.id,
      });
    } else if (projectNeedsNextAction(project)) {
      pendencies.push({
        id: `project-action-${project.id}`,
        kind: "project_needs_action",
        title: project.title,
        subtitle: "Atrasado — defina a próxima ação",
        urgency: "warning",
        projectId: project.id,
      });
    }
  }

  for (const entry of input.financeEntries) {
    if (effectiveFinanceStatus(entry) !== "overdue") continue;
    pendencies.push({
      id: `finance-${entry.id}`,
      kind: "finance_overdue",
      title: entry.description,
      subtitle: "Cobrança atrasada",
      urgency: "critical",
      financeEntryId: entry.id,
    });
  }

  for (const task of input.contentTasks) {
    if (task.status === "publicado") continue;

    if (task.status === "aprovacao" || task.status === "correcao") {
      pendencies.push({
        id: `content-approval-${task.id}`,
        kind: "content_approval",
        title: task.title,
        subtitle:
          task.status === "aprovacao" ? "Aguardando aprovação do cliente" : "Correção pendente",
        urgency: "warning",
        contentTaskId: task.id,
      });
    }

    if (task.status === "aprovado") {
      pendencies.push({
        id: `content-schedule-${task.id}`,
        kind: "content_ready_schedule",
        title: task.title,
        subtitle: "Aprovado — programar publicação",
        urgency: "warning",
        contentTaskId: task.id,
      });
    }

    if (
      task.post_date &&
      task.post_date < today &&
      task.status !== "programado" &&
      task.status !== "publicado"
    ) {
      pendencies.push({
        id: `content-overdue-${task.id}`,
        kind: "content_overdue_post",
        title: task.title,
        subtitle: "Data de postagem passou",
        urgency: "critical",
        contentTaskId: task.id,
      });
    }
  }

  return pendencies.sort((a, b) => {
    if (a.urgency !== b.urgency) return a.urgency === "critical" ? -1 : 1;
    return a.title.localeCompare(b.title, "pt-BR");
  });
}
