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

const slug = "google-ads-captacao-alunos";

const sections = [
  p("Instituições de ensino competem por atenção em um mercado onde a decisão de matrícula começa no Google. Pais, estudantes e profissionais em transição de carreira pesquisam cursos, mensalidades, modalidades EAD e polos regionais antes de falar com qualquer consultor. Google Ads bem estruturado coloca sua instituição na frente dessa intenção — no momento exato em que a matrícula ainda está em aberto."),
  p("O erro mais comum no setor educacional é tratar campanhas como vitrine: anunciar a marca, direcionar para o site institucional e esperar que formulários genéricos convertam. Captação de alunos exige arquitetura diferente: segmentação por intenção de matrícula, landing pages por curso ou polo, tracking até a inscrição confirmada e integração com CRM comercial. Sem isso, budget vira clique caro sem matrícula atribuível."),
  img(
    blogInline(slug, 0),
    "Campanhas Google Ads para captação de alunos em instituições de ensino",
    "Estrutura de campanhas por curso, modalidade e região aumenta conversão em matrículas.",
  ),
  h2("Por que Google Ads funciona para captação de alunos"),
  p("Diferente de redes sociais, onde você interrompe o usuário, o Google captura demanda existente. Quando alguém busca 'curso de administração EAD preço', 'faculdade perto de mim' ou 'matrícula aberta 2026', a intenção já está formada. Campanhas de Search posicionam sua oferta nesse micro-momento decisório — antes que o candidato feche com a concorrência."),
  ul([
    "Intenção transacional: termos com 'matrícula', 'inscrição', 'vestibular', 'preço'",
    "Intenção comparativa: 'melhor faculdade', 'curso reconhecido MEC', 'EAD ou presencial'",
    "Intenção local: 'polo EAD Caraguatatuba', 'faculdade zona sul SP'",
    "Sazonalidade previsível: rematrícula, vestibular, início de semestre, campanhas de bolsa",
  ]),
  p("Instituições que estruturam campanhas por curso e região conseguem mensurar custo por lead qualificado e, com CRM integrado, custo por matrícula efetiva. Esse nível de clareza transforma marketing de centro de custo em motor de receita previsível."),
  h2("Estrutura de campanhas por intenção e curso"),
  p("Organize contas Google Ads em campanhas separadas por objetivo comercial. Misturar branding com captação transacional dilui budget e confunde o algoritmo de lances. A estrutura recomendada para educação segue três camadas:"),
  h3("1. Campanhas de captação direta (Search)"),
  p("Foco em keywords de alta intenção: matrícula, inscrição, valores, bolsas. Cada curso ou modalidade relevante (graduação, pós, técnico, EAD) deve ter ad group dedicado com anúncios espelhando a busca. Copy deve mencionar diferenciais concretos: reconhecimento MEC, flexibilidade de horário, polo próximo, processo simplificado de matrícula."),
  h3("2. Campanhas comparativas e remarketing"),
  p("Termos de consideração ('qual faculdade escolher', 'EAD vale a pena') funcionam melhor com landing pages educativas que capturam lead via e-book, simulador ou consultoria. Remarketing reconecta quem visitou página de curso sem converter — essencial em funis educacionais com ciclo de decisão de 2 a 6 semanas."),
  h3("3. Campanhas locais para polos e unidades"),
  p("Polos EAD e unidades presenciais precisam de campanhas geo-segmentadas. Raio de alcance, extensões de local e keywords com bairro ou cidade aumentam relevância. Pais e alunos buscam proximidade e suporte presencial — anunciar polo regional com landing dedicada converte significativamente mais que homepage genérica."),
  callout(
    "Regra prática: se o candidato clica em anúncio de 'Administração EAD' e cai em página genérica da instituição, você perde conversão. Cada curso merece landing page com formulário, benefícios e CTA de matrícula alinhados ao anúncio.",
    "Dica Raise One",
  ),
  h2("Landing pages que convertem candidatos em leads"),
  p("Landing page de captação educacional não é página institucional recortada. É página de conversão com um objetivo: transformar visitante em lead qualificado para o time comercial ou consultor educacional. Elementos essenciais:"),
  ol([
    "Headline espelhando a busca ou promessa do anúncio ('Matrículas abertas — Administração EAD')",
    "Prova social: depoimentos de alunos, selos MEC, número de formados ou avaliações",
    "Benefícios claros: duração, modalidade, investimento, bolsa ou condições especiais",
    "Formulário enxuto: nome, telefone, e-mail, curso de interesse — sem fricção desnecessária",
    "CTA visível acima da dobra e repetido após blocos de conteúdo",
    "WhatsApp ou chat para candidatos que preferem contato imediato",
  ]),
  p("Testes A/B de headline, formulário e prova social costumam elevar taxa de conversão entre 30% e 80% sem aumentar investimento em mídia. A landing page é onde campanha barata ou cara se define."),
  linkCard({
    label: "Case UNIP Caraguatatuba",
    href: "/cases/unip",
    type: "case",
    description:
      "Como estruturamos Google Ads, landing pages e SEO para captação de alunos no polo EAD — com foco em conversão regional.",
  }),
  h2("Tracking do clique à matrícula confirmada"),
  p("Medir formulário enviado não basta. Instituição madura em performance rastreia lead → contato → visita ao polo → matrícula. Configure conversões primárias e secundárias no Google Ads, eventos no Analytics e integração com CRM ou ERP acadêmico. Atribuição correta permite:"),
  ul([
    "Identificar quais cursos e keywords geram matrículas — não apenas leads",
    "Calcular CAC real por modalidade e região",
    "Realocar budget de campanhas caras para campanhas com ROI comprovado",
    "Negativar termos que geram cliques sem intenção de matrícula",
  ]),
  table(
    ["Métrica", "O que mede", "Benchmark educação"],
    [
      ["CPL", "Custo por lead capturado", "R$ 25–80 conforme curso e região"],
      ["Taxa lead → matrícula", "Eficiência comercial", "8–20% com follow-up estruturado"],
      ["CAC", "Custo por aluno matriculado", "Deve ser < 1/3 da receita do 1º semestre"],
      ["ROAS", "Retorno sobre investimento em mídia", "Varia por ticket e LTV do aluno"],
    ],
  ),
  h2("Orçamento, sazonalidade e escala"),
  p("Calendário acadêmico dita picos de demanda. Antecipe budget para janelas de vestibular, rematrícula e campanhas de bolsa. Primeiras duas semanas de campanha nova são fase de aprendizado — evite mudanças drásticas diárias. Após 30–50 conversões por ad group, otimize lances, teste criativos e expanda keywords vencedoras."),
  p("Escala saudável replica estrutura que funcionou em um curso para outros cursos e polos, sempre com landing dedicada. Copiar campanha sem adaptar copy e página para novo curso é erro frequente que degrada qualidade do lead."),
  h2("Erros que queimam budget em captação educacional"),
  ul([
    "Direcionar tráfego pago para site institucional com dezenas de distrações",
    "Campanha única com todos os cursos — impossível otimizar por intenção",
    "Formulário longo demais ou campos irrelevantes no primeiro contato",
    "Leads sem follow-up em 24h — candidato fecha com concorrente",
    "Ignorar termos locais e de polo para operações EAD regionais",
    "Otimizar por clique ou impressão em vez de conversão de matrícula",
  ]),
  linkCard({
    label: "Segmento Educação",
    href: "/educacao",
    type: "segment",
    description:
      "Veja como abordamos captação de alunos, matrículas e presença digital para escolas, cursos e polos EAD.",
  }),
  cta({
    title: "Descubra seu potencial de captação",
    description:
      "Diagnóstico gratuito analisa concorrência, volume de busca e oportunidades de matrícula na sua região.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Ver case UNIP",
    secondaryHref: "/cases/unip",
  }),
  h2("Integração com funil comercial e CRM"),
  p("Lead de Google Ads que cai em planilha ou e-mail genérico esfria em horas. CRM integrado distribui leads por curso, polo ou consultor, dispara automações de WhatsApp e e-mail, e registra etapas até matrícula. Marketing e comercial passam a falar a mesma língua — com dados, não achismo."),
  p("No Programa Raise One, estruturamos Google Ads, landing pages, CRM e automações como sistema único para instituições de ensino. Resultado: previsibilidade de leads, visibilidade do pipeline de matrículas e escala com controle de CAC."),
  h2("Keywords estratégicas por modalidade educacional"),
  p("Mapeamento de keywords deve refletir como candidatos buscam cada modalidade. Graduação presencial prioriza termos locais e de campus. EAD amplia raio geográfico mas exige reforço em 'polo', 'suporte presencial' e flexibilidade. Pós-graduação e MBA respondem a termos de carreira: 'MBA gestão preço', 'pós marketing digital EAD'. Cursos técnicos e profissionizantes convertem com keywords de empregabilidade: 'curso técnico enfermagem emprego', 'qualificação rápida'."),
  p("Ferramentas como Planejador de Palavras-chave do Google e dados de Search Console revelam volume e sazonalidade. Cruze com calendário acadêmico interno para antecipar picos — vestibular de inverno, rematrícula de junho, campanhas de bolsa de fim de ano. Budget alocado antes do pico custa menos que reação tardia quando concorrentes já dominam leilão."),
  h2("Extensões de anúncio que elevam CTR educacional"),
  ul([
    "Sitelinks: links diretos para cursos, processo de matrícula, bolsas e portal do aluno",
    "Snippets estruturados: destaque de diferenciais (MEC, nota ENADE, empregabilidade)",
    "Extensões de local: endereço do polo ou campus para buscas regionais",
    "Extensões de chamada: telefone do consultor educacional em horário comercial",
    "Extensões de preço: faixa de investimento por curso quando política comercial permite",
  ]),
  p("Anúncios com extensões completas ocupam mais espaço no SERP, elevam CTR e reduzem CPC efetivo. Copy do anúncio deve complementar extensões — não repetir informação que já aparece em sitelink."),
  h2("Remarketing educacional: reconquistar candidatos indecisos"),
  p("Ciclo de matrícula raramente é impulsivo. Candidato visita landing, compara instituições, consulta família e retorna dias depois — muitas vezes via busca orgânica ou direta. Remarketing garante que sua instituição permaneça presente durante consideração. Segmentos recomendados: visitou LP de curso X sem converter; iniciou formulário sem concluir; visitou página de bolsas; engajou com vídeo institucional."),
  p("Frequência de remarketing em educação deve ser moderada — excesso gera fadiga e percepção de spam. Três a cinco impressões por semana por segmento é referência inicial. Mensagem evolui conforme proximidade do deadline de matrícula: semana 1 educa, semana 3 reforça benefício, semana 4 cria urgência autêntica com vagas ou bolsas reais."),
];

