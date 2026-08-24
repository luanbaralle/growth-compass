import type { ReportMonth } from "../types";

export const studio21Agosto: ReportMonth = {
  slug: "agosto",
  monthLabel: "Agosto",
  cycleLabel: "4º mês",
  cycleShort: "4º Mês",
  headerPeriod: "Jul – Ago · 2026",
  period: "22/07 – 23/08/2026",
  periodShort: "22/07 – 23/08",
  dashboardPeriodLabel: "22 jul — 23 ago · 2026",
  heroSubtitle:
    "Resultados do quarto mês de Google Ads. Conversões no WhatsApp saltaram, o custo por mensagem caiu — e o gargalo continua sendo o mesmo: recarga diária sem folga de saldo.",
  heroEmphasis: "quarto mês",
  metaChips: [
    { k: "Período", v: "22/07 – 23/08" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Itanhaém · Mongaguá · Peruíbe" },
    { k: "Ciclo", v: "4º mês" },
  ],
  overviewIntro:
    "Em 33 dias, com orçamento em R$ 65/dia e 5 dias sem campanha por falta de saldo, o Studio 21 gerou 73 mensagens no WhatsApp — quase o dobro do 3º mês — com custo por mensagem bem menor.",
  kpis: [
    {
      value: "13,4K",
      label: "Impressões",
      description: "O Studio 21 apareceu no Google mais de 13 mil vezes no período.",
      accent: "blue",
    },
    {
      value: "1.028",
      label: "Cliques",
      description: "Pessoas que clicaram nos anúncios — 17% a mais que no 3º mês.",
      accent: "red",
    },
    {
      value: "73",
      label: "Mensagens",
      description: "Contatos no WhatsApp — +74% vs. julho, com custo por msg em queda.",
      accent: "yellow",
    },
    {
      value: "R$1,5K",
      label: "Investimento",
      description: "Custo em mídia: R$ 1.514. Recargas no período: R$ 1.510.",
      accent: "green",
    },
  ],
  dashboardImage: "agosto",
  agencyWork: {
    intro:
      "Além de acompanhar o painel, a gestão do mês focou em afiar a qualidade das buscas e proteger o orçamento de cliques irrelevantes.",
    items: [
      "Ajuste de lances para priorizar buscas com melhor intenção de agendamento",
      "Otimização contínua de palavras-chave nas duas campanhas",
      "Negativação de termos que geravam clique sem potencial de conversão",
      "Monitoramento diário de performance, saldo e entrega das campanhas",
    ],
  },
  campaignsNote:
    "Duas campanhas ativas: Serviços gerais (salão, cabeleireiro, corte) e Mechas + Mega Hair (luzes, mechas, mega hair). Cada uma atinge um público e intenção de busca diferente — o detalhamento está na seção seguinte.",
  campaignsIntro:
    "Serviços gerais seguem trazendo volume com CPC baixo (R$ 0,94) e 50 mensagens. Mechas + Mega Hair mantém conversão premium: quase 1 em cada 10 cliques vira WhatsApp, com CPC naturalmente mais alto.",
  campaignsInsight:
    "Das 73 mensagens, 50 vieram de Serviços gerais e 23 de Mechas + Mega Hair. A campanha premium converteu a 9,5% — o melhor sinal de que a demanda por procedimentos de maior valor na região continua firme.",
  campaigns: [
    {
      id: "geral",
      name: "Serviços gerais",
      subtitle: "Salão de beleza · cabeleireiro · corte",
      accent: "blue",
      iconKey: "scissors",
      metrics: {
        impressions: 9354,
        clicks: 787,
        conversions: 50,
        cost: 740.8,
        cpc: 0.94,
        costPerConv: 14.82,
        convRate: 6.35,
        ctr: 8.41,
      },
    },
    {
      id: "high-ticket",
      name: "Mechas + Mega Hair",
      subtitle: "Luzes · mechas · mega hair",
      accent: "yellow",
      iconKey: "sparkles",
      metrics: {
        impressions: 4068,
        clicks: 241,
        conversions: 23,
        cost: 773.33,
        cpc: 3.21,
        costPerConv: 33.62,
        convRate: 9.54,
        ctr: 5.92,
      },
    },
  ],
  comparison: {
    leftLabel: "3º mês",
    rightLabel: "4º mês",
    intro:
      "Investimento em mídia subiu ~22%, mas as mensagens cresceram ~74% e o custo por WhatsApp caiu de R$ 29,55 para R$ 20,74. Mais resultado por real investido — mesmo com pausas e recarga diária.",
    warning:
      "Cinco dias sem campanha (9, 15, 16, 23 e 24/08) por falta de saldo. O mês foi bom apesar do freio de mão — não graças a ele. Com folga de orçamento, o potencial seria maior.",
    prev: {
      impressions: 10903,
      clicks: 875,
      conversions: 42,
      cost: 1240.97,
      cpc: 1.42,
      costPerConv: 29.55,
    },
    current: {
      impressions: 13422,
      clicks: 1028,
      conversions: 73,
      cost: 1514.13,
      cpc: 1.47,
      costPerConv: 20.74,
      convRate: 7.1,
      ctr: 7.66,
    },
  },
  investment: {
    intro:
      "Foram pagos R$ 1.510,00 em recargas no período. O custo em mídia foi de R$ 1.514,13. Sem crédito promocional — esse capítulo está encerrado; 100% do investimento sai do caixa do salão.",
    mediaCostDisplay: "R$ 1.514",
    daysLabel: "33 dias",
    bars: [
      {
        label: "Recargas no período",
        value: "R$ 1.510",
        pct: 100,
        note: "Valor efetivamente pago em dinheiro nas recargas.",
      },
    ],
    sideNotes: [
      "A operação segue com freio de mão puxado: recarga diária cobre no máximo um dia de campanha. O Google não consegue distribuir a verba ao longo do dia nos horários de maior busca — e isso reduz drasticamente o volume de resultados possíveis.",
    ],
    proofTitle: "O padrão se repete",
    proofText:
      "Sempre que o saldo zera, a entrega cai a zero. Nos dias 9, 15, 16, 23 e 24/08 as campanhas pararam. Não é falta de demanda na região — é falta de continuidade de saldo.",
  },
  reach: {
    highlightNumber: "13.422",
    intro:
      "Impressões +23% vs. julho, com CTR de 7,66%. Os anúncios continuam relevantes. O que corta o alcance são os dias sem saldo — não a falta de busca na região.",
    cards: [
      {
        title: "Presença no momento certo",
        text: "Os anúncios apareceram quando pessoas pesquisavam salão, cabeleireiro, mechas ou mega hair em Itanhaém, Mongaguá e Peruíbe.",
        iconKey: "target",
      },
      {
        title: "5 dias sem campanha",
        text: "Paradas em 9, 15, 16, 23 e 24/08 por falta de saldo. Cinco dias em que a concorrência apareceu e o Studio 21 não.",
        iconKey: "pause",
      },
      {
        title: "Alcance regional qualificado",
        text: "Entrega concentrada na área de atuação do salão — sem desperdício de verba fora da região.",
        iconKey: "mapPin",
      },
    ],
  },
  clicks: {
    highlightNumber: "1.028",
    titleAfter: "pessoas demonstraram interesse",
    intro:
      "Cliques +17,5% vs. julho. CPC médio em R$ 1,47 (leve alta). O destaque do mês está na conversão: 73 mensagens com custo por contato em R$ 20,74 (−30% vs. 3º mês).",
    funnel: [
      { label: "Viram o anúncio", value: 13422, max: 13422, accent: "blue" },
      { label: "Clicaram para saber mais", value: 1028, max: 13422, accent: "red" },
      { label: "Mensagem no WhatsApp", value: 73, max: 13422, accent: "yellow" },
    ],
    cpcDisplay: "R$ 1,47",
    cpcBadge: "Praticamente estável",
    cpcNote:
      "CPC praticamente estável (+3,5% vs. julho). O ganho real veio no custo por mensagem: de R$ 29,55 para R$ 20,74 — mais eficiência no funil até o WhatsApp.",
    miniStats: [
      { v: "13,4K", l: "Vistas" },
      { v: "1.028", l: "Cliques" },
      { v: "73", l: "WhatsApp" },
    ],
  },
  audience: {
    intro:
      "O perfil se manteve: mulheres adultas na região do salão, buscando ativamente serviços de beleza no Google.",
    cards: [
      {
        title: "Gênero predominante",
        big: "Mulheres",
        text: "A comunicação continua atingindo quem decide agendar — o público principal do Studio 21.",
        iconKey: "users",
      },
      {
        title: "Faixa etária principal",
        big: "35 – 54 anos",
        text: "Perfil com rotina e poder de compra, alinhado a serviços do dia a dia e a procedimentos de maior valor.",
        iconKey: "calendar",
      },
      {
        title: "Região de origem",
        big: "Itanhaém · Mongaguá · Peruíbe",
        text: "Leads da área de atuação do salão. Sem desperdício fora da região.",
        iconKey: "mapPin",
      },
      {
        title: "Origem dos leads",
        big: "100% Pesquisa Google",
        text: "Contatos de quem já estava buscando o serviço no momento do anúncio.",
        iconKey: "search",
      },
    ],
  },
  funnel: {
    intro:
      "O Google Ads entrega até a mensagem no WhatsApp. Agendamento e faturamento ficam no atendimento do salão — e este mês ainda não temos esse retorno.",
    steps: [
      { label: "Anúncio visto", value: "13.422" },
      { label: "Clique", value: "1.028" },
      { label: "WhatsApp", value: "73" },
    ],
    afterTitle: "Depois do WhatsApp",
    afterText:
      "Sem dados de agendamento e faturamento do salão, o funil de negócio fica incompleto. Com 73 mensagens no período, esse retorno faria grande diferença para medir o ROI real do investimento.",
  },
  strategy: {
    title: "Freio de mão puxado",
    titleSoft: "limita o teto",
    intro:
      "O quarto mês prova duas coisas ao mesmo tempo: a demanda e as campanhas respondem bem — e a forma de recarregar continua cortando resultado. Nunca há orçamento para mais de um dia de campanha.",
    badTitle: "Recarga diária = freio de mão",
    badItems: [
      "Orçamento permanece em R$ 65/dia",
      "Recargas diárias cobrem no máximo 1 dia",
      "Google não distribui verba nos melhores horários",
      "5 dias parados: 9, 15, 16, 23 e 24/08",
      "Cada pausa interrompe o ritmo de otimização",
    ],
    goodTitle: "O que o mês mostrou",
    goodItems: [
      "73 mensagens (+74% vs. julho) com as campanhas atuais",
      "Custo por mensagem caiu para R$ 20,74 (−30%)",
      "Taxa de conversão em 7,10% — melhor do ciclo recente",
      "Mechas + Mega Hair converteu a 9,5% dos cliques",
      "Gestão ativa (lances, palavras, negativações) sustentou a qualidade",
    ],
    extraTitle: "Matemática simples",
    extraText:
      "Com R$ 65/dia, a recarga semanal ideal é ~R$ 455. Isso evita zerar o saldo no meio do dia e deixa o Google investir quando a busca está alta. Rodar com saldo de um dia só é operar com o freio puxado — os números de agosto são bons apesar disso.",
  },
  budget: {
    cards: [
      {
        label: "Orçamento atual",
        value: "R$ 65",
        suffix: "/dia",
        note: "Mantido em relação ao 3º mês. O teto diário não mudou — o que falta é continuidade de saldo.",
      },
      {
        label: "Recarga recomendada",
        value: "R$ 455",
        suffix: "/sem",
        note: "R$ 65 × 7 dias. Uma recarga semanal elimina as pausas e libera entrega nos horários de pico.",
      },
      {
        label: "Projeção mensal",
        value: "R$ 1.950",
        note: "Mantendo R$ 65/dia com saldo contínuo, o investimento mensal fica em torno de R$ 1.950 — com entrega estável.",
        highlight: true,
      },
    ],
  },
  conclusion: {
    title: "Melhor eficiência do ciclo.",
    titleSoft: "Agora falta tirar o freio.",
    intro:
      "Agosto foi o mês com mais mensagens e menor custo por contato desde o início da gestão. As campanhas e a otimização estão entregando. O limitador continua sendo recarga diária e saldo que zera.",
    items: [
      {
        n: "01",
        title: "Passar para recarga semanal",
        text: "Em vez de cobrir só o dia, ~R$ 455/semana a R$ 65/dia. É a mudança com maior impacto potencial no volume de resultados.",
      },
      {
        n: "02",
        title: "Não deixar o saldo zerar",
        text: "Cinco dias parados neste mês. Cada dia sem anúncio é um dia em que a concorrência captura a busca da região.",
      },
      {
        n: "03",
        title: "Manter as duas campanhas",
        text: "Gerais trazem volume e CPC baixo; Mechas + Mega Hair convertem melhor (9,5%). As duas cobrem o funil do salão.",
      },
      {
        n: "04",
        title: "Fechar o funil no salão",
        text: "Com 73 WhatsApps, saber quantos viraram agenda e faturamento completa o ROI e orienta os próximos ajustes.",
      },
    ],
    quote:
      "Setenta e três mensagens com custo por contato em queda — e ainda assim cinco dias sem campanha. O resultado de agosto é bom. Com saldo contínuo, seria melhor.",
  },
  footerLabel: "Relatório de performance · 4º mês · Google Ads · 22/07 – 23/08/2026",
};
