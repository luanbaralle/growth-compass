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
  quote,
  blogFeatured,
  blogInline,
  estimateReadTime,
} from "../helpers";

const slug = "seo-local-guia-completo";

const sections = [
  p(
    "Quando alguém busca 'dentista perto de mim', 'imobiliária centro' ou 'advogado trabalhista [cidade]', o Google decide em milissegundos quem aparece no mapa, no pack local e nos resultados orgânicos. 46% das buscas têm intenção local — e para clínicas, imobiliárias, advogados, prestadores de serviço e comércio de bairro, SEO local é frequentemente o canal orgânico com melhor ROI. É gratuito em mídia (não paga por clique), gera leads com intenção altíssima e constrói autoridade duradoura. Ainda assim, permanece o canal mais subestimado: perfis Google incompletos, reviews ignorados, site sem schema e zero estratégia de páginas locais.",
  ),
  p(
    "Este guia cobre SEO local de ponta a ponta: otimização passo a passo do Google Business Profile (GBP), implementação de LocalBusiness schema, arquitetura de páginas locais no site, scripts e processos para conquistar reviews e a combinação SEO + Google Ads para dominar a SERP local enquanto orgânico amadurece. Se você atende clientes em região geográfica definida, este é o manual operacional — não checklist superficial.",
  ),

  h2("Por que SEO local importa mais que nunca", "importancia"),
  p(
    "Busca local evoluiu: usuário espera ver horário, telefone, reviews e botão de ação sem sair do Google. Empresas otimizadas capturam cliques de mapa, ligações diretas e rotas — conversões que nem sempre aparecem no Analytics tradicional. Concorrentes com 4,7 estrelas e 120 reviews deslocam negócios melhores mas invisíveis digitalmente.",
  ),
  p(
    "SEO local também protege marca: se você não ocupa o pack local, concorrente ou agregador ocupa. Para segmentos regulamentados (clínicas, advocacia) e de alto ticket (imobiliário), presença local consistente reduz dependência exclusiva de mídia paga e baixa CAC blended ao longo do tempo.",
  ),
  callout(
    "SEO local não substitui Google Ads — acelera enquanto orgânico amadurece e sustenta quando mídia pausa. Os melhores resultados vêm da combinação.",
    "Princípio Raise One",
  ),

  h2("Google Business Profile: passo a passo", "gbp"),
  p(
    "GBP (Google Business Profile) é o ativo central do SEO local. Perfil incompleto ou inconsistente é equivalente a loja física com placa apagada. Siga esta sequência de implementação e revisão mensal.",
  ),
  h3("1. Reivindique e verifique"),
  p(
    "Acesse business.google.com, reivindique ou crie perfil com NAP exato (Nome, Endereço, Telefone) idêntico ao site e demais diretórios. Verificação por postcard, telefone ou e-mail conforme elegibilidade. Negócios com múltiplas unidades: perfil separado por localização física — nunca perfil único tentando cobrir cidades diferentes.",
  ),
  h3("2. Categorias primária e secundárias"),
  p(
    "Categoria primária deve ser a mais específica possível: 'Clínica de estética' em vez de 'Clínica médica'; 'Corretor de imóveis' em vez de 'Empresa de serviços imobiliários'. Adicione categorias secundárias relevantes (máximo coerente — spam de categorias penaliza). Pesquise concorrentes top 3 no mapa e compare categorias.",
  ),
  h3("3. Descrição, serviços e atributos"),
  p(
    "Descrição até 750 caracteres com serviços principais, região atendida e diferencial — sem keyword stuffing. Cadastre serviços individualmente com descrição quando disponível. Preencha atributos: acessibilidade, formas de pagamento, idiomas, 'mulheres lideradas' etc. Quanto mais completo, mais sinais de relevância para o algoritmo local.",
  ),
  h3("4. Fotos e mídia"),
  p(
    "Mínimo profissional: logo, capa, interior, exterior, equipe, antes/depois (quando permitido). Atualize mensalmente — perfis com fotos recentes recebem mais engajamento. Vídeo curto (30–60s) apresentando espaço ou serviço aumenta tempo de interação no perfil.",
  ),
  h3("5. Horários, feriados e links"),
  p(
    "Horário preciso incluindo exceções e feriados. Link do site apontando para página local relevante — não sempre homepage genérica. Ative botões: WhatsApp, agendamento, menu (se restaurante). UTMs no link do site para medir tráfego originado do GBP no GA4.",
  ),
  h3("6. Posts semanais no GBP"),
  p(
    "Publique oferta, novidade, evento ou dica semanalmente. Posts expiram, mas sinalizam negócio ativo. Template: headline com serviço + região, 1–2 frases de valor, CTA 'Saiba mais' linkando para LP específica. Consistência > perfeição.",
  ),
  ol([
    "Verificar NAP idêntico em site, GBP, Facebook, Apple Maps e diretórios",
    "Escolher categoria primária mais específica do mercado",
    "Cadastrar todos os serviços com descrição",
    "Upload de 10+ fotos profissionais categorizadas",
    "Configurar link com UTM: utm_source=google&utm_medium=organic&utm_campaign=gbp",
    "Agendar posts semanais no calendário editorial",
    "Monitorar insights GBP: ligações, rotas, cliques no site",
  ]),

  h2("LocalBusiness schema: implementação técnica", "schema"),
  p(
    "Schema markup ajuda Google a entender entidade local com precisão — endereço, área servida, horários, telefone, geo-coordenadas. Implemente JSON-LD no <head> ou via GTM (preferível no código da página para estabilidade).",
  ),
  p(
    "Tipo base: LocalBusiness ou subtipo específico — Dentist, RealEstateAgent, EducationalOrganization, HealthAndBeautyBusiness. Propriedades essenciais: name, image, address (PostalAddress), geo (latitude/longitude), url, telephone, openingHoursSpecification, sameAs (redes sociais). Para múltiplas unidades, schema separado por página de localização — não um bloco genérico na homepage.",
  ),
  callout(
    "Valide markup em search.google.com/test/rich-results após publicar. Erros de endereço ou telefone inconsistente com GBP podem confundir rather than help.",
  ),
  table(
    ["Propriedade schema", "Fonte", "Prioridade"],
    [
      ["name", "Nome oficial do negócio", "Alta"],
      ["address", "Endereço físico verificado", "Alta"],
      ["geo", "Coordenadas do Google Maps", "Alta"],
      ["telephone", "Telefone principal (E.164)", "Alta"],
      ["openingHours", "Horário idêntico ao GBP", "Alta"],
      ["areaServed", "Cidades/bairros atendidos", "Média"],
      ["aggregateRating", "Reviews verificados (se exibir)", "Média"],
    ],
  ),

  h2("Páginas locais no site: arquitetura que ranqueia", "paginas-locais"),
  p(
    "Site institucional genérico raramente ranqueia para 'serviço + bairro'. Crie arquitetura de páginas locais com conteúdo único — não duplicate content com cidade trocada.",
  ),
  h3("Estrutura recomendada"),
  ul([
    "Página hub: /clinica-estetica-sao-paulo/ — visão geral do serviço na cidade",
    "Páginas bairro: /clinica-estetica-pinheiros/ — conteúdo específico da região",
    "Páginas serviço+local: /botox-zona-sul-sp/ — alta intenção transacional",
    "Blog local: artigos sobre demanda regional, regulamentação local, cases locais",
  ]),
  h3("Conteúdo que diferencia"),
  p(
    "Cada página local deve incluir: H1 com serviço + localização, parágrafo introdutório único (como atende a região), mapa embed, NAP visível, depoimentos de clientes da área, FAQ local ('Quanto custa X em [bairro]?'), CTA claro. Mínimo 600–800 palavras de conteúdo substantivo — páginas fin de 150 palavras não ranqueiam e podem ser vistas como doorway pages.",
  ),
  h3("Internal linking"),
  p(
    "Homepage → hubs de serviço → páginas locais → posts de blog relacionados. Link do footer com lista de cidades/bairros atendidos. Breadcrumbs com schema BreadcrumbList. Google precisa de caminhos claros para crawlear e entender hierarquia geográfica.",
  ),
  img(
    blogInline(slug, 1),
    "Arquitetura de SEO local: GBP, páginas locais, schema e reviews interconectados",
    "SEO local eficaz integra perfil Google, site e reputação em um sistema",
  ),

  h2("Reviews: scripts, processos e compliance", "reviews"),
  p(
    "Reviews são fator de ranking local e conversão — usuário confia mais em 4,6 estrelas com volume do que em anúncio perfeito. Meta mínima: 4,5+ média e 50+ reviews para competir em mercados urbanos; mercados menores toleram volume menor, mas qualidade importa igual.",
  ),
  h3("Processo sistemático pós-atendimento"),
  ol([
    "Definir momento ideal: após resultado entregue (não no meio do serviço)",
    "Enviar mensagem personalizada via WhatsApp ou SMS em até 24h",
    "Link direto para review no Google (gerado no painel GBP)",
    "Agradecer publicamente reviews positivos em até 48h",
    "Responder reviews negativos com empatia, solução e convite offline",
    "Monitorar mensalmente: volume, média, temas recorrentes",
  ]),
  h3("Scripts de solicitação"),
  p(
    "Script WhatsApp (clínica): 'Olá [nome], esperamos que tenha gostado do [procedimento]! Sua opinião nos ajuda a atender mais pessoas na região. Se puder, deixe um review rápido aqui: [link]. Leva menos de 1 minuto. Obrigado!' — Script imobiliário: '[Nome], parabéns pela conquista! Foi um prazer acompanhar a compra do seu imóvel. Se puder compartilhar como foi a experiência, ajuda outros compradores da região: [link].'",
  ),
  p(
    "Nunca: comprar reviews, oferecer incentivo financeiro por avaliação positiva, criar reviews fake ou filtrar só clientes satisfeitos de forma antiética. Google penaliza e destrói confiança de marca.",
  ),
  callout(
    "Review negativo bem respondido converte melhor que ausência de reviews — demonstra maturidade e cuidado com cliente.",
  ),

  h2("SEO local + Google Ads: domínio da SERP", "seo-ads"),
  p(
    "Empresas que dominam busca local aparecem duas vezes na primeira dobra: pack local (orgânico/maps) e anúncio Search (pago). Remarketing captura quem clicou no orgânico mas não converteu. Estratégia combinada:",
  ),
  ul([
    "SEO local constrói base sustentável — GBP, páginas locais, reviews, schema",
    "Google Ads captura termos transacionais enquanto orgânico ganha autoridade",
    "Campanhas de marca protegem buscas pelo nome quando concorrentes licitam",
    "Remarketing para visitantes de páginas locais com oferta específica da região",
    "UTMs diferenciam tráfego orgânico GBP vs campanhas pagas no relatório unificado",
  ]),
  p(
    "Evite cannibalização desnecessária: em termos onde você já ranqueia #1 orgânico com alto CTR, reduza lance em Search ou foque budget em serviços/regiões onde orgânico ainda não domina. Use Search Console + GBP Insights + Google Ads para mapear overlap.",
  ),
  quote(
    "Presença local não é perfil Google preenchido uma vez — é sistema de reputação, conteúdo e visibilidade revisado mensalmente.",
    "Raise One",
  ),

  h2("Checklist mensal de SEO local", "checklist-mensal"),
  p(
    "Rotina de 2–3 horas/mês mantém posição e identifica problemas cedo.",
  ),
  ol([
    "Auditar NAP em GBP, site e top 5 diretórios",
    "Publicar 4 posts no GBP (1/semana)",
    "Solicitar reviews de atendimentos concluídos no mês",
    "Responder 100% dos reviews recebidos",
    "Verificar posição para 5 keywords locais principais",
    "Atualizar fotos se houve mudança visual ou nova equipe",
    "Checar Search Console: erros de indexação em páginas locais",
    "Validar schema após qualquer mudança de endereço ou horário",
    "Cruzar leads orgânicos vs pagos no CRM por origem",
    "Identificar 1 página local nova ou expansão de conteúdo prioritária",
  ]),

  h2("Citações locais (NAP) e diretórios", "citacoes"),
  p(
    "Consistência de NAP (Name, Address, Phone) em diretórios relevantes reforça confiança do algoritmo local. Priorize: Apple Maps, Bing Places, Facebook, Instagram (com endereço), páginas de associações de classe (CRM médico, CRECI imobiliário), portais de saúde ou educação do segmento. Evite centenas de diretórios genéricos de baixa qualidade — foco em relevância setorial e regional. Audite trimestralmente com busca exata do telefone e endereço para identificar citações desatualizadas ou duplicadas que confundem Google.",
  ),
  p(
    "Para redes com múltiplas unidades, cada filial deve ter NAP próprio e página local correspondente. Centralizar tudo em um único perfil ou endereço fictício é prática de risco que pode resultar em suspensão do GBP.",
  ),

  h2("Erros comuns que sabotam SEO local", "erros"),
  ul([
    "Nome do negócio com keyword stuffing ('Clínica X — Melhor Botox SP')",
    "Endereço virtual ou PO Box em negócio que precisa de local físico",
    "Páginas locais duplicadas com só cidade trocada",
    "Ignorar reviews negativos ou responder genericamente",
    "Site lento em mobile — Core Web Vitals ruins afetam ranking",
    "NAP inconsistente entre plataformas",
    "Desistir em 60 dias — SEO local leva 3–6 meses para tração significativa",
  ]),

  cta({
    title: "Sua empresa aparece quando clientes buscam na região?",
    description:
      "Fazemos auditoria de presença local: GBP, site, reviews e oportunidades de combinação com Google Ads.",
    primaryLabel: "Falar com especialista",
    primaryHref: "/diagnostico",
  }),

  linkCard({
    label: "SEO local para clínicas",
    href: "/clinica",
    type: "segment",
    description: "Estratégias de presença local para clínicas e estética.",
  }),
  linkCard({
    label: "Marketing imobiliário local",
    href: "/imobiliaria",
    type: "segment",
    description: "Visibilidade local para corretores e incorporadoras.",
  }),
  linkCard({
    label: "Serviços locais",
    href: "/servicos-locais",
    type: "segment",
    description: "Presença digital para negócios de bairro e região.",
  }),
];

