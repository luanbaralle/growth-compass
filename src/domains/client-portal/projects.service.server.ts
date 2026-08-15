import { dbSelect } from "@/lib/supabase/server";
import type { DomainEvent } from "@/domains/events/types";
import { findChecklistItems, findProjects } from "@/domains/projects/repository.server";
import type { Project, ProjectStatus } from "@/domains/projects/types";
import { ACTIVE_STATUSES, TYPE_LABELS } from "@/domains/projects/types";
import {
  isClientVisibleEvent,
  translateClientEventTitle,
  translateProjectBlocked,
  translateProjectStatus,
  translateProjectStatusChange,
} from "./translate";
import type { ClientProjectDetail, ClientProjectHistoryItem, ClientProjectListItem } from "./types";

const CLIENT_HIDDEN_STATUSES: ProjectStatus[] = ["cancelled"];

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

async function checklistProgress(projectId: string): Promise<number | null> {
  const checklist = await findChecklistItems(projectId);
  if (checklist.length === 0) return null;
  const done = checklist.filter((item) => item.done).length;
  return Math.round((done / checklist.length) * 100);
}

function projectNeedsClient(project: Project): boolean {
  return (
    project.status === "blocked" &&
    !!project.blocked_by_type &&
    ["client", "approval", "access"].includes(project.blocked_by_type)
  );
}

function clientNextStep(project: Project): string | null {
  if (project.status === "blocked" && project.blocked_by_type) {
    return translateProjectBlocked(project.blocked_by_type);
  }
  if (project.status === "done" || project.status === "cancelled") return null;
  if (project.status === "review") {
    return project.next_action?.trim() || "Aguardando sua revisão";
  }
  if (projectNeedsClient(project) && project.blocked_by_detail?.trim()) {
    return project.blocked_by_detail.trim();
  }
  if (project.status === "in_progress") {
    return project.next_action?.trim() || "Desenvolvimento em curso";
  }
  if (project.status === "pending") {
    return "Início do projeto";
  }
  return null;
}

function formatForecastDate(iso: string | null): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return null;
  return `${d}/${m}/${y}`;
}

function formatHistoryBody(event: DomainEvent): string | null {
  const payload = event.payload ?? {};
  if (event.event_key === "project.status_changed") {
    const from = typeof payload.from === "string" ? payload.from : null;
    const to = typeof payload.to === "string" ? payload.to : null;
    if (from && to) return translateProjectStatusChange(from, to);
  }
  if (event.event_key === "project.blocked") {
    const type = typeof payload.blockedByType === "string" ? payload.blockedByType : null;
    const detail = typeof payload.detail === "string" ? payload.detail : null;
    if (type && detail) {
      return `${translateProjectBlocked(type as import("@/domains/projects/types").ProjectBlockedByType)} — ${detail}`;
    }
    if (type) {
      return translateProjectBlocked(type as import("@/domains/projects/types").ProjectBlockedByType);
    }
    return event.activity_body;
  }
  if (event.event_key === "project.created") {
    return typeof payload.title === "string" ? payload.title : event.activity_body;
  }
  return event.activity_body;
}

async function fetchProjectHistory(
  companyId: string,
  projectId: string,
): Promise<ClientProjectHistoryItem[]> {
  const events = await dbSelect<DomainEvent>(
    "domain_events",
    encodeQuery({
      select: "*",
      company_id: `eq.${companyId}`,
      entity_type: "eq.project",
      entity_id: `eq.${projectId}`,
      order: "occurred_at.desc",
      limit: "40",
    }),
  );

  return events
    .filter((event) => isClientVisibleEvent(event.event_key))
    .map((event) => ({
      id: event.id,
      title: translateClientEventTitle(event.event_key),
      body: formatHistoryBody(event),
      occurredAt: event.occurred_at,
    }));
}

async function toListItem(project: Project): Promise<ClientProjectListItem> {
  return {
    id: project.id,
    title: project.title,
    typeLabel: TYPE_LABELS[project.type],
    status: project.status,
    statusLabel: translateProjectStatus(project.status),
    progressPct: await checklistProgress(project.id),
    dueDate: project.due_date,
    needsClient: projectNeedsClient(project),
  };
}

export async function listClientProjects(companyId: string): Promise<ClientProjectListItem[]> {
  const projects = await findProjects({ companyId });
  const visible = projects.filter((p) => !CLIENT_HIDDEN_STATUSES.includes(p.status));

  const items = await Promise.all(visible.map((p) => toListItem(p)));

  return items.sort((a, b) => {
    if (a.needsClient && !b.needsClient) return -1;
    if (b.needsClient && !a.needsClient) return 1;
    if (ACTIVE_STATUSES.includes(a.status) && !ACTIVE_STATUSES.includes(b.status)) return -1;
    if (ACTIVE_STATUSES.includes(b.status) && !ACTIVE_STATUSES.includes(a.status)) return 1;
    return a.title.localeCompare(b.title, "pt-BR");
  });
}

async function requireClientProject(companyId: string, projectId: string): Promise<Project> {
  const projects = await findProjects({ companyId });
  const project = projects.find((p) => p.id === projectId);
  if (!project || CLIENT_HIDDEN_STATUSES.includes(project.status)) {
    throw new Error("Projeto não encontrado.");
  }
  return project;
}

export async function getClientProjectDetail(
  companyId: string,
  projectId: string,
): Promise<ClientProjectDetail> {
  const project = await requireClientProject(companyId, projectId);
  const base = await toListItem(project);
  const history = await fetchProjectHistory(companyId, projectId);

  return {
    ...base,
    nextStepLabel: clientNextStep(project),
    forecastDate: formatForecastDate(project.due_date),
    lastUpdatedAt: project.updated_at,
    history,
  };
}
