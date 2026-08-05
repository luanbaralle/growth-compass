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

const slug = "landing-page-vs-site-institucional";

const sections = [
  p(
    "Empresa investe R$ 10.000 em Google Ads e direciona tráfego para a homepage. Taxa de conversão: 1,2%. Mesma empresa cria landing page dedicada com copy alinhado ao anúncio. Taxa de conversão: 4,8%. Mesmo tráfego, quatro vezes mais leads — sem aumentar um centavo em mídia. A diferença não é sorte nem criatividade isolada. É arquitetura de conversão. Este comparativo explica quando usar site institucional, quando usar landing page, como adotar abordagem híbrida e quais elementos toda LP de campanha precisa ter.",
  ),
  {
    kind: "comparison" as const,
    left: {
      title: "Site institucional",
      items: [
        "Múltiplas páginas, menu de navegação completo",
        "Informa sobre a empresa, história, equipe",
        "Distrações: blog, links, redes sociais, múltiplos CTAs",
        "Copy genérico para todos os visitantes",
        "Ideal para SEO orgânico e credibilidade de marca",
        "Taxa de conversão em tráfego pago: 0,8–2%",
      ],
    },
    right: {
      title: "Landing page",
      items: [
        "Página única com foco total em uma ação",
        "Converte visitante em lead ou venda",
        "Zero distrações — um objetivo, um CTA principal",
        "Copy específico por campanha, serviço ou persona",
        "Ideal para tráfego pago (Google, Meta, LinkedIn)",
        "Taxa de conversão em tráfego pago: 3–8%",
      ],
    },
  },
  h2("Por que homepage mata conversão em campanhas pagas"),
  p(
    "Quando alguém clica em um anúncio, espera continuidade: mesma promessa, mesma oferta, mesma linguagem. A homepage apresenta dezenas de opções — serviços, sobre, blog, contato — e dilui a atenção em segundos. Estudos de usabilidade mostram que cada link adicional na página reduz conversão em 10–15%. Uma homepage típica tem 20–40 links. Uma landing page bem construída tem um.",
  ),
  p(
    "Além disso, homepage raramente repete a headline do anúncio. O visitante sente descontinuidade — 'cliquei em oferta de harmonização facial e caí numa página genérica de clínica'. Bounce rate sobe, conversão cai, CPC efetivo dispara porque o algoritmo interpreta a página como irrelevante para o anúncio.",
  ),
  h2("Checklist: 12 elementos de uma landing page que converte"),
  p(
    "Toda landing page de campanha paga deve conter estes elementos. Ausência de qualquer um deles compromete performance — especialmente itens 1, 4, 7 e 10.",
  ),
  ul([
    "1. Headline alinhada ao anúncio — mesma promessa, mesma linguagem, continuidade imediata",
    "2. Subheadline que clarifica benefício e público-alvo em uma frase",
    "3. Hero visual relevante — foto real, vídeo ou mockup do serviço/produto anunciado",
    "4. Prova social acima da dobra — depoimentos, logos de clientes, números de resultados",
    "5. Lista de benefícios (não features) — o que o visitante ganha, não o que você faz",
    "6. Seção 'como funciona' em 3 passos — reduz fricção e ansiedade de decisão",
    "7. Formulário de qualificação enxuto — nome, telefone, e-mail e 1–2 perguntas de fit",
    "8. CTA repetido — botão principal visível no hero e repetido a cada 2–3 seções",
    "9. FAQ com 4–6 objeções comuns — preço, prazo, garantia, diferencial",
    "10. Tracking completo — pixel Meta, conversões Google, eventos GA4, UTM por campanha",
    "11. Velocidade abaixo de 3 segundos — cada segundo extra reduz conversão em 7%",
    "12. Versão mobile-first — 70%+ do tráfego pago vem de dispositivos móveis",
  ]),
  callout(
    "Benchmark Raise One: landing pages com os 12 elementos convertem em média 3,8x mais que homepage em campanhas pagas. LPs sem prova social ou com formulário longo (>5 campos) caem para 1,5–2x.",
    "Dado Raise One",
  ),
  h2("Quando usar site institucional"),
  p(
    "Site institucional continua essencial — mas para funções diferentes. É sua vitrine permanente, base de SEO orgânico, repositório de credibilidade e ponto de referência para quem pesquisa sua marca diretamente. Use-o para posicionamento de marca, conteúdo educativo, páginas de serviço otimizadas para busca e navegação geral.",
  ),
  ul([
    "SEO orgânico — páginas de serviço, blog, páginas locais por cidade/bairro",
    "Credibilidade — quem recebe indicação e pesquisa sua empresa antes de converter",
    "Navegação geral — múltiplos serviços, múltiplos públicos, múltiplas entradas",
    "Conteúdo institucional — sobre, equipe, cases, políticas, carreiras",
  ]),
  h2("Quando usar landing page"),
  p(
    "Toda campanha paga deve ter landing page dedicada. Sem exceção. Cada oferta, serviço, segmento ou persona merece LP com copy, design e CTA alinhados ao anúncio. Isso vale para Google Ads, Meta Ads, LinkedIn Ads e qualquer canal de mídia paga.",
  ),
  ul([
    "Campanhas Google Ads — uma LP por grupo de anúncios ou serviço",
    "Campanhas Meta Ads — LP por creative/audiência quando mensagens diferem",
    "Lançamentos e promoções — LP temporária com deadline e oferta específica",
    "Captação de leads B2B — LP com formulário qualificador e conteúdo rico (e-book, webinar)",
  ]),
  h2("Abordagem híbrida: o melhor dos dois mundos"),
  p(
    "Empresas maduras em marketing digital não escolhem entre site e landing page — operam os dois de forma integrada. O site institucional sustenta SEO, branding e navegação orgânica. Landing pages dedicadas convertem tráfego pago. E os dois se conectam: footer da LP linka para site (credibilidade), site linka para LPs de campanhas ativas (conversão).",
  ),
  h3("Arquitetura recomendada"),
  table(
    ["Camada", "Função", "Exemplo"],
    [
      ["Site institucional", "SEO, branding, navegação", "seusite.com.br/servicos/clinica-estetica"],
      ["Landing page de campanha", "Conversão de tráfego pago", "seusite.com.br/lp/harmonizacao-facial-sp"],
      ["Página de obrigado", "Confirmação + próximo passo", "seusite.com.br/obrigado/harmonizacao"],
      ["Remarketing", "Retorno de quem não converteu", "Anúncio Meta → mesma LP ou LP alternativa"],
    ],
  ),
  p(
    "Na Raise One, desenvolvemos landing pages como extensão do funil comercial — não como páginas isoladas. Cada LP integra formulário ao CRM, dispara automação de follow-up e alimenta dashboards de conversão por campanha. Site institucional e LPs compartilham identidade visual, mas servem objetivos distintos.",
  ),
  linkCard({
    label: "Landing Pages de Alta Conversão",
    href: "/solucoes/landing-pages",
    type: "solution",
    description: "LPs dedicadas integradas ao CRM, tracking e automações Raise One.",
  }),
  linkCard({
    label: "5 erros que queimam budget em tráfego pago",
    href: "/blog/5-erros-trafego-pago",
    type: "article",
    description: "Erro #1: direcionar tráfego para homepage. Veja os outros quatro.",
  }),
  cta({
    title: "Sua campanha ainda aponta para homepage?",
    description:
      "Landing pages dedicadas convertem 3–5x mais. Descubra quantos leads você está perdendo.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Ver solução de Landing Pages",
    secondaryHref: "/solucoes/landing-pages",
  }),
];

