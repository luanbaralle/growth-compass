import type { BlogArticle } from "../types";
import {
  p,
  h2,
  h3,
  ul,
  ol,
  callout,
  img,
  cta,
  linkCard,
  table,
  blogFeatured,
  blogInline,
  estimateReadTime,
} from "../helpers";

const slug = "google-ads-vs-seo-qual-usar";

const sections = [
  p("Empresa com budget limitado enfrenta dilema clássico: investir em Google Ads para resultados imediatos ou em SEO para crescimento orgânico sustentável. A resposta errada é 'um ou outro'. A resposta certa depende de prazo, concorrência, ticket médio e estágio do negócio — e quase sempre envolve combinação estratégica dos dois."),
  p("Google Ads captura demanda existente com previsibilidade de curto prazo. SEO constrói ativo de longo prazo que reduz dependência de mídia paga. Entender timing, custos e limitações de cada canal evita budget mal alocado e expectativas frustradas."),
  img(
    blogInline(slug, 0),
    "Google Ads versus SEO: timeline e alocação de budget",
    "Comparativo de prazo, custo e sustentabilidade entre mídia paga e busca orgânica.",
  ),
  h2("O que cada canal resolve"),
  {
    kind: "comparison" as const,
    left: {
      title: "Google Ads",
      items: [
        "Resultados em dias ou semanas",
        "Custo por clique — para quando para de pagar",
        "Controle total de budget e segmentação",
        "Ideal para intenção transacional imediata",
        "Testes rápidos de mensagem e oferta",
        "Escala linear com investimento",
      ],
    },
    right: {
      title: "SEO",
      items: [
        "Resultados em 3 a 12 meses (tipicamente)",
        "Investimento em conteúdo e técnica — tráfego persiste",
        "Depende de algoritmo e concorrência orgânica",
        "Ideal para autoridade e buscas informacionais",
        "Ativo cumulativo — páginas rankeiam por anos",
        "Escala não-linear — efeito composto",
      ],
    },
  },
  p("Google Ads é acelerador. SEO é fundação. Empresa que só faz Ads paga eternamente por cada visitante. Empresa que só faz SEO espera meses sem leads enquanto concorrente captura demanda com mídia paga."),
  h2("Timeline: o que esperar de cada canal"),
  p("Expectativa realista evita abandono prematuro de SEO e overspend em Ads sem estrutura de conversão."),
  h3("Google Ads — primeiros 90 dias"),
  ul([
    "Semana 1–2: campanhas ativas, primeiros cliques e leads (se LP e tracking ok)",
    "Semana 3–4: dados suficientes para primeiros ajustes de lance e negativação",
    "Mês 2: otimização de copy, landing page e segmentação",
    "Mês 3: escala de campanhas com ROI comprovado; CAC estabilizando",
  ]),
  h3("SEO — primeiros 12 meses"),
  ul([
    "Mês 1–2: auditoria técnica, estrutura de site, keywords prioritárias",
    "Mês 3–4: conteúdo publicado, indexação, primeiras posições long-tail",
    "Mês 5–8: tráfego orgânico crescente, páginas locais e de serviço rankeando",
    "Mês 9–12: keywords competitivas começam a aparecer; ROI orgânico mensurável",
  ]),
  table(
    ["Marco", "Google Ads", "SEO"],
    [
      ["Primeiros leads", "3–14 dias", "3–6 meses"],
      ["Break-even típico", "1–3 meses", "6–12 meses"],
      ["Custo marginal por visita", "Constante (CPC)", "Decrescente com escala"],
      ["Sustentabilidade sem budget", "Zero tráfego", "Tráfego mantido"],
    ],
  ),
  callout(
    "SEO local (Google Business Profile + páginas por cidade) é exceção: pode gerar leads em 4–8 semanas para negócios locais — mais rápido que SEO nacional, complementar a Ads.",
    "Atalho local",
  ),
  h2("Como dividir budget entre Google Ads e SEO"),
  p("Não existe fórmula universal, mas estes frameworks orientam alocação inicial baseada em estágio e objetivo:"),
  h3("Negócio novo ou lançamento (< 12 meses de marketing)"),
  p("Prioridade: validar oferta e gerar caixa. Split sugerido: 70–80% Google Ads, 20–30% SEO (técnico + conteúdo base). Ads traz leads agora; SEO planta sementes para reduzir CAC futuro."),
  h3("Negócio em crescimento (funil estruturado, CAC conhecido)"),
  p("Split sugerido: 50–60% Ads, 40–50% SEO. Ads escala o que funciona; SEO reduz dependência e captura buscas informacionais que Ads não cobre economicamente."),
  h3("Negócio maduro (SEO já gera volume relevante)"),
  p("Split sugerido: 30–40% Ads, 60–70% SEO e conteúdo. Ads focado em lançamentos, sazonalidade e keywords que SEO ainda não domina. SEO mantém e expande ativo orgânico."),
  ul([
    "Budget total < R$ 5.000/mês: priorize Ads + SEO local mínimo",
    "Budget R$ 5.000–15.000: split 60/40 Ads/SEO com LP dedicada",
    "Budget > R$ 15.000: split 50/50 com remarketing e conteúdo contínuo",
  ]),
  p("Revise split trimestralmente com base em CAC por canal. Se SEO gera leads a custo 40% menor que Ads, realoque gradualmente — sem cortar Ads abruptamente em keywords transacionais críticas."),
  h2("Quando priorizar Google Ads"),
  ul([
    "Precisa de leads nas próximas 2–4 semanas",
    "Lançamento de produto, serviço ou unidade",
    "Mercado competitivo onde SEO levaria 12+ meses",
    "Testar mensagem, oferta ou público antes de investir em conteúdo",
    "Keywords transacionais com alto valor imediato",
    "Sazonalidade previsível (vestibular, verão, datas comemorativas)",
  ]),
  h2("Quando priorizar SEO"),
  ul([
    "Horizonte de 6+ meses para ROI",
    "Volume significativo de buscas informacionais no seu mercado",
    "Ticket alto e ciclo longo — conteúdo educa e nutre",
    "Negócio local com Google Business Profile subexplorado",
    "Ads com CPC proibitivo — orgânico como alternativa viável",
    "Construir autoridade e credibilidade de marca",
  ]),
  h2("A combinação que funciona"),
  p("Empresas com melhor CAC blended combinam os dois de forma inteligente:"),
  ol([
    "Google Ads captura keywords transacionais e valida conversão",
    "SEO constrói páginas de serviço, blog e conteúdo local",
    "Remarketing Ads reconecta visitantes orgânicos que não converteram",
    "Dados de Search Terms do Ads informam temas de conteúdo SEO",
    "Landing pages otimizadas servem ambos os canais",
  ]),
  linkCard({
    label: "Guia SEO local completo",
    href: "/blog/seo-local-guia-completo",
    type: "article",
    description: "Como otimizar presença local no Google Maps e resultados orgânicos regionais.",
  }),
  cta({
    title: "Descubra o mix ideal para seu mercado",
    description:
      "Diagnóstico gratuito analisa volume de busca, concorrência e oportunidades em Google Ads e SEO para sua região.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Ver guia Google Ads",
    secondaryHref: "/blog/como-estruturar-campanhas-google-ads",
  }),
  p("Google Ads vs SEO não é batalha — é composição de portfolio de aquisição. Ads financia presente; SEO constrói futuro. Empresa que domina os dois cresce com previsibilidade hoje e margem amanhã."),
  h2("Erros comuns na decisão Ads vs SEO"),
  ul([
    "Abandonar SEO porque 'demora' — e pagar CPC crescente indefinidamente",
    "Investir em SEO sem landing page que converte — tráfego orgânico desperdiçado",
    "Cortar Ads abruptamente ao ver primeiros resultados orgânicos — perde keywords transacionais",
    "Comparar CPL de Ads com 'custo zero' de SEO — SEO tem custo de conteúdo, técnica e tempo",
    "Duplicar esforço: páginas diferentes para Ads e SEO sem coordenação",
    "Ignorar SEO local enquanto escala Ads nacionalmente sem necessidade",
  ]),
  h2("Framework de decisão em 4 perguntas"),
  p("Responda honestamente para definir prioridade:"),
  ol([
    "Preciso de leads nos próximos 30 dias? Sim → Ads prioritário.",
    "Meu CPC está acima de 15% do ticket? Sim → investir em SEO e conteúdo.",
    "Tenho landing page e CRM funcionando? Não → consertar antes de escalar qualquer canal.",
    "Concorrentes dominam orgânico há anos? Sim → Ads para entrar; SEO para posição de longo prazo.",
  ]),
  h2("Presença digital como pilar estratégico"),
  p("Pilar presença engloba mais que Ads e SEO: Google Business Profile, reviews, site técnico, conteúdo e landing pages. Empresa com presença forte converte melhor em ambos os canais — Quality Score do Ads melhora com site rápido e relevante; SEO rankeia melhor com autoridade de marca consolidada. Investir em presença é multiplicador — não substituto — de budget de aquisição."),
  h2("Cenários práticos de alocação"),
  p("Clínica estética nova em bairro competitivo: 75% Ads local + 25% SEO local (GBP, reviews, página por bairro). Incorporadora com lançamento em 60 dias: 80% Ads + 20% SEO técnico na LP de lançamento. SaaS B2B com ciclo de 90 dias: 40% Ads (keywords comparativas) + 60% conteúdo SEO e thought leadership. E-commerce consolidado: 35% Ads (remarketing + shopping) + 65% SEO de categorias e produtos."),
  h2("Revisão trimestral do mix"),
  p("A cada trimestre, analise: CAC por canal, volume de leads, taxa de conversão e tendência de CPC orgânico vs pago. Realoque 10–15% do budget por iteracao — mudanças bruscas destabilizam aprendizado do algoritmo e ranking orgânico. Documente decisões para construir histórico de o que funciona no seu mercado específico."),
  h2("Conclusão: composição, não escolha binária"),
  p("Google Ads e SEO competem por budget apenas quando tratados como silos. Tratados como portfolio, cada um cobre lacuna do outro: Ads captura hoje, SEO reduz custo amanhã. Empresa que investe exclusivamente em um canal herda riscos de dependência — CPC inflacionado sem SEO, ou meses sem leads enquanto SEO amadurece sem Ads. A resposta prática quase sempre é 'quanto de cada' — e esta proporção muda conforme maturidade."),
  p("Comece pelo diagnóstico: volume de busca no seu mercado, CPC médio, autoridade orgânica atual e capacidade de conversão da landing page. Dados objetivos eliminam debate interno entre 'time de Ads' e 'time de conteúdo' — substituindo opinião por alocação informada."),
  p("Empresas de serviços locais frequentemente subinvestem em SEO local enquanto pagam CPC crescente por keywords transacionais que poderiam rankear organicamente em 6 meses. Empresas B2B com ciclo longo frequentemente pulam Ads e perdem demanda comparativa ativa. Conhecer seu perfil evita o erro oposto em cada extremo."),
  p("Se restar dúvida após ler este guia, faça o diagnóstico gratuito Raise One — cruzamos volume de busca, CPC e concorrência orgânica da sua região para recomendar split inicial personalizado e prioridade de investimento."),
];

