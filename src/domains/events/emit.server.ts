import { isUniqueViolation } from "./idempotency";
import * as repo from "./repository.server";
import type { EmitDomainEventInput, DomainEvent, OSNotification } from "./types";
import type { OSTaskRow } from "./repository.server";

export interface EmitDomainEventResult {
  event: DomainEvent;
  duplicate: boolean;
  notifications: OSNotification[];
  tasks: OSTaskRow[];
}

/**
 * Emite um domain event idempotente e executa side effects uma única vez.
 *
 * - Retry com mesma idempotencyKey → retorna evento existente, sem recriar nada.
 * - Tasks automáticas recebem source_event_id e NÃO disparam task.created.
 */
export async function emitDomainEvent(
  input: EmitDomainEventInput,
): Promise<EmitDomainEventResult> {
  const existing = await repo.findDomainEventByIdempotencyKey(input.idempotencyKey);
  if (existing) {
    const [notifications, tasks] = await Promise.all([
      repo.findNotificationsByEventId(existing.id),
      repo.findTasksByEventId(existing.id),
    ]);
    return { event: existing, duplicate: true, notifications, tasks };
  }

  let event: DomainEvent;
  try {
    event = await repo.insertDomainEvent({
      idempotency_key: input.idempotencyKey,
      event_key: input.eventKey,
      entity_type: input.entityType,
      entity_id: input.entityId,
      company_id: input.companyId,
      prospect_id: input.prospectId,
      actor_id: input.actorId,
      payload: input.payload,
      activity_title: input.activityTitle,
      activity_body: input.activityBody,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      const duplicate = await repo.findDomainEventByIdempotencyKey(input.idempotencyKey);
      if (duplicate) {
        const [notifications, tasks] = await Promise.all([
          repo.findNotificationsByEventId(duplicate.id),
          repo.findTasksByEventId(duplicate.id),
        ]);
        return { event: duplicate, duplicate: true, notifications, tasks };
      }
    }
    throw error;
  }

  const notifications: OSNotification[] = [];
  for (const notification of input.notifications ?? []) {
    try {
      const row = await repo.insertNotification({
        domain_event_id: event.id,
        assignee_id: notification.assigneeId,
        title: notification.title,
        body: notification.body,
        action_url: notification.actionUrl,
        urgency: notification.urgency,
      });
      notifications.push(row);
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
  }

  const tasks: OSTaskRow[] = [];
  for (const task of input.tasks ?? []) {
    try {
      const row = await repo.insertTaskFromEvent({
        title: task.title,
        assignee_id: task.assigneeId,
        due_date: task.dueDate,
        company_id: task.companyId ?? input.companyId,
        project_id: task.projectId,
        source_event_id: event.id,
        source_type: input.eventKey,
        urgency: "default",
      });
      tasks.push(row);
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
  }

  if (input.projections) {
    await input.projections(event);
  }

  return { event, duplicate: false, notifications, tasks };
}
