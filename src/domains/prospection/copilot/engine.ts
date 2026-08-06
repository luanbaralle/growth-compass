import type { CopilotOpening, SegmentCopilot } from "./types";

export function rankOpenings(
  openings: CopilotOpening[],
  selectedKeys: string[],
  limit = 5,
): CopilotOpening[] {
  if (selectedKeys.length === 0) return [];

  const scored = openings
    .map((opening) => {
      const matches = opening.observationKeys.filter((k) => selectedKeys.includes(k)).length;
      const isGeneric = opening.observationKeys.length === 0;
      return { opening, matches, isGeneric };
    })
    .filter(({ matches, isGeneric }) => matches > 0 || isGeneric)
    .sort((a, b) => {
      if (b.matches !== a.matches) return b.matches - a.matches;
      return a.opening.id.localeCompare(b.opening.id);
    });

  const withMatches = scored.filter((s) => s.matches > 0).slice(0, limit);
  if (withMatches.length >= 3) return withMatches.map((s) => s.opening);

  const generics = scored.filter((s) => s.isGeneric).map((s) => s.opening);
  const merged = [...withMatches.map((s) => s.opening)];
  for (const g of generics) {
    if (merged.length >= limit) break;
    if (!merged.find((m) => m.id === g.id)) merged.push(g);
  }
  return merged.slice(0, limit);
}

export function getContinuations(segment: SegmentCopilot, responseStateKey: string, limit = 3) {
  return segment.continuations
    .filter((c) => c.responseStateKey === responseStateKey)
    .slice(0, limit);
}

export function getRaiseOneReply(segment: SegmentCopilot, responseStateKey: string) {
  return segment.raiseOneReplies.find((r) => r.responseStateKey === responseStateKey);
}

export function personalize(
  template: string,
  ctx: { name: string; city?: string | null; business?: string },
): string {
  const firstName = ctx.name.split(/\s+/)[0] ?? ctx.name;
  return template
    .replace(/\[Nome\]/g, firstName)
    .replace(/\[Empresa\]/g, ctx.name)
    .replace(/\[Cidade\]/g, ctx.city?.trim() || "sua cidade")
    .replace(/\[Negócio\]/g, ctx.business?.trim() || ctx.name);
}
