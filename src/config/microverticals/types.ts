/** Macro categorias — uso interno, não visível ao usuário */
export type MacroCategory =
  | "saude"
  | "beleza"
  | "juridico"
  | "imoveis"
  | "financeiro"
  | "construcao"
  | "casa"
  | "servicos"
  | "educacao"
  | "automotivo"
  | "alimentacao"
  | "pets"
  | "geral";

export type MatchTier = "exact" | "related" | "dynamic";

export type TemplateSlug =
  | "estetica"
  | "clinica"
  | "dentista"
  | "advogado"
  | "imobiliaria"
  | "contabilidade"
  | "financeiro"
  | "energia-solar"
  | "construcao"
  | "servicos-locais"
  | "automotivo"
  | "educacao"
  | "alimentacao"
  | "pets"
  | "outro";

export interface MicroverticalDefinition {
  id: string;
  label: string;
  keywords: string[];
  macroCategory: MacroCategory;
  /** Slug da LP-template (bastidores) */
  templateSlug: TemplateSlug;
  priority: "high" | "medium" | "low";
  heroHighlight: string;
  businessType: string;
  yourBusinessLabel: string;
  /** Serviços sugeridos no passo 3 do diagnóstico */
  suggestedServices: string[];
  /** Gera exemplos de busca — city opcional até o usuário informar */
  searchExamples: (term: string, city?: string) => string[];
}

export interface BusinessMatch {
  tier: MatchTier;
  /** Termo original digitado pelo usuário */
  userTerm: string;
  /** Rótulo exibido na confirmação */
  displayLabel: string;
  microverticalId: string | null;
  macroCategory: MacroCategory;
  templateSlug: TemplateSlug;
  heroHighlight: string;
  businessType: string;
  yourBusinessLabel: string;
  suggestedServices: string[];
  searchExamples: (city?: string) => string[];
}

export interface BusinessPersonalization {
  userTerm: string;
  displayLabel: string;
  tier: MatchTier;
  macroCategory: MacroCategory;
  heroHighlight: string;
  businessType: string;
  yourBusinessLabel: string;
  searchExamples: string[];
  fomoSubtitle?: string;
}
