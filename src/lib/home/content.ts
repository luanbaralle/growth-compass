import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Building2,
  Clapperboard,
  Code2,
  LineChart,
  Megaphone,
  Rocket,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

export interface HomeStat {
  value: string;
  label: string;
}

export interface HomeSolution {
  title: string;
  icon: LucideIcon;
  items: string[];
}

export interface HomeProject {
  name: string;
  description: string;
  tag: string;
  tagTone: "brand" | "blue";
  gradient: string;
  href?: string;
}

export interface HomeProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface HomeTechProduct {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface HomeFaqItem {
  question: string;
  answer: string;
}

export interface HomeNavGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const heroManifestoItems = [
  "Google Ads",
  "Meta Ads",
  "Landing Pages",
  "Sistemas Web",
  "Automações",
  "Inteligência Artificial",
  "SEO",
  "Estratégia",
  "Tecnologia",
  "Execução",
  "Otimização",
  "Performance",
  "Escala",
];

export const growthFlow = [
  { label: "Marketing Estratégico", icon: Megaphone },
  { label: "Leads Qualificados", icon: Users },
  { label: "CRM & Automação", icon: Workflow },
  { label: "Vendas & Relacionamento", icon: Target },
  { label: "Retenção & Encantamento", icon: Sparkles },
  { label: "Escala & Crescimento", icon: Rocket },
];

export const solutions: HomeSolution[] = [
  {
    title: "Aquisição de Clientes",
    icon: TrendingUp,
    items: ["Google Ads", "Meta Ads", "Landing Pages", "SEO", "Funis"],
  },
  {
    title: "Conteúdo que conecta",
    icon: Clapperboard,
    items: ["Social Media", "Vídeos", "Fotografia", "Eventos", "Institucional"],
  },
  {
    title: "Tecnologia sob medida",
    icon: Code2,
    items: ["Sites", "Sistemas", "Portais", "CRM", "Apps"],
  },
  {
    title: "Inteligência Artificial",
    icon: Bot,
    items: ["Agentes", "Automação", "Atendimento", "Fluxos", "Análise"],
  },
  {
    title: "Mercado Imobiliário",
    icon: Building2,
    items: ["Campanhas", "Lançamentos", "Portais", "CRM", "Automação"],
  },
  {
    title: "Estratégia & Growth",
    icon: LineChart,
    items: ["Consultoria", "Posicionamento", "Analytics", "Dados", "Escala"],
  },
];

export const projects: HomeProject[] = [
  {
    name: "Nobre Imóveis",
    description: "Marketing, tecnologia e automação para imobiliárias.",
    tag: "Imobiliário",
    tagTone: "blue",
    gradient: "from-stone-900 via-zinc-800 to-orange-950/20",
  },
  {
    name: "UNIP",
    description: "Captação de alunos com landing pages, Google Ads e SEO.",
    tag: "Educação",
    tagTone: "blue",
    gradient: "from-blue-950 via-indigo-900 to-slate-900",
  },
  {
    name: "Studio 21",
    description: "Posicionamento e aquisição com Google Ads estratégico.",
    tag: "Beleza",
    tagTone: "blue",
    gradient: "from-zinc-900 via-neutral-800 to-amber-950/30",
  },
];

export const portfolioSectionDescription =
  "Cases reais de marketing, tecnologia e crescimento — do imobiliário à educação e serviços.";

export const processSteps: HomeProcessStep[] = [
  {
    number: "01",
    title: "Diagnóstico",
    description: "Entendemos seu mercado, desafios e oportunidades.",
  },
  {
    number: "02",
    title: "Estratégia",
    description: "Desenhamos o caminho de crescimento ideal.",
  },
  {
    number: "03",
    title: "Execução",
    description: "Construímos campanhas, conteúdo e tecnologia.",
  },
  {
    number: "04",
    title: "Otimização",
    description: "Medimos, testamos e melhoramos continuamente.",
  },
  {
    number: "05",
    title: "Escala",
    description: "Expandimos o que funciona com previsibilidade.",
  },
];

export const techProducts: HomeTechProduct[] = [
  {
    title: "Atlas",
    description: "Portal Imobiliário Inteligente",
    icon: Building2,
  },
  {
    title: "Diagnóstico de Mercado",
    description: "Sistema próprio de análise",
    icon: Search,
  },
  {
    title: "Automações IA",
    description: "Fluxos inteligentes sob medida",
    icon: Bot,
  },
  {
    title: "CRM",
    description: "Gestão de leads e relacionamento",
    icon: Users,
  },
  {
    title: "Dashboard",
    description: "Relatórios e métricas em tempo real",
    icon: BarChart3,
  },
  {
    title: "Integrações",
    description: "Conectamos suas ferramentas",
    icon: Zap,
  },
];

export const techStats: HomeStat[] = [
  { value: "+120", label: "Projetos" },
  { value: "+8M", label: "Investimento" },
  { value: "+3M", label: "Leads" },
  { value: "+30", label: "Segmentos" },
  { value: "99,9%", label: "Disponibilidade" },
];

export const faqItems: HomeFaqItem[] = [
  {
    question: "A Raise One é uma agência de tráfego?",
    answer:
      "Somos parceiros de crescimento. Além de Google Ads e Meta Ads, integramos SEO, conteúdo, CRM, automações, IA e tecnologia sob medida — tudo conectado em um sistema comercial, não em entregas isoladas.",
  },
  {
    question: "Para quem a Raise One trabalha?",
    answer:
      "Empresas que querem crescer com estratégia e previsibilidade — clínicas, imobiliárias, educação, serviços locais, indústria e outros segmentos. Adaptamos o plano ao seu mercado, estágio e objetivos.",
  },
  {
    question: "Como funciona a parceria na prática?",
    answer:
      "Começamos com um diagnóstico do seu mercado e funil comercial. A partir daí, estruturamos o Programa de Crescimento — 6 meses integrados — ou soluções específicas, sempre conectando campanhas, landing pages, CRM e processo comercial.",
  },
  {
    question: "Vocês também desenvolvem tecnologia?",
    answer:
      "Sim. Criamos sites, portais, CRMs, automações e produtos sob medida — como o Atlas, nosso portal imobiliário inteligente. Tecnologia faz parte do ecossistema de crescimento, não é um serviço à parte.",
  },
  {
    question: "Qual o investimento envolvido?",
    answer:
      "Depende do escopo, segmento e objetivos. Após o diagnóstico, apresentamos proposta clara com entregas, cronograma e investimento mensal — gestão e mídia separados, sem custos escondidos.",
  },
  {
    question: "Em quanto tempo aparecem resultados?",
    answer:
      "Campanhas podem gerar leads nas primeiras semanas. Resultados consistentes — CAC estável, funil maduro, processo comercial rodando — costumam consolidar entre 60 e 120 dias, conforme mercado e ponto de partida.",
  },
];

export const solutionsMenu: HomeNavGroup[] = [
  {
    title: "Programa",
    links: [
      { label: "Programa de Crescimento ⭐", href: "/programa-de-crescimento" },
      { label: "Todas as soluções", href: "/solucoes" },
    ],
  },
  {
    title: "Aquisição",
    links: [
      { label: "Google Ads", href: "/solucoes/google-ads" },
      { label: "Meta Ads", href: "/solucoes/meta-ads" },
      { label: "Landing Pages", href: "/solucoes/landing-pages" },
    ],
  },
  {
    title: "Conteúdo & Growth",
    links: [
      { label: "Produção de Conteúdo", href: "/solucoes/producao-de-conteudo" },
      { label: "CRM", href: "/solucoes" },
      { label: "Consultoria Growth", href: "/solucoes" },
    ],
  },
  {
    title: "Mercado Imobiliário",
    links: [
      { label: "Soluções imobiliárias", href: "/solucoes" },
      { label: "Atlas", href: "/#tecnologia" },
    ],
  },
];

export const footerLinks = {
  empresa: [
    { label: "Programa de Crescimento", href: "/programa-de-crescimento" },
    { label: "Metodologia", href: "/metodologia" },
    { label: "Cases", href: "/cases" },
    { label: "Blog", href: "/blog" },
    { label: "Contato", href: "/#contato" },
    { label: "Carreiras", href: "#" },
  ],
  solucoes: [
    { label: "Google Ads", href: "/solucoes/google-ads" },
    { label: "Meta Ads", href: "/solucoes/meta-ads" },
    { label: "Landing Pages", href: "/solucoes/landing-pages" },
    { label: "Produção de Conteúdo", href: "/solucoes/producao-de-conteudo" },
    { label: "Ver todas", href: "/solucoes" },
  ],
  produtos: [
    { label: "Nobre Imóveis", href: "/cases/nobre" },
    { label: "Tecnologia", href: "/tecnologia" },
    { label: "Diagnóstico Inteligente", href: "/diagnostico" },
  ],
  recursos: [
    { label: "Cases", href: "/cases" },
    { label: "Metodologia", href: "/metodologia" },
    { label: "Blog", href: "/blog" },
    { label: "Política de Privacidade", href: "#" },
    { label: "Termos de Uso", href: "#" },
  ],
};

export const heroTypewriterPhrases = [
  "Criamos a estratégia.",
  "Desenvolvemos a tecnologia.",
  "Executamos o crescimento.",
] as const;

export const heroChecklist = ["Estratégia", "Tecnologia", "Execução"];

export const homeBlogSection = {
  eyebrow: "Conteúdo",
  title: "Insights para crescer com estratégia",
  description:
    "Guias, comparativos e artigos práticos sobre marketing, aquisição e tecnologia — do tráfego pago ao SEO e automações.",
  featuredSlugs: [
    "google-ads-vs-seo-qual-usar",
    "funil-de-aquisicao-guia",
    "como-estruturar-campanhas-google-ads",
  ] as const,
  carouselLimit: 8,
};

export const philosophyBullets = [
  {
    title: "Parceiro estratégico",
    description: "Unimos marketing, conteúdo e tecnologia em um único time.",
    icon: Target,
  },
  {
    title: "Soluções sob medida",
    description: "Cada negócio exige um caminho diferente de crescimento.",
    icon: Sparkles,
  },
  {
    title: "Execução de ponta a ponta",
    description: "Da estratégia ao sistema, entregamos o que prometemos.",
    icon: Rocket,
  },
];
