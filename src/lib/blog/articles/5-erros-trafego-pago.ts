import type { BlogArticle } from "../types";
import {
  p,
  h2,
  h3,
  ul,
  callout,
  cta,
  linkCard,
  blogFeatured,
  blogInline,
  estimateReadTime,
} from "../helpers";

const slug = "5-erros-trafego-pago";

const sections = [
  p(
    "Investir em tráfego pago sem estrutura é queimar dinheiro com elegância. Plataformas como Google Ads e Meta Ads facilitam o gasto — basta cadastrar cartão e apertar 'publicar'. Mas converter cliques em receita exige arquitetura: landing pages, tracking, segmentação, CRM e cadência de otimização. Estes são os cinco erros mais comuns que vemos em diagnósticos Raise One — e a solução detalhada para cada um, com dados de referência.",
  ),
  h2("Erro 1: Direcionar tráfego para homepage"),
  p(
    "Homepage tem dezenas de links, menu de navegação e mensagem genérica. Cada clique pago deveria ir para landing page dedicada com um único objetivo: converter. Empresas que direcionam tráfego pago para homepage convertem em média 0,8–1,5%. Com landing page dedicada, a taxa sobe para 3–8% — mesmo tráfego, até 5x mais leads.",
  ),
  h3("Solução"),
  ul([
    "Crie uma landing page por campanha, serviço ou oferta — copy alinhado ao anúncio",
    "Remova menu de navegação e links externos da LP de campanha",
    "Repita a headline do anúncio no hero da landing page — continuidade imediata",
    "Inclua um único CTA principal (formulário, WhatsApp ou agendamento)",
    "Teste A/B de headline e hero — variações de 20% na conversão são comuns",
  ]),
  p(
    "Dado: cliente Raise One (clínica estética) migrou tráfego de homepage para LP dedicada. Conversão subiu de 1,1% para 5,3% em 14 dias — CPL caiu 68% sem alterar budget de mídia.",
  ),
  h2("Erro 2: Campanhas sem segmentação de intenção"),
  p(
    "Misturar termos informacionais ('o que é harmonização facial') e transacionais ('harmonização facial preço sp') na mesma campanha dilui budget. Termos informacionais geram cliques baratos que raramente convertem. Termos transacionais custam mais, mas trazem leads prontos para comprar. Campanhas genéricas pagam por curiosos.",
  ),
  h3("Solução"),
  ul([
    "Categorize keywords por intenção: informacional, comparativa, transacional",
    "Separe campanhas por intenção — budget prioritário em transacional e comparativa",
    "Negativize termos informacionais em campanhas de conversão",
    "Use campanhas de remarketing para quem consumiu conteúdo informacional",
    "No Meta, separe audiências frias (lookalike, interesse) de quentes (visitantes, engajados)",
  ]),
  p(
    "Dado: campanha Google Ads reestruturada por intenção reduziu CPC efetivo em 34% e aumentou taxa de conversão de 2,1% para 5,7% — mesmo budget mensal, 2,7x mais leads qualificados.",
  ),
  h2("Erro 3: Tracking incompleto ou inexistente"),
  p(
    "Sem conversões configuradas, impossível saber o que funciona. Empresas gastam milhares sem saber qual campanha, anúncio ou keyword gera clientes — otimizam CPL de plataforma, não ROI real. Meta mostra ROAS bonito; Google mostra conversões de formulário. Nenhum dos dois mede venda fechada.",
  ),
  h3("Solução"),
  ul([
    "Configure pixel Meta com eventos Lead, CompleteRegistration e Purchase (se aplicável)",
    "Ative Conversions API (CAPI) para tracking server-side — contorna bloqueios de cookie",
    "Configure conversões Google Ads além de PageView — form submit, call, WhatsApp click",
    "Integre GA4 com eventos personalizados e UTMs em todas as URLs de campanha",
    "Conecte campanhas ao CRM — tag origem do lead, registre fechamento e valor da venda",
  ]),
  p(
    "Dado: após integração CRM + campanhas, 62% dos clientes Raise One descobriram que campanhas 'campeãs' em CPL tinham pior CAC real — realocação de budget gerou +41% em receita com mesmo investimento.",
  ),
  h2("Erro 4: Leads sem processo comercial"),
  p(
    "Campanha gera 100 leads. Ninguém liga em 24 horas. Problema não é marketing — é comercial. Lead esfriado perde interesse: 78% dos compradores escolhem quem responde primeiro (InsideSales.com). Empresas com follow-up estruturado convertem 2–3x mais leads em clientes com a mesma base de mídia.",
  ),
  h3("Solução"),
  ul([
    "Implemente CRM com pipeline comercial — todo lead entra automaticamente via integração",
    "Defina SLA de resposta: máximo 15 minutos em horário comercial, 2 horas fora",
    "Automatize follow-up D+0, D+1, D+3 e D+7 via WhatsApp e e-mail",
    "Priorize leads por score (quente/morno/frio) — time comercial foca nos quentes",
    "Meça taxa lead→cliente por canal — não apenas volume de leads",
  ]),
  p(
    "Dado: empresa com 200 leads/mês e 4% de conversão comercial passou para 16% após CRM + automações — dobro de receita, mesmo investimento em mídia (R$ 15.000/mês).",
  ),
  h2("Erro 5: Otimizar cedo demais ou tarde demais"),
  p(
    "Mudar campanha todo dia impede aprendizado do algoritmo — Meta e Google precisam de 7–14 dias e 50+ conversões para sair da fase de aprendizado. Nunca otimizar deixa dinheiro na mesa: keywords caras sem retorno, audiências saturadas, criativos esgotados. Cadência ideal: revisão semanal com ajustes incrementais.",
  ),
  h3("Solução"),
  ul([
    "Primeiras 2 semanas: apenas coleta de dados — não altere targeting, lances ou budget",
    "Semanas 3–4: negativize keywords/audiências sem conversão, ajuste lances incrementais",
    "Mês 2+: testes A/B de copy, creative e landing page — uma variável por vez",
    "Escala budget (+20% a cada 3–5 dias) apenas em campanhas com CAC positivo no CRM",
    "Pausar campanhas com 0 conversões após 2x o ciclo de venda médio do negócio",
  ]),
  p(
    "Dado: campanha Meta pausada prematuramente no dia 5 (fase de aprendizado) tinha CPL 40% acima da média final após 21 dias — decisão baseada em dados insuficientes custou 3 semanas de otimização.",
  ),
  callout(
    "Antes de aumentar budget, responda: consigo medir quantos leads viraram clientes por campanha? Se não, o problema é estrutura — não volume de mídia.",
    "Regra Raise One",
  ),
  linkCard({
    label: "Landing page vs site institucional",
    href: "/blog/landing-page-vs-site-institucional",
    type: "article",
    description: "Por que homepage mata conversão — e o checklist de 12 elementos.",
  }),
  linkCard({
    label: "Funil de aquisição completo",
    href: "/blog/funil-de-aquisicao-guia",
    type: "article",
    description: "Mapa de como estranhos viram clientes — com métricas por etapa.",
  }),
  cta({
    title: "Está cometendo algum desses erros?",
    description:
      "Diagnóstico gratuito Raise One identifica gargalos em campanhas, landing pages, tracking e CRM.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Programa de Crescimento",
    secondaryHref: "/programa-de-crescimento",
  }),
];

