import type { MacroCategory, MicroverticalDefinition, TemplateSlug } from "./types";

export function cityExamples(base: string[], city?: string): string[] {
  if (!city) return base;
  const c = city.toLowerCase();
  return base.map((q) => (q.includes("{city}") ? q.replace("{city}", c) : q));
}

export function termSearch(term: string, city?: string): string[] {
  const t = term.toLowerCase();
  const c = city?.toLowerCase() ?? "{city}";
  return [
    `${t} perto de mim`,
    `${t} ${c}`,
    `melhor ${t} ${c}`,
    `${t} preço`,
    `${t} agendar`,
  ];
}

const HERO_BY_TEMPLATE: Partial<Record<TemplateSlug, string>> = {
  clinica: "recebendo mais pacientes.",
  dentista: "recebendo mais pacientes.",
  estetica: "recebendo mais agendamentos.",
  advogado: "recebendo mais clientes.",
  imobiliaria: "recebendo mais leads.",
  contabilidade: "recebendo mais clientes.",
  financeiro: "recebendo mais clientes.",
  construcao: "recebendo mais clientes.",
  "energia-solar": "recebendo mais clientes.",
  "servicos-locais": "recebendo mais chamados.",
  automotivo: "recebendo mais clientes.",
  educacao: "recebendo mais matrículas.",
  alimentacao: "recebendo mais pedidos.",
  pets: "recebendo mais clientes.",
  outro: "recebendo mais clientes.",
};

export interface MicroverticalInput {
  id: string;
  label: string;
  keywords: string[];
  macroCategory: MacroCategory;
  templateSlug: TemplateSlug;
  priority?: "high" | "medium" | "low";
  heroHighlight?: string;
  businessType: string;
  yourBusinessLabel: string;
  suggestedServices: string[];
  searches: string[];
}

/** Factory compacta para microverticais com exemplos de busca por cidade */
export function mv(input: MicroverticalInput): MicroverticalDefinition {
  return {
    id: input.id,
    label: input.label,
    keywords: input.keywords,
    macroCategory: input.macroCategory,
    templateSlug: input.templateSlug,
    priority: input.priority ?? "medium",
    heroHighlight:
      input.heroHighlight ?? HERO_BY_TEMPLATE[input.templateSlug] ?? "recebendo mais clientes.",
    businessType: input.businessType,
    yourBusinessLabel: input.yourBusinessLabel,
    suggestedServices: input.suggestedServices,
    searchExamples: (_, city) => cityExamples(input.searches, city),
  };
}
