import type { Case } from "@/types/case";

export function hasItems<T>(items?: T[]): items is T[] {
  return Array.isArray(items) && items.length > 0;
}

export function hasText(value?: string): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function hasStorytelling(caseData: Case): boolean {
  const s = caseData.storytelling;
  if (!s) return false;
  return (
    hasText(s.context) ||
    hasText(s.challenge) ||
    hasText(s.strategy) ||
    hasItems(s.decisions) ||
    hasItems(s.lessonsLearned) ||
    hasText(s.impact) ||
    hasItems(s.timeline) ||
    hasItems(s.backstage) ||
    hasItems(s.processGallery)
  );
}

export function hasDesignDetails(caseData: Case): boolean {
  const d = caseData.design;
  if (!d) return false;
  return (
    hasItems(d.uiHighlights) ||
    hasItems(d.components) ||
    hasItems(d.interactions) ||
    hasItems(d.colors) ||
    !!d.typography
  );
}

export function hasDevelopment(caseData: Case): boolean {
  const d = caseData.development;
  if (!d) return false;
  return (
    hasText(d.architecture) ||
    hasItems(d.integrations) ||
    hasItems(d.performanceOptimizations) ||
    hasItems(d.accessibility) ||
    hasItems(d.seo)
  );
}

export function hasMarketing(caseData: Case): boolean {
  const m = caseData.marketing;
  if (!m) return false;
  return hasText(m.positioning) || hasText(m.copyStrategy) || hasText(m.conversionStrategy);
}

export function hasExtendedResults(caseData: Case): boolean {
  const r = caseData.results;
  if (!r) return false;
  return hasItems(r.metrics) || hasItems(r.qualitativeResults) || hasItems(r.clientWins);
}

export function hasContent(caseData: Case): boolean {
  const c = caseData.content;
  if (!c) return false;
  return hasItems(c.faqs) || hasItems(c.curiosities) || hasItems(c.quotes);
}
