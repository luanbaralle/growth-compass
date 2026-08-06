#!/usr/bin/env npx tsx
/**
 * Migra dados legados (leads.json + execution.json clients) para Supabase.
 *
 * Uso: npx tsx scripts/migrate-legacy-data.ts
 * Requer: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY no .env
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} não definido`);
  return v;
}

async function dbInsert(table: string, row: Record<string, unknown>) {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`INSERT ${table}: ${res.status} ${text}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

async function dbSelect(table: string, query: string) {
  const url = requireEnv("SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`SELECT failed: ${await res.text()}`);
  return res.json();
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

const LEAD_STATUS_MAP: Record<string, string> = {
  new: "lead",
  contacted: "contato",
  converted: "ativo",
  lost: "encerrado",
};

const CLIENT_STATUS_MAP: Record<string, string> = {
  active: "ativo",
  prospect: "negociacao",
  paused: "pausado",
};

async function main() {
  console.log("Raise One OS — Migração de dados legados\n");

  const existing = await dbSelect("companies", "select=id,name&limit=1");
  if (existing.length > 0) {
    console.log("⚠️  Tabela companies já possui dados. Migração abortada para evitar duplicatas.");
    console.log("   Para forçar, esvazie a tabela manualmente no Supabase.");
    process.exit(1);
  }

  const seenNames = new Set<string>();
  let migrated = 0;

  // Leads
  try {
    const leadsRaw = await readFile(path.join(root, "data/leads.json"), "utf-8");
    const leads = JSON.parse(leadsRaw) as Array<{
      id: string;
      name: string;
      phone: string;
      city: string;
      cityState?: string;
      business: string;
      segment: string;
      source: string;
      link?: string;
      status: string;
      notes?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      utmContent?: string;
      utmTerm?: string;
      templateSlug?: string;
      microverticalId?: string;
      matchLevel?: string;
      displayLabel?: string;
      negocio?: string;
      createdAt: string;
    }>;

    for (const lead of leads) {
      const key = normalizeName(lead.name);
      if (seenNames.has(key)) {
        console.log(`  Skip duplicata lead: ${lead.name}`);
        continue;
      }
      seenNames.add(key);

      const company = await dbInsert("companies", {
        name: lead.name,
        whatsapp: lead.phone,
        city: lead.city,
        city_state: lead.cityState ?? null,
        segment: lead.segment,
        origin: lead.source,
        website: lead.link ?? null,
        stage: LEAD_STATUS_MAP[lead.status] ?? "lead",
        notes: lead.notes ?? `Negócio: ${lead.displayLabel ?? lead.business}`,
        utm_source: lead.utmSource ?? null,
        utm_medium: lead.utmMedium ?? null,
        utm_campaign: lead.utmCampaign ?? null,
        utm_content: lead.utmContent ?? null,
        utm_term: lead.utmTerm ?? null,
        template_slug: lead.templateSlug ?? null,
        microvertical_id: lead.microverticalId ?? null,
        match_level: lead.matchLevel ?? null,
        created_at: lead.createdAt,
        updated_at: lead.createdAt,
      });

      await dbInsert("company_activities", {
        company_id: company.id,
        type: "system",
        title: "Migrado de leads.json",
        body: `Lead original ID: ${lead.id}`,
        metadata: { legacyId: lead.id, source: "leads.json" },
      });

      migrated++;
      console.log(`  ✓ Lead → ${lead.name}`);
    }
  } catch (e) {
    console.log("  (leads.json não encontrado ou vazio)");
  }

  // Execution clients
  try {
    const execRaw = await readFile(path.join(root, "data/execution.json"), "utf-8");
    const exec = JSON.parse(execRaw) as {
      clients?: Array<{
        id: string;
        name: string;
        status: string;
        observation: string;
        owners: string[];
      }>;
    };

    for (const client of exec.clients ?? []) {
      const key = normalizeName(client.name);
      if (seenNames.has(key)) {
        console.log(`  Skip duplicata client: ${client.name}`);
        continue;
      }
      seenNames.add(key);

      const company = await dbInsert("companies", {
        name: client.name,
        stage: CLIENT_STATUS_MAP[client.status] ?? "ativo",
        notes: client.observation || null,
        responsible_id: client.owners[0] ?? null,
        origin: "migracao",
      });

      await dbInsert("company_activities", {
        company_id: company.id,
        type: "system",
        title: "Migrado de execution.json",
        body: `Cliente operacional original ID: ${client.id}`,
        metadata: { legacyId: client.id, source: "execution.json" },
      });

      migrated++;
      console.log(`  ✓ Client → ${client.name}`);
    }
  } catch (e) {
    console.log("  (execution.json não encontrado ou vazio)");
  }

  console.log(`\n✅ Migração concluída: ${migrated} empresas`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
