#!/usr/bin/env npx tsx
/**
 * Remove arquivos órfãos de produção no bucket company-files/content-tasks/
 * (uploads sem linha correspondente em content_task_files).
 *
 * Uso:
 *   npx tsx scripts/cleanup-content-task-storage-orphans.ts          # dry-run
 *   npx tsx scripts/cleanup-content-task-storage-orphans.ts --apply  # exclui de fato
 *
 * Requer: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY no .env
 */

import {
  dbSelect,
  storageDelete,
  storageListAllFilePaths,
} from "../src/lib/supabase/server";

const CONTENT_TASKS_PREFIX = "content-tasks";
const apply = process.argv.includes("--apply");

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

async function main() {
  console.log(apply ? "Modo: APPLY (vai excluir arquivos)" : "Modo: dry-run (simulação)");

  const knownRows = await dbSelect<{ storage_path: string }>(
    "content_task_files",
    encodeQuery({ select: "storage_path" }),
  );
  const knownPaths = new Set(knownRows.map((row) => row.storage_path));

  const storagePaths = await storageListAllFilePaths(CONTENT_TASKS_PREFIX);
  const orphans = storagePaths.filter((path) => !knownPaths.has(path));

  if (orphans.length === 0) {
    console.log("Nenhum órfão encontrado em content-tasks/.");
    return;
  }

  console.log(`Órfãos encontrados: ${orphans.length}`);
  for (const path of orphans) {
    console.log(`  - ${path}`);
  }

  if (!apply) {
    console.log("\nPara excluir, rode novamente com --apply");
    return;
  }

  let deleted = 0;
  let failed = 0;

  for (const path of orphans) {
    try {
      await storageDelete(path);
      deleted += 1;
      console.log(`Excluído: ${path}`);
    } catch (err) {
      failed += 1;
      console.error(`Falha: ${path}`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nConcluído. Excluídos: ${deleted}, falhas: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
