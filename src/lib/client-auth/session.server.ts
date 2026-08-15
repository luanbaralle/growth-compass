import { createHmac, timingSafeEqual } from "node:crypto";
import process from "node:process";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import type { ClientSessionUser } from "@/domains/client-portal/types";
import { findCompanyUserById } from "@/domains/client-portal/repository.server";

export const CLIENT_SESSION_COOKIE = "raise_client_session";

const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSessionSecret(): string {
  return process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "dev-insecure-secret";
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function signPayload(userId: string, companyId: string, expMs: number): string {
  const payload = `${userId}:${companyId}:${expMs}`;
  const sig = createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
  return `${payload}:${sig}`;
}

function parseSignedSession(value: string): { userId: string; companyId: string; expMs: number } | null {
  const parts = value.split(":");
  if (parts.length !== 4) return null;
  const [userId, companyId, expRaw, sig] = parts;
  if (!userId || !companyId || !expRaw || !sig) return null;
  const expMs = Number(expRaw);
  if (!Number.isFinite(expMs)) return null;
  const expected = signPayload(userId, companyId, expMs);
  if (!safeCompare(value, expected)) return null;
  if (Date.now() > expMs) return null;
  return { userId, companyId, expMs };
}

export function setClientSession(userId: string, companyId: string): void {
  const expMs = Date.now() + SESSION_MAX_AGE_SEC * 1000;
  const token = signPayload(userId, companyId, expMs);
  setCookie(CLIENT_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearClientSession(): void {
  deleteCookie(CLIENT_SESSION_COOKIE, { path: "/" });
}

export function getClientSessionIds(): { userId: string; companyId: string } | null {
  const cookie = getCookie(CLIENT_SESSION_COOKIE);
  if (!cookie) return null;
  const parsed = parseSignedSession(cookie);
  if (!parsed) return null;
  return { userId: parsed.userId, companyId: parsed.companyId };
}

export async function getClientSessionUser(): Promise<ClientSessionUser | null> {
  const ids = getClientSessionIds();
  if (!ids) return null;
  const row = await findCompanyUserById(ids.userId);
  if (!row || row.company_id !== ids.companyId) {
    clearClientSession();
    return null;
  }
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    companyId: row.company_id,
    companyName: row.companies?.name ?? "Sua empresa",
    companyLogoUrl: null,
  };
}

export async function requireClientAuth(): Promise<ClientSessionUser> {
  const user = await getClientSessionUser();
  if (!user) {
    throw new Error("Não autorizado.");
  }
  return user;
}

export function isClientAuthenticated(): boolean {
  return getClientSessionIds() !== null;
}
