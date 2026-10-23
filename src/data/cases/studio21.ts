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
  subtitle: "Landing Page · Google Ads · Estratégia de Conversão · 6 meses.",
  client: "Studio 21 · Itanhaém",
  industry: "Beleza",
  category: "Beleza",
  year: 2026,
  website: "https://salaostudio21.com.br",
  coverImage: "/images/cases/placeholder-cover.jpg",
  heroImage: "/images/cases/placeholder-hero.jpg",
  description:
    "Como um salão premium no litoral paulista passou a captar demanda toda semana — seis meses transformando busca no Google em contatos no WhatsApp.",
  challenge:
    "O salão tinha reputação local, mas a aquisição dependia de fatores que não escalam.",
  solution:
    "Substituímos a dependência de indicações por um sistema que captura quem já está buscando.",
  goals: [
    "Indicação não gera previsibilidade de agenda.",
    "Instagram gera visibilidade, não demanda qualificada.",
    "Sem funil, cada mês começava do zero.",
  ],
  deliverables: ["Landing Page", "Google Ads", "Mensuração", "Copywriting"],
  technologies: [],
  gallery: [
    {
      src: "/images/cases/placeholder-gallery-1.jpg",
      alt: "Landing page Studio 21, página completa",
    },
  ],
  colors: [
    { name: "Obsidian", hex: "#0A0A0A" },
    { name: "Warm White", hex: "#F5F3EF" },
  ],
  typography: { heading: "Serif display", body: "Sans-serif" },
  metrics: [
    {
      value: "370+",
      label: "Conversões em 6 meses",
      context:
        "Contatos no WhatsApp originados de busca no Google, de abril a outubro. Demanda recorrente na região — sem depender de indicação ou picos no Instagram.",
    },
    {
      value: "4.900+",
      label: "Cliques qualificados",
      context:
        "Pessoas que clicaram no anúncio depois de buscar serviços específicos: corte, salão, mechas e mega hair. Intenção real, não impressão.",
    },
    {
      value: "6 meses",
      label: "Operação contínua",
      context:
        "Tempo para estruturar, lançar e amadurecer o funil. O sexto mês foi o de maior volume, com dezenas de novos contatos em uma única semana de alta demanda.",
    },
  ],
  nextProjects: [],
  process: [
    {
      phase: "01",
      title: "Diagnóstico",
      description:
        "Mapeamos quais serviços tinham busca ativa em Itanhaém, Mongaguá e Peruíbe — priorizando onde a intenção de agendar já existia.",
    },
    {
      phase: "02",
      title: "Google Ads",
      description:
        "Campanhas para interceptar quem pesquisa: do serviço do dia a dia aos procedimentos premium, no momento em que a decisão acontece.",
    },
    {
      phase: "03",
      title: "Landing Page",
      description:
        "Página construída para responder dúvidas antes do primeiro contato, reduzindo atrito na decisão.",
    },
    {
      phase: "04",
      title: "WhatsApp",
      description:
        "Canal direto entre intenção e agendamento, com mensuração contínua para ajustar o que gera contato de verdade.",
    },
  ],
  marketing: {
    positioning: "Vamos construir um sistema de aquisição para sua empresa?",
    conversionStrategy:
      "Projetos orientados por estratégia, mensuração e crescimento sustentável.",
    ctaPrimary: "Quero um sistema previsível de aquisição",
    ctaWhatsAppMessage:
      "Olá! Li o case do Studio 21 no site da Raise One e gostaria de entender se esse sistema de aquisição funciona para meu negócio.",
  },
  content: {
    problemIntro:
      "Antes do projeto, a aquisição dependia de reputação local e indicações espontâneas. O modelo gerava qualidade, mas não previsibilidade: sem saber quantos contatos viriam na semana seguinte, planejar equipe ou expandir serviços era sempre uma aposta.",
    problemChannels: ["Instagram", "Indicação", "Busca orgânica"],
    problemClosing:
      "Ter presença digital não significava ter um processo previsível de aquisição de clientes.",
    landingTitle:
      "A Landing Page responde às principais dúvidas antes do primeiro contato.",
    landingDescription:
      "Fotografia em destaque, hierarquia clara e copy orientada à confiança, para que quem chega via Google entenda o posicionamento do salão antes de abrir o WhatsApp.",
    landingScrollHint: "Explore a página completa",
    resultsIntro:
      "Números de seis meses de operação — de abril a outubro de 2026. O funil foi estruturado, lançado e otimizado ciclo a ciclo, até a demanda se tornar recorrente na região.",
    whyItWorkedTitle: "Como conseguimos",
    whyItWorkedIntro:
      "O resultado não veio de uma tática isolada. Veio da combinação abaixo, aplicada de forma consistente ao longo de seis meses.",
    whyItWorked: [
      {
        title: "Intenção de busca",
        description:
          "Priorizamos quem já pesquisa o serviço: salão, cabeleireiro, mechas e mega hair. A pessoa chega decidida a contratar, não a descobrir o salão por acaso.",
      },
      {
        title: "Dois tipos de demanda",
        description:
          "Cobertura do dia a dia e dos procedimentos de maior valor. Serviços gerais trazem volume; mechas e mega hair concentram quem busca um ticket mais alto — e convertem com mais força.",
      },
      {
        title: "Região certa",
        description:
          "Presença restrita a Itanhaém, Mongaguá e Peruíbe. Quem clica está a uma distância real de agendar — sem desperdício com quem mora longe demais para virar cliente.",
      },
      {
        title: "Landing Page focada em conversão",
        description:
          "Cada elemento da página existe para reduzir incerteza: o que o salão faz, como trabalha e por que vale a pena entrar em contato.",
      },
      {
        title: "Redução de atrito",
        description:
          "Do anúncio ao WhatsApp em dois toques, sem cadastro, sem espera e sem formulário que interrompe a intenção.",
      },
      {
        title: "Atendimento como etapa final",
        description:
          "O funil digital entrega a oportunidade. O agendamento depende de como o salão conduz a conversa — e isso foi considerado desde o primeiro ciclo.",
      },
    ],
    systemFlowIntro: "Da busca ao agendamento em seis etapas.",
    systemFlow: [
      { label: "Pessoa pesquisa", hint: "intenção ativa", kind: "demand" },
      { label: "Google Ads", hint: "captura na hora", kind: "system" },
      { label: "Landing Page", hint: "confiança antes do contato", kind: "system" },
      { label: "WhatsApp", hint: "contato direto", kind: "conversion" },
      { label: "Agendamento", hint: "intenção convertida", kind: "conversion" },
      { label: "Cliente", hint: "relação iniciada", kind: "conversion" },
    ],
    lessonsTitle: "O que aprendemos",
    lessonsIntro:
      "Seis meses de operação geram aprendizado acumulado. Estes são os insights que levamos para os próximos funis de aquisição.",
    lessonsLearned: [
      {
        title: "Procedimentos premium convertem melhor",
        description:
          "Mechas e mega hair geram menos cliques, mas uma proporção maior vira WhatsApp. O budget deve seguir a intenção — não só o volume de busca genérica.",
      },
      {
        title: "Público certo, no raio certo",
        description:
          "Mulheres de 35 a 54 anos, nas três cidades de atuação, buscando ativamente no Google. Quando região e perfil batem, o contato chega mais próximo de agendar.",
      },
      {
        title: "Continuidade libera o teto",
        description:
          "O melhor mês da operação coincidiu com mais presença nos dias de alta busca. Quando o salão aparece no momento em que a região pesquisa, o volume sobe — não é sorte, é consistência.",
      },
      {
        title: "A Landing Page prepara, não substitui",
        description:
          "Quem vem do Google compara rápido. A página comunica posicionamento nos primeiros segundos. Quem chega no WhatsApp já entende o nível do salão.",
      },
      {
        title: "Velocidade de resposta fecha o funil",
        description:
          "O gargalo mais comum após o clique não é a campanha: é o tempo até a primeira resposta no WhatsApp. Quem busca serviço de beleza decide rápido.",
      },
    ],
    transformIntro: "De reputação local a um processo que gera contatos toda semana.",
    transformBefore: {
      outcome: "Aquisição sem previsibilidade",
      items: [
        { label: "Indicações", hint: "Sem previsão de quantos contatos viriam" },
        { label: "Instagram", hint: "Presença, mas sem funil de conversão" },
        { label: "Busca orgânica", hint: "Visibilidade sem processo de captura" },
      ],
    },
    transformAfter: {
      outcome: "Operação com controle",
      items: [
        {
          label: "Demanda na intenção",
          hint: "Quem busca encontra o salão no momento certo",
        },
        {
          label: "Três cidades cobertas",
          hint: "Itanhaém, Mongaguá e Peruíbe no mesmo sistema",
        },
        {
          label: "Volume mensurável",
          hint: "370+ conversões em seis meses de operação",
        },
        {
          label: "Canal maduro",
          hint: "O sexto mês foi o de maior volume da operação",
        },
      ],
    },
    transformClosing:
      "O funil não substitui o atendimento. Dá previsibilidade para o salão crescer com controle.",
    agencyDeliverables: [
      {
        label: "Estratégia digital",
        hint: "Priorização de canais e serviços",
      },
      {
        label: "Landing Page",
        hint: "Conversão e confiança antes do contato",
      },
      {
        label: "Google Ads",
        hint: "Captura de intenção na região",
      },
      {
        label: "Copywriting",
        hint: "Tom alinhado ao posicionamento premium",
      },
      {
        label: "Mensuração",
        hint: "Origem, conversão e qualidade do contato",
      },
      {
        label: "Otimizações contínuas",
        hint: "Ajustes com base em seis meses de dados reais",
      },
    ],
    deliverablesIntro:
      "O que a Raise One estruturou neste projeto. Cada peça com função no funil, não entrega isolada.",
  },
  heroExtended: {
    caseNumber: "02",
    caseVertical: "Beleza",
    background: "ambient",
    headlineLines: [
      "Transformando pesquisas no Google",
      "em oportunidades reais",
      "para um salão de beleza.",
    ],
    heroMetrics: [
      { value: "370+", label: "Conversões" },
      { value: "4.900+", label: "Cliques qualificados" },
      { value: "6 meses", label: "Período" },
    ],
    ctaLabel: "Quero um sistema previsível de aquisição",
    ctaHref: "/diagnostico",
    metaSheet: {
      client: ["Studio 21"],
      segment: "Beleza · Salão Premium",
      services: ["Landing Page", "Google Ads", "Estratégia"],
      period: "6 meses",
    },
  },
};
