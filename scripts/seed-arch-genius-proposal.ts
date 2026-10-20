#!/usr/bin/env npx tsx
/**
 * Publica a proposta referência Arch Genius (slug: arch-genius).
 *
 * Uso:
 *   npx tsx scripts/seed-arch-genius-proposal.ts
 *
 * Requer: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
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

async function main() {
  const repo = await import("../src/domains/proposals/repository.server");
  const { ARCH_GENIUS_SLUG, ARCH_GENIUS_REFERENCE, ARCH_GENIUS_PRICING } = await import(
    "../src/domains/proposals/reference/arch-genius-content"
  );

  const existing = await repo.findProposalBySlug(ARCH_GENIUS_SLUG);
  const content = {
    hero: {
      eyebrow: ARCH_GENIUS_REFERENCE.hero.eyebrow,
      title: ARCH_GENIUS_REFERENCE.hero.headline,
      subtitle: ARCH_GENIUS_REFERENCE.hero.lead,
    },
    sections: [],
    cta: {
      label: ARCH_GENIUS_REFERENCE.cta.label,
      whatsappMessage: ARCH_GENIUS_REFERENCE.cta.message,
    },
    pricing: ARCH_GENIUS_PRICING,
    templateVersion: "arch-genius-reference-v1",
  };

  if (existing) {
    const updated = await repo.patchProposal(existing.id, {
      title: "Arch Genius: Reestruturação Digital e Aquisição de Clientes",
      company_name: "Arch Genius Arquitetura",
      client_name: "Juarez",
      template: "custom_solution",
      status: "published",
      published_at: existing.published_at ?? new Date().toISOString(),
      content,
    });
    console.log("✓ Proposta Arch Genius atualizada:", updated?.id);
    console.log(`  URL: /propostas/${ARCH_GENIUS_SLUG}`);
    return;
  }

  const created = await repo.insertProposal({
    slug: ARCH_GENIUS_SLUG,
    title: "Arch Genius: Reestruturação Digital e Aquisição de Clientes",
    template: "custom_solution",
    status: "published",
    company_id: null,
    prospect_id: null,
    copilot_session_id: null,
    commercial_blueprint_id: null,
    client_name: "Juarez",
    company_name: "Arch Genius Arquitetura",
    creative_brief: null,
    content,
    published_at: new Date().toISOString(),
  });

  console.log("✓ Proposta Arch Genius publicada:", created.id);
  console.log(`  URL: /propostas/${ARCH_GENIUS_SLUG}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
