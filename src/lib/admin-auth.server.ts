import { createHash, timingSafeEqual } from "node:crypto";
import process from "node:process";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import type { TeamMember } from "@/lib/execution/types";

export const ADMIN_COOKIE = "raise_admin_session";
export const ADMIN_PERSON_COOKIE = "raise_admin_person";

const TEAM_MEMBERS: TeamMember[] = ["luan", "vini", "caio"];

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

export function verifyAdminPassword(password: string): boolean {
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

export function isAdminAuthenticated(): boolean {
  const token = getAdminSessionToken();
  if (!token) return false;
  const cookie = getCookie(ADMIN_COOKIE);
  return !!cookie && safeCompare(cookie, token);
}

export function getActivePerson(): TeamMember | null {
  if (!isAdminAuthenticated()) return null;
  const cookie = getCookie(ADMIN_PERSON_COOKIE);
  if (!cookie) return null;
  const [person, token] = cookie.split(":");
  if (!person || !token || !isValidTeamMember(person)) return null;
  if (!safeCompare(token, personToken(person))) return null;
  return person;
}

export function setAdminSession(person: TeamMember): void {
  const token = getAdminSessionToken();
  if (!token) throw new Error("ADMIN_PASSWORD não configurada");

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  setCookie(ADMIN_COOKIE, token, cookieOpts);
  setCookie(ADMIN_PERSON_COOKIE, `${person}:${personToken(person)}`, cookieOpts);
}

export function setActivePerson(person: TeamMember): void {
  if (!isAdminAuthenticated()) throw new Error("Não autenticado.");
  setCookie(ADMIN_PERSON_COOKIE, `${person}:${personToken(person)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminSession(): void {
  deleteCookie(ADMIN_COOKIE, { path: "/" });
  deleteCookie(ADMIN_PERSON_COOKIE, { path: "/" });
}
