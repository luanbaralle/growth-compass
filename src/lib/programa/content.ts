import type { HomeFaqItem } from "@/lib/home/content";
import type { NextStepLink } from "@/components/marketing/shared/NextSteps";
import {
  BarChart3,
  Layers,
  Megaphone,
  Rocket,
  Search,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ProgramaMonth {
  month: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ProgramaDelivery {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const programaSeo = {
  title: "Programa de Crescimento — Raise One",
  description:
    "Como funciona trabalhar com a Raise One. Um programa de 6 meses que une marketing, conteúdo e tecnologia em um único parceiro estratégico.",
};

export const programaHero = {
  eyebrow: "Programa de Crescimento",
  title: "Como funciona trabalhar com a Raise One",
  description:
    "Não vendemos tráfego. Construímos o sistema de crescimento da sua empresa — com estratégia, execução e tecnologia em um único time.",
  badge: "⭐ Página comercial",
};

export const marketProblem = {
  title: "O mercado está cheio de promessas vazias",
  description:
    "Empresas investem em marketing, contratam fornecedores, criam campanhas — e continuam sem previsibilidade de crescimento.",
  points: [
    "Campanhas rodando sem estratégia clara de funil",
    "Leads chegando, mas sem processo comercial estruturado",
    "Múltiplos fornecedores que não conversam entre si",
    "Decisões baseadas em achismo, não em dados",
    "Investimento crescente, retorno estagnado",
  ],
};

export const vendorProblem = {
  title: "Por que contratar vários fornecedores?",
  description:
    "A maioria das empresas em crescimento acaba gerenciando um ecossistema fragmentado — e paga o preço em tempo, dinheiro e resultados.",
  vendors: [
    { role: "Agência de tráfego", gap: "Não entende seu produto nem seu CRM" },
    { role: "Produtora de conteúdo", gap: "Cria posts sem estratégia de conversão" },
    { role: "Desenvolvedor freelancer", gap: "Entrega código, não integração com marketing" },
    { role: "Consultor pontual", gap: "Faz diagnóstico, mas não executa" },
    { role: "Freelancer de automação", gap: "Automatiza processos que nem existem" },
  ],
  conclusion:
    "Cada um entrega sua parte. Ninguém entrega o sistema completo. A Raise One existe para resolver exatamente isso.",
};

export const programaIntro = {
  title: "Conheça o Programa Raise One",
  description:
    "Um programa estruturado de 6 meses que transforma sua operação comercial — do diagnóstico à escala. Marketing, conteúdo e tecnologia trabalhando juntos, com um único objetivo: crescimento previsível.",
  pillars: [
    {
      title: "Um parceiro, não cinco fornecedores",
      description: "Estratégia, execução e tecnologia no mesmo time.",
      icon: Users,
    },
    {
      title: "Foco em resultado, não em entregáveis",
      description: "Medimos leads, conversões e receita — não apenas impressões.",
      icon: Target,
    },
    {
      title: "Tecnologia como diferencial",
      description: "CRM, automações, dashboards e IA integrados ao funil.",
      icon: Workflow,
    },
  ],
};

export const programaMonths: ProgramaMonth[] = [
  {
    month: "Mês 1",
    title: "Diagnóstico & Estratégia",
    description: "Entendemos seu mercado, mapeamos oportunidades e desenhamos o plano de crescimento.",
    deliverables: [
      "Análise de mercado e concorrência",
      "Mapeamento do funil comercial atual",
      "Definição de ICP e proposta de valor",
      "Plano estratégico de 6 meses",
    ],
  },
  {
    month: "Mês 2",
    title: "Fundação & Infraestrutura",
    description: "Construímos a base: landing pages, tracking, CRM e automações essenciais.",
    deliverables: [
      "Landing pages de conversão",
      "Configuração de tracking e analytics",
      "CRM e fluxos de qualificação",
      "Integrações entre ferramentas",
    ],
  },
  {
    month: "Mês 3",
    title: "Aquisição & Conteúdo",
    description: "Ativamos campanhas de aquisição e produção de conteúdo alinhada ao funil.",
    deliverables: [
      "Campanhas Google Ads e Meta Ads",
      "Calendário editorial e produção",
      "Testes A/B de criativos e copy",
      "Primeiros leads qualificados",
    ],
  },
  {
    month: "Mês 4",
    title: "Otimização & Conversão",
    description: "Analisamos dados, otimizamos campanhas e melhoramos taxas de conversão.",
    deliverables: [
      "Relatórios de performance semanais",
      "Otimização de campanhas e LPs",
      "Refinamento de processo comercial",
      "Automações de follow-up",
    ],
  },
  {
    month: "Mês 5",
    title: "Escala & Automação",
    description: "Expandimos o que funciona e automatizamos processos repetitivos com IA.",
    deliverables: [
      "Escala de campanhas vencedoras",
      "Automações inteligentes (IA)",
      "Dashboards de acompanhamento",
      "Playbook comercial documentado",
    ],
  },
  {
    month: "Mês 6",
    title: "Consolidação & Próximos Passos",
    description: "Consolidamos resultados, documentamos aprendizados e planejamos a continuidade.",
    deliverables: [
      "Relatório de resultados completo",
      "Documentação de processos",
      "Roadmap de crescimento futuro",
      "Plano de continuidade ou expansão",
    ],
  },
];

export const programaDeliveries: ProgramaDelivery[] = [
  {
    title: "Estratégia de Aquisição",
    description: "Google Ads, Meta Ads, SEO e funis de conversão integrados.",
    icon: Megaphone,
  },
  {
    title: "Produção de Conteúdo",
    description: "Social media, vídeos, fotografia e conteúdo institucional.",
    icon: Layers,
  },
  {
    title: "Landing Pages & Sites",
    description: "Páginas de conversão e presença digital otimizada.",
    icon: Rocket,
  },
  {
    title: "CRM & Automações",
    description: "Gestão de leads, follow-up automático e integrações.",
    icon: Workflow,
  },
  {
    title: "Inteligência Artificial",
    description: "Agentes, automações e análise inteligente de dados.",
    icon: Search,
  },
  {
    title: "Dashboards & Analytics",
    description: "Métricas em tempo real para decisões baseadas em dados.",
    icon: BarChart3,
  },
];

export const programaMethod = {
  title: "O método Raise One",
  description: "Cinco fases que guiam cada projeto — do diagnóstico à escala.",
  steps: [
    {
      number: "01",
      title: "Discover",
      description: "Diagnóstico profundo do mercado, concorrência e oportunidades.",
    },
    {
      number: "02",
      title: "Strategy",
      description: "Plano de crescimento com metas, canais e cronograma definidos.",
    },
    {
      number: "03",
      title: "Build",
      description: "Construção de campanhas, conteúdo, landing pages e tecnologia.",
    },
    {
      number: "04",
      title: "Launch",
      description: "Ativação controlada com testes e monitoramento em tempo real.",
    },
    {
      number: "05",
      title: "Optimize",
      description: "Análise contínua, testes A/B e melhoria de performance.",
    },
    {
      number: "06",
      title: "Scale",
      description: "Expansão do que funciona com previsibilidade e automação.",
    },
  ],
};

export const programaFaq: HomeFaqItem[] = [
  {
    question: "O Programa é para qual tipo de empresa?",
    answer:
      "Para empresas que já faturam e querem crescer de forma estruturada — clínicas, imobiliárias, educação, serviços locais, indústria e outros segmentos. O programa se adapta ao seu mercado e estágio.",
  },
  {
    question: "Preciso contratar tudo de uma vez?",
    answer:
      "O Programa de Crescimento é integrado por design — marketing, conteúdo e tecnologia trabalham juntos. Mas priorizamos conforme seu momento: alguns clientes começam com aquisição, outros com CRM. O diagnóstico define o ponto de partida.",
  },
  {
    question: "Quanto tempo até ver resultados?",
    answer:
      "Campanhas podem gerar leads nas primeiras semanas. Resultados consistentes e previsíveis costumam consolidar entre o 2º e 4º mês, conforme o funil amadurece.",
  },
  {
    question: "Vocês substituem meu time interno?",
    answer:
      "Complementamos. Atuamos como braço estratégico e operacional de growth — seu time foca no core business, nós cuidamos da máquina de aquisição e conversão.",
  },
  {
    question: "Como funciona o investimento?",
    answer:
      "O investimento varia conforme escopo, segmento e objetivos. Após o diagnóstico, apresentamos uma proposta clara com entregas, cronograma e investimento mensal. Sem surpresas.",
  },
  {
    question: "E depois dos 6 meses?",
    answer:
      "Muitos clientes continuam em parceria de longo prazo. Outros internalizam processos com nosso playbook. O objetivo é que você tenha um sistema de crescimento que funciona — com ou sem a Raise One.",
  },
];

export const programaNextSteps: NextStepLink[] = [
  {
    label: "Metodologia",
    description: "O framework por trás do Programa.",
    href: "/metodologia",
    internal: true,
  },
  {
    label: "Explorar soluções",
    description: "Conheça cada frente do ecossistema Raise One.",
    href: "/solucoes",
    internal: true,
  },
  {
    label: "Ver cases",
    description: "Resultados reais de empresas que cresceram conosco.",
    href: "/cases",
    internal: true,
  },
];

export const programaCta = {
  title: "Vamos construir seu sistema de crescimento?",
  description:
    "Agende uma conversa estratégica. Sem compromisso — entendemos seu mercado e mostramos o caminho.",
  whatsappMessage:
    "Olá! Vim pela página do Programa de Crescimento e gostaria de agendar uma conversa estratégica.",
};