const faq = [
  {
    question: "Quanto custa captar um aluno via Google Ads?",
    answer:
      "O CPL (custo por lead) em educação varia entre R$ 25 e R$ 80 dependendo do curso, região e concorrência. O CAC (custo por matrícula) depende da taxa de conversão comercial — tipicamente 8% a 20% com follow-up estruturado. O objetivo é manter CAC abaixo de um terço da receita do primeiro semestre.",
  },
  {
    question: "Google Ads funciona para EAD ou só presencial?",
    answer:
      "Funciona para ambos, com estratégias distintas. EAD exige campanhas nacionais ou regionais por polo, enfatizando flexibilidade e preço. Presencial beneficia de segmentação local, extensões de local e keywords com bairro ou cidade. Muitas instituições combinam campanhas por modalidade.",
  },
  {
    question: "Qual o prazo para ver resultados em campanhas educacionais?",
    answer:
      "Leads podem chegar nos primeiros dias após lançamento. Otimização consistente e matrículas atribuíveis exigem 4 a 8 semanas de dados, especialmente em funis com ciclo de decisão longo. Sazonalidade acadêmica também influencia volume e custo.",
  },
  {
    question: "Preciso de landing page separada para cada curso?",
    answer:
      "Sim, para campanhas de captação com budget relevante. Landing dedicada alinhada ao anúncio converte em média 3 a 5 vezes mais que homepage. Cursos com volume menor podem compartilhar LP segmentada por área (ex.: exactas, humanas, negócios).",
  },
  {
    question: "Como saber se a campanha gera matrícula e não só lead?",
    answer:
      "Integre Google Ads ao CRM ou sistema acadêmico. Registre origem do lead, acompanhe etapas comerciais e marque matrícula confirmada como conversão offline ou via API. Sem essa ponte, otimização fica limitada a formulários — não receita.",
  },
];

