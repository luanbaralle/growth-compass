import type { NextStepLink } from "@/components/marketing/shared/NextSteps";

export type CaseCategory = "marketing" | "tecnologia" | "imobiliario" | "ia";

export interface CaseStudy {
  slug: string;
  name: string;
  client: string;
  categories: CaseCategory[];
  tag: string;
  gradient: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { metric: string; label: string }[];
  services: string[];
  timeline: string;
  quote?: { text: string; author: string };
}

export const casesSeo = {
  title: "Cases — Raise One",
  description:
    "Resultados reais de marketing, tecnologia e crescimento. Cases de UNIP, Studio 21, AMF Imóveis, Atlas e mais.",
};

export const caseCategories: { id: CaseCategory | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "marketing", label: "Marketing" },
  { id: "tecnologia", label: "Tecnologia" },
  { id: "imobiliario", label: "Imobiliário" },
  { id: "ia", label: "IA" },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "atlas",
    name: "Atlas",
    client: "Incorporadora / Imobiliária",
    categories: ["tecnologia", "imobiliario", "ia"],
    tag: "Tecnologia",
    gradient: "from-slate-900 via-slate-800 to-orange-950/40",
    summary: "Portal imobiliário inteligente com IA, CRM e automação de follow-up.",
    challenge:
      "A incorporadora precisava de um portal que não fosse apenas vitrine — mas uma máquina de captação e qualificação de leads, integrada ao processo comercial.",
    solution:
      "Desenvolvemos o Atlas: portal responsivo de empreendimentos, CRM imobiliário, automações de WhatsApp e IA para qualificação automática de leads.",
    results: [
      { metric: "+340%", label: "Leads qualificados" },
      { metric: "-62%", label: "Tempo de resposta" },
      { metric: "+28%", label: "Taxa de conversão" },
      { metric: "24/7", label: "Qualificação com IA" },
    ],
    services: ["Portal imobiliário", "CRM", "Automações IA", "Dashboards"],
    timeline: "4 meses",
  },
  {
    slug: "unip",
    name: "UNIP",
    client: "Universidade Paulista",
    categories: ["marketing"],
    tag: "Educação",
    gradient: "from-blue-950 via-indigo-900 to-slate-900",
    summary: "Captação de alunos com landing pages, Google Ads e SEO estratégico.",
    challenge:
      "A UNIP precisava aumentar a captação de alunos em regiões específicas, competindo com dezenas de instituições no Google.",
    solution:
      "Estruturamos campanhas de Google Ads por curso e região, landing pages de conversão otimizadas e estratégia de SEO para termos de alta intenção.",
    results: [
      { metric: "+180%", label: "Leads de captação" },
      { metric: "-45%", label: "Custo por lead" },
      { metric: "+12", label: "Landing pages ativas" },
      { metric: "Top 3", label: "Posição SEO regional" },
    ],
    services: ["Google Ads", "Landing Pages", "SEO", "Tracking"],
    timeline: "6 meses",
  },
  {
    slug: "studio21",
    name: "Studio 21",
    client: "Studio 21 Arquitetura",
    categories: ["marketing"],
    tag: "Serviços",
    gradient: "from-zinc-900 via-neutral-800 to-amber-950/30",
    summary: "Posicionamento de marca e aquisição com Google Ads estratégico.",
    challenge:
      "Estúdio de arquitetura com excelente portfólio, mas sem presença digital estruturada — dependia 100% de indicação.",
    solution:
      "Reposicionamento digital, campanhas Google Ads focadas em projetos residenciais e comerciais, e landing pages que traduziam o portfólio em conversão.",
    results: [
      { metric: "+220%", label: "Leads qualificados" },
      { metric: "+85%", label: "Projetos fechados" },
      { metric: "3x", label: "ROI sobre mídia" },
      { metric: "-38%", label: "Ciclo de venda" },
    ],
    services: ["Google Ads", "Posicionamento", "Landing Pages", "Conteúdo"],
    timeline: "5 meses",
  },
  {
    slug: "amf",
    name: "AMF Imóveis",
    client: "AMF Imóveis",
    categories: ["marketing", "imobiliario"],
    tag: "Imobiliário",
    gradient: "from-stone-900 via-zinc-800 to-orange-950/20",
    summary: "Campanhas, landing pages e Google Ads para geração de leads imobiliários.",
    challenge:
      "Imobiliária em mercado competitivo precisava gerar leads qualificados de forma previsível — sem depender apenas de portais pagos.",
    solution:
      "Campanhas Google Ads por tipo de imóvel e região, landing pages de empreendimentos com formulário integrado ao CRM, e automação de follow-up.",
    results: [
      { metric: "+290%", label: "Leads mensais" },
      { metric: "-52%", label: "Custo por lead" },
      { metric: "+8", label: "Empreendimentos ativos" },
      { metric: "4.2x", label: "ROI campanhas" },
    ],
    services: ["Google Ads", "Landing Pages", "CRM", "Automações"],
    timeline: "4 meses",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export const casesNextSteps: NextStepLink[] = [
  {
    label: "Programa de Crescimento",
    description: "Como replicamos esses resultados no seu negócio.",
    href: "/programa-de-crescimento",
    internal: true,
  },
  {
    label: "Metodologia",
    description: "O framework por trás de cada case.",
    href: "/metodologia",
    internal: true,
  },
  {
    label: "Fazer diagnóstico",
    description: "Descubra suas oportunidades de crescimento.",
    href: "/diagnostico",
    internal: true,
  },
];
