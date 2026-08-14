import { dbInsert, dbSelect } from "@/lib/supabase/server";
import type { TeamMember } from "@/lib/auth/types";
import type {
  DomainEvent,
  DomainEntityType,
  DomainEventKey,
  NotificationUrgency,
  OSNotification,
} from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

export interface InsertDomainEventInput {
  idempotency_key: string;
  event_key: DomainEventKey;
  entity_type: DomainEntityType;
  entity_id: string;
  company_id?: string | null;
  prospect_id?: string | null;
  actor_id?: TeamMember | null;
  payload?: Record<string, unknown>;
  activity_title: string;
  activity_body?: string | null;
}

export interface InsertNotificationInput {
  domain_event_id: string;
  assignee_id: TeamMember;
  title: string;
  body?: string | null;
  action_url: string;
  urgency?: NotificationUrgency;
}

export interface InsertTaskInput {
  title: string;
  assignee_id: TeamMember;
  due_date?: string | null;
  company_id?: string | null;
  project_id?: string | null;
  source_event_id: string;
  source_type: string;
  urgency?: NotificationUrgency;
}

export interface OSTaskRow {
  id: string;
  title: string;
  due_date: string | null;
  assignee_id: string | null;
  company_id: string | null;
  project_id: string | null;
  done: boolean;
  source_event_id: string | null;
  source_type: string | null;
  urgency: string;
  created_at: string;
}

export async function findDomainEventByIdempotencyKey(
  idempotencyKey: string,
): Promise<DomainEvent | null> {
  const rows = await dbSelect<DomainEvent>(
    "domain_events",
    encodeQuery({
      select: "*",
      idempotency_key: `eq.${idempotencyKey}`,
      limit: "1",
    }),
  );
  return rows[0] ?? null;
}

export async function insertDomainEvent(
  input: InsertDomainEventInput,
): Promise<DomainEvent> {
  const [event] = await dbInsert<DomainEvent>("domain_events", {
    idempotency_key: input.idempotency_key,
    event_key: input.event_key,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    company_id: input.company_id ?? null,
    prospect_id: input.prospect_id ?? null,
    actor_id: input.actor_id ?? null,
    payload: input.payload ?? {},
    activity_title: input.activity_title,
    activity_body: input.activity_body ?? null,
  });
  return event;
}

export async function insertNotification(
  input: InsertNotificationInput,
): Promise<OSNotification> {
  const [notification] = await dbInsert<OSNotification>("notifications", {
    domain_event_id: input.domain_event_id,
    assignee_id: input.assignee_id,
    title: input.title,
    body: input.body ?? null,
    action_url: input.action_url,
    urgency: input.urgency ?? "default",
  });
  return notification;
}

export async function insertTaskFromEvent(input: InsertTaskInput): Promise<OSTaskRow> {
  const [task] = await dbInsert<OSTaskRow>("tasks", {
    title: input.title,
    assignee_id: input.assignee_id,
    due_date: input.due_date ?? null,
    company_id: input.company_id ?? null,
    project_id: input.project_id ?? null,
    source_event_id: input.source_event_id,
    source_type: input.source_type,
    urgency: input.urgency ?? "default",
    done: false,
  });
  return task;
}

export async function findNotificationsByEventId(
  domainEventId: string,
): Promise<OSNotification[]> {
  return dbSelect<OSNotification>(
    "notifications",
    encodeQuery({
      select: "*",
      domain_event_id: `eq.${domainEventId}`,
      order: "created_at.asc",
    }),
  );
}

export async function findTasksByEventId(domainEventId: string): Promise<OSTaskRow[]> {
  return dbSelect<OSTaskRow>(
    "tasks",
    encodeQuery({
      select: "*",
      source_event_id: `eq.${domainEventId}`,
      order: "created_at.asc",
    }),
  );
}
