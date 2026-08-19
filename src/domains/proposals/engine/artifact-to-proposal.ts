import type { CopilotMeetingArtifact } from "@/domains/copilot/meeting/types";
import type {
  CopilotSessionSnapshot,
  CreativeBriefSection,
  RecommendedEngagement,
} from "@/domains/copilot/types";
import {
  applyAccelerationEnhancements,
} from "../pricing/r1-pricing";
import type { OSCommercialDefaults } from "@/domains/settings/types";
import type {
  ProposalContent,
  ProposalPricingTier,
  ProposalSimulatorDefaults,
  ProposalTemplate,
} from "../types";
import {
  applyAccelerationPlaybook,
  buildAccelerationSectionOverrides,
  inferAccelerationPlaybookParams,
} from "./acceleration-playbook";
import { buildDemandKeywords, buildLandingMockup } from "./proposal-visuals";

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

/** Classifica template: aceleração (UNIP) vs desenvolvimento sob medida (Nobre). */
export function inferProposalTemplate(artifact: CopilotMeetingArtifact): ProposalTemplate {
  const graph = artifact.evidence_graph ?? [];
  const corpus = graph.map((item) => `${item.label} ${item.value}`).join(" ").toLowerCase();

  const strongDevSignals = graph.filter((item) => {
    const text = `${item.label} ${item.value}`.toLowerCase();
    return (
      /desenvolvimento\s+(de\s+)?(software|sistema|aplicação|aplicacao|app)\b/.test(text) ||
      /\b(api|backend|frontend)\b.*\b(integração|integracao|desenvolv)/.test(text) ||
      /integração\s+com\s+(imoview|erp custom|crm custom)/.test(text) ||
      /projeto\s+sob\s+medida.*\b(software|sistema|automação operacional)\b/.test(text)
    );
  });

  const accelerationSignals =
    /corretor|seguro|consórcio|consorcio|clínica|clinica|matrícula|matricula|imobili|aquisição|aquisicao|google ads|landing|plano de saúde|yamaha|rodobens/.test(
      corpus,
    );

  if (strongDevSignals.length >= 2) return "custom_solution";
  if (accelerationSignals) return "acceleration";
  if (strongDevSignals.length >= 1 && !accelerationSignals) return "custom_solution";
  return "acceleration";
}

function engagementBullets(engagement: RecommendedEngagement | null): string[] {
  if (!engagement?.phases?.length) return [];
  return engagement.phases.flatMap((phase) =>
    phase.items.map((item) => `${phase.name}: ${item}`),
  );
}

function buildCustomSolutionSections(input: {
  diagnosis: Record<string, unknown>;
  artifact: CopilotMeetingArtifact;
  session: CopilotSessionSnapshot;
  engagement: RecommendedEngagement | null;
  opportunityNarrative: string;
  opportunityBullets: string[];
}): Record<string, { narrative: string; bullets: string[]; editorNotes?: string }> {
  const { diagnosis, artifact, session, engagement, opportunityNarrative, opportunityBullets } =
    input;

  return {
    diagnosis: {
      narrative: String(diagnosis.situation ?? artifact.transcript_summary ?? ""),
      bullets: [
        diagnosis.mainProblem ? `Principal problema: ${diagnosis.mainProblem}` : "",
        diagnosis.constraint ? `Restrição: ${diagnosis.constraint}` : "",
        `Cobertura diagnóstica: ${session.overallCoverage}%`,
      ].filter(Boolean),
    },
    opportunity: {
      narrative: opportunityNarrative,
      bullets: opportunityBullets,
    },
    behavior: {
      narrative: "Jornada típica do usuário ou cliente — adaptar com dados reais da reunião.",
      bullets: [
        "Identificação da necessidade",
        "Pesquisa e comparação",
        "Contato ou trial",
        "Decisão com base em confiança e fit",
      ],
      editorNotes: "Personalizar com fluxo identificado na reunião.",
    },
    mechanism: {
      narrative: "Arquitetura da solução sob medida — detalhar integrações e fluxos identificados na reunião.",
      bullets: ["Diagnóstico técnico", "Desenvolvimento iterativo", "Integrações", "Implantação"],
    },
    strategy: {
      narrative: engagement?.strategy ?? String(diagnosis.opportunity ?? ""),
      bullets: engagementBullets(engagement).slice(0, 8),
    },
    deliverables: {
      narrative: "Escopo tangível dividido em blocos de entrega.",
      bullets: [
        "Diagnóstico e escopo fechado",
        "Desenvolvimento iterativo",
        "Integrações necessárias",
        "Implantação e treinamento",
      ],
    },
    validation: {
      narrative: "Critérios de aceite e marcos de validação do projeto.",
      bullets: [
        "Homologação por módulo",
        "Testes com usuários reais",
        "Documentação e handoff",
      ],
    },
    investment: {
      narrative: "Estrutura de investimento Raise One — valores de referência, ajustáveis na Reunião 2.",
      bullets: [],
      editorNotes: "Revise valores com o comercial antes de publicar.",
    },
    implementation: {
      narrative: "Plano de execução em fases sequenciais.",
      bullets: engagement?.phases?.map((p) => p.name) ?? ["Fase 1 — Discovery", "Fase 2 — Build", "Fase 3 — Go-live"],
    },
    next_steps: {
      narrative: "Aprovação deste plano dá início ao desenvolvimento.",
      bullets: ["Aprovação do projeto", "Contrato assinado", "Kick-off técnico", "Início da execução"],
    },
  };
}

