import {
  getObjective,
  resolveNextObjective,
} from "../src/domains/prospection/copilot/graph/saloes";
import type { SaloesDiscoveries } from "../src/domains/prospection/copilot/graph/types";

function assert(label: string, condition: boolean) {
  if (!condition) {
    console.error(`FAIL: ${label}`);
    process.exitCode = 1;
  } else {
    console.log(`OK: ${label}`);
  }
}

function step(d: SaloesDiscoveries) {
  const r = resolveNextObjective(d);
  return r.key;
}

console.log("=== Cenário A — saudável ===");
let dA: SaloesDiscoveries = {};
assert("A0 → D1", step(dA) === "client_origin");
dA = { client_origin: "instagram_referrals" };
assert("A1 → D2", step(dA) === "current_satisfaction");
dA = { ...dA, current_satisfaction: "satisfied_maintain" };
assert("A2 → D4-lite", step(dA) === "growth_desire");
dA = { ...dA, growth_desire: "yes_grow" };
assert("A3 → D3", step(dA) === "limitation");
dA = { ...dA, limitation: "oscillation" };
assert("A4 → D4", step(dA) === "willingness_to_act");
dA = { ...dA, willingness_to_act: "yes" };
assert("A5 → D5", step(dA) === "raise_one");

console.log("\n=== Cenário B — satisfeito ===");
let dB: SaloesDiscoveries = {
  client_origin: "referrals",
  current_satisfaction: "satisfied_maintain",
};
assert("B0 → D4-lite", step(dB) === "growth_desire");
dB = { ...dB, growth_desire: "no_maintain" };
assert("B1 → encerrar", step(dB) === "close_respectful");

console.log("\n=== Cenário C — problema ===");
let dC: SaloesDiscoveries = { client_origin: "referrals" };
dC = { ...dC, current_satisfaction: "unstable" };
assert("C1 → D3", step(dC) === "limitation");
dC = { ...dC, limitation: "oscillation" };
assert("C2 → D4", step(dC) === "willingness_to_act");
dC = { ...dC, willingness_to_act: "yes" };
assert("C3 → D5", step(dC) === "raise_one");

console.log("\n=== Cenário E — retomada após D1 ===");
let dE: SaloesDiscoveries = { client_origin: "instagram" };
assert("E1 → D2 (não repete D1)", step(dE) === "current_satisfaction");
assert(
  "E2 pergunta D2 existe",
  getObjective("current_satisfaction", dE).question.length > 20,
);

console.log("\nDone.");
