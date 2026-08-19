import type { CopilotMeetingArtifact } from "@/domains/copilot/meeting/types";
import type { CopilotSessionSnapshot } from "@/domains/copilot/types";
import type { OSCommercialDefaults } from "@/domains/settings/types";
import type { CreativeBriefSection } from "@/domains/copilot/types";
import {
  applyAccelerationPlaybook,
  buildAccelerationSectionOverrides,
  buildCommercialPipeline,
  buildDiagnosisCards,
  inferAccelerationPlaybookParams,
} from "../engine/acceleration-playbook";
import { buildSuggestedSlug } from "../engine/artifact-to-proposal";
import { buildDemandKeywords, buildLandingMockup } from "../engine/proposal-visuals";
import { applyAccelerationEnhancements } from "../pricing/r1-pricing";
import type { ProposalContent, ProposalPricingTier, ProposalSimulatorDefaults } from "../types";
import {
  approvedDeliverableItems,
  collectUnapprovedAssumptions,
} from "./evidence-rules";
import type { CommercialBlueprint, CommercialBlueprintData } from "./types";
import { archetypeToProposalTemplate } from "./types";

const SECTION_TEMPLATES: Array<{ key: string; number: string; title: string }> = [
  { key: "diagnosis", number: "01", title: "Diagnóstico — Onde Estamos Hoje" },
  { key: "opportunity", number: "02", title: "Oportunidade — Existe Demanda" },
  { key: "behavior", number: "03", title: "Comportamento do Cliente" },
  { key: "mechanism", number: "04", title: "O Mecanismo — Sistema de Aquisição" },
  { key: "strategy", number: "05", title: "Estratégia — Como Vamos Atrair" },
  { key: "deliverables", number: "06", title: "Entregáveis — Fase 1" },
  { key: "validation", number: "07", title: "Validação — Primeiros 30–60 Dias" },
  { key: "investment", number: "08", title: "Investimento — Estrutura de Preços" },
  { key: "implementation", number: "09", title: "Implementação — Plano de Execução" },
  { key: "next_steps", number: "10", title: "Próximos Passos" },
];

function playbookParamsFromBlueprint(data: CommercialBlueprintData, companyName: string) {
  return inferAccelerationPlaybookParams({
    artifact: {
      session_id: "",
      transcript_summary: data.diagnosis.problem.value,
      transcript_segments: [],
      diagnosis: {
        mainProblem: data.diagnosis.problem.value,
        constraint: data.diagnosis.constraint?.value,
        opportunity: data.diagnosis.opportunity?.value,
      },
      opportunities: [],
      unknowns: data.nextDecisions,
      recommended_engagement: { strategy: data.strategy.priority1.value },
      pain_points: [],
      goals: [],
      hypotheses: data.assumptions.map((a) => a.text),
      what_we_learned: [],
      evidence_graph: [],
      knowledge_depth: 0,
      meeting_synthesis: null,
      created_at: "",
    },
    companyName,
  });
}

