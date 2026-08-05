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

const slug = "como-estruturar-campanhas-google-ads";

const sections = [
  p(
    "Você investe em Google Ads, os cliques chegam, o telefone até toca — mas o comercial reclama que os leads 'não prestam', o financeiro não consegue calcular retorno e ninguém sabe qual campanha merece mais budget. Esse cenário não é falta de tráfego. É falta de estrutura. A maioria das contas que auditamos mistura intenções diferentes na mesma campanha, manda tráfego pago para homepage genérica e trata conversão de formulário como se fosse venda fechada. O resultado é previsível: CPC alto, CPL instável e sensação de que 'Google Ads não funciona para o nosso segmento'. Funciona — quando a arquitetura da conta reflete como seu cliente ideal busca, decide e entra em contato.",
  ),
  p(
    "Este guia é para donos de clínicas, imobiliárias, instituições de ensino e negócios de serviços que já gastam (ou estão prestes a gastar) com mídia paga e precisam transformar investimento em pipeline comercial mensurável. Não vamos falar de 'hacks' de lance nem prometer ROAS mágico. Vamos mapear a anatomia de uma campanha que converte, como organizar Search, Performance Max e Remarketing na mesma conta sem cannibalizar budget, e o que muda na prática para cada vertical. No final, um checklist de dez pontos e um case real da UNIP Caraguatatuba — educação, mercado competitivo, ciclo de decisão longo — que mostra o que muda quando campanha, landing page e mensuração trabalham como sistema.",
  ),

  h2("A dor real: tráfego sem arquitetura", "dor-real"),
  p(
    "Antes de abrir o Google Ads, vale nomear o problema que a estrutura precisa resolver. Seu ICP — Ideal Customer Profile — não pesquisa 'sua empresa'. Pesquisa o problema, compara alternativas e só então decide com quem falar. Uma clínica de estética recebe buscas como 'harmonização facial preço zona sul'; uma imobiliária, 'apartamento 2 quartos itanhaém financiamento'; uma faculdade EAD, 'administração ead valor mensalidade'. Cada termo carrega um estágio de intenção diferente. Quando tudo cai na mesma campanha com anúncio genérico e landing page institucional, você paga pelo clique mais caro possível e entrega a pior experiência possível.",
  ),
  p(
    "A dor operacional aparece em três frentes. Marketing celebra volume de leads enquanto vendas diz que 'não convertem'. Financeiro não consegue responder quanto custou adquirir um cliente — só sabe o CPL. E gestão fica refém de agência ou analista que fala em impressões e CTR, mas não conecta clique a matrícula, contrato ou procedimento fechado. Estruturar campanhas é, antes de tudo, alinhar linguagem de busca, promessa do anúncio e página de destino ao momento exato em que o prospecto está pronto para agir.",
  ),
  callout(
    "Campanha bem estruturada não começa por keywords — começa por intenção comercial. Keyword é consequência do mapa de intenção, não ponto de partida.",
    "Princípio Raise One",
  ),

  h2("Anatomia de uma campanha que gera leads qualificados", "anatomia"),
  p(
    "Pense em cada campanha como um funil em miniatura com cinco camadas interdependentes. Ignorar qualquer uma delas compromete as outras — e explica por que contas 'bonitas' no painel performam mal na receita.",
  ),
  h3("1. Objetivo comercial claro"),
  p(
    "Toda campanha responde a uma pergunta: o que deve acontecer quando alguém clica? Agendar avaliação, solicitar visita ao imóvel, baixar grade curricular ou iniciar conversa no WhatsApp. Objetivo vago ('gerar tráfego') produz otimização vaga. Configure conversões primárias alinhadas ao objetivo — não apenas pageview ou clique no telefone sem contexto.",
  ),
  h3("2. Segmentação por intenção e oferta"),
  p(
    "Agrupe keywords, públicos ou sinais de audiência por serviço, região e estágio de decisão. Campanha de 'marca' protege buscas pelo nome da empresa; campanha transacional captura quem quer contratar agora; campanha comparativa intercepta quem avalia opções. Misturar intenções na mesma campanha força o algoritmo a otimizar para a média — e a média quase sempre puxa para termos baratos e desqualificados.",
  ),
  h3("3. Anúncios espelhando a busca"),
  p(
    "RSA (Responsive Search Ads) bem escritos repetem a intenção da keyword nos headlines, antecipam objeções nos descriptions e incluem extensões relevantes: sitelinks para serviços específicos, callouts de diferencial, extensão de formulário ou WhatsApp quando aplicável. Regra prática: se o anúncio pudesse servir para qualquer concorrente da categoria, está genérico demais.",
  ),
  h3("4. Landing page dedicada"),
  p(
    "Cada campanha (ou grupo de campanhas com mesma oferta) aponta para uma landing page com headline coerente ao anúncio, prova social do serviço específico, formulário enxuto e CTA único. Homepage institucional dilui atenção: menu, blog, múltiplos serviços, links para redes sociais. Benchmark interno Raise One: LPs dedicadas convertem de 3 a 5 vezes mais que homepage em tráfego pago.",
  ),
  h3("5. Tracking até o CRM"),
  p(
    "Conversão no Google Ads é o primeiro evento, não o último. Integre GTM, GA4, conversões importadas e CRM para saber qual campanha, grupo de anúncios e keyword gerou lead qualificado e, depois, cliente. Sem essa camada, otimização fica presa em CPL — métrica útil, mas insuficiente para escalar com segurança.",
  ),
  img(
    blogInline(slug, 1),
    "Diagrama da anatomia de uma campanha Google Ads: intenção, anúncio, landing page, conversão e CRM",
    "Cada camada da campanha precisa estar alinhada à intenção de busca do ICP",
  ),

  h2("Estrutura de conta: Search, Performance Max e Remarketing", "estrutura-conta"),
  p(
    "Conta organizada não é conta cheia de campanhas — é conta onde cada tipo de campanha tem papel definido e budget proporcional ao impacto comercial. A estrutura abaixo funciona para a maioria dos negócios de serviços locais e regionais que operamos.",
  ),
  h3("Search — captura de intenção ativa"),
  p(
    "Campanhas de Search são o núcleo para quem tem volume de busca comprovado. Separe por camadas: Brand (nome da empresa e variações), Serviços transacionais (termos com 'preço', 'agendar', 'contratar', 'matrícula'), Serviços comparativos ('melhor', 'perto de mim', 'avaliação') e, se fizer sentido, Concorrentes (com cuidado legal e estratégico). Use correspondência de frase e exata para termos de alta intenção; ampla com inteligente apenas onde há budget e tempo para negativar termos irrelevantes semanalmente.",
  ),
  p(
    "Estrutura de ad groups: um serviço principal por grupo, com 5–15 keywords semanticamente próximas e 2–3 RSAs testando ângulos diferentes (preço, autoridade, urgência, localização). Negativas compartilhadas em listas por tema — emprego, gratuito, DIY, concorrentes irrelevantes — evitam vazamento de budget.",
  ),
  h3("Performance Max — escala com sinais fortes"),
  p(
    "PMax não substitui Search bem estruturado; complementa quando você tem criativos sólidos, feed de conversões confiável e assets de qualidade. Use PMax para remarketing amplificado, descoberta de novos públicos semelhantes aos convertidos e presença em Discover, YouTube e Display — sempre com URL final específica ou página de destino agrupada por oferta. Sem conversões suficientes (ideal: 30+ conversões primárias por mês na conta), PMax tende a otimizar para volume, não qualidade.",
  ),
  table(
    ["Tipo de campanha", "Quando usar", "Budget sugerido", "KPI principal"],
    [
      ["Search Brand", "Proteger nome e variações", "5–10% do total", "Impression share > 90%"],
      ["Search Transacional", "Capturar intenção de compra", "50–60% do total", "CPL qualificado / ROAS"],
      ["Search Comparativo", "Meio do funil", "15–20% do total", "Taxa de conversão LP"],
      ["PMax", "Escala + remarketing", "15–25% do total", "Conversões incrementais"],
      ["Remarketing Search/Display", "Recuperar visitantes", "5–10% do total", "CPA vs aquisição fria"],
    ],
  ),
  h3("Remarketing — reconquistar quem já demonstrou interesse"),
  p(
    "Remarketing captura quem visitou LP, iniciou formulário ou interagiu com anúncio mas não converteu. Segmentos úteis: visitantes últimos 7 dias (urgência alta), visitantes 8–30 dias (nutrição), visitantes de páginas específicas (serviço X vs serviço Y). Mensagem de remarketing não repete o anúncio frio — reforça prova social, oferece facilidade ('agende em 2 minutos') ou remove objeção ('avaliação gratuita'). Integre remarketing com CRM: se lead entrou no pipeline mas não fechou, audiência de lista personalizada no Google pode reativá-lo com copy diferente.",
  ),
  callout(
    "Regra de ouro: nunca deixe PMax e Search competirem pelo mesmo termo transacional sem monitorar relatório de termos de pesquisa e impression share. Cannibalização silenciosa é um dos maiores drenos de budget que vemos em auditorias.",
  ),

  h2("Exemplos por vertical: clínica, imobiliária e educação", "exemplos-verticais"),
  p(
    "A lógica estrutural é a mesma; o que muda são keywords, objeções, ciclo de venda e critérios de qualificação. Veja como adaptamos a arquitetura para três segmentos recorrentes.",
  ),
  h3("Clínica e estética"),
  p(
    "ICP busca procedimento + localização + sinal de decisão ('preço', 'antes e depois', 'agendar'). Campanhas separadas por procedimento de alto ticket (harmonização, implante, lipo) e procedimento de entrada (limpeza de pele, avaliação). LP com fotos reais, depoimentos do procedimento específico e formulário pedindo objetivo + melhor horário. Qualificação comercial: orçamento, urgência, histórico médico básico. Negativas agressivas para 'curso', 'como fazer em casa', 'grátis'. Remarketing com cases visuais performa especialmente bem.",
  ),
  ul([
    "Keywords transacionais: 'botox preço [bairro]', 'agendar avaliação dermatológica'",
    "Extensões: WhatsApp, sitelink para cada procedimento, callout 'Equipe médica especializada'",
    "Conversão primária: formulário + clique WhatsApp com evento diferenciado no GTM",
    "CRM: tag automática por procedimento de interesse",
  ]),
  h3("Imobiliária e incorporadora"),
  p(
    "Busca imobiliária mistura intenção de compra, aluguel e curiosidade de mercado. Separe campanhas por empreendimento ou tipologia (2 quartos, lançamento, minha casa minha vida) e por região. LP com planta, tabela de disponibilidade, simulador de financiamento e CTA para visita ou contato com corretor. Ciclo longo exige remarketing persistente e integração com CRM imobiliário: lead que visitou planta do empreendimento A não deve receber anúncio genérico da imobiliária — deve ver unidades disponíveis e condições atualizadas.",
  ),
  ul([
    "Keywords: 'apartamento [cidade] financiamento', 'lançamento [bairro] 2026'",
    "PMax com feed de imagens do empreendimento e vídeo walkthrough",
    "Conversão secundária: download de tabela de preços (lead morno)",
    "Qualificação: renda, prazo de compra, preferência de região",
  ]),
  h3("Educação e captação de alunos"),
  p(
    "Educação tem sazonalidade (vestibular, rematrícula, campanhas de meio de ano) e concorrência agressiva em EAD. Estruture campanhas por curso e modalidade (presencial, EAD, pós). LP focada em grade, mercado de trabalho, mensalidade e processo de matrícula — não homepage com dezenas de cursos. Conversão pode ser lead para consultor educacional ou inscrição em processo seletivo. Integração com secretaria via WhatsApp é crítica: atraso de resposta acima de 30 minutos derruba taxa de matrícula independentemente da qualidade do anúncio.",
  ),
  linkCard({
    label: "UNIP Caraguatatuba — Case completo",
    href: "/cases/unip",
    type: "case",
    description:
      "Como estruturamos landing page, Google Ads e mensuração para captação previsível de alunos em 30 dias.",
  }),

  h2("Case UNIP: de demanda espontânea a canal previsível", "case-unip"),
  p(
    "O polo UNIP EAD em Caraguatatuba tinha demanda — indicação, Instagram, rádio — mas zero previsibilidade. Não havia controle sobre quantos interessados chegariam na próxima semana, qual canal performava ou quanto custava gerar uma conversa qualificada. Em 30 dias, implementamos um sistema integrado: campanhas Google Ads segmentadas por curso e intenção, landing page dedicada substituindo dispersão em canais offline, tracking de conversões do clique ao WhatsApp e acompanhamento semanal com a secretaria.",
  ),
  p(
    "A estrutura de conta priorizou Search transacional para cursos com maior procura local e remarketing para visitantes que não converteram na primeira visita. A LP recebeu 100% do tráfego pago — eliminando vazamento para páginas genéricas. Resultado do primeiro ciclo: mais de 90 conversões registradas, 300+ novos visitantes qualificados e, principalmente, visibilidade sobre o que funcionava. Como disse o próprio polo: 'A procura aumentou consideravelmente' — e pela primeira vez era possível medir de onde vinha.",
  ),
  quote(
    "Esperar alguém aparecer não é estratégia de crescimento. Marketing estruturado transforma demanda esporádica em pipeline.",
    "Raise One",
  ),
  img(
    blogInline(slug, 0),
    "Estrutura de campanhas Google Ads aplicada ao case UNIP Caraguatatuba",
    "Campanha + LP + WhatsApp + secretaria: o fluxo completo de captação educacional",
  ),

  h2("Checklist: 10 pontos antes de escalar budget", "checklist"),
  p(
    "Use esta lista antes de aumentar investimento ou abrir novas campanhas. Cada item existe porque já vimos budget queimado por ignorá-lo.",
  ),
  ol([
    "Mapa de intenção documentado: transacional, comparativo e informacional separados",
    "Campanhas Search organizadas por serviço/região — nada de 'campanha geral'",
    "Landing page dedicada por oferta principal, mobile-first, carregamento < 3s",
    "Conversões primárias configuradas no Google Ads e validadas no GA4",
    "GTM implementado com eventos de formulário, WhatsApp e scroll depth",
    "Integração CRM: origem do lead, campanha e keyword registrados automaticamente",
    "Listas de negativas compartilhadas e revisão semanal de termos de pesquisa",
    "Remarketing ativo para visitantes de LP dos últimos 30 dias",
    "Relatório semanal conectando CPL → taxa de qualificação → taxa de fechamento",
    "Processo comercial definido: SLA de resposta, script de qualificação, follow-up",
  ]),
  callout(
    "Se você marcou menos de 7 itens, o problema provavelmente não é budget insuficiente — é infraestrutura incompleta. Escalar campanha sobre base frágil multiplica desperdício.",
    "Antes de escalar",
  ),

  h2("Cadência de otimização: o que fazer semana a semana", "otimizacao"),
  p(
    "Campanha estruturada não é projeto com data de entrega — é sistema vivo. Semanas 1–2: fase de aprendizado. Evite mudanças drásticas; monitore termos de pesquisa, CTR por anúncio e taxa de conversão da LP. Semanas 3–4: primeira rodada de negativas, ajuste de lances em keywords com CPL acima da meta e teste A/B de headline no anúncio vencedor. Mês 2: teste de LP alternativa (prova social vs urgência vs oferta), expansão controlada de keywords transacionais comprovadas e revisão de budget entre campanhas baseada em ROAS ou CPL qualificado — não impressões.",
  ),
  p(
    "Mensalmente, reunião de marketing + comercial para cruzar dados: quais campanhas geraram leads que fecharam? Quais geraram curiosos? Ajuste mensagens, formulários e critérios de qualificação com base em feedback do time de vendas — não apenas em métricas de plataforma.",
  ),

  cta({
    title: "Sua conta Google Ads está estruturada para escalar?",
    description:
      "No diagnóstico Raise One, analisamos sua conta, landing pages e integração com CRM — e mostramos onde o budget está vazando.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Ver solução Google Ads",
    secondaryHref: "/solucoes/google-ads",
  }),

  linkCard({
    label: "Captação de alunos com Google Ads",
    href: "/educacao",
    type: "segment",
    description: "Estratégias específicas para instituições de ensino e polos EAD.",
  }),
];

