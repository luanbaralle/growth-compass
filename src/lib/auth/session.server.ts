import { createHash, timingSafeEqual } from "node:crypto";
import process from "node:process";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import type { TeamMember } from "./types";
import { TEAM_MEMBERS } from "./types";

export const OS_COOKIE = "raise_os_session";
export const OS_PERSON_COOKIE = "raise_os_person";

function getSessionSecret(): string {
  return process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "dev-insecure-secret";
}

export function getSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256")
    .update(`${password}:${getSessionSecret()}`)
    .digest("hex");
}

function personToken(person: TeamMember): string {
  return createHash("sha256")
    .update(`person:${person}:${getSessionSecret()}`)
    .digest("hex");
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeCompare(password, expected);
}

export function verifyPersonPin(person: TeamMember, pin: string): boolean {
  const envKey = `ADMIN_PIN_${person.toUpperCase()}` as keyof NodeJS.ProcessEnv;
  const expected = process.env[envKey];
  if (!expected) return true;
  if (!pin) return false;
  return safeCompare(pin, expected);
}

export function isValidTeamMember(value: string): value is TeamMember {
  return TEAM_MEMBERS.includes(value as TeamMember);
}

export function isAuthenticated(): boolean {
  const token = getSessionToken();
  if (!token) return false;
  const cookie = getCookie(OS_COOKIE);
  return !!cookie && safeCompare(cookie, token);
}

export function getActivePerson(): TeamMember | null {
  if (!isAuthenticated()) return null;
  const cookie = getCookie(OS_PERSON_COOKIE);
  if (!cookie) return null;
  const [person, token] = cookie.split(":");
  if (!person || !token || !isValidTeamMember(person)) return null;
  if (!safeCompare(token, personToken(person))) return null;
  return person;
}

export function requireAuth(): TeamMember | null {
  if (!isAuthenticated()) {
    throw new Error("Não autorizado.");
  }
  return getActivePerson();
}

export function setSession(person: TeamMember): void {
  const token = getSessionToken();
  if (!token) throw new Error("ADMIN_PASSWORD não configurada");

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  setCookie(OS_COOKIE, token, cookieOpts);
  setCookie(OS_PERSON_COOKIE, `${person}:${personToken(person)}`, cookieOpts);
}

export function setActivePerson(person: TeamMember): void {
  if (!isAuthenticated()) throw new Error("Não autenticado.");
  setCookie(OS_PERSON_COOKIE, `${person}:${personToken(person)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSession(): void {
  deleteCookie(OS_COOKIE, { path: "/" });
  deleteCookie(OS_PERSON_COOKIE, { path: "/" });
}
