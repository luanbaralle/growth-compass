import { buildBusinessProfile } from "./business-profile-builder";
import { actionPermitsSuggestion, decideCopilotAction } from "./copilot-action";
import {
  classifySegment,
  describeLiveContext,
  isLikelyConsultantQuestion,
  resolveSpeakerForTurn,
  shouldSuppressSuggestion,
  resolveEffectiveSpeaker,
} from "./conversation-intelligence";
import {
  computeDomainCoverage,
  computeOverallCoverage,
  computeProposalReadiness,
  createEmptyDiagnosticState,
  getActiveDomain,
  upsertEvidence,
} from "./diagnostic-engine";
import { detectInconsistencies, markContradicted } from "./inconsistency-detector";
import { inferMeetingPhase, phaseAllowsExtraction } from "./meeting-phase";
import { buildCurrentThread, resolveNextBestQuestion } from "./next-question";
import { extractFromText, type ExtractionMatch } from "./rule-based-extractor";
import { DIAGNOSTIC_DOMAIN_LABELS } from "../knowledge/domains";
import { getObjectiveByKey } from "../knowledge";
import type {
  CopilotOrbState,
  CopilotSessionSnapshot,
  InsightCard,
  MeetingObjective,
  ProcessTurnResult,
  TranscriptSegment,
} from "../types";

let sessionCounter = 0;

export function createCopilotSession(input: {
  prospectName: string;
  companyName: string;
  mode?: CopilotSessionSnapshot["mode"];
}): CopilotSessionSnapshot {
  sessionCounter += 1;
  const meetingObjective: MeetingObjective = {
    title: `Qualificação comercial — ${input.companyName}`,
    prospectName: input.prospectName,
    companyName: input.companyName,
    purpose:
      "Entender o negócio, identificar gargalos de crescimento e determinar oportunidade de atuação da Raise One.",
    expectedOutputs: [
      "Diagnóstico",
      "Oportunidade",
      "Escopo potencial",
      "Investimento estimado",
      "Próximos passos",
    ],
  };

  const diagnosticState = createEmptyDiagnosticState();
  const coverage = computeDomainCoverage(diagnosticState);

  return {
    id: `copilot-${sessionCounter}-${Date.now()}`,
    mode: input.mode ?? "discovery_qualification",
    meetingObjective,
    orbState: "listening",
    transcript: [],
    diagnosticState,
    businessProfile: buildBusinessProfile(diagnosticState, {
      companyName: input.companyName,
      contactName: input.prospectName,
    }),
    coverage,
    overallCoverage: computeOverallCoverage(coverage),
    knowledgeDepth: 0,
    evidenceGraph: [],
    proposalReadiness: computeProposalReadiness(diagnosticState),
    currentThread: null,
    latestInsight: null,
    suggestion: null,
    inconsistencies: [],
    suppressSuggestion: false,
    elapsedSeconds: 0,
    narratorMessages: [],
    meetingPhase: "opening",
    copilotAction: "observe",
  };
}

export function buildTranscriptSegment(input: {
  id?: string;
  speaker: TranscriptSegment["speaker"];
  text: string;
  startedAt?: string;
  endedAt?: string;
  sequence?: number;
  confidence?: number;
  speakerConfidence?: number;
  source?: TranscriptSegment["source"];
  suggestedQuestion?: string | null;
  speakerContext?: { prospectName?: string; companyName?: string };
}): TranscriptSegment {
  const text = input.text.trim();
  const speaker = resolveSpeakerForTurn(
    input.speaker,
    text,
    input.suggestedQuestion,
    input.speakerContext,
  );

  return {
    id: input.id ?? crypto.randomUUID(),
    speaker,
    text,
    startedAt: input.startedAt ?? new Date().toISOString(),
    endedAt: input.endedAt,
    sequence: input.sequence,
    confidence: input.confidence,
    speakerConfidence: input.speakerConfidence,
    source: input.source,
    kind: classifySegment(text),
  };
}

