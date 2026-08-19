import type { CopilotMeetingArtifact } from "@/domains/copilot/meeting/types";
import type { CopilotSessionSnapshot } from "@/domains/copilot/types";
import type { CreativeBriefSection } from "@/domains/copilot/types";
import type { OSCommercialDefaults } from "@/domains/settings/types";
import {
  buildAccelerationFunnel,
  buildMovements,
  buildPositioningStatement,
  buildStrategicGuidance,
  inferAccelerationPlaybookParams,
} from "../engine/acceleration-playbook";
import { buildSuggestedSlug } from "../engine/artifact-to-proposal";
import { buildDemandKeywords, buildLandingMockup } from "../engine/proposal-visuals";
import {
  applyAccelerationEnhancements,
  R1_MECHANISM_FLOW,
} from "../pricing/r1-pricing";
import type {
  CommercialBlueprint,
  CommercialBlueprintData,
} from "../blueprint/types";
import type {
  ProposalContent,
  ProposalDeliverableGroup,
  ProposalDiagnosisCard,
  ProposalMetric,
  ProposalPricingTier,
  ProposalSimulatorDefaults,
} from "../types";

const GROWTH_SECTIONS: Array<{ key: string; number: string; title: string }> = [
  { key: "diagnosis", number: "01", title: "Onde Estamos Hoje" },
  { key: "opportunity", number: "02", title: "Pelo Que Somos Buscados" },
  { key: "behavior", number: "03", title: "Como o Cliente Decide" },
  { key: "mechanism", number: "04", title: "Sistema de Aquisição" },
  { key: "strategy", number: "05", title: "Estratégia" },
  { key: "deliverables", number: "06", title: "O Que Será Entregue" },
  { key: "validation", number: "07", title: "Do Investimento ao Resultado" },
  { key: "investment", number: "08", title: "Investimento no Projeto" },
  { key: "implementation", number: "09", title: "Plano de Execução" },
  { key: "next_steps", number: "10", title: "Próximos Passos" },
];

const DEFAULT_NEXT_STEPS = [
  "Aprovação do plano estratégico",
  "Assinatura do contrato e formalização",
  "Reunião de kick-off com a equipe",
  "Liberação de acessos e materiais",
  "Início da fase de estruturação",
];

const VALIDATION_FRAME =
  "O primeiro ciclo será utilizado para medir a resposta real do mercado e calibrar o sistema de aquisição — antes de escalar investimento ou ampliar o escopo.";

const VALIDATION_KPIS = [
  "Volume de procura e cliques qualificados",
  "Custo por lead (CPL)",
  "Qualidade e perfil dos contatos",
  "Taxa de contato e atendimento",
  "Conversão comercial",
  "Custo por aquisição (CAC)",
  "Potencial de escala com capacidade respeitada",
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
      unknowns: [],
      recommended_engagement: { strategy: data.strategy.priority1.value },
      pain_points: [],
      goals: [],
      hypotheses: [],
      what_we_learned: [],
      evidence_graph: [],
      knowledge_depth: 0,
      meeting_synthesis: null,
      created_at: "",
    },
    companyName,
  });
}

function buildClientHeroMetrics(
  data: CommercialBlueprintData,
  companyName: string,
  artifact?: CopilotMeetingArtifact,
): ProposalMetric[] {
  const corpus = [
    data.diagnosis.problem.value,
    data.diagnosis.objective.value,
    data.diagnosis.constraint?.value ?? "",
    data.diagnosis.opportunity?.value ?? "",
    ...(artifact?.evidence_graph ?? []).map((e) => `${e.label} ${e.value}`),
    ...(artifact?.what_we_learned ?? []),
  ].join(" ");

  const metrics: ProposalMetric[] = [];

  const yearsMatch = corpus.match(/(\d+[,.]?\d*)\s*anos?/i);
  if (yearsMatch) {
    metrics.push({ value: yearsMatch[1].replace(",", "."), label: "Anos de mercado" });
  }

  const contactsMatch = corpus.match(/(\~?\d+)\s*(novos?\s*)?(contatos?|leads?)\s*\/?\s*m[eê]s/i);
  if (contactsMatch) {
    metrics.push({ value: contactsMatch[1], label: "Contatos por mês (atual)" });
  }

  const frentes = data.modules.filter((id) =>
    ["google_ads", "tracking", "commercial_funnel", "consulting"].includes(id),
  ).length;
  if (frentes > 0) {
    metrics.push({ value: String(Math.min(frentes, 3)), label: "Frentes prioritárias" });
  }

  if (metrics.length === 0) {
    metrics.push(
      { value: "Fase 1", label: "Validação inicial" },
      { value: String(data.modules.length || 3), label: "Componentes do plano" },
    );
  }

  if (metrics.length < 3 && data.assets.existingLp) {
    metrics.push({ value: "LP", label: "Ativo existente" });
  }

  return metrics.slice(0, 3);
}

