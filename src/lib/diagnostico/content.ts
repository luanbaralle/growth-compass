import type { NextStepLink } from "@/components/marketing/shared/NextSteps";

export const diagnosticoSeo = {
  title: "Diagnóstico Inteligente — Raise One",
  description:
    "Análise gratuita do seu mercado em menos de 1 minuto. Descubra oportunidades de crescimento, demanda na sua região e como capturar clientes.",
};

export const diagnosticoHero = {
  eyebrow: "Diagnóstico Inteligente",
  title: "Descubra onde sua empresa está deixando dinheiro na mesa",
  description:
    "Em menos de um minuto, nosso sistema analisa seu mercado, identifica demanda na sua região e mostra oportunidades concretas de crescimento.",
};

export const howItWorks = [
  {
    step: "01",
    title: "Informe seu negócio",
    description: "Digite o que sua empresa vende — clínica, imobiliária, restaurante, qualquer segmento.",
  },
  {
    step: "02",
    title: "Selecione sua cidade",
    description: "Escolha a região onde você atua. Analisamos demanda local e concorrência.",
  },
  {
    step: "03",
    title: "Receba a análise",
    description: "Veja termos de busca reais, oportunidades identificadas e como capturar essa demanda.",
  },
  {
    step: "04",
    title: "Agende uma conversa",
    description: "Com a análise em mãos, agende uma conversa estratégica para desenhar seu plano de crescimento.",
  },
];

export const exampleAnalysis = {
  business: "Clínica de estética",
  city: "São Paulo, SP",
  terms: [
    "clínica estética zona sul sp",
    "harmonização facial são paulo",
    "botox preço sp",
    "preenchimento labial zona sul",
  ],
  insight:
    "Identificamos demanda ativa na região com 847 buscas mensais estimadas para termos relacionados. Concorrentes locais capturam apenas 23% dessa demanda via Google Ads.",
};

export const diagnosticoBenefits = [
  {
    title: "Gratuito e instantâneo",
    description: "Sem cadastro, sem compromisso. Resultado em menos de 1 minuto.",
  },
  {
    title: "Dados reais do mercado",
    description: "Termos de busca, demanda regional e oportunidades baseados em dados — não achismo.",
  },
  {
    title: "Personalizado por segmento",
    description: "A análise se adapta ao seu tipo de negócio, cidade e mercado local.",
  },
  {
    title: "Primeiro passo do framework",
    description: "Discover — a fase inicial da nossa metodologia de crescimento.",
  },
];

export const diagnosticoNextSteps: NextStepLink[] = [
  {
    label: "Programa de Crescimento",
    description: "O que vem depois do diagnóstico.",
    href: "/programa-de-crescimento",
    internal: true,
  },
  {
    label: "Metodologia",
    description: "Discover → Strategy → Build → Launch → Optimize → Scale.",
    href: "/metodologia",
    internal: true,
  },
  {
    label: "Blog",
    description: "Guias e insights para acelerar seu crescimento.",
    href: "/blog",
    internal: true,
  },
];

export const diagnosticoCta = {
  title: "Pronto para ir além do diagnóstico?",
  description:
    "Agende uma conversa estratégica. Com a análise em mãos, desenhamos o plano de crescimento ideal para seu negócio.",
  whatsappMessage:
    "Olá! Fiz o diagnóstico no site e gostaria de agendar uma conversa estratégica sobre oportunidades de crescimento.",
};
