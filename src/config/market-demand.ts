import { MICROVERTICALS } from "@/config/microverticals/registry";
import type { MacroCategory } from "@/config/microverticals/types";

/** Tier de demanda local — baseado em volume de busca + fit com Raise One */
export type DemandTier = "A" | "B" | "C";

export const DEMAND_TIER_LABELS: Record<DemandTier, string> = {
  A: "Alta conversão",
  B: "Alto volume",
  C: "Ouro escondido",
};

/** Chips visíveis de cara — top 8 por volume de busca local (BR) */
export const FEATURED_MARKET_LABELS = [
  "Dentista",
  "Barbearia",
  "Clínica Estética",
  "Psicólogo",
  "Hamburgueria",
  "Oficina Mecânica",
  "Corretor de Imóveis",
  "Padaria",
] as const;

export const FEATURED_MICROVERTICAL_IDS = new Set([
  "dentista",
  "barbearia",
  "estetica",
  "psicologo",
  "hamburgueria",
  "oficina",
  "corretor-imoveis",
  "padaria",
]);

/** Tier por microvertical — alinhado ao mapeamento de mercado */
export const DEMAND_TIER_BY_ID: Record<string, DemandTier> = {
  // Tier A — alta conversão
  dentista: "A",
  "clinica-odontologica": "A",
  estetica: "A",
  "harmonizacao-facial": "A",
  advogado: "A",
  "advogado-trabalhista": "A",
  "advogado-previdenciario": "A",
  "advogado-criminal": "A",
  contabilidade: "A",
  imobiliaria: "A",
  "corretor-imoveis": "A",
  psicologo: "A",
  fisioterapia: "A",
  dermatologista: "A",
  ginecologista: "A",
  cardiologista: "A",
  ortopedista: "A",
  oftalmologista: "A",
  "medico-particular": "A",
  "exames-laboratoriais": "A",
  "clinica-imagem": "A",
  hamburgueria: "A",
  pizzaria: "A",
  padaria: "A",
  marmitaria: "A",
  oficina: "A",
  "auto-center": "A",
  "estetica-automotiva": "A",
  "escola-particular": "A",
  autoescola: "A",
  "corretor-seguros": "A",

  // Tier B — alto volume
  barbearia: "B",
  salao: "B",
  manicure: "B",
  veterinario: "B",
  "pet-shop": "B",
  academia: "B",
  "clinica-medica": "B",
  nutricionista: "B",
  restaurante: "B",
  sushi: "B",
  confeitaria: "B",
  churrascaria: "B",
  buffet: "B",
  "escola-idiomas": "B",
  "reforco-escolar": "B",
  "cursos-profissionalizantes": "B",
  "cursos-preparatorios": "B",
  funilaria: "B",
  "martelinho-ouro": "B",
  "auto-eletrica": "B",
  insulfilm: "B",
  "lava-rapido": "B",
  arquitetura: "B",
  "engenharia-civil": "B",
  "limpeza-residencial": "B",
  "ar-condicionado": "B",
  "clinica-capilar": "B",
  podologia: "B",
  "advogado-familia": "B",
  "consultoria-financeira": "B",
  consorcio: "B",
  "credito-imobiliario": "B",
  "emprestimo-consignado": "B",
  "planejamento-financeiro": "B",
  "administracao-condominios": "B",
  "avaliacao-imobiliaria": "B",
  marcenaria: "B",
  "designer-interiores": "B",
  "seguranca-eletronica": "B",
  "instalacao-cameras": "B",
  jardinagem: "B",
  delivery: "B",
  "transplante-capilar": "B",
  bronzeamento: "B",
  "estudio-tatuagem": "B",
  fonoaudiologo: "B",
  "terapia-ocupacional": "B",
  quiropraxia: "B",
  acupuntura: "B",
  "home-care": "B",
  "advogado-imobiliario": "B",
  "correspondente-juridico": "B",

  // Tier C — ouro escondido
  dedetizacao: "C",
  desentupidora: "C",
  guincho: "C",
  mudancas: "C",
  chaveiro: "C",
  encanador: "C",
  eletricista: "C",
  pintor: "C",
  vidracaria: "C",
  serralheria: "C",
  "gesso-drywall": "C",
  esquadrias: "C",
  impermeabilizacao: "C",
  "limpeza-pos-obra": "C",
  telhados: "C",
  calhas: "C",
  piscinas: "C",
  construcao: "C",
  "energia-solar": "C",
  monitoramento: "C",
  "limpeza-comercial": "C",
  "assistencia-tecnica": "C",
  "transporte-executivo": "C",
  "rastreador-veicular": "C",
  "locadora-veiculos": "C",
  lash: "C",
  micropigmentacao: "C",
  depilacao: "C",
  "banho-e-tosa": "C",
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
  alimentacao: "Alimentação",
  pets: "Pets",
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
