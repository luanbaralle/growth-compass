import type {
  BusinessProfile,
  CopilotOrbState,
  CopilotSessionSnapshot,
  DataInconsistency,
  DiagnosticState,
  DomainCoverage,
  InsightCard,
  MeetingMode,
  MeetingObjective,
  ProposalReadiness,
  ConversationThread,
  TranscriptSegment,
  CopilotNarratorMessage,
} from "../types";

export type CopilotSessionStatus = "live" | "processing" | "completed" | "cancelled";

export interface CopilotSessionRow {
  id: string;
  prospect_id: string | null;
  meeting_id: string | null;
  mode: MeetingMode;
  status: CopilotSessionStatus;
  meeting_objective: MeetingObjective;
  diagnostic_state: DiagnosticState;
  business_profile: BusinessProfile;
  coverage: DomainCoverage[];
  proposal_readiness: ProposalReadiness;
  current_thread: ConversationThread | null;
  latest_insight: InsightCard | null;
  orb_state: CopilotOrbState;
  suppress_suggestion: boolean;
  suppress_reason: string | null;
  inconsistencies: DataInconsistency[];
  elapsed_seconds: number;
  narrator_messages: CopilotNarratorMessage[];
  meeting_phase: import("../types").MeetingPhase;
  copilot_action: import("../types").CopilotAction;
  last_intelligence_at: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CopilotTranscriptRow {
  id: string;
  session_id: string;
  speaker: TranscriptSegment["speaker"];
  text: string;
  segment_kind: string | null;
  source: "manual_paste" | "live_stt" | "import";
  sequence: number | null;
  started_at: string;
  ended_at: string | null;
  confidence: number | null;
  speaker_confidence: number | null;
  analyzed_at: string | null;
  created_at: string;
}

export interface CopilotMeetingArtifact {
  session_id: string;
  transcript_summary: string | null;
  transcript_segments: TranscriptSegment[];
  diagnosis: Record<string, unknown>;
  opportunities: unknown[];
  unknowns: string[];
  recommended_engagement: Record<string, unknown> | null;
  pain_points: string[];
  goals: string[];
  hypotheses: string[];
  created_at: string;
}

export interface CopilotSessionDetail {
  session: CopilotSessionSnapshot;
  prospectId: string | null;
  status: CopilotSessionStatus;
  artifact: CopilotMeetingArtifact | null;
}
