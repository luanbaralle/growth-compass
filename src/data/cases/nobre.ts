import type { Case } from "@/types/case";

/** Uso interno — status de publicação por item */
export const nobreCaseDataPolicy = {
  clientName: "public",
  landingPage: "n/a",
  funnelStructure: "private",
  quote: "pending_authorization",
  conversions: "pending_authorization",
  investment: "private",
  analytics: "private",
  googleAds: "private",
  reputationMetrics: "pending_authorization",
} as const;

export const nobre: Case = {
  slug: "nobre",
  title: "Nobre Imóveis",
  subtitle: "Posicionamento · Conteúdo · Growth · Reputação — parceria contínua.",
  client: "Nobre Imóveis · Itanhaém",
  industry: "Imobiliário",
  category: "Imobiliário",
  year: 2024,
  website: undefined,
  coverImage: "/images/cases/placeholder-cover.jpg",
  heroImage: "/images/cases/placeholder-hero.jpg",
  description:
    "Como estruturamos marketing, conteúdo e reputação digital para uma imobiliária crescer sem equipe interna de marketing.",
  challenge: "O desafio não era anunciar mais. Era fazer o marketing funcionar por dentro.",
  solution: "Construímos um sistema de growth, não uma equipe de marketing.",
  goals: [
    "Sem equipe de marketing interna.",
    "Marca e conteúdo sem direção.",
    "Reputação no Google não trabalhada.",
  ],
  deliverables: [
    "Posicionamento",
    "Esteira de conteúdo",
    "Capacitação comercial",
    "Gestão GMB",
  ],
  technologies: [],
  gallery: [],
  colors: [
    { name: "Nobre Red", hex: "#8F1D1D" },
    { name: "Warm White", hex: "#FAFAF8" },
  ],
  typography: { heading: "Serif display", body: "Sans-serif" },
  // Valores provisórios — atualizar quando Vini confirmar
  metrics: [
    { value: "4,9", label: "Nota no Google" },
    { value: "100+", label: "Avaliações publicadas" },
    { value: "Contínuo", label: "Parceria ativa" },
  ],
  nextProjects: [],
  process: [
    {
      phase: "01",
      title: "Posicionamento",
      description: "Brand core, público e tom de voz da marca",
    },
    {
      phase: "02",
      title: "Esteira de conteúdo",
      description: "Calendário e produção recorrente de conteúdo",
    },
    {
      phase: "03",
      title: "Time comercial",
      description: "Corretores como produtores de conteúdo",
    },
    {
      phase: "04",
      title: "Reputação Google",
      description: "GMB, avaliações, pós-venda e respostas",
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
      "Posicionamento de marca",
      "Calendário e esteira de conteúdo",
      "Capacitação do time comercial",
      "Gestão GMB e reputação",
      "Growth e relatórios trimestrais",
      "Otimização de canais",
    ],
    problemChannels: ["Indicação", "Ações isoladas", "Presença irregular"],
    problemClosing:
      "Contratar uma equipe não era a resposta. Estruturar um sistema, sim.",
    landingTitle: "A imobiliária que o Google — e os clientes — passaram a recomendar.",
    landingScrollHint: "Reputação construída no dia a dia",
    transformBefore: {
      channels: ["Sem marketing estruturado", "Conteúdo disperso", "Google sem gestão"],
      outcome: "Marca sem direção clara",
    },
    transformAfter: {
      channels: ["Posicionamento", "Esteira de conteúdo", "Corretores ativos", "GMB & reviews"],
      outcome: "Referência de confiança local",
    },
    faqs: [
      {
        question: "Brand core & posicionamento",
        answer:
          "Definimos o posicionamento da Nobre, o público-alvo e como a marca deveria se comunicar — a base para todo o resto do sistema de growth.",
      },
      {
        question: "Esteira de conteúdo",
        answer:
          "Criamos calendário editorial e fluxo de produção recorrente, transformando marketing de ação pontual em processo contínuo.",
      },
      {
        question: "Corretores como produtores",
        answer:
          "Capacitamos o time comercial para produzir conteúdo próprio, alinhado à marca — escala sem depender só de uma agência externa.",
      },
      {
        question: "GMB, reviews e pós-venda",
        answer:
          "Trabalhamos Google Meu Negócio, respostas a avaliações, fotos, atualizações e cultura de pós-venda — consolidando reputação onde o cliente decide.",
      },
    ],
  },
  heroExtended: {
    caseNumber: "03",
    caseVertical: "Imobiliário",
    background: "ambient",
    headlineLines: [
      "De imobiliária sem marketing interno",
      "à referência de confiança",
      "em Itanhaém.",
    ],
    heroMetrics: [
      { value: "4,9", label: "Nota no Google" },
      { value: "100+", label: "Avaliações" },
      { value: "Contínuo", label: "Parceria ativa" },
    ],
    ctaLabel: "Quero um sistema previsível de aquisição",
    ctaHref: "/diagnostico",
    metaSheet: {
      client: ["Nobre Imóveis"],
      segment: "Imobiliário · Itanhaém",
      services: ["Posicionamento", "Conteúdo", "Growth", "GMB"],
      period: "Parceria contínua",
    },
  },
};
