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

const slug = "google-ads-clinicas-estetica";

const sections = [
  p("Clínicas de estética e harmonização facial operam em mercado altamente competitivo e regulado. Pacientes pesquisam procedimentos, preços, avaliações e localização antes de agendar a primeira consulta. Google Ads posiciona sua clínica exatamente nesse momento — mas campanha genérica de 'estética' gera cliques caros de curiosos, não pacientes prontos para procedimento."),
  p("Captação eficiente em estética combina três pilares: segmentação por intenção e procedimento, keywords locais com raio geográfico preciso, e conformidade com LGPD em landing pages e formulários. Clínicas que ignoram qualquer um desses pilares queimam budget e expõem dados sensíveis de pacientes."),
  img(
    blogInline(slug, 0),
    "Google Ads para clínicas de estética e harmonização facial",
    "Campanhas locais por procedimento aumentam agendamentos qualificados.",
  ),
  h2("Por que clínicas de estética precisam de Google Ads local"),
  p("Procedimentos estéticos têm ciclo de decisão curto a médio: paciente pesquisa, compara clínicas, lê reviews e agenda. A busca acontece no Google — 'botox zona sul', 'harmonização facial preço', 'clínica estética perto de mim'. SEO orgânico leva meses; Google Ads captura demanda imediata enquanto sua presença orgânica amadurece."),
  ul([
    "Alta intenção transacional em termos com 'preço', 'agendar', 'avaliação gratuita'",
    "Decisão influenciada por proximidade — paciente prefere clínica acessível",
    "Sazonalidade: verão, festas, datas comemorativas elevam volume de busca",
    "Concorrência agressiva em centros urbanos exige posicionamento pago estratégico",
  ]),
  h2("Estrutura de campanhas por procedimento e intenção"),
  p("Separe campanhas por procedimento ou linha de serviço: botox, preenchimento, harmonização facial, corporal, laser, skin care avançado. Cada campanha com ad groups por intenção — transacional, comparativa e informacional (esta última melhor via SEO ou conteúdo)."),
  h3("Campanhas transacionais"),
  p("Keywords como 'botox preço [bairro]', 'agendar harmonização facial', 'clínica estética [cidade]'. Anúncios com extensões de local, telefone e snippets estruturados. Landing page dedicada ao procedimento com fotos reais (com consentimento), faixa de investimento e CTA de agendamento."),
  h3("Campanhas comparativas"),
  p("Termos como 'melhor clínica botox sp', 'harmonização facial vale a pena'. Funcionam com landing educativa + formulário de avaliação gratuita. Remarketing reconecta visitantes que não agendaram — fundamental em estética, onde decisão pode levar 3 a 14 dias."),
  callout(
    "Nunca misture procedimentos de ticket alto (harmonização completa) com procedimentos de entrada (limpeza de pele) na mesma campanha. Budget e mensagem ficam desalinhados com intenção real do paciente.",
    "Dica Raise One",
  ),
  h2("Keywords locais: como dominar sua região"),
  p("Estética é negócio local. Estratégia de keywords deve refletir como pacientes buscam na sua cidade:"),
  ol([
    "Inclua bairro, zona e cidade: 'estética moema', 'botox pinheiros', 'clínica estética campinas'",
    "Use raio de alcance no Google Ads alinhado à distância que pacientes aceitam viajar",
    "Configure extensões de local e Google Business Profile otimizado com fotos e reviews",
    "Crie landing pages com endereço, mapa, estacionamento e referências locais",
    "Negativar cidades fora da área de atendimento para evitar cliques irrelevantes",
  ]),
  p("Clínicas com múltiplas unidades devem ter campanhas separadas por localização — cada uma com budget, keywords locais e landing page da unidade. Centralizar tudo em campanha única dilui performance e confunde relatórios."),
  table(
    ["Tipo de keyword", "Exemplo", "Intenção"],
    [
      ["Hiperlocal", "botox vila olímpia", "Alta — pronta para agendar"],
      ["Cidade + procedimento", "harmonização facial curitiba", "Alta a média"],
      ["Preço", "quanto custa preenchimento labial", "Média — comparando opções"],
      ["Informacional", "o que é bioestimulador", "Baixa — nutrir via SEO"],
    ],
  ),
  h2("LGPD: conformidade em campanhas e landing pages"),
  p("Clínicas lidam com dados sensíveis de saúde. Captação via Google Ads exige atenção redobrada à Lei Geral de Proteção de Dados. Formulários, cookies, remarketing e integrações com CRM devem respeitar bases legais e consentimento informado."),
  h3("Checklist LGPD para captação estética"),
  ul([
    "Política de privacidade clara e acessível na landing page e no site",
    "Checkbox de consentimento explícito antes de enviar formulário — sem pré-marcação",
    "Finalidade declarada: 'Seus dados serão usados para agendamento e contato comercial'",
    "Cookie banner com opção de recusa para cookies não essenciais",
    "Remarketing apenas para quem consentiu — segmentos de remarketing respeitando opt-in",
    "CRM com controle de acesso, logs e possibilidade de exclusão de dados (direito do titular)",
    "Evitar copy sensível em anúncios que exponha condição de saúde do usuário",
  ]),
  p("Dados de formulário (nome, telefone, procedimento de interesse) devem trafegar via conexão segura (HTTPS) e ser armazenados em plataforma com políticas de segurança adequadas. Compartilhar leads com terceiros sem consentimento específico viola LGPD e expõe a clínica a sanções."),
  callout(
    "Remarketing com copy do tipo 'Volte para terminar seu agendamento de botox' pode ser eficiente comercialmente, mas exige consentimento de cookies de marketing e política de privacidade atualizada.",
    "Conformidade",
  ),
  h2("Landing pages que convertem pacientes"),
  p("Landing page de clínica estética deve transmitir confiança, resultados e facilidade de agendamento. Elementos essenciais:"),
  ul([
    "Antes e depois reais com termo de consentimento de imagem",
    "Credenciais: CRM, especializações, certificações, anos de experiência",
    "Depoimentos em vídeo ou texto com nome e procedimento",
    "Transparência de investimento: faixa de preço ou 'a partir de'",
    "Formulário curto + botão WhatsApp para agendamento imediato",
    "Prova de localização: endereço, fotos do consultório, estacionamento",
  ]),
  linkCard({
    label: "Segmento Estética",
    href: "/estetica",
    type: "segment",
    description: "Estratégias de captação e presença digital para clínicas de estética e harmonização.",
  }),
  h2("Tracking, qualificação e follow-up comercial"),
  p("Configure conversão de 'agendamento solicitado' no Google Ads e integre com CRM ou sistema de agenda. Lead que não recebe retorno em 15 minutos no WhatsApp esfria rapidamente — automação de confirmação e lembrete aumenta taxa de comparecimento."),
  p("Métricas que importam: CPL (custo por lead), taxa lead → consulta realizada, taxa consulta → procedimento fechado, CAC por procedimento. Otimizar campanha por procedimento mais rentável, não apenas por volume de leads."),
  h2("Erros comuns em clínicas de estética"),
  ul([
    "Campanha genérica 'estética' sem segmentação por procedimento",
    "Ignorar keywords locais e competir nacionalmente sem necessidade",
    "Formulário sem consentimento LGPD ou política de privacidade",
    "Direcionar tráfego para Instagram ou homepage em vez de landing dedicada",
    "Não negativar termos irrelevantes ('curso botox', 'vaga esteticista')",
    "Follow-up manual inconsistente — leads perdidos para concorrência",
  ]),
  cta({
    title: "Analise o potencial da sua clínica",
    description:
      "Diagnóstico gratuito mapeia concorrência local, volume de busca por procedimento e oportunidades de captação na sua região.",
    primaryLabel: "Fazer diagnóstico gratuito",
    primaryHref: "/diagnostico",
    secondaryLabel: "Ver segmento estética",
    secondaryHref: "/estetica",
  }),
  p("Google Ads para clínicas de estética não é sobre volume de cliques — é sobre pacientes qualificados, agendamentos confirmados e conformidade em cada etapa do funil. Estrutura correta transforma mídia paga em agenda preenchida com previsibilidade."),
  h2("Extensões e recursos de campanha para clínicas"),
  p("Além de keywords locais, explore recursos específicos do Google Ads para negócios de saúde e estética. Extensões de local conectam anúncio ao Google Business Profile — essencial quando paciente busca 'perto de mim'. Extensões de chamada permitem agendamento imediato via mobile. Snippets estruturados destacam diferenciais: 'Especialista CRM', 'Avaliação gratuita', 'Parcelamento disponível'."),
  p("Campanhas Performance Max com feed de serviços e fotos reais do consultório expandem alcance em YouTube, Discover e Gmail — útil para procedimentos visuais como harmonização e skin care. Monitore relatório de placements para evitar exibição em contextos irrelevantes."),
  h2("Gestão de reviews e reputação local"),
  p("Pacientes de estética leem reviews antes de agendar. Clínica com 4,7+ estrelas e volume consistente de avaliações converte significativamente mais — tanto organicamente quanto em campanhas pagas. Integre pedido de review pós-procedimento ao fluxo comercial. Responda avaliações negativas com profissionalismo e oferta de resolução — silêncio amplifica dano reputacional."),
  p("Copy de anúncio pode referenciar avaliação quando verídica ('4,9 estrelas no Google — 120 avaliações'). Nunca invente números — políticas do Google e credibilidade com paciente exigem transparência."),
  h2("Sazonalidade e calendário de campanhas estéticas"),
  p("Demanda por procedimentos estéticos segue padrões previsíveis. Verão e pré-festas elevam busca por corporais e skin care. Retorno de férias e início de ano impulsionam harmonização facial e botox. Dia das Mães e Dia dos Namorados funcionam para vouchers e pacotes presenteáveis. Antecipe budget 3–4 semanas antes de cada pico — CPC sobe quando todos reagem simultaneamente."),
  h2("Qualificação de leads estéticos no comercial"),
  p("Nem todo lead de Google Ads está pronto para procedimento de ticket alto. Score inicial no CRM pode considerar: procedimento de interesse, faixa etária declarada, histórico de resposta no WhatsApp e origem da campanha. Leads de procedimentos de entrada (limpeza de pele, avaliação) entram em nurturing; leads de harmonização completa vão direto para consultor sênior. Segmentação comercial evita que time trate todos os leads igualmente — principal causa de baixa taxa de fechamento apesar de CPL baixo."),
];

