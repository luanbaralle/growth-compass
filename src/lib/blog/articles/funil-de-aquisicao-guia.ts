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

const slug = "funil-de-aquisicao-guia";

const sections = [
  p(
    "Funil de aquisição não é diagrama bonito para apresentação de board — é o mapa operacional de como estranhos se tornam clientes e, depois, fontes de receita recorrente. Sem funil mapeado, marketing vira gasto: você sabe quanto investiu em ads, talvez quantos formulários recebeu, mas não consegue responder onde o dinheiro travou, qual etapa perde mais gente ou qual canal gera clientes — não apenas cliques. Empresas que escalam com previsibilidade tratam o funil como infraestrutura, no mesmo nível de CRM, financeiro e produto.",
  ),
  p(
    "Neste guia, detalhamos as cinco etapas do funil de aquisição com benchmarks de métricas por fase, o papel do CRM como coluna vertebral, o fluxo prático Google Ads → landing page → CRM → WhatsApp e um exemplo aplicado inspirado em projetos reais como o Studio 21. Se você lidera clínica, imobiliária, educação ou serviço local e sente que 'marketing gera lead mas não gera venda', o problema quase sempre está em uma transição específica do funil — e é possível encontrá-la com dados.",
  ),

  h2("O que é funil de aquisição — e o que não é", "definicao"),
  p(
    "Funil de aquisição descreve a jornada comercial desde o primeiro contato com sua marca até a receita gerada — incluindo retenção e indicação. Não confunda com funil de marketing isolado (só topo) nem com pipeline de vendas (só fundo). Aquisição integra os dois: traz pessoas certas, converte em oportunidade qualificada, apoia fechamento e mede retorno.",
  ),
  p(
    "Erro comum: otimizar uma etapa sem enxergar o sistema. Reduzir CPL no Google Ads não adianta se comercial demora 48 horas para responder WhatsApp. Aumentar tráfego no site não adianta se landing page converte 0,8%. Funil bem construído identifica o gargalo com maior impacto no revenue e ataca um de cada vez — com tracking em cada transição.",
  ),
  callout(
    "Funil sem CRM é funil cego. Se leads chegam e ninguém acompanha, o problema não é marketing — é processo comercial.",
    "Princípio Raise One",
  ),

  h2("As 5 etapas do funil — com benchmarks", "cinco-etapas"),
  p(
    "Cada etapa tem objetivo, canais típicos, métricas-chave e benchmarks de referência baseados em operações de serviços locais e regionais. Seus números variam por ticket, concorrência e maturidade — use como bússola, não como sentença.",
  ),

  h3("1. Awareness — Descoberta", "awareness"),
  p(
    "Objetivo: fazer seu ICP saber que você existe e que resolve um problema específico. Canais: Meta Ads (topo), SEO informacional, conteúdo, indicação, Google Display/YouTube via PMax. Métricas: alcance, impressões, tráfego novo, branded search lift. Benchmark: CTR em campanhas de awareness entre 0,8% e 2% (Display/Video); crescimento de buscas pela marca de 5–15% trimestral quando campanha de demanda está ativa.",
  ),
  p(
    "Armadilha: celebrar alcance sem medir se o público certo viu. Awareness para audiência errada enche o remarketing de curiosos e infla custo nas etapas seguintes.",
  ),

  h3("2. Consideração — Interesse e avaliação", "consideracao"),
  p(
    "Objetivo: transformar curiosidade em intenção — a pessoa compara opções e busca prova de que você é a escolha certa. Canais: landing pages educativas, remarketing, e-mail/WhatsApp de nutrição, SEO comparativo, Google Ads de meio de funil. Métricas: tempo na página, páginas por sessão, taxa de retorno, engajamento com conteúdo. Benchmark: bounce rate em LP de consideração abaixo de 55%; taxa de retorno em 7 dias acima de 8% para serviços de ticket médio-alto.",
  ),
  p(
    "Conteúdo de consideração responde: 'Por que vocês?', 'Como funciona?', 'Quanto custa aproximadamente?', 'Quem já contratou?'. Case studies, depoimentos em vídeo e comparativos honestos performam melhor que institucional genérico.",
  ),

  h3("3. Conversão — Ação e lead", "conversao"),
  p(
    "Objetivo: capturar contato qualificado — formulário, WhatsApp, ligação, agendamento. Canais: Google Ads transacional, LP de conversão, extensões de formulário, chat. Métricas: taxa de conversão da LP, CPL, CAC parcial (custo por lead). Benchmarks por vertical: clínicas e estética 3–8% de conversão LP em tráfego pago; imobiliário 1,5–4%; educação 2–6%; serviços locais gerais 2–5%. CPL 'bom' depende de ticket — compare sempre CPL ÷ taxa de fechamento.",
  ),
  table(
    ["Vertical", "Conv. LP (pago)", "CPL referência*", "Ciclo até fechamento"],
    [
      ["Clínica / estética", "3–8%", "R$ 25–80", "3–14 dias"],
      ["Imobiliário", "1,5–4%", "R$ 40–150", "30–90 dias"],
      ["Educação / EAD", "2–6%", "R$ 15–50", "7–45 dias"],
      ["Serviços locais B2B", "2–5%", "R$ 50–200", "14–60 dias"],
    ],
  ),
  p(
    "*CPL de referência varia por região, concorrência e sazonalidade. Use histórico próprio assim que tiver 30+ conversões/mês.",
  ),

  h3("4. Venda — Fechamento comercial", "venda"),
  p(
    "Objetivo: converter lead em cliente pagante. Canais: CRM, WhatsApp, telefone, reunião presencial, automações de follow-up. Métricas: taxa lead → oportunidade, taxa oportunidade → venda, ciclo de vendas, ticket médio. Benchmark: taxa de fechamento sobre leads qualificados entre 15% e 35% em serviços locais bem operados; abaixo de 10% indica problema de qualificação (marketing) ou processo comercial (vendas).",
  ),
  p(
    "SLA de resposta importa tanto quanto campanha. Estudo interno consolidado: leads respondidos em menos de 5 minutos têm até 4x mais chance de fechamento que leads respondidos após 30 minutos — independente da origem.",
  ),

  h3("5. Retenção e escala — LTV e indicação", "retencao"),
  p(
    "Objetivo: maximizar valor do cliente ao longo do tempo — recompra, upsell, indicação, reviews. Canais: e-mail, WhatsApp pós-venda, programa de indicação, Google Business Profile (reviews). Métricas: LTV, churn, NPS, taxa de indicação, repeat rate. Benchmark: LTV:CAC acima de 3:1 indica modelo saudável; abaixo de 2:1 exige revisão de aquisição ou ticket.",
  ),
  img(
    blogInline(slug, 1),
    "Diagrama das 5 etapas do funil de aquisição: awareness, consideração, conversão, venda e retenção",
    "Cada etapa do funil tem métricas e canais específicos — otimize uma de cada vez",
  ),

  h2("CRM: a espinha dorsal do funil", "crm"),
  p(
    "CRM não é luxo de empresa grande — é a memória do funil. Sem CRM, cada lead é evento isolado: ninguém sabe se aquela pessoa já visitou o site ontem, se falou com outro vendedor ou se veio de campanha que gera curiosos. Com CRM integrado ao marketing, o funil fica rastreável de ponta a ponta.",
  ),
  h3("O que o CRM precisa registrar"),
  ul([
    "Origem: canal, campanha, anúncio, keyword (via UTM + integração)",
    "Estágio no funil: lead novo, qualificado, proposta, fechado, perdido",
    "Histórico de interações: WhatsApp, ligações, e-mails, visitas",
    "Motivo de perda: preço, timing, concorrente, desqualificado",
    "Valor: ticket estimado e receita fechada",
  ]),
  h3("Automações que destravam conversão"),
  p(
    "Lead entrou às 22h? Automação confirma recebimento e agenda contato humano para horário comercial. Lead morno parado 3 dias? Sequência de nutrição com case relevante. Lead quente que visitou página de preços duas vezes? Alerta imediato para vendedor. Essas automações não substituem humano — priorizam humano no momento certo.",
  ),
  p(
    "Integração Google Ads + GA4 + CRM permite calcular CAC real por campanha — não CPL. Essa métrica é o que separa decisão de escala baseada em dados de decisão baseada em vanity metrics.",
  ),
  callout(
    "Empresa investe R$ 15.000/mês em marketing, gera 200 leads, fecha 8 vendas. Com CRM e follow-up estruturado, a mesma base frequentemente fecha 16–20 — dobro de receita, mesmo investimento em mídia.",
  ),

  h2("Fluxo prático: Google Ads → LP → CRM → WhatsApp", "fluxo-pratico"),
  p(
    "Teoria vira operação quando cada peça está conectada. Este é o fluxo padrão que implementamos em projetos de aquisição para serviços locais — adaptável, mas sempre com tracking em cada handoff.",
  ),
  ol([
    "Usuário busca termo transacional no Google → clica em anúncio Search segmentado por serviço",
    "Anúncio leva a landing page dedicada (mesma promessa, zero distrações)",
    "Usuário preenche formulário ou clica WhatsApp → evento de conversão dispara no GTM/GA4",
    "Lead entra no CRM via integração (Zapier, API nativa ou webhook) com UTM preservado",
    "Automação envia mensagem imediata no WhatsApp confirmando recebimento",
    "Vendedor/consultor recebe alerta com contexto: serviço, campanha, horário preferido",
    "Follow-up estruturado em 24h, 72h e 7 dias para não-respondentes",
    "Fechamento registrado no CRM → conversão offline importada para Google Ads (quando aplicável)",
  ]),
  p(
    "Cada seta nesse fluxo é ponto de vazamento mensurável. Queda entre clique e LP? Problema de velocidade ou coerência do anúncio. Queda entre formulário e CRM? Integração quebrada. Queda entre CRM e WhatsApp? SLA comercial. Funil mapeado transforma 'marketing não funciona' em 'etapa 4 precisa de ajuste'.",
  ),

  h2("Exemplo prático: funil de salão premium", "exemplo-pratico"),
  p(
    "Salão de beleza premium em cidade litorânea — cenário similar ao Studio 21. Antes: dependência de indicação, Instagram sem conversão mensurável, zero previsibilidade de novos clientes. Objetivo: sistema que capture intenção de busca e converta em agendamento.",
  ),
  h3("Awareness e consideração"),
  p(
    "Meta Ads com vídeos de transformação (corte, coloração, tratamentos) para público local 25–55 anos. Remarketing para visitantes do site. SEO local com páginas por serviço. Métrica-alvo: 5.000+ impressões qualificadas/mês na região.",
  ),
  h3("Conversão"),
  p(
    "Google Ads Search separado por serviço de alto valor: 'escova progressiva [cidade]', 'balayage [cidade] preço'. LP com galeria, depoimentos e botão WhatsApp + formulário. Meta de conversão LP: 4%+. Resultado observado em operação similar: 180+ conversões em 90 dias, 2.500+ cliques qualificados.",
  ),
  h3("Venda e retenção"),
  p(
    "CRM com tag por serviço de interesse. Resposta WhatsApp em até 15 minutos no horário comercial. Pós-atendimento: pedido de review Google + oferta de retorno em 45 dias. LTV aumenta com pacotes e indicação — medido por repeat rate trimestral.",
  ),
  linkCard({
    label: "Case Studio 21",
    href: "/cases/studio21",
    type: "case",
    description: "Funil digital completo: Google Ads, landing page e estratégia de conversão.",
  }),
  quote(
    "O desafio não era aparecer mais. Era criar um sistema que gerasse demanda qualificada — não picos isolados de tráfego.",
    "Studio 21",
  ),

  h2("Como construir seu funil do zero", "construir-funil"),
  p(
    "Se você está começando ou resetando operação, siga esta sequência — testada em dezenas de implementações Raise One.",
  ),
  ol([
    "Mapeie de onde vêm clientes hoje: indicação, orgânico, pago, offline. Quantifique percentual.",
    "Desenhe jornada ideal: da busca ao fechamento, incluindo touchpoints e responsáveis.",
    "Identifique maior gargalo por volume × impacto — geralmente conversão LP ou follow-up comercial.",
    "Implemente tracking antes de escalar mídia: GTM, conversões, CRM, UTMs padronizados.",
    "Lance um canal de aquisição (tipicamente Google Ads transacional) com LP dedicada.",
    "Conecte CRM + WhatsApp com SLA definido e automação de confirmação.",
    "Meça semanalmente taxa de transição entre etapas — não apenas volume isolado.",
    "Otimize uma etapa por ciclo de 2–4 semanas; documente hipótese e resultado.",
    "Escale budget apenas na campanha/etapa com CAC dentro da meta e capacidade comercial disponível.",
    "Revise trimestralmente LTV:CAC e ajuste mix de canais.",
  ]),

  h2("Métricas de funil: dashboard mínimo viável", "dashboard"),
  p(
    "Você não precisa de dezenas de KPIs — precisa de um painel que mostre taxa de transição entre etapas adjacentes. Dashboard mínimo viável Raise One: (1) investimento por canal, (2) visitantes únicos em LP de conversão, (3) leads capturados com origem, (4) leads qualificados pelo comercial, (5) vendas fechadas com valor, (6) CAC e LTV por canal. Atualize semanalmente. Quando taxa conversão LP cai mas tráfego mantém, investigue página. Quando leads sobem mas fechamento cai, investigue qualificação ou SLA comercial. Dashboard transforma discussões subjetivas ('marketing não traz lead bom') em diagnósticos objetivos ('taxa lead→venda caiu de 22% para 11% após mudança de script').",
  ),
  p(
    "Ferramentas comuns nessa stack: GA4 para comportamento no site, Google Ads / Meta para custo e conversões de plataforma, CRM (HubSpot, Pipedrive, RD Station, Bitrix) para pipeline comercial e planilha ou Looker Studio para visão consolidada. O erro é escolher ferramenta antes de definir métricas — comece pelo número que importa para receita e construa tracking ao redor dele.",
  ),

  h2("Erros que quebram funis — mesmo com bons números no topo", "erros-comuns"),
  ul([
    "Medir sucesso só por CPL, ignorando taxa de qualificação e fechamento",
    "Landing page genérica para campanhas específicas",
    "CRM desconectado — leads em planilha ou e-mail solto",
    "WhatsApp pessoal do dono como 'CRM' — sem histórico nem escala",
    "Remarketing inexistente em ciclos longos (imobiliário, educação)",
    "Marketing e comercial em silos — sem reunião de dados compartilhados",
    "Escalar budget antes de validar processo comercial",
  ]),

  cta({
    title: "Quer um funil de aquisição desenhado para o seu negócio?",
    description:
      "No Programa de Crescimento Raise One, construímos funil integrado: campanhas, landing pages, CRM e automações — não peças soltas.",
    primaryLabel: "Conhecer o Programa",
    primaryHref: "/programa-de-crescimento",
    secondaryLabel: "Ver tecnologia e integrações",
    secondaryHref: "/tecnologia",
  }),
];

