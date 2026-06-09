import { MICROVERTICAL_CATALOG } from "./catalog";
import { cityExamples, termSearch } from "./helpers";
import type { MicroverticalDefinition } from "./types";

export { cityExamples, termSearch } from "./helpers";

/** Registry de microverticais — expandível sem nova LP */
export const MICROVERTICALS: MicroverticalDefinition[] = MICROVERTICAL_CATALOG;

/** Gera definição dinâmica para termos desconhecidos */
export function createDynamicMicrovertical(userTerm: string): MicroverticalDefinition {
  const label = capitalizeBusinessTerm(userTerm);
  return {
    id: "dynamic",
    label,
    keywords: [],
    macroCategory: "geral",
    templateSlug: "outro",
    priority: "low",
    heroHighlight: "recebendo mais clientes.",
    businessType: label.toLowerCase(),
    yourBusinessLabel: `Sua ${label.toLowerCase()}`,
    suggestedServices: [
      "Serviço principal",
      "Atendimento local",
      "Orçamento",
      "Emergência",
    ],
    searchExamples: (term, city) => termSearch(term || label.toLowerCase(), city),
  };
}

export function capitalizeBusinessTerm(term: string): string {
  const trimmed = term.trim();
  if (!trimmed) return "Negócio Local";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
