export function isUnauthorizedError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /não autorizado|unauthorized/i.test(msg);
}

function sanitizeClientErrorMessage(message: string, fallback: string): string {
  const trimmed = message.trim();
  if (!trimmed) return fallback;
  if (trimmed.length > 400) return fallback;
  if (/^\s*</.test(trimmed) || /<!doctype html/i.test(trimmed)) return fallback;
  return trimmed;
}

export function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) {
    return sanitizeClientErrorMessage(err.message, fallback);
  }
  if (typeof err === "string") {
    return sanitizeClientErrorMessage(err, fallback);
  }
  return fallback;
}
