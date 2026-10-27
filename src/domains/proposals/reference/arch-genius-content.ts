import type { ProposalPricingTier } from "../types";

/**
 * Proposta referência: Arch Genius Arquitetura.
 * Oito blocos comerciais: diagnóstico, oportunidade, arquitetura,
 * entregas, investimento, escopo, Raise One e próximos passos.
 * Valores: implantação R$ 3.550, 1º mês de gestão gratuito após o
 * lançamento, gestão R$ 997/mês a partir do 2º mês, mídia R$ 900 a R$ 1.500/mês.
 */

export const ARCH_GENIUS_PRICES_READY = true;

export const ARCH_GENIUS_PRICING: ProposalPricingTier[] = [
  {
    id: "implementation",
    name: "Implantação digital",
    subtitle: "01 · Pagamento único",
    amountLabel: "R$ 3.550,00",
    frequency: "once",
    items: [
      "Planejamento e arquitetura digital",
      "Reconstrução do site institucional",
      "Até 3 landing pages comerciais",
      "Conversões, integrações e preparação técnica",
    ],
    note: "Pagamento único. Páginas adicionais e funcionalidades especiais serão orçadas à parte.",
  },
  {
    id: "management",
    name: "Gestão Google Ads",
    subtitle: "02 · 1º mês gratuito",
    amountLabel: "R$ 997,00/mês",
    frequency: "monthly",
    items: [
      "Pesquisa e refinamento de palavras-chave",
      "Gestão das campanhas contratadas",
      "Otimização de anúncios, segmentações e orçamento",
      "Acompanhamento das conversões",
      "Análise da qualidade dos contatos e das oportunidades",
      "Recomendações de melhoria e de expansão",
    ],
    note: "O primeiro mês de gestão é gratuito e corresponde ao primeiro mês de operação das campanhas após o lançamento.",
  },
  {
    id: "media",
    name: "Investimento em mídia",
    subtitle: "03 · Pago ao Google",
    amountLabel: "R$ 900,00 a R$ 1.500,00/mês",
    frequency: "monthly_google",
    items: [
      "Verba paga diretamente à plataforma de anúncios",
      "Separada da remuneração da Raise One",
      "Concentrada em uma ou duas frentes prioritárias no início",
    ],
    note: "Estimativa inicial. A verba será definida e ajustada conforme as prioridades aprovadas.",
  },
];

