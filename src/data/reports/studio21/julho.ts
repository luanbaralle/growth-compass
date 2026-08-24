import type { ReportMonth } from "../types";

export const studio21Julho: ReportMonth = {
  slug: "julho",
  monthLabel: "Julho",
  cycleLabel: "3º mês",
  cycleShort: "3º Mês",
  headerPeriod: "Jun – Jul · 2026",
  period: "22/06 – 22/07/2026",
  periodShort: "22/06 – 22/07",
  dashboardPeriodLabel: "22 jun — 22 jul · 2026",
  heroSubtitle:
    "Resultados do terceiro mês de Google Ads. Duas campanhas ativas — serviços gerais e mega hair — com análise dos números, do investimento e do que pode melhorar daqui pra frente.",
  heroEmphasis: "terceiro mês",
  metaChips: [
    { k: "Período", v: "22/06 – 22/07" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Itanhaém · Mongaguá · Peruíbe" },
    { k: "Ciclo", v: "3º mês" },
  ],
  overviewIntro:
    "Em 31 dias, com orçamento diário reduzido para R$ 65 e 5 dias de campanha parada, o volume de cliques ainda cresceu. Abaixo, o consolidado das duas campanhas.",
  kpis: [
    {
      value: "10,9K",
      label: "Impressões",
      description: "O Studio 21 apareceu no Google quase 11 mil vezes no período.",
      accent: "blue",
    },
    {
      value: "875",
      label: "Cliques",
      description: "Pessoas que clicaram nos anúncios — 25% a mais que no 2º mês.",
      accent: "red",
    },
    {
      value: "42",
      label: "Mensagens",
      description: "Contatos no WhatsApp gerados diretamente pelos anúncios.",
      accent: "yellow",
    },
    {
      value: "R$1,2K",
      label: "Investimento",
      description: "Custo em mídia no período. Valor pago em recargas: R$ 1.070.",
      accent: "green",
    },
  ],
  dashboardImage: "julho",
  campaignsNote:
    "Duas campanhas ativas: Serviços gerais (salão, cabeleireiro, corte) e Mega Hair (luzes, mechas, mega hair). Cada uma atinge um público e intenção de busca diferente — o detalhamento está na seção 02.",
  campaignsIntro:
    "Serviços gerais traz volume com CPC baixo. Mega Hair continua convertendo melhor: quase 8% dos cliques viram mensagem — mesmo com CPC mais alto, típico de serviços premium.",
  campaignsInsight:
    "A campanha Mega Hair gerou 17 das 42 mensagens com menos de um quarto dos cliques. A demanda por serviços de maior valor na região continua clara — e vale manter essa campanha com saldo estável.",
  campaigns: [
    {
      id: "geral",
      name: "Serviços gerais",
      subtitle: "Salão de beleza · cabeleireiro · corte",
      accent: "blue",
      iconKey: "scissors",
      metrics: {
        impressions: 7620,
        clicks: 657,
        conversions: 25,
        cost: 629.07,
        cpc: 0.96,
        costPerConv: 25.16,
        convRate: 3.81,
        ctr: 8.62,
      },
    },
    {
      id: "high-ticket",
      name: "Mega Hair",
      subtitle: "Luzes · mechas · mega hair",
      accent: "yellow",
      iconKey: "sparkles",
      metrics: {
        impressions: 3283,
        clicks: 218,
        conversions: 17,
        cost: 611.9,
        cpc: 2.81,
        costPerConv: 35.99,
        convRate: 7.8,
        ctr: 6.64,
      },
    },
  ],
  comparison: {
    leftLabel: "2º mês",
    rightLabel: "3º mês",
    intro:
      "Investimento em mídia praticamente igual, mas com mais cliques e CPC menor. As mensagens se mantiveram estáveis — mesmo com orçamento diário menor e 5 dias sem campanha.",
    warning:
      "Orçamento diário caiu de R$ 75 para R$ 65 e as recargas seguem diárias. Mesmo assim, cliques subiram e CPC caiu. O teto de resultado continua sendo a forma como o saldo é gerenciado — não a demanda da região.",
    prev: {
      impressions: 10646,
      clicks: 702,
      conversions: 41,
      cost: 1241.65,
      cpc: 1.77,
      costPerConv: 29.92,
    },
    current: {
      impressions: 10903,
      clicks: 875,
      conversions: 42,
      cost: 1240.97,
      cpc: 1.42,
      costPerConv: 29.55,
      convRate: 4.8,
      ctr: 8.03,
    },
  },
  investment: {
    intro:
      "Foram pagos R$ 1.070,00 em recargas no período. O custo em mídia foi de R$ 1.240,97 — diferença proveniente de saldo acumulado. Sem crédito promocional.",
    mediaCostDisplay: "R$ 1.241",
    daysLabel: "31 dias",
    bars: [
      {
        label: "Recargas no período",
        value: "R$ 1.070",
        pct: 86,
        note: "Valor efetivamente pago em dinheiro nas recargas.",
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
      "As recargas continuam diárias, entre R$ 50 e R$ 70, com orçamento agora em R$ 65/dia. O saldo esgota cedo e o Google deixa de investir nos horários de maior demanda.",
    ],
    proofTitle: "Prova prática",
    proofText:
      "Em um dia houve recarga em dobro (sem querer). Nesse dia o volume de resultados subiu — o Google finalmente teve verba para distribuir em horário de alta demanda. Se o saldo tivesse folga com frequência, o padrão seria esse.",
  },
  reach: {
    highlightNumber: "10.903",
    intro:
      "Impressões estáveis e CTR de 8,03% — sinal de que os anúncios continuam relevantes. O gargalo não é falta de interesse: são os dias sem entrega e o teto de orçamento diário.",
    cards: [
      {
        title: "Presença no momento certo",
        text: "Os anúncios apareceram quando pessoas pesquisavam por salão, cabeleireiro, luzes ou mega hair na região — nos dois tipos de campanha.",
        iconKey: "target",
      },
      {
        title: "5 dias sem campanha",
        text: "Campanhas paradas em 22/06, 23/06, 25/06, 28/06 e 29/06. Cinco dias em que o Studio 21 não apareceu no Google — e a concorrência sim.",
        iconKey: "pause",
      },
      {
        title: "Alcance regional qualificado",
        text: "Todas as impressões foram para pessoas em Itanhaém, Mongaguá e Peruíbe — sem desperdício de verba fora da área de atuação.",
        iconKey: "mapPin",
      },
    ],
  },
  clicks: {
    highlightNumber: "875",
    titleAfter: "pessoas demonstraram interesse",
    intro:
      "Cliques +24,6% em relação ao 2º mês, com CPC médio de R$ 1,42 (−19,8%). Mensagens ficaram estáveis em 42. Mais cliques baratos, mas o funil ainda sofre com pausas e orçamento apertado.",
    funnel: [
      { label: "Viram o anúncio", value: 10903, max: 10903, accent: "blue" },
      { label: "Clicaram para saber mais", value: 875, max: 10903, accent: "red" },
      { label: "Mensagem no WhatsApp", value: 42, max: 10903, accent: "yellow" },
    ],
    cpcDisplay: "R$ 1,42",
    cpcBadge: "−19,8% vs. 2º mês",
    cpcNote:
      "CPC melhorou de novo. Custo por mensagem ficou em R$ 29,55 — praticamente estável em relação ao mês anterior.",
    miniStats: [
      { v: "10,9K", l: "Vistas" },
      { v: "875", l: "Cliques" },
      { v: "42", l: "WhatsApp" },
    ],
  },
  audience: {
    intro:
      "O perfil de público se manteve consistente — mulheres adultas na região de atuação do salão, buscando ativamente serviços de beleza no Google.",
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
      "O Google Ads entrega até a mensagem no WhatsApp. O que acontece depois — agendamento e faturamento — fica no atendimento do salão.",
    steps: [
      { label: "Anúncio visto", value: "10.903" },
      { label: "Clique", value: "875" },
      { label: "WhatsApp", value: "42" },
    ],
    afterTitle: "Depois do WhatsApp",
    afterText:
      "Não temos retorno do salão sobre agendamentos ou faturamento gerados por essas mensagens. Sem esse dado, o funil do Google Ads termina no contato — e fica incompleto medir o retorno real do investimento.",
  },
  strategy: {
    title: "Orçamento de sobra",
    titleSoft: "muda o resultado",
    intro:
      "Este mês deixou uma evidência clara: quando houve recarga em dobro num dia de alta demanda, o volume de resultados subiu. Não foi coincidência — foi verba disponível no horário certo.",
    badTitle: "Recargas diárias + pausas",
    badItems: [
      "Orçamento reduzido de R$ 75 para R$ 65/dia",
      "Recargas diárias de R$ 50–70 continuam limitando",
      "5 dias parados: 22, 23, 25, 28 e 29/06",
      "Saldo esgota antes dos horários de pico",
      "Google não consegue distribuir verba no melhor momento",
    ],
    goodTitle: "Saldo com folga",
    goodItems: [
      "Recarga semanal cobre o orçamento (R$ 65 × 7 ≈ R$ 455)",
      "Campanhas rodam sem parar, inclusive nos picos",
      "O dia da recarga em dobro mostrou o potencial",
      "CPC continua caindo — sinal de maturidade das campanhas",
      "Mais verba disponível = mais resultados no mesmo dia",
    ],
    extraTitle: "O dia da recarga em dobro",
    extraText:
      "Em um dia do período, houve recarga duas vezes. Nesse dia o Google teve orçamento suficiente para investir nos horários de maior busca — e o volume de resultados aumentou. Esse episódio é a prova mais direta de que se sempre houvesse orçamento de sobra, os resultados seriam melhores.",
  },
  budget: {
    cards: [
      {
        label: "Orçamento atual",
        value: "R$ 65",
        suffix: "/dia",
        note: "Reduzido de R$ 75/dia neste período. Menos teto diário = menos capacidade de captura nos picos.",
      },
      {
        label: "Recarga recomendada",
        value: "R$ 455",
        suffix: "/sem",
        note: "R$ 65 × 7 dias. Uma recarga semanal evita pausas e deixa o Google distribuir a verba nos melhores horários.",
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
    title: "A demanda existe.",
    titleSoft: "Falta folga de orçamento.",
    intro:
      "O terceiro mês reforça o padrão: cliques sobem, CPC cai, as duas campanhas funcionam. O limitador continua sendo recarga diária e saldo que zera — e o dia da recarga em dobro mostrou o que muda quando há verba.",
    items: [
      {
        n: "01",
        title: "Recarregar o saldo da semana",
        text: "Em vez de R$ 50–70 por dia, uma recarga de ~R$ 455 cobre 7 dias a R$ 65/dia. Elimina pausas e libera o Google nos horários de pico.",
      },
      {
        n: "02",
        title: "Não deixar o saldo zerar",
        text: "Cinco dias sem campanha neste mês. Cada dia parado é um dia em que a concorrência aparece e o Studio 21 não.",
      },
      {
        n: "03",
        title: "Manter as duas campanhas",
        text: "Serviços gerais trazem volume e CPC baixo; Mega Hair converte melhor (7,8%). As duas juntas cobrem o funil do salão.",
      },
      {
        n: "04",
        title: "Olhar o funil além do WhatsApp",
        text: "Sem dados de agendamento e faturamento do salão, não dá para fechar o retorno real. Esse acompanhamento completa a análise.",
      },
    ],
    quote:
      "Um dia com recarga em dobro bastou para o volume subir. Não foi sorte — foi orçamento disponível quando a demanda estava alta. Se isso fosse regra, não exceção, o resultado mensal seria outro.",
  },
  footerLabel: "Relatório de performance · 3º mês · Google Ads · 22/06 – 22/07/2026",
};