const faq = [
  {
    question: "Posso usar a mesma landing page para Google e Meta?",
    answer:
      "Sim, se a mensagem do anúncio for consistente entre plataformas. Porém, audiências e formatos diferem — Meta tende a responder melhor a prova social visual e vídeos; Google Search responde melhor a copy direto e benefícios claros. Quando possível, crie variações de LP por canal ou use testes A/B de headline e hero.",
  },
  {
    question: "Quantas landing pages preciso?",
    answer:
      "Mínimo: uma LP por serviço ou oferta principal. Ideal: uma LP por campanha ou grupo de anúncios com mensagem distinta. Empresa com 3 serviços e campanhas regionais pode ter 6–12 LPs. O investimento em LP se paga rapidamente com aumento de conversão.",
  },
  {
    question: "Landing page precisa estar no mesmo domínio do site?",
    answer:
      "Recomendamos sim — mesmo domínio transmite credibilidade e facilita tracking. Subdomínios (lp.seusite.com.br) ou subpastas (/lp/oferta) funcionam. Evite domínios separados sem conexão visual com a marca — reduzem confiança e conversão.",
  },
  {
    question: "Quanto tempo leva para criar uma landing page?",
    answer:
      "LP bem estruturada leva 3–5 dias úteis incluindo copy, design, integração de formulário, tracking e testes. Na Raise One, entregamos LPs integradas ao CRM e campanhas em ciclo de 1–2 semanas, dependendo da complexidade.",
  },
  {
    question: "Site institucional antigo vale a pena reformular?",
    answer:
      "Se o site converte abaixo de 2% em tráfego orgânico ou tem problemas de velocidade/mobile, sim. Mas reformular site inteiro não substitui LPs dedicadas para campanhas pagas. Priorize LPs para mídia paga e reformule site em paralelo para SEO e branding.",
  },
];

export const landingPageVsSiteInstitucional: BlogArticle = {
  slug,
  title: "Landing page vs site institucional: qual usar em campanhas pagas",
  excerpt:
    "Site institucional informa. Landing page converte. Checklist com 12 elementos, abordagem híbrida e dados de conversão por tipo de página.",
  category: "growth",
  type: "comparativo",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-02-20",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Landing page vs site institucional | Raise One",
    description:
      "Compare landing page e site institucional para campanhas pagas. Checklist de 12 elementos, abordagem híbrida e impacto na taxa de conversão.",
  },
  targetKeywords: [
    "landing page vs site",
    "landing page ou site institucional",
    "landing page campanhas pagas",
    "checklist landing page",
  ],
  pillar: "funil",
  relatedSlugs: [
    "como-estruturar-campanhas-google-ads",
    "5-erros-trafego-pago",
    "funil-de-aquisicao-guia",
    "meta-ads-vs-google-ads",
  ],
  relatedLinks: [
    {
      label: "Landing Pages de Alta Conversão",
      href: "/solucoes/landing-pages",
      type: "solution",
      description: "LPs dedicadas com tracking, CRM e automações integradas.",
    },
  ],
  sections,
  faq,
};
