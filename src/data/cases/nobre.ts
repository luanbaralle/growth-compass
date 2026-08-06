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
  metrics: [
    {
      value: "4,9",
      label: "Nota no Google",
      context:
        "Avaliação média consolidada no Google Meu Negócio após gestão ativa de reputação e respostas a reviews.",
    },
    {
      value: "100+",
      label: "Avaliações publicadas",
      context:
        "Volume de reviews acumulado ao longo da parceria, construído com cultura de pós-venda e presença consistente no GMB.",
    },
    {
      value: "Contínuo",
      label: "Parceria ativa",
      context:
        "Projeto de growth com operação recorrente: conteúdo, capacitação comercial e reputação trabalhados de forma contínua.",
    },
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
    ctaWhatsAppMessage:
      "Olá! Li o case da Nobre Imóveis no site da Raise One e gostaria de entender se esse sistema de growth funciona para meu negócio.",
  },
  content: {
    problemIntro:
      "A Nobre já vendia por indicação e presença local, mas não tinha marketing estruturado por dentro. Conteúdo saía quando dava, o Google não era trabalhado de forma ativa e o time comercial não participava da construção da marca.",
    agencyDeliverables: [
      { label: "Posicionamento de marca", hint: "Direção clara no mercado local" },
      { label: "Calendário e esteira de conteúdo", hint: "Presença consistente" },
      { label: "Capacitação do time comercial", hint: "Corretores alinhados à marca" },
      { label: "Gestão GMB e reputação", hint: "Confiança no Google" },
      { label: "Growth e relatórios trimestrais", hint: "Decisões com dados" },
      { label: "Otimização de canais", hint: "Melhoria contínua" },
    ],
    deliverablesIntro:
      "O que a Raise One estruturou neste projeto. Cada peça conectada no sistema, não entrega isolada.",
    problemChannels: ["Indicação", "Ações isoladas", "Presença irregular"],
    problemClosing:
      "Contratar uma equipe não era a resposta. Estruturar um sistema, sim.",
    resultsIntro:
      "Indicadores de reputação e parceria, consolidados ao longo da operação contínua com a Raise One.",
    whyItWorkedTitle: "Como conseguimos",
    whyItWorkedIntro:
      "O crescimento não veio de uma ação pontual. Veio da combinação de decisões abaixo, aplicadas de forma consistente ao longo da parceria.",
    whyItWorked: [
      {
        title: "Posicionamento como base",
        description:
          "Definimos público, tom e proposta de valor da Nobre antes de produzir conteúdo ou investir em canais, evitando comunicação genérica.",
      },
      {
        title: "Esteira de conteúdo recorrente",
        description:
          "Calendário editorial e fluxo de produção transformaram marketing de ação esporádica em processo contínuo com previsibilidade.",
      },
      {
        title: "Corretores como canal",
        description:
          "Capacitação do time comercial para produzir conteúdo alinhado à marca, escalando presença sem depender só de produção externa.",
      },
      {
        title: "Reputação no Google",
        description:
          "Gestão ativa do GMB, respostas a avaliações e cultura de pós-venda consolidaram confiança onde o cliente decide qual imobiliária contatar.",
      },
      {
        title: "Growth com dados",
        description:
          "Relatórios trimestrais e acompanhamento de canais orientaram ajustes com base em comportamento real, não em impressões isoladas.",
      },
      {
        title: "Parceria contínua",
        description:
          "Modelo de operação recorrente permitiu evoluir posicionamento, conteúdo e reputação ao longo do tempo, não em um sprint único.",
      },
    ],
    systemFlowIntro: "Da busca por imóvel à confiança na marca.",
    systemFlow: [
      { label: "Cliente pesquisa", hint: "intenção de compra ou aluguel", kind: "demand" },
      { label: "Conteúdo e redes", hint: "presença consistente", kind: "system" },
      { label: "Google / GMB", hint: "reputação visível", kind: "system" },
      { label: "Corretor", hint: "contato humano", kind: "conversion" },
      { label: "Visita", hint: "intenção avançada", kind: "conversion" },
      { label: "Confiança consolidada", hint: "decisão informada", kind: "conversion" },
    ],
    lessonsTitle: "O que aprendemos",
    lessonsIntro:
      "Projetos de growth contínuo geram aprendizado acumulado. Estes são os insights que levamos para os próximos sistemas de marketing.",
    lessonsLearned: [
      {
        title: "Marca antes de volume",
        description:
          "Sem posicionamento claro, mais conteúdo só amplifica confusão. A direção da marca vem antes da escala de produção.",
      },
      {
        title: "Corretores precisam de método",
        description:
          "Capacitar o time comercial com guidelines e calendário aumenta consistência mais do que produzir tudo pela agência.",
      },
      {
        title: "Google é vitrine de confiança",
        description:
          "No imobiliário, reviews e respostas no GMB influenciam a decisão tanto quanto anúncios ou posts isolados.",
      },
      {
        title: "Growth é processo, não campanha",
        description:
          "Resultados de reputação e posicionamento se constroem com operação recorrente, não com ações pontuais de curto prazo.",
      },
    ],
    landingTitle: "A imobiliária que o Google e os clientes passaram a recomendar.",
    landingDescription:
      "Gestão ativa do Google Meu Negócio, respostas a avaliações e presença consistente onde o cliente decide qual imobiliária contatar.",
    landingScrollHint: "Reputação construída no dia a dia",
    transformIntro: "De marketing disperso a um sistema que constrói confiança local.",
    transformBefore: {
      outcome: "Marca sem direção clara",
      items: [
        { label: "Sem marketing estruturado", hint: "Ações pontuais, sem processo" },
        { label: "Conteúdo disperso", hint: "Presença irregular nas redes" },
        { label: "Google sem gestão", hint: "Reputação construída no acaso" },
      ],
    },
    transformAfter: {
      outcome: "Referência local",
      items: [
        { label: "Posicionamento definido", hint: "Marca com direção clara no mercado" },
        { label: "Conteúdo recorrente", hint: "Presença consistente, não esporádica" },
        { label: "Corretores como canal", hint: "Time comercial alinhado à marca" },
        { label: "Reputação no Google", hint: "GMB e reviews como prova social" },
      ],
    },
    transformClosing:
      "Marca, conteúdo e reputação passam a trabalhar juntos, não como peças soltas.",
    faqs: [
      {
        question: "Brand core & posicionamento",
        answer:
          "Definimos o posicionamento da Nobre, o público-alvo e como a marca deveria se comunicar, a base para todo o resto do sistema de growth.",
      },
      {
        question: "Esteira de conteúdo",
        answer:
          "Criamos calendário editorial e fluxo de produção recorrente, transformando marketing de ação pontual em processo contínuo.",
      },
      {
        question: "Corretores como produtores",
        answer:
          "Capacitamos o time comercial para produzir conteúdo próprio, alinhado à marca, escalando presença sem depender só de uma agência externa.",
      },
      {
        question: "GMB, reviews e pós-venda",
        answer:
          "Trabalhamos Google Meu Negócio, respostas a avaliações, fotos, atualizações e cultura de pós-venda, consolidando reputação onde o cliente decide.",
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
