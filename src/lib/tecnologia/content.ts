import type { NextStepLink } from "@/components/marketing/shared/NextSteps";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Building2,
  Plug,
  Rocket,
  Search,
  Users,
  Zap,
} from "lucide-react";

export interface TechProduct {
  title: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  features: string[];
  status: "live" | "beta" | "roadmap";
}

export interface RoadmapItem {
  quarter: string;
  title: string;
  description: string;
  status: "done" | "in-progress" | "planned";
}

export const tecnologiaSeo = {
  title: "Tecnologia — Raise One",
  description:
    "Atlas, CRM, dashboards, automações e diagnóstico inteligente. Tecnologia desenvolvida pela Raise One para acelerar o crescimento dos clientes.",
};

export const techProductsDetailed: TechProduct[] = [
  {
    title: "Atlas",
    description: "Portal imobiliário inteligente",
    longDescription:
      "Plataforma completa para incorporadoras e imobiliárias — portal de empreendimentos, CRM integrado, automações de follow-up e IA para qualificação de leads.",
    icon: Building2,
    features: [
      "Portal de empreendimentos responsivo",
      "CRM imobiliário integrado",
      "Automação de follow-up por WhatsApp",
      "IA para qualificação de leads",
      "Dashboard de performance comercial",
    ],
    status: "live",
  },
  {
    title: "CRM Raise One",
    description: "Gestão de leads e pipeline",
    longDescription:
      "CRM desenvolvido para o funil de growth — captura, qualificação, nurturing e conversão. Integrado nativamente com campanhas, landing pages e automações.",
    icon: Users,
    features: [
      "Pipeline visual de vendas",
      "Captura automática de leads",
      "Scoring e qualificação",
      "Histórico completo de interações",
      "Integração com WhatsApp e e-mail",
    ],
    status: "live",
  },
  {
    title: "Dashboards",
    description: "Métricas em tempo real",
    longDescription:
      "Painéis executivos com dados de campanhas, conversões, CAC, ROI e funil comercial — tudo em um só lugar, atualizado em tempo real.",
    icon: BarChart3,
    features: [
      "Métricas de campanhas (Google, Meta)",
      "Funil de conversão completo",
      "CAC e ROI por canal",
      "Relatórios automatizados",
      "Alertas de performance",
    ],
    status: "live",
  },
  {
    title: "Automações IA",
    description: "Fluxos inteligentes sob medida",
    longDescription:
      "Automações que vão além de regras simples — agentes de IA para atendimento, qualificação, follow-up e análise de dados com processamento de linguagem natural.",
    icon: Bot,
    features: [
      "Agentes de atendimento com IA",
      "Qualificação automática de leads",
      "Follow-up inteligente por WhatsApp",
      "Análise de sentimento e intenção",
      "Fluxos personalizados por segmento",
    ],
    status: "live",
  },
  {
    title: "Diagnóstico Inteligente",
    description: "Análise de mercado automatizada",
    longDescription:
      "Sistema próprio que analisa mercado, concorrência e oportunidades de busca — o primeiro passo do framework Discover, disponível gratuitamente.",
    icon: Search,
    features: [
      "Análise de demanda por região",
      "Mapeamento de termos de busca",
      "Benchmark de concorrência",
      "Identificação de oportunidades",
      "Relatório personalizado por segmento",
    ],
    status: "live",
  },
  {
    title: "Integrações",
    description: "Ecossistema conectado",
    longDescription:
      "Conectamos Google Ads, Meta Ads, WhatsApp, e-mail, CRMs externos e ferramentas de analytics — tudo fluindo em um único sistema.",
    icon: Plug,
    features: [
      "Google Ads & Analytics",
      "Meta Business Suite",
      "WhatsApp Business API",
      "Webhooks e APIs REST",
      "Zapier e Make (Integromat)",
    ],
    status: "live",
  },
];

export const techStatsDetailed = [
  { value: "+120", label: "Projetos entregues" },
  { value: "+8M", label: "Investimento gerenciado" },
  { value: "+3M", label: "Leads capturados" },
  { value: "+30", label: "Segmentos atendidos" },
  { value: "99,9%", label: "Disponibilidade" },
];

export const roadmap: RoadmapItem[] = [
  {
    quarter: "Q1 2026",
    title: "Atlas v2 — IA generativa",
    description: "Descrições automáticas de empreendimentos, chatbot de qualificação e recomendação inteligente.",
    status: "in-progress",
  },
  {
    quarter: "Q2 2026",
    title: "CRM multicanal",
    description: "Unificação de leads de Google, Meta, orgânico e indicação em pipeline único.",
    status: "planned",
  },
  {
    quarter: "Q2 2026",
    title: "Diagnóstico v2",
    description: "Análise competitiva automatizada com SERP, ads transparency e scoring de oportunidade.",
    status: "planned",
  },
  {
    quarter: "Q3 2026",
    title: "Automações no-code",
    description: "Interface visual para clientes criarem fluxos de automação sem código.",
    status: "planned",
  },
  {
    quarter: "Q4 2026",
    title: "Marketplace de integrações",
    description: "Conectores prontos para ERPs, gateways de pagamento e plataformas de e-commerce.",
    status: "planned",
  },
];

export const tecnologiaDifferentiators = [
  {
    title: "Produto, não terceirizado",
    description: "Desenvolvemos nossa própria tecnologia — não revendemos SaaS genérico.",
    icon: Rocket,
  },
  {
    title: "Integrado ao funil",
    description: "Cada produto conversa com campanhas, landing pages e CRM — não funciona isolado.",
    icon: Zap,
  },
  {
    title: "Evolui com o cliente",
    description: "Roadmap orientado por demanda real dos projetos — não por features genéricas.",
    icon: BarChart3,
  },
];

export const tecnologiaNextSteps: NextStepLink[] = [
  {
    label: "Cases de tecnologia",
    description: "Veja Atlas e outros projetos em ação.",
    href: "/cases",
    internal: true,
  },
  {
    label: "Metodologia",
    description: "Como tecnologia se encaixa no framework.",
    href: "/metodologia",
    internal: true,
  },
  {
    label: "Fazer diagnóstico",
    description: "Experimente nosso Diagnóstico Inteligente.",
    href: "/diagnostico",
    internal: true,
  },
];
