import type { Case } from "@/types/case";

/** Uso interno — status de publicação por item */
export const unipCaseDataPolicy = {
  clientName: "public",
  landingPage: "public",
  funnelStructure: "public",
  quote: "approved",
  conversions: "pending_authorization",
  investment: "private",
  analytics: "private",
  googleAds: "private",
} as const;

export const unip: Case = {
  slug: "unip",
  title: "UNIP Caraguatatuba",
  subtitle: "Landing Page · Google Ads · Mensuração — em 30 dias.",
  client: "UNIP EAD · Polo Caraguatatuba",
  industry: "Educação",
  category: "Educação",
  year: 2024,
  website: "https://faculdadelitoral.com.br",
  coverImage: "/images/cases/placeholder-cover.jpg",
  heroImage: "/images/cases/placeholder-hero.jpg",
  description:
    "De demanda espontânea a um canal previsível de captação de alunos — landing page, campanhas e mensuração integradas.",
  challenge: "A procura existia. Mas ninguém controlava.",
  solution: "Um sistema. Não peças soltas.",
  goals: ["Sem previsibilidade.", "Sem controle.", "Sem escala."],
  deliverables: ["Landing Page", "Google Ads", "Mensuração"],
  technologies: [],
  gallery: [
    {
      src: "/images/cases/placeholder-gallery-1.jpg",
      alt: "Landing page UNIP Caraguatatuba — página completa",
    },
  ],
  colors: [{ name: "UNIP Blue", hex: "#003366" }],
  typography: { heading: "Arial", body: "Arial" },
  metrics: [
    { value: "+90", label: "Conversões no primeiro ciclo" },
    { value: "300+", label: "Novos visitantes" },
    { value: "30 dias", label: "Primeiro ciclo validado" },
  ],
  testimonial: {
    quote:
      "As mensagens estão chegando. Alguns mais interessados, outros curiosos. Ainda não tivemos matrículas. Mas a procura aumentou consideravelmente.",
    author: "Polo UNIP · Caraguatatuba",
  },
  nextProjects: [],
  process: [
    { phase: "01", title: "Google", description: "Demanda qualificada contínua" },
    { phase: "02", title: "Landing Page", description: "Conversão orientada a contato" },
    { phase: "03", title: "WhatsApp", description: "Canal direto com o interessado" },
    { phase: "04", title: "Secretaria", description: "Atendimento e follow-up" },
  ],
  marketing: {
    positioning: "Pare de depender da sorte para gerar novos clientes.",
    conversionStrategy:
      "Construímos sistemas de aquisição que transformam marketing em crescimento consistente.",
    ctaPrimary: "Quero um sistema previsível de aquisição",
  },
  content: {
    agencyDeliverables: [
      "Estratégia",
      "Landing Page",
      "Google Ads",
      "Mensuração",
      "Acompanhamento",
    ],
    problemChannels: ["Instagram", "Rádio", "Indicação"],
    problemClosing: "Esperar alguém aparecer não é estratégia de crescimento.",
    quoteContext: "12 dias após o início do projeto",
    landingTitle: "A estrutura que passou a receber toda a aquisição.",
    landingScrollHint: "Role para explorar a página",
    transformBefore: {
      channels: ["Instagram", "Rádio", "Indicação"],
      outcome: "Dependência de mídia tradicional",
    },
    transformAfter: {
      channels: ["Google", "Landing Page", "WhatsApp", "Secretaria"],
      outcome: "Canal previsível de aquisição",
    },
    faqs: [
      {
        question: "Diagnóstico e estrutura",
        answer:
          "Mapeamos os canais existentes e desenhamos um funil único: anúncio, página, contato, atendimento.",
      },
      {
        question: "Landing page",
        answer:
          "Página orientada a uma única conversão — contato via WhatsApp — com informações locais e identidade da marca.",
      },
      {
        question: "Campanhas de demanda",
        answer:
          "Anúncios configurados para captar intenção real de matrícula, com mensuração de ponta a ponta.",
      },
      {
        question: "Acompanhamento",
        answer:
          "Monitoramento contínuo, ajustes graduais e comunicação transparente sobre fases de aprendizado.",
      },
    ],
  },
  heroExtended: {
    caseNumber: "01",
    caseVertical: "Educação",
    background: "ambient",
    headlineLines: [
      "De demanda espontânea",
      "a um canal previsível",
      "de captação de alunos.",
    ],
    heroMetrics: [
      { value: "+90", label: "Conversões" },
      { value: "300+", label: "Novos visitantes" },
      { value: "30 dias", label: "Primeiro ciclo" },
    ],
    ctaLabel: "Quero um sistema previsível de aquisição",
    ctaHref: "/diagnostico",
    metaSheet: {
      client: ["UNIP EAD", "Polo Caraguatatuba"],
      segment: "Educação",
      services: ["Landing Page", "Google Ads", "Mensuração"],
      period: "Primeiro ciclo",
    },
  },
};
