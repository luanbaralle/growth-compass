/**
 * Raise One Copilot — tipos centrais
 * Ver docs/os/copilot-vision.md
 */

export type DiagnosticDomain =
  | "business"
  | "offer"
  | "customer"
  | "commercial"
  | "economics"
  | "acquisition"
  | "marketing"
  | "brand"
  | "content"
  | "goals"
  | "expectations"
  | "investment";

export type ObjectiveImportance = "critical" | "high" | "medium" | "low";

export type CaptureType =
  | "numeric"
  | "numeric_range"
  | "enum"
  | "text"
  | "boolean"
  | "list";

export type ObjectiveState =
  | "unknown"
  | "exploring"
  | "captured"
  | "verified"
  | "contradicted"
  | "not_applicable";

export type EvidenceConfidence = "low" | "medium" | "high";

export type EvidenceSource =
  | "prospect_statement"
  | "ai_inference"
  | "human_verified";

export type EvidenceKind = "fact" | "inference" | "hypothesis";

export type CopilotOrbState =
  | "listening"
  | "understanding"
  | "insight"
  | "suggestion"
  | "capture"
  | "warning"
  | "idle";

export type MeetingMode =
  | "discovery_qualification"
  | "briefing"
  | "strategy"
  | "review"
  | "sales_proposal";

export type ConversationSegmentKind =
  | "statement"
  | "storytelling"
  | "emotional_narrative"
  | "question"
  | "numeric_data"
  | "objection"
  | "silence";

export interface DiscoveryObjective {
  key: string;
  domain: DiagnosticDomain;
  label: string;
  description: string;
  whyItMatters: string;
  importance: ObjectiveImportance;
  captureType: CaptureType;
  requiredEvidence: string;
  questions: string[];
  dependencies?: string[];
  relatedObjectives?: string[];
  positiveSignals?: string[];
  negativeSignals?: string[];
  confidenceThreshold: number;
  /** Objetivo crítico para proposal readiness */
  proposalCritical?: boolean;
}

export interface Evidence {
  value: unknown;
  confidence: EvidenceConfidence;
  source: EvidenceSource;
  kind: EvidenceKind;
  quote?: string;
  capturedAt: string;
}

export interface ObjectiveRecord {
  state: ObjectiveState;
  evidence: Evidence | null;
  history: Evidence[];
}

export type DiagnosticState = Record<string, ObjectiveRecord>;

export interface MeetingObjective {
  title: string;
  prospectName: string;
  companyName: string;
  purpose: string;
  expectedOutputs: string[];
}

export interface TranscriptSegment {
  id: string;
  speaker: "prospect" | "consultant" | "unknown";
  text: string;
  startedAt: string;
  endedAt?: string;
  sequence?: number;
  confidence?: number;
  speakerConfidence?: number;
  source?: "manual_paste" | "live_stt" | "import";
  analyzedAt?: string;
  kind?: ConversationSegmentKind;
}

export interface ConversationThread {
  domain: DiagnosticDomain;
  label: string;
  summary: string;
}

export interface InsightCard {
  type: "discovery" | "inference" | "warning";
  title: string;
  body: string;
  objectiveKey?: string;
}

export interface SuggestionCard {
  objectiveKey: string;
  exploreLabel: string;
  suggestedQuestion: string;
  reason: string;
  score: number;
}

export interface DomainCoverage {
  domain: DiagnosticDomain;
  label: string;
  percent: number;
  captured: number;
  total: number;
}

export interface ProposalReadinessItem {
  key: string;
  label: string;
  status: "ready" | "partial" | "missing";
}

export interface ProposalReadiness {
  items: ProposalReadinessItem[];
  status: "ready" | "partial" | "not_ready";
  blockers: string[];
}

export interface DataInconsistency {
  objectiveKey: string;
  label: string;
  previousValue: string;
  newValue: string;
  previousQuote?: string;
  newQuote?: string;
}

export interface BusinessProfileNode {
  key: string;
  label: string;
  value?: string;
  children?: BusinessProfileNode[];
}

export interface BusinessProfile {
  companyName?: string;
  contactName?: string;
  roots: BusinessProfileNode[];
}

export interface CopilotNarratorMessage {
  id: string;
  role: "copilot";
  content: string;
  tone: CopilotNarratorTone;
  suggestedQuestion?: string;
  objectiveKey?: string;
  createdAt: string;
  turnSegmentId?: string;
}

export type CopilotNarratorTone =
  | "welcome"
  | "observation"
  | "insight"
  | "suggestion"
  | "hold"
  | "warning";

export type MeetingPhase =
  | "opening"
  | "context"
  | "discovery"
  | "deep_discovery"
  | "qualification"
  | "synthesis"
  | "closing";

export type CopilotAction = "observe" | "capture" | "explore" | "clarify" | "recommend";

export interface CopilotSessionSnapshot {
  id: string;
  mode: MeetingMode;
  meetingObjective: MeetingObjective;
  orbState: CopilotOrbState;
  transcript: TranscriptSegment[];
  diagnosticState: DiagnosticState;
  businessProfile: BusinessProfile;
  coverage: DomainCoverage[];
  overallCoverage: number;
  proposalReadiness: ProposalReadiness;
  currentThread: ConversationThread | null;
  latestInsight: InsightCard | null;
  suggestion: SuggestionCard | null;
  inconsistencies: DataInconsistency[];
  suppressSuggestion: boolean;
  suppressReason?: string;
  elapsedSeconds: number;
  narratorMessages: CopilotNarratorMessage[];
  meetingPhase: MeetingPhase;
  copilotAction: CopilotAction;
}

export interface ProcessTurnResult {
  snapshot: CopilotSessionSnapshot;
  newInsights: InsightCard[];
  capturedObjectives: string[];
  actionDecision?: { action: CopilotAction; reason: string };
}