const faq = [
  {
    question: "Posso fazer SEO sozinho enquanto contrato Google Ads?",
    answer:
      "Sim, e é combinação comum. Ads gera leads imediatos; SEO interno ou terceirizado constrói base orgânica. Certifique-se de que landing pages e tracking servem ambos os canais para não duplicar esforço.",
  },
  {
    question: "SEO elimina necessidade de Google Ads?",
    answer:
      "Raramente. Mesmo empresas com SEO forte mantêm Ads para keywords transacionais críticas, lançamentos e remarketing. SEO reduz dependência e CAC médio — não substitui completamente mídia paga na maioria dos mercados competitivos.",
  },
  {
    question: "Qual canal tem melhor ROI?",
    answer:
      "SEO tende a ROI superior no longo prazo (12+ meses). Google Ads entrega ROI mais rápido e previsível no curto prazo. Compare CAC por canal após 6 meses de operação integrada — não isole métricas.",
  },
  {
    question: "Como saber se estou investindo demais em Ads?",
    answer:
      "Sinais: CAC subindo sem melhora de conversão, dependência total de paid com zero tráfego orgânico, budget crescendo mais rápido que receita. Se SEO ainda não foi investido, redirecionar 20–30% para conteúdo e técnica.",
  },
  {
    question: "Google Ads afeta SEO negativamente?",
    answer:
      "Não diretamente. Google nega que Ads influencie ranking orgânico. Indiretamente, Ads gera dados de keywords e conversão que informam estratégia SEO — sinergia positiva quando integrados.",
  },
];

export const googleAdsVsSeoQualUsar: BlogArticle = {
  slug,
  title: "Google Ads vs SEO: qual usar e como dividir o budget",
  excerpt:
    "Comparativo entre Google Ads e SEO com timeline realista, frameworks de divisão de budget e critérios para decidir quando priorizar cada canal na sua estratégia de presença digital.",
  category: "seo",
  type: "comparativo",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-07-20",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  pillar: "presenca",
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Google Ads vs SEO: qual usar e dividir budget | Raise One",
    description:
      "Compare Google Ads e SEO: timeline, divisão de budget, quando priorizar cada canal e como combinar paid e orgânico para melhor CAC.",
  },
  targetKeywords: [
    "google ads vs seo",
    "investir google ads ou seo",
    "dividir budget ads seo",
    "seo ou tráfego pago",
    "estratégia presença digital",
  ],
  relatedSlugs: [
    "como-estruturar-campanhas-google-ads",
    "seo-local-guia-completo",
    "meta-ads-vs-google-ads",
  ],
  relatedLinks: [
    { label: "Diagnóstico", href: "/diagnostico", type: "solution" },
    { label: "Programa de Crescimento", href: "/programa-de-crescimento", type: "solution" },
  ],
  sections,
  faq,
};
