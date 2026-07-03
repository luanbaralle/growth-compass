import {
  CalendarCheck,
  Globe,
  MessageSquare,
  MousePointerClick,
  ScanSearch,
  Search,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { createSegmentConfig } from "./base";

export const esteticaSegment = createSegmentConfig({
  slug: "estetica",
  name: "Estética",
  hubLabel: "Estética / Beleza",
  icon: Sparkles,
  accentColor: "oklch(0.68 0.18 10)",
  accentSoft: "oklch(0.68 0.18 10 / 0.12)",

  seo: {
    title: "Raise One — Sua clínica de estética merece ser encontrada",
    description:
      "Diagnóstico gratuito para clínicas de estética. Descubra quantos clientes em potencial estão indo para a concorrência todos os dias na sua região.",
    ogTitle: "Raise One — Especialistas em crescimento para negócios locais",
    ogDescription:
      "Todos os dias pessoas pesquisam por procedimentos estéticos no Google. Sua clínica está aparecendo? Solicite seu diagnóstico gratuito.",
  },

  hero: {
    badge: "Especialistas em identificar oportunidades de aquisição para negócios locais",
    title: "Sua clínica de estética deveria estar",
    titleHighlight: "capturando mais demanda local.",
    subtitle:
      "Todos os dias, pessoas da sua região pesquisam no Google por procedimentos estéticos que você já oferece. Se sua clínica não aparece nos primeiros resultados, essa demanda está indo para quem aparece.",
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
    title: "A maioria das clínicas não tem problema de qualidade.",
    titleMuted: "Tem problema de visibilidade.",
    qualities: [
      "excelente atendimento",
      "profissionais qualificados",
      "boa estrutura",
      "pacientes satisfeitos",
    ],
    closingLine: "Mas nada disso importa para quem nunca encontrou sua clínica.",
    searchExamples: [
      "Botox",
      "Harmonização Facial",
      "Limpeza de Pele",
      "Preenchimento Labial",
      "Depilação a Laser",
    ],
    ctaQuestion: "Quando elas pesquisam, sua clínica aparece?",
    businessType: "clínica",
  },

  invisibleClient: {
    eyebrow: "02 — A Realidade",
    title: "O cliente que você não vê",
    titleHighlight: "também tem valor.",
    searchQuery: "botox santos",
    paragraphs: [
      "Ela não está navegando por curiosidade.",
      "Ela já decidiu que quer resolver um problema.",
      "Ela está escolhendo quem vai atender.",
    ],
    closingLine:
      "Se sua concorrente aparece antes de você, existe uma grande chance de que esse contato nunca chegue até sua clínica.",
  },

  journey: {
    eyebrow: "03 — A Jornada",
    title: "Como novas clientes",
    titleHighlight: "encontram clínicas estéticas no Google",
    steps: [
      { label: "Pessoa busca procedimento estético", icon: ScanSearch },
      { label: "Pesquisa no Google", icon: Search },
      { label: "Google mostra clínicas", icon: Globe },
      { label: "Analisa resultados e avaliações", icon: MousePointerClick },
      { label: "Entra em contato", icon: MessageSquare },
      { label: "Agenda avaliação", icon: CalendarCheck },
      { label: "Torna-se paciente", icon: UserCheck },
    ],
    instagramNote: "A maioria das clínicas tenta competir apenas no Instagram.",
    googleNote: "Mas a maioria das clientes inicia sua jornada de compra no Google.",
  },

  ahaMoment: {
    eyebrow: "04 — O Insight",
    title: "A maioria acredita que precisa de",
    titleHighlight: "mais divulgação.",
    subtitle:
      "Mas muitas vezes o problema é apenas não aparecer no momento certo — quando a cliente já está pronta para agendar.",
    winFlow: ["Cliente pronta para agendar", "Pesquisa procedimento", "Encontra sua clínica"],
    loseFlow: ["Cliente pronta para agendar", "Pesquisa procedimento", "Encontra concorrente"],
    winOutcome: "Você captura a oportunidade",
    loseOutcome: "A oportunidade vai embora",
  },

  demand: {
    eyebrow: "05 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Imagine que existam centenas ou milhares de pesquisas mensais relacionadas aos procedimentos que sua clínica oferece.",
      "Agora imagine que boa parte dessas pessoas nunca encontra sua empresa.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
    bars: [
      { label: "Botox", value: 92 },
      { label: "Harmonização", value: 78 },
      { label: "Limpeza de Pele", value: 64 },
      { label: "Preenchimento", value: 51 },
      { label: "Depilação a Laser", value: 43 },
    ],
    totalSearches: "+2.847",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
  },

  fomo: {
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, clínicas da sua região estão aparecendo exatamente quando clientes procuram pelos mesmos serviços que você oferece.",
    searchQuery: "botox santos",
    competitors: [
      {
        name: "Clínica Estética Santos — Harmonização & Botox",
        isAd: true,
        url: "https://www.clinicaesteticasantos.com.br",
        snippet: "Procedimentos estéticos com profissionais certificados. Avaliação gratuita disponível.",
      },
      {
        name: "Harmonize Face — Centro de Estética",
        isAd: true,
        url: "https://www.harmonizeface.com.br",
        snippet: "Harmonização facial, botox e preenchimento. Agende sua consulta online.",
      },
      {
        name: "Studio Beleza Premium",
        isAd: false,
        url: "https://www.studiobelezapremium.com.br",
        snippet: "Referência em estética avançada na região. Veja avaliações e procedimentos.",
      },
    ],
    yourBusinessLabel: "Sua clínica",
    notFoundLabel: "não aparece",
  },

  form: {
    eyebrow: "Análise Gratuita",
    title: "Descubra quantas pessoas estão procurando",
    titleHighlight: "procedimentos estéticos na sua região.",
    subtitle:
      "Receba uma análise personalizada da demanda local — e entenda se sua clínica está aparecendo no momento certo.",
    submitLabel: "Quero minha análise de mercado",
    businessFieldLabel: "Clínica ou Segmento",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
    trustItems: [
      "Sem compromisso",
      "Análise personalizada",
      "Retorno em até 24 horas",
      "Sem linguagem técnica",
    ],
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
      "Trabalhamos com clínicas que querem entender, antes de qualquer investimento, o tamanho real da oportunidade na sua região.",
  },
});
