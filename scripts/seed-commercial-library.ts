#!/usr/bin/env npx tsx
/**
 * Popula a Biblioteca Comercial no Supabase com playbooks completos.
 *
 * Uso: npx tsx scripts/seed-commercial-library.ts
 * Requer: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY no .env
 */

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COMMERCIAL_PLAYBOOKS } from "../src/domains/prospection/content/index.js";
import {
  LEGACY_SCRIPT_TYPES,
  SCRIPT_TYPE_TO_DB,
} from "../src/domains/prospection/content/db-map.js";
import type { ScriptType } from "../src/domains/prospection/types.js";

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

async function dbFetch(path: string, init?: RequestInit) {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${init?.method ?? "GET"} ${path}: ${res.status} ${text}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

interface SegmentRow {
  id: string;
  slug: string;
}

interface ScriptRow {
  id: string;
  segment_id: string;
  script_type: ScriptType;
}

async function main() {
  console.log("Carregando segmentos...");
  const segments = (await dbFetch(
    "commercial_segments?select=id,slug&order=sort_order.asc",
  )) as SegmentRow[];

  const segmentBySlug = new Map(segments.map((s) => [s.slug, s.id]));

  for (const playbook of COMMERCIAL_PLAYBOOKS) {
    const segmentId = segmentBySlug.get(playbook.slug);
    if (!segmentId) {
      console.warn(`Segmento não encontrado: ${playbook.slug} — pulando.`);
      continue;
    }

    console.log(`\n→ ${playbook.slug}`);

    const scripts = (await dbFetch(
      `commercial_scripts?select=id,segment_id,script_type&segment_id=eq.${segmentId}`,
    )) as ScriptRow[];

    const dbToContent = new Map<string, string>();
    for (const [logical, content] of Object.entries(playbook.scripts)) {
      if (!content) continue;
      dbToContent.set(SCRIPT_TYPE_TO_DB[logical as ScriptType], content);
    }

    for (const script of scripts) {
      if ((LEGACY_SCRIPT_TYPES as readonly string[]).includes(script.script_type)) {
        await dbFetch(`commercial_scripts?id=eq.${script.id}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ content: "" }),
        });
        continue;
      }

      const content = dbToContent.get(script.script_type);
      if (content === undefined) continue;

      await dbFetch(`commercial_scripts?id=eq.${script.id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ content }),
      });
    }
    console.log(`  Scripts atualizados (${Object.keys(playbook.scripts).length} seções)`);

    await dbFetch(`commercial_objections?segment_id=eq.${segmentId}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });

    for (let i = 0; i < playbook.objections.length; i++) {
      const obj = playbook.objections[i];
      await dbFetch("commercial_objections", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          segment_id: segmentId,
          objection: obj.objection,
          response: obj.response,
          objective: obj.objective,
          sort_order: i,
        }),
      });
    }
    console.log(`  Objeções: ${playbook.objections.length}`);

    await dbFetch(`commercial_qualifications?segment_id=eq.${segmentId}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });

    for (let i = 0; i < playbook.qualifications.length; i++) {
      await dbFetch("commercial_qualifications", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          segment_id: segmentId,
          question: playbook.qualifications[i],
          sort_order: i,
        }),
      });
    }
    console.log(`  Qualificações: ${playbook.qualifications.length}`);

    if (playbook.case) {
      await dbFetch("commercial_cases", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          segment_id: segmentId,
          case_slug: playbook.case.caseSlug,
          title: playbook.case.title,
        }),
      });
    }
  }

  console.log("\nBiblioteca Comercial populada com sucesso.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