const faq = [
  {
    question: "Quanto budget mínimo para estruturar campanhas Google Ads?",
    answer:
      "Para serviços locais, recomendamos a partir de R$ 3.000/mês para gerar volume estatístico suficiente em Search transacional — abaixo disso, campanhas demoram a sair da fase de aprendizado e otimização fica limitada. Contas menores podem começar focadas em um único serviço de alto ticket e expandir conforme ROI comprovado.",
  },
  {
    question: "Performance Max substitui campanhas de Search?",
    answer:
      "Não. PMax complementa Search quando há conversões suficientes e criativos fortes. Search continua sendo o canal de maior controle sobre keywords e intenção. Use PMax para remarketing, descoberta e presença multicanal — monitorando overlap via relatórios de termos de pesquisa.",
  },
  {
    question: "Preciso de landing page separada para cada campanha?",
    answer:
      "Para cada oferta principal, sim. Campanhas distintas podem compartilhar a mesma LP se a promessa e o serviço forem idênticos — mas nunca direcione tráfego pago para homepage institucional. A coerência anúncio → página é fator direto de Quality Score e taxa de conversão.",
  },
  {
    question: "Como saber se o lead veio qualificado ou não?",
    answer:
      "Configure eventos de conversão diferenciados (formulário completo vs clique WhatsApp), integre com CRM e defina critérios de qualificação com o comercial: orçamento, urgência, fit de serviço. CPL baixo com taxa de fechamento baixa indica problema de segmentação ou expectativa criada pelo anúncio — não sucesso.",
  },
  {
    question: "Quanto tempo até ver resultados consistentes?",
    answer:
      "Primeiras conversões costumam aparecer em 7–14 dias com Search transacional. Consistência estatística para otimização segura leva 4–6 semanas. Ciclos longos (imobiliário, educação) exigem remarketing e acompanhamento comercial por 60–90 dias antes de julgar ROI completo.",
  },
];

