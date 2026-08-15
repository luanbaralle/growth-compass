import type { OSNotification } from "@/domains/events/types";
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
  /** Persistida no banco — marcar como lida ao clicar */
  persisted?: boolean;
}

export function persistedNotificationToDashboard(
  notification: OSNotification,
): OSDashboardNotification {
  return {
    id: notification.id,
    title: notification.title,
    subtitle: notification.body ?? undefined,
    href: notification.action_url,
    tone:
      notification.urgency === "critical"
        ? "danger"
        : notification.urgency === "warning"
          ? "warning"
          : "default",
    persisted: true,
  };
}

export function mergeDashboardNotifications(
  persisted: OSNotification[],
  computed: OSDashboardNotification[],
  limit = 20,
): OSDashboardNotification[] {
  const persistedItems = persisted.map(persistedNotificationToDashboard);
  const hrefs = new Set(persistedItems.map((item) => item.href));
  const dedupedComputed = computed.filter((item) => !hrefs.has(item.href));
  return [...persistedItems, ...dedupedComputed].slice(0, limit);
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
