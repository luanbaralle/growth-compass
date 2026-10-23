import dashOutubro from "@/assets/reports/studio21/Google-Ads-Outubro.png";
import type { ReportMonth } from "../types";

export const studio21Outubro: ReportMonth = {
  slug: "outubro",
  monthLabel: "Outubro",
  cycleLabel: "6º mês",
  cycleShort: "6º Mês",
  headerPeriod: "Set – Out · 2026",
  period: "22/09 – 22/10/2026",
  periodShort: "22/09 – 22/10",
  dashboardPeriodLabel: "22 set – 22 out · 2026",
  heroSubtitle:
    "Resultados do sexto mês de Google Ads e do primeiro semestre de gestão. O melhor volume do ciclo: 89 mensagens, CPC em queda e a prova mais clara até agora de que saldo contínuo libera o teto das campanhas.",
  heroEmphasis: "sexto mês",
  metaChips: [
    { k: "Período", v: "22/09 – 22/10" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Itanhaém · Mongaguá · Peruíbe" },
    { k: "Ciclo", v: "6º mês" },
  ],
  overviewIntro:
    "Em 31 dias, com orçamento mantido em R$ 65/dia e 7 dias sem campanha, o Studio 21 gerou 89 mensagens no WhatsApp. Melhor volume desde o início da operação, com custo por contato em R$ 17,70 e CTR de 8,51%.",
  overviewHighlight:
    "Nos dias 13, 14 e 15/10 o saldo foi recarregado mais de uma vez no mesmo dia. O Google identificou demanda alta, gastou acima do teto diário e trouxe 25 novos contatos em 72 horas. Quase 30% do mês em três dias. Conta com folga de saldo = potência máxima.",
  kpis: [
    {
      value: "13,3K",
      label: "Impressões",
      description: "O Studio 21 apareceu no Google mais de 13 mil vezes no período.",
      accent: "blue",
    },
    {
      value: "1.132",
      label: "Cliques",
      description: "Pessoas que clicaram nos anúncios. Melhor volume de cliques do ciclo.",
      accent: "red",
    },
    {
      value: "89",
      label: "Mensagens",
      description: "Contatos no WhatsApp. Recorde da operação, +41% vs. setembro.",
      accent: "yellow",
    },
    {
      value: "R$1,6K",
      label: "Investimento",
      description: "Custo em mídia: R$ 1.576. Recargas no período equivalentes ao investido.",
      accent: "green",
    },
  ],
  dashboardSrc: dashOutubro,
  agencyWork: {
    intro:
      "No sexto mês a gestão leu a nova dinâmica de recarga, protegeu a qualidade das duas campanhas e transformou os picos de demanda em diagnóstico claro para o próximo semestre.",
    items: [
      "Monitoramento contínuo de entrega, saldo e curva de aprendizado das duas campanhas",
      "Acompanhamento da nova dinâmica: o cliente passou a recarregar direto na conta",
      "Diagnóstico do padrão de pausa em domingo e segunda, e do impacto no restart",
      "Leitura dos picos de 13 a 15/10: correlação entre saldo extra e volume de WhatsApp",
      "Proteção de qualidade de busca: negativações e ajustes para preservar CPC e intenção",
      "Otimização da campanha premium (Mechas + Mega Hair), que chegou a 11,5% de conversão",
    ],
  },
  campaignsNote:
    "Duas campanhas ativas: Serviços gerais (R$ 25/dia) e Mechas + Mega Hair (R$ 40/dia). A Performance Max permanece pausada e não gerou entrega no período.",
  campaignsIntro:
    "Serviços gerais seguem como motor de volume: 47 mensagens a R$ 12,54 por contato, com CPC de R$ 0,77. Mechas + Mega Hair deu o salto do mês: 42 mensagens, quase o dobro de setembro, com 11,48% de conversão.",
  campaignsInsight:
    "Das 89 mensagens, 47 vieram de Serviços gerais e 42 de Mechas + Mega Hair. A campanha premium praticamente empatou em volume com a de ticket do dia a dia. Quase 1 em cada 9 cliques de mechas e mega hair virou WhatsApp: demanda real por procedimento de maior valor na região.",
  campaigns: [
    {
      id: "geral",
      name: "Serviços gerais",
      subtitle: "Salão de beleza · cabeleireiro · corte · R$ 25/dia",
      accent: "blue",
      iconKey: "scissors",
      metrics: {
        impressions: 8515,
        clicks: 766,
        conversions: 47,
        cost: 589.31,
        cpc: 0.77,
        costPerConv: 12.54,
        convRate: 6.14,
        ctr: 9.0,
      },
    },
    {
      id: "high-ticket",
      name: "Mechas + Mega Hair",
      subtitle: "Luzes · mechas · mega hair · R$ 40/dia",
      accent: "yellow",
      iconKey: "sparkles",
      metrics: {
        impressions: 4780,
        clicks: 366,
        conversions: 42,
        cost: 986.43,
        cpc: 2.7,
        costPerConv: 23.49,
        convRate: 11.48,
        ctr: 7.66,
      },
    },
  ],
  comparison: {
    leftLabel: "5º mês",
    rightLabel: "6º mês",
    intro:
      "Investimento em mídia subiu ~33% e as mensagens cresceram ~41%. Cliques +64%, CPC −19% e custo por WhatsApp em R$ 17,70. Mais volume e mais eficiência no mesmo teto diário.",
    warning:
      "Sete dias sem campanha: 23/09, 27 e 28/09, 08/10, 11/10, 18 e 19/10. A maior parte cai em domingo e segunda. O Google não para de buscar no fim de semana: quem pesquisa encontra a concorrência.",
    prev: {
      impressions: 9483,
      clicks: 692,
      conversions: 63,
      cost: 1180.48,
      cpc: 1.71,
      costPerConv: 18.74,
    },
    current: {
      impressions: 13295,
      clicks: 1132,
      conversions: 89,
      cost: 1575.74,
      cpc: 1.39,
      costPerConv: 17.7,
      convRate: 7.86,
      ctr: 8.51,
    },
  },
  milestone: {
    title: "Um semestre.",
    titleSoft: "Uma operação no ar.",
    intro:
      "De abril a outubro, o Studio 21 saiu de zero presença paga no Google para um canal previsível de novos contatos. Seis ciclos, duas campanhas e um recorde neste mês. O semestre prova a demanda. Outubro prova o teto.",
    kpis: [
      {
        value: "68 mil",
        label: "Impressões",
        note: "O salão apareceu no Google 68.249 vezes em seis meses, na região certa.",
      },
      {
        value: "4.959",
        label: "Cliques",
        note: "Quase cinco mil pessoas clicaram para conhecer o Studio 21.",
      },
      {
        value: "371",
        label: "WhatsApp",
        note: "Trezentos e setenta e um contatos gerados pelos anúncios. Outubro foi o recorde: 89.",
      },
      {
        value: "R$ 8 mil",
        label: "Mídia",
        note: "Cerca de R$ 7.983 investidos em seis meses. Custo médio por contato em torno de R$ 21,50. Em outubro: R$ 17,70.",
      },
    ],
    quote:
      "Seis meses atrás o Studio 21 não aparecia no Google para quem buscava salão na região. Neste semestre foram 371 mensagens. Outubro mostra o que acontece quando há saldo nos dias de demanda: 25 contatos em três dias.",
  },
  investment: {
    intro:
      "O custo em mídia foi de R$ 1.575,74. Neste ciclo o cliente passou a recarregar direto na conta, o que reduziu as interrupções. As recargas no período equivaleram praticamente a esse valor.",
    mediaCostDisplay: "R$ 1.576",
    daysLabel: "31 dias",
    bars: [
      {
        label: "Recargas ≈ mídia",
        value: "R$ 1.576",
        pct: 100,
        note: "Valor pago em recargas praticamente igual ao custo em mídia do período.",
      },
    ],
    sideNotes: [
      "A recarga pelo próprio cliente melhorou a continuidade: de 13 dias parados em setembro para 7 em outubro. Ainda assim, a recarga diária com saldo mínimo impede o Google de guardar verba para os dias de maior busca.",
    ],
    proofTitle: "A prova dos três dias",
    proofText:
      "Em 13, 14 e 15/10 o saldo acabou e foi recarregado mais de uma vez no mesmo dia. O Google leu demanda alta, gastou acima do orçamento diário e entregou 25 WhatsApps em 72 horas. Quase 30% do mês. Não foi sorte. Foi saldo disponível no momento certo.",
  },
  reach: {
    highlightNumber: "13.295",
    intro:
      "Impressões +40% vs. setembro, com CTR em 8,51%, o melhor do ciclo. Os anúncios ficaram mais relevantes. O que ainda corta o alcance são os 7 dias sem saldo, concentrados em domingo e segunda.",
    cards: [
      {
        title: "Presença no momento certo",
        text: "Nos dias com saldo, os anúncios apareceram para quem buscava salão, cabeleireiro, mechas ou mega hair em Itanhaém, Mongaguá e Peruíbe.",
        iconKey: "target",
      },
      {
        title: "7 dias sem campanha",
        text: "Paradas em 23/09, 27–28/09, 08/10, 11/10 e 18–19/10. Menos que em setembro, mas o padrão de domingo e segunda continua entregando a busca da região para a concorrência.",
        iconKey: "pause",
      },
      {
        title: "Pico de 13 a 15/10",
        text: "Três dias com recarga extra e 25 novos contatos. O Google já sabe quando a região busca. Falta saldo para acompanhar.",
        iconKey: "trendingUp",
      },
    ],
  },
  clicks: {
    highlightNumber: "1.132",
    titleAfter: "pessoas demonstraram interesse",
    intro:
      "Cliques +64% vs. setembro, o maior volume da operação. CPC médio caiu para R$ 1,39 (−19%). O destaque: 89 mensagens a R$ 17,70, o melhor custo por contato do ciclo recente.",
    funnel: [
      { label: "Viram o anúncio", value: 13295, max: 13295, accent: "blue" },
      { label: "Clicaram para saber mais", value: 1132, max: 13295, accent: "red" },
      { label: "Mensagem no WhatsApp", value: 89, max: 13295, accent: "yellow" },
    ],
    cpcDisplay: "R$ 1,39",
    cpcBadge: "Melhor CPC do ciclo",
    cpcNote:
      "CPC −19% vs. setembro. Serviços gerais a R$ 0,77 por clique. A conta aprendeu de novo quando teve continuidade, e o custo caiu mesmo com mais volume.",
    miniStats: [
      { v: "13,3K", l: "Vistas" },
      { v: "1.132", l: "Cliques" },
      { v: "89", l: "WhatsApp" },
    ],
  },
  audience: {
    intro:
      "O perfil se manteve: mulheres adultas na região do salão, buscando ativamente serviços de beleza no Google. Quase toda a conversão veio do celular.",
    cards: [
      {
        title: "Gênero predominante",
        big: "Mulheres",
        text: "A comunicação continua atingindo quem decide agendar, o público principal do Studio 21.",
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
      "O Google Ads entrega até a mensagem no WhatsApp. Agendamento e faturamento ficam no atendimento do salão. A operação segue mensurando o trecho sob gestão da campanha: do clique ao contato.",
    steps: [
      { label: "Anúncio visto", value: "13.295" },
      { label: "Clique", value: "1.132" },
      { label: "WhatsApp", value: "89" },
    ],
    afterTitle: "Depois do WhatsApp",
    afterText:
      "Com 89 mensagens no período e 371 no semestre, o retorno de agenda e faturamento completaria o ROI. Esse dado comercial não foi compartilhado. A campanha cumpre a parte dela: levar a pessoa certa até o WhatsApp do salão.",
  },
  strategy: {
    title: "Saldo no dia certo",
    titleSoft: "libera o teto.",
    intro:
      "O sexto mês fecha o semestre com o melhor volume da operação e a evidência mais direta de como o saldo funciona. Recarga pelo cliente reduziu as pausas. Recarga diária no mínimo ainda impede o Google de investir quando a busca sobe.",
    badTitle: "Recarga mínima ainda limita",
    badItems: [
      "Orçamento permanece em R$ 65/dia (R$ 25 gerais + R$ 40 premium)",
      "Recargas diárias cobrem no máximo 1 dia, sem folga para picos",
      "7 dias parados, em geral domingo e segunda",
      "Domingo sem saldo entrega a busca da região para a concorrência",
      "Google não consegue guardar verba para os dias de maior demanda",
    ],
    goodTitle: "O que o mês mostrou",
    goodItems: [
      "89 mensagens, recorde da operação (+41% vs. setembro)",
      "CPC em R$ 1,39 (−19%) e custo por contato em R$ 17,70",
      "Mechas + Mega Hair: 42 WhatsApps com 11,48% de conversão",
      "Pausas caíram de 13 para 7 dias com recarga pelo cliente",
      "13 a 15/10: 25 contatos em 3 dias com saldo extra no mesmo dia",
    ],
    extraTitle: "A conta de 72 horas",
    extraText:
      "25 mensagens em 13, 14 e 15/10. Isso é quase 30% do mês em três dias, quando houve recarga acima do mínimo. O restante do ciclo rodou no teto de R$ 65/dia, com buracos de domingo. A recomendação não mudou em seis meses: saldo semanal contínuo. Outubro só deixou o argumento impossível de ignorar.",
  },
  budget: {
    cards: [
      {
        label: "Orçamento atual",
        value: "R$ 65",
        suffix: "/dia",
        note: "Mantido desde o 3º mês (R$ 25 gerais + R$ 40 Mechas). O teto diário não é o problema. É a folga de saldo nos dias de demanda.",
      },
      {
        label: "Recarga recomendada",
        value: "R$ 455",
        suffix: "/sem",
        note: "R$ 65 × 7 dias, inclusive domingo. Uma recarga semanal elimina as pausas e deixa o Google gastar quando a busca sobe.",
      },
      {
        label: "Projeção mensal",
        value: "R$ 1.950",
        note: "Mantendo R$ 65/dia com saldo contínuo, o investimento mensal fica em torno de R$ 1.950. Outubro chegou a R$ 1.576 mesmo com 7 dias off. Com folga, o volume acompanha.",
        highlight: true,
      },
    ],
  },
  conclusion: {
    title: "Melhor mês do semestre.",
    titleSoft: "O teto ainda não veio.",
    intro:
      "Outubro entrega o recorde de mensagens, o melhor CPC recente e a prova de que saldo extra captura demanda. Seis meses de gestão montaram o canal. O próximo salto continua sendo o mesmo: recarga semanal, sem zerar no domingo.",
    items: [
      {
        n: "01",
        title: "Passar para recarga semanal",
        text: "~R$ 455/semana a R$ 65/dia, inclusive domingo. É a mudança que ataca as 7 pausas e libera os picos como o de 13 a 15/10.",
      },
      {
        n: "02",
        title: "Não deixar o domingo zerar",
        text: "Quem busca salão no fim de semana encontra quem está no ar. O mito de que domingo não vale a pena custa impressões, cliques e WhatsApp.",
      },
      {
        n: "03",
        title: "Manter as duas campanhas",
        text: "Gerais trazem volume barato (R$ 12,54/msg, CPC R$ 0,77). Mechas + Mega Hair chegou a 42 contatos com 11,5% de conversão. A estrutura dual está madura.",
      },
      {
        n: "04",
        title: "Repetir o que os três dias provaram",
        text: "Saldo de sobra nos dias de demanda. 25 leads em 72 horas não foi exceção: foi a conta operando perto da potência máxima.",
      },
    ],
    quote:
      "Oitenta e nove mensagens no melhor mês do semestre, e vinte e cinco delas em três dias com saldo extra. Seis meses para montar o canal. O teto agora depende de não deixar a conta zerar.",
  },
  footerLabel: "Relatório de performance · 6º mês · 1º semestre · Google Ads · 22/09 – 22/10/2026",
};
