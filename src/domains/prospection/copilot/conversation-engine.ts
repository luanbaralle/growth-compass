import {
  buildRaiseOneContent,
  formatDiscoverySummary,
  getObjective,
  resolveNextObjective,
} from "./graph/saloes";
import type { SaloesConversationContext, SaloesDiscoveries } from "./graph/types";
import { RESPECTFUL_CLOSING_TEMPLATE } from "./opening";
import { personalize } from "./engine";
import type { ProspectAssistantState } from "./types";

export const SALOES_SEGMENT_SLUG = "saloes";

export function usesConversationGraph(segmentSlug: string): boolean {
  return segmentSlug === SALOES_SEGMENT_SLUG;
}

export function buildConversationContext(
  state: ProspectAssistantState,
  prospect: { name: string; city: string | null },
): SaloesConversationContext {
  const discoveries = (state.discoveries ?? {}) as SaloesDiscoveries;
  const resolved = resolveNextObjective(discoveries);

  const raiseOne =
    resolved.key === "raise_one" || state.step === "raise_one"
      ? buildRaiseOneContent(discoveries)
      : null;

  const closingMessage =
    resolved.key === "close_respectful"
      ? personalize(RESPECTFUL_CLOSING_TEMPLATE, { name: prospect.name, city: prospect.city })
      : null;

  const showConversation = state.step === "conversation" && resolved.key !== "close_respectful";

  const currentObjective =
    showConversation && resolved.key ? getObjective(resolved.key, discoveries) : null;

  return {
    currentObjective,
    nextObjective: null,
    discoveries,
    raiseOne,
    closingMessage,
    discoveryLabels: formatDiscoverySummary(discoveries),
    isComplete: resolved.step === "done" && !raiseOne,
  };
}

export function mergeDiscovery(
  discoveries: SaloesDiscoveries,
  discoveryKey: keyof SaloesDiscoveries,
  discoveryValue: string,
): SaloesDiscoveries {
  return { ...discoveries, [discoveryKey]: discoveryValue };
}

export { resolveNextObjective, getObjective, buildRaiseOneContent };
