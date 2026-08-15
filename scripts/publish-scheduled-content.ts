#!/usr/bin/env npx tsx
/**
 * Publica conteúdos com status "programado" cuja data de postagem já passou
 * das 22h (horário de Brasília).
 *
 * Uso:
 *   npx tsx scripts/publish-scheduled-content.ts
 *
 * Requer: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY no .env
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

import { publishDueScheduledContentTasks } from "../src/domains/content-production/publish-scheduled.server";

async function main() {
  const result = await publishDueScheduledContentTasks();
  console.log(`Verificado em: ${result.checkedAt}`);
  console.log(`Publicados: ${result.publishedCount}`);

  if (result.tasks.length === 0) {
    console.log("Nenhum conteúdo elegível para publicação automática.");
    return;
  }

  for (const task of result.tasks) {
    if (task.ok) {
      console.log(`  ✓ ${task.title} (${task.postDate})`);
      continue;
    }
    console.log(`  ✗ ${task.title} (${task.postDate}): ${task.error ?? "falha"}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
