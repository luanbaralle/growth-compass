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

const slug = "marketing-imobiliario-portal-crm-campanhas";

const sections = [
  p("Incorporadora investe em campanhas Google Ads, mantém estoque em três portais diferentes e ainda perde leads para concorrentes com portal próprio. Corretor recebe contato 36 horas depois. CRM desatualizado. Ninguém sabe se lead veio do ZAP, do Google ou da feira de lançamento. Esse cenário é regra — não exceção — no marketing imobiliário brasileiro."),
  p("Crescimento previsível no setor exige arquitetura integrada: portal ou site de captura, CRM imobiliário, campanhas pagas e orgânicas conectadas ao mesmo funil. Portais geram volume; portal próprio gera controle. Campanhas trazem demanda qualificada; CRM transforma demanda em venda registrada."),
  img(
    blogInline(slug, 0),
    "Marketing imobiliário integrado: portal, CRM e campanhas",
    "Ecossistema de captação para incorporadoras e construtoras.",
  ),
  h2("Portal próprio vs marketplace imobiliário"),
  p("Portais como ZAP, Viva Real e OLX são marketplaces de atenção — milhares de imóveis competindo na mesma vitrine. Funcionam para alcance e descoberta, mas cobram por lead, limitam branding e compartilham audiência com concorrentes diretos. Portal próprio (site ou plataforma dedicada) coloca sua marca no centro da experiência."),
  {
    kind: "comparison" as const,
    left: {
      title: "Marketplace (portais)",
      items: [
        "Alcance imediato e tráfego existente",
        "Lead compartilhado ou disputado entre anunciantes",
        "Branding limitado ao template do portal",
        "Custo por lead ou assinatura recorrente",
        "Dados parciais — portal controla relacionamento",
        "Dependência de algoritmo e ranking do portal",
      ],
    },
    right: {
      title: "Portal próprio",
      items: [
        "Marca e experiência sob controle total",
        "Lead exclusivo capturado diretamente",
        "Integração nativa com CRM e campanhas",
        "SEO e conteúdo constroem ativo de longo prazo",
        "Dados completos do comportamento do visitante",
        "Investimento inicial maior, CAC tende a cair com escala",
      ],
    },
  },
  p("Estratégia madura não escolhe um ou outro — combina. Portais para volume e remarketing; portal próprio para lançamentos, empreendimentos premium e captura de demanda qualificada via Google Ads e SEO."),
  h2("Atlas: portal imobiliário com IA integrada"),
  p("Desenvolvemos o Atlas para incorporadoras que precisam ir além de vitrine estática. Portal imobiliário inteligente com busca avançada, tour virtual, qualificação automática de leads via IA e integração nativa com CRM comercial."),
  ul([
    "Catálogo de empreendimentos com filtros inteligentes e recomendação",
    "Captura de lead contextual — interesse registrado por unidade, planta ou faixa de preço",
    "Agente de IA qualifica temperatura do lead e encaminha ao corretor certo",
    "Dashboard de performance: origem, conversão, tempo de resposta, visitas agendadas",
    "Integração com campanhas Google Ads e Meta para landing pages de lançamento",
  ]),
  p("Resultado em operação real: +340% em leads qualificados e -62% no tempo de resposta ao primeiro contato. Portal deixa de ser cartão de visitas e vira máquina de captação mensurável."),
  linkCard({
    label: "Atlas — Portal imobiliário inteligente",
    href: "/tecnologia",
    type: "solution",
    description:
      "Portal imobiliário com IA, CRM integrado e captação qualificada para incorporadoras.",
  }),
  h2("CRM imobiliário: do lead à escritura"),
  p("CRM no setor imobiliário não é agenda de contatos — é pipeline de vendas com etapas específicas: lead → qualificado → visita agendada → proposta → reserva → contrato → escritura. Cada transição gera dado para marketing otimizar origem e corretor focar em oportunidades quentes."),
  h3("Funcionalidades essenciais"),
  ol([
    "Captura automática de leads de portal, site, campanhas e WhatsApp",
    "Distribuição inteligente por empreendimento, região ou rodízio",
    "Registro de interações: ligações, visitas, propostas enviadas",
    "Integração com ERP ou sistema de vendas para status de unidade",
    "Automação de follow-up: lembrete de visita, reengajamento pós-visita",
    "Relatórios de conversão por origem, corretor e empreendimento",
  ]),
  p("Lead de portal que demora 24h para primeiro contato tem taxa de conversão até 70% menor que lead respondido em 15 minutos. CRM + automação WhatsApp não é luxo — é requisito competitivo."),
  h2("Campanhas pagas para lançamentos e estoque"),
  p("Google Ads e Meta Ads aceleram vendas de empreendimentos em fase de lançamento e movimentam unidades prontas paradas. Estrutura recomendada:"),
  ul([
    "Campanhas Search por empreendimento: 'apartamento [bairro] lançamento', 'flat [cidade] pronto'",
    "Campanhas Display e YouTube para awareness de lançamento",
    "Meta Ads com criativos de planta, tour e lifestyle para consideração",
    "Landing page dedicada por empreendimento — nunca homepage genérica",
    "Remarketing para quem visitou portal mas não preencheu formulário",
    "Conversão offline: reserva e contrato enviados ao Google Ads via GCLID",
  ]),
  table(
    ["Canal", "Melhor para", "Métrica chave"],
    [
      ["Google Search", "Demanda ativa — 'comprar apartamento [região]'", "CPL e visitas agendadas"],
      ["Meta Ads", "Lançamentos, lifestyle, remarketing visual", "CPL e engajamento qualificado"],
      ["Portais", "Volume e descoberta de estoque amplo", "Custo por lead exclusivo"],
      ["Portal próprio + SEO", "Ativo de longo prazo, branding", "Tráfego orgânico e CAC blended"],
    ],
  ),
  h2("Integrando portal, CRM e campanhas"),
  p("Ecossistema integrado funciona quando dados fluem sem atrito:"),
  ol([
    "Visitante chega via Google Ads → landing page do empreendimento no portal Atlas",
    "Preenche formulário ou clica WhatsApp → lead criado no CRM com GCLID e origem",
    "IA qualifica e notifica corretor → primeiro contato em minutos",
    "Visita agendada e registrada → remarketing pausa para evitar anúncio redundante",
    "Reserva fechada → conversão offline alimenta otimização de campanha",
    "Dashboard mostra CAC por empreendimento, canal e corretor",
  ]),
  callout(
    "Empreendimento com portal dedicado, CRM ativo e campanhas integradas vende unidades paradas que portais sozinhos não movimentam — porque controla experiência, velocidade e atribuição.",
    "Dica Raise One",
  ),
  h2("Erros comuns no marketing imobiliário"),
  ul([
    "Depender 100% de portais sem portal próprio ou CRM",
    "Campanhas genéricas 'imóveis' sem segmentação por empreendimento",
    "Lead compartilhado tratado igual a lead exclusivo no ROI",
    "Corretor como gargalo — sem automação de primeiro contato",
    "Zero tracking de origem — impossível saber o que funciona",
    "Site desatualizado com estoque esgotado ainda recebendo tráfego pago",
  ]),
  linkCard({
    label: "Segmento Imobiliário",
    href: "/imobiliaria",
    type: "segment",
    description: "Estratégias de captação e tecnologia para incorporadoras e construtoras.",
  }),
  cta({
    title: "Estruture seu ecossistema imobiliário",
    description:
      "Diagnóstico gratuito mapeia oportunidades de captação, portal e integração CRM para seu portfólio.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Conhecer Atlas",
    secondaryHref: "/tecnologia",
  }),
  p("Marketing imobiliário maduro trata portal, CRM e campanhas como um sistema — não ferramentas isoladas. Incorporadoras que integram captura, qualificação e atribuição crescem com previsibilidade em mercado cada vez mais competitivo."),
  h2("Conteúdo e SEO para empreendimentos"),
  p("Portal próprio ganha tração orgânica com páginas dedicadas por empreendimento, bairro e tipo de imóvel. Blog com conteúdo local ('Guia do bairro X', 'Quanto custa m² em Y') captura buscas informacionais que antecedem compra. Schema markup de RealEstateListing e LocalBusiness ajuda Google a entender catálogo. SEO orgânico reduz CAC blended conforme portal amadurece — complementando campanhas pagas em lançamentos."),
  h2("Métricas do funil imobiliário integrado"),
  ul([
    "CPL por canal: portal próprio, Google, Meta, marketplace",
    "Taxa lead → visita agendada (meta: > 25% com resposta rápida)",
    "Taxa visita → proposta (depende de precificação e estoque)",
    "Taxa proposta → reserva/contrato",
    "Tempo médio de resposta ao lead (< 15 min como benchmark)",
    "CAC por empreendimento e corretor",
    "ROAS real: receita de vendas / investimento total em marketing",
  ]),
  p("Dashboard unificado evita debate entre marketing ('geramos leads') e comercial ('leads são ruins'). Dados por origem mostram qual canal entrega compradores — não apenas curiosos."),
  h2("Marketplace vs portal: quando usar cada um"),
  p("Use marketplace para estoque amplo, liquidez rápida e presença onde comprador já busca. Use portal próprio para lançamentos premium, controle de marca, captura exclusiva e integração com CRM. Regra prática: empreendimentos com margem alta e ticket elevado merecem portal dedicado; estoque residual e usados podem viver em marketplace com CRM unificado capturando origem."),
  p("Atlas nasceu dessa lógica: portal que combina experiência premium de portal próprio com inteligência de qualificação que marketplaces não oferecem. Incorporadora não precisa escolher entre alcance e controle — constrói ativo próprio enquanto usa portais como canal complementar."),
  h2("Roadmap de implementação para incorporadoras"),
  ol([
    "Mês 1: CRM imobiliário + processo comercial + SLA de resposta",
    "Mês 2: Portal ou landing pages por empreendimento + integração captura",
    "Mês 3: Campanhas Google/Meta com tracking GCLID e conversão offline",
    "Mês 4+: Otimização por CAC, expansão de portfólio orgânico, automações IA",
  ]),
  p("Incorporadoras que seguem este roadmap evitam o erro clássico de lançar campanhas agressivas antes de CRM e portal estarem prontos — cenário que gera leads disputados, corretores sobrecarregados e ROI impossível de medir."),
  p("O mercado imobiliário premia velocidade e clareza. Comprador que espera 48 horas por retorno visita concorrente. Portal integrado ao CRM com automação de primeiro contato não é diferencial futuro — é requisito atual em mercados competitivos de médio e alto padrão."),
  p("Investir em portal próprio sem campanhas pagas limita alcance inicial; investir em campanhas sem portal adequado limita conversão. A combinação — portal Atlas ou LP dedicada + CRM + Google Ads — é onde incorporadoras de growth consistente operam hoje."),
  p("Comece auditando de onde vêm seus leads hoje e quanto tempo leva até primeira resposta. Se a resposta for 'não sabemos' ou 'mais de um dia', priorize CRM e integração antes de discutir portal ou budget de mídia."),
];

