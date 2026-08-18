/**
 * Corrige durações derivadas calculadas errado pelo LLM.
 * Ex.: "13.5 anos (desde 2008)" em 2026 → "18 anos (desde 2008)".
 */
export function normalizeDerivedDurations(text: string, now = new Date()): string {
  return text.replace(
    /(\d+(?:[.,]\d+)?)\s*anos?\s*\(\s*desde\s*(\d{4})\s*\)/gi,
    (_full, _wrongYears, yearStr: string) => {
      const year = Number(yearStr);
      const currentYear = now.getFullYear();
      if (!Number.isFinite(year) || year < 1900 || year > currentYear) {
        return _full;
      }
      const years = currentYear - year;
      return `${years} ${years === 1 ? "ano" : "anos"} (desde ${year})`;
    },
  );
}

export function normalizeEvidenceGraphValues<
  T extends { value: string; label?: string },
>(items: T[], now = new Date()): T[] {
  return items.map((item) => ({
    ...item,
    value: normalizeDerivedDurations(item.value, now),
    ...(item.label
      ? { label: normalizeDerivedDurations(item.label, now) }
      : {}),
  }));
}
