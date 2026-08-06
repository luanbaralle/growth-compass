import type { Case } from "@/types/case";

/** Uso interno — status de publicação por item */
export const unipCaseDataPolicy = {
  clientName: "public",
  landingPage: "public",
  funnelStructure: "public",
  quote: "approved",
  conversions: "pending_authorization",
  investment: "private",
  analytics: "private",
  googleAds: "private",
} as const;

export const unip: Case = {
  slug: "unip",
  title: "UNIP Caraguatatuba",
  subtitle: "Landing Page · Google Ads · Mensuração — em 30 dias.",
  client: "UNIP EAD · Polo Caraguatatuba",
  industry: "Educação",
  category: "Educação",
  year: 2024,
  website: "https://faculdadelitoral.com.br",
  coverImage: "/images/cases/placeholder-cover.jpg",
  heroImage: "/images/cases/placeholder-hero.jpg",
  description:
    "De demanda espontânea a um canal previsível de captação de alunos — landing page, campanhas e mensuração integradas.",
  challenge: "A procura existia. Mas ninguém controlava.",
  solution: "Um sistema. Não peças soltas.",
  goals: ["Sem previsibilidade.", "Sem controle.", "Sem escala."],
  deliverables: ["Landing Page", "Google Ads", "Mensuração"],
  technologies: [],
  gallery: [
    {
      src: "/images/cases/placeholder-gallery-1.jpg",
      alt: "Landing page UNIP Caraguatatuba — página completa",
    },
  ],
  colors: [{ name: "UNIP Blue", hex: "#003366" }],
  typography: { heading: "Arial", body: "Arial" },
  metrics: [
    {
      value: "+90",
      label: "Conversões no primeiro ciclo",
      context:
        "Contatos qualificados via WhatsApp originados do funil digital, no primeiro mês de operação estruturada.",
    },
    {
      value: "300+",
      label: "Novos visitantes",
      context:
        "Pessoas que acessaram a landing page após clicar em anúncios ou encontrar a página, sinal de interesse ativo na região.",
    },
    {
      value: "30 dias",
      label: "Primeiro ciclo validado",
      context:
        "Tempo para diagnosticar, construir a landing, lançar campanhas e começar a mensurar resultados de forma consistente.",
    },
  ],
  testimonial: {
    quote:
      "As mensagens estão chegando. Alguns mais interessados, outros curiosos. Ainda não tivemos matrículas. Mas a procura aumentou consideravelmente.",
    author: "Polo UNIP · Caraguatatuba",
  },
  nextProjects: [],
  process: [
    { phase: "01", title: "Google", description: "Demanda qualificada contínua" },
    { phase: "02", title: "Landing Page", description: "Conversão orientada a contato" },
    { phase: "03", title: "WhatsApp", description: "Canal direto com o interessado" },
    { phase: "04", title: "Secretaria", description: "Atendimento e follow-up" },
  ],
  marketing: {
    positioning: "Pare de depender da sorte para gerar novos clientes.",
    conversionStrategy:
      "Construímos sistemas de aquisição que transformam marketing em crescimento consistente.",
    ctaPrimary: "Quero um sistema previsível de aquisição",
    ctaWhatsAppMessage:
      "Olá! Li o case da UNIP Caraguatatuba no site da Raise One e gostaria de entender se esse sistema de aquisição funciona para meu negócio.",
  },
  content: {
    problemIntro:
      "O polo já tinha demanda local por educação, mas a captação dependia de canais que não se conversam entre si. Rádio, indicação e redes geravam interesse, porém sem previsibilidade: era impossível saber quantos contatos viriam na semana seguinte ou qual canal realmente funcionava.",
    agencyDeliverables: [
      { label: "Estratégia", hint: "Priorização de canais e funil" },
      { label: "Landing Page", hint: "Captação centralizada" },
      { label: "Google Ads", hint: "Demanda qualificada na região" },
      { label: "Mensuração", hint: "Origem e conversão rastreadas" },
      { label: "Acompanhamento", hint: "Ajustes com base em dados" },
    ],
    deliverablesIntro:
      "O que a Raise One estruturou neste projeto. Cada peça conectada no funil, não entrega isolada.",
    problemChannels: ["Instagram", "Rádio", "Indicação"],
    problemClosing: "Esperar alguém aparecer não é estratégia de crescimento.",
    resultsIntro:
      "Números do primeiro ciclo de 30 dias, período em que landing page, campanhas e mensuração foram estruturadas e validadas.",
    whyItWorkedTitle: "Como conseguimos",
    whyItWorkedIntro:
      "O resultado não veio de uma peça isolada. Veio da combinação de decisões abaixo, aplicadas de forma integrada no primeiro ciclo.",
    whyItWorked: [
      {
        title: "Funil único",
        description:
          "Anúncio, landing page, WhatsApp e secretaria passaram a trabalhar como um sistema, não como canais soltos sem conexão.",
      },
      {
        title: "Landing orientada a contato",
        description:
          "Página com uma única conversão clara, contato via WhatsApp, com informações locais do polo e identidade da marca UNIP.",
      },
      {
        title: "Campanhas de intenção",
        description:
          "Anúncios configurados para captar quem já busca matrícula na região, não tráfego curioso sem intenção de converter.",
      },
      {
        title: "WhatsApp como conversão",
        description:
          "Canal direto entre interesse e conversa com a secretaria, sem formulários longos que interrompem a intenção.",
      },
      {
        title: "Mensuração ponta a ponta",
        description:
          "Origem do clique, visita à página e contato passaram a ser rastreados, permitindo ajustes com base em dados reais.",
      },
      {
        title: "Acompanhamento transparente",
        description:
          "Monitoramento contínuo e comunicação clara sobre fases de aprendizado, especialmente relevante nos primeiros 30 dias.",
      },
    ],
    systemFlowIntro: "Da busca por curso ao contato com a secretaria.",
    systemFlow: [
      { label: "Pessoa pesquisa curso", hint: "intenção de matrícula", kind: "demand" },
      { label: "Google Ads", hint: "captura na região", kind: "system" },
      { label: "Landing Page", hint: "informação e confiança", kind: "system" },
      { label: "WhatsApp", hint: "contato direto", kind: "conversion" },
      { label: "Secretaria", hint: "atendimento e follow-up", kind: "conversion" },
      { label: "Interessado qualificado", hint: "próximo passo claro", kind: "conversion" },
    ],
    lessonsTitle: "O que aprendemos",
    lessonsIntro:
      "Projetos reais geram aprendizado acumulado. Estes são os insights que levamos para os próximos funis de captação.",
    lessonsLearned: [
      {
        title: "Primeiro ciclo é fase de aprendizado",
        description:
          "Em educação, matrícula leva tempo. Nos primeiros 30 dias, o funil valida demanda e volume de contatos antes de fechar matrículas.",
      },
      {
        title: "Regionalização importa",
        description:
          "Campanhas restritas à área de atuação do polo evitam cliques de fora da região e melhoram a qualidade dos contatos.",
      },
      {
        title: "Landing local converte melhor",
        description:
          "Informações do polo, localização e contato direto na página reduzem dúvidas antes da primeira mensagem no WhatsApp.",
      },
      {
        title: "Secretaria como etapa final",
        description:
          "O funil digital entrega o interessado. A matrícula depende de como a secretaria conduz a conversa, e isso precisa estar alinhado desde o início.",
      },
    ],
    quoteContext: "12 dias após o início do projeto",
    landingTitle: "A estrutura que passou a receber toda a aquisição.",
    landingDescription:
      "Página com foco em uma única conversão, contato via WhatsApp, com informações locais do polo e identidade UNIP para quem busca matrícula na região.",
    landingScrollHint: "Role para explorar a página",
    transformIntro: "De dependência de mídia tradicional a um funil digital mensurável.",
    transformBefore: {
      outcome: "Canais sem integração",
      items: [
        { label: "Instagram", hint: "Presença sem conversão rastreada" },
        { label: "Rádio", hint: "Investimento difícil de mensurar" },
        { label: "Indicação", hint: "Volume imprevisível semana a semana" },
      ],
    },
    transformAfter: {
      outcome: "Aquisição com origem conhecida",
      items: [
        { label: "Demanda captada no Google", hint: "Intenção ativa na região" },
        { label: "Landing como hub", hint: "Um ponto de entrada para todo contato" },
        { label: "WhatsApp direto", hint: "Menos atrito entre interesse e conversa" },
        { label: "Secretaria integrada", hint: "Atendimento alinhado ao que chega" },
      ],
    },
    transformClosing:
      "Um funil único substitui canais soltos. Cada contato passa a ter origem e próximo passo claro.",
    faqs: [
      {
        question: "Diagnóstico e estrutura",
        answer:
          "Mapeamos os canais existentes e desenhamos um funil único: anúncio, página, contato, atendimento.",
      },
      {
        question: "Landing page",
        answer:
          "Página orientada a uma única conversão, contato via WhatsApp, com informações locais e identidade da marca.",
      },
      {
        question: "Campanhas de demanda",
        answer:
          "Anúncios configurados para captar intenção real de matrícula, com mensuração de ponta a ponta.",
      },
      {
        question: "Acompanhamento",
        answer:
          "Monitoramento contínuo, ajustes graduais e comunicação transparente sobre fases de aprendizado.",
      },
    ],
  },
  heroExtended: {
    caseNumber: "01",
    caseVertical: "Educação",
    background: "ambient",
    headlineLines: [
      "De demanda espontânea",
      "a um canal previsível",
      "de captação de alunos.",
    ],
    heroMetrics: [
      { value: "+90", label: "Conversões" },
      { value: "300+", label: "Novos visitantes" },
      { value: "30 dias", label: "Primeiro ciclo" },
    ],
    ctaLabel: "Quero um sistema previsível de aquisição",
    ctaHref: "/diagnostico",
    metaSheet: {
      client: ["UNIP EAD", "Polo Caraguatatuba"],
      segment: "Educação",
      services: ["Landing Page", "Google Ads", "Mensuração"],
      period: "Primeiro ciclo",
    },
  },
};
