#!/usr/bin/env npx tsx
/**
 * Seed operacional: Colônia FEM (Aquisição Digital) + projeto fictício de smoke.
 *
 * Uso:
 *   npx tsx scripts/seed-project-execution.ts
 *
 * Requer: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e migration 028 aplicada.
 *
 * Dados comerciais/contextuais ficam no seed — não no core do sistema.
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
  const { ensureBuiltinTemplates, applyWorkflowTemplate, upsertBriefing } =
    await import("../src/domains/projects/execution/service.server");
  const projectService = await import("../src/domains/projects/service.server");
  const companyService = await import("../src/domains/companies/service.server");
  const companyRepo = await import("../src/domains/companies/repository.server");
  const financeService = await import("../src/domains/finance/service.server");
  const projectRepo = await import("../src/domains/projects/repository.server");

  await ensureBuiltinTemplates();
  console.log("✓ Template Projeto de Aquisição Digital garantido");

  // ── Company: Colônia FEM ───────────────────────────────────
  let colonia = (await companyRepo.findCompanies({ search: "Colônia FEM" })).find(
    (c) =>
      c.name.toLowerCase().includes("colônia fem") ||
      c.name.toLowerCase().includes("colonia fem"),
  );

  if (!colonia) {
    colonia = await companyService.createCompany(
      {
        name: "Colônia FEM",
        legal_name: "Colônia de Férias FEM",
        responsible_name: "Viviane",
        origin: "manual",
        segment: "turismo",
        stage: "ativo",
        notes: "Cliente operacional — Aquisição Digital",
      },
      "luan",
    );
    console.log("✓ Empresa Colônia FEM criada");
  } else {
    console.log("✓ Empresa Colônia FEM já existia:", colonia.id);
  }

  const existingProjects = await projectRepo.findProjects({ companyId: colonia.id });
  let coloniaProject = existingProjects.find((p) =>
    p.title.toLowerCase().includes("aquisição digital") ||
    p.title.toLowerCase().includes("aquisicao digital"),
  );

  const coloniaContext = {
    objective:
      "Aumentar significativamente as oportunidades de hospedagem e contribuir para o crescimento das reservas da Colônia FEM.",
    strategy: [
      "Presença digital",
      "Conteúdo comercial",
      "Landing page",
      "Google Ads",
      "Mensuração",
      "Otimização",
    ],
    offer: [
      "Hospedagem",
      "Pensão completa",
      "Piscina",
      "Lazer",
      "Famílias",
      "Grupos",
      "Excursões",
    ],
    channel: "Google Ads Search",
    conversionPath: [
      "Consulta de disponibilidade",
      "valores",
      "escolha da data",
      "pagamento/sinal",
      "reserva",
    ],
  };

  if (!coloniaProject) {
    coloniaProject = await projectService.createProject(
      {
        companyId: colonia.id,
        title: "Colônia FEM — Aquisição Digital",
        type: "google_ads",
        status: "approved",
        ownerId: "luan",
        priority: "high",
        description:
          "Operação de aquisição digital: presença + conteúdo + LP + Google Ads + mensuração.",
        startDate: new Date().toISOString().slice(0, 10),
        setupAmountCents: 149700,
        recurringAmountCents: 99700,
        mediaBudgetNotes: "Mídia paga diretamente ao Google — fora da mensalidade Raise One.",
        strategyNotes: coloniaContext.strategy.join(" + "),
        contextJson: coloniaContext,
        workflowTemplateSlug: "projeto-aquisicao-digital",
      },
      "luan",
    );
    console.log("✓ Projeto Colônia FEM criado com workflow:", coloniaProject.id);
  } else {
    console.log("✓ Projeto Colônia FEM já existia:", coloniaProject.id);
    const { getProjectExecution } = await import(
      "../src/domains/projects/execution/service.server"
    );
    const exec = await getProjectExecution(coloniaProject.id);
    if (!exec) {
      await applyWorkflowTemplate(coloniaProject.id, "projeto-aquisicao-digital", "luan");
      console.log("✓ Workflow aplicado ao projeto existente");
    }
  }

  await upsertBriefing(coloniaProject.id, {
    objective: coloniaContext.objective,
    offer: coloniaContext.offer.join(", "),
    audience: "Famílias, grupos e excursões",
    differentials: coloniaContext.offer.join(", "),
    services: "Hospedagem com pensão completa e lazer",
    commercialProcess: coloniaContext.conversionPath.join(" → "),
    currentChannels: coloniaContext.channel,
    status: "draft",
  });
  console.log("✓ Briefing Colônia FEM registrado");

  const today = new Date().toISOString().slice(0, 10);
  const financeExisting = await (
    await import("../src/domains/finance/repository.server")
  ).findFinanceEntries({ companyId: colonia.id });

  const hasSetup = financeExisting.some(
    (e) => e.project_id === coloniaProject!.id && e.type === "setup",
  );
  if (!hasSetup) {
    await financeService.createFinanceEntry(
      {
        companyId: colonia.id,
        projectId: coloniaProject.id,
        type: "setup",
        description: "Implantação — Aquisição Digital",
        amountCents: 149700,
        dueDate: today,
        status: "pending",
      },
      "luan",
    );
    await financeService.createFinanceEntry(
      {
        companyId: colonia.id,
        projectId: coloniaProject.id,
        type: "monthly",
        description: "Gestão — 1º ciclo (condição comercial / gratuito)",
        amountCents: 0,
        dueDate: today,
        status: "paid",
        paidAt: today,
      },
      "luan",
    );
    await financeService.createFinanceEntry(
      {
        companyId: colonia.id,
        projectId: coloniaProject.id,
        type: "monthly",
        description: "Gestão mensal — Aquisição Digital",
        amountCents: 99700,
        dueDate: addMonths(today, 1),
        status: "pending",
      },
      "luan",
    );
    await financeService.createFinanceEntry(
      {
        companyId: colonia.id,
        projectId: coloniaProject.id,
        type: "other",
        description: "Orçamento de mídia Google Ads (pago ao Google, fora da mensalidade)",
        amountCents: 0,
        dueDate: today,
        status: "cancelled",
      },
      "luan",
    );
    console.log("✓ Lançamentos financeiros vinculados ao projeto");
  } else {
    console.log("✓ Financeiro do projeto já existia");
  }

  // ── Smoke project fictício ─────────────────────────────────
  let demoCompany = (await companyRepo.findCompanies({ search: "Demo Aquisição" }))[0];
  if (!demoCompany) {
    demoCompany = await companyService.createCompany(
      {
        name: "Demo Aquisição Ltda",
        responsible_name: "Contato Demo",
        origin: "manual",
        segment: "servicos",
        stage: "ativo",
        notes: "Empresa fictícia para smoke test do workflow",
      },
      "vini",
    );
  }

  const demoProjects = await projectRepo.findProjects({ companyId: demoCompany.id });
  let demoProject = demoProjects.find((p) => p.title.includes("Smoke"));
  if (!demoProject) {
    demoProject = await projectService.createProject(
      {
        companyId: demoCompany.id,
        title: "Smoke — Aquisição Digital",
        type: "landing_page",
        status: "approved",
        ownerId: "vini",
        priority: "medium",
        description: "Projeto fictício para validar template genérico sem dados da Colônia.",
        setupAmountCents: 200000,
        recurringAmountCents: 120000,
        workflowTemplateSlug: "projeto-aquisicao-digital",
      },
      "vini",
    );
    console.log("✓ Projeto fictício criado:", demoProject.id);
  } else {
    console.log("✓ Projeto fictício já existia:", demoProject.id);
  }

  console.log("\nSeed concluído.");
  console.log("Colônia FEM project:", coloniaProject.id);
  console.log("Demo project:", demoProject.id);
}

function addMonths(isoDate: string, months: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
