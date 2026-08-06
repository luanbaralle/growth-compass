const ALIASES: Record<string, string> = {
  salao: "saloes",
  salão: "saloes",
  saloes: "saloes",
  beleza: "saloes",
  estetica: "saloes",
  estética: "saloes",
  advogado: "advogados",
  advogados: "advogados",
  advocacia: "advogados",
  clinica: "clinicas",
  clínica: "clinicas",
  clinicas: "clinicas",
  clínicas: "clinicas",
  imobiliaria: "imobiliarias",
  imobiliária: "imobiliarias",
  imobiliarias: "imobiliarias",
  imobiliárias: "imobiliarias",
  escola: "escolas",
  escolas: "escolas",
  educacao: "escolas",
  educação: "escolas",
  contabilidade: "contabilidade",
  contador: "contabilidade",
  contadores: "contabilidade",
  restaurante: "restaurantes",
  restaurantes: "restaurantes",
  alimentacao: "restaurantes",
  alimentação: "restaurantes",
  academia: "academias",
  academias: "academias",
  fitness: "academias",
};

export function resolveSegmentSlug(
  segmentSlug: string | null | undefined,
  category: string | null | undefined,
): string {
  if (segmentSlug?.trim()) return segmentSlug.trim().toLowerCase();
  if (!category?.trim()) return "saloes";
  const normalized = category.trim().toLowerCase();
  return ALIASES[normalized] ?? normalized;
}
