import type { BlueprintAssets, BlueprintField, CommercialBlueprintData } from "./types";
import { getModuleById } from "./proposal-modules";

export function canCommitAsDeliverable(field: BlueprintField): boolean {
  return field.approved && field.source !== "hypothesis";
}

export function shouldShowAsAssumption(field: BlueprintField): boolean {
  return !field.approved || field.source === "hypothesis";
}

export function blockModule(moduleId: string, assets: BlueprintAssets): boolean {
  if (moduleId === "lp_new" && assets.existingLp) return true;
  if (moduleId === "lp_existing" && assets.newLp && !assets.existingLp) return false;
  if (moduleId === "lp_existing" && !assets.existingLp && assets.newLp) return true;
  return false;
}

export function filterBlockedModules(modules: string[], assets: BlueprintAssets): string[] {
  return modules.filter((id) => !blockModule(id, assets));
}

export function collectUnapprovedAssumptions(data: CommercialBlueprintData): string[] {
  const items: string[] = [];

  const fields: BlueprintField[] = [
    data.diagnosis.problem,
    data.diagnosis.objective,
    ...(data.diagnosis.constraint ? [data.diagnosis.constraint] : []),
    ...(data.diagnosis.opportunity ? [data.diagnosis.opportunity] : []),
    data.strategy.priority1,
    ...(data.strategy.priority2 ? [data.strategy.priority2] : []),
    ...data.strategy.future,
    data.solution.phase1,
    ...(data.solution.phase2 ? [data.solution.phase2] : []),
    ...(data.solution.phase3 ? [data.solution.phase3] : []),
  ];

  for (const field of fields) {
    if (shouldShowAsAssumption(field) && field.value.trim()) {
      const prefix = field.source === "hypothesis" ? "[Hipótese] " : "[A validar] ";
      items.push(`${prefix}${field.value}`);
    }
  }

  for (const assumption of data.assumptions) {
    if (!assumption.approved) {
      items.push(assumption.critical ? `[Crítico] ${assumption.text}` : assumption.text);
    }
  }

  return items;
}

export function approvedDeliverableItems(data: CommercialBlueprintData): string[] {
  const items: string[] = [];
  for (const pillar of data.deliverables) {
    if (!pillar.approved) continue;
    for (const item of pillar.items) {
      items.push(`${pillar.pillar}: ${item}`);
    }
  }
  for (const modId of data.modules) {
    const mod = getModuleById(modId);
    if (mod) items.push(mod.label);
  }
  return items;
}

export function countBlueprintFields(data: CommercialBlueprintData): {
  total: number;
  approved: number;
} {
  const fields: BlueprintField[] = [
    data.diagnosis.problem,
    data.diagnosis.objective,
    ...(data.diagnosis.constraint ? [data.diagnosis.constraint] : []),
    ...(data.diagnosis.opportunity ? [data.diagnosis.opportunity] : []),
    data.strategy.priority1,
    ...(data.strategy.priority2 ? [data.strategy.priority2] : []),
    ...data.strategy.future,
    data.solution.phase1,
    ...(data.solution.phase2 ? [data.solution.phase2] : []),
    ...(data.solution.phase3 ? [data.solution.phase3] : []),
  ];

  return {
    total: fields.length,
    approved: fields.filter((f) => f.approved).length,
  };
}
