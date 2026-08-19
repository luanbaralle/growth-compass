import type { OSCommercialDefaults } from "@/domains/settings/types";
import type { CopilotMeetingArtifact } from "@/domains/copilot/meeting/types";
import type { CopilotSessionSnapshot } from "@/domains/copilot/types";
import type { ProposalPricingTier, ProposalSimulatorDefaults } from "../types";
import { buildSuggestedSlug } from "../engine/artifact-to-proposal";
import type { CommercialBlueprint } from "./types";
import { archetypeToProposalTemplate } from "./types";
import { mapGrowthProposalContent } from "../template/map-growth-proposal-content";
import type { ProposalContent } from "../types";

export function renderProposalFromBlueprint(input: {
  blueprint: CommercialBlueprint;
  commercial: OSCommercialDefaults;
  pricing: ProposalPricingTier[];
  simulator: ProposalSimulatorDefaults;
  whatsappPhone?: string;
  session?: CopilotSessionSnapshot;
  artifact?: CopilotMeetingArtifact;
}): {
  content: ProposalContent;
  title: string;
  template: "acceleration" | "custom_solution";
  slugBase: string;
} {
  const { blueprint } = input;
  const template = archetypeToProposalTemplate(blueprint.archetype);

  if (template === "acceleration") {
    return mapGrowthProposalContent(input);
  }

  const data = blueprint.data;
  const companyName = blueprint.company_name;
  const title = `Projeto Sob Medida — ${companyName}`;

  return {
    content: {
      hero: {
        eyebrow: "Raise One Soluções",
        title,
        subtitle: data.solution.phase1.value,
      },
      sections: [],
      cta: {
        label: "Quero avançar com este plano",
        whatsappMessage: `Olá! Revisei a proposta para ${companyName} e gostaria de avançar.`,
        whatsappPhone: input.whatsappPhone,
      },
      internalNotes: blueprint.internal_notes ?? undefined,
    },
    title,
    template: "custom_solution",
    slugBase: buildSuggestedSlug(companyName),
  };
}