const faq = [
  {
    question: "Quanto investir em Google Ads para clínica de estética?",
    answer:
      "Depende do ticket médio e concorrência local. Clínicas iniciantes costumam começar com R$ 3.000 a R$ 8.000/mês por unidade, escalando conforme CPL e taxa de conversão comercial se estabilizam. Procedimentos de ticket alto (harmonização) toleram CPL maior que procedimentos de entrada.",
  },
  {
    question: "Posso usar fotos de antes e depois nos anúncios?",
    answer:
      "Sim, com consentimento formal do paciente e respeito às políticas do Google Ads para conteúdo sensível. Evite promessas absolutas ou imagens retocadas de forma enganosa. Anúncios com resultados reais tendem a performar melhor que stock photos genéricas.",
  },
  {
    question: "Como lidar com LGPD em formulários de captação?",
    answer:
      "Inclua checkbox de consentimento não pré-marcado, link para política de privacidade, finalidade clara do uso dos dados e base legal (consentimento ou legítimo interesse conforme orientação jurídica). Integre CRM com controles de acesso e processo para exclusão de dados quando solicitado.",
  },
  {
    question: "Google Ads ou Meta Ads para clínica estética?",
    answer:
      "Ambos complementam. Google captura intenção ativa ('botox preço perto de mim'). Meta gera demanda via conteúdo visual (antes/depois, depoimentos). Clínicas maduras combinam Google para fundo de funil e Meta para awareness e remarketing.",
  },
  {
    question: "Quais keywords locais funcionam melhor?",
    answer:
      "Combinações de procedimento + bairro/cidade: 'harmonização facial moema', 'botox alphaville', 'clínica estética [sua cidade]'. Termos 'perto de mim' crescem em mobile — otimize extensões de local e Google Business Profile.",
  },
];