function buildClientDiagnosisCards(
  data: CommercialBlueprintData,
  params: ReturnType<typeof inferAccelerationPlaybookParams>,
  artifact?: CopilotMeetingArtifact,
): ProposalDiagnosisCard[] {
  const corpus = [
    ...(artifact?.evidence_graph ?? []).map((e) => `${e.label} ${e.value}`),
    ...(artifact?.what_we_learned ?? []),
  ].join(" ");

  const cards: ProposalDiagnosisCard[] = [];

  const yearsMatch = corpus.match(/(\d+[,.]?\d*)\s*anos?/i);
  if (yearsMatch) {
    cards.push({
      label: "Experiência local",
      value: `${yearsMatch[1].replace(",", ".")} anos de atuação`,
      description: "Base sólida de relacionamento e credibilidade construída no mercado.",
    });
  }

  if (params.mainProblem || data.diagnosis.problem.value) {
    const problem = params.mainProblem ?? data.diagnosis.problem.value;
    cards.push({
      label: "Aquisição atual",
      value: problem.length > 60 ? `${problem.slice(0, 57)}…` : problem,
      description: problem,
    });
  }

  if (params.opportunityText || data.diagnosis.opportunity?.value) {
    const opp = params.opportunityText ?? data.diagnosis.opportunity!.value;
    cards.push({
      label: "Demanda",
      value: "Produtos com demanda identificável",
      description: opp,
    });
  }

  if (params.hasCapacityConstraint) {
    cards.push({
      label: "Estrutura",
      value: "Capacidade comercial limitada",
      description:
        params.capacityNote ??
        "A operação precisa controlar o volume de novos contatos conforme a capacidade de atendimento.",
    });
  }

  if (/hist[oó]rico|tentativa|anterior|sem resultado|frustrad/.test(corpus.toLowerCase())) {
    cards.push({
      label: "Histórico digital",
      value: "Experiências anteriores sem tração mensurável",
      description: "Oportunidade de estruturar aquisição com método e mensuração desde o início.",
    });
  }

  if (cards.length < 3 && data.diagnosis.objective.value) {
    cards.push({
      label: "Objetivo",
      value: data.diagnosis.objective.value.slice(0, 60),
      description: data.diagnosis.objective.value,
    });
  }

  return cards.slice(0, 5);
}

function buildDiagnosisConclusion(
  data: CommercialBlueprintData,
  params: ReturnType<typeof inferAccelerationPlaybookParams>,
): string {
  const problem = data.diagnosis.problem.value.trim();
  const constraint = data.diagnosis.constraint?.value.trim();

  if (problem && constraint) {
    return `O desafio não é apenas gerar mais contatos. É construir um canal previsível de aquisição — respeitando ${constraint.toLowerCase()}.`;
  }
  if (problem) {
    return `O desafio central é transformar a operação atual em um fluxo previsível de novos negócios — sem perder a qualidade do atendimento.`;
  }
  if (params.hasCapacityConstraint) {
    return `A ${params.companyName} possui base sólida, mas precisa de um canal mensurável que respeite a capacidade comercial atual.`;
  }
  return `A ${params.companyName} está pronta para estruturar aquisição com método, mensuração e validação antes de escalar.`;
}

