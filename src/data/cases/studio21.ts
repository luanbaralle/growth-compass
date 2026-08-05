import type { Case } from "@/types/case";

/** Uso interno — status de publicação por item */
export const studio21CaseDataPolicy = {
  clientName: "public",
  landingPage: "pending_authorization",
  funnelStructure: "private",
  quote: "pending_authorization",
  conversions: "approved",
  investment: "private",
  analytics: "private",
  googleAds: "private",
} as const;

export const studio21: Case = {
  slug: "studio21",
  title: "Studio 21",
  subtitle: "Landing Page · Google Ads · Estratégia de Conversão — 3 meses.",
  client: "Studio 21 · Itanhaém",
  industry: "Beleza",
  category: "Marketing",
  year: 2026,
  website: "https://salaostudio21.com.br",
  coverImage: "/images/cases/placeholder-cover.jpg",
  heroImage: "/images/cases/placeholder-hero.jpg",
  description:
    "Como estruturamos um funil digital para transformar intenção de busca em novos atendimentos para um salão premium.",
  challenge: "O desafio não era aparecer mais. Era criar um sistema que gerasse demanda qualificada.",
  solution: "Construímos um sistema de aquisição, não apenas campanhas.",
  goals: [
    "Dependência de indicações.",
    "Aquisição sem previsibilidade.",
    "Ausência de um funil estruturado.",
  ],
  deliverables: ["Landing Page", "Google Ads", "Mensuração", "Copywriting"],
  technologies: [],
  gallery: [
    {
      src: "/images/cases/placeholder-gallery-1.jpg",
      alt: "Landing page Studio 21 — página completa",
    },
  ],
  colors: [
    { name: "Obsidian", hex: "#0A0A0A" },
    { name: "Warm White", hex: "#F5F3EF" },
  ],
  typography: { heading: "Serif display", body: "Sans-serif" },
  metrics: [
    { value: "180+", label: "Conversões em 3 meses" },
    { value: "2.500+", label: "Cliques qualificados" },
    { value: "90 dias", label: "Período validado" },
  ],
  nextProjects: [],
  process: [
    {
      phase: "01",
      title: "Google Ads",
      description: "Capturar intenção de quem busca serviços específicos",
    },
    {
      phase: "02",
      title: "Landing Page",
      description: "Concentrar atenção e elevar percepção de valor",
    },
    {
      phase: "03",
      title: "WhatsApp",
      description: "Reduzir fricção e acelerar o primeiro contato",
    },
    {
      phase: "04",
      title: "Atendimento",
      description: "Transformar intenção em agendamento",
    },
  ],
  marketing: {
    positioning: "Vamos construir um sistema de aquisição para sua empresa?",
    conversionStrategy:
      "Projetos orientados por estratégia, mensuração e crescimento sustentável.",
    ctaPrimary: "Quero um sistema previsível de aquisição",
  },
  content: {
    agencyDeliverables: [
      "Estratégia digital",
      "Landing Page",
      "Google Ads",
      "Copywriting",
      "Mensuração",
      "Otimizações contínuas",
    ],
    problemChannels: ["Instagram", "Indicação", "Busca orgânica"],
    problemClosing:
      "Ter presença digital não significava ter um processo previsível de aquisição de clientes.",
    landingTitle: "Uma Landing Page criada para vender confiança antes de vender serviços.",
    landingScrollHint: "Explore a página completa",
    transformBefore: {
      channels: ["Instagram", "Indicação", "Fluxo espontâneo"],
      outcome: "Resultado inconsistente",
    },
    transformAfter: {
      channels: ["Google Ads", "Landing Page", "WhatsApp", "Atendimento"],
      outcome: "Sistema previsível de aquisição",
    },
    faqs: [
      {
        question: "Pesquisa de intenção",
        answer:
          "Mapeamos os serviços com maior demanda de busca — incluindo procedimentos premium como Mega Hair e mechas — para priorizar campanhas onde a intenção de compra já existe.",
      },
      {
        question: "Arquitetura do funil",
        answer:
          "Definimos o fluxo completo entre anúncio, página, WhatsApp e atendimento. Cada etapa com uma função clara: captar, converter, contactar, agendar.",
      },
      {
        question: "Construção da Landing Page",
        answer:
          "Desenvolvemos uma experiência premium — minimalista, com fotografia em destaque e hierarquia forte — orientada a construir confiança antes de apresentar serviços.",
      },
      {
        question: "Otimizações contínuas",
        answer:
          "Análise recorrente de campanhas, termos de pesquisa e desempenho dos anúncios para melhorar continuamente a qualidade do tráfego e a eficiência do funil.",
      },
    ],
  },
  heroExtended: {
    caseNumber: "02",
    caseVertical: "Serviços",
    background: "ambient",
    headlineLines: [
      "Transformando pesquisas no Google",
      "em oportunidades reais",
      "para um salão de beleza.",
    ],
    heroMetrics: [
      { value: "180+", label: "Conversões" },
      { value: "2.500+", label: "Cliques qualificados" },
      { value: "90 dias", label: "Período" },
    ],
    ctaLabel: "Quero um sistema previsível de aquisição",
    ctaHref: "/diagnostico",
    metaSheet: {
      client: ["Studio 21"],
      segment: "Beleza · Salão Premium",
      services: ["Landing Page", "Google Ads", "Estratégia"],
      period: "3 meses",
    },
  },
};
