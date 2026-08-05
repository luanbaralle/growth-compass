import type { BlogArticle } from "../types";
import {
  p,
  h2,
  h3,
  ul,
  callout,
  table,
  cta,
  linkCard,
  blogFeatured,
  blogInline,
  estimateReadTime,
} from "../helpers";

const slug = "meta-ads-vs-google-ads";

const sections = [
  p(
    "A pergunta 'Google ou Meta?' parte de um falso dilema. São canais complementares com dinâmicas opostas: um captura demanda existente, o outro gera demanda nova. Empresas que crescem de forma previsível não escolhem um em detrimento do outro — alocam budget com base em intenção, ciclo de venda e maturidade do funil. Este comparativo detalha quando priorizar cada canal, como distribuir investimento e quais métricas usar para decidir.",
  ),
  {
    kind: "comparison" as const,
    left: {
      title: "Google Ads",
      items: [
        "Captura demanda existente — pessoa já busca",
        "Intenção alta, conversão mais rápida",
        "Melhor para serviços com busca ativa",
        "CPC geralmente mais alto (R$ 3–15+ em nichos competitivos)",
        "Formato predominantemente textual",
        "Remarketing via Display e YouTube",
      ],
    },
    right: {
      title: "Meta Ads",
      items: [
        "Gera demanda nova — interrupção no feed",
        "Intenção construída, funil mais longo",
        "Melhor para awareness e consideração",
        "CPM/CPC geralmente mais baixo (R$ 0,50–4)",
        "Formato visual — imagem, vídeo, carrossel",
        "Remarketing nativo e lookalike audiences",
      ],
    },
  },
  h2("Tabela comparativa completa"),
  table(
    ["Critério", "Google Ads", "Meta Ads"],
    [
      ["Modelo de demanda", "Pull — captura intenção", "Push — cria interesse"],
      ["Momento do funil", "Fundo e meio (alta intenção)", "Topo e meio (descoberta)"],
      ["Custo por clique médio", "R$ 3–15+ (varia por nicho)", "R$ 0,50–4 (varia por segmento)"],
      ["Taxa de conversão típica", "3–8% com LP dedicada", "1,5–4% com LP dedicada"],
      ["Tempo até primeiro lead", "24–72 horas", "3–7 dias (período de aprendizado)"],
      ["Melhor formato", "Search, Performance Max", "Vídeo, carrossel, lead ads"],
      ["Tracking", "Conversões nativas + GA4", "Pixel + CAPI (Conversions API)"],
      ["Ideal para", "Serviços locais, B2B, e-commerce", "Marcas visuais, lançamentos, remarketing"],
    ],
  ),
  h2("Quando priorizar Google Ads"),
  p(
    "Google Ads funciona melhor quando existe volume de busca comprovado para o seu serviço ou produto. Clínicas, advogados, imobiliárias, escolas e prestadores de serviço local se beneficiam porque a pessoa já digitou uma intenção clara — 'clínica estética zona sul', 'advogado trabalhista sp', 'apartamento 2 quartos caraguatatuba'. Nesses casos, cada clique tem probabilidade alta de conversão, mesmo com CPC elevado.",
  ),
  ul([
    "Serviços com alta intenção de busca e volume mensurável no Keyword Planner",
    "Produtos que pessoas pesquisam antes de comprar (comparativos, preços, reviews)",
    "Mercados com concorrência estabelecida — quem não aparece perde para quem aparece",
    "Quando precisa de leads imediatos para alimentar time comercial ativo",
    "Remarketing para visitantes que buscaram no Google mas não converteram",
  ]),
  h2("Quando priorizar Meta Ads"),
  p(
    "Meta Ads brilha quando o produto ou serviço não é algo que as pessoas buscam ativamente — ou quando a decisão de compra depende de desejo, visual e prova social. Estética, moda, gastronomia, empreendimentos imobiliários e educação continuada são exemplos clássicos. O algoritmo do Meta encontra públicos similares aos seus melhores clientes e apresenta a oferta antes mesmo de existir intenção de busca.",
  ),
  ul([
    "Produtos e serviços que pessoas não sabem que precisam até ver",
    "Marcas que precisam construir awareness em mercados novos ou saturados",
    "Conteúdo visual forte: antes/depois, tours virtuais, depoimentos em vídeo",
    "Remarketing para quem visitou site, assistiu vídeo ou interagiu com conteúdo",
    "Lookalike audiences baseadas em lista de clientes ou leads qualificados do CRM",
  ]),
  h2("Matriz de decisão por perfil de negócio"),
  table(
    ["Perfil", "Google", "Meta", "Recomendação"],
    [
      ["Clínica/estética local", "Alta prioridade", "Média prioridade", "60% Google / 40% Meta"],
      ["Incorporadora imobiliária", "Média prioridade", "Alta prioridade", "35% Google / 65% Meta"],
      ["Escola/educação", "Alta prioridade", "Alta prioridade", "50% Google / 50% Meta"],
      ["E-commerce D2C", "Alta prioridade", "Alta prioridade", "45% Google / 55% Meta"],
      ["B2B serviços", "Alta prioridade", "Baixa prioridade", "75% Google / 25% Meta"],
      ["Lançamento de produto", "Baixa prioridade", "Alta prioridade", "20% Google / 80% Meta"],
    ],
  ),
  h3("Como usar a matriz na prática"),
  p(
    "A matriz não é regra fixa — é ponto de partida. Se você já investe e tem dados de CAC por canal no CRM, use os números reais para ajustar. Incorporadora com ciclo de 90 dias pode precisar de mais Meta no topo e Google no remarketing. Clínica com agenda lotada pode reduzir Meta e escalar Google em termos transacionais. O importante é testar, medir e realocar com cadência quinzenal.",
  ),
  h2("Como dividir o budget entre os canais"),
  p(
    "Para empresas que estão começando em tráfego pago, recomendamos split inicial de 50/50 por 30 dias, com landing pages dedicadas em ambos os canais e tracking integrado ao CRM. Após o período de aprendizado, realoque budget para o canal com menor CAC e maior taxa lead→cliente. Empresas maduras em mídia paga tipicamente operam com 40–60% Google e 40–60% Meta, dependendo do setor.",
  ),
  ul([
    "Fase 1 (0–30 dias): 50% Google / 50% Meta — coleta de dados comparáveis",
    "Fase 2 (30–60 dias): ajuste para 60/40 ou 40/60 conforme CAC real no CRM",
    "Fase 3 (60+ dias): escala no canal vencedor, mantenha mínimo 20% no outro para remarketing",
    "Sempre reserve 10–15% do budget total para testes de creative, audiência e landing page",
  ]),
  callout(
    "Benchmark Raise One: clientes com Google + Meta integrados ao mesmo funil e CRM apresentam CAC 28% menor e taxa de fechamento 40% maior do que campanhas isoladas por canal.",
    "Dado Raise One",
  ),
  h2("A combinação ideal: funil integrado"),
  p(
    "Empresas que crescem de forma previsível usam os dois canais como etapas do mesmo funil. Meta no topo (awareness + consideração via vídeos, carrosséis e conteúdo educativo), Google no fundo (captura de intenção quando a pessoa busca ativamente). Remarketing conecta os dois: quem viu anúncio no Meta e depois buscou no Google recebe mensagem consistente. Quem clicou no Google mas não converteu recebe retargeting no Instagram com prova social.",
  ),
  linkCard({
    label: "Como estruturar campanhas Google Ads",
    href: "/blog/como-estruturar-campanhas-google-ads",
    type: "article",
    description: "Guia completo para campanhas que geram leads qualificados.",
  }),
  linkCard({
    label: "Como medir ROI em Meta Ads",
    href: "/blog/como-medir-roi-meta-ads",
    type: "article",
    description: "Do clique ao fechamento comercial — tracking que importa.",
  }),
  cta({
    title: "Quer Google e Meta integrados ao seu funil?",
    description:
      "No Programa Raise One, estruturamos ambos os canais conectados ao CRM, landing pages e automações — não como campanhas isoladas.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Programa de Crescimento",
    secondaryHref: "/programa-de-crescimento",
  }),
];

