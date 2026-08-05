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

const slug = "crm-para-negocios-em-crescimento";

const sections = [
  p(
    "Empresa investe R$ 15.000/mês em marketing. Gera 200 leads. Fecha 8 vendas. Taxa de conversão comercial: 4%. Com CRM estruturado e follow-up automatizado, a mesma base de leads fecha 16–20 vendas. Dobro de receita, mesmo investimento em mídia. A diferença não está na qualidade dos leads — está no que acontece depois que eles chegam. CRM não é luxo para empresas grandes. É infraestrutura comercial para qualquer negócio que gera leads e quer transformá-los em receita previsível.",
  ),
  h2("O problema que CRM resolve"),
  p(
    "Sem CRM, leads se perdem em caixas de e-mail, conversas de WhatsApp pessoal e planilhas desatualizadas. Vendedor não sabe quem ligar primeiro. Gestor não enxerga pipeline. Marketing não consegue medir CAC real por canal. Follow-up depende de memória e disciplina individual — e falha sistematicamente quando volume aumenta.",
  ),
  ul([
    "Leads esquecidos no e-mail ou WhatsApp — 35% dos leads nunca recebem follow-up (Harvard Business Review)",
    "Vendedor sem priorização — liga para curiosos e perde quentes",
    "Zero visibilidade do pipeline — gestor descobre gargalo no fim do mês",
    "Impossibilidade de medir CAC real por canal de marketing",
    "Follow-up manual e inconsistente — depende de humor e memória do vendedor",
    "Dados comerciais presos na cabeça do vendedor — risco ao perder funcionário",
  ]),
  h2("CRM genérico vs CRM integrado ao marketing"),
  p(
    "Existem dois tipos de CRM no mercado: genérico (planilha bonita com pipeline) e integrado (conectado a campanhas, landing pages, automações e dashboards). A diferença de resultado é abismal — especialmente para empresas que investem em tráfego pago.",
  ),
  {
    kind: "comparison" as const,
    left: {
      title: "CRM genérico",
      items: [
        "Cadastro manual de leads — copy/paste de formulário",
        "Sem origem automática — 'de onde veio esse lead?'",
        "Automações limitadas ou inexistentes",
        "Relatórios de pipeline, sem conexão com mídia",
        "Integração via Zapier — frágil, lenta, propensa a falhas",
        "CAC e ROI calculados manualmente (se calculados)",
      ],
    },
    right: {
      title: "CRM integrado (Raise One)",
      items: [
        "Lead entra automaticamente via formulário, WhatsApp ou API",
        "Origem tagueada: campanha, keyword, creative, UTM",
        "Automações de follow-up por temperatura e comportamento",
        "Dashboard unificado: mídia → lead → proposta → venda",
        "Integração nativa com Google Ads, Meta, landing pages",
        "CAC, ROAS e LTV calculados em tempo real por canal",
      ],
    },
  },
  h3("Tabela comparativa"),
  table(
    ["Critério", "CRM genérico", "CRM integrado"],
    [
      ["Entrada de leads", "Manual ou Zapier", "Automática, tempo real"],
      ["Atribuição de origem", "Inexistente ou parcial", "Campanha, ad, keyword, UTM"],
      ["Follow-up", "Manual", "Automatizado + IA"],
      ["Visibilidade CAC", "Não disponível", "Por canal e campanha"],
      ["Tempo de implementação", "1–2 semanas", "2–4 semanas (com integrações)"],
      ["ROI mensurável", "Parcial", "Completo — clique ao fechamento"],
    ],
  ),
  h2("O que um CRM integrado entrega na prática"),
  p(
    "CRM integrado transforma marketing de centro de custo em centro de receita mensurável. Cada real investido em mídia pode ser rastreado até a venda fechada — ou até a oportunidade perdida, com motivo registrado.",
  ),
  ul([
    "Captura automática de leads de campanhas Google, Meta, landing pages e WhatsApp",
    "Qualificação por score — quente, morno, frio — baseada em comportamento e fit",
    "Automações de follow-up: D+0 (boas-vindas), D+1 (case), D+3 (oferta), D+7 (última tentativa)",
    "Pipeline visual com etapas comerciais customizadas por negócio",
    "Dashboard com CAC, taxa de conversão, ciclo de venda e receita por canal",
    "Alertas de SLA — lead sem resposta em 15 minutos dispara notificação",
  ]),
  callout(
    "Benchmark Raise One: clientes com CRM integrado convertem 2,3x mais leads em clientes do que clientes com CRM genérico ou planilha — mesmo volume e qualidade de leads de mídia.",
    "Dado Raise One",
  ),
  h2("Quando implementar CRM"),
  p(
    "Se você gera mais de 20 leads por mês e não tem processo comercial estruturado, precisa de CRM agora — não quando 'crescer mais'. Quanto antes estruturar, menos leads se perdem e mais dados acumula para otimizar campanhas. Empresas que implementam CRM cedo escalam mídia com confiança porque sabem exatamente o retorno de cada real investido.",
  ),
  ul([
    "20–50 leads/mês: CRM básico integrado + automações essenciais",
    "50–200 leads/mês: CRM + scoring + automações multicanal + dashboard",
    "200+ leads/mês: CRM + IA para qualificação + automações avançadas + equipe comercial estruturada",
  ]),
  h2("CRM como peça do funil — não ferramenta isolada"),
  p(
    "CRM isolado de marketing é planilha bonita. CRM integrado ao funil conecta campanhas → landing pages → formulário → qualificação → follow-up → fechamento → retenção. Cada etapa alimenta a anterior: dados de fechamento retroalimentam otimização de campanhas; objeções registradas no CRM viram FAQ na landing page; clientes fechados alimentam lookalike audiences no Meta.",
  ),
  linkCard({
    label: "Funil de aquisição completo",
    href: "/blog/funil-de-aquisicao-guia",
    type: "article",
    description: "Mapa de como estranhos viram clientes — CRM na etapa de fechamento.",
  }),
  linkCard({
    label: "Automações com IA para follow-up",
    href: "/blog/automacoes-ia-follow-up",
    type: "article",
    description: "Follow-up inteligente integrado ao CRM — exemplos práticos.",
  }),
  cta({
    title: "Leads sem CRM são dinheiro jogado fora",
    description:
      "No Programa Raise One, CRM integrado vem conectado a campanhas, landing pages e automações — do clique ao fechamento.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Programa de Crescimento",
    secondaryHref: "/programa-de-crescimento",
  }),
];