export function buildProposalContentFromArtifact(input: {
  session: CopilotSessionSnapshot;
  artifact: CopilotMeetingArtifact;
  commercial?: OSCommercialDefaults;
  pricing?: ProposalPricingTier[];
  simulator?: ProposalSimulatorDefaults;
  whatsappPhone?: string;
}): { content: ProposalContent; template: ProposalTemplate; title: string; slugBase: string } {
  const { session, artifact } = input;
  const synthesis = artifact.meeting_synthesis;
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  const engagement = artifact.recommended_engagement as RecommendedEngagement | null;
  const template = inferProposalTemplate(artifact);
  const companyName = session.meetingObjective.companyName;

  const title =
    template === "custom_solution"
      ? `Projeto Sob Medida — ${companyName}`
      : `Projeto de Aceleração — ${companyName}`;

  const opportunityNarrative = String(diagnosis.opportunity ?? synthesis?.diagnosis.opportunity ?? "");
  const opportunityBullets = artifact.what_we_learned?.slice(0, 6) ?? [];

  const playbookParams =
    template === "acceleration"
      ? inferAccelerationPlaybookParams({ artifact, companyName })
      : null;

  const accelerationOverrides =
    playbookParams &&
    buildAccelerationSectionOverrides({
      params: playbookParams,
      diagnosis,
      opportunityNarrative,
      engagementStrategy: engagement?.strategy,
    });

  const customSections =
    template === "custom_solution"
      ? buildCustomSolutionSections({
          diagnosis,
          artifact,
          session,
          engagement,
          opportunityNarrative,
          opportunityBullets,
        })
      : null;

  const sectionContent: Record<string, { narrative: string; bullets: string[]; editorNotes?: string }> = {
    opportunity: {
      narrative: opportunityNarrative,
      bullets: opportunityBullets,
    },
    behavior: {
      narrative:
        template === "acceleration"
          ? "Jornada do cliente ideal — da pesquisa no Google até a venda, com cada etapa mensurável."
          : "Jornada típica do cliente ideal — adaptar com dados reais da reunião.",
      bullets: [],
      editorNotes: template === "acceleration" ? undefined : "Personalizar com canal de aquisição mencionado na reunião.",
    },
    next_steps: {
      narrative:
        template === "acceleration"
          ? "Aprovação inicia a Fase 1 — Estruturação e Validação de Demanda."
          : "Aprovação deste plano dá início à construção da estrutura de crescimento.",
      bullets: [
        "Aprovação do plano",
        "Contrato e kick-off",
        "Coleta de acessos e materiais",
        "Início da implementação",
      ],
    },
    ...(accelerationOverrides ?? customSections ?? {}),
  };

  const sections: CreativeBriefSection[] = SECTION_TEMPLATES.map((t) => ({
    key: t.key,
    number: t.number,
    title: t.title,
    narrative: sectionContent[t.key]?.narrative || "A desenvolver.",
    bullets: sectionContent[t.key]?.bullets ?? [],
    editorNotes: sectionContent[t.key]?.editorNotes,
  }));

  const slugBase = companyName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 48);

  const heroSubtitle =
    template === "acceleration"
      ? playbookParams
        ? `Fase 1 — Estruturação e Validação de Demanda para ${companyName}`
        : `Plano estratégico de crescimento para ${companyName}`
      : `Solução desenvolvida sob medida para ${companyName}`;

  const baseContent: ProposalContent = {
    hero: {
      eyebrow: "Raise One Soluções · Rascunho pós-reunião",
      title,
      subtitle: heroSubtitle,
    },
    sections,
    gapsForMeeting2: artifact.unknowns?.slice(0, 12) ?? synthesis?.criticalUnknowns ?? [],
    cta: {
      label: template === "acceleration" ? "Quero avançar com este plano" : "Aprovar projeto",
      whatsappMessage: `Olá! Revisei a proposta "${title}" para ${companyName} e gostaria de avançar.`,
      whatsappPhone: input.whatsappPhone,
    },
    demandKeywords:
      template === "acceleration"
        ? buildDemandKeywords({
            companyName,
            opportunityText: opportunityNarrative,
            bullets: opportunityBullets,
          })
        : undefined,
    landingMockup:
      template === "acceleration" && playbookParams?.assetMode !== "existing_lp"
        ? buildLandingMockup({ companyName, heroTitle: title, heroSubtitle })
        : template === "acceleration"
          ? buildLandingMockup({
              companyName,
              heroTitle: `${companyName} — Canal de aquisição`,
              heroSubtitle: "Landing existente instrumentada para conversão",
            })
          : undefined,
  };

  let content = baseContent;

  if (template === "acceleration" && playbookParams) {
    content = applyAccelerationPlaybook({
      content: baseContent,
      params: playbookParams,
      session,
      artifact,
      commercial: input.commercial,
    });
  }

  return {
    template,
    title,
    slugBase: slugBase || "cliente",
    content:
      template === "acceleration"
        ? applyAccelerationEnhancements(content, {
            overallCoverage: session.overallCoverage,
            knowledgeDepth: session.knowledgeDepth,
            unknownsCount: artifact.unknowns?.length ?? 0,
            companyName,
            commercial: input.commercial,
            pricing: content.pricing ?? input.pricing,
            simulator: input.simulator,
            whatsappPhone: input.whatsappPhone,
          })
        : content,
  };
}

export function buildSuggestedSlug(base: string): string {
  return base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64);
}