export const comoEstruturarCampanhasGoogleAds: BlogArticle = {
  slug,
  title: "Como estruturar campanhas de Google Ads que geram leads qualificados",
  excerpt:
    "Campanha bem estruturada não é sobre keywords — é sobre intenção, landing page e tracking integrado ao CRM. Guia completo com exemplos por vertical.",
  category: "google-ads",
  type: "guia",
  pillar: "aquisicao",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-03-10",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  featuredImage: blogFeatured(slug),
  segments: ["clinica", "imobiliaria", "educacao"],
  targetKeywords: [
    "estruturar campanhas google ads",
    "google ads leads qualificados",
    "estrutura conta google ads",
    "campanhas search performance max",
  ],
  seo: {
    title: "Guia: Campanhas Google Ads para leads qualificados | Raise One",
    description:
      "Aprenda a estruturar campanhas de Google Ads com segmentação por intenção, Search, PMax, remarketing, landing pages e tracking até o CRM.",
  },
  sections,
  faq,
  relatedSlugs: [
    "meta-ads-vs-google-ads",
    "landing-page-vs-site-institucional",
    "google-ads-captacao-alunos",
  ],
  relatedLinks: [
    {
      label: "Diagnóstico gratuito",
      href: "/diagnostico",
      type: "solution",
      description: "Analise sua conta e identifique gargalos de conversão.",
    },
    {
      label: "Solução Google Ads",
      href: "/solucoes/google-ads",
      type: "solution",
      description: "Campanhas estruturadas com mensuração até o fechamento.",
    },
    {
      label: "Educação",
      href: "/educacao",
      type: "segment",
      description: "Captação de alunos com mídia paga e funil integrado.",
    },
    {
      label: "Case UNIP Caraguatatuba",
      href: "/cases/unip",
      type: "case",
      description: "Landing page, Google Ads e mensuração em 30 dias.",
    },
  ],
};
