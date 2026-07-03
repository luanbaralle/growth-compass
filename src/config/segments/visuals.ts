import type { SegmentVisual } from "./types";

/** Imagens curadas (Unsplash) — aparência premium e contextual por vertical */
export const SEGMENT_VISUALS: Record<string, SegmentVisual> = {
  clinica: {
    heroImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
    heroImageAlt: "Profissional de saúde em consultório moderno",
    overlayLabel: "Saúde mental & bem-estar",
  },
  dentista: {
    heroImage:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80",
    heroImageAlt: "Consultório odontológico moderno",
    overlayLabel: "Odontologia premium",
  },
  estetica: {
    heroImage:
      "https://images.unsplash.com/photo-1570172619644-d3b0d63d2b25?auto=format&fit=crop&w=900&q=80",
    heroImageAlt: "Ambiente de clínica estética premium",
    overlayLabel: "Estética & bem-estar",
  },
  advogado: {
    heroImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    heroImageAlt: "Escritório de advocacia moderno",
    overlayLabel: "Autoridade & confiança",
  },
  imobiliaria: {
    heroImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
    heroImageAlt: "Imóvel e oportunidades de mercado",
    overlayLabel: "Mercado imobiliário local",
  },
};

export const DEFAULT_VISUAL: SegmentVisual = {
  heroImage:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
  heroImageAlt: "Análise de mercado e oportunidades locais",
  overlayLabel: "Inteligência de mercado",
};

export function getSegmentVisual(slug: string): SegmentVisual {
  return SEGMENT_VISUALS[slug] ?? DEFAULT_VISUAL;
}
