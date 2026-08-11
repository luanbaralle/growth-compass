import {
  getNextActionUrgency,
  NEXT_ACTION_URGENCY_LABELS,
} from "@/domains/prospection/types";
import type { OSDashboardData } from "@/os/dashboard.service.server";

export interface OSDashboardNotification {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  tone: "default" | "warning" | "danger";
}

export function buildDashboardNotifications(
  data: OSDashboardData | null,
): OSDashboardNotification[] {
  if (!data) return [];

  const items: OSDashboardNotification[] = [];

  for (const lead of data.companies.recentLeads) {
    items.push({
      id: `lead-${lead.id}`,
      title: `Novo lead: ${lead.name}`,
      subtitle: lead.city ?? undefined,
      href: `/os/empresas/${lead.id}`,
      tone: "default",
    });
  }

  for (const project of data.projects.overdueItems) {
    items.push({
      id: `project-${project.id}`,
      title: `Projeto atrasado: ${project.title}`,
      subtitle: project.companyName ?? undefined,
      href: `/os/projetos/${project.id}`,
      tone: "danger",
    });
  }

  for (const entry of data.finance.overdueItems) {
    items.push({
      id: `finance-${entry.id}`,
      title: "Cobrança atrasada",
      subtitle: entry.companyName ?? entry.description,
      href: "/os/financeiro",
      tone: "danger",
    });
  }

  for (const prospect of data.prospection.upcomingActions) {
    const urgency = getNextActionUrgency(prospect.next_action_date);
    if (urgency !== "overdue" && urgency !== "today") continue;

    items.push({
      id: `prospect-${prospect.id}`,
      title: prospect.name,
      subtitle: prospect.next_action ?? NEXT_ACTION_URGENCY_LABELS[urgency],
      href: `/os/prospeccao/${prospect.id}`,
      tone: urgency === "overdue" ? "danger" : "warning",
    });
  }

  return items.slice(0, 12);
}
