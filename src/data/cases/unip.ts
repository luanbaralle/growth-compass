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
  subtitle: "Landing Page · Google Ads · Mensuração — 3 meses de captação.",
  client: "UNIP EAD · Polo Caraguatatuba",
  industry: "Educação",
  category: "Educação",
  year: 2026,
  website: "https://faculdadelitoral.com.br",
  coverImage: "/images/cases/placeholder-cover.jpg",
  heroImage: "/images/cases/placeholder-hero.jpg",
  description:
    "De demanda espontânea a um canal previsível de captação de alunos no Litoral Norte — landing page, campanhas e mensuração integradas ao longo de três ciclos.",
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
      value: "600+",
      label: "Conversões em 3 meses",
      context:
        "Contatos originados do funil digital no Litoral Norte, em três ciclos de operação. O volume cresceu a cada mês — do primeiro contato à captação contínua.",
    },
    {
      value: "1.800+",
      label: "Acessos qualificados",
      context:
        "Pessoas que chegaram à landing page depois de buscar graduação, cursos e UNIP na região. Interesse ativo, não alcance frio.",
    },
    {
      value: "3 meses",
      label: "Captação contínua",
      context:
        "Tempo para validar a demanda no primeiro ciclo e transformar o funil em um canal previsível de oportunidades para o polo.",
    },
  ],
  testimonial: {
    quote:
      "As mensagens estão chegando. Alguns mais interessados, outros curiosos. Ainda não tivemos matrículas. Mas a procura aumentou consideravelmente.",
    author: "Polo UNIP · Caraguatatuba",
  },
  nextProjects: [],
  process: [
    { phase: "01", title: "Google", description: "Demanda qualificada no Litoral Norte" },
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
      { label: "Acompanhamento", hint: "Ajustes com base em três ciclos" },
    ],
    deliverablesIntro:
      "O que a Raise One estruturou neste projeto. Cada peça conectada no funil, não entrega isolada.",
    problemChannels: ["Instagram", "Rádio", "Indicação"],
    problemClosing: "Esperar alguém aparecer não é estratégia de crescimento.",
    resultsIntro:
      "Números de três ciclos de operação — de julho a setembro de 2026. O primeiro mês validou a demanda; os seguintes transformaram o funil em um canal contínuo de captação no Litoral Norte.",
    whyItWorkedTitle: "Como conseguimos",
    whyItWorkedIntro:
      "O resultado não veio de uma peça isolada. Veio da combinação de decisões abaixo, aplicadas de forma integrada ao longo de três meses.",
    whyItWorked: [
      {
        title: "Funil único",
        description:
          "Anúncio, landing page, WhatsApp e secretaria passaram a trabalhar como um sistema, não como canais soltos sem conexão.",
      },
      {
        title: "Landing orientada a contato",
        description:
          "Página com uma única conversão clara — contato via WhatsApp — com informações locais do polo e identidade da marca UNIP.",
      },
      {
        title: "Campanhas de intenção",
        description:
          "Anúncios para quem já busca matrícula na região. Graduação EAD concentra o volume; cursos específicos e pós capturam intenções mais pontuais.",
      },
      {
        title: "Três cidades, um polo",
        description:
          "Caraguatatuba, São Sebastião e Ilhabela no mesmo sistema. A cidade-sede lidera o volume; as vizinhas entram com intenção alta e sem desperdício fora da área de atuação.",
      },
      {
        title: "WhatsApp como conversão",
        description:
          "Canal direto entre interesse e conversa com a secretaria, sem formulários longos que interrompem a intenção — e com jornada majoritariamente no celular.",
      },
      {
        title: "Crescimento ciclo a ciclo",
        description:
          "O primeiro mês validou a demanda. Os dois seguintes aumentaram o volume de contatos com a mesma estrutura, sem reinventar o funil a cada ciclo.",
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
      "Três ciclos de captação geram aprendizado acumulado. Estes são os insights que levamos para os próximos funis de educação.",
    lessonsLearned: [
      {
        title: "O primeiro ciclo valida. Os seguintes escalam.",
        description:
          "Em educação, matrícula leva tempo. Os primeiros 30 dias provam demanda e volume de contatos. Com a estrutura no ar, o segundo e o terceiro ciclo aumentaram as oportunidades sem mudar o sistema.",
      },
      {
        title: "Graduação EAD puxa o volume",
        description:
          "Quem busca faculdade EAD com polo local é o principal vetor de demanda. Cursos específicos e pós convertem bem, mas em escala complementar — o orçamento deve seguir essa hierarquia.",
      },
      {
        title: "Regionalização importa",
        description:
          "Campanhas restritas a Caraguatatuba, São Sebastião e Ilhabela evitam cliques de fora da região e melhoram a qualidade dos contatos que a secretaria recebe.",
      },
      {
        title: "Landing local converte melhor",
        description:
          "Informações do polo, localização e contato direto na página reduzem dúvidas antes da primeira mensagem — especialmente no celular, de onde vem a maior parte da jornada.",
      },
      {
        title: "Secretaria como etapa final",
        description:
          "O funil digital entrega o interessado. A matrícula depende de como a secretaria conduz a conversa, e isso precisa estar alinhado desde o primeiro ciclo.",
      },
    ],
    quoteContext: "No início do primeiro ciclo",
    landingTitle: "A estrutura que passou a receber toda a aquisição.",
    landingDescription:
      "Página com foco em uma única conversão, contato via WhatsApp, com informações locais do polo e identidade UNIP para quem busca matrícula no Litoral Norte.",
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
        { label: "Demanda no Google", hint: "Intenção ativa em três cidades" },
        { label: "Landing como hub", hint: "Um ponto de entrada para todo contato" },
        { label: "Volume crescente", hint: "600+ conversões em três ciclos" },
        { label: "Secretaria integrada", hint: "Atendimento alinhado ao que chega" },
      ],
    },
    transformClosing:
      "Um funil único substitui canais soltos. Cada contato passa a ter origem e próximo passo claro.",
    faqs: [
      {
        question: "Diagnóstico e estrutura",
        answer:
          "Mapeamos os canais existentes e desenhamos um funil único: anúncio, página, contato, atendimento — com foco no Litoral Norte.",
      },
      {
        question: "Landing page",
        answer:
          "Página orientada a uma única conversão, contato via WhatsApp, com informações locais e identidade da marca.",
      },
      {
        question: "Campanhas de demanda",
        answer:
          "Anúncios para captar intenção real de matrícula: graduação EAD como motor de volume, cursos e pós como intenções complementares.",
      },
      {
        question: "Acompanhamento",
        answer:
          "Três ciclos de monitoramento, ajustes graduais e comunicação transparente — da validação da demanda à captação contínua.",
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
      { value: "600+", label: "Conversões" },
      { value: "1.800+", label: "Acessos qualificados" },
      { value: "3 meses", label: "Captação contínua" },
    ],
    ctaLabel: "Quero um sistema previsível de aquisição",
    ctaHref: "/diagnostico",
    metaSheet: {
      client: ["UNIP EAD", "Polo Caraguatatuba"],
      segment: "Educação",
      services: ["Landing Page", "Google Ads", "Mensuração"],
      period: "3 meses",
    },
  },
};
