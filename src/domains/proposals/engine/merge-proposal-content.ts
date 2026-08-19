import type { CreativeBriefSection } from "@/domains/copilot/types";
import type { ProposalContent } from "../types";

const PLACEHOLDER_NARRATIVE = [
  /^preencher manualmente/i,
  /^a desenvolver com base/i,
  /^resposta llm vazia/i,
  /^openrouter_api_key/i,
  /^a ia não retornou/i,
];

export function isPlaceholderNarrative(text: string | undefined): boolean {
  const value = text?.trim() ?? "";
  if (!value) return true;
  return PLACEHOLDER_NARRATIVE.some((pattern) => pattern.test(value));
}

export function isRichProposalSection(section: CreativeBriefSection): boolean {
  const narrative = section.narrative?.trim() ?? "";
  if (isPlaceholderNarrative(narrative)) return false;
  if (narrative.length >= 48) return true;
  return (section.bullets?.filter(Boolean).length ?? 0) >= 2;
}

/** Mescla conteúdo gerado pela IA sobre o existente — nunca apaga seções boas. */
export function mergeProposalContent(
  existing: ProposalContent,
  generated: ProposalContent,
): ProposalContent {
  const existingByKey = new Map(existing.sections.map((section) => [section.key, section]));

  const sections = generated.sections.map((generatedSection) => {
    const previous = existingByKey.get(generatedSection.key);
    if (!previous) return generatedSection;
    if (!isRichProposalSection(generatedSection)) return previous;
    return {
      ...generatedSection,
      editorNotes: generatedSection.editorNotes?.trim() || previous.editorNotes,
    };
  });

  for (const previous of existing.sections) {
    if (!sections.some((section) => section.key === previous.key)) {
      sections.push(previous);
    }
  }

  sections.sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true }));

  return {
    ...generated,
    hero: {
      ...generated.hero,
      title: existing.hero.title?.trim() || generated.hero.title,
      subtitle: existing.hero.subtitle?.trim() || generated.hero.subtitle,
      eyebrow: existing.hero.eyebrow ?? generated.hero.eyebrow,
    },
    sections,
    cta: {
      ...generated.cta,
      label: existing.cta.label || generated.cta.label,
      whatsappMessage: existing.cta.whatsappMessage || generated.cta.whatsappMessage,
      whatsappPhone: existing.cta.whatsappPhone ?? generated.cta.whatsappPhone,
    },
    pricing: existing.pricing ?? generated.pricing,
    simulator: existing.simulator ?? generated.simulator,
    demandKeywords: existing.demandKeywords ?? generated.demandKeywords,
    landingMockup: existing.landingMockup ?? generated.landingMockup,
    heroMetrics: existing.heroMetrics ?? generated.heroMetrics,
    funnelSteps: existing.funnelSteps ?? generated.funnelSteps,
    mechanismFlow: existing.mechanismFlow ?? generated.mechanismFlow,
    presentation: existing.presentation,
    positioningStatement:
      existing.positioningStatement?.trim() || generated.positioningStatement,
    phase1Objective: existing.phase1Objective?.trim() || generated.phase1Objective,
    diagnosisCards: existing.diagnosisCards?.length
      ? existing.diagnosisCards
      : generated.diagnosisCards,
    movements: existing.movements?.length ? existing.movements : generated.movements,
    commercialPipeline: existing.commercialPipeline?.length
      ? existing.commercialPipeline
      : generated.commercialPipeline,
    metricsToTrack: existing.metricsToTrack?.length
      ? existing.metricsToTrack
      : generated.metricsToTrack,
    strategicGuidance: existing.strategicGuidance?.length
      ? existing.strategicGuidance
      : generated.strategicGuidance,
    exclusions: existing.exclusions?.length ? existing.exclusions : generated.exclusions,
    expansionOpportunities: existing.expansionOpportunities?.length
      ? existing.expansionOpportunities
      : generated.expansionOpportunities,
    playbookParams: existing.playbookParams ?? generated.playbookParams,
    gapsForMeeting2:
      generated.gapsForMeeting2?.length && generated.gapsForMeeting2.some((g) => g.trim())
        ? generated.gapsForMeeting2
        : existing.gapsForMeeting2,
  };
}
