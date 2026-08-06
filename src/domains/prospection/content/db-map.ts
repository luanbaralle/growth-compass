import type { ScriptType } from "@/domains/prospection/types";

/** Mapeia tipos lógicos do playbook para colunas existentes no banco. */
export const SCRIPT_TYPE_TO_DB: Record<ScriptType, string> = {
  segment_overview: "segment_overview",
  pre_contact_checklist: "express_diagnosis",
  conversation_philosophy: "opportunity_signals",
  first_approach_examples: "initial",
  conversation_patterns: "continuation",
  conversation_questions: "products",
  when_to_present_raise_one: "followup_1",
  how_to_present_raise_one: "cta",
  best_practices: "best_practices",
};

export const DB_TO_SCRIPT_TYPE: Record<string, ScriptType> = Object.fromEntries(
  Object.entries(SCRIPT_TYPE_TO_DB).map(([logical, db]) => [db, logical as ScriptType]),
) as Record<string, ScriptType>;

export const LEGACY_SCRIPT_TYPES = [
  "followup_2",
  "followup_3",
  "free_diagnosis",
  "reference_cases",
] as const;