const faq = [
  {
    question: "Posso usar só Google Ads ou só Meta Ads?",
    answer:
      "Sim, especialmente no início ou com budget limitado. A escolha depende do seu setor: serviços locais com busca ativa tendem a performar melhor só com Google; marcas visuais e lançamentos, só com Meta. Porém, a combinação dos dois reduz CAC e aumenta cobertura do funil — remarketing cruzado entre plataformas é um dos maiores ganhos de eficiência.",
  },
  {
    question: "Qual canal tem ROI mais rápido?",
    answer:
      "Google Ads geralmente entrega leads qualificados mais rápido (24–72h) porque captura intenção existente. Meta Ads precisa de 7–14 dias de aprendizado do algoritmo e funil mais longo, mas costuma ter CPL menor. ROI real só se mede no CRM — compare CAC por canal, não CPL de plataforma.",
  },
  {
    question: "Quanto investir no mínimo em cada canal?",
    answer:
      "Recomendamos mínimo de R$ 1.500–2.000/mês por canal para sair da fase de aprendizado com dados estatisticamente relevantes. Abaixo disso, o algoritmo não otimiza bem e conclusões sobre performance ficam comprometidas.",
  },
  {
    question: "Meta Ads funciona para B2B?",
    answer:
      "Funciona para awareness e remarketing B2B, especialmente com conteúdo educativo (webinars, cases, whitepapers). Para captura de intenção B2B, Google Ads (Search + LinkedIn complementar) costuma ser mais eficiente. A combinação Meta no topo + Google no fundo é a estratégia mais comum em B2B de serviços.",
  },
  {
    question: "Como saber se estou alocando budget corretamente?",
    answer:
      "Integre campanhas ao CRM e compare CAC real (não CPL) por canal a cada 30 dias. Se um canal gera leads mais baratos mas converte pior comercialmente, o budget está mal alocado. A métrica decisiva é receita gerada / investimento em mídia — por canal, campanha e creative.",
  },
];

export const metaAdsVsGoogleAds: BlogArticle = {
  slug,
  title: "Meta Ads vs Google Ads: quando usar cada canal",
  excerpt:
    "Google captura demanda existente. Meta gera demanda nova. Entenda quando usar cada um — com tabela comparativa, matriz de decisão e split de budget.",
  category: "meta-ads",
  type: "comparativo",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-03-05",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Meta Ads vs Google Ads: comparativo completo | Raise One",
    description:
      "Compare Google Ads e Meta Ads: intenção, custo, formato e quando usar cada canal. Tabela comparativa, matriz de decisão e split de budget.",
  },
  targetKeywords: [
    "meta ads vs google ads",
    "google ads ou facebook ads",
    "quando usar meta ads",
    "comparativo google ads meta ads",
  ],
  pillar: "aquisicao",
  relatedSlugs: [
    "como-estruturar-campanhas-google-ads",
    "como-medir-roi-meta-ads",
    "5-erros-trafego-pago",
    "funil-de-aquisicao-guia",
  ],
  relatedLinks: [
    {
      label: "Programa de Crescimento",
      href: "/programa-de-crescimento",
      type: "solution",
      description: "Google e Meta integrados ao seu funil comercial.",
    },
  ],
  sections,
  faq,
};
