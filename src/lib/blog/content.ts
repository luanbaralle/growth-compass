import type { NextStepLink } from "@/components/marketing/shared/NextSteps";

export type BlogCategory =
  | "insights"
  | "google-ads"
  | "meta-ads"
  | "seo"
  | "ia"
  | "tecnologia"
  | "imobiliario"
  | "growth";

export type BlogType = "artigo" | "guia" | "comparativo";

export type BlogSection =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string; level: 2 | 3 }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "callout"; text: string; title?: string }
  | {
      kind: "comparison";
      left: { title: string; items: string[] };
      right: { title: string; items: string[] };
    };

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  type: BlogType;
  readTime: string;
  publishedAt: string;
  author: string;
  seo: { title: string; description: string };
  sections: BlogSection[];
  relatedSlugs: string[];
}

export interface BlogCategoryMeta {
  id: BlogCategory | "all";
  label: string;
  description: string;
}

export const blogSeo = {
  title: "Blog — Insights de Growth | Raise One",
  description:
    "Artigos, guias e comparativos sobre Google Ads, Meta Ads, SEO, IA, tecnologia e crescimento. Conteúdo prático para empresas que querem escalar.",
};

export const blogCategories: BlogCategoryMeta[] = [
  { id: "all", label: "Todos", description: "Todo o conteúdo Raise One" },
  {
    id: "insights",
    label: "Insights",
    description: "Análises e tendências de growth e marketing",
  },
  {
    id: "google-ads",
    label: "Google Ads",
    description: "Aquisição, campanhas e otimização no Google",
  },
  {
    id: "meta-ads",
    label: "Meta Ads",
    description: "Instagram, Facebook e geração de demanda",
  },
  {
    id: "seo",
    label: "SEO",
    description: "Busca orgânica e visibilidade local",
  },
  {
    id: "ia",
    label: "IA",
    description: "Inteligência artificial aplicada ao crescimento",
  },
  {
    id: "tecnologia",
    label: "Tecnologia",
    description: "CRM, automações, dashboards e plataformas",
  },
  {
    id: "imobiliario",
    label: "Mercado Imobiliário",
    description: "Marketing e tecnologia para o setor imobiliário",
  },
  {
    id: "growth",
    label: "Growth",
    description: "Estratégia, funis e escala de negócios",
  },
];

export const blogTypeLabels: Record<BlogType, string> = {
  artigo: "Artigo",
  guia: "Guia",
  comparativo: "Comparativo",
};

function p(text: string): BlogSection {
  return { kind: "paragraph", text };
}

function h2(text: string): BlogSection {
  return { kind: "heading", text, level: 2 };
}

function h3(text: string): BlogSection {
  return { kind: "heading", text, level: 3 };
}

function ul(items: string[]): BlogSection {
  return { kind: "list", items };
}

