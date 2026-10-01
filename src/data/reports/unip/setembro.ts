import dashSetembro from "@/assets/reports/unip/google-ads-setembro.png";
import type { ReportMonth } from "../types";

export const unipSetembro: ReportMonth = {
  slug: "setembro",
  monthLabel: "Setembro",
  cycleLabel: "3º mês · Ciclo 03",
  cycleShort: "3º Mês",
  headerPeriod: "Set · 2026",
  period: "01/09 a 30/09/2026",
  periodShort: "01/09 a 30/09",
  dashboardPeriodLabel: "01 set a 30 set · 2026",
  heroSubtitle:
    "Este relatório apresenta os resultados do terceiro ciclo de campanhas no Google Ads para o Polo UNIP Caraguatatuba. O crédito promocional de R$ 4.500 foi liberado, a entrega seguiu estável o mês inteiro e as métricas de eficiência melhoraram de novo: mais conversões, menor custo por contato.",
  heroEmphasis: "terceiro ciclo",
  metaChips: [
    { k: "Período", v: "01/09 a 30/09" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Litoral Norte · SP" },
    { k: "Ciclo", v: "3º mês" },
  ],
  overviewIntro:
    "Em 30 dias sem pausas, com orçamento de R$ 72/dia, a campanha gerou 306 conversões a R$ 7,10 por contato. Em relação a agosto: mais cliques, mais conversões, CTR e taxa de conversão maiores, CPC e custo por conversão menores, com investimento um pouco menor.",
  overviewHighlight:
    "O crédito promocional de R$ 4.500 foi liberado entre 26 e 27/09. Em setembro foram consumidos R$ 315,02 desse crédito. A campanha segue limitada pelo orçamento. Por enquanto, a recomendação é manter o ritmo e aproveitar o crédito restante.",
  kpis: [
    {
      value: "9.846",
      label: "Impressões",
      description: "Presença contínua no Google no Litoral Norte, com CTR mais alto que em agosto.",
      accent: "blue",
    },
    {
      value: "822",
      label: "Cliques",
      description: "+14% vs. agosto (724), com CPC médio de R$ 2,64.",
      accent: "red",
    },
    {
      value: "306",
      label: "Conversões",
      description: "+25% vs. agosto (244), com taxa de conversão de 37,23%.",
      accent: "yellow",
    },
    {
      value: "R$2,2K",
      label: "Investimento",
      description: "R$ 2.173,19 no ciclo, sendo R$ 315,02 em crédito promocional.",
      accent: "green",
    },
  ],
  dashboardSrc: dashSetembro,
  agencyWork: {
    intro:
      "Com o crédito liberado no final do mês, o foco do ciclo 03 foi manter a entrega estável, acompanhar métricas diárias e garantir que o bônus do Google entrasse em operação sem interromper a campanha.",
    items: [
      "Monitoramento diário de entrega, custos, CTR, CPC e conversões",
      "Acompanhamento do status e liberação do crédito promocional de R$ 4.500",
      "Gestão do consumo inicial do crédito (R$ 315,02 em setembro)",
      "Otimização contínua de termos e palavras-chave de maior intenção",
      "Negativação de termos irrelevantes para o objetivo do Polo",
      "Manutenção da estrutura em 3 grupos: Faculdade EAD, Cursos e Pós-Graduação",
      "Acompanhamento de score de otimização e alerta de limitação por orçamento",
    ],
  },
  campaignsNote:
    "Uma campanha de Rede de Pesquisa (Captação de Demanda), segmentada em 3 grupos de anúncios. Faculdade EAD segue como motor principal de volume.",
  campaignsIntro:
    "O recorte por grupo mostra onde o investimento rende. Faculdade EAD concentra o volume; Cursos e Pós-Graduação convertem bem em escala menor, com custo por conversão competitivo.",
  campaignsInsight:
    "O Grupo 1 (Faculdade EAD) responde por cerca de 92% das conversões (280 de 306). Cursos e Pós, juntos, entregam 26 conversões com custo por contato entre R$ 6,14 e R$ 6,36: eficiência alta, volume ainda complementar.",
  campaigns: [
    {
      id: "ead",
      name: "Grupo 1 · Faculdade EAD",
      subtitle: "Termos gerais · graduação EAD · polo local",
      accent: "blue",
      iconKey: "search",
      metrics: {
        impressions: 8869,
        clicks: 759,
        conversions: 280,
        cost: 2012.31,
        cpc: 2.65,
        costPerConv: 7.18,
        convRate: 36.9,
      },
    },
    {
      id: "cursos",
      name: "Grupo 2 · Cursos",
      subtitle: "Intenção por cursos específicos",
      accent: "yellow",
      iconKey: "sparkles",
      metrics: {
        impressions: 742,
        clicks: 40,
        conversions: 17,
        cost: 106.84,
        cpc: 2.67,
        costPerConv: 6.14,
        convRate: 43.5,
      },
    },
    {
      id: "pos",
      name: "Grupo 3 · Pós-Graduação",
      subtitle: "Especializações e pós",
      accent: "green",
      iconKey: "target",
      metrics: {
        impressions: 235,
        clicks: 23,
        conversions: 9,
        cost: 54.04,
        cpc: 2.35,
        costPerConv: 6.36,
        convRate: 37.0,
      },
    },
  ],
  comparison: {
    leftLabel: "2º mês",
    rightLabel: "3º mês",
    intro:
      "Com o mesmo orçamento diário (R$ 72) e zero pausas, setembro entregou mais eficiência: mais cliques e conversões, CTR e taxa de conversão maiores, CPC e custo por conversão menores, com investimento ligeiramente menor.",
    warning:
      "A campanha continua limitada pelo orçamento. Há demanda adicional não capturada. Por enquanto, faz sentido manter a diária e usar o crédito para ampliar entrega com menos pressão no caixa.",
    prev: {
      impressions: 10404,
      clicks: 724,
      conversions: 244,
      cost: 2287.78,
      cpc: 3.16,
      costPerConv: 9.38,
      convRate: 33.7,
      ctr: 6.96,
    },
    current: {
      impressions: 9846,
      clicks: 822,
      conversions: 306,
      cost: 2173.19,
      cpc: 2.64,
      costPerConv: 7.1,
      convRate: 37.23,
      ctr: 8.35,
    },
  },
  investment: {
    intro:
      "O investimento no período foi de R$ 2.173,19. Desse total, R$ 315,02 vieram do crédito promocional liberado no final de setembro e R$ 1.858,17 foram investidos via meio de pagamento da conta. Em 01/10, o Google cobrou automaticamente R$ 1.857,86 referente ao saldo do período.",
    mediaCostDisplay: "R$ 2.173",
    daysLabel: "30 dias",
    bars: [
      {
        label: "Pago em dinheiro",
        value: "R$ 1.858",
        pct: 85,
        note: "Cobrados em 01/10 pela cobrança automática do Google (≈ R$ 1.857,86).",
      },
      {
        label: "Crédito promocional",
        value: "R$ 315",
        pct: 15,
        note: "Consumo do bônus de R$ 4.500 liberado em 26/27 de setembro.",
        muted: true,
      },
    ],
    sideNotes: [
      "O limite de cobrança da conta está em R$ 2.000. O Google cobra ao atingir esse limite ou no primeiro dia de cada mês.",
      "Mesmo com investimento um pouco menor que em agosto, o ciclo gerou 62 conversões a mais e reduziu o custo por contato de R$ 9,38 para R$ 7,10.",
    ],
    proofTitle: "Insight",
    proofText:
      "Estabilidade + crédito em operação = eficiência crescente. O CPC caiu de R$ 3,16 para R$ 2,64 e o custo por conversão de R$ 9,38 para R$ 7,10.",
  },
  reach: {
    highlightNumber: "9.846",
    intro:
      "O Polo apareceu quase 10 mil vezes no Google em setembro. A entrega permanece 100% no Litoral Norte. Caraguatatuba concentra volume e também a melhor eficiência entre as três cidades.",
    cards: [
      {
        title: "Caraguatatuba lidera",
        text: "6.324 impressões, 544 cliques e 221 conversões (cerca de 72% dos contatos), com custo/conv. de R$ 6,70 e taxa de 40,63%.",
        iconKey: "mapPin",
      },
      {
        title: "São Sebastião estável",
        text: "2.533 impressões, 213 cliques e 69 conversões. CTR de 8,41% e custo/conv. de R$ 7,68.",
        iconKey: "trendingUp",
      },
      {
        title: "Ilhabela complementar",
        text: "989 impressões, 65 cliques e 16 conversões. Volume menor e custo/conv. de R$ 10,19 neste ciclo.",
        iconKey: "target",
      },
    ],
  },
  clicks: {
    highlightNumber: "822",
    titleAfter: "acessos qualificados ao site",
    intro:
      "Mais cliques que em agosto, com CTR subindo de 6,96% para 8,35%. Quase 91% do tráfego veio de smartphones: a jornada continua mobile-first.",
    funnel: [
      { label: "Viram o anúncio", value: 9846, max: 9846, accent: "blue" },
      { label: "Clicaram para saber mais", value: 822, max: 9846, accent: "red" },
      { label: "Conversão registrada", value: 306, max: 9846, accent: "yellow" },
    ],
    cpcDisplay: "R$ 2,64",
    cpcBadge: "−16% vs. 2º mês",
    cpcNote:
      "O CPC médio caiu de R$ 3,16 para R$ 2,64. Com taxa de conversão de 37,23%, o custo por contato ficou em R$ 7,10.",
    miniStats: [
      { v: "9.846", l: "Vistas" },
      { v: "822", l: "Cliques" },
      { v: "306", l: "Conversões" },
    ],
  },
  audience: {
    intro:
      "O público segue alinhado à captação do Polo: predominância feminina, pico em 35 a 44 anos, forte presença em 25 a 54, e entrega 100% no Litoral Norte.",
    cards: [
      {
        title: "Gênero e idade",
        big: "Mulheres 35 a 44",
        text: "O mapa de sexo e idade aponta o maior volume de conversões em mulheres de 35 a 44 anos, seguidas por 45 a 54 e 25 a 34. Base em 77% das conversões com demografia conhecida.",
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
        text: "221 + 69 + 16 conversões. Toda a entrega na área de atuação do Polo, sem desperdício fora do Litoral Norte.",
        iconKey: "mapPin",
      },
      {
        title: "Dispositivo",
        big: "91% mobile",
        text: "Smartphones concentram cerca de 91% de cliques e custo. Computadores ficam em torno de 8%. A experiência mobile da LP segue crítica.",
        iconKey: "search",
      },
    ],
  },
  funnel: {
    intro:
      "O funil de mídia segue saudável e melhorando. Do lado comercial, a Viviane compartilhou um retorno positivo sobre o último ciclo.",
    steps: [
      { label: "Impressão", value: "9.846" },
      { label: "Clique", value: "822" },
      { label: "Interesse", value: "306" },
      { label: "Matrícula", value: "?" },
    ],
    afterTitle: "Retorno comercial",
    afterText:
      "Em conversa com a Viviane, ela comentou que conseguiram atingir cerca de 50% da meta no último ciclo e demonstrou satisfação com os resultados. Ainda não temos o detalhamento formal de matrículas atribuídas à campanha, o que pode ser aprofundado naturalmente ao longo dos próximos ciclos.",
  },
  strategy: {
    title: "Eficiência em alta.",
    titleSoft: "Crédito liberado e demanda consistente.",
    intro:
      "Setembro confirma a tendência: com orçamento estável, a campanha gera mais contatos a custo menor. O crédito promocional entrou em operação e amplia a capacidade de entrega sem aumentar a pressão no caixa.",
    badTitle: "O que ainda limita",
    badItems: [
      "Campanha limitada pelo orçamento: demanda não capturada",
      "Crédito liberado só no final do mês: impacto parcial em setembro",
      "Ilhabela com eficiência abaixo das outras cidades neste ciclo",
      "Detalhamento de matrículas ainda em construção no acompanhamento comercial",
    ],
    goodTitle: "O que já funciona",
    goodItems: [
      "306 conversões em 30 dias (+25% vs. agosto)",
      "Custo por conversão em R$ 7,10 (−24% vs. agosto)",
      "CTR de 8,35% e taxa de conversão de 37,23%",
      "Zero dias de pausa, com entrega contínua",
      "Crédito de R$ 4.500 liberado e já em uso",
      "Retorno positivo da Viviane (≈ 50% da meta no último ciclo)",
    ],
    extraTitle: "Recomendação para o ciclo 04",
    extraText:
      "Manter R$ 72/dia por enquanto e aproveitar o crédito restante para ampliar a entrega sem pressionar o caixa. Um eventual aumento de orçamento diário pode ser avaliado com calma nos próximos ciclos, conforme a operação e o acompanhamento comercial forem evoluindo.",
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
        value: "R$ 2.173",
        note: "R$ 1.858 em dinheiro + R$ 315 de crédito promocional.",
      },
      {
        label: "Próximo passo",
        value: "Manter",
        note: "Seguir com R$ 72/dia e usar o crédito para ampliar entrega com menos pressão no caixa.",
        highlight: true,
      },
    ],
  },
  opportunity: {
    highlight: "R$ 4.500",
    titleAfter: "em crédito, já liberados",
    intro:
      "O crédito promocional de R$ 4.500 foi liberado entre 26 e 27 de setembro. Em setembro foram consumidos R$ 315,02. O saldo restante segue disponível para ampliar a divulgação com custo real menor nos próximos ciclos.",
    investTarget: "R$ 4.500",
    deadline: "Liberado em 26/27 set · em uso",
    bonus: "R$ 4.185",
    progressDisplay: "R$ 315 consumidos · ≈ R$ 4.185 restantes",
    progressPct: 7,
    remaining: "≈ R$ 4.185",
    cards: [
      {
        label: "Crédito liberado",
        value: "R$ 4.500",
        desc: "Disponibilizado pelo Google no fim de setembro",
      },
      {
        label: "Consumido em setembro",
        value: "R$ 315",
        desc: "Uso parcial após a liberação (26/27 set)",
      },
      {
        label: "Saldo estimado",
        value: "≈ R$ 4.185",
        desc: "Disponível para os próximos ciclos",
      },
    ],
    howToTitle: "Como usar o crédito",
    howToText:
      "Manter a campanha rodando sem zerar saldo e deixar o crédito reduzir o custo efetivo de mídia. É a forma mais confortável de ampliar alcance agora, sem aumentar a pressão no cartão.",
    creditsTitle: "Dinâmica de cobrança",
    creditsText:
      "A conta tem limite de cobrança de R$ 2.000. O Google cobra ao atingir esse limite ou no primeiro dia do mês. Em 01/10 foram cobrados R$ 1.857,86 referentes ao investimento em dinheiro do período.",
  },
  conclusion: {
    title: "Mais conversões.",
    titleSoft: "Menor custo. Crédito em operação.",
    intro:
      "O terceiro ciclo mostra a campanha madura: eficiência melhor, crédito liberado e retorno comercial positivo. O caminho natural agora é manter a estabilidade e aproveitar o crédito.",
    items: [
      {
        n: "01",
        title: "Performance",
        text: "306 conversões a R$ 7,10. Mais contatos que agosto, com investimento menor e CPC mais baixo.",
      },
      {
        n: "02",
        title: "Crédito ativo",
        text: "R$ 4.500 liberados. R$ 315 usados em setembro. Saldo alto para ampliar entrega nos próximos meses.",
      },
      {
        n: "03",
        title: "Sinal comercial",
        text: "Viviane indicou cerca de 50% da meta no último ciclo e demonstrou satisfação com os resultados.",
      },
      {
        n: "04",
        title: "Próximo ciclo",
        text: "Manter R$ 72/dia, aproveitar o crédito restante e avaliar qualquer aumento de volume com calma.",
      },
    ],
    quote:
      "A mídia está mais eficiente e o crédito do Google já está rodando. Seguir estável, ampliar com o bônus e acompanhar a evolução comercial no ritmo do Polo.",
  },
  footerLabel:
    "Relatório de performance · Ciclo 03 · Google Ads · 01/09 a 30/09/2026 · UNIP Polo Caraguatatuba",
};
