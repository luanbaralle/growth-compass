#!/usr/bin/env npx tsx
/**
 * Cria um usuário de portal para a primeira empresa disponível (piloto).
 *
 * Uso:
 *   npx tsx scripts/seed-client-user.ts
 *   npx tsx scripts/seed-client-user.ts --email contato@empresa.com --name "Gabriel"
 *
 * Requer: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e migration 019 aplicada.
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} não definido`);
  return v;
}

function parseArgs() {
  const args = process.argv.slice(2);
  let email: string | undefined;
  let name: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email") email = args[++i];
    if (args[i] === "--name") name = args[++i];
  }
  return { email, name };
}

async function dbFetch(path: string, init?: RequestInit) {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`${path}: ${res.status} ${await res.text()}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function main() {
  const { email: emailArg, name: nameArg } = parseArgs();

  const companies = await dbFetch(
    "companies?select=id,name,email,stage&order=created_at.asc&limit=50",
  );
  if (!Array.isArray(companies) || companies.length === 0) {
    throw new Error("Nenhuma empresa encontrada. Cadastre uma company no OS primeiro.");
  }

  const company =
    companies.find((c: { stage: string }) => c.stage === "ativo") ?? companies[0];

  const email = (emailArg ?? company.email ?? `cliente+${company.id.slice(0, 8)}@raiseone.dev`)
    .trim()
    .toLowerCase();
  const name = nameArg ?? company.name.split(/\s+/)[0] ?? "Cliente";

  const existing = await dbFetch(
    `company_users?email=eq.${encodeURIComponent(email)}&select=id,email&limit=1`,
  );
  if (Array.isArray(existing) && existing[0]) {
    console.log("Usuário já existe:", existing[0].email);
    return;
  }

  const [user] = await dbFetch("company_users", {
    method: "POST",
    body: JSON.stringify({
      company_id: company.id,
      email,
      name,
    }),
  });

  console.log("Usuário do portal criado:");
  console.log("  Empresa:", company.name, `(${company.id})`);
  console.log("  Nome:", user.name);
  console.log("  E-mail:", user.email);
  console.log("");
  console.log("Acesse /client/login e solicite o magic link com este e-mail.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
