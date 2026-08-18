import type { CopilotMeetingArtifact } from "@/domains/copilot/meeting/types";
import type {
  CopilotSessionSnapshot,
  CreativeBriefSection,
  RecommendedEngagement,
} from "@/domains/copilot/types";
import {
  applyAccelerationEnhancements,
  R1_ACCELERATION_PRICING,
} from "../pricing/r1-pricing";
import type { OSCommercialDefaults } from "@/domains/settings/types";
import type { ProposalPricingTier, ProposalSimulatorDefaults } from "../types";
import { buildDemandKeywords, buildLandingMockup } from "./proposal-visuals";

const SECTION_TEMPLATES: Array<{ key: string; number: string; title: string }> = [
  { key: "diagnosis", number: "01", title: "Diagnóstico — Onde Estamos Hoje" },
  { key: "opportunity", number: "02", title: "Oportunidade — Existe Demanda" },
  { key: "behavior", number: "03", title: "Comportamento do Cliente" },
  { key: "mechanism", number: "04", title: "O Mecanismo — Sistema de Aquisição" },
  { key: "strategy", number: "05", title: "Estratégia — Como Vamos Atrair" },
  { key: "deliverables", number: "06", title: "Entregáveis" },
  { key: "validation", number: "07", title: "Validação — Primeiros 30 Dias" },
  { key: "investment", number: "08", title: "Investimento — Estrutura de Preços" },
  { key: "implementation", number: "09", title: "Implementação — Plano de Execução" },
  { key: "next_steps", number: "10", title: "Próximos Passos" },
];

function inferTemplate(artifact: CopilotMeetingArtifact): ProposalTemplate {
  const graph = artifact.evidence_graph ?? [];
  const devSignals = graph.some(
    (item) =>
      /software|sistema|api|integração|desenvolvimento|automação/i.test(
        `${item.label} ${item.value}`,
      ),
  );
  return devSignals ? "custom_solution" : "acceleration";
}

function engagementBullets(engagement: RecommendedEngagement | null): string[] {
  if (!engagement?.phases?.length) return [];
  return engagement.phases.flatMap((phase) =>
    phase.items.map((item) => `${phase.name}: ${item}`),
  );
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
  const template = inferTemplate(artifact);
  const companyName = session.meetingObjective.companyName;
  const clientName = session.meetingObjective.prospectName;

  const title =
    template === "custom_solution"
      ? `Projeto Sob Medida — ${companyName}`
      : `Projeto de Aceleração — ${companyName}`;

  const opportunityNarrative = String(diagnosis.opportunity ?? synthesis?.diagnosis.opportunity ?? "");
  const opportunityBullets = artifact.what_we_learned?.slice(0, 6) ?? [];

  const sectionContent: Record<string, { narrative: string; bullets: string[]; editorNotes?: string }> = {
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
      narrative: "Jornada típica do cliente ideal — adaptar com dados reais da reunião.",
      bullets: [
        "Surge a necessidade",
        "Pesquisa opções",
        "Compara alternativas",
        "Entra em contato",
        "Decide com base no atendimento",
      ],
      editorNotes: "Personalizar com canal de aquisição mencionado na reunião.",
    },
    mechanism: {
      narrative:
        template === "acceleration"
          ? "Sistema integrado: captura de demanda → landing → WhatsApp/formulário → atendimento comercial."
          : "Arquitetura da solução sob medida — detalhar integrações e fluxos identificados na reunião.",
      bullets: ["Google Ads / Demanda", "Landing de conversão", "WhatsApp ou formulário", "Atendimento comercial"],
    },
    strategy: {
      narrative: engagement?.strategy ?? String(diagnosis.opportunity ?? ""),
      bullets: engagementBullets(engagement).slice(0, 8),
    },
    deliverables: {
      narrative: "Escopo tangível dividido em blocos de entrega.",
      bullets:
        template === "acceleration"
          ? [
              "Landing Page de conversão",
              "Google Ads configurado",
              "Rastreamento e conversões",
              "Primeiro ciclo operacional (30 dias)",
            ]
          : [
              "Diagnóstico e escopo fechado",
              "Desenvolvimento iterativo",
              "Integrações necessárias",
              "Implantação e treinamento",
            ],
    },
    validation: {
      narrative: "O que validar nos primeiros 30 dias com dados reais.",
      bullets: [
        "Volume de procura na região/canal",
        "Custo por lead (CPL)",
        "Qualidade dos contatos",
        "Taxa de resposta comercial",
      ],
    },
    investment: {
      narrative: "Estrutura de investimento Raise One — valores de referência, ajustáveis na Reunião 2.",
      bullets: (input.pricing ?? R1_ACCELERATION_PRICING).map(
        (tier) => `${tier.name}: ${tier.amountLabel}`,
      ),
      editorNotes: "Revise valores com o comercial antes de publicar.",
    },
    implementation: {
      narrative: "Plano de execução em fases sequenciais.",
      bullets: engagement?.phases?.map((p) => p.name) ?? ["Fase 1 — Estrutura", "Fase 2 — Ativação", "Fase 3 — Escala"],
    },
    next_steps: {
      narrative: "Aprovação deste plano dá início à construção da estrutura de crescimento.",
      bullets: ["Aprovação do projeto", "Contrato assinado", "Kick-off e coleta de materiais", "Início da execução"],
    },
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
      ? `Plano estratégico de crescimento para ${companyName}`
      : `Solução desenvolvida sob medida para ${companyName}`;

  const baseContent: ProposalContent = {
    hero: {
      eyebrow: "Raise One Soluções",
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
      template === "acceleration"
        ? buildLandingMockup({ companyName, heroTitle: title, heroSubtitle })
        : undefined,
  };

  return {
    template,
    title,
    slugBase: slugBase || "cliente",
    content:
      template === "acceleration"
        ? applyAccelerationEnhancements(baseContent, {
            overallCoverage: session.overallCoverage,
            knowledgeDepth: session.knowledgeDepth,
            unknownsCount: artifact.unknowns?.length ?? 0,
            companyName,
            commercial: input.commercial,
            pricing: input.pricing,
            simulator: input.simulator,
            whatsappPhone: input.whatsappPhone,
          })
        : baseContent,
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