const faq = [
  {
    question: "Quanto budget mínimo para tráfego pago funcionar?",
    answer:
      "Recomendamos mínimo de R$ 3.000–5.000/mês para ter volume estatístico e sair da fase de aprendizado. Abaixo disso, conclusões sobre performance ficam comprometidas. Budget menor funciona se combinado com SEO e remarketing orgânico.",
  },
  {
    question: "Google Ads ou Meta Ads — qual errar menos?",
    answer:
      "Ambos exigem mesma estrutura: LP dedicada, tracking, CRM. O erro mais caro é comum aos dois: direcionar para homepage sem tracking. Veja nosso comparativo completo para escolher canal por perfil de negócio.",
  },
  {
    question: "Como saber se meu tracking está correto?",
    answer:
      "Teste end-to-end: clique no anúncio → preencha formulário → verifique se lead aparece no CRM com origem correta → confirme evento no pixel/conversão Google. Se qualquer etapa falhar, tracking está incompleto.",
  },
  {
    question: "Preciso de agência ou dá para fazer internamente?",
    answer:
      "Depende da complexidade. Campanhas básicas podem ser internas com treinamento. Integração CRM + automações + otimização contínua exige expertise — é onde a maioria dos erros acontece. Programa Raise One combina estratégia, execução e tecnologia.",
  },
  {
    question: "Quanto tempo até ver resultados?",
    answer:
      "Google Ads: primeiros leads em 24–72h, otimização madura em 30–60 dias. Meta Ads: 7–14 dias de aprendizado, resultados consistentes em 30–45 dias. ROI real (venda fechada) depende do ciclo comercial — imobiliário leva 60–90 dias, serviços locais 7–21 dias.",
  },
];

export const cincoErrosTrafegoPago: BlogArticle = {
  slug,
  title: "5 erros que fazem empresas queimar budget em tráfego pago",
  excerpt:
    "Investir em ads sem estrutura é queimar dinheiro. Os 5 erros mais comuns — com solução detalhada e dados de referência para cada um.",
  category: "insights",
  type: "artigo",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-02-05",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  featuredImage: blogFeatured(slug),
  seo: {
    title: "5 erros em tráfego pago que queimam budget | Raise One",
    description:
      "Evite os 5 erros mais comuns em tráfego pago: homepage, tracking, segmentação, CRM e otimização. Soluções práticas com dados.",
  },
  targetKeywords: [
    "erros tráfego pago",
    "queimar budget google ads",
    "erros meta ads",
    "tráfego pago não converte",
  ],
  pillar: "aquisicao",
  relatedSlugs: [
    "landing-page-vs-site-institucional",
    "como-estruturar-campanhas-google-ads",
    "funil-de-aquisicao-guia",
    "meta-ads-vs-google-ads",
    "crm-para-negocios-em-crescimento",
  ],
  relatedLinks: [
    {
      label: "Diagnóstico gratuito",
      href: "/diagnostico",
      type: "solution",
      description: "Identifique gargalos em campanhas, LP, tracking e CRM.",
    },
  ],
  sections,
  faq,
};
