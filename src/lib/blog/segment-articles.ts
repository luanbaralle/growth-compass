/** Mapeamento segmento → slugs de artigos recomendados no blog */
export const SEGMENT_BLOG_ARTICLES: Record<string, string[]> = {
  educacao: [
    "google-ads-captacao-alunos",
    "como-estruturar-campanhas-google-ads",
    "funil-de-aquisicao-guia",
  ],
  imobiliaria: [
    "marketing-imobiliario-portal-crm-campanhas",
    "ia-marketing-imobiliario",
    "seo-local-guia-completo",
  ],
  estetica: [
    "google-ads-clinicas-estetica",
    "seo-local-guia-completo",
    "meta-ads-vs-google-ads",
  ],
  clinica: [
    "google-ads-clinicas-estetica",
    "seo-local-guia-completo",
    "landing-page-captacao-leads-elementos",
  ],
};

export function getSegmentBlogSlugs(segmentSlug: string): string[] {
  return SEGMENT_BLOG_ARTICLES[segmentSlug] ?? [];
}