export function processTranscriptTurn(
  snapshot: CopilotSessionSnapshot,
  input: {
    speaker: TranscriptSegment["speaker"];
    text: string;
    extractions?: ExtractionMatch[];
    segmentId?: string;
    startedAt?: string;
    sequence?: number;
    confidence?: number;
    source?: TranscriptSegment["source"];
  },
): ProcessTurnResult {
  const segment = buildTranscriptSegment({
    id: input.segmentId,
    speaker: input.speaker,
    text: input.text,
    startedAt: input.startedAt,
    sequence: input.sequence,
    confidence: input.confidence,
    source: input.source,
    suggestedQuestion: snapshot.suggestion?.suggestedQuestion,
  });

  const withSegment: CopilotSessionSnapshot = {
    ...snapshot,
    transcript: [...snapshot.transcript, segment],
  };

  return analyzeTranscriptSegment(withSegment, segment, input.extractions);
}

export function analyzeTranscriptSegment(
  snapshotWithSegment: CopilotSessionSnapshot,
  segment: TranscriptSegment,
  llmExtractions?: ExtractionMatch[],
): ProcessTurnResult {
  const snapshot = snapshotWithSegment;
  const text = segment.text;
  const effectiveSpeaker = resolveEffectiveSpeaker(segment);
  const kind = segment.kind ?? classifySegment(text);
  const meetingPhase = inferMeetingPhase(snapshot);

  let diagnosticState = { ...snapshot.diagnosticState };
  const newInsights: InsightCard[] = [];
  const capturedObjectives: string[] = [];
  let inconsistencies = [...snapshot.inconsistencies];
  let orbState: CopilotOrbState = "understanding";
  const recentObjectiveKeys: string[] = [];

  const segmentForPhase = { ...segment, speaker: effectiveSpeaker };
  const canExtractFromSpeaker =
    effectiveSpeaker === "prospect" ||
    (effectiveSpeaker === "unknown" &&
      isSubstantiveSegment(segment) &&
      !isLikelyConsultantQuestion(text));

  const canExtractEvidence =
    phaseAllowsExtraction(meetingPhase, segmentForPhase) &&
    canExtractFromSpeaker &&
    kind !== "question" &&
    !isLikelyConsultantQuestion(text);

  if (canExtractEvidence) {
    const ruleExtractions = extractFromText(text);
    const extractions = mergeExtractions(ruleExtractions, llmExtractions ?? []);

    for (const match of extractions) {
      const existing = diagnosticState[match.objectiveKey];
      const conflicts = detectInconsistencies(
        diagnosticState,
        match.objectiveKey,
        match.evidence,
      );

      if (conflicts.length > 0) {
        inconsistencies = [...inconsistencies, ...conflicts];
        diagnosticState = markContradicted(
          diagnosticState,
          match.objectiveKey,
          match.evidence,
        );
        orbState = "warning";
        newInsights.push({
          type: "warning",
          title: "Data inconsistency",
          body: `${conflicts[0]!.label}: antes ${conflicts[0]!.previousValue}, agora ${conflicts[0]!.newValue}. Validar antes do diagnóstico final.`,
          objectiveKey: match.objectiveKey,
        });
        continue;
      }

      if (
        existing?.evidence &&
        (existing.state === "captured" || existing.state === "verified") &&
        match.evidence.kind !== "inference"
      ) {
        continue;
      }

      if (!existing?.evidence) {
        diagnosticState = upsertEvidence(
          diagnosticState,
          match.objectiveKey,
          match.evidence,
        );
        capturedObjectives.push(match.objectiveKey);
        recentObjectiveKeys.push(match.objectiveKey);

        const obj = getObjectiveByKey(match.objectiveKey);
        const isInference = match.evidence.kind === "inference";

        newInsights.push({
          type: isInference ? "inference" : "discovery",
          title: isInference ? "Insight detectado" : "Você descobriu",
          body: isInference
            ? `${obj?.label ?? match.objectiveKey}: ${formatInsightValue(match.evidence.value)}`
            : `${obj?.label ?? match.objectiveKey} — ${formatInsightValue(match.evidence.value)}`,
          objectiveKey: match.objectiveKey,
        });

        orbState = "insight";
      }
    }
  }

  const transcript = snapshot.transcript;
  const suppress = shouldSuppressSuggestion(segment, transcript.slice(0, -1));

  const activeDomain = getActiveDomain(diagnosticState);
  const latestInsightBody = newInsights[newInsights.length - 1]?.body;

  const currentThread = buildCurrentThread(
    activeDomain,
    diagnosticState,
    latestInsightBody,
  );

  const phaseAfter = inferMeetingPhase({
    ...snapshot,
    diagnosticState,
    transcript,
    overallCoverage: computeOverallCoverage(computeDomainCoverage(diagnosticState)),
  });

  const candidateSuggestion = suppress.suppress
    ? null
    : resolveNextBestQuestion(diagnosticState, {
        activeDomain,
        recentObjectiveKeys,
        meetingPhase: phaseAfter,
        suppress: false,
      });

  const actionDecision = decideCopilotAction({
    snapshot: {
      ...snapshot,
      diagnosticState,
      suggestion: candidateSuggestion,
      meetingPhase: phaseAfter,
    },
    segment,
    capturedObjectives,
    newInsights,
    suppressSuggestion: suppress.suppress,
  });

  const suggestion =
    actionPermitsSuggestion(actionDecision.action) && candidateSuggestion
      ? candidateSuggestion
      : null;

  if (capturedObjectives.length > 0 && orbState !== "warning") {
    orbState = "capture";
  } else if (suggestion && orbState !== "warning") {
    orbState = "suggestion";
  } else if (actionDecision.action === "observe") {
    orbState = "listening";
  } else if (suppress.suppress) {
    orbState = "listening";
  }

  const coverage = computeDomainCoverage(diagnosticState);
  const businessProfile = buildBusinessProfile(diagnosticState, {
    companyName: snapshot.meetingObjective.companyName,
    contactName: snapshot.meetingObjective.prospectName,
  });

  const latestInsight = newInsights[newInsights.length - 1] ?? snapshot.latestInsight;

  return {
    snapshot: {
      ...snapshot,
      transcript,
      diagnosticState,
      businessProfile,
      coverage,
      overallCoverage: computeOverallCoverage(coverage),
      proposalReadiness: computeProposalReadiness(diagnosticState),
      currentThread,
      latestInsight,
      suggestion,
      inconsistencies,
      suppressSuggestion: suppress.suppress || actionDecision.action === "observe",
      suppressReason:
        actionDecision.action === "observe" ? actionDecision.reason : suppress.reason,
      orbState,
      meetingPhase: phaseAfter,
      copilotAction: actionDecision.action,
      elapsedSeconds: snapshot.elapsedSeconds + 1,
    },
    newInsights,
    capturedObjectives,
    actionDecision,
  };
}