const faq = [
  {
    question: "Quanto tempo leva para ver resultados de SEO local?",
    answer:
      "Primeiros sinais (aumento de impressões no GBP, posições em long-tail local) em 4–8 semanas. Tração consistente em keywords competitivas: 3–6 meses. SEO local é investimento composto — reviews e autoridade acumulam ao longo do tempo.",
  },
  {
    question: "Preciso de endereço comercial para ranquear localmente?",
    answer:
      "Negócios que atendem clientes no local (clínicas, lojas) precisam endereço verificável. Prestadores que vão até o cliente (service area business) podem ocultar endereço e definir áreas atendidas — mas verificação e consistência continuam obrigatórias.",
  },
  {
    question: "Quantos reviews preciso para competir?",
    answer:
      "Analise concorrentes no pack local das suas 3 keywords principais. Em mercados urbanos, 50+ reviews com 4,5+ estrelas é baseline competitivo. Volume importa, mas recência e texto das avaliações também pesam no algoritmo.",
  },
  {
    question: "Páginas locais não vão cannibalizar meu SEO?",
    answer:
      "Cannibalização ocorre quando páginas competem pelo mesmo termo sem hierarquia. Evite com arquitetura clara: hub de cidade → bairros → serviços específicos, conteúdo único em cada URL e internal linking deliberado. Cada página deve ter keyword primária distinta.",
  },
  {
    question: "SEO local funciona sem site?",
    answer:
      "GBP sozinho gera visibilidade limitada — ligações e rotas sim, mas autoridade orgânica e conversão ficam restritas. Site com páginas locais, schema e performance mobile multiplica resultados do GBP e permite remarketing + Analytics completo.",
  },
];