const faq = [
  {
    question: "Qual etapa do funil devo otimizar primeiro?",
    answer:
      "Identifique onde a maior queda percentual acontece entre etapas adjacentes. Na prática, gargalos mais comuns são conversão de LP (consideração → conversão) e follow-up comercial (conversão → venda). Corrija tracking antes de qualquer otimização — sem dados confiáveis, você otimiza no escuro.",
  },
  {
    question: "Funil de aquisição funciona para negócios B2B?",
    answer:
      "Sim, com ciclos mais longos e mais touchpoints de consideração. B2B exige nutrição por conteúdo, remarketing persistente e CRM robusto. Benchmarks de conversão LP tendem a ser menores (1–3%), mas tickets mais altos compensam — desde que CAC < LTV/3.",
  },
  {
    question: "Preciso de todas as 5 etapas ativas desde o dia 1?",
    answer:
      "Não. Comece mapeando conversão e venda — são etapas que geram receita imediata. Awareness e retenção escalam conforme maturidade. Mas documente todas desde o início para não construir dependência excessiva de um único canal.",
  },
  {
    question: "Como conectar Google Ads ao CRM na prática?",
    answer:
      "Use UTMs padronizados em todos os anúncios, GTM para capturar envio de formulário, integração nativa ou via Zapier/Make entre formulário/WhatsApp e CRM. Opcionalmente, importe conversões offline (vendas fechadas) de volta ao Google Ads para otimização por receita.",
  },
  {
    question: "Qual a diferença entre funil de aquisição e jornada do cliente?",
    answer:
      "Funil de aquisição foca em como novos clientes entram e geram primeira receita. Jornada do cliente inclui experiência pós-compra completa — onboarding, suporte, expansão. Retenção é ponte entre os dois conceitos; aquisição bem feita reduz CAC de recompra.",
  },
];

