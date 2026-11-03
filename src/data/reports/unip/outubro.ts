import dashOutubro from "@/assets/reports/unip/google-ads-outubro.png";
import type { ReportMonth } from "../types";

export const unipOutubro: ReportMonth = {
  slug: "outubro",
  monthLabel: "Outubro",
  cycleLabel: "4º mês · Ciclo 04",
  cycleShort: "4º Mês",
  headerPeriod: "Out · 2026",
  period: "01/10 a 31/10/2026",
  periodShort: "01/10 a 31/10",
  dashboardPeriodLabel: "01 out a 31 out · 2026",
  heroSubtitle:
    "Este relatório apresenta os resultados do quarto ciclo de campanhas no Google Ads para o Polo UNIP Caraguatatuba. Com orçamento estável e zero pausas, a entrega manteve o ritmo: 315 conversões a R$ 6,95. O destaque do mês é operacional e financeiro: 100% do investimento saiu do crédito promocional do Google.",
  heroEmphasis: "quarto ciclo",
  metaChips: [
    { k: "Período", v: "01/10 a 31/10" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Litoral Norte · SP" },
    { k: "Ciclo", v: "4º mês" },
  ],
  overviewIntro:
    "Em 31 dias sem pausas, com orçamento de R$ 72/dia, a campanha gerou 315 conversões a R$ 6,95 por contato. Em relação a setembro: mais impressões, mais cliques e mais conversões, com CPC e custo por conversão um pouco menores. Score de otimização em 100%.",
  overviewHighlight:
    "Todo o custo de outubro (R$ 2.189,04) foi coberto pelo crédito promocional. Não houve cobrança em dinheiro no ciclo. O crédito de R$ 4.500 segue ativo, com cerca de R$ 1.805 restantes e vencimento em 24/11/2026. A campanha continua limitada pelo orçamento: há espaço para escalar volume enquanto o bônus dura.",
  kpis: [
    {
      value: "10.393",
      label: "Impressões",
      description: "+5,6% vs. setembro (9.846), com presença contínua no Litoral Norte.",
      accent: "blue",
    },
    {
      value: "854",
      label: "Cliques",
      description: "+3,9% vs. setembro (822), com CPC médio de R$ 2,56.",
      accent: "red",
    },
    {
      value: "315",
      label: "Conversões",
      description: "+2,9% vs. setembro (306), com taxa de conversão de 36,89%.",
      accent: "yellow",
    },
    {
      value: "R$2,2K",
      label: "Investimento",
      description: "R$ 2.189,04 no ciclo, 100% crédito promocional, R$ 0 em dinheiro.",
      accent: "green",
    },
  ],
  dashboardSrc: dashOutubro,
  agencyWork: {
    intro:
      "No ciclo 04, com o crédito já em operação plena, a gestão manteve a campanha estável, acompanhou o consumo do bônus e seguiu o ritual diário de otimização para preservar eficiência com orçamento limitado.",
    items: [
      "Monitoramento diário de entrega, custos, CTR, CPC e conversões",
      "Acompanhamento do consumo do crédito promocional (100% do custo do mês)",
      "Revisão e otimização contínua de palavras-chave e termos de pesquisa",
      "Negativação de termos irrelevantes para o objetivo do Polo",
      "Ajuste fino de anúncios, extensões e relevância das criativas",
      "Análise de desempenho por grupo, localização, dispositivo e demografia",
      "Gestão de lances e orçamento diário (R$ 72), com alerta de limitação por orçamento",
      "Manutenção da estrutura em 3 grupos: Faculdade EAD, Cursos e Pós-Graduação",
      "Acompanhamento de score de otimização (100% no ciclo)",
    ],
  },
  campaignsNote:
    "Uma campanha de Rede de Pesquisa (Captação de Demanda), segmentada em 3 grupos de anúncios. Faculdade EAD segue como motor principal de volume.",
  campaignsIntro:
    "O recorte por grupo confirma o padrão dos ciclos anteriores. Faculdade EAD concentra o volume; Cursos e Pós-Graduação entregam menos escala, mas com custo por conversão ainda mais competitivo.",
  campaignsInsight:
    "O Grupo 1 (Faculdade EAD) responde por cerca de 91% das conversões (287 de 315). Cursos e Pós, juntos, entregam 26 conversões: Cursos a R$ 6,14 e Pós a R$ 4,47 por contato, com eficiência alta em escala complementar.",
  campaigns: [
    {
      id: "ead",
      name: "Grupo 1 · Faculdade EAD",
      subtitle: "Termos gerais · graduação EAD · polo local",
      accent: "blue",
      iconKey: "search",
      metrics: {
        impressions: 9550,
        clicks: 798,
        conversions: 287,
        cost: 2038.2,
        cpc: 2.55,
        costPerConv: 7.08,
        convRate: 36.07,
      },
    },
    {
      id: "cursos",
      name: "Grupo 2 · Cursos",
      subtitle: "Intenção por cursos específicos",
      accent: "yellow",
      iconKey: "sparkles",
      metrics: {
        impressions: 582,
        clicks: 38,
        conversions: 17,
        cost: 108.39,
        cpc: 2.85,
        costPerConv: 6.14,
        convRate: 46.49,
      },
    },
    {
      id: "pos",
      name: "Grupo 3 · Pós-Graduação",
      subtitle: "Especializações e pós",
      accent: "green",
      iconKey: "target",
      metrics: {
        impressions: 261,
        clicks: 18,
        conversions: 9,
        cost: 42.46,
        cpc: 2.36,
        costPerConv: 4.47,
        convRate: 52.78,
      },
    },
  ],
  comparison: {
    leftLabel: "3º mês",
    rightLabel: "4º mês",
    intro:
      "Com o mesmo orçamento diário (R$ 72) e zero pausas, outubro consolidou o patamar de setembro: um pouco mais de volume, CPC e custo por conversão levemente melhores. A grande diferença está no caixa: o mês inteiro rodou no crédito.",
    warning:
      "A campanha segue limitada pelo orçamento. Há demanda adicional não capturada. Com o crédito vencendo em 24/11, faz sentido avaliar um aumento de diária em novembro para acelerar o uso do saldo restante.",
    prev: {
      impressions: 9846,
      clicks: 822,
      conversions: 306,
      cost: 2173.19,
      cpc: 2.64,
      costPerConv: 7.1,
      convRate: 37.23,
      ctr: 8.35,
    },
    current: {
      impressions: 10393,
      clicks: 854,
      conversions: 315,
      cost: 2189.04,
      cpc: 2.56,
      costPerConv: 6.95,
      convRate: 36.89,
      ctr: 8.22,
    },
  },
  investment: {
    intro:
      "O investimento no período foi de R$ 2.189,04, integralmente coberto pelo crédito promocional. Não houve desembolso via meio de pagamento da conta neste ciclo e, por isso, não houve cobrança automática em 01/11 referente a outubro.",
    mediaCostDisplay: "R$ 2.189",
    daysLabel: "31 dias",
    bars: [
      {
        label: "Crédito promocional",
        value: "R$ 2.189",
        pct: 100,
        note: "100% do custo de outubro. Sem pressão no cartão neste ciclo.",
      },
      {
        label: "Pago em dinheiro",
        value: "R$ 0",
        pct: 0,
        note: "Nenhuma cobrança automática em 01/11 referente a este período.",
        muted: true,
      },
    ],
    sideNotes: [
      "Do crédito total de R$ 4.500, já foram consumidos cerca de R$ 2.695 (≈ 60%). Saldo estimado: R$ 1.805.",
      "Vencimento do crédito: 24/11/2026. A janela para usar o restante com conforto é curta.",
    ],
    proofTitle: "Insight",
    proofText:
      "Mesmo volume de conversões, com o custo do mês integralmente coberto pelo crédito. O CPC caiu para R$ 2,56 e o custo por conversão para R$ 6,95, com a campanha ainda limitada pelo orçamento.",
  },
  reach: {
    highlightNumber: "10.393",
    intro:
      "O Polo apareceu mais de 10 mil vezes no Google em outubro. A entrega permanece 100% no Litoral Norte. Caraguatatuba lidera volume; Ilhabela foi o destaque de eficiência neste ciclo.",
    cards: [
      {
        title: "Caraguatatuba lidera",
        text: "6.409 impressões, 542 cliques e 206,5 conversões (cerca de 66% dos contatos), com custo/conv. de R$ 6,81 e taxa de 37,75%.",
        iconKey: "mapPin",
      },
      {
        title: "São Sebastião estável",
        text: "2.962 impressões, 217 cliques e 70,5 conversões. CTR de 7,33% e custo/conv. de R$ 7,75.",
        iconKey: "trendingUp",
      },
      {
        title: "Ilhabela em alta",
        text: "1.022 impressões, 95 cliques e 38 conversões. Melhor eficiência do mês: CTR 9,30%, taxa 40% e custo/conv. de R$ 6,22.",
        iconKey: "target",
      },
    ],
  },
  clicks: {
    highlightNumber: "854",
    titleAfter: "acessos qualificados ao site",
    intro:
      "Mais cliques que em setembro, com CTR em 8,22%. Cerca de 92% do tráfego veio de smartphones: a jornada continua mobile-first.",
    funnel: [
      { label: "Viram o anúncio", value: 10393, max: 10393, accent: "blue" },
      { label: "Clicaram para saber mais", value: 854, max: 10393, accent: "red" },
      { label: "Conversão registrada", value: 315, max: 10393, accent: "yellow" },
    ],
    cpcDisplay: "R$ 2,56",
    cpcBadge: "−3% vs. 3º mês",
    cpcNote:
      "O CPC médio caiu de R$ 2,64 para R$ 2,56. Com taxa de conversão de 36,89%, o custo por contato ficou em R$ 6,95.",
    miniStats: [
      { v: "10.393", l: "Vistas" },
      { v: "854", l: "Cliques" },
      { v: "315", l: "Conversões" },
    ],
  },
  audience: {
    intro:
      "O público segue alinhado à captação do Polo: predominância feminina (172 conversões), pico em 35 a 44 anos, forte presença em 25 a 54, e entrega 100% no Litoral Norte.",
    cards: [
      {
        title: "Gênero e idade",
        big: "Mulheres 35 a 44",
        text: "Feminino lidera com 172 conversões (423 cliques). Na idade, o pico está em 35 a 44 (66 conversões), seguido por 25 a 34 (55) e 45 a 54 (53). Base com demografia conhecida em cerca de 81% das conversões.",
        iconKey: "users",
      },
      {
        title: "Faixa etária principal",
        big: "25 a 54 anos",
        text: "Concentração clara na faixa de decisão madura, típica de quem busca graduação EAD com suporte presencial no polo.",
        iconKey: "calendar",
      },
      {
        title: "Região de origem",
        big: "Caraguá · S. Sebastião · Ilhabela",
        text: "206,5 + 70,5 + 38 conversões. Toda a entrega na área de atuação do Polo, sem desperdício fora do Litoral Norte.",
        iconKey: "mapPin",
      },
      {
        title: "Dispositivo",
        big: "92% mobile",
        text: "Smartphones concentram cerca de 92% de cliques e custo. Computadores ficam em torno de 7%. A experiência mobile da LP segue crítica.",
        iconKey: "search",
      },
    ],
  },
  funnel: {
    intro:
      "O funil de mídia permanece saudável e estável. Do lado comercial, o detalhamento formal de matrículas atribuídas à campanha continua como ponto a aprofundar com o Polo.",
    steps: [
      { label: "Impressão", value: "10.393" },
      { label: "Clique", value: "854" },
      { label: "Interesse", value: "315" },
      { label: "Matrícula", value: "?" },
    ],
    afterTitle: "Próximo passo comercial",
    afterText:
      "Com quatro ciclos rodando e mais de 300 conversões por mês no patamar atual, o acompanhamento de matrículas e da taxa de aproveitamento comercial ajuda a calibrar orçamento e mensagem com ainda mais precisão.",
  },
  strategy: {
    title: "Estabilidade com crédito.",
    titleSoft: "Hora de usar o saldo antes do vencimento.",
    intro:
      "Outubro confirma o patamar: volume estável, eficiência preservada e investimento do mês coberto pelo crédito. O ponto de atenção agora é temporal: o bônus vence em 24 de novembro.",
    badTitle: "O que ainda limita",
    badItems: [
      "Campanha limitada pelo orçamento: demanda não capturada",
      "Crédito com vencimento em 24/11: saldo de ≈ R$ 1.805 ainda disponível",
      "Detalhamento de matrículas ainda em construção no acompanhamento comercial",
    ],
    goodTitle: "O que já funciona",
    goodItems: [
      "315 conversões em 31 dias (+2,9% vs. setembro)",
      "Custo por conversão em R$ 6,95 (−2% vs. setembro)",
      "100% do investimento coberto pelo crédito promocional",
      "Zero dias de pausa, com entrega contínua",
      "Ilhabela com melhor eficiência do mês (R$ 6,22 / conv.)",
      "Score de otimização em 100%",
    ],
    extraTitle: "Recomendação para o ciclo 05",
    extraText:
      "Avaliar aumento da diária em novembro para acelerar o consumo do crédito restante antes de 24/11, aproveitando a demanda reprimida (campanha limitada pelo orçamento). Depois do crédito, recalibrar o orçamento com base no caixa e no retorno comercial.",
  },
  budget: {
    cards: [
      {
        label: "Orçamento diário",
        value: "R$ 72",
        suffix: "/dia",
        note: "Mantido estável. Campanha segue limitada pelo orçamento.",
      },
      {
        label: "Investido no ciclo",
        value: "R$ 2.189",
        note: "100% crédito promocional. R$ 0 em dinheiro.",
      },
      {
        label: "Próximo passo",
        value: "Escalar",
        note: "Aumentar diária em novembro para usar o saldo (~R$ 1.805) antes de 24/11.",
        highlight: true,
      },
    ],
  },
  opportunity: {
    highlight: "R$ 1.805",
    titleAfter: "restantes no crédito",
    intro:
      "O crédito promocional de R$ 4.500 está ativo. Em outubro, R$ 2.189,04 foram consumidos (100% do custo do mês). Do total concedido, cerca de R$ 2.695 já foram usados (≈ 60%). Restam aproximadamente R$ 1.805, com vencimento em 24/11/2026.",
    investTarget: "R$ 4.500",
    deadline: "Vence em 24/11/2026",
    bonus: "≈ R$ 1.805",
    progressDisplay: "≈ R$ 2.695 consumidos · ≈ R$ 1.805 restantes",
    progressPct: 60,
    remaining: "≈ R$ 1.805",
    cards: [
      {
        label: "Crédito total",
        value: "R$ 4.500",
        desc: "Concedido pelo Google · status ativo",
      },
      {
        label: "Consumido em outubro",
        value: "R$ 2.189",
        desc: "100% do custo de mídia do ciclo",
      },
      {
        label: "Saldo estimado",
        value: "≈ R$ 1.805",
        desc: "Disponível até 24/11/2026",
      },
    ],
    howToTitle: "Como usar o crédito agora",
    howToText:
      "Com a campanha limitada pelo orçamento, o caminho natural é subir a diária em novembro para capturar mais demanda e consumir o saldo antes do vencimento, mantendo o custo real de caixa baixo enquanto o bônus durar.",
    creditsTitle: "Dinâmica de cobrança",
    creditsText:
      "Enquanto o crédito cobre o custo, não há cobrança automática no cartão. Em outubro o desembolso em dinheiro foi R$ 0. Após o esgotamento ou vencimento do crédito, a conta volta ao fluxo normal de cobrança (limite ou 1º dia do mês).",
  },
  conclusion: {
    title: "Volume estável.",
    titleSoft: "Mês coberto pelo crédito. Bônus na reta final.",
    intro:
      "O quarto ciclo mostra a campanha madura e previsível: mais de 300 conversões no mês, eficiência preservada e investimento integralmente coberto pelo crédito. O próximo passo é acelerar o uso do saldo restante antes de 24/11.",
    items: [
      {
        n: "01",
        title: "Performance",
        text: "315 conversões a R$ 6,95. Mais volume que setembro, com CPC e custo por contato um pouco melhores.",
      },
      {
        n: "02",
        title: "Crédito em uso",
        text: "R$ 2.189 cobertos 100% pelo bônus. Saldo ≈ R$ 1.805. Vencimento em 24/11, janela curta para escalar.",
      },
      {
        n: "03",
        title: "Demanda reprimida",
        text: "Campanha limitada pelo orçamento o mês inteiro. Há espaço para mais volume com aumento de diária.",
      },
      {
        n: "04",
        title: "Próximo ciclo",
        text: "Subir orçamento em novembro para consumir o crédito, depois recalibrar conforme caixa e retorno comercial.",
      },
    ],
    quote:
      "A mídia está estável e o crédito pagou o mês inteiro. Agora o movimento certo é acelerar a entrega enquanto o bônus ainda existe, e acompanhar de perto o vencimento em 24/11.",
  },
  footerLabel:
    "Relatório de performance · Ciclo 04 · Google Ads · 01/10 a 31/10/2026 · UNIP Polo Caraguatatuba",
};
