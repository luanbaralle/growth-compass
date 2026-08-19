import type { ProposalContent, ProposalMetric } from "../types";

const INTERNAL_METRIC_LABELS = new Set([
  "Profundidade do diagnóstico",
  "Cobertura comercial",
  "Lacunas mapeadas",
  "Modo da proposta",
  "Pontos a validar",
]);

/** Remove métricas internas do Copilot — nunca exibir na proposta pública. */
export function sanitizeClientHeroMetrics(metrics?: ProposalMetric[]): ProposalMetric[] | undefined {
  if (!metrics?.length) return undefined;
  const filtered = metrics.filter((m) => !INTERNAL_METRIC_LABELS.has(m.label));
  return filtered.length > 0 ? filtered.slice(0, 3) : undefined;
}

/** Limpa campos internos antes de renderizar proposta ao cliente. */
export function sanitizePublicProposalContent(content: ProposalContent): ProposalContent {
  return {
    ...content,
    heroMetrics: sanitizeClientHeroMetrics(content.heroMetrics),
    gapsForMeeting2: undefined,
    internalNotes: undefined,
    hero: {
      ...content.hero,
      eyebrow: content.hero.eyebrow?.includes("condicional")
        ? "Raise One Soluções"
        : content.hero.eyebrow ?? "Raise One Soluções",
    },
  };
}
