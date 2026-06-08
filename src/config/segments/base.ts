import type { SegmentConfig } from "./types";

/** Template base reutilizado por todas as verticais */
export const BASE_SEGMENT: Omit<
  SegmentConfig,
  "slug" | "name" | "hubLabel" | "icon" | "accentColor" | "accentSoft" | "seo"
> = {
  hero: {
    badge: "Especialistas em crescimento para negócios locais",
    title: "Seu negócio deveria estar",
    titleHighlight: "recebendo mais clientes.",
    subtitle:
      "Todos os dias, pessoas da sua região pesquisam no Google por produtos e serviços que você já oferece. Se sua empresa não aparece nos primeiros resultados, esses contatos estão indo para a concorrência.",
    ctaLabel: "Quero analisar meu mercado",
    trustItems: [
      "Sem compromisso",
      "Sem contrato",
      "Análise personalizada da sua região",
      "Retorno em até 24 horas",
    ],
    monthlySearches: "+2.400",
  },

  visibility: {
    eyebrow: "01 — O Problema",
    title: "A maioria dos negócios não tem problema de qualidade.",
    titleMuted: "Tem problema de visibilidade.",
    qualities: [
      "excelente atendimento",
      "profissionais qualificados",
      "boa estrutura",
      "clientes satisfeitos",
    ],
    closingLine: "Mas nada disso importa para quem nunca encontrou sua empresa.",
    searchExamples: [],
    ctaQuestion: "Quando elas pesquisam, sua empresa aparece?",
    businessType: "empresa",
  },

  invisibleClient: {
    eyebrow: "02 — A Realidade",
    title: "O cliente que você não vê",
    titleHighlight: "também tem valor.",
    searchQuery: "",
    paragraphs: [
      "Ela não está navegando por curiosidade.",
      "Ela já decidiu que quer resolver um problema.",
      "Ela está escolhendo quem vai atender.",
    ],
    closingLine:
      "Se sua concorrente aparece antes de você, existe uma grande chance de que esse contato nunca chegue até sua empresa.",
  },

  journey: {
    eyebrow: "03 — A Jornada",
    title: "Como novos clientes",
    titleHighlight: "encontram negócios no Google",
    steps: [
      "Pessoa procura serviço",
      "Google mostra resultados",
      "Cliente acessa uma empresa",
      "Analisa rapidamente",
      "Entra em contato",
      "Agenda atendimento",
      "Torna-se cliente",
    ],
    instagramNote: "A maioria dos negócios tenta competir apenas no Instagram.",
    googleNote: "Mas a maioria dos clientes inicia sua jornada de compra no Google.",
  },

  demand: {
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Imagine que existam centenas ou milhares de pesquisas mensais relacionadas aos serviços que sua empresa oferece.",
      "Agora imagine que boa parte dessas pessoas nunca encontra sua empresa.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
    bars: [],
    totalSearches: "+2.847",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
  },

  fomo: {
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, empresas da sua região estão aparecendo exatamente quando clientes procuram pelos mesmos serviços que você oferece.",
    searchQuery: "",
    competitors: [
      { name: "Concorrente A", isAd: true },
      { name: "Concorrente B", isAd: true },
      { name: "Concorrente C", isAd: true },
    ],
    yourBusinessLabel: "Sua empresa",
    notFoundLabel: "não aparece",
  },

  missedOpportunity: {
    title: "O problema não é apenas os clientes que você perde.",
    subtitle: "É os que você nem sabe que perdeu.",
    flowSteps: [
      "Pessoa pesquisa",
      "Concorrente aparece",
      "Recebe clique",
      "Recebe contato",
      "Recebe cliente",
      "Recebe faturamento",
    ],
    sideTitle: "Você não apareceu.",
    sideLines: ["Você nunca soube que essa oportunidade existiu."],
  },

  analysis: {
    eyebrow: "05 — Diagnóstico",
    title: "O que analisamos",
    titleHighlight: "gratuitamente",
    cards: [
      {
        title: "Mercado Local",
        description: "Quem procura pelos seus serviços na sua região.",
      },
      {
        title: "Concorrência",
        description: "Quem está aparecendo hoje.",
      },
      {
        title: "Presença Digital",
        description: "Como sua empresa está posicionada atualmente.",
      },
      {
        title: "Oportunidades",
        description: "Onde existem chances reais de captar novos clientes.",
      },
    ],
    footerLine: "Você recebe um parecer simples e objetivo.",
    footerSub: "Sem linguagem técnica · Sem compromisso",
  },

  mission: {
    eyebrow: "06 — Nossa Missão",
    title: "Nosso trabalho não é vender anúncios.",
    titleHighlight: "É ajudar negócios locais a serem encontrados.",
    paragraphs: [
      "Muitas empresas excelentes deixam de crescer porque dependem exclusivamente de:",
      "Enquanto isso, pessoas interessadas continuam pesquisando seus serviços todos os dias no Google.",
      "Nosso papel é mostrar onde estão essas oportunidades e como captá-las.",
    ],
    dependencyTags: ["indicação", "Instagram", "boca a boca"],
    cardDescription:
      "Trabalhamos com empresas que querem entender, antes de qualquer investimento, o tamanho real da oportunidade na sua região.",
  },

  solutions: {
    eyebrow: "07 — Como Resolvemos",
    title: "Como normalmente",
    titleHighlight: "resolvemos esse problema",
    cards: [
      {
        tag: "01",
        title: "Página de Conversão",
        description: "Uma página focada em transformar visitantes em contatos.",
      },
      {
        tag: "02",
        title: "Posicionamento no Google",
        description: "Para aparecer quando alguém procura pelo serviço oferecido.",
      },
      {
        tag: "03",
        title: "Gestão e Otimização",
        description: "Para melhorar continuamente os resultados.",
      },
    ],
    footerLine: "Mas isso só faz sentido depois que entendemos a realidade do seu mercado.",
    footerHighlight: "Por isso o diagnóstico vem primeiro.",
  },

  form: {
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades sua empresa está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais clientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    businessFieldLabel: "Empresa ou Segmento",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
};

export function createSegmentConfig(
  overrides: Partial<SegmentConfig> &
    Pick<
      SegmentConfig,
      "slug" | "name" | "hubLabel" | "icon" | "accentColor" | "accentSoft" | "seo"
    >,
): SegmentConfig {
  return {
    ...BASE_SEGMENT,
    ...overrides,
    hero: { ...BASE_SEGMENT.hero, ...overrides.hero },
    visibility: { ...BASE_SEGMENT.visibility, ...overrides.visibility },
    invisibleClient: {
      ...BASE_SEGMENT.invisibleClient,
      ...overrides.invisibleClient,
    },
    journey: { ...BASE_SEGMENT.journey, ...overrides.journey },
    demand: { ...BASE_SEGMENT.demand, ...overrides.demand },
    fomo: { ...BASE_SEGMENT.fomo, ...overrides.fomo },
    missedOpportunity: {
      ...BASE_SEGMENT.missedOpportunity,
      ...overrides.missedOpportunity,
    },
    analysis: { ...BASE_SEGMENT.analysis, ...overrides.analysis },
    mission: { ...BASE_SEGMENT.mission, ...overrides.mission },
    solutions: { ...BASE_SEGMENT.solutions, ...overrides.solutions },
    form: { ...BASE_SEGMENT.form, ...overrides.form },
  };
}
