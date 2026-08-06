import type { ScriptType } from "@/domains/prospection/types";

export interface PlaybookObjection {
  objection: string;
  response: string;
  objective: string;
}

export interface SegmentPlaybook {
  slug: string;
  scripts: Partial<Record<ScriptType, string>>;
  objections: PlaybookObjection[];
  qualifications: string[];
}

export const SCRIPT_DISPLAY_ORDER: ScriptType[] = [
  "segment_overview",
  "pre_contact_checklist",
  "conversation_philosophy",
  "first_approach_examples",
  "conversation_patterns",
  "conversation_questions",
  "when_to_present_raise_one",
  "how_to_present_raise_one",
  "best_practices",
];