const faq = [
  {
    question: "Preciso abandonar portais para ter portal próprio?",
    answer:
      "Não. Portais continuam relevantes para alcance e estoque amplo. Portal próprio complementa com branding, leads exclusivos e integração profunda. Estratégia ideal combina ambos com CRM unificado.",
  },
  {
    question: "Quanto custa implementar portal imobiliário como o Atlas?",
    answer:
      "Investimento varia por porte de catálogo, integrações e customizações. O retorno vem de leads exclusivos, redução de tempo de resposta e CAC menor em campanhas integradas. Diagnóstico inicial define escopo e ROI esperado.",
  },
  {
    question: "Google Ads funciona para imóvel de alto padrão?",
    answer:
      "Sim, com campanhas segmentadas por empreendimento, keywords de intenção alta e landing pages premium. Ticket alto tolera CPL maior; otimização foca em visitas qualificadas e reservas — não volume de curiosos.",
  },
  {
    question: "Como evitar disputa de leads entre corretores?",
    answer:
      "CRM com regras claras de distribuição: por empreendimento, região, rodízio ou performance. Lead registrado com timestamp e corretor responsável. Automação evita lead órfão e conflito manual.",
  },
  {
    question: "Qual a prioridade: portal, CRM ou campanhas?",
    answer:
      "CRM e processo comercial primeiro — sem isso, campanhas geram leads perdidos. Em seguida, portal ou landing de captura. Campanhas pagas escalam o que já converte. Ordem invertida queima budget.",
  },
];