export const ARCH_GENIUS_INVESTMENT = {
  title: "Investimento para implantar a estrutura e operar a aquisição.",
  intro:
    "A implantação é pagamento único. O primeiro mês de gestão é gratuito. A verba de mídia é paga ao Google.",
  implementation: {
    code: "01",
    title: "Implantação digital",
    priceLine: "R$ 3.550,00",
    priceNote: "Pagamento único",
    lead: "Planejamento, site institucional, até três landing pages e preparação técnica para as campanhas contratadas.",
    breakdownTitle: "Composição da implantação",
    breakdown: [
      { title: "Planejamento e arquitetura digital", amount: "R$ 700,00" },
      { title: "Reconstrução do site institucional", amount: "R$ 1.500,00" },
      { title: "Até 3 landing pages comerciais", amount: "R$ 750,00" },
      { title: "Conversões, integrações e preparação técnica", amount: "R$ 600,00" },
    ],
    totalLabel: "Total da implantação",
    totalAmount: "R$ 3.550,00",
  },
  management: {
    code: "02",
    title: "Gestão mensal de Google Ads",
    priceLine: "R$ 997,00/mês",
    lead: "Operação das campanhas contratadas, com análise de desempenho e recomendações de evolução.",
    firstCycleBadge: "1º mês de gestão gratuito",
    firstCycleNote:
      "O mês gratuito começa com a ativação das campanhas, após o lançamento. A cobrança de R$ 997,00/mês começa no segundo mês de operação.",
  },
  media: {
    code: "03",
    title: "Investimento em mídia",
    dailyAmount: "R$ 900,00 a R$ 1.500,00/mês",
    monthlyApprox: "Pago diretamente ao Google",
    lead: "Estimativa inicial, não um compromisso de gasto obrigatório dentro de uma faixa fixa. A verba começa em uma ou duas frentes prioritárias e será ajustada conforme as prioridades aprovadas.",
  },
  summary: {
    title: "Resumo financeiro",
    rows: [
      { label: "Implantação, pagamento único", value: "R$ 3.550,00", tone: "default" },
      { label: "Gestão no primeiro mês", value: "R$ 0,00", tone: "highlight" },
      { label: "Mídia no primeiro mês", value: "R$ 900,00 a R$ 1.500,00", tone: "media" },
      { label: "Investimento total estimado no primeiro mês", value: "R$ 4.450,00 a R$ 5.050,00", tone: "range" },
      { label: "Gestão a partir do segundo mês", value: "R$ 997,00/mês", tone: "default" },
      { label: "Mídia a partir do segundo mês", value: "R$ 900,00 a R$ 1.500,00/mês", tone: "media" },
      { label: "Investimento recorrente estimado a partir do segundo mês", value: "R$ 1.897,00 a R$ 2.497,00/mês", tone: "range" },
    ],
    note: "Os valores de mídia são estimativas iniciais. A verba é paga diretamente ao Google e permanece separada da remuneração da Raise One.",
  },
  conditions: [
    "A implantação é cobrada uma única vez.",
    "O primeiro mês de gestão é gratuito e corresponde ao primeiro mês de operação das campanhas após o lançamento.",
    "A partir do segundo mês de operação, a gestão é cobrada em R$ 997,00 por mês.",
  ],
};