function buildDeliverableGroups(
  data: CommercialBlueprintData,
  params: ReturnType<typeof inferAccelerationPlaybookParams>,
): ProposalDeliverableGroup[] {
  const structureItems: string[] = [];
  const acquisitionItems: string[] = [];
  const cycleItems: string[] = [];

  for (const pillar of data.deliverables) {
    if (!pillar.approved && data.deliverables.some((p) => p.approved)) continue;
    for (const item of pillar.items) {
      const lower = item.toLowerCase();
      if (/google|ads|campanha|mídia|midia|search/.test(lower)) {
        acquisitionItems.push(item);
      } else if (/setup|ativação|otimização|validação|primeiro ciclo|reunião|acompanhamento/.test(lower)) {
        cycleItems.push(item);
      } else {
        structureItems.push(item);
      }
    }
  }

  if (data.modules.includes("tracking")) {
    structureItems.push("Google Tag Manager, GA4 e conversões configurados");
  }
  if (data.modules.includes("lp_existing")) {
    structureItems.push("Instrumentação da landing page existente");
  } else if (data.modules.includes("lp_new")) {
    structureItems.push("Landing page de conversão");
  }
  if (data.modules.includes("google_ads")) {
    acquisitionItems.push("Google Ads Search — campanhas por intenção de busca");
  }
  if (data.modules.includes("commercial_funnel")) {
    cycleItems.push("Funil comercial mensurável e registro de leads");
  }
  if (data.modules.includes("consulting")) {
    cycleItems.push("Consultoria estratégica e reuniões de acompanhamento");
  }

  const dedupe = (items: string[]) => [...new Set(items)];

  return [
    {
      number: "01",
      title: "Estrutura de Captação",
      items: dedupe(structureItems).slice(0, 6),
    },
    {
      number: "02",
      title: "Sistema de Aquisição",
      items: dedupe(acquisitionItems).slice(0, 6),
    },
    {
      number: "03",
      title: "Primeiro Ciclo",
      items: dedupe(cycleItems).slice(0, 6),
    },
  ].filter((g) => g.items.length > 0);
}

function buildStrategyBullets(data: CommercialBlueprintData): string[] {
  const bullets: string[] = [];

  if (data.modules.includes("google_ads")) {
    bullets.push("Captura de demanda via Google Search para quem pesquisa ativamente.");
  }
  if (data.assets.existingLp) {
    bullets.push("Conversão pela landing page existente — instrumentada e otimizada para medir resultados.");
  } else if (data.assets.newLp) {
    bullets.push("Conversão por landing page dedicada, alinhada à proposta de valor.");
  }
  if (data.modules.includes("commercial_funnel") || data.modules.includes("crm")) {
    bullets.push("Inteligência comercial: registrar origem, produto, atendimento e resultado de cada lead.");
  }
  if (data.exclusions.length > 0 || !data.modules.includes("meta_ads")) {
    bullets.push(
      "Expansão futura (Meta, remarketing, LPs específicas) condicionada à validação do primeiro canal.",
    );
  }

  if (bullets.length === 0 && data.strategy.priority1.value) {
    bullets.push(data.strategy.priority1.value);
  }

  return bullets.slice(0, 4);
}

function buildSections(
  data: CommercialBlueprintData,
  params: ReturnType<typeof inferAccelerationPlaybookParams>,
  diagnosisConclusion: string,
): CreativeBriefSection[] {
  const opportunityText =
    data.diagnosis.opportunity?.value ??
    "Existe demanda identificável nas categorias prioritárias — o primeiro ciclo confirmará volume e intenção real de busca.";

  return GROWTH_SECTIONS.map((section) => {
    switch (section.key) {
      case "diagnosis":
        return {
          ...section,
          narrative: diagnosisConclusion,
          bullets: [],
        };
      case "opportunity":
        return {
          ...section,
          narrative: opportunityText,
          bullets: [],
        };
      case "behavior":
        return {
          ...section,
          narrative:
            "Antes de investir em escala, precisamos entender como o cliente ideal encontra, avalia e decide contratar.",
          bullets: [],
        };
      case "mechanism":
        return {
          ...section,
          narrative:
            "Um sistema integrado conecta demanda, conversão e atendimento — cada etapa mensurável.",
          bullets: [],
        };
      case "strategy":
        return {
          ...section,
          narrative: data.strategy.priority1.value || data.solution.phase1.value,
          bullets: buildStrategyBullets(data),
        };
      case "deliverables":
        return {
          ...section,
          narrative: data.solution.phase1.value,
          bullets: [],
        };
      case "validation":
        return {
          ...section,
          narrative: VALIDATION_FRAME,
          bullets: [],
        };
      case "investment":
        return {
          ...section,
          narrative:
            "Investimento estruturado em três camadas: implementação única, mídia no Google e continuidade após validação.",
          bullets: [],
        };
      case "implementation":
        return {
          ...section,
          narrative: "Execução em três movimentos — estruturar, validar e escalar.",
          bullets: [],
        };
      case "next_steps":
        return {
          ...section,
          narrative: "Para iniciar, basta aprovar o plano e seguir o cronograma abaixo.",
          bullets: DEFAULT_NEXT_STEPS,
        };
      default:
        return { ...section, narrative: "", bullets: [] };
    }
  });
}