export const seoLocalGuiaCompleto: BlogArticle = {
  slug,
  title: "SEO local: guia completo para empresas de serviços",
  excerpt:
    "Aparecer no Google Maps e nos resultados locais gera leads qualificados de graça. GBP passo a passo, schema, páginas locais, reviews e combo SEO + Ads.",
  category: "seo",
  type: "guia",
  pillar: "presenca",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-02-10",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  featuredImage: blogFeatured(slug),
  segments: ["clinica", "imobiliaria", "servicos-locais"],
  targetKeywords: [
    "seo local",
    "google business profile",
    "como aparecer no google maps",
    "seo local clínicas",
    "localbusiness schema",
  ],
  seo: {
    title: "Guia SEO local para empresas de serviços | Raise One",
    description:
      "Guia completo de SEO local: Google Business Profile, reviews, páginas locais, schema LocalBusiness e integração com Google Ads.",
  },
  sections,
  faq,
  relatedSlugs: [
    "como-estruturar-campanhas-google-ads",
    "funil-de-aquisicao-guia",
  ],
  relatedLinks: [
    {
      label: "Clínicas",
      href: "/clinica",
      type: "segment",
      description: "Presença local e aquisição para clínicas e estética.",
    },
    {
      label: "Imobiliárias",
      href: "/imobiliaria",
      type: "segment",
      description: "SEO local e campanhas para mercado imobiliário.",
    },
    {
      label: "Serviços locais",
      href: "/servicos-locais",
      type: "segment",
      description: "Visibilidade digital para negócios de bairro.",
    },
  ],
};
