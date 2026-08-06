import { SEGMENT_SLUGS } from "./index";
import type { SegmentVisual } from "./types";

function photo(id: string, w = 900): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/** Imagens curadas (Unsplash) — aparência premium e contextual por vertical */
export const SEGMENT_VISUALS: Record<string, SegmentVisual> = {
  clinica: {
    heroImage: photo("photo-1576091160399-112ba8d25d1d"),
    heroImageAlt: "Profissional de saúde em consultório moderno",
    overlayLabel: "Clínica & saúde",
  },
  dentista: {
    heroImage: photo("photo-1629909613654-28e377c37b09"),
    heroImageAlt: "Consultório odontológico moderno",
    overlayLabel: "Odontologia premium",
  },
  estetica: {
    heroImage: photo("photo-1576091160550-2173dba999ef"),
    heroImageAlt: "Ambiente de clínica estética premium",
    overlayLabel: "Estética & bem-estar",
  },
  advogado: {
    heroImage: photo("photo-1497366216548-37526070297c"),
    heroImageAlt: "Escritório de advocacia moderno",
    overlayLabel: "Advocacia & confiança",
  },
  imobiliaria: {
    heroImage: photo("photo-1560518883-ce09059eeffa"),
    heroImageAlt: "Imóvel e oportunidades de mercado",
    overlayLabel: "Mercado imobiliário local",
  },
  contabilidade: {
    heroImage: photo("photo-1554224155-6726b3ff858f"),
    heroImageAlt: "Profissional contábil analisando documentos fiscais",
    overlayLabel: "Contabilidade & compliance",
  },
  financeiro: {
    heroImage: photo("photo-1579621970563-ebec7560ff3e"),
    heroImageAlt: "Consultoria financeira e planejamento patrimonial",
    overlayLabel: "Crédito & proteção financeira",
  },
  "energia-solar": {
    heroImage: photo("photo-1509391366360-2e959784a276"),
    heroImageAlt: "Painéis solares instalados em residência",
    overlayLabel: "Energia solar & economia",
  },
  construcao: {
    heroImage: photo("photo-1504307651254-35680f356dfd"),
    heroImageAlt: "Equipe em obra de construção civil",
    overlayLabel: "Obras & reformas",
  },
  "servicos-locais": {
    heroImage: photo("photo-1621905251189-08b45d6a269e"),
    heroImageAlt: "Profissional de serviços residenciais em atendimento",
    overlayLabel: "Serviços na sua região",
  },
  automotivo: {
    heroImage: photo("photo-1504328345606-18bbc8c9d7d1"),
    heroImageAlt: "Mecânico em oficina automotiva",
    overlayLabel: "Oficina & auto center",
  },
  educacao: {
    heroImage: photo("photo-1524178232363-1fb2b075b655"),
    heroImageAlt: "Ambiente educacional com alunos em sala de aula",
    overlayLabel: "Educação & matrículas",
  },
  alimentacao: {
    heroImage: photo("photo-1555396273-367ea4eb4db5"),
    heroImageAlt: "Restaurante com ambiente acolhedor para refeições",
    overlayLabel: "Restaurante & delivery",
  },
  pets: {
    heroImage: photo("photo-1587300003388-59208cc962cb"),
    heroImageAlt: "Tutor com pet em clínica veterinária",
    overlayLabel: "Pets & bem-estar animal",
  },
  outro: {
    heroImage: photo("photo-1600880292089-90a7e086ee0c"),
    heroImageAlt: "Equipe de negócio local em reunião estratégica",
    overlayLabel: "Negócios locais",
  },
};

export const DEFAULT_VISUAL: SegmentVisual = {
  heroImage: photo("photo-1460925895917-afdab827c52f"),
  heroImageAlt: "Análise de mercado e oportunidades locais",
  overlayLabel: "Inteligência de mercado",
};

export function getSegmentVisual(slug: string, hubLabel?: string): SegmentVisual {
  const visual = SEGMENT_VISUALS[slug];
  if (visual) return visual;

  return {
    ...DEFAULT_VISUAL,
    overlayLabel: hubLabel ?? DEFAULT_VISUAL.overlayLabel,
  };
}

/** Valida URLs do registro (útil em scripts de CI). */
export async function validateSegmentVisuals(): Promise<string[]> {
  const urls = new Set<string>();
  for (const visual of Object.values(SEGMENT_VISUALS)) {
    urls.add(visual.heroImage);
  }

  const broken: string[] = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: "HEAD", redirect: "follow" });
      if (!res.ok) broken.push(url);
    } catch {
      broken.push(url);
    }
  }
  return broken;
}

if (import.meta.env.DEV) {
  const missing = SEGMENT_SLUGS.filter((slug) => !(slug in SEGMENT_VISUALS));
  if (missing.length > 0) {
    console.warn(`[segments] Imagens hero ausentes para: ${missing.join(", ")}`);
  }
}
