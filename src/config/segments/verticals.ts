import {
  Stethoscope,
  Smile,
  Scale,
  Building2,
  Calculator,
  Sun,
  Hammer,
  Wrench,
  HelpCircle,
} from "lucide-react";
import { createSegmentConfig } from "./base";

const sharedCompetitors = [
  { name: "Concorrente A", isAd: true },
  { name: "Concorrente B", isAd: true },
  { name: "Concorrente C", isAd: true },
];

export const clinicaSegment = createSegmentConfig({
  slug: "clinica",
  name: "Clínica",
  hubLabel: "Clínica / Saúde",
  icon: Stethoscope,
  accentColor: "oklch(0.62 0.14 200)",
  accentSoft: "oklch(0.62 0.14 200 / 0.12)",
  seo: {
    title: "Raise One — Sua clínica deveria estar recebendo mais pacientes",
    description:
      "Diagnóstico gratuito para clínicas e consultórios. Descubra quantos pacientes em potencial estão indo para a concorrência na sua região.",
  },
  hero: {
    title: "Sua clínica deveria estar",
    titleHighlight: "recebendo mais pacientes.",
    subtitle:
      "Todos os dias, pessoas da sua região pesquisam no Google por consultas e tratamentos que você já oferece. Se sua clínica não aparece, esses pacientes estão indo para outro lugar.",
    ctaLabel: "Quero analisar meu mercado",
    badge: "Especialistas em crescimento para negócios locais",
    trustItems: [
      "Sem compromisso",
      "Sem contrato",
      "Análise personalizada da sua região",
      "Retorno em até 24 horas",
    ],
    monthlySearches: "+1.800",
  },
  visibility: {
    searchExamples: [
      "Consulta médica",
      "Exames laboratoriais",
      "Check-up completo",
      "Clínica geral",
      "Especialista perto de mim",
    ],
    ctaQuestion: "Quando pesquisam, sua clínica aparece?",
    businessType: "clínica",
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
  },
  invisibleClient: { searchQuery: "clínica médica perto de mim" },
  demand: {
    bars: [
      { label: "Consultas", value: 88 },
      { label: "Exames", value: 72 },
      { label: "Check-up", value: 58 },
      { label: "Especialistas", value: 45 },
    ],
    totalSearches: "+1.920",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Imagine centenas de pesquisas mensais por consultas e exames na sua região.",
      "Agora imagine que boa parte desses pacientes nunca encontra sua clínica.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
  },
  fomo: {
    searchQuery: "clínica médica",
    competitors: sharedCompetitors,
    yourBusinessLabel: "Sua clínica",
    notFoundLabel: "não aparece",
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, clínicas da sua região estão aparecendo quando pacientes procuram pelos mesmos serviços que você oferece.",
  },
  form: {
    businessFieldLabel: "Clínica ou Especialidade",
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades sua clínica está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais pacientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
});

export const dentistaSegment = createSegmentConfig({
  slug: "dentista",
  name: "Dentista",
  hubLabel: "Dentista",
  icon: Smile,
  accentColor: "oklch(0.62 0.15 240)",
  accentSoft: "oklch(0.62 0.15 240 / 0.12)",
  seo: {
    title: "Raise One — Seu consultório deveria estar recebendo mais pacientes",
    description:
      "Diagnóstico gratuito para dentistas e clínicas odontológicas. Descubra quantos pacientes em potencial estão indo para a concorrência.",
  },
  hero: {
    title: "Seu consultório deveria estar",
    titleHighlight: "recebendo mais pacientes.",
    subtitle:
      "Todos os dias, pessoas da sua região pesquisam no Google por tratamentos odontológicos que você já oferece. Se você não aparece, esses pacientes vão para outro dentista.",
    ctaLabel: "Quero analisar meu mercado",
    badge: "Especialistas em crescimento para negócios locais",
    trustItems: [
      "Sem compromisso",
      "Sem contrato",
      "Análise personalizada da sua região",
      "Retorno em até 24 horas",
    ],
    monthlySearches: "+1.600",
  },
  visibility: {
    searchExamples: [
      "Implante dentário",
      "Clareamento dental",
      "Ortodontia",
      "Dentista perto de mim",
      "Limpeza dental",
    ],
    ctaQuestion: "Quando pesquisam, seu consultório aparece?",
    businessType: "consultório",
    eyebrow: "01 — O Problema",
    title: "A maioria dos consultórios não tem problema de qualidade.",
    titleMuted: "Tem problema de visibilidade.",
    qualities: [
      "excelente atendimento",
      "profissionais qualificados",
      "estrutura moderna",
      "pacientes satisfeitos",
    ],
    closingLine: "Mas nada disso importa para quem nunca encontrou seu consultório.",
  },
  invisibleClient: { searchQuery: "implante dentário" },
  demand: {
    bars: [
      { label: "Implantes", value: 85 },
      { label: "Clareamento", value: 70 },
      { label: "Ortodontia", value: 62 },
      { label: "Limpeza", value: 48 },
    ],
    totalSearches: "+1.540",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Centenas de pesquisas mensais por tratamentos odontológicos na sua região.",
      "Boa parte desses pacientes nunca encontra seu consultório.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
  },
  fomo: {
    searchQuery: "dentista",
    competitors: sharedCompetitors,
    yourBusinessLabel: "Seu consultório",
    notFoundLabel: "não aparece",
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, consultórios da sua região estão aparecendo quando pacientes procuram pelos mesmos serviços que você oferece.",
  },
  form: {
    businessFieldLabel: "Consultório ou Especialidade",
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades seu consultório está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais pacientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
});

export const advogadoSegment = createSegmentConfig({
  slug: "advogado",
  name: "Advocacia",
  hubLabel: "Advocacia",
  icon: Scale,
  accentColor: "oklch(0.72 0.12 85)",
  accentSoft: "oklch(0.72 0.12 85 / 0.12)",
  seo: {
    title: "Raise One — Seu escritório deveria estar recebendo mais clientes",
    description:
      "Diagnóstico gratuito para advogados e escritórios jurídicos. Descubra quantos clientes em potencial estão indo para a concorrência.",
  },
  hero: {
    title: "Seu escritório deveria estar",
    titleHighlight: "recebendo mais clientes.",
    subtitle:
      "Todos os dias, pessoas da sua região pesquisam no Google por advogados especializados. Se você não aparece, esses clientes contratam a concorrência.",
    ctaLabel: "Quero analisar meu mercado",
    badge: "Especialistas em crescimento para negócios locais",
    trustItems: [
      "Sem compromisso",
      "Sem contrato",
      "Análise personalizada da sua região",
      "Retorno em até 24 horas",
    ],
    monthlySearches: "+980",
  },
  visibility: {
    searchExamples: [
      "Advogado trabalhista",
      "Advogado criminalista",
      "Divórcio consensual",
      "Inventário",
      "Advogado perto de mim",
    ],
    ctaQuestion: "Quando pesquisam, seu escritório aparece?",
    businessType: "escritório",
    eyebrow: "01 — O Problema",
    title: "A maioria dos escritórios não tem problema de qualidade.",
    titleMuted: "Tem problema de visibilidade.",
    qualities: [
      "excelente atendimento",
      "advogados experientes",
      "resultados comprovados",
      "clientes satisfeitos",
    ],
    closingLine: "Mas nada disso importa para quem nunca encontrou seu escritório.",
  },
  invisibleClient: { searchQuery: "advogado trabalhista" },
  demand: {
    bars: [
      { label: "Trabalhista", value: 82 },
      { label: "Família", value: 68 },
      { label: "Criminal", value: 55 },
      { label: "Cível", value: 42 },
    ],
    totalSearches: "+980",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Pessoas buscam advogados todos os dias na sua região.",
      "Muitos nunca encontram seu escritório.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
  },
  fomo: {
    searchQuery: "advogado",
    competitors: sharedCompetitors,
    yourBusinessLabel: "Seu escritório",
    notFoundLabel: "não aparece",
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, escritórios da sua região estão aparecendo quando clientes procuram pelos mesmos serviços que você oferece.",
  },
  form: {
    businessFieldLabel: "Escritório ou Área de Atuação",
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades seu escritório está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais clientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
});

export const imobiliariaSegment = createSegmentConfig({
  slug: "imobiliaria",
  name: "Imobiliária",
  hubLabel: "Imobiliária",
  icon: Building2,
  accentColor: "oklch(0.65 0.14 145)",
  accentSoft: "oklch(0.65 0.14 145 / 0.12)",
  seo: {
    title: "Raise One — Sua imobiliária deveria estar recebendo mais leads",
    description:
      "Diagnóstico gratuito para imobiliárias. Descubra quantos compradores e locatários em potencial estão indo para a concorrência.",
  },
  hero: {
    title: "Sua imobiliária deveria estar",
    titleHighlight: "recebendo mais leads.",
    subtitle:
      "Todos os dias, pessoas da sua região pesquisam no Google por imóveis e corretores. Se você não aparece, esses leads vão para outra imobiliária.",
    ctaLabel: "Quero analisar meu mercado",
    badge: "Especialistas em crescimento para negócios locais",
    trustItems: [
      "Sem compromisso",
      "Sem contrato",
      "Análise personalizada da sua região",
      "Retorno em até 24 horas",
    ],
    monthlySearches: "+2.100",
  },
  visibility: {
    searchExamples: [
      "Apartamento à venda",
      "Aluguel de casas",
      "Imobiliária perto de mim",
      "Corretor de imóveis",
      "Lançamentos",
    ],
    ctaQuestion: "Quando pesquisam, sua imobiliária aparece?",
    businessType: "imobiliária",
    eyebrow: "01 — O Problema",
    title: "A maioria das imobiliárias não tem problema de qualidade.",
    titleMuted: "Tem problema de visibilidade.",
    qualities: [
      "portfólio amplo",
      "corretores experientes",
      "atendimento personalizado",
      "clientes satisfeitos",
    ],
    closingLine: "Mas nada disso importa para quem nunca encontrou sua imobiliária.",
  },
  invisibleClient: { searchQuery: "apartamento à venda" },
  demand: {
    bars: [
      { label: "Venda", value: 90 },
      { label: "Aluguel", value: 75 },
      { label: "Lançamentos", value: 58 },
      { label: "Comercial", value: 40 },
    ],
    totalSearches: "+2.100",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Milhares de pesquisas por imóveis na sua região todos os meses.",
      "Muitos compradores nunca encontram sua imobiliária.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
  },
  fomo: {
    searchQuery: "imobiliária",
    competitors: sharedCompetitors,
    yourBusinessLabel: "Sua imobiliária",
    notFoundLabel: "não aparece",
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, imobiliárias da sua região estão aparecendo quando clientes procuram pelos mesmos serviços que você oferece.",
  },
  form: {
    businessFieldLabel: "Imobiliária ou Segmento",
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades sua imobiliária está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais clientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
});

export const contabilidadeSegment = createSegmentConfig({
  slug: "contabilidade",
  name: "Contabilidade",
  hubLabel: "Contabilidade",
  icon: Calculator,
  accentColor: "oklch(0.68 0.1 180)",
  accentSoft: "oklch(0.68 0.1 180 / 0.12)",
  seo: {
    title: "Raise One — Seu escritório contábil deveria estar recebendo mais clientes",
    description:
      "Diagnóstico gratuito para contadores e escritórios contábeis. Descubra quantos empresários em potencial estão indo para a concorrência.",
  },
  hero: {
    title: "Seu escritório contábil deveria estar",
    titleHighlight: "recebendo mais clientes.",
    subtitle:
      "Empresários da sua região pesquisam no Google por contadores e serviços contábeis. Se você não aparece, esses clientes contratam outro escritório.",
    ctaLabel: "Quero analisar meu mercado",
    badge: "Especialistas em crescimento para negócios locais",
    trustItems: [
      "Sem compromisso",
      "Sem contrato",
      "Análise personalizada da sua região",
      "Retorno em até 24 horas",
    ],
    monthlySearches: "+720",
  },
  visibility: {
    searchExamples: [
      "Contador MEI",
      "Abertura de empresa",
      "Escritório contábil",
      "Contabilidade online",
      "Contador perto de mim",
    ],
    ctaQuestion: "Quando pesquisam, seu escritório aparece?",
    businessType: "escritório",
    eyebrow: "01 — O Problema",
    title: "A maioria dos escritórios não tem problema de qualidade.",
    titleMuted: "Tem problema de visibilidade.",
    qualities: [
      "equipe qualificada",
      "atendimento ágil",
      "conformidade fiscal",
      "clientes satisfeitos",
    ],
    closingLine: "Mas nada disso importa para quem nunca encontrou seu escritório.",
  },
  invisibleClient: { searchQuery: "contador MEI" },
  demand: {
    bars: [
      { label: "MEI", value: 78 },
      { label: "Abertura", value: 65 },
      { label: "Fiscal", value: 52 },
      { label: "Folha", value: 38 },
    ],
    totalSearches: "+720",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Empresários buscam contadores todos os dias na sua região.",
      "Muitos nunca encontram seu escritório.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
  },
  fomo: {
    searchQuery: "contador",
    competitors: sharedCompetitors,
    yourBusinessLabel: "Seu escritório",
    notFoundLabel: "não aparece",
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, escritórios da sua região estão aparecendo quando empresários procuram pelos mesmos serviços que você oferece.",
  },
  form: {
    businessFieldLabel: "Escritório ou Especialidade",
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades seu escritório está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais clientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
});

export const energiaSolarSegment = createSegmentConfig({
  slug: "energia-solar",
  name: "Energia Solar",
  hubLabel: "Energia Solar",
  icon: Sun,
  accentColor: "oklch(0.78 0.16 85)",
  accentSoft: "oklch(0.78 0.16 85 / 0.12)",
  seo: {
    title: "Raise One — Sua empresa solar deveria estar recebendo mais clientes",
    description:
      "Diagnóstico gratuito para empresas de energia solar. Descubra quantos clientes em potencial estão indo para a concorrência.",
  },
  hero: {
    title: "Sua empresa de energia solar deveria estar",
    titleHighlight: "recebendo mais clientes.",
    subtitle:
      "Proprietários da sua região pesquisam no Google por energia solar e instalação de painéis. Se você não aparece, esses clientes fecham com a concorrência.",
    ctaLabel: "Quero analisar meu mercado",
    badge: "Especialistas em crescimento para negócios locais",
    trustItems: [
      "Sem compromisso",
      "Sem contrato",
      "Análise personalizada da sua região",
      "Retorno em até 24 horas",
    ],
    monthlySearches: "+1.200",
  },
  visibility: {
    searchExamples: [
      "Energia solar residencial",
      "Painel solar preço",
      "Instalação fotovoltaica",
      "Energia solar empresarial",
      "Financiamento solar",
    ],
    ctaQuestion: "Quando pesquisam, sua empresa aparece?",
    businessType: "empresa",
    eyebrow: "01 — O Problema",
    title: "A maioria das empresas não tem problema de qualidade.",
    titleMuted: "Tem problema de visibilidade.",
    qualities: [
      "equipe técnica qualificada",
      "projetos bem executados",
      "suporte pós-venda",
      "clientes satisfeitos",
    ],
    closingLine: "Mas nada disso importa para quem nunca encontrou sua empresa.",
  },
  invisibleClient: { searchQuery: "energia solar residencial" },
  demand: {
    bars: [
      { label: "Residencial", value: 86 },
      { label: "Comercial", value: 68 },
      { label: "Rural", value: 52 },
      { label: "Manutenção", value: 35 },
    ],
    totalSearches: "+1.200",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "A busca por energia solar cresce todos os meses na sua região.",
      "Muitos proprietários nunca encontram sua empresa.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
  },
  fomo: {
    searchQuery: "energia solar",
    competitors: sharedCompetitors,
    yourBusinessLabel: "Sua empresa",
    notFoundLabel: "não aparece",
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, empresas da sua região estão aparecendo quando clientes procuram pelos mesmos serviços que você oferece.",
  },
  form: {
    businessFieldLabel: "Empresa ou Segmento",
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades sua empresa está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais clientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
});

export const construcaoSegment = createSegmentConfig({
  slug: "construcao",
  name: "Construção",
  hubLabel: "Construção e Reformas",
  icon: Hammer,
  accentColor: "oklch(0.66 0.12 55)",
  accentSoft: "oklch(0.66 0.12 55 / 0.12)",
  seo: {
    title: "Raise One — Sua construtora deveria estar recebendo mais clientes",
    description:
      "Diagnóstico gratuito para construtoras e reformadoras. Descubra quantos clientes em potencial estão indo para a concorrência.",
  },
  hero: {
    title: "Sua empresa de construção deveria estar",
    titleHighlight: "recebendo mais clientes.",
    subtitle:
      "Proprietários da sua região pesquisam no Google por reformas e construção. Se você não aparece, esses projetos vão para a concorrência.",
    ctaLabel: "Quero analisar meu mercado",
    badge: "Especialistas em crescimento para negócios locais",
    trustItems: [
      "Sem compromisso",
      "Sem contrato",
      "Análise personalizada da sua região",
      "Retorno em até 24 horas",
    ],
    monthlySearches: "+1.400",
  },
  visibility: {
    searchExamples: [
      "Reforma de apartamento",
      "Construção de casas",
      "Pedreiro qualificado",
      "Reforma de cozinha",
      "Empresa de reformas",
    ],
    ctaQuestion: "Quando pesquisam, sua empresa aparece?",
    businessType: "empresa",
    eyebrow: "01 — O Problema",
    title: "A maioria das empresas não tem problema de qualidade.",
    titleMuted: "Tem problema de visibilidade.",
    qualities: [
      "obras bem executadas",
      "equipe qualificada",
      "prazos cumpridos",
      "clientes satisfeitos",
    ],
    closingLine: "Mas nada disso importa para quem nunca encontrou sua empresa.",
  },
  invisibleClient: { searchQuery: "reforma de apartamento" },
  demand: {
    bars: [
      { label: "Reformas", value: 84 },
      { label: "Construção", value: 70 },
      { label: "Acabamento", value: 55 },
      { label: "Manutenção", value: 42 },
    ],
    totalSearches: "+1.400",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Proprietários buscam reformas e construção todos os dias na sua região.",
      "Muitos nunca encontram sua empresa.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
  },
  fomo: {
    searchQuery: "reforma apartamento",
    competitors: sharedCompetitors,
    yourBusinessLabel: "Sua empresa",
    notFoundLabel: "não aparece",
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, empresas da sua região estão aparecendo quando clientes procuram pelos mesmos serviços que você oferece.",
  },
  form: {
    businessFieldLabel: "Empresa ou Especialidade",
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades sua empresa está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais clientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
});

export const servicosLocaisSegment = createSegmentConfig({
  slug: "servicos-locais",
  name: "Serviços Locais",
  hubLabel: "Serviços Locais",
  icon: Wrench,
  accentColor: "oklch(0.68 0.14 280)",
  accentSoft: "oklch(0.68 0.14 280 / 0.12)",
  seo: {
    title: "Raise One — Seu negócio local deveria estar recebendo mais clientes",
    description:
      "Diagnóstico gratuito para prestadores de serviços locais. Descubra quantos clientes em potencial estão indo para a concorrência.",
  },
  hero: {
    title: "Seu negócio local deveria estar",
    titleHighlight: "recebendo mais clientes.",
    subtitle:
      "Todos os dias, pessoas da sua região pesquisam no Google por serviços que você oferece. Se você não aparece, esses clientes contratam a concorrência.",
    ctaLabel: "Quero analisar meu mercado",
    badge: "Especialistas em crescimento para negócios locais",
    trustItems: [
      "Sem compromisso",
      "Sem contrato",
      "Análise personalizada da sua região",
      "Retorno em até 24 horas",
    ],
    monthlySearches: "+1.100",
  },
  visibility: {
    searchExamples: [
      "Encanador perto de mim",
      "Eletricista 24h",
      "Limpeza residencial",
      "Manutenção predial",
      "Serviços domésticos",
    ],
    ctaQuestion: "Quando pesquisam, seu negócio aparece?",
    businessType: "negócio",
    eyebrow: "01 — O Problema",
    title: "A maioria dos negócios não tem problema de qualidade.",
    titleMuted: "Tem problema de visibilidade.",
    qualities: [
      "serviço de qualidade",
      "profissionais confiáveis",
      "preço justo",
      "clientes satisfeitos",
    ],
    closingLine: "Mas nada disso importa para quem nunca encontrou seu negócio.",
  },
  invisibleClient: { searchQuery: "encanador perto de mim" },
  demand: {
    bars: [
      { label: "Manutenção", value: 80 },
      { label: "Reparos", value: 68 },
      { label: "Instalação", value: 54 },
      { label: "Emergência", value: 46 },
    ],
    totalSearches: "+1.100",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Pessoas buscam serviços locais todos os dias na sua região.",
      "Muitos nunca encontram seu negócio.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
  },
  fomo: {
    searchQuery: "encanador",
    competitors: sharedCompetitors,
    yourBusinessLabel: "Seu negócio",
    notFoundLabel: "não aparece",
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, empresas da sua região estão aparecendo quando clientes procuram pelos mesmos serviços que você oferece.",
  },
  form: {
    businessFieldLabel: "Negócio ou Serviço",
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades seu negócio está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais clientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
});

export const outroSegment = createSegmentConfig({
  slug: "outro",
  name: "Outro",
  hubLabel: "Outro",
  icon: HelpCircle,
  accentColor: "oklch(0.65 0.08 280)",
  accentSoft: "oklch(0.65 0.08 280 / 0.12)",
  seo: {
    title: "Raise One — Seu negócio deveria estar recebendo mais clientes",
    description:
      "Diagnóstico gratuito para negócios locais. Descubra quantos clientes em potencial estão indo para a concorrência na sua região.",
  },
  visibility: {
    searchExamples: [
      "Serviço perto de mim",
      "Melhor empresa da região",
      "Orçamento online",
      "Empresa confiável",
      "Atendimento local",
    ],
    ctaQuestion: "Quando pesquisam, sua empresa aparece?",
    businessType: "empresa",
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
  },
  invisibleClient: { searchQuery: "serviço perto de mim" },
  demand: {
    bars: [
      { label: "Busca local", value: 75 },
      { label: "Comparativos", value: 62 },
      { label: "Orçamentos", value: 48 },
      { label: "Avaliações", value: 36 },
    ],
    totalSearches: "+850",
    capturedLabel: "Capturado por você",
    availableLabel: "Disponível",
    eyebrow: "04 — A Oportunidade",
    title: "Existe demanda na sua região.",
    titleMuted: "A questão é quem está capturando essa demanda.",
    paragraphs: [
      "Pessoas buscam serviços na sua região todos os dias.",
      "Muitas nunca encontram sua empresa.",
      "Não porque você é pior. Mas porque você não apareceu.",
    ],
  },
  fomo: {
    searchQuery: "serviço local",
    competitors: sharedCompetitors,
    yourBusinessLabel: "Sua empresa",
    notFoundLabel: "não aparece",
    title: "Seus concorrentes já entenderam isso.",
    subtitle:
      "Enquanto você lê esta página, empresas da sua região estão aparecendo quando clientes procuram pelos mesmos serviços que você oferece.",
  },
  form: {
    businessFieldLabel: "Empresa ou Segmento",
    eyebrow: "Diagnóstico Gratuito",
    title: "Quantas oportunidades sua empresa está",
    titleHighlight: "deixando passar hoje?",
    subtitle:
      "Solicite gratuitamente uma análise da sua região e descubra como potenciais clientes estão encontrando seus concorrentes.",
    submitLabel: "Quero analisar meu mercado",
    footerNote: "Sem compromisso · Retorno em até 24 horas",
  },
});