function callout(text: string, title?: string): BlogSection {
  return { kind: "callout", text, title };
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "como-estruturar-campanhas-google-ads",
    title: "Como estruturar campanhas de Google Ads que geram leads qualificados",
    excerpt:
      "Campanha bem estruturada não é sobre keywords — é sobre intenção, landing page e tracking integrado ao CRM.",
    category: "google-ads",
    type: "guia",
    readTime: "8 min",
    publishedAt: "2026-03-10",
    author: "Raise One",
    seo: {
      title: "Guia: Campanhas Google Ads para leads qualificados | Raise One",
      description:
        "Aprenda a estruturar campanhas de Google Ads com segmentação por intenção, landing pages de conversão e tracking completo.",
    },
    relatedSlugs: [
      "meta-ads-vs-google-ads",
      "landing-page-vs-site-institucional",
      "5-erros-trafego-pago",
    ],
    sections: [
      p("A maioria das empresas configura Google Ads como um botão de 'ligar tráfego'. O resultado: cliques caros, leads desqualificados e impossibilidade de medir ROI real. Campanha estruturada funciona diferente — ela captura intenção de busca e converte em oportunidade comercial."),
      h2("1. Mapeie intenções de busca, não apenas keywords"),
      p("Antes de criar campanhas, categorize termos por intenção: informacional, comparativa e transacional. Campanhas transacionais ('contratar', 'preço', 'agendar') convertem mais — e custam mais. Campanhas comparativas alimentam o meio do funil. Informacionais funcionam melhor via SEO."),
      ul([
        "Transacional: 'clínica estética zona sul preço'",
        "Comparativa: 'melhor clínica harmonização facial sp'",
        "Informacional: 'o que é harmonização facial'",
      ]),
      h2("2. Estruture campanhas por objetivo comercial"),
      p("Separe campanhas por serviço, região ou persona — nunca misture tudo em uma campanha genérica. Cada campanha deve ter budget, landing page e mensagem dedicados."),
      h2("3. Landing page dedicada — sempre"),
      p("Direcionar tráfego pago para site institucional é o erro mais comum. Cada campanha precisa de uma landing page com copy alinhado ao anúncio, formulário de qualificação e CTA claro."),
      callout(
        "Regra prática: se você não consegue medir quantos leads de cada campanha viraram clientes, sua estrutura está incompleta.",
        "Dica Raise One",
      ),
      h2("4. Tracking do clique ao fechamento"),
      p("Configure conversões no Google Ads, eventos no Analytics e integração com CRM. Sem isso, otimização vira achismo. Com isso, você sabe exatamente qual keyword, anúncio e campanha gera receita."),
      h2("5. Otimize com cadência"),
      p("Primeiras 2 semanas: coleta de dados. Semanas 3–4: ajustes de lance e negativação. Mês 2+: testes A/B de copy e landing pages. Escala só o que provou ROI positivo."),
    ],
  },
  {
    slug: "meta-ads-vs-google-ads",
    title: "Meta Ads vs Google Ads: quando usar cada canal",
    excerpt:
      "Google captura demanda existente. Meta gera demanda nova. Entenda quando usar cada um — e por que os melhores resultados vêm da combinação.",
    category: "meta-ads",
    type: "comparativo",
    readTime: "6 min",
    publishedAt: "2026-03-05",
    author: "Raise One",
    seo: {
      title: "Meta Ads vs Google Ads: comparativo completo | Raise One",
      description:
        "Compare Google Ads e Meta Ads: intenção, custo, formato e quando usar cada canal na sua estratégia de aquisição.",
    },
    relatedSlugs: [
      "como-estruturar-campanhas-google-ads",
      "como-medir-roi-meta-ads",
      "funil-de-aquisicao-guia",
    ],
    sections: [
      p("A pergunta 'Google ou Meta?' part de um falso dilema. São canais complementares com dinâmicas opostas. Entender a diferença é o primeiro passo para alocar budget com inteligência."),
      {
        kind: "comparison",
        left: {
          title: "Google Ads",
          items: [
            "Captura demanda existente",
            "Intenção alta — pessoa já busca",
            "Melhor para serviços com busca ativa",
            "CPC geralmente mais alto",
            "Conversão mais rápida",
          ],
        },
        right: {
          title: "Meta Ads",
          items: [
            "Gera demanda nova",
            "Interrupção — pessoa não buscava",
            "Melhor para awareness e consideração",
            "CPM/CPC geralmente mais baixo",
            "Funil mais longo, remarketing essencial",
          ],
        },
      },
      h2("Quando priorizar Google Ads"),
      ul([
        "Serviços com alta intenção de busca (clínicas, advogados, imobiliárias)",
        "Produtos que pessoas pesquisam antes de comprar",
        "Mercados com volume de busca comprovado",
        "Quando precisa de leads imediatos",
      ]),
      h2("Quando priorizar Meta Ads"),
      ul([
        "Produtos/serviços que pessoas não sabem que precisam",
        "Marcas que precisam construir awareness",
        "Conteúdo visual forte (antes/depois, portfólio, lifestyle)",
        "Remarketing para quem visitou site mas não converteu",
      ]),
      h2("A combinação ideal"),
      p("Empresas que crescem de forma previsível usam os dois: Meta no topo do funil (awareness + consideração), Google no fundo (captura de intenção). Remarketing conecta os dois — quem viu anúncio no Meta e buscou no Google recebe mensagem consistente."),
      callout(
        "No Programa Raise One, estruturamos Google e Meta integrados ao mesmo funil, CRM e landing pages — não como campanhas isoladas.",
      ),
    ],
  },
  {
    slug: "funil-de-aquisicao-guia",
    title: "O que é um funil de aquisição e como construir o seu",
    excerpt:
      "Funil não é jargão de marketing — é o mapa de como estranhos viram clientes. Veja como construir o seu do zero.",
    category: "growth",
    type: "guia",
    readTime: "10 min",
    publishedAt: "2026-02-28",
    author: "Raise One",
    seo: {
      title: "Guia: Funil de aquisição completo | Raise One",
      description:
        "Aprenda a construir um funil de aquisição: awareness, consideração, conversão, retenção e escala — com métricas em cada etapa.",
    },
    relatedSlugs: [
      "landing-page-vs-site-institucional",
      "crm-para-negocios-em-crescimento",
      "5-erros-trafego-pago",
    ],
    sections: [
      p("Funil de aquisição é o caminho que uma pessoa percorre desde o primeiro contato com sua marca até se tornar cliente — e depois, cliente recorrente. Sem funil mapeado, marketing vira gasto. Com funil estruturado, vira investimento mensurável."),
      h2("As 5 etapas do funil"),
      h3("1. Awareness — Descoberta"),
      p("A pessoa descobre que você existe. Canais: Meta Ads, SEO, conteúdo, indicação. Métrica: alcance, impressões, tráfego."),
      h3("2. Consideração — Interesse"),
      p("A pessoa avalia se você resolve o problema dela. Canais: landing pages, conteúdo educativo, remarketing. Métrica: tempo no site, páginas visitadas, engajamento."),
      h3("3. Conversão — Decisão"),
      p("A pessoa toma ação: preenche formulário, liga, agenda. Canais: Google Ads (alta intenção), landing pages, WhatsApp. Métrica: leads, CAC, taxa de conversão."),
      h3("4. Venda — Fechamento"),
      p("Seu time comercial converte lead em cliente. Canais: CRM, follow-up, automações. Métrica: taxa de fechamento, ciclo de venda, ticket médio."),
      h3("5. Retenção & Escala"),
      p("Cliente volta, indica, compra mais. Canais: e-mail, WhatsApp, programa de fidelidade. Métrica: LTV, churn, NPS."),
      h2("Como construir seu funil na prática"),
      ul([
        "Mapeie de onde vêm seus clientes hoje",
        "Identifique o maior gargalo (geralmente conversão ou fechamento)",
        "Priorize a etapa com maior impacto no revenue",
        "Implemente tracking em cada transição",
        "Otimize uma etapa por vez — não tente consertar tudo junto",
      ]),
      callout(
        "Funil sem CRM é funil cego. Se leads chegam e ninguém acompanha, o problema não é marketing — é processo comercial.",
      ),
    ],
  },
  {
    slug: "landing-page-vs-site-institucional",
    title: "Landing page vs site institucional: qual usar em campanhas pagas",
    excerpt:
      "Site institucional informa. Landing page converte. Entenda quando usar cada um e por que misturar os dois custa caro.",
    category: "growth",
    type: "comparativo",
    readTime: "5 min",
    publishedAt: "2026-02-20",
    author: "Raise One",
    seo: {
      title: "Landing page vs site institucional | Raise One",
      description:
        "Compare landing page e site institucional para campanhas pagas. Quando usar cada um e como isso impacta sua taxa de conversão.",
    },
    relatedSlugs: [
      "como-estruturar-campanhas-google-ads",
      "funil-de-aquisicao-guia",
      "5-erros-trafego-pago",
    ],
    sections: [
      p("Empresa investe R$ 10.000 em Google Ads e direciona para homepage. Taxa de conversão: 1,2%. Mesma empresa cria landing page dedicada. Taxa de conversão: 4,8%. Mesmo tráfego, 4x mais leads. A diferença não é sorte — é arquitetura."),
      {
        kind: "comparison",
        left: {
          title: "Site institucional",
          items: [
            "Múltiplas páginas e navegação",
            "Informa sobre a empresa",
            "Distrações (menu, links, blog)",
            "Copy genérico para todos",
            "Ideal para branding e SEO",
          ],
        },
        right: {
          title: "Landing page",
          items: [
            "Página única, foco total",
            "Converte visitante em lead",
            "Zero distrações — um CTA",
            "Copy específico por campanha",
            "Ideal para tráfego pago",
          ],
        },
      },
      h2("Quando usar site institucional"),
      p("SEO orgânico, credibilidade de marca, navegação geral. O site é sua vitrine permanente — mas não sua máquina de conversão para campanhas."),
      h2("Quando usar landing page"),
      p("Toda campanha paga (Google Ads, Meta Ads). Cada oferta, serviço ou segmento deve ter LP dedicada com copy, design e CTA alinhados ao anúncio."),
      callout(
        "Benchmark Raise One: landing pages dedicadas convertem em média 3–5x mais que homepage em campanhas pagas.",
      ),
    ],
  },
  {
    slug: "ia-marketing-imobiliario",
    title: "Como a IA está transformando o marketing imobiliário",
    excerpt:
      "Qualificação automática de leads, descrições de empreendimentos e follow-up inteligente — IA no setor imobiliário vai além do hype.",
    category: "imobiliario",
    type: "artigo",
    readTime: "7 min",
    publishedAt: "2026-02-15",
    author: "Raise One",
    seo: {
      title: "IA no marketing imobiliário | Raise One",
      description:
        "Como inteligência artificial transforma captação, qualificação e follow-up no mercado imobiliário.",
    },
    relatedSlugs: [
      "automacoes-ia-follow-up",
      "como-estruturar-campanhas-google-ads",
    ],
    sections: [
      p("Mercado imobiliário tradicionalmente depende de corretor humano para cada interação. IA não substitui o corretor — mas elimina 70% do trabalho repetitivo que impede o corretor de focar em fechar vendas."),
      h2("Qualificação automática de leads"),
      p("Agentes de IA analisam formulários, conversas de WhatsApp e comportamento no portal para classificar leads por temperatura (quente, morno, frio). Corretor recebe apenas leads prontos para conversa comercial."),
      h2("Descrições e conteúdo automatizado"),
      p("IA gera descrições de empreendimentos, posts para redes sociais e respostas para FAQ — mantendo tom de marca e adaptando para cada público."),
      h2("Follow-up inteligente"),
      p("Automações com IA enviam mensagens personalizadas baseadas em comportamento: visitou planta mas não preencheu formulário? Recebe WhatsApp com disponibilidade. Baixou tabela de preços? Recebe convite para visita."),
      h2("Atlas: IA aplicada na prática"),
      p("Desenvolvemos o Atlas — portal imobiliário com IA integrada — para incorporadoras que precisam de captação + qualificação + CRM em uma plataforma. Resultado: +340% em leads qualificados e -62% no tempo de resposta."),
    ],
  },
  {
    slug: "seo-local-guia-completo",
    title: "SEO local: guia completo para empresas de serviços",
    excerpt:
      "Aparecer no Google Maps e nos resultados locais é gratuito e gera leads qualificados. Veja como otimizar sua presença local.",
    category: "seo",
    type: "guia",
    readTime: "9 min",
    publishedAt: "2026-02-10",
    author: "Raise One",
    seo: {
      title: "Guia SEO local para empresas de serviços | Raise One",
      description:
        "Guia completo de SEO local: Google Business Profile, reviews, conteúdo local e otimização para buscas regionais.",
    },
    relatedSlugs: [
      "como-estruturar-campanhas-google-ads",
      "funil-de-aquisicao-guia",
    ],
    sections: [
      p("46% das buscas no Google têm intenção local. Para clínicas, advogados, imobiliárias e serviços locais, SEO local é o canal orgânico com melhor ROI — e o mais subestimado."),
      h2("1. Google Business Profile otimizado"),
      ul([
        "Nome, endereço e telefone consistentes em toda a web",
        "Categorias corretas e completas",
        "Fotos profissionais atualizadas",
        "Horário de funcionamento preciso",
        "Posts semanais com ofertas e novidades",
      ]),
      h2("2. Reviews: o ativo mais valioso"),
      p("Empresas com 4,5+ estrelas e 50+ reviews aparecem significativamente mais no pack local. Peça reviews ativamente — após cada atendimento bem-sucedido."),
      h2("3. Conteúdo local no site"),
      p("Páginas dedicadas por cidade/bairro, blog com temas locais, schema markup de LocalBusiness. Google precisa entender onde você atua."),
      h2("4. SEO local + Google Ads"),
      p("Os dois se complementam: SEO orgânico para sustentabilidade de longo prazo, Google Ads para captura imediata enquanto SEO amadurece. Remarketing conecta visitantes orgânicos que não converteram."),
    ],
  },
  {
    slug: "5-erros-trafego-pago",
    title: "5 erros que fazem empresas queimar budget em tráfego pago",
    excerpt:
      "Investir em ads sem estrutura é queimar dinheiro. Estes são os 5 erros mais comuns — e como evitar cada um.",
    category: "insights",
    type: "artigo",
    readTime: "6 min",
    publishedAt: "2026-02-05",
    author: "Raise One",
    seo: {
      title: "5 erros em tráfego pago que queimam budget | Raise One",
      description:
        "Evite os 5 erros mais comuns em tráfego pago: landing page errada, tracking incompleto, campanhas genéricas e mais.",
    },
    relatedSlugs: [
      "landing-page-vs-site-institucional",
      "como-estruturar-campanhas-google-ads",
      "funil-de-aquisicao-guia",
    ],
    sections: [
      h2("1. Direcionar tráfego para homepage"),
      p("Homepage tem dezenas de links, menu de navegação e mensagem genérica. Cada clique pago deveria ir para landing page dedicada com um único objetivo: converter."),
      h2("2. Campanhas sem segmentação de intenção"),
      p("Misturar termos informacionais e transacionais na mesma campanha dilui budget. Separe por intenção e aloque budget onde a conversão é mais provável."),
      h2("3. Tracking incompleto ou inexistente"),
      p("Sem conversões configuradas, impossível saber o que funciona. Configure pixels, eventos e integração CRM antes de gastar o primeiro real."),
      h2("4. Leads sem processo comercial"),
      p("Campanha gera 100 leads. Ninguém liga. Problema não é marketing — é comercial. CRM e automação de follow-up são parte do funil, não opcionais."),
      h2("5. Otimizar cedo demais ou tarde demais"),
      p("Mudar campanha todo dia impede aprendizado do algoritmo. Nunca otimizar deixa dinheiro na mesa. Cadência ideal: revisão semanal com ajustes incrementais."),
      callout(
        "Antes de aumentar budget, responda: consigo medir quantos leads viraram clientes? Se não, o problema é estrutura — não volume.",
      ),
    ],
  },
  {
    slug: "crm-para-negocios-em-crescimento",
    title: "CRM não é luxo: por que todo negócio em crescimento precisa de um",
    excerpt:
      "Leads que ninguém acompanha são dinheiro jogado fora. CRM organiza, automatiza e transforma marketing em receita.",
    category: "growth",
    type: "artigo",
    readTime: "5 min",
    publishedAt: "2026-01-28",
    author: "Raise One",
    seo: {
      title: "Por que seu negócio precisa de CRM | Raise One",
      description:
        "CRM para negócios em crescimento: organização comercial, automação de follow-up e integração com campanhas de marketing.",
    },
    relatedSlugs: [
      "funil-de-aquisicao-guia",
      "automacoes-ia-follow-up",
    ],
    sections: [
      p("Empresa investe R$ 15.000/mês em marketing. Gera 200 leads. Fecha 8 vendas. Taxa de conversão comercial: 4%. Com CRM estruturado e follow-up automatizado, a mesma base de leads fecha 16–20 vendas. Dobro de receita, mesmo investimento em mídia."),
      h2("O que um CRM resolve"),
      ul([
        "Leads esquecidos no e-mail ou WhatsApp",
        "Corretor/vendedor sem saber quem ligar primeiro",
        "Zero visibilidade do pipeline comercial",
        "Impossibilidade de medir CAC real por canal",
        "Follow-up manual e inconsistente",
      ]),
      h2("CRM integrado ao marketing"),
      p("CRM isolado de marketing é planilha bonita. CRM integrado captura leads de campanhas automaticamente, qualifica por score, dispara automações e mostra qual canal gera clientes — não apenas leads."),
      h2("Quando implementar"),
      p("Se você gera mais de 20 leads por mês e não tem processo comercial estruturado, precisa de CRM agora — não quando 'crescer mais'. Quanto antes estruturar, menos leads se perdem."),
    ],
  },
  {
    slug: "automacoes-ia-follow-up",
    title: "Automações com IA: do atendimento ao follow-up comercial",
    excerpt:
      "IA no marketing não é chatbot genérico — é automação inteligente que qualifica, nutre e acelera o ciclo comercial.",
    category: "ia",
    type: "artigo",
    readTime: "7 min",
    publishedAt: "2026-01-20",
    author: "Raise One",
    seo: {
      title: "Automações com IA para follow-up comercial | Raise One",
      description:
        "Como usar IA para automatizar atendimento, qualificação de leads e follow-up comercial — com exemplos práticos.",
    },
    relatedSlugs: [
      "ia-marketing-imobiliario",
      "crm-para-negocios-em-crescimento",
    ],
    sections: [
      p("Automação tradicional segue regras fixas: 'se preencheu formulário, envie e-mail X'. Automação com IA entende contexto, adapta mensagem e decide próximo passo — como um SDR virtual que nunca dorme."),
      h2("Atendimento inicial com IA"),
      p("Agente de IA responde WhatsApp e chat do site 24/7, qualifica interesse, coleta informações essenciais e agenda reunião — ou encaminha para humano quando necessário."),
      h2("Follow-up inteligente"),
      p("Lead não respondeu em 24h? IA envia mensagem personalizada baseada no serviço de interesse. Não abriu e-mail? WhatsApp com case relevante. Comportamento guia a automação, não calendário fixo."),
      h2("Análise e priorização"),
      p("IA analisa histórico de interações e atribui score de propensão a compra. Time comercial foca nos leads quentes — não perde tempo com curiosos."),
      callout(
        "No Programa Raise One, implementamos automações IA integradas ao CRM e campanhas — não como ferramenta isolada.",
      ),
    ],
  },
  {
    slug: "como-medir-roi-meta-ads",
    title: "Como medir ROI real em campanhas de Meta Ads",
    excerpt:
      "Impressões e cliques não pagam conta. Veja como medir ROI real — do anúncio ao fechamento comercial.",
    category: "meta-ads",
    type: "guia",
    readTime: "6 min",
    publishedAt: "2026-01-15",
    author: "Raise One",
    seo: {
      title: "Como medir ROI em Meta Ads | Raise One",
      description:
        "Guia prático para medir ROI real em Meta Ads: tracking, atribuição, CAC e integração com CRM.",
    },
    relatedSlugs: [
      "meta-ads-vs-google-ads",
      "como-estruturar-campanhas-google-ads",
      "crm-para-negocios-em-crescimento",
    ],
    sections: [
      p("Meta Ads mostra ROAS bonito no painel. Mas ROAS de plataforma raramente reflete realidade comercial — porque mede conversão de formulário, não venda fechada. ROI real conecta investimento em mídia à receita gerada."),
      h2("1. Configure o Pixel corretamente"),
      p("Eventos de conversão além de 'PageView': Lead, CompleteRegistration, Purchase (se e-commerce). Quanto mais granular, melhor a otimização do algoritmo."),
      h2("2. Integração com CRM"),
      p("Lead entrou no CRM via Meta? Tag a origem. Fechou venda? Registre valor. Só assim você calcula CAC real e ROI por campanha/creative."),
      h2("3. Janela de atribuição"),
      p("Meta usa janela de 7 dias click / 1 dia view por padrão. Para funis longos (B2B, imobiliário, educação), considere janelas maiores e compare com dados do CRM."),
      h2("4. Métricas que importam"),
      ul([
        "CAC (Custo de Aquisição de Cliente) — não CPL",
        "ROAS real — receita CRM / investimento mídia",
        "Taxa de conversão lead → cliente",
        "LTV:CAC ratio (ideal > 3:1)",
      ]),
    ],
  },
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: BlogCategory | "all"): BlogArticle[] {
  if (category === "all") return blogArticles;
  return blogArticles.filter((a) => a.category === category);
}

export function getCategoryMeta(id: BlogCategory | "all"): BlogCategoryMeta {
  return blogCategories.find((c) => c.id === id) ?? blogCategories[0];
}

export function getRelatedArticles(slugs: string[]): BlogArticle[] {
  return slugs
    .map((slug) => getBlogArticle(slug))
    .filter((a): a is BlogArticle => a != null);
}

export const blogNextSteps: NextStepLink[] = [
  {
    label: "Fazer diagnóstico",
    description: "Aplique o que aprendeu — analise seu mercado gratuitamente.",
    href: "/diagnostico",
    internal: true,
  },
  {
    label: "Programa de Crescimento",
    description: "Transforme insights em crescimento estruturado.",
    href: "/programa-de-crescimento",
    internal: true,
  },
  {
    label: "Ver cases",
    description: "Resultados reais de empresas que aplicaram essas estratégias.",
    href: "/cases",
    internal: true,
  },
];