export const ARCH_GENIUS_REFERENCE = {
  company: "Arch Genius Arquitetura",
  client: "Arquitetura · Engenharia · Serviços técnicos",

  hero: {
    eyebrow: "Proposta comercial",
    headline: "Reestruturação Digital e Aquisição de Clientes",
    headlineLines: ["Reestruturação Digital", "e Aquisição de Clientes"] as const,
    lead: "Uma estrutura digital integrada para fortalecer a presença da Arch Genius, organizar o portfólio e transformar a intenção de busca em oportunidades comerciais mensuráveis.",
    strategyLine: "Marketing + Tecnologia + IA",
    pillars: ["Site institucional", "Até 3 landing pages", "Google Ads", "Conversão e mensuração"],
    cta: "Conhecer o projeto",
  },

  diagnosis: {
    headline: "Uma operação com diferentes competências e oportunidades de crescimento.",
    lead: "A Arch Genius já possui identidade visual, site, portfólio e experiência em diferentes frentes da arquitetura, engenharia e serviços técnicos. Hoje, a aquisição de clientes ocorre predominantemente por indicação e networking. O próximo passo é organizar essa estrutura digital para comunicar melhor as competências do escritório e ampliar a captação de oportunidades.",
    challengesTitle: "Principais desafios identificados",
    challenges: [
      {
        title: "Comunicação",
        body: "Diferentes serviços competem pela mesma mensagem, dificultando a identificação da solução ideal para cada cliente.",
      },
      {
        title: "Aquisição",
        body: "A dependência de indicações limita a previsibilidade de novas oportunidades.",
      },
      {
        title: "Conversão",
        body: "O site precisa conduzir cada visitante a um caminho claro de contato e orçamento.",
      },
      {
        title: "Capacidade operacional",
        body: "A aquisição deve priorizar serviços compatíveis com a margem, a estrutura de atendimento e a capacidade de execução do escritório.",
      },
    ],
    practiceTitle: "Áreas de atuação identificadas",
    practiceAreas: [
      "Arquitetura e urbanismo",
      "Projetos residenciais e comerciais",
      "Reformas e construção",
      "Design de interiores",
      "Gestão e acompanhamento de obras",
      "Regularização imobiliária",
      "Vistorias e avaliações",
      "Segurança contra incêndio e serviços técnicos",
    ],
    closing:
      "O desafio não é a ausência de capacidade técnica. É organizar essa diversidade em uma estrutura digital e comercial mais eficiente.",
  },

  opportunity: {
    headline: "Uma base integrada. Diferentes frentes de aquisição.",
    lead: "A recomendação é reconstruir o site institucional e conectá-lo a páginas comerciais específicas, cada uma direcionada a uma demanda e a uma estratégia de aquisição. Pessoas e empresas procuram soluções diferentes. Cada serviço prioritário precisa apresentar proposta de valor, diferenciais e um caminho objetivo para contato.",
    frontsTitle: "Frentes potenciais para aquisição",
    fronts: [
      {
        title: "Projetos e reformas residenciais",
        body: "Demanda a validar conforme região, ticket e capacidade de atendimento.",
      },
      {
        title: "Projetos comerciais e industriais",
        body: "Potencial para trabalhos de maior porte, condicionado à definição dos serviços executados diretamente e daqueles que dependem de parceiros.",
      },
      {
        title: "Regularização imobiliária",
        body: "Serviço com público e jornada próprios, candidato a uma página e campanha dedicadas.",
      },
      {
        title: "Segurança contra incêndio e serviços técnicos",
        body: "Frente a avaliar conforme o modelo de contratação, a execução e as responsabilidades técnicas envolvidas.",
      },
    ],
    frontsNote:
      "Hipóteses comerciais, não uma definição de que todas serão anunciadas no lançamento. A implantação inclui até três landing pages, escolhidas em conjunto após a validação das prioridades.",
    criteriaTitle: "Critérios para definir as prioridades",
    criteria: [
      "Demanda de pesquisa",
      "Concorrência",
      "Região atendida",
      "Valor e margem dos serviços",
      "Capacidade de entrega",
      "Disponibilidade de profissionais e parceiros",
    ],
    strategyEyebrow: "A estratégia",
    strategyHeadline: "Começar por uma ou duas frentes. Ampliar com dados.",
    strategyBody:
      "Validamos as primeiras frentes, observamos os resultados e a capacidade operacional, e só então expandimos a aquisição. A estrutura pode comportar outras páginas. A ativação das campanhas não precisa acontecer toda de uma vez.",
  },

  architecture: {
    headline: "Três camadas conectadas em uma única experiência digital.",
    lead: "O site constrói credibilidade. As landing pages convertem demandas específicas. O Google Ads leva a intenção de busca até a oferta correspondente.",
    layers: [
      {
        number: "01",
        title: "Site institucional",
        subtitle: "Credibilidade e posicionamento",
        body: "Reconstrução da presença institucional, aproveitando a identidade visual existente.",
        items: [
          "Apresentação do escritório e da equipe",
          "Organização das categorias de serviços",
          "Portfólio de projetos e materiais disponíveis",
          "Navegação responsiva, contatos e chamadas para ação",
        ],
      },
      {
        number: "02",
        title: "Landing pages comerciais",
        subtitle: "Foco em conversão",
        body: "Até três páginas específicas para os serviços definidos como prioritários.",
        items: [
          "Comunicação direcionada à necessidade do cliente",
          "Proposta de valor, diferenciais e materiais de apoio",
          "Formulários, CTAs e integração com WhatsApp, quando aplicável",
          "Identidade visual consistente com o site institucional",
        ],
      },
      {
        number: "03",
        title: "Google Ads",
        subtitle: "Aquisição por intenção de busca",
        body: "Campanhas contratadas direcionadas à página relacionada a cada demanda.",
        items: [
          "Pesquisa e refinamento de palavras-chave",
          "Segmentação por serviço e região",
          "Otimização de anúncios, campanhas e orçamento",
          "Rastreamento de conversões e análise das oportunidades",
        ],
      },
    ],
    diagramLabel: "Como a estrutura funciona",
    diagram: [
      { label: "Busca", hint: "Intenção de serviço" },
      { label: "Anúncio", hint: "Google Ads" },
      { label: "Página específica", hint: "Oferta correspondente" },
      { label: "Contato", hint: "Qualificação" },
      { label: "Contrato", hint: "Resultado comercial" },
    ] as const,
    diagramNote:
      "O objetivo é conectar a intenção de busca à oferta correspondente e acompanhar o caminho até a oportunidade comercial.",
  },

  delivery: {
    headline: "Como o projeto será executado.",
    lead: "Cinco fases, da validação das prioridades à gestão contínua das campanhas.",
    phases: [
      {
        period: "Fase 01",
        title: "Planejamento",
        items: [
          "Validação dos serviços prioritários, públicos e regiões",
          "Arquitetura do site e do portfólio",
          "Definição das primeiras frentes de aquisição",
          "Organização dos materiais necessários",
        ],
      },
      {
        period: "Fase 02",
        title: "Site institucional",
        items: [
          "Desenvolvimento da nova estrutura institucional",
          "Aplicação da identidade visual existente",
          "Organização de serviços, portfólio e contatos",
          "Navegação responsiva e chamadas para ação",
        ],
      },
      {
        period: "Fase 03",
        title: "Landing pages",
        items: [
          "Desenvolvimento de até três páginas",
          "Conteúdo orientado à conversão",
          "Integração visual e funcional com o site",
          "Formulários e pontos de contato previstos",
        ],
      },
      {
        period: "Fase 04",
        title: "Lançamento",
        items: [
          "Configuração das campanhas iniciais de Google Ads",
          "Vinculação dos anúncios às páginas correspondentes",
          "Validação dos eventos de conversão",
          "Publicação após aprovação técnica",
        ],
      },
      {
        period: "Fase 05",
        title: "Gestão",
        items: [
          "Acompanhamento dos indicadores",
          "Otimização das campanhas e segmentações",
          "Análise da qualidade dos contatos",
          "Recomendações de melhoria e expansão",
        ],
      },
    ],
    metricsHeadline: "O que será acompanhado",
    metrics: {
      acquisition: ["Impressões", "Cliques", "Custo de mídia", "Eficiência do tráfego"],
      conversion: ["Visitas às páginas", "Cliques no WhatsApp", "Formulários enviados"],
      qualification: [
        "Contatos compatíveis com os serviços",
        "Oportunidades qualificadas",
        "Solicitações de orçamento",
      ],
      result: ["Propostas enviadas", "Contratos fechados", "Receita informada pelo cliente"],
      note: "A mensuração depende dos dados comerciais disponibilizados pela Arch Genius e das integrações tecnicamente viáveis. Não serão atribuídas vendas à mídia sem evidências suficientes. O acompanhamento comercial desta implantação é básico. CRM completo, automações ou sistemas próprios não estão incluídos.",
    },
  },

  exclusions: {
    included: [
      "Reconstrução do site institucional no escopo aprovado",
      "Até 3 landing pages comerciais, escolhidas em conjunto",
      "Aplicação da identidade visual existente",
      "Organização do portfólio e das categorias de serviços",
      "CTAs, formulários e pontos de contato previstos",
      "Configuração inicial da mensuração acordada",
      "Preparação técnica das campanhas contratadas",
    ],
    wont: [
      "Rebranding completo",
      "Landing pages além das 3 incluídas",
      "Campanhas adicionais não previstas",
      "Gestão de redes sociais ou calendário de conteúdo",
      "Captação e produção audiovisual",
      "Gestão de Meta Ads",
      "Automações avançadas, sistemas próprios ou soluções de IA",
      "Licenças de softwares de terceiros",
      "Manutenção ilimitada do site",
      "Verba de mídia, paga à plataforma",
    ],
    will: "Reconstruir a presença digital da Arch Genius e operar a aquisição nas frentes contratadas, com identidade consistente e limites comerciais explícitos.",
    extras:
      "Páginas adicionais, funcionalidades especiais, integrações complexas e novas frentes de aquisição serão orçadas separadamente, mediante aprovação de escopo.",
    materials:
      "A Arch Genius fornecerá fotografias, projetos, informações técnicas, autorizações de divulgação e os acessos necessários. A Raise One organiza a apresentação comercial desses materiais na nova estrutura.",
    timeline:
      "O cronograma será definido após a aprovação do escopo, a disponibilização dos materiais e a liberação dos acessos.",
    expectation:
      "A proposta não estabelece garantia de volume específico de leads ou contratos. O compromisso da Raise One é entregar a estrutura acordada, preparar a mensuração e otimizar as campanhas contratadas com base nos dados disponíveis.",
  },

  whyRaiseOne: {
    headline: "Marketing, tecnologia e estratégia trabalhando juntos.",
    lead: "A Raise One integra quatro competências para conectar a estrutura digital aos objetivos comerciais da Arch Genius.",
    pillars: [
      {
        title: "Estratégia",
        body: "Organização das prioridades e da arquitetura digital.",
      },
      {
        title: "Marketing",
        body: "Conexão entre serviços e pessoas com intenção de contratação.",
      },
      {
        title: "Tecnologia",
        body: "Desenvolvimento de uma experiência integrada entre site e páginas comerciais.",
      },
      {
        title: "Dados",
        body: "Mensuração do desempenho e orientação das próximas decisões.",
      },
    ],
    roles:
      "A Raise One conduz a estratégia e a execução da estrutura contratada. A Arch Genius participa das decisões sobre prioridades, capacidade operacional e serviços a serem ativados.",
    result:
      "O resultado esperado é uma presença digital consistente, mensurável e preparada para evoluir conforme o negócio.",
  },

  nextSteps: [
    {
      title: "Aprovação da proposta",
      detail: "Validação do investimento, do escopo e das primeiras frentes de aquisição.",
    },
    {
      title: "Formalização e alinhamento",
      detail: "Contrato, cronograma e definição das prioridades iniciais.",
    },
    {
      title: "Organização dos materiais e acessos",
      detail: "Recebimento dos conteúdos, projetos, referências e acessos digitais.",
    },
    {
      title: "Desenvolvimento e preparação",
      detail: "Reconstrução do site, criação das landing pages e configuração da mensuração.",
    },
    {
      title: "Validação e lançamento",
      detail: "Aprovação da estrutura e ativação das campanhas acordadas.",
    },
    {
      title: "Gestão e otimização",
      detail: "Acompanhamento dos indicadores, ajustes e recomendações de evolução.",
    },
  ],

  closing: {
    title: "Uma presença digital única. Diferentes caminhos para crescer.",
    body: "A Arch Genius já possui competências técnicas e um portfólio amplo. Este projeto organiza a forma de apresentar esse potencial e conecta os serviços prioritários a uma estratégia de aquisição mensurável.",
    line: "Base institucional reconstruída. Aquisição progressiva.",
    brandLine: "Raise One · Marketing + Tecnologia + IA",
  },

  cta: {
    label: "Quero avançar com este plano",
    message:
      "Olá! Revisei a proposta de reestruturação digital e aquisição de clientes da Raise One para a Arch Genius Arquitetura e gostaria de avançar.",
    pendingLabel: "Validar o direcionamento",
    pendingMessage:
      "Olá! Revisei a proposta da Raise One para a Arch Genius e gostaria de validar o direcionamento e avançar.",
  },
} as const;

export const ARCH_GENIUS_NAV = [
  { id: "partida", label: "Diagnóstico" },
  { id: "oportunidade", label: "Oportunidade" },
  { id: "arquitetura", label: "Arquitetura" },
  { id: "entregas", label: "Entregas" },
  { id: "investimento", label: "Investimento" },
  { id: "escopo", label: "Escopo" },
  { id: "visao", label: "Raise One" },
  { id: "proximos-passos", label: "Próximos passos" },
];

export const ARCH_GENIUS_SLUG = "arch-genius";
