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
  subtitle: "Landing Page · Google Ads · Estratégia de Conversão · 3 meses.",
  client: "Studio 21 · Itanhaém",
  industry: "Beleza",
  category: "Beleza",
  year: 2026,
  website: "https://salaostudio21.com.br",
  coverImage: "/images/cases/placeholder-cover.jpg",
  heroImage: "/images/cases/placeholder-hero.jpg",
  description:
    "Como estruturamos um funil digital para transformar intenção de busca em novos atendimentos para um salão premium.",
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
      value: "180+",
      label: "Conversões em 3 meses",
      context:
        "Contatos qualificados via WhatsApp, originados de busca no Google. Demanda recorrente ao longo dos 90 dias, com mais de 180 oportunidades no trimestre, sem depender de indicação ou picos no Instagram.",
    },
    {
      value: "2.500+",
      label: "Cliques qualificados",
      context:
        "Pessoas que clicaram no anúncio após buscar serviços específicos, sinal de intenção real, não apenas impressão.",
    },
    {
      value: "90 dias",
      label: "Período validado",
      context:
        "Tempo necessário para estruturar, lançar e otimizar o funil, do diagnóstico inicial aos primeiros resultados consistentes.",
    },
  ],
  nextProjects: [],
  process: [
    {
      phase: "01",
      title: "Diagnóstico",
      description:
        "Mapeamos quais serviços tinham busca ativa na região, priorizando onde a intenção de compra já existia.",
    },
    {
      phase: "02",
      title: "Google Ads",
      description:
        "Campanhas estruturadas para interceptar quem pesquisa, não para interromper quem navega.",
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
        "Canal direto entre intenção e agendamento, sem formulários longos nem etapas desnecessárias.",
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
      "Números do primeiro ciclo de operação, período em que o funil foi estruturado, lançado e otimizado.",
    whyItWorkedTitle: "Como conseguimos",
    whyItWorkedIntro:
      "O resultado não veio de uma táctica isolada. Veio da combinação de fatores abaixo, aplicados de forma consistente durante os 90 dias.",
    whyItWorked: [
      {
        title: "Intenção de busca",
        description:
          "Priorizamos serviços com demanda ativa no Google, como Mega Hair, mechas e tratamentos premium, onde a pessoa já decidiu que quer contratar.",
      },
      {
        title: "Segmentação correta",
        description:
          "Campanhas restritas à região de atuação e aos termos com intenção comercial, evitando cliques curiosos que não convertem.",
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
        title: "Velocidade no WhatsApp",
        description:
          "Quem busca serviço de beleza decide rápido. Resposta ágil no canal certo aumenta a chance de agendar antes da concorrência.",
      },
      {
        title: "Atendimento como etapa final",
        description:
          "O funil digital entrega a oportunidade. O agendamento depende de como o salão conduz a conversa, e isso foi considerado desde o início.",
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
      "Projetos reais geram aprendizado acumulado. Estes são os insights que levamos para os próximos funis de aquisição.",
    lessonsLearned: [
      {
        title: "Serviços com maior intenção",
        description:
          "Procedimentos premium e de maior ticket tinham busca mais qualificada do que serviços genéricos. O budget deve seguir a intenção, não o volume.",
      },
      {
        title: "Comportamento do usuário",
        description:
          "Quem vem do Google compara rápido. A Landing Page precisa comunicar posicionamento nos primeiros segundos, antes de qualquer scroll.",
      },
      {
        title: "Papel da Landing Page",
        description:
          "A página não substitui o atendimento. Ela filtra e prepara. Quem chega no WhatsApp já entende o nível do salão.",
      },
      {
        title: "Velocidade de resposta",
        description:
          "O gargalo mais comum após o clique não é a campanha: é o tempo até a primeira resposta no WhatsApp.",
      },
      {
        title: "Mensuração contínua",
        description:
          "Sem acompanhar termos de busca, conversões e origem dos contatos, otimização vira achismo. Dados orientaram cada ajuste.",
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
          label: "Origem rastreada",
          hint: "Cada contato com canal e campanha identificados",
        },
        {
          label: "Volume mensurável",
          hint: "180+ conversões no primeiro ciclo",
        },
        {
          label: "Planejamento",
          hint: "Equipe e investimento com base em dados, não achismo",
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
        hint: "Origem, conversão e custo por contato",
      },
      {
        label: "Otimizações contínuas",
        hint: "Ajustes com base em dados reais",
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
