import type { BlogArticle } from "../types";
import {
  p,
  h2,
  h3,
  ul,
  ol,
  callout,
  table,
  cta,
  linkCard,
  blogFeatured,
  blogInline,
  estimateReadTime,
} from "../helpers";

const slug = "como-medir-roi-meta-ads";

const sections = [
  p(
    "Meta Ads mostra ROAS bonito no painel. Mas ROAS de plataforma raramente reflete realidade comercial — porque mede conversão de formulário ou evento de pixel, não venda fechada. Empresa com ROAS 5x no Meta pode ter ROI negativo se leads não convertem comercialmente. ROI real conecta investimento em mídia à receita gerada — do anúncio ao fechamento. Este guia detalha como configurar tracking, integrar CRM e quais métricas acompanhar para medir ROI de verdade.",
  ),
  h2("Por que ROAS de plataforma engana"),
  p(
    "Meta calcula ROAS dividindo valor de conversões rastreadas pelo gasto em anúncios. Problema: 'conversão' geralmente é lead form, não venda. Lead desqualificado, curioso ou duplicado conta como conversão. Além disso, janela de atribuição padrão (7 dias click / 1 dia view) pode atribuir conversões a campanhas que apenas 'assistiram' o anúncio. Resultado: painel verde, caixa vermelho.",
  ),
  ul([
    "ROAS de plataforma mede evento de pixel — Lead, não Purchase",
    "Leads desqualificados inflam ROAS sem gerar receita",
    "Atribuição view-through superestima impacto de campanhas de awareness",
    "Sem CRM, impossível saber quantos leads Meta viraram clientes pagantes",
  ]),
  h2("Passo 1: Configure o Pixel corretamente"),
  p(
    "Base de qualquer medição no Meta é o Pixel (ou SDK para apps) com eventos granulares. PageView sozinho não basta — configure eventos que representam progresso real no funil comercial.",
  ),
  ul([
    "PageView — visita à landing page (baseline)",
    "ViewContent — visualizou página de serviço/produto específico",
    "Lead — preencheu formulário ou iniciou conversa WhatsApp",
    "CompleteRegistration — lead qualificado (campos completos + score mínimo)",
    "Schedule — agendou reunião, visita ou consulta",
    "Purchase — venda fechada (se e-commerce ou pagamento online)",
  ]),
  h3("Conversions API (CAPI)"),
  p(
    "Pixel client-side perde 20–40% dos eventos por bloqueadores de cookie, iOS ATT e navegadores privacy-first. CAPI envia eventos server-side diretamente do seu servidor/CRM para Meta — recupera dados perdidos e melhora otimização do algoritmo. Implementação recomendada: Pixel + CAPI com deduplicação de eventos.",
  ),
  h2("Passo 2: Integração com CRM — passo a passo"),
  p(
    "Integração CRM é o que transforma Meta Ads de gerador de leads em gerador de receita mensurável. Sem CRM, você otimiza CPL. Com CRM, otimiza CAC e ROI.",
  ),
  ol([
    "Configure UTMs em todas as URLs de anúncios: utm_source=meta, utm_medium=paid, utm_campaign=[nome], utm_content=[creative]",
    "Landing page captura UTM e envia junto com dados do formulário para CRM via webhook ou integração nativa",
    "CRM registra lead com origem completa: plataforma, campanha, ad set, creative e UTM",
    "Configure evento CAPI Lead no momento da entrada no CRM — não apenas no submit do formulário",
    "Quando lead avança no pipeline (proposta, negociação), envie eventos customizados via CAPI",
    "Ao fechar venda, registre valor no CRM e dispare evento Purchase via CAPI com valor real",
    "Dashboard CRM calcula CAC = investimento Meta / clientes fechados com origem Meta",
  ]),
  callout(
    "Regra Raise One: se lead entrou via Meta mas fechou 45 dias depois via indicação, atribua ao Meta (first-touch) para decisão de budget — mas registre jornada completa no CRM.",
    "Atribuição Raise One",
  ),
  h2("Passo 3: Janela de atribuição"),
  p(
    "Meta usa janela padrão de 7 dias click / 1 dia view. Para funis longos — B2B, imobiliário, educação — essa janela subestima impacto de campanhas de awareness e consideração. Ajuste conforme ciclo de venda do negócio.",
  ),
  ul([
    "Serviços locais (clínicas, advocacia): 7 dias click / 1 dia view — ciclo curto",
    "Imobiliário: 28 dias click / 7 dias view — ciclo de 60–90 dias",
    "B2B serviços: 28 dias click / 7 dias view — ciclo de 30–60 dias",
    "E-commerce: 7 dias click / 1 dia view — decisão rápida",
    "Compare sempre dados Meta com CRM — CRM é fonte de verdade para fechamento",
  ]),
  h2("Tabela de métricas que importam"),
  table(
    ["Métrica", "O que mede", "Onde ver", "Benchmark"],
    [
      ["CPL (Custo por Lead)", "Custo de cada formulário/conversão", "Meta Ads Manager", "R$ 15–80 (varia por nicho)"],
      ["CAC (Custo de Aquisição)", "Custo de cada cliente fechado", "CRM / Dashboard", "≤ 1/3 do LTV"],
      ["ROAS plataforma", "Receita pixel / gasto mídia", "Meta Ads Manager", "Referência — não decisão"],
      ["ROAS real", "Receita CRM / gasto mídia", "CRM / Dashboard", "> 3:1 saudável, > 5:1 excelente"],
      ["Taxa lead → cliente", "% leads que fecham", "CRM", "8–20% (varia por setor)"],
      ["LTV:CAC", "Retorno vitalício vs aquisição", "CRM / Financeiro", "> 3:1 ideal"],
      ["Tempo de resposta", "Minutos até primeiro contato", "CRM", "< 15 min horário comercial"],
      ["CTR (Click-through Rate)", "Cliques / impressões", "Meta Ads Manager", "> 1% feed, > 0.5% stories"],
    ],
  ),
  h3("Como usar a tabela na prática"),
  p(
    "Revise métricas semanalmente no Meta Ads Manager (CPL, CTR, frequência) e mensalmente no CRM (CAC, ROAS real, taxa lead→cliente). Se CPL cai mas CAC sobe, leads estão piores — revise targeting e landing page. Se CPL sobe mas CAC estável, leads estão melhores — considere escalar budget.",
  ),
  h2("Passo 4: Dashboard unificado"),
  p(
    "Métricas espalhadas entre Meta Ads Manager, GA4, planilhas e CRM impedem decisões rápidas. Dashboard unificado conecta investimento em mídia → leads → pipeline → fechamento → receita — por campanha, creative e período. No Programa Raise One, clientes acessam dashboard com CAC, ROAS real e funil completo atualizado em tempo real.",
  ),
  ul([
    "Investimento por campanha/ad set (via API Meta ou importação)",
    "Leads gerados com origem tagueada (via CRM)",
    "Pipeline comercial: propostas, negociações, fechamentos",
    "Receita atribuída por canal e campanha",
    "CAC, ROAS real e LTV:CAC calculados automaticamente",
  ]),
  linkCard({
    label: "Meta Ads vs Google Ads",
    href: "/blog/meta-ads-vs-google-ads",
    type: "article",
    description: "Comparativo completo — quando usar cada canal e split de budget.",
  }),
  linkCard({
    label: "CRM para negócios em crescimento",
    href: "/blog/crm-para-negocios-em-crescimento",
    type: "article",
    description: "CRM integrado — pré-requisito para medir ROI real.",
  }),
  cta({
    title: "ROAS de plataforma não paga conta",
    description:
      "No Programa Raise One, conectamos Meta Ads ao CRM e dashboard — ROI real do clique ao fechamento.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Programa de Crescimento",
    secondaryHref: "/programa-de-crescimento",
  }),
];

