import { createHash, randomBytes } from "node:crypto";
import process from "node:process";
import { getRequestHeader } from "@tanstack/react-start/server";
import {
  findCompanyUserByEmail,
  insertMagicLink,
  markMagicLinkUsed,
  findActiveMagicLinkByHash,
} from "@/domains/client-portal/repository.server";
import { sendClientMagicLinkEmail } from "./email.server";
import { setClientSession } from "@/lib/client-auth/session.server";

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getAppBaseUrl(): string {
  const fromEnv =
    process.env.CLIENT_APP_URL ??
    process.env.APP_URL ??
    process.env.SITE_URL ??
    process.env.VITE_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const host = getRequestHeader("host");
  if (host) {
    const proto =
      getRequestHeader("x-forwarded-proto") ??
      (process.env.NODE_ENV === "production" ? "https" : "http");
    return `${proto}://${host}`;
  }

  if (process.env.NODE_ENV !== "production") return "http://localhost:8080";
  throw new Error("Defina CLIENT_APP_URL (ou APP_URL) para gerar magic links.");
}

export async function requestClientMagicLink(email: string): Promise<{ devLink?: string }> {
  const user = await findCompanyUserByEmail(email);
  if (!user) {
    return {};
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS).toISOString();

  await insertMagicLink({
    company_user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  const verifyUrl = `${getAppBaseUrl()}/client/auth/verify?token=${encodeURIComponent(token)}`;

  const sent = await sendClientMagicLinkEmail({
    to: user.email,
    name: user.name,
    verifyUrl,
  });

  if (!sent.ok && process.env.NODE_ENV !== "production") {
    return { devLink: verifyUrl };
  }

  return {};
}

export async function verifyClientMagicLinkToken(token: string): Promise<void> {
  if (!token || token.length < 16) {
    throw new Error("Link inválido ou expirado.");
  }

  const tokenHash = hashToken(token);
  const row = await findActiveMagicLinkByHash(tokenHash);
  if (!row?.company_users) {
    throw new Error("Link inválido ou expirado.");
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    throw new Error("Link expirado. Solicite um novo acesso.");
  }

  await markMagicLinkUsed(row.id);
  setClientSession(row.company_users.id, row.company_users.company_id);
}