function buildSectionsFromBlueprint(
  blueprint: CommercialBlueprint,
  data: CommercialBlueprintData,
): CreativeBriefSection[] {
  const template = archetypeToProposalTemplate(blueprint.archetype);
  const companyName = blueprint.company_name;
  const diagnosis = {
    situation: data.diagnosis.objective.value,
    mainProblem: data.diagnosis.problem.value,
    constraint: data.diagnosis.constraint?.value,
    opportunity: data.diagnosis.opportunity?.value,
  };

  const deliverableBullets = approvedDeliverableItems(data);
  const assumptionGaps = collectUnapprovedAssumptions(data);

  if (template === "acceleration") {
    const params = {
      ...playbookParamsFromBlueprint(data, companyName),
      assetMode: data.assets.existingLp ? ("existing_lp" as const) : data.assets.newLp ? ("new_lp" as const) : ("no_lp" as const),
      includeMetaNow: data.modules.includes("meta_ads"),
      mainProblem: data.diagnosis.problem.value,
      opportunityText: data.diagnosis.opportunity?.value,
      constraintText: data.diagnosis.constraint?.value,
    };

    const overrides = buildAccelerationSectionOverrides({
      params,
      diagnosis,
      opportunityNarrative: data.diagnosis.opportunity?.value ?? "",
      engagementStrategy: data.strategy.priority1.value,
    });

    if (deliverableBullets.length > 0) {
      overrides.deliverables = {
        narrative: data.solution.phase1.value,
        bullets: deliverableBullets,
      };
    }

    overrides.diagnosis = {
      narrative: data.diagnosis.objective.value || diagnosis.situation,
      bullets: [
        data.diagnosis.problem.value ? `Principal problema: ${data.diagnosis.problem.value}` : "",
        data.diagnosis.constraint?.value ? `Restrição: ${data.diagnosis.constraint.value}` : "",
      ].filter(Boolean),
    };

    return SECTION_TEMPLATES.map((t) => ({
      key: t.key,
      number: t.number,
      title: t.title,
      narrative: overrides[t.key]?.narrative ?? "Aprovado no blueprint comercial.",
      bullets: overrides[t.key]?.bullets ?? [],
      editorNotes: overrides[t.key]?.editorNotes,
    }));
  }

  return SECTION_TEMPLATES.map((t) => {
    if (t.key === "diagnosis") {
      return {
        ...t,
        narrative: data.diagnosis.objective.value,
        bullets: [data.diagnosis.problem.value].filter(Boolean),
      };
    }
    if (t.key === "deliverables") {
      return { ...t, narrative: data.solution.phase1.value, bullets: deliverableBullets };
    }
    if (t.key === "strategy") {
      return { ...t, narrative: data.strategy.priority1.value, bullets: [] };
    }
    return { ...t, narrative: "Definido no blueprint comercial.", bullets: [] };
  });
}

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
  const { blueprint, commercial, pricing, simulator, whatsappPhone, session, artifact } = input;
  const data = blueprint.data;
  const template = archetypeToProposalTemplate(blueprint.archetype);
  const companyName = blueprint.company_name;
  const isConditional = data.proposalMode === "conditional";

  const title =
    template === "custom_solution"
      ? `Projeto Sob Medida — ${companyName}`
      : `Projeto de Aceleração — ${companyName}`;

  const assumptionGaps = collectUnapprovedAssumptions(data);
  const gapsForMeeting2 = [...new Set([...assumptionGaps, ...data.nextDecisions])].slice(0, 12);

  const sections = buildSectionsFromBlueprint(blueprint, data);

  const baseContent: ProposalContent = {
    hero: {
      eyebrow: isConditional
        ? "Raise One Soluções · Proposta condicional"
        : "Raise One Soluções · Plano aprovado",
      title,
      subtitle: data.solution.phase1.value,
    },
    sections,
    gapsForMeeting2,
    cta: {
      label: "Quero avançar com este plano",
      whatsappMessage: `Olá! Revisei a proposta "${title}" para ${companyName} e gostaria de avançar.`,
      whatsappPhone,
    },
    exclusions: data.exclusions,
    metricsToTrack: data.metrics,
    internalNotes: blueprint.internal_notes ?? undefined,
  };

  if (template === "acceleration") {
    const params = {
      ...playbookParamsFromBlueprint(data, companyName),
      assetMode: data.assets.existingLp ? ("existing_lp" as const) : data.assets.newLp ? ("new_lp" as const) : ("no_lp" as const),
      includeMetaNow: data.modules.includes("meta_ads"),
    };

    let content = applyAccelerationPlaybook({
      content: baseContent,
      params,
      session: session ?? ({
        overallCoverage: blueprint.readiness.coveragePercent,
        knowledgeDepth: blueprint.readiness.knowledgeDepth,
        meetingObjective: { companyName, prospectName: blueprint.client_name ?? "" },
      } as CopilotSessionSnapshot),
      artifact: artifact ?? ({
        diagnosis: {
          situation: data.diagnosis.objective.value,
          mainProblem: data.diagnosis.problem.value,
          constraint: data.diagnosis.constraint?.value,
          opportunity: data.diagnosis.opportunity?.value,
        },
        unknowns: gapsForMeeting2,
        evidence_graph: [],
      } as unknown as CopilotMeetingArtifact),
      commercial,
    });

    content = {
      ...content,
      diagnosisCards:
        session && artifact
          ? buildDiagnosisCards({ params, session, artifact })
          : content.diagnosisCards,
      commercialPipeline: content.commercialPipeline ?? buildCommercialPipeline(),
      demandKeywords: buildDemandKeywords({
        companyName,
        opportunityText: data.diagnosis.opportunity?.value,
        bullets: data.strategy.future.map((f) => f.value),
      }),
      landingMockup: data.assets.existingLp
        ? buildLandingMockup({
            companyName,
            heroTitle: `${companyName} — Canal de aquisição`,
            heroSubtitle: "Landing existente instrumentada para conversão",
          })
        : buildLandingMockup({ companyName, heroTitle: title, heroSubtitle: data.solution.phase1.value }),
    };

    if (isConditional) {
      content = {
        ...content,
        heroMetrics: [
          { value: "Condicional", label: "Modo da proposta" },
          { value: String(gapsForMeeting2.length), label: "Pontos a validar" },
        ],
        strategicGuidance: [
          ...(content.strategicGuidance ?? []),
          "Esta proposta é condicional — alguns entregáveis dependem de validação na Reunião 2.",
          "Simulador de ROI disponível após confirmação dos premissas comerciais.",
        ],
        simulator: undefined,
      };
    }

    content = applyAccelerationEnhancements(content, {
      overallCoverage: blueprint.readiness.coveragePercent,
      knowledgeDepth: blueprint.readiness.knowledgeDepth,
      unknownsCount: blueprint.readiness.unknownsCount,
      companyName,
      commercial,
      pricing: content.pricing ?? pricing,
      simulator: isConditional ? undefined : simulator,
      whatsappPhone,
    });

    return {
      content,
      title,
      template,
      slugBase: buildSuggestedSlug(companyName),
    };
  }

  return {
    content: baseContent,
    title,
    template,
    slugBase: buildSuggestedSlug(companyName),
  };
}
