/** Plano de Conteúdo · Saúde & Cia (alternativa de entrada) */

export const SAUDE_CIA_CONTENT_PLAN = {
  company: "Saúde & Cia",
  client: "Angélica",
  planName: "Plano de Conteúdo",

  hero: {
    eyebrow: "Plano de Conteúdo",
    headline: "Transformar experiência em presença digital.",
    lead: "Produção estratégica de conteúdo para fortalecer a autoridade da Saúde & Cia, gerar presença e manter a marca ativa nas redes sociais.",
    price: "R$ 997/mês",
    priceNote: "Operação mensal de produção de conteúdo",
    ctaLabel: "Quero começar com conteúdo",
    ctaMessage:
      "Olá! Revisei o Plano de Conteúdo da Raise One para a Saúde & Cia e gostaria de avançar.",
  },

  build: {
    title: "O que vamos construir",
    lead: "Um sistema contínuo de produção de conteúdo baseado nos produtos, dúvidas e experiência comercial da Saúde & Cia.",
    flow: ["Estratégia", "Roteiro", "Captação", "Edição", "Publicação"] as const,
  },

  included: {
    title: "O que está incluído",
    packageTitle: "4 Reels estratégicos por mês",
    items: [
      "Planejamento editorial",
      "Definição dos temas",
      "Roteiros",
      "1 sessão mensal de captação presencial em Itanhaém",
      "Direção durante a gravação",
      "Edição",
      "Legendas",
      "Identidade visual",
      "Publicação",
      "Acompanhamento básico de performance",
    ],
  },

  exclusions: {
    title: "Escopo",
    r1Role: "A Raise One será responsável pela produção dos conteúdos.",
    clientRole: "A Saúde & Cia permanece responsável por:",
    clientItems: [
      "Responder comentários",
      "Responder mensagens e inbox",
      "Atendimento aos seguidores",
      "Relacionamento com clientes",
      "Aprovação dos conteúdos",
      "Disponibilização da Angélica para a gravação",
    ],
    note: "Este plano não inclui gestão de comunidade, atendimento de redes sociais, tráfego pago ou gestão de campanhas.",
  },

  investment: {
    title: "Investimento",
    planLabel: "Plano de Conteúdo",
    amount: "R$ 997/mês",
    highlights: [
      "4 Reels/mês",
      "1 sessão presencial de captação",
      "Planejamento + roteiros",
      "Edição + publicação",
      "Acompanhamento de performance",
    ],
    note: "Uma operação enxuta para manter a Saúde & Cia presente, relevante e profissional nas redes.",
  },

  closing: {
    title: "Começamos pelo conteúdo.",
    body: "Se o objetivo neste momento é fortalecer a presença digital da Saúde & Cia antes de ampliar a operação de aquisição, podemos começar por esta frente e evoluir posteriormente conforme fizer sentido.",
    upgrade:
      "Este plano pode evoluir posteriormente para uma operação completa de aquisição, conectando conteúdo, Google Ads e conversão.",
    ctaLabel: "Quero começar com conteúdo",
  },
} as const;

export const SAUDE_CIA_CONTENT_PLAN_NAV = [
  { id: "construir", label: "O que vamos construir" },
  { id: "incluido", label: "Incluso" },
  { id: "escopo", label: "Escopo" },
  { id: "investimento", label: "Investimento" },
  { id: "proximos-passos", label: "Próximos passos" },
];
