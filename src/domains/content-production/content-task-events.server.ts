import type { TeamMember } from "@/lib/auth/types";
import type { ContentTask, ContentTaskEventType } from "./types";
import {
  formatChannels,
  formatPostDate,
  normalizePublication,
  STATUS_LABELS,
  TYPE_LABELS,
  type ContentChannel,
  type ContentPublication,
  type ContentTaskStatus,
  type ContentType,
} from "./types";
import { TEAM_LABELS } from "@/lib/auth/types";
import * as repo from "./repository.server";

type EventDraft = {
  type: ContentTaskEventType;
  title: string;
  body?: string | null;
  metadata?: Record<string, unknown>;
};

async function logEvents(
  taskId: string,
  authorId: TeamMember | null,
  events: EventDraft[],
) {
  for (const event of events) {
    await repo.insertContentTaskEvent({
      content_task_id: taskId,
      author_id: authorId,
      ...event,
    });
  }
}

function channelsEqual(a: ContentChannel[], b: ContentChannel[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((value, index) => value === sortedB[index]);
}

function publicationEqual(a: ContentPublication, b: ContentPublication): boolean {
  return JSON.stringify(normalizePublication(a)) === JSON.stringify(normalizePublication(b));
}

function buildUpdateEvents(
  existing: ContentTask,
  patch: Partial<{
    title: string;
    status: ContentTaskStatus;
    channels: ContentChannel[];
    themeObjective: string;
    contentType: ContentType;
    postDate: string;
    productionOwnerId: TeamMember;
    notes: string;
    briefingHook: string;
    briefingScript: string;
    briefingCta: string;
    briefingReferences: string;
    clientApprovedAt: string | null;
    clientApprovedBy: string;
    publication: ContentPublication;
  }>,
): EventDraft[] {
  const events: EventDraft[] = [];

  if (patch.status !== undefined && patch.status !== existing.status) {
    events.push({
      type: "status_changed",
      title: "Status alterado",
      body: `${STATUS_LABELS[existing.status]} → ${STATUS_LABELS[patch.status]}`,
      metadata: { from: existing.status, to: patch.status },
    });
  }

  if (patch.title !== undefined && patch.title !== existing.title) {
    events.push({
      type: "title_changed",
      title: "Título alterado",
      body: `"${existing.title}" → "${patch.title}"`,
    });
  }

  if (patch.channels !== undefined && !channelsEqual(patch.channels, existing.channels)) {
    events.push({
      type: "channels_changed",
      title: "Canais alterados",
      body: `${formatChannels(existing.channels)} → ${formatChannels(patch.channels)}`,
      metadata: { from: existing.channels, to: patch.channels },
    });
  }

  if (
    patch.themeObjective !== undefined &&
    (patch.themeObjective || null) !== existing.theme_objective
  ) {
    events.push({
      type: "theme_changed",
      title: "Tema | objetivo atualizado",
    });
  }

  if (patch.contentType !== undefined && patch.contentType !== existing.content_type) {
    events.push({
      type: "content_type_changed",
      title: "Tipo alterado",
      body: `${TYPE_LABELS[existing.content_type]} → ${TYPE_LABELS[patch.contentType]}`,
      metadata: { from: existing.content_type, to: patch.contentType },
    });
  }

  if (patch.postDate !== undefined) {
    const nextDate = patch.postDate || null;
    if (nextDate !== existing.post_date) {
      events.push({
        type: "post_date_changed",
        title: "Data de postagem alterada",
        body: `${formatPostDate(existing.post_date)} → ${formatPostDate(nextDate)}`,
        metadata: { from: existing.post_date, to: nextDate },
      });
    }
  }

  if (patch.productionOwnerId !== undefined) {
    const nextOwner = patch.productionOwnerId || null;
    if (nextOwner !== existing.production_owner_id) {
      const fromLabel = existing.production_owner_id
        ? (TEAM_LABELS[existing.production_owner_id as TeamMember] ?? existing.production_owner_id)
        : "Não definido";
      const toLabel = nextOwner
        ? (TEAM_LABELS[nextOwner] ?? nextOwner)
        : "Não definido";
      events.push({
        type: "production_owner_changed",
        title: "Responsável alterado",
        body: `${fromLabel} → ${toLabel}`,
        metadata: { from: existing.production_owner_id, to: nextOwner },
      });
    }
  }

  if (patch.notes !== undefined && (patch.notes || null) !== (existing.notes || null)) {
    events.push({
      type: "notes_changed",
      title: "Observações atualizadas",
    });
  }

  if (
    (patch.briefingHook !== undefined &&
      (patch.briefingHook || null) !== (existing.briefing_hook || null)) ||
    (patch.briefingScript !== undefined &&
      (patch.briefingScript || null) !== (existing.briefing_script || null)) ||
    (patch.briefingCta !== undefined &&
      (patch.briefingCta || null) !== (existing.briefing_cta || null)) ||
    (patch.briefingReferences !== undefined &&
      (patch.briefingReferences || null) !== (existing.briefing_references || null))
  ) {
    events.push({
      type: "briefing_changed",
      title: "Briefing atualizado",
    });
  }

  if (
    (patch.clientApprovedAt !== undefined &&
      (patch.clientApprovedAt || null) !== (existing.client_approved_at || null)) ||
    (patch.clientApprovedBy !== undefined &&
      (patch.clientApprovedBy || null) !== (existing.client_approved_by || null))
  ) {
    const approved = patch.clientApprovedAt ?? existing.client_approved_at;
    events.push({
      type: "approval_changed",
      title: approved ? "Aprovação do cliente registrada" : "Aprovação do cliente removida",
      body: patch.clientApprovedBy || existing.client_approved_by || undefined,
    });
  }

  if (
    patch.publication !== undefined &&
    !publicationEqual(patch.publication, existing.publication)
  ) {
    events.push({
      type: "publication_changed",
      title: "Publicação atualizada",
    });
  }

  return events;
}

export async function listContentTaskEvents(taskId: string) {
  const task = await repo.findContentTaskById(taskId);
  if (!task) return null;
  const events = await repo.findContentTaskEvents(taskId);
  return { events };
}

export async function addContentTaskNote(
  taskId: string,
  body: string,
  authorId: TeamMember | null,
) {
  const task = await repo.findContentTaskById(taskId);
  if (!task) return null;

  const event = await repo.insertContentTaskEvent({
    content_task_id: taskId,
    type: "note",
    title: "Nota adicionada",
    body: body.trim(),
    author_id: authorId,
  });

  return event;
}

export { buildUpdateEvents, logEvents, channelsEqual };
