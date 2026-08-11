export type SaloesObjectiveKey =
  | "client_origin"
  | "current_satisfaction"
  | "growth_desire"
  | "limitation"
  | "willingness_to_act"
  | "raise_one";

export type SaloesTerminalKey = "close_respectful";

export interface SaloesDiscoveries {
  client_origin?: string;
  current_satisfaction?: string;
  growth_desire?: string;
  limitation?: string;
  willingness_to_act?: string;
}

export interface AnswerOption {
  key: string;
  label: string;
}

export interface ConversationObjective {
  key: SaloesObjectiveKey | SaloesTerminalKey;
  title: string;
  question: string;
  answerOptions: AnswerOption[];
}

export interface RaiseOneContent {
  opportunity: string;
  connection: string;
  transition: string;
  nextStep: string;
}

export interface ResolveNextObjectiveResult {
  key: SaloesObjectiveKey | SaloesTerminalKey | null;
  step: "conversation" | "raise_one" | "done";
}

export interface SaloesConversationContext {
  currentObjective: ConversationObjective | null;
  nextObjective: ConversationObjective | null;
  discoveries: SaloesDiscoveries;
  raiseOne: RaiseOneContent | null;
  closingMessage: string | null;
  discoveryLabels: Record<string, string>;
  isComplete: boolean;
}
