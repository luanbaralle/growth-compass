export type AssistantStep =
  | "observations"
  | "openings"
  | "awaiting_reply"
  | "no_reply"
  | "response_state"
  | "continuation"
  | "done";

export type ReplyStatus = "waiting" | "no_reply" | "replied";

export interface CopilotObservation {
  key: string;
  label: string;
}

export interface CopilotOpening {
  id: string;
  observationKeys: string[];
  template: string;
}

export interface CopilotResponseState {
  key: string;
  label: string;
  group: "business" | "objection" | "raise_one" | "other";
}

export interface CopilotContinuation {
  responseStateKey: string;
  template: string;
}

export interface CopilotNoReplyAction {
  key: string;
  label: string;
  hint: string;
  followUpDays?: number;
}

export interface CopilotRaiseOneReply {
  responseStateKey: string;
  template: string;
}

export interface SegmentCopilot {
  slug: string;
  name: string;
  observations: CopilotObservation[];
  openings: CopilotOpening[];
  responseStates: CopilotResponseState[];
  continuations: CopilotContinuation[];
  noReplyActions: CopilotNoReplyAction[];
  raiseOneReplies: CopilotRaiseOneReply[];
  closings: string[];
}

export interface ProspectAssistantState {
  prospect_id: string;
  step: AssistantStep;
  selected_observations: string[];
  selected_opening_id: string | null;
  opening_text: string | null;
  opening_used: boolean;
  reply_status: ReplyStatus | null;
  response_state_key: string | null;
  updated_at: string;
}

export interface CopilotBundle {
  segment: SegmentCopilot;
  segmentSlug: string;
  state: ProspectAssistantState;
  prospect: {
    id: string;
    name: string;
    city: string | null;
    category: string | null;
    segmentSlug: string | null;
  };
}

export const SEGMENT_OPTIONS = [
  { slug: "saloes", name: "Salões" },
  { slug: "advogados", name: "Advogados" },
  { slug: "clinicas", name: "Clínicas" },
  { slug: "imobiliarias", name: "Imobiliárias" },
  { slug: "escolas", name: "Escolas" },
  { slug: "contabilidade", name: "Contabilidade" },
  { slug: "restaurantes", name: "Restaurantes" },
  { slug: "academias", name: "Academias" },
] as const;
