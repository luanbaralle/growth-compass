import {
  CalendarCheck,
  Globe,
  MousePointerClick,
  Phone,
  ScanSearch,
  Search,
  UserCheck,
  UserRound,
} from "lucide-react";
import type { SegmentConfig } from "./types";

/** Template base reutilizado por todas as verticais */
export const BASE_SEGMENT: Omit<
  SegmentConfig,
  "slug" | "name" | "hubLabel" | "icon" | "accentColor" | "accentSoft" | "seo"
> = {
  hero: {
    badge: "Especialistas em identificar oportunidades de aquisição para negócios locais",
    title: "Seu negócio deveria estar",
    titleHighlight: "capturando mais demanda local.",
    subtitle:
      "Todos os dias, pessoas da sua região pesquisam no Google por produtos e serviços que você já oferece. Se sua empresa não aparece nos primeiros resultados, essa demanda está indo para quem aparece.",
    ctaLabel: "Quero minha análise de mercado",
    trustItems: [
      "Sem compromisso",
      "Análise personalizada",
      "Retorno em até 24 horas",
      "Sem linguagem técnica",
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
      { label: "Pessoa procura serviço", icon: ScanSearch },
      { label: "Google mostra resultados", icon: Search },
      { label: "Cliente acessa uma empresa", icon: Globe },
      { label: "Analisa rapidamente", icon: MousePointerClick },
      { label: "Entra em contato", icon: Phone },
      { label: "Agenda atendimento", icon: CalendarCheck },
      { label: "Torna-se cliente", icon: UserCheck },
    ],
    instagramNote: "A maioria dos negócios tenta competir apenas no Instagram.",
    googleNote: "Mas a maioria dos clientes inicia sua jornada de compra no Google.",
  },

  ahaMoment: {
    eyebrow: "04 — O Insight",
    title: "A maioria acredita que precisa de",
    titleHighlight: "mais divulgação.",
    subtitle:
      "Mas muitas vezes o problema é apenas não aparecer no momento certo — quando a pessoa já está pronta para contratar.",
    winFlow: ["Pessoa pronta para contratar", "Pesquisa no Google", "Encontra você"],
    loseFlow: ["Pessoa pronta para contratar", "Pesquisa no Google", "Encontra concorrente"],
    winOutcome: "Você captura a oportunidade",
    loseOutcome: "A oportunidade vai embora",
  },

  demand: {
    eyebrow: "05 — A Oportunidade",
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
    eyebrow: "Como analisamos seu mercado",
    title: "Especialistas em",
    titleHighlight: "análise de aquisição local",
    checklist: [
      "Volume de buscas",
      "Concorrência local",
      "Oportunidades de aquisição",
      "Presença digital atual",
      "Intenção de compra",
      "Potencial de crescimento",
    ],
    cards: [
      {
        title: "Demanda Local",
        description: "Quem procura pelos seus serviços na sua região e com que frequência.",
      },
      {
        title: "Concorrência",
        description: "Quem está aparecendo hoje e capturando essa demanda.",
      },
      {
        title: "Presença Digital",
        description: "Como sua empresa está posicionada no momento da busca.",
      },
      {
        title: "Oportunidades",
        description: "Onde existem chances reais de crescimento na sua região.",
      },
    ],
    footerLine: "Você recebe um parecer simples e objetivo.",
    footerSub: "Sem linguagem técnica · Sem compromisso",
  },

  mission: {
    eyebrow: "06 — Nossa Missão",
    title: "Não somos uma agência.",
    titleHighlight: "Somos especialistas em aquisição local.",
    paragraphs: [
      "Muitas empresas excelentes deixam de crescer porque dependem exclusivamente de:",
      "Enquanto isso, pessoas interessadas continuam pesquisando seus serviços todos os dias no Google.",
      "Nosso papel é identificar onde está a demanda e mostrar como capturá-la.",
    ],
    dependencyTags: ["indicação", "Instagram", "boca a boca"],
    cardDescription:
      "Trabalhamos com empresas que querem entender, antes de qualquer investimento, o tamanho real da oportunidade na sua região.",
  },

  solutions: {
    eyebrow: "07 — Como Resolvemos",
    title: "Como normalmente",
    titleHighlight: "capturamos essa demanda",
    cards: [
      {
        tag: "01",
        title: "Presença na Busca",
        description: "Para aparecer quando alguém procura pelo serviço oferecido.",
      },
      {
        tag: "02",
        title: "Página de Conversão",
        description: "Uma página focada em transformar visitantes em contatos.",
      },
      {
        tag: "03",
        title: "Otimização Contínua",
        description: "Para melhorar continuamente a captura de oportunidades.",
      },
    ],
    footerLine: "Mas isso só faz sentido depois que entendemos a realidade do seu mercado.",
    footerHighlight: "Por isso a análise vem primeiro.",
  },

  form: {
    eyebrow: "Análise Gratuita",
    title: "Descubra quantas pessoas estão procurando",
    titleHighlight: "por você agora.",
    subtitle:
      "Receba uma análise personalizada da demanda na sua região — e entenda se você está aparecendo no momento certo.",
    submitLabel: "Quero minha análise de mercado",
    businessFieldLabel: "Empresa ou Segmento",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
    trustItems: [
      "Sem compromisso",
      "Análise personalizada",
      "Retorno em até 24 horas",
      "Sem linguagem técnica",
    ],
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
    ahaMoment: { ...BASE_SEGMENT.ahaMoment, ...overrides.ahaMoment },
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
