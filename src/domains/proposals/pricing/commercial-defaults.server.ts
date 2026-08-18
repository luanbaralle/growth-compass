import { getOSPreferences } from "@/domains/settings/repository.server";
import type { OSCommercialDefaults } from "@/domains/settings/types";
import { DEFAULT_OS_COMMERCIAL } from "@/domains/settings/types";
import type { ProposalPricingTier, ProposalSimulatorDefaults } from "../types";
import {
  buildPricingFromCommercial,
  buildSimulatorFromCommercial,
} from "./commercial-defaults";

function parseCommercial(raw: unknown): OSCommercialDefaults {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_OS_COMMERCIAL };
  const o = raw as Record<string, unknown>;
  return {
    implementationAmount:
      typeof o.implementationAmount === "string"
        ? o.implementationAmount
        : DEFAULT_OS_COMMERCIAL.implementationAmount,
    mediaAmount:
      typeof o.mediaAmount === "string" ? o.mediaAmount : DEFAULT_OS_COMMERCIAL.mediaAmount,
    managementAmount:
      typeof o.managementAmount === "string"
        ? o.managementAmount
        : DEFAULT_OS_COMMERCIAL.managementAmount,
    simulatorMediaBudgetCents:
      typeof o.simulatorMediaBudgetCents === "number"
        ? o.simulatorMediaBudgetCents
        : DEFAULT_OS_COMMERCIAL.simulatorMediaBudgetCents,
    simulatorCpcCents:
      typeof o.simulatorCpcCents === "number"
        ? o.simulatorCpcCents
        : DEFAULT_OS_COMMERCIAL.simulatorCpcCents,
    simulatorLeadRatePercent:
      typeof o.simulatorLeadRatePercent === "number"
        ? o.simulatorLeadRatePercent
        : DEFAULT_OS_COMMERCIAL.simulatorLeadRatePercent,
    simulatorConversionRatePercent:
      typeof o.simulatorConversionRatePercent === "number"
        ? o.simulatorConversionRatePercent
        : DEFAULT_OS_COMMERCIAL.simulatorConversionRatePercent,
    simulatorLtvCents:
      typeof o.simulatorLtvCents === "number"
        ? o.simulatorLtvCents
        : DEFAULT_OS_COMMERCIAL.simulatorLtvCents,
  };
}

export function resolveCommercialWhatsApp(
  defaultWhatsApp: string,
  envFallback?: string,
): string {
  const fromPrefs = defaultWhatsApp.replace(/\D/g, "");
  if (fromPrefs) return fromPrefs;
  return (envFallback ?? process.env.VITE_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
}

export async function getR1CommercialConfig(): Promise<{
  commercial: OSCommercialDefaults;
  pricing: ProposalPricingTier[];
  simulator: ProposalSimulatorDefaults;
  whatsappPhone: string;
}> {
  const prefs = await getOSPreferences();
  const commercial = parseCommercial(prefs.commercial);
  return {
    commercial,
    pricing: buildPricingFromCommercial(commercial),
    simulator: buildSimulatorFromCommercial(commercial),
    whatsappPhone: resolveCommercialWhatsApp(prefs.defaultWhatsApp),
  };
}
