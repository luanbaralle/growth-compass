import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Building2,
  Clapperboard,
  Code2,
  Globe,
  Layers,
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

export interface HomeChallenge {
  problem: string;
  solution: string;
  icon: LucideIcon;
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

export const heroStats: HomeStat[] = [
  { value: "+120", label: "Projetos entregues" },
  { value: "+8M", label: "Em investimento gerenciado" },
  { value: "+3M", label: "Leads gerados" },
  { value: "+30", label: "Segmentos atendidos" },
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
    name: "Atlas",
    description: "Portal imobiliário inteligente com IA, CRM e automação.",
    tag: "Tecnologia",
    tagTone: "blue",
    gradient: "from-slate-900 via-slate-800 to-orange-950/40",
    href: "#",
  },
  {
    name: "UNIP",
    description: "Captação de alunos com landing pages, Google Ads e SEO.",
    tag: "Marketing",
    tagTone: "blue",
    gradient: "from-blue-950 via-indigo-900 to-slate-900",
  },
  {
    name: "Studio 21",
    description: "Posicionamento e aquisição com Google Ads estratégico.",
    tag: "Marketing",
    tagTone: "blue",
    gradient: "from-zinc-900 via-neutral-800 to-amber-950/30",
  },
  {
    name: "AMF Imóveis",
    description: "Campanhas, landing pages e Google Ads para imóveis.",
    tag: "Marketing",
    tagTone: "blue",
    gradient: "from-stone-900 via-zinc-800 to-orange-950/20",
  },
  {
    name: "Raise One",
    description: "Sistema interno com diagnóstico inteligente de mercado.",
    tag: "Tecnologia",
    tagTone: "blue",
    gradient: "from-neutral-950 via-zinc-900 to-orange-900/30",
  },
];

export const challenges: HomeChallenge[] = [
  {
    problem: "Poucos clientes?",
    solution: "Google Ads",
    icon: Users,
  },
  {
    problem: "Equipe sobrecarregada?",
    solution: "Automações",
    icon: Workflow,
  },
  {
    problem: "Site antigo?",
    solution: "Novo portal",
    icon: Globe,
  },
  {
    problem: "Processos manuais?",
    solution: "Sistema",
    icon: Layers,
  },
  {
    problem: "Baixa conversão?",
    solution: "Landing Page",
    icon: Target,
  },
];

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
    question: "Vocês trabalham apenas com Google Ads?",
    answer:
      "Não. Google Ads é uma das nossas frentes, mas também atuamos com Meta Ads, SEO, conteúdo, tecnologia, automações, IA e soluções completas de crescimento.",
  },
  {
    question: "Criam sistemas e plataformas?",
    answer:
      "Sim. Desenvolvemos sites, portais, CRMs, automações e produtos sob medida — como o Atlas, nosso portal imobiliário inteligente.",
  },
  {
    question: "Atendem todo o Brasil?",
    answer:
      "Sim. Trabalhamos com empresas de diferentes regiões e segmentos, com estratégias adaptadas a cada mercado.",
  },
  {
    question: "Quanto custa?",
    answer:
      "Depende do projeto. Cada solução é desenhada sob medida. O diagnóstico gratuito é o primeiro passo para entender suas oportunidades.",
  },
  {
    question: "Quanto tempo leva?",
    answer:
      "Varia conforme a solução. Campanhas podem iniciar em dias; plataformas e sistemas seguem um cronograma alinhado com escopo e complexidade.",
  },
];

export const solutionsMenu: HomeNavGroup[] = [
  {
    title: "Quero mais clientes",
    links: [
      { label: "Google Ads", href: "#solucoes" },
      { label: "Landing Pages", href: "#solucoes" },
      { label: "SEO", href: "#solucoes" },
    ],
  },
  {
    title: "Quero vender mais",
    links: [
      { label: "CRM", href: "#solucoes" },
      { label: "Automações", href: "#solucoes" },
      { label: "IA", href: "#solucoes" },
    ],
  },
  {
    title: "Quero modernizar meu negócio",
    links: [
      { label: "Sistemas", href: "#solucoes" },
      { label: "Sites", href: "#solucoes" },
      { label: "Integrações", href: "#solucoes" },
    ],
  },
  {
    title: "Sou do mercado imobiliário",
    links: [
      { label: "Lançamentos", href: "#solucoes" },
      { label: "Portais", href: "#solucoes" },
      { label: "Atlas", href: "#tecnologia" },
    ],
  },
];

export const footerLinks = {
  empresa: [
    { label: "Sobre", href: "#" },
    { label: "Portfólio", href: "#casos" },
    { label: "Cases", href: "#casos" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "#contato" },
    { label: "Carreiras", href: "#" },
  ],
  solucoes: [
    { label: "Marketing", href: "#solucoes" },
    { label: "Tecnologia", href: "#solucoes" },
    { label: "IA", href: "#solucoes" },
    { label: "Conteúdo", href: "#solucoes" },
    { label: "Mercado Imobiliário", href: "#solucoes" },
  ],
  produtos: [
    { label: "Atlas", href: "#tecnologia" },
    { label: "Diagnóstico Inteligente", href: "#diagnostico" },
  ],
  recursos: [
    { label: "Cases", href: "#casos" },
    { label: "Blog", href: "#" },
    { label: "Política de Privacidade", href: "#" },
    { label: "Termos de Uso", href: "#" },
  ],
};

export const heroChecklist = ["Estratégia", "Tecnologia", "Execução"];

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
