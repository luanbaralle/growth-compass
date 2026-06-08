import { MICROVERTICALS } from "@/config/microverticals/registry";
import type { MacroCategory } from "@/config/microverticals/types";

/** Tier de demanda local — baseado em volume de busca + fit com Raise One */
export type DemandTier = "A" | "B" | "C";

export const DEMAND_TIER_LABELS: Record<DemandTier, string> = {
  A: "Alta conversão",
  B: "Alto volume",
  C: "Ouro escondido",
};

/** Chips visíveis de cara — top 6 por volume de busca local (BR) */
export const FEATURED_MARKET_LABELS = [
  "Dentista",
  "Barbearia",
  "Salão de Beleza",
  "Clínica Estética",
  "Psicólogo",
  "Academia",
] as const;

export const FEATURED_MICROVERTICAL_IDS = new Set([
  "dentista",
  "barbearia",
  "salao",
  "estetica",
  "psicologo",
  "academia",
]);

/** Tier por microvertical — alinhado ao mapeamento de mercado */
export const DEMAND_TIER_BY_ID: Record<string, DemandTier> = {
  dentista: "A",
  estetica: "A",
  advogado: "A",
  contabilidade: "A",
  imobiliaria: "A",
  psicologo: "A",
  fisioterapia: "A",
  barbearia: "B",
  salao: "B",
  veterinario: "B",
  "pet-shop": "B",
  academia: "B",
  "escola-idiomas": "B",
  "clinica-medica": "B",
  dedetizacao: "C",
  desentupidora: "C",
  guincho: "C",
  mudancas: "C",
  chaveiro: "C",
  encanador: "C",
  eletricista: "C",
};

const CATEGORY_UI_LABELS: Record<MacroCategory, string> = {
  saude: "Saúde",
  beleza: "Beleza e estética",
  juridico: "Jurídico",
  imoveis: "Imobiliário",
  financeiro: "Financeiro",
  construcao: "Casa e construção",
  casa: "Casa e reformas",
  servicos: "Serviços locais",
  educacao: "Educação",
  automotivo: "Automotivo",
  geral: "Outros",
};

const TIER_ORDER: Record<DemandTier, number> = { A: 0, B: 1, C: 2 };
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

function tierFor(id: string): DemandTier {
  return DEMAND_TIER_BY_ID[id] ?? "B";
}

export interface MarketSuggestionGroup {
  category: string;
  labels: string[];
}

/** Segmentos expandidos agrupados por categoria, ordenados por tier de demanda */
export function getGroupedMarketSuggestions(): MarketSuggestionGroup[] {
  const sorted = MICROVERTICALS.filter((mv) => !FEATURED_MICROVERTICAL_IDS.has(mv.id)).sort(
    (a, b) => {
      const tierDiff = TIER_ORDER[tierFor(a.id)] - TIER_ORDER[tierFor(b.id)];
      if (tierDiff !== 0) return tierDiff;
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    },
  );

  const groups = new Map<string, string[]>();

  for (const mv of sorted) {
    const category = CATEGORY_UI_LABELS[mv.macroCategory];
    const list = groups.get(category) ?? [];
    list.push(mv.label);
    groups.set(category, list);
  }

  const categoryOrder = Object.values(CATEGORY_UI_LABELS);

  return categoryOrder
    .filter((cat) => groups.has(cat))
    .map((category) => ({
      category,
      labels: groups.get(category)!,
    }));
}

export function countMoreMarketSuggestions(): number {
  return MICROVERTICALS.filter((mv) => !FEATURED_MICROVERTICAL_IDS.has(mv.id)).length;
}

function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export interface MarketSegmentSuggestion {
  label: string;
  category: string;
}

/** Autocomplete — busca por label e keywords dos segmentos cadastrados */
export function searchMarketSegments(query: string, limit = 8): MarketSegmentSuggestion[] {
  const q = normalizeSearch(query);
  if (q.length < 2) return [];

  const scored: { label: string; category: string; score: number }[] = [];

  for (const mv of MICROVERTICALS) {
    let score = 0;
    const labelNorm = normalizeSearch(mv.label);

    if (labelNorm === q) score += 100;
    else if (labelNorm.startsWith(q)) score += 80;
    else if (labelNorm.includes(q)) score += 50;

    for (const kw of mv.keywords) {
      const kn = normalizeSearch(kw);
      if (kn === q) score += 70;
      else if (kn.startsWith(q)) score += 55;
      else if (kn.includes(q)) score += 35;
    }

    if (score > 0) {
      scored.push({
        label: mv.label,
        category: CATEGORY_UI_LABELS[mv.macroCategory],
        score,
      });
    }
  }

  const seen = new Set<string>();
  return scored
    .sort((a, b) => b.score - a.score)
    .filter((item) => {
      const key = item.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map(({ label, category }) => ({ label, category }));
}
