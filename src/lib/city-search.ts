import { BRAZIL_CITIES, formatCity, type BrazilCity } from "@/data/brazil-cities";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scoreCity(city: BrazilCity, query: string): number {
  const name = normalize(city.name);
  const full = normalize(formatCity(city));
  const q = normalize(query);

  if (!q) return 0;
  if (name === q) return 100;
  if (name.startsWith(q)) return 80 - (name.length - q.length);
  if (name.includes(q)) return 50;
  if (full.includes(q)) return 40;
  // Match por UF quando digita "santos sp"
  if (`${name} ${city.state.toLowerCase()}`.includes(q)) return 45;
  return 0;
}

export function searchCities(query: string, limit = 8): BrazilCity[] {
  const q = query.trim();
  if (!q) return [];

  return BRAZIL_CITIES.filter((city) => scoreCity(city, q) > 0)
    .sort((a, b) => scoreCity(b, q) - scoreCity(a, q))
    .slice(0, limit);
}

export function findExactCity(input: string): BrazilCity | null {
  const q = normalize(input.trim());
  if (!q) return null;

  return (
    BRAZIL_CITIES.find((city) => {
      const name = normalize(city.name);
      const full = normalize(formatCity(city));
      return name === q || full === q || `${name} ${city.state.toLowerCase()}` === q;
    }) ?? null
  );
}

export function citiesMatch(a: BrazilCity, b: BrazilCity): boolean {
  return a.name === b.name && a.state === b.state;
}