export const marketingImobiliarioPortalCrmCampanhas: BlogArticle = {
  slug,
  title: "Marketing imobiliário: portal, CRM e campanhas integrados",
  excerpt:
    "Guia para incorporadoras: portal próprio vs marketplace, CRM imobiliário, campanhas Google e Meta — e como integrar tudo com o Atlas para captação previsível.",
  category: "imobiliario",
  type: "guia",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-07-01",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  pillar: "imobiliario",
  segments: ["imobiliaria"],
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Marketing imobiliário: portal, CRM e campanhas | Raise One",
    description:
      "Guia de marketing imobiliário integrado: portal vs marketplace, CRM, campanhas pagas e Atlas para captação qualificada de empreendimentos.",
  },
  targetKeywords: [
    "marketing imobiliário integrado",
    "portal imobiliário CRM",
    "captação leads imobiliários",
    "google ads imobiliário",
    "portal vs marketplace imóveis",
  ],
  relatedSlugs: [
    "ia-marketing-imobiliario",
    "integrar-google-ads-crm-whatsapp",
    "seo-local-guia-completo",
  ],
  relatedLinks: [
    { label: "Atlas", href: "/tecnologia", type: "solution" },
    { label: "Imobiliário", href: "/imobiliaria", type: "segment" },
    { label: "Diagnóstico", href: "/diagnostico", type: "solution" },
  ],
  sections,
  faq,
};
