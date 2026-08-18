import { emitDomainEvent } from "@/domains/events/emit.server";
import { buildIdempotencyKey } from "@/domains/events/idempotency";
import { DEFAULT_ASSIGNEE } from "@/domains/events/types";
import type { TeamMember } from "@/lib/auth/types";

function sessionUrl(sessionId: string): string {
  return `/os/copilot/${sessionId}`;
}

export async function emitCopilotSessionStarted(input: {
  sessionId: string;
  prospectId: string | null;
  companyName: string;
  actorId: TeamMember | null;
}) {
  await emitDomainEvent({
    idempotencyKey: buildIdempotencyKey("meeting.started", "meeting", input.sessionId),
    eventKey: "meeting.started",
    entityType: "meeting",
    entityId: input.sessionId,
    actorId: input.actorId,
    prospectId: input.prospectId,
    payload: { companyName: input.companyName },
    activityTitle: "Sessão Copilot iniciada",
    activityBody: input.companyName,
    notifications: input.prospectId
      ? [
          {
            assigneeId: DEFAULT_ASSIGNEE,
            title: "Copilot ao vivo",
            body: input.companyName,
            actionUrl: sessionUrl(input.sessionId),
          },
        ]
      : [],
  });
}

export async function emitCopilotDiscoveryCaptured(input: {
  sessionId: string;
  prospectId: string | null;
  objectiveKey: string;
  label: string;
  actorId: TeamMember | null;
  discriminator: string;
}) {
  await emitDomainEvent({
    idempotencyKey: buildIdempotencyKey(
      "meeting.discovery_captured",
      "meeting",
      input.sessionId,
      input.discriminator,
    ),
    eventKey: "meeting.discovery_captured",
    entityType: "meeting",
    entityId: input.sessionId,
    actorId: input.actorId,
    prospectId: input.prospectId,
    payload: { objectiveKey: input.objectiveKey, label: input.label },
    activityTitle: "Descoberta registrada",
    activityBody: input.label,
  });
}

export async function emitCopilotInconsistency(input: {
  sessionId: string;
  prospectId: string | null;
  label: string;
  actorId: TeamMember | null;
  discriminator: string;
}) {
  await emitDomainEvent({
    idempotencyKey: buildIdempotencyKey(
      "meeting.inconsistency_detected",
      "meeting",
      input.sessionId,
      input.discriminator,
    ),
    eventKey: "meeting.inconsistency_detected",
    entityType: "meeting",
    entityId: input.sessionId,
    actorId: input.actorId,
    prospectId: input.prospectId,
    payload: { label: input.label },
    activityTitle: "Inconsistência detectada",
    activityBody: input.label,
    notifications: [
      {
        assigneeId: DEFAULT_ASSIGNEE,
        title: "Validar dado inconsistente",
        body: input.label,
        actionUrl: sessionUrl(input.sessionId),
        urgency: "warning",
      },
    ],
  });
}

export async function emitCopilotSessionCompleted(input: {
  sessionId: string;
  prospectId: string | null;
  companyName: string;
  overallCoverage: number;
  proposalStatus: string;
  actorId: TeamMember | null;
}) {
  await emitDomainEvent({
    idempotencyKey: buildIdempotencyKey("meeting.completed", "meeting", input.sessionId),
    eventKey: "meeting.completed",
    entityType: "meeting",
    entityId: input.sessionId,
    actorId: input.actorId,
    prospectId: input.prospectId,
    payload: {
      companyName: input.companyName,
      overallCoverage: input.overallCoverage,
      proposalStatus: input.proposalStatus,
    },
    activityTitle: "Reunião Copilot encerrada",
    activityBody: `${input.companyName} — cobertura ${input.overallCoverage}%`,
    notifications: [
      {
        assigneeId: DEFAULT_ASSIGNEE,
        title: "Diagnóstico disponível",
        body: input.companyName,
        actionUrl: sessionUrl(input.sessionId),
      },
    ],
  });

  if (input.proposalStatus !== "ready") {
    await emitDomainEvent({
      idempotencyKey: buildIdempotencyKey(
        "meeting.diagnosis_ready",
        "meeting",
        input.sessionId,
        "gaps",
      ),
      eventKey: "meeting.diagnosis_ready",
      entityType: "meeting",
      entityId: input.sessionId,
      actorId: input.actorId,
      prospectId: input.prospectId,
      payload: { proposalStatus: input.proposalStatus },
      activityTitle: "Proposta não ready",
      activityBody: `Revisar gaps antes de montar proposta — ${input.companyName}`,
      notifications: [
        {
          assigneeId: DEFAULT_ASSIGNEE,
          title: "Gaps no diagnóstico",
          body: input.companyName,
          actionUrl: sessionUrl(input.sessionId),
          urgency: "warning",
        },
      ],
    });
  }
}

export async function emitCopilotEvidenceVerified(input: {
  sessionId: string;
  prospectId: string | null;
  objectiveKey: string;
  label: string;
  actor: TeamMember;
}) {
  await emitDomainEvent({
    idempotencyKey: buildIdempotencyKey(
      "meeting.discovery_captured",
      "meeting",
      input.sessionId,
      `verified:${input.objectiveKey}`,
    ),
    eventKey: "meeting.discovery_captured",
    entityType: "meeting",
    entityId: input.sessionId,
    actorId: input.actor,
    prospectId: input.prospectId,
    payload: { objectiveKey: input.objectiveKey, verified: true },
    activityTitle: "Descoberta verificada",
    activityBody: input.label,
  });
}