function formatInsightValue(value: unknown): string {
  if (typeof value === "object" && value !== null && "min" in value) {
    const r = value as { min?: number; max?: number };
    if (r.min != null && r.max != null && r.min !== r.max) return `~${r.min}-${r.max}`;
    return `~${r.min ?? r.max}`;
  }
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function mergeExtractions(
  primary: ExtractionMatch[],
  secondary: ExtractionMatch[],
): ExtractionMatch[] {
  const map = new Map<string, ExtractionMatch>();
  for (const m of [...primary, ...secondary]) {
    if (!map.has(m.objectiveKey)) map.set(m.objectiveKey, m);
  }
  return [...map.values()];
}

export function getLiveStatusLine(snapshot: CopilotSessionSnapshot): string {
  const last = snapshot.transcript[snapshot.transcript.length - 1];
  if (!last) return "Estou acompanhando a conversa…";

  if (snapshot.copilotAction === "observe" && snapshot.meetingPhase === "opening") {
    return "Construindo contexto da reunião…";
  }

  if (snapshot.copilotAction === "observe") {
    return snapshot.suppressReason ?? "Listening…";
  }

  const threadLabel =
    last.speaker === "prospect" && snapshot.currentThread
      ? DIAGNOSTIC_DOMAIN_LABELS[snapshot.currentThread.domain]
      : undefined;

  return describeLiveContext(last, threadLabel);
}
