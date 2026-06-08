import { createHash, timingSafeEqual } from "node:crypto";
import process from "node:process";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

export const ADMIN_COOKIE = "raise_admin_session";

function getSessionSecret(): string {
  return process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "dev-insecure-secret";
}

export function getAdminSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256")
    .update(`${password}:${getSessionSecret()}`)
    .digest("hex");
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeCompare(password, expected);
}

export function isAdminAuthenticated(): boolean {
  const token = getAdminSessionToken();
  if (!token) return false;
  const cookie = getCookie(ADMIN_COOKIE);
  return !!cookie && safeCompare(cookie, token);
}

export function setAdminSession(): void {
  const token = getAdminSessionToken();
  if (!token) throw new Error("ADMIN_PASSWORD não configurada");
  setCookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminSession(): void {
  deleteCookie(ADMIN_COOKIE, { path: "/" });
}
