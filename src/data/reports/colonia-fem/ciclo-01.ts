import dashCiclo01 from "@/assets/reports/colonia-fem/google-ads-ciclo-01.png";
import type { ReportMonth } from "../types";

export const coloniaFemCiclo01: ReportMonth = {
  slug: "ciclo-01",
  monthLabel: "Ciclo 01",
  cycleLabel: "1º ciclo de gestão",
  cycleShort: "1º Ciclo",
  headerPeriod: "Out · Nov · 2026",
  period: "16/10 a 15/11/2026",
  periodShort: "16/10 a 15/11",
  dashboardPeriodLabel: "16 out a 15 nov · 2026",
  heroSubtitle:
    "Este relatório apresenta os resultados do primeiro ciclo de gestão de Google Ads da Pousada Colônia FEM. Após a implantação (identidade, foto, vídeo, landing page e mensuração), a campanha rodou 31 dias sem pausas e validou a demanda: 251 contatos no WhatsApp a R$ 5,29 por contato.",
  heroEmphasis: "primeiro ciclo",
  metaChips: [
    { k: "Período", v: "16/10 a 15/11" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Itanhaém · SP" },
    { k: "Ciclo", v: "1º ciclo" },
  ],
  overviewIntro:
    "Em 31 dias contínuos, com orçamento de R$ 40/dia e uma campanha de Rede de Pesquisa (Hospedagem Itanhaém), a Colônia FEM gerou 251 conversões no WhatsApp a R$ 5,29 por contato. CTR de 8,45%, CPC de R$ 1,83 e score de otimização em 100%.",
  overviewHighlight:
    "A meta de investimento da promoção Google (R$ 1.200) foi atingida em 12/11. O crédito de R$ 1.200 está em processamento, com prazo de até 35 dias. A campanha segue limitada pelo orçamento: há demanda além do que a diária atual captura.",
  kpis: [
    {
      value: "8.576",
      label: "Impressões",
      description: "Presença contínua no Google para quem pesquisa hospedagem na região.",
      accent: "blue",
    },
    {
      value: "725",
      label: "Cliques",
      description: "Acessos qualificados à landing page, com CTR de 8,45%.",
      accent: "red",
    },
    {
      value: "251",
      label: "WhatsApp",
      description: "Contatos registrados no ciclo, com taxa de conversão de 34,62%.",
      accent: "yellow",
    },
    {
      value: "R$1,3K",
      label: "Investimento",
      description: "R$ 1.329,04 em mídia, 100% via forma de pagamento da conta.",
      accent: "green",
    },
  ],
  dashboardSrc: dashCiclo01,
  agencyWork: {
    intro:
      "Este foi o primeiro ciclo de gestão após a implantação. O foco foi validar a estrutura completa (landing, tracking e campanha), estabilizar a entrega e acompanhar diariamente o funil da busca até o WhatsApp.",
    items: [
      "Validação da landing page, CTAs de WhatsApp e eventos de conversão",
      "Lançamento e estabilização da campanha de Rede de Pesquisa",
      "Monitoramento diário de entrega, custos, CTR, CPC e conversões",
      "Acompanhamento do score de otimização (100% no ciclo)",
      "Revisão contínua de palavras-chave e termos de pesquisa",
      "Negativação de termos irrelevantes para hospedagem / pousada",
      "Ajuste fino de anúncios, extensões e relevância das criativas",
      "Análise de desempenho por local, dispositivo e demografia",
      "Acompanhamento da meta da promoção Google (atingida em 12/11)",
      "Gestão de orçamento diário (R$ 40) e alerta de limitação por orçamento",
    ],
  },
  campaignsNote:
    "Uma campanha de Rede de Pesquisa: Search | Hospedagem Itanhaém | SP. Segmentação inicial em todo o estado de São Paulo, com concentração natural de entrega em Itanhaém e na capital.",
  campaignsIntro:
    "No primeiro ciclo, a estrutura ficou enxuta de propósito: uma campanha, um objetivo (contato no WhatsApp) e aprendizado contínuo do algoritmo com entrega estável.",
  campaignsInsight:
    "Com R$ 40/dia e zero pausas, a conta aprendeu rápido. O custo por contato em R$ 5,29 e a taxa de conversão acima de 34% mostram que a combinação anúncio + landing + WhatsApp está alinhada.",
  campaigns: [
    {
      id: "hospedagem",
      name: "Search · Hospedagem Itanhaém",
      subtitle: "Rede de Pesquisa · SP · contato via WhatsApp",
      accent: "blue",
      iconKey: "search",
      metrics: {
        impressions: 8576,
        clicks: 725,
        conversions: 251,
        cost: 1329.04,
        cpc: 1.83,
        costPerConv: 5.29,
        convRate: 34.62,
      },
    },
  ],
  investment: {
    intro:
      "O investimento em mídia no período foi de R$ 1.329,04, integralmente cobrado na forma de pagamento cadastrada (Visa final 7280). Não houve uso de crédito promocional neste ciclo: o bônus de R$ 1.200 ainda está em processamento.",
    mediaCostDisplay: "R$ 1.329",
    daysLabel: "31 dias",
    bars: [
      {
        label: "Pago no cartão",
        value: "R$ 1.329",
        pct: 100,
        note: "Cobranças automáticas no ciclo (limite e mensal). Sem crédito em uso ainda.",
      },
      {
        label: "Crédito promocional",
        value: "R$ 0",
        pct: 0,
        note: "R$ 1.200 em processamento após meta atingida em 12/11.",
        muted: true,
      },
    ],
    sideNotes: [
      "Cobranças no ciclo: R$ 650 + R$ 50 (20/10) + R$ 200 (30/10) + R$ 400 + R$ 29,48 (01/11, cobrança mensal).",
      "Limite de cobrança atual: R$ 800. Saldo acumulado em aberto (na data do fechamento): cerca de R$ 681,40.",
    ],
    proofTitle: "Insight",
    proofText:
      "Com R$ 40/dia, cada contato saiu a R$ 5,29. A campanha já aparece limitada pelo orçamento: o próximo ganho de volume depende de diária e do retorno comercial das reservas.",
  },
  reach: {
    highlightNumber: "8.576",
    intro:
      "A pousada apareceu mais de 8,5 mil vezes no Google no ciclo. A segmentação cobriu o estado de SP, e a entrega se concentrou onde a intenção de hospedagem em Itanhaém é mais forte: a própria cidade e São Paulo capital.",
    cards: [
      {
        title: "Itanhaém concentra",
        text: "6.334 impressões, 523 cliques e 163,5 conversões (cerca de 65% dos contatos), com custo/conv. de R$ 5,84.",
        iconKey: "mapPin",
      },
      {
        title: "São Paulo capital",
        text: "1.322 impressões, 120 cliques e 58 conversões. Segundo maior volume, com custo/conv. de cerca de R$ 4,15.",
        iconKey: "trendingUp",
      },
      {
        title: "Litoral e entorno",
        text: "Peruíbe, Mongaguá, Praia Grande e Santos aparecem com volume complementar. A demanda chega de quem busca a região e de quem já está nela.",
        iconKey: "target",
      },
    ],
  },
  clicks: {
    highlightNumber: "725",
    titleAfter: "acessos qualificados à landing",
    intro:
      "Quem clicou chegou à página comercial da pousada. CTR de 8,45% e cerca de 85% do tráfego em smartphone: a jornada é mobile-first.",
    funnel: [
      { label: "Viram o anúncio", value: 8576, max: 8576, accent: "blue" },
      { label: "Clicaram para saber mais", value: 725, max: 8576, accent: "red" },
      { label: "WhatsApp", value: 251, max: 8576, accent: "yellow" },
    ],
    cpcDisplay: "R$ 1,83",
    cpcBadge: "Competitivo",
    cpcNote:
      "CPC médio de R$ 1,83 com taxa de conversão de 34,62%. O custo por contato ficou em R$ 5,29 no primeiro ciclo.",
    miniStats: [
      { v: "8.576", l: "Vistas" },
      { v: "725", l: "Cliques" },
      { v: "251", l: "WhatsApp" },
    ],
  },
  audience: {
    intro:
      "O público que responde à campanha combina bem com hospedagem familiar: predominância feminina, pico em 35 a 44 anos e forte presença em 25 a 54.",
    cards: [
      {
        title: "Gênero e idade",
        big: "Mulheres 35 a 44",
        text: "Feminino lidera com 167 conversões (403 cliques). Na idade, o pico está em 35 a 44 (63 conversões), seguido por 25 a 34 (53) e 45 a 54 (45).",
        iconKey: "users",
      },
      {
        title: "Faixa etária principal",
        big: "25 a 54 anos",
        text: "Concentração na faixa que costuma decidir viagem e hospedagem em família ou em grupo, alinhada à oferta da Colônia FEM.",
        iconKey: "calendar",
      },
      {
        title: "Origem da demanda",
        big: "Itanhaém · São Paulo",
        text: "Itanhaém e a capital concentram a maior parte dos contatos. O restante se espalha pelo estado, com destaque leve no litoral sul.",
        iconKey: "mapPin",
      },
      {
        title: "Dispositivo",
        big: "85% mobile",
        text: "Smartphones concentram cerca de 85% dos cliques e 84% do custo. Computadores ficam em torno de 15%. A experiência mobile da LP é crítica.",
        iconKey: "search",
      },
    ],
  },
  funnel: {
    intro:
      "O funil de mídia do primeiro ciclo está saudável. Do lado comercial, o próximo passo natural é aproximar contatos de reservas efetivas para calibrar orçamento com retorno.",
    steps: [
      { label: "Impressão", value: "8.576" },
      { label: "Clique", value: "725" },
      { label: "WhatsApp", value: "251" },
      { label: "Reserva", value: "?" },
    ],
    afterTitle: "Primeira semana × ciclo completo",
    afterText:
      "Na primeira semana (16 a 23/10) foram 37 contatos. No ciclo completo de 31 dias, 251. A entrega amadureceu ao longo do período, com pico visível de conversões na segunda metade do ciclo.",
  },
  strategy: {
    title: "Estrutura validada.",
    titleSoft: "Agora o foco é retorno e escala com critério.",
    intro:
      "O primeiro ciclo cumpriu o papel de validação: a pousada aparece na busca, a landing converte e o WhatsApp recebe demanda contínua a custo baixo. O ponto de atenção agora é comercial e financeiro.",
    badTitle: "O que ainda limita",
    badItems: [
      "Campanha limitada pelo orçamento: demanda não capturada",
      "Crédito de R$ 1.200 ainda em processamento (até 35 dias)",
      "Segmentação estadual ainda espalha parte da verba fora do núcleo de conversão",
      "Atribuição formal de reservas ainda em construção no acompanhamento comercial",
    ],
    goodTitle: "O que já funciona",
    goodItems: [
      "251 contatos em 31 dias, a R$ 5,29 por contato",
      "Zero dias de pausa, com entrega contínua",
      "CTR de 8,45% e taxa de conversão de 34,62%",
      "Itanhaém e São Paulo como motores claros de volume",
      "Score de otimização em 100%",
      "Meta da promoção Google atingida em 12/11",
    ],
    extraTitle: "Recomendação para o ciclo 02",
    extraText:
      "Manter a estabilidade da campanha e avaliar, com a operação, se o volume de reservas justifica um aumento de diária. Enquanto o crédito não libera, qualquer escala precisa olhar caixa e ocupação. Em paralelo, dá para afinar a geografia em direção aos locais que mais convertem.",
  },
  budget: {
    cards: [
      {
        label: "Orçamento diário",
        value: "R$ 40",
        suffix: "/dia",
        note: "Mantido no ciclo. Campanha limitada pelo orçamento.",
      },
      {
        label: "Investido no ciclo",
        value: "R$ 1.329",
        note: "100% via cartão. Crédito de R$ 1.200 ainda em processamento.",
      },
      {
        label: "Próximo passo",
        value: "Avaliar",
        note: "Estudar aumento de diária se as reservas confirmarem retorno.",
        highlight: true,
      },
    ],
  },
  opportunity: {
    highlight: "R$ 1.200",
    titleAfter: "em crédito, em processamento",
    intro:
      "A meta de investimento de R$ 1.200 da promoção Google foi atingida em 12/11. O crédito de R$ 1.200 está em processamento pela plataforma, com prazo informado de até 35 dias para liberação.",
    investTarget: "R$ 1.200",
    deadline: "Meta atingida em 12/11 · em processamento",
    bonus: "R$ 1.200",
    progressDisplay: "Meta atingida · crédito em processamento",
    progressPct: 100,
    remaining: "Aguardando liberação",
    cards: [
      {
        label: "Meta de investimento",
        value: "R$ 1.200",
        desc: "Atingida em 12 de novembro de 2026",
      },
      {
        label: "Crédito a receber",
        value: "R$ 1.200",
        desc: "Status: processando (prazo de até 35 dias)",
      },
      {
        label: "Uso no ciclo 01",
        value: "R$ 0",
        desc: "Nenhum crédito consumido neste período",
      },
    ],
    howToTitle: "O que fazer enquanto processa",
    howToText:
      "Manter a campanha ativa e o saldo saudável. Quando o crédito liberar, ele reduz o custo efetivo de mídia e permite testar um pouco mais de volume sem a mesma pressão no cartão.",
    creditsTitle: "Dinâmica de cobrança",
    creditsText:
      "A conta tem limite de cobrança de R$ 800. O Google cobra ao atingir o limite ou no ciclo mensal. Enquanto o crédito não entra, o custo segue 100% no cartão cadastrado.",
  },
  conclusion: {
    title: "Demanda validada.",
    titleSoft: "Estrutura no ar. Próximo passo: retorno.",
    intro:
      "O primeiro ciclo mostra que a Colônia FEM encontrou um canal de aquisição previsível: busca, landing e WhatsApp funcionando juntos, com custo por contato baixo e entrega estável.",
    items: [
      {
        n: "01",
        title: "Performance",
        text: "251 contatos a R$ 5,29. CTR e taxa de conversão altos para um primeiro ciclo.",
      },
      {
        n: "02",
        title: "Estrutura",
        text: "Implantação validada: página, tracking e campanha rodando com score 100%.",
      },
      {
        n: "03",
        title: "Crédito",
        text: "Meta da promoção atingida. R$ 1.200 em processamento para o próximo ciclo.",
      },
      {
        n: "04",
        title: "Escala com critério",
        text: "Há espaço para subir a diária, desde que reservas e caixa confirmem o retorno.",
      },
    ],
    quote:
      "A base está pronta. O ciclo 01 provou demanda e eficiência. O ciclo 02 decide o quanto vale ampliar volume com base no comercial da pousada.",
  },
  footerLabel:
    "Relatório de performance · 1º ciclo · Google Ads · 16/10 a 15/11/2026 · Pousada Colônia FEM",
};
