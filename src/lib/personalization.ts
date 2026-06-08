/** Anexa cidade à query de busca quando ainda não estiver presente */
export function searchQueryWithCity(query: string, city?: string): string {
  if (!city?.trim()) return query;
  const cityNorm = city.trim().toLowerCase();
  if (query.toLowerCase().includes(cityNorm)) return query;
  return `${query} ${cityNorm}`;
}