export function mapGrowthProposalContent(input: {
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
  template: "acceleration";
  slugBase: string;
} {
  const { blueprint, commercial, pricing, simulator, whatsappPhone, artifact } = input;
  const data = blueprint.data;
  const companyName = blueprint.company_name;

  const params = {
    ...playbookParamsFromBlueprint(data, companyName),
    assetMode: data.assets.existingLp
      ? ("existing_lp" as const)
      : data.assets.newLp
        ? ("new_lp" as const)
        : ("no_lp" as const),
    includeMetaNow: data.modules.includes("meta_ads"),
    mainProblem: data.diagnosis.problem.value,
    opportunityText: data.diagnosis.opportunity?.value,
    constraintText: data.diagnosis.constraint?.value,
  };

  const diagnosisConclusion = buildDiagnosisConclusion(data, params);
  const heroMetrics = buildClientHeroMetrics(data, companyName, artifact);
  const diagnosisCards = buildClientDiagnosisCards(data, params, artifact);
  const deliverableGroups = buildDeliverableGroups(data, params);
  const movements = buildMovements(params);
  const positioningStatement = buildPositioningStatement(params);
  const funnelSteps = buildAccelerationFunnel(params);

  const title = `Projeto de Aceleração Comercial — ${companyName}`;

  const showSimulator =
    data.proposalMode !== "conditional" &&
    data.investment.approved &&
    data.assumptions.filter((a) => a.critical && !a.approved).length === 0;

  let content: ProposalContent = {
    templateVersion: "r1-growth-v1",
    hero: {
      eyebrow: "Raise One Soluções",
      title: "Projeto de Aceleração Comercial",
      subtitle: `Plano Estratégico de Crescimento para ${companyName}`,
    },
    sections: buildSections(data, params, diagnosisConclusion),
    cta: {
      label: "Quero avançar com este plano",
      whatsappMessage: `Olá! Revisei a proposta de aceleração comercial para ${companyName} e gostaria de avançar.`,
      whatsappPhone,
    },
    heroMetrics,
    positioningStatement,
    phase1Objective: data.solution.phase1.value,
    diagnosisCards,
    diagnosisConclusion,
    deliverableGroups,
    validationKpis: VALIDATION_KPIS,
    nextSteps: DEFAULT_NEXT_STEPS,
    funnelSteps,
    mechanismFlow: R1_MECHANISM_FLOW,
    movements,
    metricsToTrack: VALIDATION_KPIS,
    strategicGuidance: buildStrategicGuidance(params).slice(0, 3),
    exclusions: data.exclusions,
    expansionOpportunities: data.strategy.future.map((f) => f.value).filter(Boolean).slice(0, 5),
    playbookParams: {
      assetMode: params.assetMode,
      hasCapacityConstraint: params.hasCapacityConstraint,
    },
    demandKeywords: buildDemandKeywords({
      companyName,
      opportunityText: data.diagnosis.opportunity?.value,
      bullets: data.strategy.future.map((f) => f.value),
    }),
    landingMockup: data.assets.existingLp
      ? buildLandingMockup({
          companyName,
          heroTitle: `${companyName}`,
          heroSubtitle: "Canal de aquisição instrumentado",
        })
      : buildLandingMockup({
          companyName,
          heroTitle: title,
          heroSubtitle: data.solution.phase1.value,
        }),
    pricing,
    simulator: showSimulator ? simulator : undefined,
    internalNotes: blueprint.internal_notes ?? undefined,
  };

  content = applyAccelerationEnhancements(content, {
    companyName,
    commercial,
    pricing,
    simulator: showSimulator ? simulator : undefined,
    whatsappPhone,
    clientHeroMetrics: heroMetrics,
  });

  return {
    content,
    title,
    template: "acceleration",
    slugBase: buildSuggestedSlug(companyName),
  };
}

/** Fixture golden case — Saúde & Cia (referência visual). */
export const SAUDE_CIA_GROWTH_FIXTURE: Partial<ProposalContent> = {
  templateVersion: "r1-growth-v1",
  hero: {
    eyebrow: "Raise One Soluções",
    title: "Projeto de Aceleração Comercial",
    subtitle: "Plano Estratégico de Crescimento para Saúde & Cia",
  },
  positioningStatement:
    "Transformando indicação em aquisição previsível — sem ultrapassar a capacidade de atendimento.",
  heroMetrics: [
    { value: "13,5", label: "Anos de mercado" },
    { value: "~10", label: "Contatos por mês" },
    { value: "3", label: "Frentes prioritárias" },
  ],
  diagnosisConclusion:
    "O desafio não é apenas gerar mais contatos. É construir um canal previsível de aquisição — respeitando a capacidade comercial atual.",
};
