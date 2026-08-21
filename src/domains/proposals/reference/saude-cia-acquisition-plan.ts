/** Plano de Aquisição · Saúde & Cia (alternativa de entrada) */

export const SAUDE_CIA_ACQUISITION_PLAN = {
  company: "Saúde & Cia",
  client: "Angélica",
  planName: "Plano de Aquisição",

  hero: {
    eyebrow: "Plano de Aquisição",
    headline: "Colocar a Saúde & Cia diante de quem já está procurando.",
    lead: "Gestão estratégica de Google Ads para capturar demanda existente e gerar oportunidades comerciais.",
    price: "R$ 997/mês",
    priceNote: "Gestão mensal · verba de mídia à parte",
    ctaLabel: "Quero começar com Google Ads",
    ctaMessage:
      "Olá! Revisei o Plano de Aquisição da Raise One para a Saúde & Cia e gostaria de avançar.",
  },

  context: {
    title: "Contexto",
    lead: "Nem todo cliente precisa descobrir a Saúde & Cia. Alguns já estão procurando exatamente o que ela oferece.",
    flow: ["Busca", "Anúncio", "Clique", "WhatsApp / LP", "Lead"] as const,
  },

  included: {
    title: "O que vamos fazer",
    packageTitle: "Gestão de Google Ads",
    items: [
      "Pesquisa de demanda e intenção de busca",
      "Definição dos produtos prioritários",
      "Estruturação das campanhas Search",
      "Criação e otimização dos anúncios",
      "Configuração de conversões",
      "Análise de termos de pesquisa",
      "Gestão e otimização das campanhas",
      "Controle de orçamento",
      "Relatórios e análise de performance",
    ],
  },

  exclusions: {
    title: "Escopo",
    r1Role: "A Raise One será responsável pela gestão e otimização das campanhas.",
    clientRole: "A Saúde & Cia permanece responsável por:",
    clientItems: [
      "Atendimento dos leads",
      "Resposta no WhatsApp",
      "Propostas",
      "Negociação",
      "Fechamento",
      "Retorno sobre qualidade dos leads",
    ],
    note: "A verba de mídia é paga diretamente ao Google e não está incluída na mensalidade da Raise One.",
  },

  media: {
    title: "Investimento inicial em mídia",
    amount: "R$ 1.000 no primeiro mês",
    note: "Pago diretamente ao Google. Começamos com uma verba controlada para validar demanda, produtos, mensagens e custo por oportunidade antes de considerar qualquer expansão.",
    firstMonthTotalLabel: "Custo estimado no primeiro mês",
    firstMonthTotal: "R$ 1.997",
    firstMonthBreakdown: "R$ 997 Raise One + R$ 1.000 Google",
    ongoingLabel: "Nos meses seguintes",
    ongoingValue: "R$ 997/mês + verba Google",
  },

  metrics: {
    title: "O que vamos acompanhar",
    items: [
      "Impressões",
      "Cliques",
      "CTR",
      "CPC",
      "Investimento",
      "Leads",
      "CPL",
      "Termos de pesquisa",
      "Conversões",
    ],
    note: "O desempenho comercial final depende também do atendimento, proposta e fechamento realizados pela Saúde & Cia.",
  },

  investment: {
    title: "Investimento",
    planLabel: "Plano de Aquisição",
    amount: "R$ 997/mês",
    highlights: [
      "Gestão e otimização Google Ads",
      "Pesquisa de demanda",
      "Campanhas Search",
      "Conversões e relatórios",
      "Análise de performance",
    ],
    note: "Mensalidade da Raise One. A verba de mídia é paga diretamente ao Google.",
  },

  closing: {
    title: "Começamos pela aquisição.",
    body: "Se o objetivo neste momento é gerar novas oportunidades através da demanda que já existe no Google, podemos começar pela gestão de tráfego e evoluir a operação posteriormente.",
    upgrade:
      "Este plano pode evoluir posteriormente para uma operação integrada de conteúdo, aquisição e conversão.",
    ctaLabel: "Quero começar com Google Ads",
  },
} as const;

export const SAUDE_CIA_ACQUISITION_PLAN_NAV = [
  { id: "contexto", label: "Contexto" },
  { id: "incluso", label: "O que vamos fazer" },
  { id: "escopo", label: "Escopo" },
  { id: "midia", label: "Mídia" },
  { id: "metricas", label: "Métricas" },
  { id: "investimento", label: "Investimento" },
  { id: "proximos-passos", label: "Próximos passos" },
];
