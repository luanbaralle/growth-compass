import dashAgosto from "@/assets/reports/unip/google-ads-agosto.png";
import type { ReportMonth } from "../types";

export const unipAgosto: ReportMonth = {
  slug: "agosto",
  monthLabel: "Agosto",
  cycleLabel: "2º mês · Ciclo 02",
  cycleShort: "2º Mês",
  headerPeriod: "Ago · 2026",
  period: "01/08 a 31/08/2026",
  periodShort: "01/08 a 31/08",
  dashboardPeriodLabel: "01 ago a 31 ago · 2026",
  heroSubtitle:
    "Este relatório apresenta os resultados do segundo ciclo de campanhas no Google Ads para o Polo UNIP Caraguatatuba. A demanda validada no primeiro mês acelerou: mais volume, custo por conversão menor e promoção do Google atingida, com a campanha estável o mês inteiro.",
  heroEmphasis: "segundo ciclo",
  metaChips: [
    { k: "Período", v: "01/08 a 31/08" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Litoral Norte · SP" },
    { k: "Ciclo", v: "2º mês" },
  ],
  overviewIntro:
    "Em 31 dias sem pausas, com orçamento elevado para R$ 72/dia, a campanha de Rede de Pesquisa gerou 244 conversões, mais que o triplo do ciclo 01, com custo por conversão quase pela metade. A demanda no Litoral Norte está validada e em ascensão.",
  overviewHighlight:
    "A campanha está marcada como limitada pelo orçamento: existe demanda adicional que o Google não consegue entregar no teto atual de R$ 72/dia. Antes de escalar volume, o próximo passo é validar com a Viviane como está o funil após o processo comercial.",
  kpis: [
    {
      value: "10,4K",
      label: "Impressões",
      description: "Mais que o dobro do 1º ciclo: o Polo apareceu 10.404 vezes no Google.",
      accent: "blue",
    },
    {
      value: "724",
      label: "Cliques",
      description: "Quase 3× mais acessos qualificados que no ciclo 01 (264).",
      accent: "red",
    },
    {
      value: "244",
      label: "Conversões",
      description: "Triplicou o volume de contatos, com taxa de conversão de 33,70%.",
      accent: "yellow",
    },
    {
      value: "R$2,3K",
      label: "Investimento",
      description: "R$ 2.287,78 investidos para atingir a meta da promoção Google.",
      accent: "green",
    },
  ],
  dashboardSrc: dashAgosto,
  agencyWork: {
    intro:
      "No segundo ciclo a operação saiu da fase de validação para gestão contínua: otimização diária, limpeza de termos e estruturação por grupos de anúncios para direcionar a demanda.",
    items: [
      "Monitoramento diário de entrega, custos, CTR, CPC e custo por conversão",
      "Otimização contínua de termos de pesquisa e palavras-chave de maior intenção",
      "Negativação de termos irrelevantes para o objetivo de captação do Polo",
      "Ajuste de orçamento de R$ 50 para R$ 72/dia visando a meta da promoção Google",
      "Estrutura em 3 grupos de anúncios: Faculdade EAD, Cursos e Pós-Graduação",
      "Acompanhamento de score de otimização (100%) e alertas de limitação por orçamento",
      "Gestão de saldo e progresso até a meta de R$ 3.500 para liberar o crédito promocional",
    ],
  },
  campaignsNote:
    "Uma campanha de Rede de Pesquisa (Captação de Demanda), segmentada em 3 grupos de anúncios. O grupo de Faculdade EAD concentra a maior parte do volume de leads.",
  campaignsIntro:
    "Separar a demanda por intenção ajuda a entender onde o investimento rende mais. Faculdade EAD é o motor de volume; Cursos e Pós-Graduação capturam intenções mais específicas, com menor escala neste ciclo.",
  campaignsInsight:
    "O Grupo 1 (Faculdade EAD) responde por cerca de 94% das conversões. Isso confirma que a busca por graduação EAD com polo local é o principal vetor de demanda, e deve continuar como prioridade de orçamento e criativo.",
  campaigns: [
    {
      id: "ead",
      name: "Grupo 1 · Faculdade EAD",
      subtitle: "Termos gerais · graduação EAD · polo local",
      accent: "blue",
      iconKey: "search",
      metrics: {
        impressions: 9494,
        clicks: 674,
        conversions: 230,
        cost: 2110.97,
        cpc: 3.13,
        costPerConv: 9.18,
        convRate: 34.1,
      },
    },
    {
      id: "cursos",
      name: "Grupo 2 · Cursos",
      subtitle: "Intenção por cursos específicos",
      accent: "yellow",
      iconKey: "sparkles",
      metrics: {
        impressions: 667,
        clicks: 33,
        conversions: 10,
        cost: 105.74,
        cpc: 3.2,
        costPerConv: 10.57,
        convRate: 30.3,
      },
    },
    {
      id: "pos",
      name: "Grupo 3 · Pós-Graduação",
      subtitle: "Especializações e pós",
      accent: "green",
      iconKey: "target",
      metrics: {
        impressions: 245,
        clicks: 17,
        conversions: 4,
        cost: 71.07,
        cpc: 4.18,
        costPerConv: 17.77,
        convRate: 23.5,
      },
    },
  ],
  comparison: {
    leftLabel: "1º mês",
    rightLabel: "2º mês",
    intro:
      "Com orçamento diário maior, zero pausas e a mesma Rede de Pesquisa, o ciclo 02 entregou mais volume com eficiência melhor: CPC e custo por conversão caíram com força enquanto as conversões mais que triplicaram.",
    warning:
      "A campanha está limitada pelo orçamento. Há demanda adicional não capturada. Escalar volume só faz sentido depois de validar com a Viviane o processo comercial e a capacidade de atendimento dos leads.",
    prev: {
      impressions: 3975,
      clicks: 264,
      conversions: 80,
      cost: 1516.22,
      cpc: 5.74,
      costPerConv: 18.95,
      convRate: 30.3,
      ctr: 6.64,
    },
    current: {
      impressions: 10404,
      clicks: 724,
      conversions: 244,
      cost: 2287.78,
      cpc: 3.16,
      costPerConv: 9.38,
      convRate: 33.7,
      ctr: 6.96,
    },
  },
  investment: {
    intro:
      "O investimento no período foi de R$ 2.287,78, acima do planejado de R$ 2.000, com orçamento diário elevado de R$ 50 para R$ 72 justamente para atingir a meta da promoção Google (R$ 3.500 acumulados) e desbloquear o crédito de R$ 4.500.",
    mediaCostDisplay: "R$ 2.288",
    daysLabel: "31 dias",
    bars: [
      {
        label: "Investimento realizado",
        value: "R$ 2.288",
        pct: 100,
        note: "Valor pago ao Google no ciclo, 100% em dinheiro.",
      },
      {
        label: "Orçamento planejado",
        value: "R$ 2.000",
        pct: 87,
        note: "Teto inicial; ultrapassado de forma controlada para liberar a promoção.",
        muted: true,
      },
    ],
    sideNotes: [
      "Diferente do ciclo 01, não houve pausas por verificação ou saldo. A campanha rodou os 31 dias, e o algoritmo respondeu com mais volume e custo por resultado menor.",
      "O aumento de ~51% no investimento gerou ~205% mais conversões. Cada real rende mais neste ciclo do que no anterior.",
    ],
    proofTitle: "Insight",
    proofText:
      "Estabilidade + orçamento adequado = eficiência. O CPC caiu de R$ 5,74 para R$ 3,16 e o custo por conversão de R$ 18,95 para R$ 9,38.",
  },
  reach: {
    highlightNumber: "10.404",
    intro:
      "No segundo ciclo o Polo apareceu no Google mais de 10 mil vezes, mais que o dobro do ciclo 01. A presença se manteve 100% no Litoral Norte, com Caraguatatuba concentrando o maior volume.",
    cards: [
      {
        title: "Caraguatatuba lidera volume",
        text: "6.734 impressões, 461 cliques e 150 conversões: cerca de 61% dos contatos do mês vieram da cidade-sede do Polo.",
        iconKey: "mapPin",
      },
      {
        title: "São Sebastião converte forte",
        text: "Taxa de conversão de 36,41%, a mais alta entre as três cidades. 67 conversões com custo/conv. de R$ 9,10.",
        iconKey: "trendingUp",
      },
      {
        title: "Ilhabela: melhor eficiência",
        text: "CTR de 7,44% e menor custo por conversão (R$ 8,82). Volume menor, mas intenção e relevância altas.",
        iconKey: "target",
      },
    ],
  },
  clicks: {
    highlightNumber: "724",
    titleAfter: "acessos qualificados ao site",
    intro:
      "Quase o triplo de cliques do ciclo 01, com CTR estável em 6,96%. Mais gente vendo, clicando e convertendo, com CPC bem mais competitivo.",
    funnel: [
      { label: "Viram o anúncio", value: 10404, max: 10404, accent: "blue" },
      { label: "Clicaram para saber mais", value: 724, max: 10404, accent: "red" },
      { label: "Conversão registrada", value: 244, max: 10404, accent: "yellow" },
    ],
    cpcDisplay: "R$ 3,16",
    cpcBadge: "−45% vs. 1º mês",
    cpcNote:
      "O CPC médio caiu de R$ 5,74 para R$ 3,16. Com taxa de conversão de 33,70%, o custo por contato ficou em R$ 9,38, metade do ciclo anterior.",
    miniStats: [
      { v: "10,4K", l: "Vistas" },
      { v: "724", l: "Cliques" },
      { v: "244", l: "Conversões" },
    ],
  },
  audience: {
    intro:
      "Os dados demográficos e regionais confirmam um público alinhado à captação do Polo: predominância feminina, faixa etária 35 a 54 anos e 100% das conversões no Litoral Norte.",
    cards: [
      {
        title: "Gênero predominante",
        big: "Feminino",
        text: "Mulheres concentram o maior volume de cliques e conversões. O segmento masculino converte com taxa ligeiramente maior, mas em menor escala.",
        iconKey: "users",
      },
      {
        title: "Faixa etária principal",
        big: "35 a 54 anos",
        text: "O pico de conversões está em 35 a 44 anos, seguido de 45 a 54. Perfil de decisão madura, típico de quem busca graduação EAD com polo presencial.",
        iconKey: "calendar",
      },
      {
        title: "Região de origem",
        big: "Caraguá · S. Sebastião · Ilhabela",
        text: "150 + 67 + 27 conversões. Toda a entrega ficou na área de atuação do Polo, sem desperdício fora do Litoral Norte.",
        iconKey: "mapPin",
      },
      {
        title: "Termos que mais convertem",
        big: "Faculdade · Curso · Caraguá",
        text: "Destaques do Google Insights: “faculdade caraguatatuba”, “curso caraguatatuba” e “cursos técnicos caraguatatuba”. Busca local com alta intenção.",
        iconKey: "search",
      },
    ],
  },
  funnel: {
    intro:
      "O funil de mídia está saudável e em crescimento. O elo que ainda falta fechar, e que será prioridade no início do ciclo 03, é o retorno comercial: quantas conversões viram matrícula.",
    steps: [
      { label: "Impressão", value: "10.404" },
      { label: "Clique", value: "724" },
      { label: "Interesse", value: "244" },
      { label: "Matrícula", value: "?" },
    ],
    afterTitle: "Ponto de atenção: dados comerciais",
    afterText:
      "Ainda não temos confirmação formal de matrículas atribuídas à campanha. Sem esse retorno (quantos leads foram atendidos, em quanto tempo, quantos fecharam e por qual motivo os demais não fecharam), o direcionamento de mídia fica incompleto. No início do ciclo 03, a recomendação é alinhar com a Viviane um fluxo simples de feedback comercial. Isso define se faz sentido aumentar volume ou manter o ritmo atual.",
  },
  strategy: {
    title: "Demanda em ascensão.",
    titleSoft: "Agora falta fechar o funil comercial.",
    intro:
      "O ciclo 02 confirma o que o primeiro mês indicava: existe procura real e crescente por UNIP no Litoral Norte. A mídia está entregando. O próximo ganho de eficiência depende do processo comercial.",
    badTitle: "O que ainda limita",
    badItems: [
      "Ausência de dados de matrícula e follow-up comercial",
      "Campanha limitada pelo orçamento: demanda não capturada",
      "Crédito promocional de R$ 4.500 ainda em processamento no Google",
      "Sem clareza se o atendimento aguenta um aumento de volume",
      "Grupos de Cursos e Pós ainda com baixa escala relativa",
    ],
    goodTitle: "O que já funciona",
    goodItems: [
      "244 conversões em 31 dias (+205% vs. ciclo 01)",
      "Custo por conversão em R$ 9,38 (−50% vs. ciclo 01)",
      "CTR alto e estável (6,96%) na Rede de Pesquisa",
      "Zero dias de pausa, com entrega contínua o mês inteiro",
      "Meta da promoção Google atingida (R$ 3.500 investidos)",
      "Grupo Faculdade EAD como motor claro de volume",
    ],
    extraTitle: "Recomendação para o ciclo 03",
    extraText:
      "Antes de subir o orçamento diário, validar com a Viviane o funil pós-lead. Em paralelo: acompanhar a liberação do crédito de R$ 4.500 (status “Em processamento”, prazo de até 35 dias) e manter a otimização de termos no grupo de Faculdade EAD, onde está a maior parte da demanda.",
  },
  budget: {
    cards: [
      {
        label: "Orçamento diário",
        value: "R$ 72",
        suffix: "/dia",
        note: "Elevado de R$ 50 para R$ 72 para atingir a meta da promoção Google.",
      },
      {
        label: "Investido no ciclo",
        value: "R$ 2.288",
        note: "Acima do planejado (R$ 2.000) de forma controlada, com foco na promoção.",
      },
      {
        label: "Próximo passo",
        value: "Validar",
        note: "Só aumentar volume após alinhar com a Viviane a capacidade do funil comercial.",
        highlight: true,
      },
    ],
  },
  opportunity: {
    highlight: "R$ 4.500",
    titleAfter: "em crédito, aguardando liberação",
    intro:
      "A meta de investimento para a promoção foi atingida (R$ 3.500 acumulados). O crédito de R$ 4.500 está com status “Em processamento” no Google, com prazo de até 35 dias para liberação. Ainda não há consumo do bônus neste ciclo.",
    investTarget: "R$ 3.500",
    deadline: "Status: Em processamento · até 35 dias",
    bonus: "R$ 4.500",
    progressDisplay: "Meta atingida · crédito em processamento",
    progressPct: 100,
    remaining: "Aguardando Google",
    cards: [
      {
        label: "Meta de investimento",
        value: "Atingida",
        desc: "R$ 3.500 acumulados para desbloquear o benefício",
      },
      {
        label: "Status do crédito",
        value: "Processando",
        desc: "Prazo de até 35 dias para liberação pelo Google",
      },
      {
        label: "Crédito a receber",
        value: "R$ 4.500",
        desc: "Ainda não disponível para uso em mídia",
      },
    ],
    howToTitle: "O que fazer enquanto espera",
    howToText:
      "Manter a campanha estável, sem zerar saldo, e acompanhar o status da promoção no Google Ads. Quando o crédito liberar, ele amplia o alcance sem custo adicional direto, idealmente já com o funil comercial mapeado.",
    creditsTitle: "Sobre aumentar o orçamento",
    creditsText:
      "O Google recomenda subir o orçamento porque a campanha está limitada. A recomendação da Raise One é: validar primeiro com a Viviane se o processo comercial comporta mais volume. Escalar mídia sem capacidade de atendimento só gera custo, não matrícula.",
  },
  conclusion: {
    title: "Resultados em ascensão.",
    titleSoft: "Hora de conectar mídia e comercial.",
    intro:
      "O segundo ciclo prova que a demanda existe, cresce e fica mais barata com estabilidade. O desafio do ciclo 03 não é mais validar o Google Ads: é fechar o ciclo até a matrícula.",
    items: [
      {
        n: "01",
        title: "Volume e eficiência",
        text: "244 conversões com R$ 9,38 de custo por contato. Mais que o triplo de leads, com metade do custo unitário do 1º mês.",
      },
      {
        n: "02",
        title: "Promoção atingida",
        text: "Meta de R$ 3.500 concluída. Crédito de R$ 4.500 em processamento, com potencial de ampliar mídia sem custo extra quando liberar.",
      },
      {
        n: "03",
        title: "Dados comerciais",
        text: "Prioridade nº 1 do ciclo 03: feedback da Viviane sobre atendimento, tempo de resposta e matrículas dos leads gerados.",
      },
      {
        n: "04",
        title: "Escala com critério",
        text: "Campanha limitada pelo orçamento. Aumentar diária só depois de confirmar que o funil comercial acompanha o volume.",
      },
    ],
    quote:
      "A mídia está entregando demanda qualificada e crescente. O próximo salto de resultado vem do encontro entre Google Ads e o processo comercial do Polo.",
  },
  footerLabel:
    "Relatório de performance · Ciclo 02 · Google Ads · 01/08 a 31/08/2026 · UNIP Polo Caraguatatuba",
};
