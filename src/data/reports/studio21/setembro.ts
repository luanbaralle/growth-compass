import dashSetembro from "@/assets/reports/studio21/Google-Ads-Setembro.png";
import type { ReportMonth } from "../types";

export const studio21Setembro: ReportMonth = {
  slug: "setembro",
  monthLabel: "Setembro",
  cycleLabel: "5º mês",
  cycleShort: "5º Mês",
  headerPeriod: "Ago – Set · 2026",
  period: "22/08 – 22/09/2026",
  periodShort: "22/08 – 22/09",
  dashboardPeriodLabel: "22 ago – 22 set · 2026",
  heroSubtitle:
    "Resultados do quinto mês de Google Ads. Treze dias sem campanha por falta de saldo, incluindo uma semana inteira parada, derrubaram o volume. A eficiência, porém, se sustentou: custo por mensagem menor que em agosto.",
  heroEmphasis: "quinto mês",
  metaChips: [
    { k: "Período", v: "22/08 – 22/09" },
    { k: "Plataforma", v: "Google Ads" },
    { k: "Região", v: "Itanhaém · Mongaguá · Peruíbe" },
    { k: "Ciclo", v: "5º mês" },
  ],
  overviewIntro:
    "Em 32 dias, com orçamento mantido em R$ 65/dia e 13 dias sem campanha por falta de saldo, o Studio 21 gerou 63 mensagens no WhatsApp. Volume abaixo de agosto, esperado com quase metade do ciclo parado, mas com custo por contato em R$ 18,74, o melhor do ciclo recente.",
  overviewHighlight:
    "A semana de 12 a 17/09 ficou sem entrega. No retorno do fim de semana, o CPC subiu: o Google precisa reaprender o que já estava otimizado. Interromper saldo não pausa só o anúncio. Pausa o aprendizado.",
  kpis: [
    {
      value: "9,5K",
      label: "Impressões",
      description: "O Studio 21 apareceu no Google cerca de 9,5 mil vezes no período.",
      accent: "blue",
    },
    {
      value: "692",
      label: "Cliques",
      description: "Pessoas que clicaram nos anúncios. Volume limitado pelos 13 dias parados.",
      accent: "red",
    },
    {
      value: "63",
      label: "Mensagens",
      description: "Contatos no WhatsApp, com taxa de conversão de 9,1%, a melhor do ciclo.",
      accent: "yellow",
    },
    {
      value: "R$1,2K",
      label: "Investimento",
      description: "Custo em mídia: R$ 1.180. Recargas no período equivalentes ao investido.",
      accent: "green",
    },
  ],
  dashboardSrc: dashSetembro,
  agencyWork: {
    intro:
      "No quinto mês a gestão foi além do ajuste pontual: lemos o impacto das interrupções de saldo, protegemos a qualidade das duas campanhas e mantivemos a estrutura dual sob orçamento limitado.",
    items: [
      "Diagnóstico contínuo de entrega, saldo e curva de aprendizado das campanhas",
      "Manutenção da estrutura dual: volume (Serviços gerais) e premium (Mechas + Mega Hair)",
      "Negativação de termos sem intenção de agendamento para proteger o CPC",
      "Leitura do impacto das pausas na eficiência pós-retorno (custo elevado no restart)",
      "Priorização de qualidade de clique sob teto diário e recarga sem folga",
    ],
  },
  campaignsNote:
    "Duas campanhas ativas: Serviços gerais (R$ 25/dia) e Mechas + Mega Hair (R$ 40/dia). A Performance Max permanece pausada e não gerou entrega no período.",
  campaignsIntro:
    "Serviços gerais seguem como motor de volume e eficiência: 43 mensagens a R$ 11,48 por contato, com CPC de R$ 1,08. Mechas + Mega Hair concentrou orçamento maior (R$ 40/dia) e manteve conversão premium: quase 1 em cada 12 cliques virou WhatsApp.",
  campaignsInsight:
    "Das 63 mensagens, ~43 vieram de Serviços gerais e ~20 de Mechas + Mega Hair. Mesmo com 13 dias off, a campanha premium sustentou conversão sólida, sinal de demanda real por procedimentos de maior valor na região.",
  campaigns: [
    {
      id: "geral",
      name: "Serviços gerais",
      subtitle: "Salão de beleza · cabeleireiro · corte · R$ 25/dia",
      accent: "blue",
      iconKey: "scissors",
      metrics: {
        impressions: 6410,
        clicks: 461,
        conversions: 43.4,
        cost: 498.25,
        cpc: 1.08,
        costPerConv: 11.48,
        convRate: 9.41,
        ctr: 7.19,
      },
    },
    {
      id: "high-ticket",
      name: "Mechas + Mega Hair",
      subtitle: "Luzes · mechas · mega hair · R$ 40/dia",
      accent: "yellow",
      iconKey: "sparkles",
      metrics: {
        impressions: 3073,
        clicks: 231,
        conversions: 19.6,
        cost: 682.23,
        cpc: 2.95,
        costPerConv: 34.81,
        convRate: 8.48,
        ctr: 7.52,
      },
    },
  ],
  comparison: {
    leftLabel: "4º mês",
    rightLabel: "5º mês",
    intro:
      "Investimento em mídia caiu ~22% e as mensagens ~14%, proporcional aos 13 dias sem campanha. O custo por WhatsApp melhorou: de R$ 20,74 para R$ 18,74. Menos volume, mais eficiência no que rodou.",
    warning:
      "Treze dias sem campanha (23 a 25/08, 29/08 a 01/09 e 12 a 17/09). Uma semana inteira zerada. O mês não foi fraco por falta de demanda. Foi limitado por saldo.",
    prev: {
      impressions: 13422,
      clicks: 1028,
      conversions: 73,
      cost: 1514.13,
      cpc: 1.47,
      costPerConv: 20.74,
    },
    current: {
      impressions: 9483,
      clicks: 692,
      conversions: 63,
      cost: 1180.48,
      cpc: 1.71,
      costPerConv: 18.74,
      convRate: 9.1,
      ctr: 7.3,
    },
  },
  investment: {
    intro:
      "O custo em mídia foi de R$ 1.180,48. As recargas no período equivaleram praticamente a esse valor, sem crédito promocional. 100% do investimento sai do caixa do salão.",
    mediaCostDisplay: "R$ 1.180",
    daysLabel: "32 dias",
    bars: [
      {
        label: "Recargas ≈ mídia",
        value: "R$ 1.180",
        pct: 100,
        note: "Valor pago em recargas praticamente igual ao custo em mídia do período.",
      },
    ],
    sideNotes: [
      "Recarga diária continua cobrindo no máximo um dia de campanha. Com 13 dias zerados, o Google não só deixa de entregar: perde o ritmo de otimização. O pico de custo no retorno do fim de semana é o sintoma clássico disso.",
    ],
    proofTitle: "O padrão se agrava",
    proofText:
      "Em agosto foram 5 dias parados. Em setembro, 13, incluindo a semana cheia de 12 a 17/09. Sempre que o saldo zera, a entrega cai a zero. Não é falta de busca na região: é falta de continuidade de saldo.",
  },
  reach: {
    highlightNumber: "9.483",
    intro:
      "Impressões −29% vs. agosto, com CTR estável em 7,30%. A relevância dos anúncios se manteve. O que cortou o alcance foram os 13 dias sem saldo, não a demanda da região.",
    cards: [
      {
        title: "Presença no momento certo",
        text: "Nos dias em que houve saldo, os anúncios apareceram para quem buscava salão, cabeleireiro, mechas ou mega hair em Itanhaém, Mongaguá e Peruíbe.",
        iconKey: "target",
      },
      {
        title: "13 dias sem campanha",
        text: "Paradas em 23 a 25/08, 29/08 a 01/09 e 12 a 17/09. Uma semana inteira em que a concorrência apareceu e o Studio 21 não.",
        iconKey: "pause",
      },
      {
        title: "Alcance regional qualificado",
        text: "Entrega concentrada na área de atuação do salão, sem desperdício de verba fora da região.",
        iconKey: "mapPin",
      },
    ],
  },
  clicks: {
    highlightNumber: "692",
    titleAfter: "pessoas demonstraram interesse",
    intro:
      "Cliques −33% vs. agosto, efeito direto dos 13 dias off. CPC médio subiu para R$ 1,71 (+16%), com pico no retorno após a semana parada. O destaque positivo: 63 mensagens a R$ 18,74 (−10% vs. 4º mês).",
    funnel: [
      { label: "Viram o anúncio", value: 9483, max: 9483, accent: "blue" },
      { label: "Clicaram para saber mais", value: 692, max: 9483, accent: "red" },
      { label: "Mensagem no WhatsApp", value: 63, max: 9483, accent: "yellow" },
    ],
    cpcDisplay: "R$ 1,71",
    cpcBadge: "Alta no restart",
    cpcNote:
      "CPC +16% vs. agosto. Parte da alta vem do retorno após a semana zerada: o algoritmo perde continuidade e paga mais caro até reestabilizar. Mesmo assim, o custo por mensagem caiu para R$ 18,74.",
    miniStats: [
      { v: "9,5K", l: "Vistas" },
      { v: "692", l: "Cliques" },
      { v: "63", l: "WhatsApp" },
    ],
  },
  audience: {
    intro:
      "O perfil se manteve: mulheres adultas na região do salão, buscando ativamente serviços de beleza no Google.",
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
      "O Google Ads entrega até a mensagem no WhatsApp. Agendamento e faturamento ficam no atendimento do salão, e este mês o cliente ainda não compartilhou esse retorno.",
    steps: [
      { label: "Anúncio visto", value: "9.483" },
      { label: "Clique", value: "692" },
      { label: "WhatsApp", value: "63" },
    ],
    afterTitle: "Depois do WhatsApp",
    afterText:
      "Sem dados de agendamento e faturamento do salão, o funil de negócio fica incompleto. Com 63 mensagens no período e taxa de conversão de 9,1%, esse retorno faria grande diferença para medir o ROI real do investimento.",
  },
  strategy: {
    title: "Treze dias off.",
    titleSoft: "O freio apertou.",
    intro:
      "O quinto mês deixa o diagnóstico inequívoco: as campanhas convertem bem quando estão no ar (taxa de 9,1%, custo por mensagem em queda). O limitador não é demanda nem criativo. É saldo que zera.",
    badTitle: "Recarga diária = freio de mão",
    badItems: [
      "Orçamento permanece em R$ 65/dia (R$ 25 gerais + R$ 40 premium)",
      "Recargas diárias cobrem no máximo 1 dia",
      "13 dias parados, quase 40% do ciclo sem entrega",
      "Semana cheia zerada: 12 a 17/09",
      "Retorno com CPC elevado por perda de otimização contínua",
    ],
    goodTitle: "O que o mês mostrou",
    goodItems: [
      "63 mensagens com custo por contato em R$ 18,74 (−10% vs. agosto)",
      "Taxa de conversão em 9,10%, a melhor do ciclo",
      "Serviços gerais a R$ 11,48 por WhatsApp",
      "Mechas + Mega Hair manteve conversão premium (~8,5%)",
      "CTR estável em 7,30%. Anúncios continuam relevantes",
    ],
    extraTitle: "Matemática simples",
    extraText:
      "Com R$ 65/dia, a recarga semanal ideal continua em ~R$ 455. Isso evita zerar o saldo e preserva o aprendizado do Google. Setembro prova o custo de operar sem folga: 13 dias sem anúncio e pico de CPC no restart. Os números bons do que rodou são apesar do freio, não graças a ele.",
  },
  budget: {
    cards: [
      {
        label: "Orçamento atual",
        value: "R$ 65",
        suffix: "/dia",
        note: "Mantido desde o 3º mês (R$ 25 gerais + R$ 40 Mechas). O teto diário não é o problema. É a continuidade de saldo.",
      },
      {
        label: "Recarga recomendada",
        value: "R$ 455",
        suffix: "/sem",
        note: "R$ 65 × 7 dias. Uma recarga semanal elimina as pausas e evita o reset de otimização.",
      },
      {
        label: "Projeção mensal",
        value: "R$ 1.950",
        note: "Mantendo R$ 65/dia com saldo contínuo, o investimento mensal fica em torno de R$ 1.950, com entrega estável e aprendizado preservado.",
        highlight: true,
      },
    ],
  },
  conclusion: {
    title: "Eficiência sustentada.",
    titleSoft: "Continuidade ainda falta.",
    intro:
      "Setembro entrega a prova mais clara até agora: quando as campanhas rodam, convertem bem e com custo controlado. Quando o saldo zera, o volume some e o retorno custa mais caro. O próximo salto não é criativo novo: é tirar o freio da recarga diária.",
    items: [
      {
        n: "01",
        title: "Passar para recarga semanal",
        text: "~R$ 455/semana a R$ 65/dia. É a única mudança que ataca os 13 dias parados e o pico de CPC no restart.",
      },
      {
        n: "02",
        title: "Não deixar o saldo zerar",
        text: "De 5 dias em agosto para 13 em setembro. Cada pausa entrega a busca da região para a concorrência e reinicia o aprendizado.",
      },
      {
        n: "03",
        title: "Manter as duas campanhas",
        text: "Gerais trazem volume e WhatsApp barato (R$ 11,48); Mechas + Mega Hair cobrem o ticket alto. A estrutura dual continua certa.",
      },
      {
        n: "04",
        title: "Fechar o funil no salão",
        text: "Com 63 WhatsApps e conv. rate de 9,1%, saber quantos viraram agenda e faturamento completa o ROI. Esse retorno ainda não foi compartilhado.",
      },
    ],
    quote:
      "Sessenta e três mensagens com o melhor custo por contato do ciclo recente, e treze dias sem campanha. Setembro não falhou na conversão. Falhou na continuidade de saldo.",
  },
  footerLabel: "Relatório de performance · 5º mês · Google Ads · 22/08 – 22/09/2026",
};
