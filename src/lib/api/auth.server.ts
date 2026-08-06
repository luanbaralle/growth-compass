import type { TeamMember } from "@/lib/auth/types";

export async function withAuth<T>(fn: (person: TeamMember | null) => Promise<T>): Promise<T> {
  const { requireAuth, getActivePerson } = await import("@/lib/auth/session.server");
  requireAuth();
  return fn(getActivePerson());
}