const faq = [
  {
    question: "Qual CRM usar?",
    answer:
      "Depende do volume e integrações necessárias. CRMs genéricos (Pipedrive, HubSpot free) funcionam para volume baixo com entrada manual. Para empresas com tráfego pago, recomendamos CRM integrado nativamente a campanhas e automações — como o incluído no Programa Raise One.",
  },
  {
    question: "CRM substitui vendedor?",
    answer:
      "Não. CRM organiza, automatiza follow-up inicial e prioriza leads. Vendedor continua essencial para negociação, objeções e fechamento. CRM libera vendedor de tarefas repetitivas para focar em conversão.",
  },
  {
    question: "Quanto tempo para implementar?",
    answer:
      "CRM genérico: 1–2 semanas. CRM integrado com campanhas, landing pages e automações: 2–4 semanas no Programa Raise One, incluindo treinamento da equipe comercial.",
  },
  {
    question: "Vale a pena se tenho poucos leads?",
    answer:
      "Se gera 20+ leads/mês, sim. Cada lead perdido tem custo (CPL × taxa de perda). Com CPL médio de R$ 30–80, perder 35% dos leads por falta de follow-up custa R$ 200–560/mês em oportunidades — mais que o investimento em CRM.",
  },
  {
    question: "Como medir ROI do CRM?",
    answer:
      "Compare taxa lead→cliente antes e depois da implementação, mantendo investimento em mídia constante. ROI = (receita adicional gerada - custo CRM) / custo CRM. Clientes Raise One tipicamente veem ROI positivo em 30–60 dias.",
  },
];

export const crmParaNegociosEmCrescimento: BlogArticle = {
  slug,
  title: "CRM não é luxo: por que todo negócio em crescimento precisa de um",
  excerpt:
    "Leads que ninguém acompanha são dinheiro jogado fora. CRM genérico vs integrado — e por que integração com marketing muda tudo.",
  category: "tecnologia",
  type: "artigo",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-01-28",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Por que seu negócio precisa de CRM | Raise One",
    description:
      "CRM para negócios em crescimento: genérico vs integrado, automação de follow-up e conexão com campanhas de marketing.",
  },
  targetKeywords: [
    "crm para negócios",
    "crm integrado marketing",
    "crm para leads",
    "crm pequenas empresas",
  ],
  pillar: "funil",
  relatedSlugs: [
    "funil-de-aquisicao-guia",
    "automacoes-ia-follow-up",
    "5-erros-trafego-pago",
    "como-medir-roi-meta-ads",
  ],
  relatedLinks: [
    {
      label: "Tecnologia Raise One",
      href: "/tecnologia",
      type: "solution",
      description: "CRM, automações, dashboards e plataformas integradas.",
    },
    {
      label: "Programa de Crescimento",
      href: "/programa-de-crescimento",
      type: "solution",
      description: "CRM integrado a campanhas, LPs e automações.",
    },
  ],
  sections,
  faq,
};
