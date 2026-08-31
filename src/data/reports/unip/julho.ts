import type { ReportMonth } from "../types";

export const unipJulho: ReportMonth = {
  slug: "julho",
  monthLabel: "Julho",
  cycleLabel: "1º mês · Ciclo 01",
  cycleShort: "1º Mês",
  headerPeriod: "Jul · 2026",
  period: "29/06 a 29/07/2026",
  periodShort: "29/06 a 29/07",
  dashboardPeriodLabel: "29 jun a 29 jul · 2026",
  heroSubtitle:
    "Este relatório apresenta, de forma simples e direta, os resultados do primeiro ciclo de campanhas no Google Ads para o Polo UNIP Caraguatatuba. O objetivo é mostrar com clareza o que foi feito, o que foi alcançado e qual é a estratégia para os próximos meses.",
  heroEmphasis: "primeiro ciclo",
  metaChips: [
    { k: "Período", v: "29/06 a 29/07" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Litoral Norte · SP" },
    { k: "Ciclo", v: "1º mês" },
  ],
  overviewIntro:
    "Em aproximadamente um mês de operação, a campanha de Rede de Pesquisa validou demanda no Litoral Norte: quase 4 mil impressões, 264 acessos qualificados e 80 conversões registradas, com investimento conservador de R$ 50/dia.",
  overviewHighlight:
    "Observação importante: durante este ciclo a conta permaneceu aproximadamente 3 dias com as campanhas pausadas, devido ao processo obrigatório de verificação solicitado pelo Google. Esses dias foram desconsiderados do período operacional. O ciclo 01 encerra oficialmente em 01/08/2026.",
  kpis: [
    {
      value: "3.975",
      label: "Impressões",
      description: "O Polo UNIP apareceu no Google quase 4 mil vezes no período.",
      accent: "blue",
    },
    {
      value: "264",
      label: "Cliques",
      description: "Acessos qualificados ao site a partir da Rede de Pesquisa.",
      accent: "red",
    },
    {
      value: "80",
      label: "Conversões",
      description: "Contatos registrados com taxa de conversão de 30,30%.",
      accent: "yellow",
    },
    {
      value: "R$1,5K",
      label: "Investimento",
      description: "Valor total investido em mídia paga no ciclo (R$ 1.516,22).",
      accent: "green",
    },
  ],
  investment: {
    intro:
      "O investimento realizado no período foi de R$ 1.516,22. Embora o planejamento inicial previsse R$ 2.000, optamos por manter o orçamento em R$ 50,00/dia: decisão conservadora enquanto validamos a jornada completa até a matrícula.",
    mediaCostDisplay: "R$ 1.516",
    daysLabel: "~30 dias",
    bars: [
      {
        label: "Investimento realizado",
        value: "R$ 1.516",
        pct: 76,
        note: "Valor efetivamente gasto na Rede de Pesquisa.",
      },
      {
        label: "Orçamento planejado",
        value: "R$ 2.000",
        pct: 100,
        note: "Teto previsto para o primeiro ciclo.",
        muted: true,
      },
    ],
    sideNotes: [
      "Ainda não houve confirmação da primeira matrícula proveniente da campanha. Por isso o investimento permaneceu conservador, priorizando validação da demanda e coleta de dados antes de escalar.",
      "Mesmo com orçamento controlado, a campanha gerou 80 conversões a um custo médio de R$ 18,95 por contato: resultado forte para o primeiro ciclo em educação.",
    ],
    proofTitle: "Insight",
    proofText:
      "A campanha cumpriu o objetivo desta primeira etapa: aumentar a geração de oportunidades na região do Litoral Norte. O próximo ciclo confirma o funil até a matrícula.",
  },
  reach: {
    highlightNumber: "3.975",
    intro:
      "Impressões são o número de vezes que o anúncio do Polo foi exibido para pessoas no Google. 3.975 impressões significam que a UNIP Caraguatatuba apareceu para potenciais alunos quase quatro mil vezes durante o ciclo.",
    cards: [
      {
        title: "Presença no momento certo",
        text: "Os anúncios apareceram quando pessoas buscavam cursos e graduação UNIP na região. Intenção alta, muito mais qualificada do que alcance frio em redes sociais.",
        iconKey: "target",
      },
      {
        title: "Visibilidade consistente",
        text: "Em cerca de um mês de operação, a campanha manteve presença contínua na Rede de Pesquisa, mesmo com três dias pausados por verificação do Google.",
        iconKey: "trendingUp",
      },
      {
        title: "Alcance regional qualificado",
        text: "Foco no Litoral Norte: Caraguatatuba, São Sebastião e Ilhabela. Sem desperdício de verba com quem está fora da área de atuação do Polo.",
        iconKey: "mapPin",
      },
    ],
  },
  clicks: {
    highlightNumber: "264",
    titleAfter: "acessos qualificados ao site",
    intro:
      "Cliques representam pessoas que viram o anúncio e decidiram conhecer o Polo. São leads com intenção real de buscar graduação, o tipo de tráfego que a Rede de Pesquisa entrega melhor.",
    funnel: [
      { label: "Viram o anúncio", value: 3975, max: 3975, accent: "blue" },
      { label: "Clicaram para saber mais", value: 264, max: 3975, accent: "red" },
      { label: "Conversão registrada", value: 80, max: 3975, accent: "yellow" },
    ],
    cpcDisplay: "R$ 5,74",
    cpcBadge: "CTR 6,64%",
    cpcNote:
      "Cada clique custou em média R$ 5,74. Com CTR de 6,64% e taxa de conversão de 30,30%, o custo por conversão ficou em R$ 18,95, competitivo para captação de alunos.",
    miniStats: [
      { v: "3.975", l: "Vistas" },
      { v: "264", l: "Cliques" },
      { v: "80", l: "Conversões" },
    ],
  },
  audience: {
    intro:
      "Os dados do Google Ads confirmam que a campanha está atingindo o público certo: pessoas no Litoral Norte, com alta intenção de busca por cursos UNIP, majoritariamente via celular.",
    cards: [
      {
        title: "Região de origem",
        big: "Litoral Norte · SP",
        text: "Caraguatatuba, São Sebastião e Ilhabela, exatamente a área de atuação do Polo. Sem desperdício com outras regiões.",
        iconKey: "mapPin",
      },
      {
        title: "Rede",
        big: "100% Pesquisa Google",
        text: "Toda a entrega veio da Rede de Pesquisa: pessoas ativamente buscando cursos e graduação no momento do anúncio.",
        iconKey: "search",
      },
      {
        title: "Intenção",
        big: "Alta",
        text: "Buscas por cursos e graduação UNIP. O perfil de intenção é o mais qualificado para captação de matrículas.",
        iconKey: "target",
      },
      {
        title: "Dispositivo",
        big: "Mobile-first",
        text: "A maioria dos acessos veio do celular, alinhado ao comportamento de busca do futuro aluno na região.",
        iconKey: "users",
      },
    ],
  },
  funnel: {
    intro:
      "O fluxo abaixo mostra as etapas principais da jornada. Em instituições de ensino, o caminho entre o primeiro interesse e a matrícula costuma ser mais longo do que em outros segmentos.",
    steps: [
      { label: "Impressão", value: "3.975" },
      { label: "Clique", value: "264" },
      { label: "Interesse", value: "80" },
      { label: "Matrícula", value: "n/d" },
    ],
    afterTitle: "Ponto de atenção: matrículas",
    afterText:
      "Até o momento, ainda não houve confirmação de matrículas originadas das campanhas. Isso não significa que a campanha não esteja funcionando: em educação, a jornada de decisão é mais longa. Fatores em acompanhamento: tempo de decisão do futuro aluno, qualidade do follow-up comercial, velocidade de atendimento, sazonalidade e matrículas que ocorrem semanas após o primeiro contato.",
  },
  strategy: {
    title: "Demanda validada.",
    titleSoft: "Próximo ciclo confirma o funil.",
    intro:
      "Os indicadores mostram que existe procura pelos cursos da UNIP na região. Além dos números do Google Ads, o feedback do período aponta aumento perceptível nos contatos recebidos pelo Polo.",
    badTitle: "O que ainda limita",
    badItems: [
      "Matrículas ainda sem confirmação comercial neste ciclo",
      "Três dias de campanha pausada por verificação do Google",
      "Orçamento conservador enquanto o funil de matrícula não fecha",
      "Jornada longa entre interesse e efetivação da matrícula",
      "Gargalos possíveis no follow-up e velocidade de atendimento",
    ],
    goodTitle: "O que já funciona",
    goodItems: [
      "Demanda real validada no Litoral Norte",
      "CTR de 6,64%, forte engajamento na Rede de Pesquisa",
      "80 conversões com custo de R$ 18,95 por contato",
      "Taxa de conversão de 30,30% nos cliques",
      "Público e região alinhados ao Polo",
    ],
    extraTitle: "Recomendação",
    extraText:
      "Para validar todo o funil de aquisição, a recomendação é acompanhar pelo menos mais um ciclo completo: acompanhar matrículas dos contatos já gerados, continuar otimizando as campanhas, aproveitar o crédito promocional do Google quando liberado e identificar com precisão os gargalos do processo comercial.",
  },
  budget: {
    cards: [
      {
        label: "Orçamento diário",
        value: "R$ 50",
        suffix: "/dia",
        note: "Nível conservador adotado no primeiro ciclo de validação.",
      },
      {
        label: "Investido no ciclo",
        value: "R$ 1.516",
        note: "76% do orçamento planejado de R$ 2.000, sem forçar escala prematura.",
      },
      {
        label: "Encerramento oficial",
        value: "01/08",
        note: "A partir desta data passa a vigorar a mensalidade de gestão da campanha, conforme alinhado na contratação.",
        highlight: true,
      },
    ],
  },
  opportunity: {
    highlight: "R$ 4.500",
    titleAfter: "em crédito promocional Google",
    intro:
      "A conta da UNIP possui uma promoção ativa do Google. Ao atingir aproximadamente R$ 2.000 em investimento restante para desbloquear o benefício, a conta receberá R$ 4.500 em créditos do Google Ads, ampliando a divulgação e reduzindo o custo de mídia nos próximos meses.",
    investTarget: "≈ R$ 2.000",
    deadline: "Restante para desbloquear o crédito",
    bonus: "R$ 4.500",
    progressDisplay: "R$ 1.516 investidos · faltam ≈ R$ 2.000",
    progressPct: 43,
    remaining: "≈ R$ 2.000",
    cards: [
      {
        label: "Investimento neste ciclo",
        value: "R$ 1.516",
        desc: "Valor já aplicado na Rede de Pesquisa",
      },
      {
        label: "Investimento restante",
        value: "≈ R$ 2.000",
        desc: "Necessário para liberar o crédito promocional",
      },
      {
        label: "Crédito ao desbloquear",
        value: "R$ 4.500",
        desc: "Bônus do Google para ampliar a divulgação",
      },
    ],
    howToTitle: "Como aproveitar",
    howToText:
      "Mantendo a operação no próximo ciclo e avançando o investimento acumulado, o crédito promocional libera automaticamente, permitindo ampliar alcance e reduzir o custo real de mídia sem custo adicional direto equivalente.",
    creditsTitle: "Observação comercial",
    creditsText:
      "Permanece válida a proposta referente ao projeto da pousada. Caso seja iniciado junto à Raise One, o segundo mês de gestão da UNIP será isento da mensalidade, permitindo acompanhar matrículas e créditos promocionais sem custo adicional de gestão neste período.",
  },
  conclusion: {
    title: "A demanda foi validada.",
    titleSoft: "O próximo ciclo confirma o funil.",
    intro:
      "O primeiro ciclo de Google Ads para o Polo UNIP Caraguatatuba demonstra demanda real na região, tráfego qualificado e conversões consistentes. O próximo passo é fechar o funil até a matrícula com mais um ciclo de operação.",
    items: [
      {
        n: "01",
        title: "Demanda validada",
        text: "Quase 4 mil impressões e 264 cliques confirmam interesse ativo por cursos UNIP no Litoral Norte.",
      },
      {
        n: "02",
        title: "Conversões geradas",
        text: "80 contatos registrados com taxa de conversão de 30,30% e custo por conversão de R$ 18,95.",
      },
      {
        n: "03",
        title: "Investimento eficiente",
        text: "R$ 1.516 investidos com orçamento diário controlado: base sólida antes de escalar.",
      },
      {
        n: "04",
        title: "Próximo ciclo",
        text: "Acompanhar matrículas, otimizar campanhas e aproveitar o crédito promocional de R$ 4.500 quando liberado.",
      },
    ],
    quote:
      "Obrigado pela confiança durante este primeiro ciclo. Continuo acompanhando diariamente as campanhas e à disposição para seguirmos evoluindo os resultados.",
  },
  footerLabel:
    "Relatório de performance · Ciclo 01 · Google Ads · 29/06 a 29/07/2026 · UNIP Polo Caraguatatuba",
};
