import type { OSCommercialDefaults } from "@/domains/settings/types";
import { DEFAULT_OS_COMMERCIAL } from "@/domains/settings/types";
import type { ProposalPricingTier, ProposalSimulatorDefaults } from "../types";
import {
  R1_ACCELERATION_PRICING,
  R1_DEFAULT_SIMULATOR,
} from "./r1-pricing";

export function buildPricingFromCommercial(
  commercial: OSCommercialDefaults = DEFAULT_OS_COMMERCIAL,
): ProposalPricingTier[] {
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

export function buildSimulatorFromCommercial(
  commercial: OSCommercialDefaults = DEFAULT_OS_COMMERCIAL,
): ProposalSimulatorDefaults {
  return {
    mediaBudgetCents: commercial.simulatorMediaBudgetCents,
    cpcCents: commercial.simulatorCpcCents,
    leadRatePercent: commercial.simulatorLeadRatePercent,
    conversionRatePercent: commercial.simulatorConversionRatePercent,
    ltvCents: commercial.simulatorLtvCents,
  };
}

export function getStaticR1CommercialConfig(): {
  pricing: ProposalPricingTier[];
  simulator: ProposalSimulatorDefaults;
} {
  return {
    pricing: R1_ACCELERATION_PRICING,
    simulator: R1_DEFAULT_SIMULATOR,
  };
}
