import type {
  ProposalContent,
  ProposalFunnelStep,
  ProposalMetric,
  ProposalPricingTier,
  ProposalSimulatorDefaults,
} from "../types";
import type { OSCommercialDefaults } from "@/domains/settings/types";
import { DEFAULT_OS_COMMERCIAL } from "@/domains/settings/types";

/** Tabela comercial R1 — aceleração (referência UNIP Caraguatatuba). */
export const R1_ACCELERATION_PRICING: ProposalPricingTier[] = [
  {
    id: "implementation",
    name: "Implementação do Projeto",
    subtitle: "Pagamento único",
    amountLabel: "R$ 1.997",
    frequency: "once",
    items: [
      "Planejamento estratégico",
      "Landing Page de conversão",
      "Rastreamento e conversões",
      "Configuração Google Ads",
      "Domínio e hospedagem",
      "Primeiro ciclo operacional (30 dias)",
    ],
    note: "Investimento inicial para colocar toda a estrutura no ar.",
  },
  {
    id: "media",
    name: "Investimento em Mídia",
    subtitle: "Mensal · Google",
    amountLabel: "R$ 1.500 a R$ 2.000",
    frequency: "monthly_google",
    items: [
      "Verba paga diretamente ao Google",
      "Captação de demanda qualificada",
      "Sem margem R1 sobre mídia",
    ],
    note: "Faixa sugerida para iniciar a validação com dados reais.",
  },
  {
    id: "management",
    name: "Continuidade da Operação",
    subtitle: "Mensal · após validação",
    amountLabel: "R$ 997/mês",
    frequency: "monthly",
    items: [
      "Gestão das campanhas",
      "Otimizações contínuas",
      "Relatórios e reuniões",
      "Acompanhamento comercial",
    ],
    note: "Inicia após o primeiro ciclo operacional de 30 dias.",
  },
];

export const R1_DEFAULT_SIMULATOR: ProposalSimulatorDefaults = {
  mediaBudgetCents: 150_000,
  cpcCents: 250,
  leadRatePercent: 12.5,
  conversionRatePercent: 10,
  ltvCents: 400_000,
};

export const R1_DEFAULT_FUNNEL: ProposalFunnelStep[] = [
  { title: "Surge a necessidade", description: "O cliente ideal reconhece um problema ou desejo" },
  { title: "Pesquisa no Google", description: "Busca soluções ativamente na região ou categoria" },
  { title: "Avalia opções", description: "Compara preço, confiança e diferenciais" },
  { title: "Solicita contato", description: "Entra via WhatsApp ou formulário" },
  { title: "Recebe atendimento", description: "A qualidade comercial define a escolha" },
  { title: "Converte", description: "Nova venda ou matrícula para o negócio" },
];

export const R1_MECHANISM_FLOW = [
  "Google Ads",
  "Landing Page",
  "WhatsApp / Formulário",
  "Atendimento comercial",
  "Nova conversão",
];

export function buildHeroMetrics(input: {
  overallCoverage?: number;
  knowledgeDepth?: number;
  unknownsCount?: number;
  companyName?: string;
}): ProposalMetric[] {
  const metrics: ProposalMetric[] = [];
  if (input.knowledgeDepth != null && input.knowledgeDepth > 0) {
    metrics.push({ value: `${input.knowledgeDepth}%`, label: "Profundidade do diagnóstico" });
  }
  if (input.overallCoverage != null) {
    metrics.push({ value: `${input.overallCoverage}%`, label: "Cobertura comercial" });
  }
  if (input.unknownsCount != null && input.unknownsCount > 0) {
    metrics.push({ value: String(input.unknownsCount), label: "Lacunas mapeadas" });
  }
  if (metrics.length === 0 && input.companyName) {
    metrics.push({ value: "R1", label: "Plano personalizado" });
  }
  return metrics.slice(0, 4);
}

function pricingFromCommercial(commercial: OSCommercialDefaults): ProposalPricingTier[] {
  return R1_ACCELERATION_PRICING.map((tier) => {
    if (tier.id === "implementation") {
      return { ...tier, amountLabel: commercial.implementationAmount };
    }
    if (tier.id === "media") {
      return { ...tier, amountLabel: commercial.mediaAmount };
    }
    if (tier.id === "management") {
      return { ...tier, amountLabel: commercial.managementAmount };
    }
    return tier;
  });
}

function simulatorFromCommercial(commercial: OSCommercialDefaults): ProposalSimulatorDefaults {
  return {
    mediaBudgetCents: commercial.simulatorMediaBudgetCents,
    cpcCents: commercial.simulatorCpcCents,
    leadRatePercent: commercial.simulatorLeadRatePercent,
    conversionRatePercent: commercial.simulatorConversionRatePercent,
    ltvCents: commercial.simulatorLtvCents,
  };
}

export function applyAccelerationEnhancements(
  content: ProposalContent,
  input?: {
    overallCoverage?: number;
    knowledgeDepth?: number;
    unknownsCount?: number;
    companyName?: string;
    commercial?: OSCommercialDefaults;
    pricing?: ProposalPricingTier[];
    simulator?: ProposalSimulatorDefaults;
    whatsappPhone?: string;
  },
): ProposalContent {
  const commercial = input?.commercial ?? DEFAULT_OS_COMMERCIAL;
  const defaultPricing = input?.pricing ?? pricingFromCommercial(commercial);
  const defaultSimulator = input?.simulator ?? simulatorFromCommercial(commercial);

  return {
    ...content,
    heroMetrics: content.heroMetrics ?? buildHeroMetrics(input ?? {}),
    funnelSteps: content.funnelSteps ?? R1_DEFAULT_FUNNEL,
    mechanismFlow: content.mechanismFlow ?? R1_MECHANISM_FLOW,
    pricing: content.pricing ?? input?.pricing ?? defaultPricing,
    simulator: content.simulator ?? input?.simulator ?? defaultSimulator,
    cta: {
      ...content.cta,
      whatsappPhone: content.cta.whatsappPhone ?? input?.whatsappPhone,
    },
  };
}

export function formatCentsBRL(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