export const googleAdsClinicasEstetica: BlogArticle = {
  slug,
  title: "Google Ads para clínicas de estética: guia de captação local e conformidade LGPD",
  excerpt:
    "Como estruturar campanhas Google Ads por procedimento e região, dominar keywords locais e manter conformidade LGPD em landing pages e formulários de clínicas estéticas.",
  category: "google-ads",
  type: "guia",
  readTime: estimateReadTime(sections, faq),
  publishedAt: "2026-07-15",
  modifiedAt: "2026-08-05",
  author: "Raise One",
  pillar: "aquisicao",
  segments: ["estetica", "clinica"],
  featuredImage: blogFeatured(slug),
  seo: {
    title: "Google Ads para clínicas de estética: guia local e LGPD | Raise One",
    description:
      "Guia de Google Ads para clínicas de estética: campanhas por procedimento, keywords locais, landing pages e conformidade LGPD na captação de pacientes.",
  },
  targetKeywords: [
    "google ads clínica estética",
    "marketing estética google ads",
    "captação pacientes estética",
    "keywords locais clínica estética",
    "LGPD marketing estética",
  ],
  relatedSlugs: [
    "como-estruturar-campanhas-google-ads",
    "seo-local-guia-completo",
    "landing-page-captacao-leads-elementos",
  ],
  relatedLinks: [
    { label: "Estética", href: "/estetica", type: "segment" },
    { label: "Diagnóstico", href: "/diagnostico", type: "solution" },
  ],
  sections,
  faq,
};
