import type { ProposalPricingTier } from "../types";

/** Investimento específico Saúde & Cia (setup + operação + mídia). */
export const SAUDE_CIA_PRICING: ProposalPricingTier[] = [
  {
    id: "implementation",
    name: "Fundação · Mês 01",
    subtitle: "Pagamento único · setup",
    amountLabel: "R$ 1.997",
    frequency: "once",
    items: [
      "Diagnóstico estratégico e plano de ação",
      "Definição de produtos prioritários",
      "Revisão e otimização da jornada de conversão da LP",
      "GTM, GA4, conversões e UTMs",
      "Estrutura inicial de campanhas Google Ads",
      "Calendário editorial e primeira pauta de conteúdo",
      "Preparação da primeira captação",
    ],
    note: "Em até 12x de R$ 199,68",
  },
  {
    id: "management",
    name: "Operação de crescimento",
    subtitle: "Mensal · a partir do Mês 02",
    amountLabel: "R$ 1.800/mês",
    frequency: "monthly",
    items: [
      "Gestão e otimização Google Ads",
      "Pesquisa contínua de termos e produtos",
      "4 Reels estratégicos por mês",
      "Calendário editorial, roteiros e 1 sessão de captação em Itanhaém",
      "Edição, legendas e publicação",
      "Monitoramento de conversões e origem dos leads",
      "Relatórios, análise e reuniões estratégicas",
    ],
    note: "Google Ads, produção de conteúdo e mensuração na mesma operação mensal.",
  },
  {
    id: "media",
    name: "Verba de mídia · Google Ads",
    subtitle: "Mensal · pago direto ao Google",
    amountLabel: "R$ 1.000",
    frequency: "monthly_google",
    items: [
      "Investimento inicial recomendado no primeiro mês",
      "Pago diretamente ao Google",
      "Validação de demanda, produtos, mensagens e custo por oportunidade",
    ],
    note: "A verba poderá ser ampliada conforme os dados justificarem. Faixa de referência após validação: R$ 1.000 a R$ 2.000/mês.",
  },
];

export const SAUDE_CIA_INVESTMENT = {
  title: "Investimento para construir o sistema de crescimento",
  intro:
    "Três camadas de investimento: um setup inicial para colocar os três motores no ar, a operação mensal da Raise One e a verba de mídia paga diretamente ao Google. A mídia não passa pela Raise One: vocês pagam ao Google e nós gerenciamos a aplicação.",
  header: {
    title: "Setup, operação e mídia",
    description:
      "Fundação única no Mês 01. Operação mensal a partir do Mês 02. Mídia com investimento inicial de R$ 1.000 no primeiro mês.",
    steps: ["01 Setup único", "02 Operação mensal", "03 Mídia Google"] as const,
  },
  summary: {
    title: "Resumo do investimento",
    rows: [
      { label: "Fundação (único)", value: "R$ 1.997" },
      { label: "Operação Raise One / mês (desde o Mês 02)", value: "R$ 1.800/mês" },
      { label: "Mídia Google · 1º mês (recomendado)", value: "R$ 1.000" },
    ],
    totalLabel: "Total mensal estimado (após setup)",
    totalValue: "R$ 2.800",
    totalNote:
      "Operação + mídia inicial. O setup (Mês 01) é pago uma única vez; a operação mensal começa no Mês 02. A verba de mídia pode ser ajustada com base nos dados.",
  },
  footer:
    "O setup prepara a fundação no Mês 01. A operação mensal começa no Mês 02. Custos extraordinários de produção, deslocamentos fora da região acordada, contratação de modelos, locações, equipamentos ou fornecedores terceiros, quando necessários, serão previamente aprovados e orçados à parte.",
  recurringOrder: ["management", "media"] as const,
};

/** Conteúdo de referência Saúde & Cia · Golden Proposal Raise One */

