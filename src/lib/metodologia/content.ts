import type { NextStepLink } from "@/components/marketing/shared/NextSteps";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Hammer,
  Lightbulb,
  Rocket,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";

export interface FrameworkPhase {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  activities: string[];
  deliverables: string[];
  color: string;
}

export const metodologiaSeo = {
  title: "Metodologia — Framework Raise One",
  description:
    "Discover, Strategy, Build, Launch, Optimize, Scale. O framework que guia cada projeto de crescimento da Raise One — do diagnóstico à escala.",
};

export const frameworkPhases: FrameworkPhase[] = [
  {
    id: "discover",
    number: "01",
    title: "Discover",
    subtitle: "Diagnóstico profundo",
    description:
      "Antes de executar, entendemos. Mapeamos mercado, concorrência, funil atual e oportunidades reais — não suposições.",
    icon: Search,
    activities: [
      "Análise de mercado e concorrência",
      "Mapeamento do funil comercial atual",
      "Entrevistas com stakeholders",
      "Auditoria de canais e ferramentas",
      "Identificação de gaps e oportunidades",
    ],
    deliverables: [
      "Relatório de diagnóstico",
      "Mapa de oportunidades",
      "Benchmark competitivo",
      "Matriz de prioridades",
    ],
    color: "from-blue-950/40 via-slate-900 to-background",
  },
  {
    id: "strategy",
    number: "02",
    title: "Strategy",
    subtitle: "Plano de crescimento",
    description:
      "Com dados em mãos, desenhamos a estratégia: canais, metas, cronograma e investimento — tudo alinhado ao objetivo de negócio.",
    icon: Target,
    activities: [
      "Definição de ICP e proposta de valor",
      "Seleção de canais de aquisição",
      "Planejamento de conteúdo e tecnologia",
      "Definição de KPIs e metas",
      "Cronograma de 6 meses",
    ],
    deliverables: [
      "Plano estratégico de crescimento",
      "Roadmap de execução",
      "Projeção de investimento e ROI",
      "Framework de mensuração",
    ],
    color: "from-violet-950/40 via-slate-900 to-background",
  },
  {
    id: "build",
    number: "03",
    title: "Build",
    subtitle: "Construção integrada",
    description:
      "Campanhas, landing pages, conteúdo, CRM e automações — construídos juntos, não em silos. Cada peça conversa com a outra.",
    icon: Hammer,
    activities: [
      "Desenvolvimento de landing pages",
      "Configuração de campanhas pagas",
      "Produção de conteúdo estratégico",
      "Implementação de CRM e automações",
      "Integração de tracking e analytics",
    ],
    deliverables: [
      "Campanhas estruturadas",
      "Landing pages de conversão",
      "Conteúdo produzido",
      "CRM configurado",
      "Dashboards de acompanhamento",
    ],
    color: "from-orange-950/40 via-slate-900 to-background",
  },
  {
    id: "launch",
    number: "04",
    title: "Launch",
    subtitle: "Ativação controlada",
    description:
      "Go-live com monitoramento em tempo real. Testes iniciais, ajustes rápidos e primeiros dados para calibrar a máquina.",
    icon: Rocket,
    activities: [
      "Ativação de campanhas",
      "Monitoramento de performance",
      "Testes A/B iniciais",
      "Qualificação de primeiros leads",
      "Ajustes de lance e segmentação",
    ],
    deliverables: [
      "Campanhas no ar",
      "Primeiros leads qualificados",
      "Relatório de lançamento",
      "Plano de otimização inicial",
    ],
    color: "from-emerald-950/40 via-slate-900 to-background",
  },
  {
    id: "optimize",
    number: "05",
    title: "Optimize",
    subtitle: "Melhoria contínua",
    description:
      "Dados guiam decisões. Testamos, medimos, refinamos — campanhas, páginas, copy, funil comercial. Cada ciclo melhora a performance.",
    icon: BarChart3,
    activities: [
      "Análise semanal de performance",
      "Testes A/B de criativos e LPs",
      "Otimização de campanhas e lances",
      "Refinamento de processo comercial",
      "Automações de follow-up",
    ],
    deliverables: [
      "Relatórios de performance",
      "Testes documentados",
      "Melhorias implementadas",
      "Playbook de otimização",
    ],
    color: "from-cyan-950/40 via-slate-900 to-background",
  },
  {
    id: "scale",
    number: "06",
    title: "Scale",
    subtitle: "Expansão previsível",
    description:
      "O que funciona, escala. Expandimos canais vencedores, automatizamos processos e construímos previsibilidade de crescimento.",
    icon: TrendingUp,
    activities: [
      "Escala de campanhas vencedoras",
      "Expansão para novos canais",
      "Automações inteligentes com IA",
      "Documentação de processos",
      "Planejamento de continuidade",
    ],
    deliverables: [
      "Campanhas escaladas",
      "Automações avançadas",
      "Dashboard executivo",
      "Roadmap de crescimento futuro",
    ],
    color: "from-amber-950/40 via-slate-900 to-background",
  },
];

export const metodologiaPrinciples = [
  {
    title: "Integração, não silos",
    description: "Marketing, conteúdo e tecnologia no mesmo fluxo — não em departamentos separados.",
    icon: Lightbulb,
  },
  {
    title: "Dados sobre opinião",
    description: "Cada decisão é baseada em métricas reais — não em achismo ou 'best practices' genéricas.",
    icon: BarChart3,
  },
  {
    title: "Benefício sobre ferramenta",
    description: "Não vendemos Google Ads ou CRM — vendemos aquisição, conversão e organização comercial.",
    icon: Target,
  },
];

export const metodologiaNextSteps: NextStepLink[] = [
  {
    label: "Programa de Crescimento",
    description: "Veja como o framework se aplica na prática.",
    href: "/programa-de-crescimento",
    internal: true,
  },
  {
    label: "Cases",
    description: "Resultados reais usando nossa metodologia.",
    href: "/cases",
    internal: true,
  },
  {
    label: "Fazer diagnóstico",
    description: "Primeiro passo do framework: Discover.",
    href: "/diagnostico",
    internal: true,
  },
];
