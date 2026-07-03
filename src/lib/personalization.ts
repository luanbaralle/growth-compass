/** "Seu salão" → "seu salão" — mantém artigo correto (seu/sua) em frases corridas */
export function toLowerPossessive(yourBusinessLabel: string): string {
  const trimmed = yourBusinessLabel.trim();
  if (!trimmed) return "sua empresa";
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

export function visibilityCtaQuestion(yourBusinessLabel: string): string {
  return `Quando pesquisam, ${toLowerPossessive(yourBusinessLabel)} aparece?`;
}

export function visibilityClosingLine(yourBusinessLabel: string): string {
  return `Mas nada disso importa para quem nunca encontrou ${toLowerPossessive(yourBusinessLabel)}.`;
}

export function formOpportunityTitle(yourBusinessLabel: string): {
  title: string;
  titleHighlight: string;
} {
  return {
    title: `Descubra se ${toLowerPossessive(yourBusinessLabel)} está aparecendo`,
    titleHighlight: "no momento certo.",
  };
}

/** Anexa cidade à query de busca quando ainda não estiver presente */
export function searchQueryWithCity(query: string, city?: string): string {
  if (!city?.trim()) return query;
  const cityNorm = city.trim().toLowerCase();
  if (query.toLowerCase().includes(cityNorm)) return query;
  return `${query} ${cityNorm}`;
}