const faq = [
  {
    question: "Qual ROAS é considerado bom no Meta Ads?",
    answer:
      "ROAS de plataforma acima de 3:1 é referência inicial. Mas ROAS real (receita CRM / gasto mídia) é a métrica decisiva. ROAS real acima de 3:1 é saudável; acima de 5:1, excelente. Abaixo de 2:1, revise targeting, LP e processo comercial antes de escalar.",
  },
  {
    question: "Preciso de CAPI ou Pixel basta?",
    answer:
      "Pixel sozinho perde 20–40% dos eventos. CAPI recupera dados e melhora otimização. Recomendamos Pixel + CAPI com deduplicação — setup padrão no Programa Raise One.",
  },
  {
    question: "Como atribuir venda a campanha Meta se lead veio há 60 dias?",
    answer:
      "Use first-touch attribution para decisão de budget (Meta gerou o lead) e registre jornada completa no CRM. Para funis longos, janela de 28 dias click no Meta + tracking CRM de origem original.",
  },
  {
    question: "CPL baixo significa campanha boa?",
    answer:
      "Não necessariamente. CPL baixo com leads desqualificados gera CAC alto. Compare CPL com taxa lead→cliente e CAC. Campanha com CPL 2x maior mas taxa de fechamento 3x maior tem CAC menor.",
  },
  {
    question: "Quanto tempo para ter dados confiáveis de ROI?",
    answer:
      "Mínimo 30 dias e 50+ leads para CPL e CTR confiáveis. Para CAC e ROAS real, espere 1–2 ciclos de venda completos (30–90 dias dependendo do negócio). Decisões de escala antes disso são prematuras.",
  },
];

export const comoMedirRoiMetaAds: BlogArticle = {
  slug,
  title: "Como medir ROI real em campanhas de Meta Ads",
  excerpt:
    "Impressões e cliques não pagam conta. Guia prático: Pixel, CAPI, integração CRM passo a passo e tabela de métricas que importam.",
  category: "meta-ads",
  type: "guia",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-01-15",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Como medir ROI em Meta Ads | Raise One",
    description:
      "Guia prático para medir ROI real em Meta Ads: Pixel, CAPI, integração CRM passo a passo, janela de atribuição e tabela de métricas.",
  },
  targetKeywords: [
    "como medir roi meta ads",
    "roas meta ads",
    "tracking meta ads crm",
    "cac meta ads",
  ],
  pillar: "aquisicao",
  relatedSlugs: [
    "meta-ads-vs-google-ads",
    "como-estruturar-campanhas-google-ads",
    "crm-para-negocios-em-crescimento",
    "5-erros-trafego-pago",
  ],
  relatedLinks: [
    {
      label: "Programa de Crescimento",
      href: "/programa-de-crescimento",
      type: "solution",
      description: "Meta Ads + CRM + dashboard com ROI real integrado.",
    },
  ],
  sections,
  faq,
};
