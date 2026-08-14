import type { DomainEntityType, DomainEventKey } from "./types";

/** Monta idempotency_key determinística para operações comuns */
export function buildIdempotencyKey(
  eventKey: DomainEventKey,
  entityType: DomainEntityType,
  entityId: string,
  discriminator?: string,
): string {
  const base = `${eventKey}:${entityType}:${entityId}`;
  return discriminator ? `${base}:${discriminator}` : base;
}

export function buildStatusChangeDiscriminator(from: string, to: string): string {
  return `${from}→${to}`;
}

export function isUniqueViolation(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("23505") ||
    message.includes("duplicate key") ||
    message.includes("unique constraint")
  );
}
