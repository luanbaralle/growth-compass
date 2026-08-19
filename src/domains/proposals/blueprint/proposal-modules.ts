import type { BlueprintArchetype } from "./types";

export interface ProposalModuleDef {
  id: string;
  label: string;
  defaultPhase: 1 | 2 | 3;
  archetypes: BlueprintArchetype[];
}

export const PROPOSAL_MODULES: ProposalModuleDef[] = [
  {
    id: "google_ads",
    label: "Google Ads (Search)",
    defaultPhase: 1,
    archetypes: ["acceleration", "acquisition", "positioning"],
  },
  {
    id: "meta_ads",
    label: "Meta Ads (Facebook/Instagram)",
    defaultPhase: 3,
    archetypes: ["acceleration", "acquisition", "positioning"],
  },
  {
    id: "tracking",
    label: "Tracking (GTM, GA4, conversões)",
    defaultPhase: 1,
    archetypes: ["acceleration", "acquisition", "positioning", "structure"],
  },
  {
    id: "lp_existing",
    label: "LP existente — instrumentação",
    defaultPhase: 1,
    archetypes: ["acceleration", "acquisition", "positioning"],
  },
  {
    id: "lp_new",
    label: "Landing page nova",
    defaultPhase: 1,
    archetypes: ["acceleration", "acquisition", "positioning"],
  },
  {
    id: "crm",
    label: "CRM / registro de leads",
    defaultPhase: 2,
    archetypes: ["acceleration", "acquisition", "structure"],
  },
  {
    id: "content_minimal",
    label: "Conteúdo mínimo estratégico",
    defaultPhase: 2,
    archetypes: ["acceleration", "positioning"],
  },
  {
    id: "commercial_funnel",
    label: "Funil comercial mensurável",
    defaultPhase: 1,
    archetypes: ["acceleration", "acquisition", "structure"],
  },
  {
    id: "consulting",
    label: "Consultoria estratégica recorrente",
    defaultPhase: 1,
    archetypes: ["acceleration", "acquisition", "positioning", "structure", "custom_solution"],
  },
  {
    id: "remarketing",
    label: "Remarketing",
    defaultPhase: 3,
    archetypes: ["acceleration", "acquisition"],
  },
  {
    id: "seo",
    label: "SEO orgânico",
    defaultPhase: 2,
    archetypes: ["acceleration", "positioning", "structure"],
  },
  {
    id: "social_presence",
    label: "Presença digital (Instagram, bio, CTA)",
    defaultPhase: 1,
    archetypes: ["acceleration", "positioning"],
  },
  {
    id: "custom_dev",
    label: "Desenvolvimento sob medida",
    defaultPhase: 1,
    archetypes: ["custom_solution", "structure"],
  },
];

export function getModuleById(id: string): ProposalModuleDef | undefined {
  return PROPOSAL_MODULES.find((m) => m.id === id);
}

export function modulesForArchetype(archetype: BlueprintArchetype): ProposalModuleDef[] {
  return PROPOSAL_MODULES.filter((m) => m.archetypes.includes(archetype));
}

export function defaultModulesForArchetype(
  archetype: BlueprintArchetype,
  assets: { existingLp: boolean; newLp: boolean },
): string[] {
  const available = modulesForArchetype(archetype);
  const ids = new Set<string>();

  for (const mod of available) {
    if (mod.defaultPhase === 1) ids.add(mod.id);
  }

  if (assets.existingLp) {
    ids.add("lp_existing");
    ids.delete("lp_new");
  } else if (assets.newLp) {
    ids.add("lp_new");
    ids.delete("lp_existing");
  }

  if (archetype !== "custom_solution") {
    ids.add("google_ads");
    ids.add("tracking");
    ids.add("commercial_funnel");
    ids.add("consulting");
  }

  return [...ids];
}
