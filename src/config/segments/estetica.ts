import { Sparkles } from "lucide-react";
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
    badge: "Especialistas em crescimento para negócios locais",
    title: "Sua clínica de estética deveria estar",
    titleHighlight: "recebendo mais contatos.",
    subtitle:
      "Todos os dias, pessoas da sua região pesquisam no Google por procedimentos estéticos que você já oferece. Se sua clínica não aparece nos primeiros resultados, esses contatos estão indo para outra clínica.",
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
    title: "Como novos pacientes",
    titleHighlight: "encontram clínicas no Google",
    steps: [
      "Pessoa procura procedimento",
      "Google mostra resultados",
      "Paciente acessa uma clínica",
      "Analisa rapidamente",
      "Entra em contato",
      "Agenda avaliação",
      "Torna-se paciente",
    ],
    instagramNote: "A maioria das clínicas tenta competir apenas no Instagram.",
    googleNote: "Mas a maioria dos clientes inicia sua jornada de compra no Google.",
  },

  demand: {
    eyebrow: "04 — A Oportunidade",
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
      { name: "Clínica Estética Santos", isAd: true },
      { name: "Harmonize Face", isAd: true },
      { name: "Studio Beleza Premium", isAd: true },
    ],
    yourBusinessLabel: "Sua clínica",
    notFoundLabel: "não aparece",
  },

  form: {
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades sua clínica está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais clientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    businessFieldLabel: "Clínica ou Segmento",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
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