export const googleAdsCaptacaoAlunos: BlogArticle = {
  slug,
  title: "Google Ads para captação de alunos: guia completo para instituições de ensino",
  excerpt:
    "Como estruturar campanhas Google Ads por curso, modalidade e região — com landing pages, tracking até matrícula e integração comercial para escolas, faculdades e polos EAD.",
  category: "google-ads",
  type: "guia",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-07-10",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  pillar: "aquisicao",
  segments: ["educacao"],
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Google Ads para captação de alunos: guia completo | Raise One",
    description:
      "Guia prático de Google Ads para instituições de ensino: campanhas por curso, landing pages, tracking de matrículas e integração com CRM.",
  },
  targetKeywords: [
    "google ads captação de alunos",
    "marketing educacional google ads",
    "campanhas matrícula faculdade",
    "google ads EAD",
    "captação alunos paid media",
  ],
  relatedSlugs: [
    "como-estruturar-campanhas-google-ads",
    "landing-page-captacao-leads-elementos",
    "funil-de-aquisicao-guia",
  ],
  relatedLinks: [
    { label: "Case UNIP", href: "/cases/unip", type: "case" },
    { label: "Educação", href: "/educacao", type: "segment" },
    { label: "Diagnóstico", href: "/diagnostico", type: "solution" },
  ],
  sections,
  faq,
};
