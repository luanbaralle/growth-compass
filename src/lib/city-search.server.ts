import type { BrazilCity } from "@/data/brazil-cities";
import { formatCity } from "@/data/brazil-cities";
import municipiosData from "@/data/municipios-ibge.json";

const allCities = municipiosData as BrazilCity[];

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
  if (`${name} ${city.state.toLowerCase()}`.includes(q)) return 45;
  return 0;
}

export async function searchCitiesServer(query: string, limit = 8): Promise<BrazilCity[]> {
  const q = query.trim();
  if (!q) return [];

  return allCities
    .filter((city) => scoreCity(city, q) > 0)
    .sort((a, b) => scoreCity(b, q) - scoreCity(a, q))
    .slice(0, limit);
}