export const SAUDE_CIA_REFERENCE = {
  company: "Saúde & Cia",
  client: "Angélica",

  hero: {
    eyebrow: "Proposta estratégica personalizada",
    headline: "Projeto de Crescimento Digital para a Saúde & Cia",
    lead: "Estratégia, aquisição, conteúdo e mensuração para transformar presença digital em novas oportunidades comerciais.",
    strategyLine: "Aquisição + Conteúdo + Tecnologia + Dados",
    footnote:
      "Um ecossistema de presença, aquisição e mensuração capaz de gerar oportunidades de forma mais previsível e mensurável. Construído a partir do diagnóstico comercial realizado com a Saúde & Cia.",
  },

  discoveries: [
    {
      title: "18 anos de mercado",
      body: "História consolidada desde 2008 e reconhecimento local construído ao longo dos anos.",
    },
    {
      title: "Produtos com potencial",
      body: "Consórcios e planos de saúde aparecem como produtos relevantes; consórcio náutico surge como oportunidade ainda pouco explorada.",
    },
    {
      title: "Aquisição pouco estruturada",
      body: "A maior parte dos novos clientes chega por indicação, com relato atual de cerca de 10 potenciais oportunidades por mês.",
    },
    {
      title: "Presença digital subutilizada",
      body: "Há autoridade real no mercado, mas falta um sistema que conecte conteúdo, mídia paga e conversão de forma mensurável.",
    },
  ],

  diagnosis: {
    headline: "O ponto de partida",
    subheadline:
      "Uma empresa consolidada, com autoridade local e potencial comercial, mas com aquisição digital ainda pouco estruturada.",
    strengths: [
      { label: "Autoridade", value: "18 anos de mercado" },
      { label: "Oferta", value: "Seguros, saúde e consórcios" },
      { label: "Diferenciais", value: "Yamaha + Rodobens" },
      { label: "Presença local", value: "Reconhecimento e indicação" },
    ],
    dependency: "Indicação → contato → venda",
    insight:
      "Quando a empresa depende predominantemente de indicação, ela não controla totalmente quando, quanto e de onde novas oportunidades irão surgir.",
  },

  bottleneck: {
    today: {
      label: "Hoje",
      steps: ["Indicação", "Cliente chega", "Angélica atende", "Venda"],
      lacks: [
        "volume",
        "origem",
        "custo",
        "intenção",
        "previsibilidade",
        "presença digital",
        "dados",
      ],
    },
    target: {
      label: "O que vamos construir",
      steps: [
        "Demanda (conteúdo + mídia)",
        "Aquisição (LP / WhatsApp / formulário)",
        "Conversão digital",
        "Lead",
        "Saúde & Cia (atendimento → venda)",
        "Dados → otimização",
      ],
    },
  },

  productPriority:
    "A primeira etapa focará nos produtos com maior potencial comercial, cruzando demanda de mercado, intenção de busca, rentabilidade, diferenciação e capacidade operacional da equipe.",

  leadDefinition: {
    title: "O que consideramos um lead",
    body: "Lead: contato identificado que demonstrou intenção comercial por formulário, WhatsApp ou outro canal definido no tracking.",
    flow: "Conversão digital → Lead → Oportunidade → Venda",
  },

  motors: [
    {
      number: "01",
      badge: "Google Ads",
      title: "Motor de demanda",
      subtitle: "Capturar quem já está procurando.",
      objective:
        "Aparecer quando alguém busca ativamente o que a Saúde & Cia vende, com intenção explícita e mensuração desde o primeiro clique.",
      items: [
        "Pesquisa de demanda e intenção de busca",
        "Campanhas Search por produto e intenção",
        "Anúncios, extensões e conversões",
        "Gestão, otimização e controle de orçamento",
        "Análise de termos e performance",
      ],
    },
    {
      number: "02",
      badge: "Conteúdo",
      title: "Motor de autoridade",
      subtitle: "Transformar experiência em presença digital.",
      objective:
        "Transformar os 18 anos de experiência da Saúde & Cia e o conhecimento da Angélica em conteúdo que gere confiança, presença e lembrança.",
      items: [
        "4 Reels estratégicos por mês",
        "Planejamento editorial mensal",
        "Definição de temas e roteiros",
        "1 sessão mensal de captação presencial em Itanhaém",
        "Direção durante a gravação",
        "Edição, legendas e identidade visual",
        "Publicação dos conteúdos",
        "Acompanhamento de performance",
      ],
      note: "A produção de conteúdo é realizada pela Raise One. A gestão da comunidade, incluindo respostas a comentários, mensagens, inbox e relacionamento diário com seguidores, permanece sob responsabilidade da Saúde & Cia.",
    },
    {
      number: "03",
      badge: "Conversão",
      title: "Motor de conversão",
      subtitle: "Transformar atenção em oportunidade mensurável.",
      objective:
        "Instrumentar a jornada digital para que cada visita, clique e contato possa ser rastreado, analisado e otimizado.",
      items: [
        "Revisão e otimização da LP existente",
        "GTM, GA4, eventos e UTMs",
        "Integração WhatsApp e formulários",
        "Mensuração de origem dos leads",
        "Evolução contínua da jornada de conversão",
      ],
    },
  ],

  integrationLayer: {
    title: "Marketing conectado à operação da Saúde & Cia",
    body: "A Raise One é responsável pela estratégia, produção de conteúdo, gestão de mídia paga, infraestrutura de conversão e mensuração. A Saúde & Cia permanece responsável pelo atendimento aos clientes, relacionamento nas redes sociais, propostas e fechamento comercial. Estruturamos a conexão entre os dois lados para que cada lead gerado possa ser rastreado e analisado junto aos resultados da operação.",
    r1: ["Estratégia", "Produção de conteúdo", "Google Ads", "Conversão", "Dados", "Otimização"],
    client: ["Atendimento", "Relacionamento nas redes", "Proposta", "Venda"],
  },

  expansion: {
    number: "04",
    title: "Expansão orientada por dados",
    subtitle: "Ativada após validação do primeiro ciclo.",
    items: [
      "Novas landing pages por produto/intenção",
      "Remarketing e Meta Ads",
      "Conteúdo avançado e novas pautas",
      "Expansão geográfica, quando houver evidência de demanda e capacidade operacional",
      "Automações quando o volume justificar",
    ],
    conditional: true,
  },

  lpStrategy: {
    title: "Landing page: laboratório de conversão",
    now: "Aproveitamos a landing page já em desenvolvimento pela Maíra. Nosso papel é instrumentar tracking, medir conversões e otimizar a jornada para transformar visitas em oportunidades.",
    later:
      "Com histórico de performance, landing pages específicas por produto entram no plano quando os dados confirmarem onde vale concentrar investimento.",
  },

  capacity: {
    title: "Crescer sem quebrar a operação",
    body: "A escala de mídia acompanha a capacidade da operação. O objetivo é crescer de forma sustentável: de 10 para 20, 30 e 40 oportunidades por mês, com visibilidade em cada etapa.",
  },

  metrics: {
    acquisition: ["Impressões", "Cliques", "CTR", "CPC", "Investimento", "Leads", "CPL"],
    content: ["Alcance", "Visualizações", "Retenção", "Interações", "Crescimento orgânico"],
    conversion: [
      "Conversões da LP",
      "Cliques no WhatsApp",
      "Formulários",
      "Origem dos leads",
      "Produto procurado",
    ],
    business: [
      "Vendas informadas",
      "Taxa de conversão",
      "CAC estimado",
      "Receita",
    ],
    note: "As métricas de negócio dependem do retorno da equipe comercial da Saúde & Cia. Juntos, cruzamos dados de marketing com o que acontece no atendimento e na venda. CAC estimado e receita entram na análise quando houver histórico suficiente.",
  },

  exclusions: {
    wont: [
      "Atendimento, proposta e fechamento comercial (permanecem com a Saúde & Cia)",
      "Gestão de comunidade: comentários, inbox e relacionamento diário nas redes",
      "Implantação ou gestão de CRM neste primeiro ciclo",
      "Anunciar todos os produtos ao mesmo tempo",
      "Criar várias landing pages antes de validar o canal",
      "Aumentar investimento em mídia antes de ter dados",
      "Garantir volume específico de vendas",
      "Escalar demanda além da capacidade operacional",
    ],
    will: "Conteúdo constrói autoridade. Mídia captura demanda. Tecnologia transforma atenção em oportunidade. Dados mostram onde crescer.",
  },

  roadmap: [
    {
      period: "Mês 01",
      title: "Fundação",
      items: [
        "Tracking e LP",
        "Google Ads",
        "Calendário editorial",
        "Primeira captação",
        "Primeiros conteúdos",
        "Mensuração",
      ],
    },
    {
      period: "Mês 02",
      title: "Validação",
      items: [
        "Campanhas e termos",
        "Produtos prioritários",
        "Conteúdos e leads",
        "Conversões",
        "Retorno da operação",
      ],
    },
    {
      period: "Mês 03",
      title: "Otimização",
      items: [
        "Campanhas",
        "LP e mensagens",
        "Conteúdo",
        "Públicos",
        "Remarketing inicial",
      ],
    },
    {
      period: "Mês 04+",
      title: "Expansão",
      items: [
        "Novas LPs",
        "Meta Ads",
        "Conteúdo avançado",
        "Novos produtos",
        "Novas regiões (com evidência e capacidade)",
      ],
    },
  ],

  deliverables: [
    {
      title: "Estratégia",
      items: [
        "Diagnóstico e plano de ação",
        "Definição de prioridades",
        "Planejamento de aquisição e conteúdo",
        "Reuniões e acompanhamento estratégico",
      ],
    },
    {
      title: "Infraestrutura",
      items: [
        "Revisão e otimização da LP",
        "GTM, GA4, conversões e UTMs",
        "Mensuração de origem",
        "Monitoramento da jornada digital",
      ],
    },
    {
      title: "Aquisição",
      items: [
        "Google Ads Search",
        "Pesquisa de demanda",
        "Campanhas e otimizações",
        "Relatórios e análise de performance",
      ],
    },
    {
      title: "Conteúdo",
      items: [
        "4 Reels estratégicos por mês",
        "Calendário editorial",
        "Roteiros e 1 sessão de captação mensal",
        "Edição, publicação e performance",
      ],
    },
  ],

  vision: {
    title: "O que vamos construir",
    today: "Indicação → Cliente",
    next: "Conteúdo + Mídia → LP → Lead → Saúde & Cia → Dados → Otimização",
    future: "Demanda + Autoridade + Conversão + Retenção + Expansão",
  },

  closing: [
    "A Saúde & Cia já construiu aquilo que nenhuma campanha consegue comprar: experiência, confiança e presença no mercado.",
    "O próximo passo é construir presença digital que atraia atenção, transformar essa atenção em demanda e criar a infraestrutura para entender o que realmente gera negócio.",
    "A partir daí, crescimento deixa de depender apenas de indicação e passa a ser uma operação que podemos medir, aprender e evoluir juntos.",
  ],

  nextSteps: [
    "Aprovação do plano estratégico",
    "Assinatura do contrato",
    "Reunião de kick-off",
    "Liberação de acessos e materiais",
    "Início da fase de fundação",
  ],

  cta: {
    label: "Quero avançar com este plano",
    message:
      "Olá! Revisei a proposta estratégica da Raise One para a Saúde & Cia e gostaria de avançar.",
  },
} as const;

export const SAUDE_CIA_NAV = [
  { id: "descobertas", label: "Descobertas" },
  { id: "diagnostico", label: "Ponto de partida" },
  { id: "gargalo", label: "Desafio" },
  { id: "estrategia", label: "Solução" },
  { id: "metricas", label: "Métricas" },
  { id: "roadmap", label: "Roadmap" },
  { id: "entregaveis", label: "Entregáveis" },
  { id: "investimento", label: "Investimento" },
  { id: "visao", label: "Visão" },
  { id: "proximos-passos", label: "Próximos passos" },
];
