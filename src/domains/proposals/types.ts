import type { CreativeBrief, CreativeBriefSection } from "@/domains/copilot/types";

export type ProposalTemplate = "acceleration" | "custom_solution";
export type ProposalStatus = "draft" | "published" | "archived";

export interface ProposalHero {
  title: string;
  subtitle: string;
  eyebrow?: string;
}

export interface ProposalCta {
  label: string;
  whatsappMessage: string;
}

export interface ProposalContent {
  hero: ProposalHero;
  sections: CreativeBriefSection[];
  cta: ProposalCta;
  gapsForMeeting2?: string[];
}

export interface Proposal {
  id: string;
  slug: string;
  title: string;
  template: ProposalTemplate;
  status: ProposalStatus;
  company_id: string | null;
  prospect_id: string | null;
  copilot_session_id: string | null;
  client_name: string | null;
  company_name: string;
  creative_brief: CreativeBrief | null;
  content: ProposalContent;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const PROPOSAL_TEMPLATE_LABELS: Record<ProposalTemplate, string> = {
  acceleration: "Aceleração (UNIP)",
  custom_solution: "Solução sob medida (Nobre)",
};

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  draft: "Rascunho",
  published: "Publicada",
  archived: "Arquivada",
};

export function briefToProposalContent(brief: CreativeBrief): ProposalContent {
  return {
    hero: {
      eyebrow: "Raise One Soluções",
      title: brief.projectTitle,
      subtitle: `Plano estratégico para ${brief.companyName}`,
    },
    sections: brief.sections,
    gapsForMeeting2: brief.gapsForMeeting2,
    cta: {
      label: "Quero avançar com este plano",
      whatsappMessage: `Olá! Revisei a proposta "${brief.projectTitle}" para ${brief.companyName} e gostaria de avançar.`,
    },
  };
}
