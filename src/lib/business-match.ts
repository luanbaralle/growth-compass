import {
  MICROVERTICALS,
  capitalizeBusinessTerm,
  createDynamicMicrovertical,
} from "@/config/microverticals/registry";
import {
  FEATURED_MARKET_LABELS,
  getGroupedMarketSuggestions,
  countMoreMarketSuggestions,
} from "@/config/market-demand";
import type { BusinessMatch, BusinessPersonalization, MatchTier } from "@/config/microverticals/types";
import type { MicroverticalDefinition } from "@/config/microverticals/types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scoreMicrovertical(normalizedInput: string, mv: MicroverticalDefinition): number {
  let score = 0;

  for (const keyword of mv.keywords) {
    const kw = normalize(keyword);
    if (!kw) continue;
    if (normalizedInput === kw) score += 12;
    else if (normalizedInput.includes(kw)) score += kw.length >= 6 ? 8 : 5;
    else if (kw.includes(normalizedInput) && normalizedInput.length >= 4) score += 4;
  }

  // Match parcial no label
  const labelNorm = normalize(mv.label);
  if (normalizedInput === labelNorm) score += 10;
  else if (labelNorm.includes(normalizedInput) || normalizedInput.includes(labelNorm)) score += 3;

  return score;
}

function toBusinessMatch(
  tier: MatchTier,
  userTerm: string,
  mv: MicroverticalDefinition,
): BusinessMatch {
  const displayLabel = tier === "dynamic" ? capitalizeBusinessTerm(userTerm) : mv.label;

  return {
    tier,
    userTerm: userTerm.trim(),
    displayLabel,
    microverticalId: tier === "dynamic" ? null : mv.id,
    macroCategory: mv.macroCategory,
    templateSlug: mv.templateSlug,
    heroHighlight: mv.heroHighlight,
    businessType: mv.businessType,
    yourBusinessLabel: mv.yourBusinessLabel,
    suggestedServices: mv.suggestedServices,
    searchExamples: (city?: string) =>
      mv.searchExamples(userTerm.trim() || mv.label.toLowerCase(), city),
  };
}

/**
 * Sempre retorna um match — nunca rejeita o negócio do usuário.
 *
 * - exact: keyword forte ou match direto (ex: "barbearia")
 * - related: match parcial (ex: "studio de beleza" → salão)
 * - dynamic: termo livre (ex: "fabricação de parafusos")
 */
export function matchBusiness(input: string): BusinessMatch {
  const userTerm = input.trim() || "negócio local";
  const normalized = normalize(userTerm);

  let best: { mv: MicroverticalDefinition; score: number } | null = null;

  for (const mv of MICROVERTICALS) {
    const score = scoreMicrovertical(normalized, mv);
    if (score > 0 && (!best || score > best.score)) {
      best = { mv, score };
    }
  }

  if (!best) {
    return toBusinessMatch("dynamic", userTerm, createDynamicMicrovertical(userTerm));
  }

  if (best.score >= 8) {
    return toBusinessMatch("exact", userTerm, best.mv);
  }

  if (best.score >= 3) {
    return toBusinessMatch("related", userTerm, best.mv);
  }

  return toBusinessMatch("dynamic", userTerm, createDynamicMicrovertical(userTerm));
}

export function buildHeroTitle(match: BusinessMatch, city: string): string {
  const term = match.displayLabel.toLowerCase();
  const possessive = match.yourBusinessLabel.replace(/^Sua |^Seu /, "").toLowerCase();

  if (match.tier === "dynamic") {
    return `Seu negócio de ${term} em ${city} deveria estar`;
  }

  if (match.yourBusinessLabel.startsWith("Sua ")) {
    return `Sua ${possessive} em ${city} deveria estar`;
  }
  if (match.yourBusinessLabel.startsWith("Seu ")) {
    return `Seu ${possessive} em ${city} deveria estar`;
  }

  return `Sua ${term} em ${city} deveria estar`;
}

export function buildPersonalization(
  match: BusinessMatch,
  city?: string,
  selectedServices?: string[],
): BusinessPersonalization {
  const searchExamples =
    selectedServices && selectedServices.length > 0
      ? selectedServices.flatMap((s) => {
          const base = s.toLowerCase();
          return city
            ? [`${base} ${city.toLowerCase()}`, `${base} perto de mim`]
            : [`${base} perto de mim`];
        })
      : match.searchExamples(city).slice(0, 5);

  const fomoSubtitle =
    match.tier === "dynamic"
      ? `Enquanto você lê esta página, outras empresas da sua região estão aparecendo quando clientes procuram por serviços relacionados a ${match.displayLabel.toLowerCase()}.`
      : `Enquanto você lê esta página, outras ${match.displayLabel.toLowerCase()}s da sua região estão aparecendo para pessoas que procuram exatamente esses serviços.`;

  return {
    userTerm: match.userTerm,
    displayLabel: match.displayLabel,
    tier: match.tier,
    macroCategory: match.macroCategory,
    heroHighlight: match.heroHighlight,
    businessType: match.businessType,
    yourBusinessLabel: match.yourBusinessLabel,
    searchExamples,
    fomoSubtitle,
  };
}

export const FEATURED_BUSINESS_EXAMPLES = [...FEATURED_MARKET_LABELS];

export { getGroupedMarketSuggestions, countMoreMarketSuggestions };

/** @deprecated use getGroupedMarketSuggestions */
export const MORE_BUSINESS_EXAMPLES = getGroupedMarketSuggestions().flatMap((g) => g.labels);

/** @deprecated use FEATURED_BUSINESS_EXAMPLES */
export const BUSINESS_EXAMPLES = [...FEATURED_BUSINESS_EXAMPLES];

export const BUSINESS_PLACEHOLDERS = BUSINESS_EXAMPLES.map((e) => e.toLowerCase());

/** @deprecated use matchBusiness */
export { matchBusiness as matchSegmentFromInput };
