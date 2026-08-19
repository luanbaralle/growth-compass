import type { BlueprintField, CommercialBlueprintData } from "./types";

function mergeField(existing: BlueprintField, incoming: BlueprintField): BlueprintField {
  if (existing.approved) return existing;
  if (!incoming.value.trim()) return existing;
  return {
    ...incoming,
    approved: existing.approved,
    note: existing.note ?? incoming.note,
  };
}

function mergeOptionalField(
  existing: BlueprintField | undefined,
  incoming: BlueprintField | undefined,
): BlueprintField | undefined {
  if (!incoming && !existing) return undefined;
  if (!existing) return incoming;
  if (!incoming) return existing;
  return mergeField(existing, incoming);
}

/** Preserva aprovações humanas ao reconstruir blueprint a partir do artefato Copilot. */
export function mergeBlueprintData(
  existing: CommercialBlueprintData,
  incoming: CommercialBlueprintData,
): CommercialBlueprintData {
  return {
    diagnosis: {
      problem: mergeField(existing.diagnosis.problem, incoming.diagnosis.problem),
      objective: mergeField(existing.diagnosis.objective, incoming.diagnosis.objective),
      constraint: mergeOptionalField(existing.diagnosis.constraint, incoming.diagnosis.constraint),
      opportunity: mergeOptionalField(existing.diagnosis.opportunity, incoming.diagnosis.opportunity),
    },
    strategy: {
      priority1: mergeField(existing.strategy.priority1, incoming.strategy.priority1),
      priority2: mergeOptionalField(existing.strategy.priority2, incoming.strategy.priority2),
      future: incoming.strategy.future.map((item, i) =>
        existing.strategy.future[i]?.approved
          ? existing.strategy.future[i]
          : mergeField(existing.strategy.future[i] ?? item, item),
      ),
    },
    solution: {
      phase1: mergeField(existing.solution.phase1, incoming.solution.phase1),
      phase2: mergeOptionalField(existing.solution.phase2, incoming.solution.phase2),
      phase3: mergeOptionalField(existing.solution.phase3, incoming.solution.phase3),
    },
    assets: existing.assets.existingLp || existing.assets.newLp ? existing.assets : incoming.assets,
    modules: existing.modules.length > 0 ? existing.modules : incoming.modules,
    deliverables: incoming.deliverables.map((pillar, i) => {
      const prev = existing.deliverables[i];
      if (prev?.approved) return prev;
      return pillar;
    }),
    exclusions: existing.exclusions.length ? existing.exclusions : incoming.exclusions,
    assumptions: incoming.assumptions.map((item, i) => {
      const prev = existing.assumptions[i];
      if (prev?.approved) return prev;
      return item;
    }),
    investment: existing.investment.approved ? existing.investment : incoming.investment,
    metrics: existing.metrics.length ? existing.metrics : incoming.metrics,
    nextDecisions: incoming.nextDecisions,
    proposalMode: incoming.proposalMode,
    blockers: incoming.blockers,
  };
}

/** Mescla sugestões LLM sem sobrescrever campos aprovados. */
export function mergeBlueprintSuggestions(
  existing: CommercialBlueprintData,
  suggestions: Partial<CommercialBlueprintData>,
): CommercialBlueprintData {
  const merged = { ...existing };

  if (suggestions.diagnosis) {
    merged.diagnosis = {
      problem: mergeField(existing.diagnosis.problem, suggestions.diagnosis.problem ?? existing.diagnosis.problem),
      objective: mergeField(existing.diagnosis.objective, suggestions.diagnosis.objective ?? existing.diagnosis.objective),
      constraint: mergeOptionalField(existing.diagnosis.constraint, suggestions.diagnosis.constraint),
      opportunity: mergeOptionalField(existing.diagnosis.opportunity, suggestions.diagnosis.opportunity),
    };
  }

  if (suggestions.strategy?.priority1 && !existing.strategy.priority1.approved) {
    merged.strategy = {
      ...merged.strategy,
      priority1: mergeField(existing.strategy.priority1, suggestions.strategy.priority1),
    };
  }

  return merged;
}

export function bumpVersion(version: string): string {
  const parts = version.split(".");
  const minor = parseInt(parts[1] ?? "0", 10);
  const major = parseInt(parts[0] ?? "0", 10);
  return `${major}.${minor + 1}`;
}
