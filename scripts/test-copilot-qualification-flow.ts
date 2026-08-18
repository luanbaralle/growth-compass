#!/usr/bin/env npx tsx
/**
 * Valida o motor Raise One Copilot com trechos da call Angélica.
 * Uso: npx tsx scripts/test-copilot-qualification-flow.ts
 */
import {
  createCopilotSession,
  processTranscriptTurn,
} from "../src/domains/copilot/engine/session-processor";

const TURNS = [
  "Hoje a maioria dos nossos clientes vem por indicação.",
  "Trabalhamos com seguro saúde, seguro auto e consórcio.",
  "Se tivesse que escolher um produto, seria consórcio.",
  "Ah, acho que devem chegar uns 30, 40 contatos por mês.",
  "Fechamos uns 8 clientes por mês, mais ou menos.",
  "Somos pessoa física, clientes de Itanhaém.",
  "Nunca fizemos Google Ads.",
  "Quero uns 15 clientes novos por mês.",
  "Recebemos uns 100 leads por mês.",
  "Na verdade acho que chegam uns 30.",
];

function main() {
  let session = createCopilotSession({
    prospectName: "Angélica",
    companyName: "Saúde & Cia",
  });

  console.log("=== Raise One Copilot — Qualification Flow ===\n");

  for (const line of TURNS) {
    const result = processTranscriptTurn(session, {
      speaker: "prospect",
      text: line,
    });
    session = result.snapshot;

    console.log(`> ${line}`);
    if (result.capturedObjectives.length > 0) {
      console.log(`  captured: ${result.capturedObjectives.join(", ")}`);
    }
    if (result.newInsights.length > 0) {
      for (const insight of result.newInsights) {
        console.log(`  [${insight.type}] ${insight.title}: ${insight.body}`);
      }
    }
    if (session.suggestion && !session.suppressSuggestion) {
      console.log(`  next?: ${session.suggestion.suggestedQuestion}`);
    }
    if (session.suppressSuggestion) {
      console.log(`  (silenced: ${session.suppressReason})`);
    }
    console.log("");
  }

  console.log("--- Coverage ---");
  for (const c of session.coverage.filter((x) => x.captured > 0)) {
    console.log(`  ${c.label}: ${c.percent}% (${c.captured}/${c.total})`);
  }
  console.log(`  Overall: ${session.overallCoverage}%`);

  console.log("\n--- Business Graph ---");
  for (const root of session.businessProfile.roots) {
    console.log(`  ${root.label}${root.value ? `: ${root.value}` : ""}`);
    for (const child of root.children ?? []) {
      console.log(`    └ ${child.label}: ${child.value}`);
    }
  }

  console.log("\n--- Proposal Readiness ---");
  console.log(`  Status: ${session.proposalReadiness.status}`);
  if (session.inconsistencies.length > 0) {
    console.log(`  Inconsistencies: ${session.inconsistencies.length}`);
  }

  const hasReferral = session.diagnosticState.referral_dependency?.evidence;
  const hasLeads = session.diagnosticState.lead_volume?.evidence;
  if (!hasReferral || !hasLeads) {
    console.error("\nFAIL: expected referral_dependency and lead_volume captured");
    process.exit(1);
  }

  if (session.inconsistencies.length === 0) {
    console.error("\nFAIL: expected inconsistency on lead volume contradiction");
    process.exit(1);
  }

  console.log("\nOK — Copilot qualification flow validated.");
}

main();