export const funilDeAquisicaoGuia: BlogArticle = {
  slug,
  title: "O que é um funil de aquisição e como construir o seu",
  excerpt:
    "Funil não é jargão de marketing — é o mapa de como estranhos viram clientes. Guia completo com 5 etapas, benchmarks, CRM e fluxo Google Ads → WhatsApp.",
  category: "growth",
  type: "guia",
  pillar: "funil",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-02-28",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  featuredImage: blogFeatured(slug),
  targetKeywords: [
    "funil de aquisição",
    "como construir funil de vendas",
    "funil marketing digital",
    "métricas funil conversão",
  ],
  seo: {
    title: "Guia: Funil de aquisição completo | Raise One",
    description:
      "Aprenda a construir um funil de aquisição: awareness, consideração, conversão, venda e retenção — com benchmarks, CRM e fluxo prático integrado.",
  },
  sections,
  faq,
  relatedSlugs: [
    "landing-page-vs-site-institucional",
    "crm-para-negocios-em-crescimento",
    "5-erros-trafego-pago",
  ],
  relatedLinks: [
    {
      label: "Programa de Crescimento",
      href: "/programa-de-crescimento",
      type: "solution",
      description: "Funil integrado com campanhas, LP, CRM e automações.",
    },
    {
      label: "Case Studio 21",
      href: "/cases/studio21",
      type: "case",
      description: "Funil digital para salão premium — 180+ conversões em 90 dias.",
    },
    {
      label: "Tecnologia",
      href: "/tecnologia",
      type: "solution",
      description: "CRM, automações, dashboards e integrações Raise One.",
    },
  ],
};
