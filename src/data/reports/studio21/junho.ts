import type { ReportMonth } from "../types";

export const studio21Junho: ReportMonth = {
  slug: "junho",
  monthLabel: "Junho",
  cycleLabel: "2º mês",
  cycleShort: "2º Mês",
  headerPeriod: "Mai – Jun · 2026",
  period: "20/05 – 22/06/2026",
  periodShort: "20/05 – 22/06",
  dashboardPeriodLabel: "20 mai — 22 jun · 2026",
  heroSubtitle:
    "Este relatório apresenta os resultados do segundo mês de campanhas no Google Ads. Duas campanhas ativas — serviços gerais e serviços de maior valor — com análise honesta do período, incluindo os impactos das interrupções no desempenho.",
  heroEmphasis: "segundo mês",
  metaChips: [
    { k: "Período", v: "20/05 – 22/06" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Itanhaém · Mongaguá · Peruíbe" },
    { k: "Ciclo", v: "2º mês" },
  ],
  overviewIntro:
    "Em 34 dias, com duas campanhas ativas, os anúncios geraram mais cliques que no mês anterior — mas as interrupções por falta de saldo limitaram a entrega e reduziram as mensagens no WhatsApp. Abaixo, o consolidado das duas campanhas.",
  kpis: [
    {
      value: "10,6K",
      label: "Impressões",
      description: "O Studio 21 apareceu no Google mais de 10 mil vezes no período.",
      accent: "blue",
    },
    {
      value: "702",
      label: "Cliques",
      description: "Pessoas que clicaram nos anúncios — 32% a mais que no 1º mês.",
      accent: "red",
    },
    {
      value: "41",
      label: "Mensagens",
      description: "Contatos no WhatsApp gerados diretamente pelos anúncios.",
      accent: "yellow",
    },
    {
      value: "R$1,2K",
      label: "Investimento",
      description: "Valor pago em dinheiro ao Google — sem crédito promocional.",
      accent: "green",
    },
  ],
  dashboardImage: "junho",
  campaignsNote:
    "Duas campanhas ativas: Serviços gerais (salão, cabeleireiro, corte) e Serviços de maior valor (luzes, mechas, mega hair). Cada uma atinge um público e intenção de busca diferente — o detalhamento está na seção 02.",
  campaignsIntro:
    "Separar as campanhas ajuda a entender onde o investimento está rendendo mais. A campanha de maior valor tem CPC mais alto — natural para serviços premium — mas converte com mais eficiência: quase 1 em cada 10 cliques vira mensagem.",
  campaignsInsight:
    "A campanha de maior valor responde por quase metade das mensagens (20 de 41) com menos da metade dos cliques. Isso confirma que existe demanda real por luzes, mechas e mega hair na região — e que vale a pena manter essa campanha rodando de forma estável.",
  campaigns: [
    {
      id: "geral",
      name: "Serviços gerais",
      subtitle: "Salão de beleza · cabeleireiro · corte",
      accent: "blue",
      iconKey: "scissors",
      metrics: {
        impressions: 7047,
        clicks: 494,
        conversions: 21,
        cost: 550.03,
        cpc: 1.11,
        costPerConv: 25.58,
        convRate: 4.35,
      },
    },
    {
      id: "high-ticket",
      name: "Serviços de maior valor",
      subtitle: "Luzes · mechas · mega hair",
      accent: "yellow",
      iconKey: "sparkles",
      metrics: {
        impressions: 3599,
        clicks: 208,
        conversions: 20,
        cost: 691.62,
        cpc: 3.33,
        costPerConv: 34.58,
        convRate: 9.62,
      },
    },
  ],
  comparison: {
    leftLabel: "1º mês",
    rightLabel: "2º mês",
    intro:
      "O investimento em dinheiro foi praticamente o mesmo, mas a dinâmica mudou: mais cliques, CPC menor, porém menos mensagens. A explicação está nas pausas — o Google perde ritmo de otimização toda vez que as campanhas param.",
    warning:
      "No 1º mês, parte do investimento veio de crédito promocional do Google (R$ 700), o que ampliou o alcance sem custo direto. Neste período, 100% foi pago em dinheiro — e ainda assim as campanhas ficaram paradas por ~11 dias. Isso pesa diretamente no volume de mensagens.",
    prev: {
      impressions: 10500,
      clicks: 530,
      conversions: 63,
      cost: 1230,
      cpc: 2.29,
    },
    current: {
      impressions: 10646,
      clicks: 702,
      conversions: 41,
      cost: 1241.65,
      cpc: 1.77,
      costPerConv: 29.92,
      convRate: 5.91,
    },
  },
  investment: {
    intro:
      "O investimento total no período foi de R$ 1.241,65, integralmente pago ao Google. Diferente do 1º mês, não houve crédito promocional aplicado — cada real gasto saiu do bolso do salão.",
    mediaCostDisplay: "R$ 1.242",
    daysLabel: "34 dias",
    bars: [
      {
        label: "Pago direto",
        value: "R$ 1.240",
        pct: 100,
        note: "100% do investimento em dinheiro — sem bônus da plataforma neste ciclo.",
      },
      {
        label: "Crédito promocional",
        value: "R$ 0",
        pct: 0,
        note: "Nenhum crédito aplicado neste período.",
        muted: true,
      },
    ],
    sideNotes: [
      "As recargas foram feitas literalmente todos os dias, entre R$ 50 e R$ 70. Com orçamento de R$ 75/dia, isso significa que o saldo esgotava antes do dia terminar — impedindo o Google de investir nos momentos de maior demanda e forçando reinícios constantes.",
      "A janela de investimento para a promoção anterior encerrou em 21/06. O saldo acumulado (incluindo crédito do 1º mês) chegou a R$ 2.414 dos R$ 3.500 necessários. Esse capítulo está encerrado — o foco agora é construir resultados com investimento consistente.",
    ],
  },
  reach: {
    highlightNumber: "10.646",
    intro:
      "O volume de impressões se manteve estável em relação ao 1º mês, mesmo com as campanhas paradas por falta de saldo em dois períodos. Isso mostra que a demanda na região continua forte — o gargalo não é falta de interesse, e sim a entrega intermitente dos anúncios.",
    cards: [
      {
        title: "Presença no momento certo",
        text: "Os anúncios apareceram quando pessoas pesquisavam por salão, cabeleireiro, luzes ou mega hair na região — nos dois tipos de campanha, cobrindo desde serviços do dia a dia até procedimentos premium.",
        iconKey: "target",
      },
      {
        title: "Entrega interrompida",
        text: "Campanhas totalmente paradas de 23/05 a 29/05 e de 19/06 até a data deste relatório. São ~11 dias sem nenhuma presença no Google — dias em que concorrentes continuaram aparecendo.",
        iconKey: "pause",
      },
      {
        title: "Alcance regional qualificado",
        text: "Todas as impressões foram para pessoas em Itanhaém, Mongaguá e Peruíbe — sem desperdício de verba com quem está fora da área de atuação do salão.",
        iconKey: "mapPin",
      },
    ],
  },
  clicks: {
    highlightNumber: "702",
    titleAfter: "pessoas demonstraram interesse",
    intro:
      "O número de cliques cresceu 32% em relação ao mês anterior, com CPC médio de R$ 1,77 — bem abaixo dos R$ 2,29 do 1º mês. Porém, as mensagens caíram de 63 para 41. Mais cliques com menos conversões é um sinal clássico de campanhas que reiniciam frequentemente.",
    funnel: [
      { label: "Viram o anúncio", value: 10646, max: 10646, accent: "blue" },
      { label: "Clicaram para saber mais", value: 702, max: 10646, accent: "red" },
      { label: "Mensagem no WhatsApp", value: 41, max: 10646, accent: "yellow" },
    ],
    cpcDisplay: "R$ 1,77",
    cpcBadge: "−22,7% vs. 1º mês",
    cpcNote:
      "O CPC melhorou, mas o custo por mensagem subiu para R$ 29,92 — reflexo direto de menos conversões no mesmo investimento, agravado pelas pausas.",
    miniStats: [
      { v: "10,6K", l: "Vistas" },
      { v: "702", l: "Cliques" },
      { v: "41", l: "WhatsApp" },
    ],
  },
  audience: {
    intro:
      "O perfil de público se manteve consistente com o 1º mês — mulheres adultas na região de atuação do salão, buscando ativamente serviços de beleza no Google.",
    cards: [
      {
        title: "Gênero predominante",
        big: "Mulheres",
        text: "A grande maioria das pessoas que interagiram com os anúncios são mulheres — confirmando que a comunicação atinge o público que toma a decisão de agendar.",
        iconKey: "users",
      },
      {
        title: "Faixa etária principal",
        big: "35 – 54 anos",
        text: "Mulheres com rotina estabelecida e poder de compra — perfil ideal tanto para serviços do dia a dia quanto para procedimentos de maior valor.",
        iconKey: "calendar",
      },
      {
        title: "Região de origem",
        big: "Itanhaém · Mongaguá · Peruíbe",
        text: "Todos os leads vieram das cidades onde o Studio 21 está localizado. Sem desperdício de verba com outras regiões.",
        iconKey: "mapPin",
      },
      {
        title: "Origem dos leads",
        big: "100% Pesquisa Google",
        text: "Todos os contatos vieram de pessoas buscando ativamente serviços de beleza no momento em que viram o anúncio.",
        iconKey: "search",
      },
    ],
  },
  funnel: {
    intro:
      "O funil abaixo mostra o caminho até a mensagem no WhatsApp. A etapa seguinte — agendamento e faturamento — acontece dentro do salão.",
    steps: [
      { label: "Anúncio visto", value: "10.646" },
      { label: "Clique", value: "702" },
      { label: "WhatsApp", value: "41" },
    ],
    afterTitle: "Etapa seguinte: dentro do salão",
    afterText:
      "O Google Ads nos mostra o caminho até a mensagem no WhatsApp. A partir daí, o agendamento e o faturamento acontecem no salão. Em alguns momentos perguntamos como estão os resultados — agendamentos, movimento, faturamento — mas ainda não recebemos esse retorno para completar o funil com precisão.",
  },
  strategy: {
    title: "Por que a estabilidade",
    titleSoft: "é fundamental",
    intro:
      "Este mês foi o exemplo prático do que acontece quando o investimento não acompanha o orçamento configurado. Recargas diárias de R$ 50–70 com orçamento de R$ 75/dia criam um ciclo de parar e recomeçar que prejudica todos os indicadores.",
    badTitle: "Recargas diárias + pausas",
    badItems: [
      "Recargas de R$ 50–70/dia com orçamento de R$ 75/dia",
      "Saldo esgotava antes do fim do dia",
      "Campanhas paradas: 23/05–29/05 e 19/06–22/06",
      "Google reiniciou o aprendizado a cada retomada",
      "Mais cliques, mas menos mensagens (−35%)",
    ],
    goodTitle: "Saldo semanal",
    goodItems: [
      "Uma recarga cobre a semana inteira (R$ 75 × 7 = R$ 525)",
      "Campanhas rodam sem parar, inclusive nos dias de pico",
      "O algoritmo otimiza e reduz o custo por resultado",
      "Volume de mensagens se torna previsível",
      "Dois tipos de campanha continuam captando demanda real",
    ],
    extraTitle: "Recarga diária vs. orçamento diário",
    extraText:
      "Quando o orçamento está em R$ 75/dia mas a recarga é de R$ 50, o saldo acaba em aproximadamente 16 horas. O Google para de exibir os anúncios no período em que mais pessoas pesquisam (fim da tarde e noite) — e quando a campanha volta, precisa reaprender quem converter. Não é questão de preferência: é matemática do orçamento.",
  },
  budget: {
    cards: [
      {
        label: "Orçamento configurado",
        value: "R$ 75",
        suffix: "/dia",
        note: "Manteve-se em R$ 75/dia durante todo o período — sem alteração nas campanhas.",
      },
      {
        label: "Recarga recomendada",
        value: "R$ 525",
        suffix: "/sem",
        note: "R$ 75 × 7 dias. Uma recarga semanal evita pausas e permite que o Google distribua o investimento nos melhores momentos.",
      },
      {
        label: "Projeção mensal",
        value: "R$ 2.250",
        note: "Mantendo R$ 75/dia com saldo contínuo, o investimento mensal é de R$ 2.250 — base para resultados previsíveis.",
        highlight: true,
      },
    ],
  },
  conclusion: {
    title: "A demanda existe.",
    titleSoft: "A entrega precisa acompanhar.",
    intro:
      "O segundo mês confirma que há busca ativa por serviços do Studio 21 na região — em ambas as campanhas. O que limitou os resultados não foi falta de interesse, e sim a forma como o saldo foi gerenciado. As recomendações abaixo são diretas e práticas.",
    items: [
      {
        n: "01",
        title: "Recarregar o saldo da semana",
        text: "Em vez de R$ 50 por dia, uma recarga de R$ 525 cobre 7 dias de orçamento. Isso elimina as pausas que custaram ~11 dias de campanha neste período.",
      },
      {
        n: "02",
        title: "Não deixar o saldo zerar",
        text: "Cada vez que o saldo acaba, as campanhas param e o Google recomeça do zero. O custo por mensagem sobe e o volume cai — exatamente o que vimos neste mês.",
      },
      {
        n: "03",
        title: "Manter as duas campanhas ativas",
        text: "Serviços gerais trazem volume; serviços de maior valor convertem melhor (9,6% de taxa). As duas juntas cobrem o funil completo do salão.",
      },
      {
        n: "04",
        title: "Retorno sobre agendamentos",
        text: "Quando o salão compartilhar como estão os agendamentos e o movimento gerado pelas mensagens, conseguimos medir o retorno completo do investimento e ajustar as campanhas com mais precisão.",
      },
    ],
    quote:
      "Investir R$ 50 quando o orçamento é R$ 75 não economiza — interrompe. A diferença entre 41 e 63 mensagens neste período não foi falta de demanda. Foi falta de continuidade.",
  },
  footerLabel: "Relatório de performance · 2º mês · Google Ads · 20/05 – 22/06/2026",
};
