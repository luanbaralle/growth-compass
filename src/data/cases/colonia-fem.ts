import type { Case } from "@/types/case";

/** Uso interno: status de publicação por item */
export const coloniaFemCaseDataPolicy = {
  clientName: "public",
  landingPage: "public",
  funnelStructure: "public",
  quote: "pending_authorization",
  conversions: "approved",
  investment: "private",
  analytics: "private",
  googleAds: "private",
} as const;

export const coloniaFem: Case = {
  slug: "colonia-fem",
  title: "Pousada Colônia FEM",
  subtitle: "Identidade · Landing · Vídeo · Google Ads. Primeira semana.",
  client: "Pousada Colônia FEM · Itanhaém",
  industry: "Hospedagem",
  category: "Hospedagem",
  year: 2026,
  website: "https://pousadacoloniafem.com.br",
  coverImage: "/images/cases/placeholder-cover.jpg",
  heroImage: "/images/cases/placeholder-hero.jpg",
  description:
    "Construímos uma experiência digital para apresentar a pousada, conectamos a página ao Google Ads e implementamos a mensuração das interações para transformar buscas por hospedagem em oportunidades de contato.",
  challenge:
    "A operação estava pronta para receber. Faltava uma estrutura digital para apresentar a pousada e captar quem já buscava hospedagem.",
  solution:
    "Uma experiência digital conectada à busca e ao contato, com identidade visual, fotografia, vídeo, landing page, Google Ads e mensuração no mesmo caminho.",
  goals: [
    "A hospedagem existia. A presença digital comercial, ainda não.",
    "Havia divulgação, mas não um caminho integrado de aquisição.",
    "Sem landing page, não havia uma vitrine para apresentar a pousada depois do interesse.",
  ],
  deliverables: [
    "Identidade visual",
    "Landing Page",
    "Produção audiovisual",
    "Fotografia",
    "Google Ads",
    "Mensuração",
    "Gestão e otimização",
  ],
  technologies: [],
  gallery: [
    {
      src: "/images/cases/placeholder-gallery-1.jpg",
      alt: "Landing page Pousada Colônia FEM, página completa",
    },
  ],
  colors: [
    { name: "Colônia Red", hex: "#A61E22" },
    { name: "Sand Beige", hex: "#D7C6B0" },
    { name: "Natural Green", hex: "#5B7A5E" },
    { name: "Coastal Blue", hex: "#5A8FB7" },
    { name: "Warm White", hex: "#F8F5EE" },
  ],
  typography: { heading: "EB Garamond", body: "Lato" },
  metrics: [
    {
      value: "37",
      label: "Contatos na primeira semana",
      context:
        "Contatos gerados na primeira semana da campanha de Google Ads, no período de 16 a 23 de outubro de 2026.",
    },
    {
      value: "168",
      label: "Cliques na campanha",
      context:
        "Cliques registrados na campanha no mesmo intervalo de sete dias.",
    },
    {
      value: "7 dias",
      label: "Primeira semana",
      context:
        "Recorte inicial da operação, ainda no primeiro mês. A estrutura digital já estava no ar; a gestão segue em andamento.",
    },
  ],
  nextProjects: [],
  process: [
    {
      phase: "01",
      title: "Identidade visual",
      description:
        "Marca, paleta, tipografia e aplicações. Um sistema para a pousada ser reconhecida no digital e no lugar.",
    },
    {
      phase: "02",
      title: "Fotografia e vídeo",
      description:
        "A equipe da Raise One fotografou a pousada e produziu o filme comercial. Imagens reais da experiência, em still e em movimento.",
    },
    {
      phase: "03",
      title: "Landing page",
      description:
        "Uma página comercial que reúne localização, estrutura, acomodações e o caminho de contato, para o visitante conhecer a pousada antes da primeira mensagem.",
    },
    {
      phase: "04",
      title: "Google Ads e mensuração",
      description:
        "Campanha de busca para quem pesquisa hospedagem na região, com eventos de conversão nos CTAs de WhatsApp e acompanhamento da primeira semana de gestão.",
    },
  ],
  marketing: {
    positioning: "Vamos construir um sistema de aquisição para o seu negócio?",
    conversionStrategy:
      "Unimos estratégia, produção criativa, tecnologia e mídia para transformar a presença digital em um caminho estruturado de aquisição.",
    ctaPrimary: "Quero estruturar minha aquisição",
    ctaWhatsAppMessage:
      "Olá! Li o case da Pousada Colônia FEM no site da Raise One e gostaria de entender como estruturar a aquisição do meu negócio.",
  },
  content: {
    problemIntro:
      "A Pousada Colônia FEM, em Itanhaém, já tinha o essencial: hospedagem, pensão completa, piscina, atendimento próximo e uma quadra da praia. O desafio não era inventar a operação. Era construir uma presença digital comercial e um canal capaz de apresentar essa estrutura a quem já pesquisava onde ficar.",
    problemChannels: ["Instagram", "Facebook", "Indicação"],
    problemClosing:
      "Divulgar a pousada não é o mesmo que estruturar um caminho da busca até o contato.",
    landingTitle: "A página que apresenta a pousada e conduz até o contato.",
    landingDescription:
      "Fotografia própria, vídeo comercial, acomodações, lazer, localização e um caminho claro para o WhatsApp. A landing reúne a experiência da Colônia FEM para quem chega pela busca.",
    landingScrollHint: "Explore a página completa",
    resultsIntro:
      "Primeira semana analisada, de 16 a 23 de outubro de 2026. A campanha gerou 37 contatos e 168 cliques. No mesmo período, a cliente relatou movimentação alta no WhatsApp da pousada. A operação segue em andamento.",
    whyItWorkedTitle: "Como o sistema foi estruturado",
    whyItWorkedIntro:
      "O projeto não é uma tática isolada. É a integração de apresentação, produção, mídia e mensuração no caminho da busca ao contato.",
    whyItWorked: [
      {
        title: "Presença no momento da busca",
        description:
          "O Google Ads coloca a pousada diante de quem pesquisa hospedagem na região. O anúncio encontra; a página apresenta.",
      },
      {
        title: "Uma vitrine da experiência",
        description:
          "A landing reúne informações, imagens e elementos comerciais para o visitante conhecer a Colônia FEM antes de chamar no WhatsApp.",
      },
      {
        title: "Fotografia e vídeo no mesmo discurso",
        description:
          "Identidade, fotografia e vídeo comercial, produzidos pela Raise One, apresentam acomodações, lazer, estrutura e localização com o mesmo olhar.",
      },
      {
        title: "Caminho curto até o contato",
        description:
          "Do anúncio ao WhatsApp, sem formulário longo. A conversa começa no canal que a pousada já utiliza no atendimento.",
      },
      {
        title: "Interações mensuradas",
        description:
          "Os CTAs de WhatsApp disparam eventos de conversão no Google Ads. A campanha passa a ter acompanhamento desde a primeira semana.",
      },
      {
        title: "Gestão depois da publicação",
        description:
          "A estrutura não termina no ar. O acompanhamento inicial orienta as próximas otimizações da campanha.",
      },
    ],
    systemFlowIntro: "Da busca por hospedagem ao contato com a pousada.",
    systemFlow: [
      { label: "Pessoa pesquisa hospedagem", hint: "intenção ativa", kind: "demand" },
      { label: "Google Ads", hint: "campanha de busca", kind: "system" },
      { label: "Landing page", hint: "apresentação comercial", kind: "system" },
      { label: "Fotografia e vídeo", hint: "experiência visual", kind: "system" },
      { label: "WhatsApp", hint: "contato com a pousada", kind: "conversion" },
    ],
    lessonsTitle: "O que a primeira semana mostrou",
    lessonsIntro:
      "Ainda no primeiro mês de operação. O que a abertura do canal já indica para a sequência do trabalho.",
    lessonsLearned: [
      {
        title: "A demanda pode ser capturada no momento da busca",
        description:
          "O Google Ads permite apresentar a pousada a pessoas que pesquisam opções de hospedagem na região.",
      },
      {
        title: "A apresentação da experiência importa",
        description:
          "A landing reúne informações, imagens e elementos comerciais que ajudam o visitante a conhecer a pousada antes do contato.",
      },
      {
        title: "Os ativos visuais trabalham em conjunto",
        description:
          "Fotografia, vídeo e design ajudam a transmitir a experiência que a pousada oferece. São peças da mesma apresentação, não entregas soltas.",
      },
      {
        title: "O caminho até o contato precisa ser simples",
        description:
          "A integração com o WhatsApp reduz o atrito entre o interesse do visitante e o início de uma conversa.",
      },
      {
        title: "O trabalho continua após a publicação",
        description:
          "O acompanhamento da campanha permite avaliar os resultados e orientar as próximas otimizações.",
      },
    ],
    transformIntro: "De uma presença digital dispersa a um caminho integrado de aquisição.",
    transformBefore: {
      outcome: "Uma presença digital sem estrutura integrada de aquisição",
      items: [
        { label: "Divulgação existente", hint: "Redes e indicação, sem um funil único" },
        { label: "Sem landing page comercial", hint: "Não havia uma vitrine para apresentar a pousada" },
        { label: "Sem campanha estruturada de busca", hint: "A captação no Google ainda não estava em operação" },
      ],
    },
    transformAfter: {
      outcome: "Uma experiência digital conectada à busca e ao contato",
      items: [
        { label: "Identidade visual", hint: "Marca, paleta e aplicações no digital e no lugar" },
        { label: "Landing page", hint: "Apresentação comercial da pousada" },
        { label: "Fotografia e vídeo", hint: "Produção da Raise One integrada à página" },
        { label: "Google Ads", hint: "Campanha de busca em operação" },
        { label: "Mensuração e WhatsApp", hint: "Interações acompanhadas até o contato" },
        { label: "Primeira semana", hint: "37 contatos e 168 cliques em 7 dias" },
      ],
    },
    transformClosing:
      "O projeto não substitui a operação da pousada. Organiza a presença digital para que mais pessoas a encontrem e entrem em contato.",
    agencyDeliverables: [
      { label: "Identidade visual", hint: "Marca, paleta, tipografia e aplicações da Colônia FEM" },
      { label: "Landing page", hint: "Apresentação comercial da pousada e caminho de contato" },
      { label: "Produção audiovisual", hint: "Vídeo comercial integrado à experiência digital" },
      { label: "Fotografia", hint: "Captação fotográfica realizada pela equipe da Raise One" },
      { label: "Google Ads", hint: "Estruturação e publicação da campanha de busca" },
      { label: "Mensuração", hint: "Eventos de conversão e acompanhamento das interações" },
      { label: "Gestão e otimização", hint: "Acompanhamento inicial da campanha e evolução da estratégia" },
    ],
    deliverablesIntro:
      "As entregas existem juntas: identidade, apresentação, produção, mídia e mensuração no mesmo sistema de aquisição.",
  },
  heroExtended: {
    caseNumber: "04",
    caseVertical: "Hospedagem",
    background: "ambient",
    headlineLines: [
      "Da presença digital",
      "à captação de hóspedes:",
      "a nova estrutura de aquisição da Colônia FEM.",
    ],
    lead:
      "Construímos uma experiência digital para apresentar a pousada, conectamos a página ao Google Ads e implementamos a mensuração das interações para transformar buscas por hospedagem em oportunidades de contato.",
    heroMetrics: [
      { value: "37", label: "Contatos" },
      { value: "168", label: "Cliques" },
      { value: "7 dias", label: "Primeira semana" },
    ],
    ctaLabel: "Quero estruturar minha aquisição",
    ctaHref: "/diagnostico",
    metaSheet: {
      client: ["Pousada Colônia FEM"],
      segment: "Hospedagem · Itanhaém, SP",
      services: ["Identidade, landing e audiovisual", "Google Ads e mensuração"],
      period: "Outubro de 2026 · Em andamento",
    },
  },
};
