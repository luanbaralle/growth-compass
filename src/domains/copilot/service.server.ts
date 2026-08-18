import { randomUUID } from "node:crypto";
import * as events from "./copilot-domain-events.server";
import {
  generateNarratorTurn,
  generateWelcomeMessage,
} from "./engine/copilot-narrator";
import { extractEvidenceFromText } from "./engine/evidence-extractor";
import {
  resolveEffectiveSpeaker,
  isLikelyConsultantQuestion,
} from "./engine/conversation-intelligence";
import {
  analyzeTranscriptSegment,
  buildTranscriptSegment,
  createCopilotSession,
} from "./engine/session-processor";
import { extractFromText } from "./engine/rule-based-extractor";
import { isSubstantiveSegment } from "./engine/meeting-phase";
import { getObjectiveByKey } from "./knowledge";
import { upsertEvidence } from "./engine/diagnostic-engine";
import { buildMeetingArtifact } from "./meeting/artifact-builder";
import * as repo from "./meeting/repository.server";
import {
  rowToSnapshot,
  snapshotToRowPatch,
  transcriptRowToSegment,
} from "./meeting/session-mapper";
import type { CopilotSessionDetail } from "./meeting/types";
import type { Evidence, MeetingMode, TranscriptSegment } from "./types";
import type { TeamMember } from "@/lib/auth/types";
import { dbInsert, dbUpdate } from "@/lib/supabase/server";
import { transcribeAudioBase64, isSttConfigured } from "@/lib/llm/openrouter-stt.server";

export async function startSession(
  input: {
    prospectName: string;
    companyName: string;
    prospectId?: string | null;
    mode?: MeetingMode;
  },
  actor: TeamMember | null,
): Promise<CopilotSessionDetail> {
  const snapshot = createCopilotSession({
    prospectName: input.prospectName,
    companyName: input.companyName,
    mode: input.mode,
  });

  const sessionId = randomUUID();
  snapshot.id = sessionId;

  let meetingId: string | null = null;
  if (input.prospectId) {
    const [meeting] = await dbInsert<{ id: string }>("meetings", {
      id: randomUUID(),
      title: snapshot.meetingObjective.title,
      starts_at: new Date().toISOString(),
      prospect_id: input.prospectId,
      company_id: null,
      mode: input.mode ?? "discovery_qualification",
      objective: snapshot.meetingObjective.purpose,
      status: "live",
      attendees: [],
      notes: null,
    });
    meetingId = meeting?.id ?? null;
  }

  const welcome = await generateWelcomeMessage(snapshot);

  const row = await repo.insertSession({
    id: sessionId,
    prospect_id: input.prospectId ?? null,
    meeting_id: meetingId,
    mode: input.mode ?? "discovery_qualification",
    status: "live",
    meeting_objective: snapshot.meetingObjective,
    diagnostic_state: snapshot.diagnosticState,
    business_profile: snapshot.businessProfile,
    coverage: snapshot.coverage,
    proposal_readiness: snapshot.proposalReadiness,
    current_thread: null,
    latest_insight: null,
    orb_state: snapshot.orbState,
    suppress_suggestion: false,
    suppress_reason: null,
    inconsistencies: [],
    elapsed_seconds: 0,
    narrator_messages: [welcome],
    meeting_phase: "opening",
    copilot_action: "observe",
    last_intelligence_at: null,
    knowledge_depth: 0,
    evidence_graph: [],
    briefing_qa_messages: [],
    started_at: new Date().toISOString(),
  });

  await events.emitCopilotSessionStarted({
    sessionId: row.id,
    prospectId: input.prospectId ?? null,
    companyName: input.companyName,
    actorId: actor,
  });

  return {
    session: rowToSnapshot(row, []),
    prospectId: input.prospectId ?? null,
    status: "live",
    artifact: null,
    briefingQaMessages: [],
  };
}

export async function getSession(sessionId: string): Promise<CopilotSessionDetail | null> {
  const row = await repo.findSessionById(sessionId);
  if (!row) return null;

  const segments = await repo.findTranscriptSegments(sessionId);
  const artifact = await repo.findArtifact(sessionId);

  if (artifact && !artifact.transcript_segments) {
    artifact.transcript_segments = [];
  }

  const snapshot = rowToSnapshot(
    row,
    segments.map(transcriptRowToSegment),
  );

  if (artifact) {
    if (artifact.evidence_graph?.length) {
      snapshot.evidenceGraph = artifact.evidence_graph;
    }
    if (artifact.knowledge_depth) {
      snapshot.knowledgeDepth = artifact.knowledge_depth;
    }
  }

  const { resolveNextBestQuestion } = await import("./engine/next-question");
  const { getActiveDomain } = await import("./engine/diagnostic-engine");
  const { actionPermitsSuggestion } = await import("./engine/copilot-action");
  const activeDomain = getActiveDomain(snapshot.diagnosticState);
  const candidate = snapshot.suppressSuggestion
    ? null
    : resolveNextBestQuestion(snapshot.diagnosticState, {
        activeDomain,
        meetingPhase: snapshot.meetingPhase,
      });
  snapshot.suggestion =
    candidate && actionPermitsSuggestion(snapshot.copilotAction) ? candidate : null;

  return {
    session: snapshot,
    prospectId: row.prospect_id,
    status: row.status,
    artifact,
    briefingQaMessages: row.briefing_qa_messages ?? [],
  };
}

/** Fase 2 — persiste segmento bruto sem rodar inteligência. */
export async function appendSegment(
  sessionId: string,
  input: {
    segmentId?: string;
    speaker: TranscriptSegment["speaker"];
    text: string;
    source?: "manual_paste" | "live_stt";
    startedAt?: string;
    confidence?: number;
    speakerConfidence?: number;
  },
): Promise<{ segment: TranscriptSegment; detail: CopilotSessionDetail }> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (detail.status !== "live") throw new Error("Sessão já encerrada.");

  const sequence = (await repo.countTranscriptSegments(sessionId)) + 1;
  const segment = buildTranscriptSegment({
    id: input.segmentId ?? randomUUID(),
    speaker: input.speaker,
    text: input.text,
    startedAt: input.startedAt,
    endedAt: new Date().toISOString(),
    sequence,
    confidence: input.confidence,
    speakerConfidence: input.speakerConfidence,
    source: input.source,
    suggestedQuestion: detail.session.suggestion?.suggestedQuestion,
    speakerContext: {
      prospectName: detail.session.meetingObjective.prospectName,
      companyName: detail.session.meetingObjective.companyName,
    },
  });

  await repo.insertTranscriptSegment({
    id: segment.id,
    session_id: sessionId,
    speaker: segment.speaker,
    text: segment.text,
    segment_kind: segment.kind ?? null,
    source: input.source ?? "manual_paste",
    sequence,
    started_at: segment.startedAt,
    ended_at: segment.endedAt ?? null,
    confidence: input.confidence ?? null,
    speaker_confidence: input.speakerConfidence ?? null,
  });

  const updated = await getSession(sessionId);
  if (!updated) throw new Error("Sessão não encontrada após append.");
  return { segment, detail: updated };
}

/** Fase 2 — analisa um segmento já persistido (intelligence layer). */
export async function analyzeSegment(
  sessionId: string,
  segmentId: string,
  actor: TeamMember | null,
): Promise<CopilotSessionDetail> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (detail.status !== "live") throw new Error("Sessão já encerrada.");

  const segment = detail.session.transcript.find((s) => s.id === segmentId);
  if (!segment) throw new Error("Segmento não encontrado.");
  if (segment.analyzedAt) return detail;

  let extractions = undefined;
  const effectiveSpeaker = resolveEffectiveSpeaker(segment);
  const canTryExtract =
    (effectiveSpeaker === "prospect" ||
      (effectiveSpeaker === "unknown" && isSubstantiveSegment(segment))) &&
    !isLikelyConsultantQuestion(segment.text);

  if (canTryExtract) {
    const rules = extractFromText(segment.text);
    extractions =
      rules.length > 0
        ? rules
        : segment.text.length >= 40
          ? await extractEvidenceFromText(segment.text)
          : [];
  }

  const result = analyzeTranscriptSegment(detail.session, segment, extractions);

  const narratorMessage = await generateNarratorTurn({
    snapshot: result.snapshot,
    lastSegment: segment,
    capturedObjectives: result.capturedObjectives,
    newInsights: result.newInsights,
    action: result.actionDecision?.action,
  });

  const narratorMessages = narratorMessage
    ? [...detail.session.narratorMessages, narratorMessage]
    : detail.session.narratorMessages;
  result.snapshot.narratorMessages = narratorMessages;

  await repo.markSegmentAnalyzed(segmentId);
  await repo.updateSession(sessionId, {
    ...snapshotToRowPatch(result.snapshot),
    narrator_messages: narratorMessages,
    last_intelligence_at: new Date().toISOString(),
    status: "live",
  });

  for (const key of result.capturedObjectives) {
    const obj = getObjectiveByKey(key);
    await events.emitCopilotDiscoveryCaptured({
      sessionId,
      prospectId: detail.prospectId,
      objectiveKey: key,
      label: obj?.label ?? key,
      actorId: actor,
      discriminator: key,
    });
  }

  if (result.newInsights.some((i) => i.type === "warning")) {
    const warn = result.newInsights.find((i) => i.type === "warning");
    if (warn) {
      await events.emitCopilotInconsistency({
        sessionId,
        prospectId: detail.prospectId,
        label: warn.body,
        actorId: actor,
        discriminator: warn.objectiveKey ?? Date.now().toString(),
      });
    }
  }

  return (await getSession(sessionId))!;
}

/** Compat — append + analyze em sequência. */
export async function addTurn(
  sessionId: string,
  input: {
    speaker: TranscriptSegment["speaker"];
    text: string;
    source?: "manual_paste" | "live_stt";
    segmentId?: string;
  },
  actor: TeamMember | null,
): Promise<CopilotSessionDetail> {
  const { segment } = await appendSegment(sessionId, input);
  return analyzeSegment(sessionId, segment.id, actor);
}

export async function endSession(
  sessionId: string,
  actor: TeamMember | null,
  options?: { elapsedSeconds?: number },
): Promise<CopilotSessionDetail> {
  return finalizeSession(sessionId, actor, "end", options);
}

export async function reprocessSession(
  sessionId: string,
  actor: TeamMember | null,
): Promise<CopilotSessionDetail> {
  return finalizeSession(sessionId, actor, "reprocess");
}

async function syncLinkedMeeting(
  meetingId: string | null | undefined,
  patch: { status: string; notes?: string | null },
): Promise<void> {
  if (!meetingId) return;
  try {
    await dbUpdate("meetings", `id=eq.${meetingId}`, patch);
  } catch (err) {
    console.warn("[copilot] falha ao sincronizar meeting:", err);
  }
}

async function finalizeSession(
  sessionId: string,
  actor: TeamMember | null,
  mode: "end" | "reprocess",
  options?: { elapsedSeconds?: number },
): Promise<CopilotSessionDetail> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (mode === "end" && detail.status !== "live") {
    throw new Error("Sessão já encerrada.");
  }
  if (mode === "reprocess" && detail.status !== "completed") {
    throw new Error("Só é possível reprocessar sessões encerradas.");
  }

  const sessionRow = await repo.findSessionById(sessionId);

  await repo.updateSession(sessionId, {
    status: "processing",
    ...(options?.elapsedSeconds != null ? { elapsed_seconds: options.elapsedSeconds } : {}),
  });

  const synthesisResult = await (
    await import("./engine/meeting-synthesizer")
  ).synthesizeMeeting({
    transcript: detail.session.transcript,
    prospectName: detail.session.meetingObjective.prospectName,
    companyName: detail.session.meetingObjective.companyName,
    existingDiagnosticState: detail.session.diagnosticState,
  });

  const { applySynthesisToSnapshot } = await import("./engine/meeting-synthesizer");
  const enriched = applySynthesisToSnapshot(detail.session, synthesisResult);

  const artifactData = buildMeetingArtifact(enriched, {
    llmSummary: synthesisResult.summary,
    synthesis: synthesisResult.synthesis,
    evidenceGraph: synthesisResult.graph,
    knowledgeDepth: synthesisResult.knowledgeDepth,
  });

  await repo.upsertArtifact(artifactData);

  await repo.updateSession(sessionId, {
    ...snapshotToRowPatch(enriched),
    status: "completed",
    ...(mode === "end" ? { ended_at: new Date().toISOString() } : {}),
    orb_state: "idle",
    meeting_phase: "closing",
    knowledge_depth: synthesisResult.knowledgeDepth,
    evidence_graph: synthesisResult.graph,
  });

  if (mode === "end") {
    await syncLinkedMeeting(sessionRow?.meeting_id, {
      status: "completed",
      notes: synthesisResult.summary?.slice(0, 2000) ?? null,
    });

    await events.emitCopilotSessionCompleted({
      sessionId,
      prospectId: detail.prospectId,
      companyName: detail.session.meetingObjective.companyName,
      overallCoverage: enriched.overallCoverage,
      proposalStatus: enriched.proposalReadiness.status,
      actorId: actor,
    });
  }

  return (await getSession(sessionId))!;
}

export async function overrideEvidence(
  sessionId: string,
  input: { objectiveKey: string; value: string },
  actor: TeamMember,
): Promise<CopilotSessionDetail> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");

  const evidence: Evidence = {
    value: input.value,
    confidence: "high",
    source: "human_verified",
    kind: "fact",
    quote: `Correção manual: ${input.value}`,
    capturedAt: new Date().toISOString(),
  };

  const diagnosticState = upsertEvidence(
    detail.session.diagnosticState,
    input.objectiveKey,
    evidence,
  );

  const { buildBusinessProfile } = await import("./engine/business-profile-builder");
  const {
    computeDomainCoverage,
    computeOverallCoverage,
    computeProposalReadiness,
  } = await import("./engine/diagnostic-engine");

  const businessProfile = buildBusinessProfile(diagnosticState, {
    companyName: detail.session.meetingObjective.companyName,
    contactName: detail.session.meetingObjective.prospectName,
  });
  const coverage = computeDomainCoverage(diagnosticState);
  const proposalReadiness = computeProposalReadiness(diagnosticState);
  const overallCoverage = computeOverallCoverage(coverage);

  await repo.updateSession(sessionId, {
    diagnostic_state: diagnosticState,
    business_profile: businessProfile,
    coverage,
    proposal_readiness: proposalReadiness,
  });

  const artifact = await repo.findArtifact(sessionId);
  if (artifact) {
    const updatedSnapshot = {
      ...detail.session,
      diagnosticState,
      businessProfile,
      coverage,
      overallCoverage,
      proposalReadiness,
    };
    const artifactData = buildMeetingArtifact(updatedSnapshot, {
      llmSummary: artifact.transcript_summary,
      synthesis: artifact.meeting_synthesis,
      evidenceGraph: artifact.evidence_graph,
      knowledgeDepth: artifact.knowledge_depth,
    });
    await repo.upsertArtifact(artifactData);
  }

  const obj = getObjectiveByKey(input.objectiveKey);
  await events.emitCopilotEvidenceVerified({
    sessionId,
    prospectId: detail.prospectId,
    objectiveKey: input.objectiveKey,
    label: obj?.label ?? input.objectiveKey,
    actor: actor,
  });

  return (await getSession(sessionId))!;
}

export async function askBriefingQuestion(
  sessionId: string,
  question: string,
): Promise<CopilotSessionDetail> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (detail.status !== "completed") {
    throw new Error("Q&A disponível apenas após encerrar a reunião.");
  }
  if (!detail.artifact) {
    throw new Error("Briefing indisponível — reprocesse a sessão.");
  }

  const trimmed = question.trim();
  if (!trimmed) throw new Error("Digite uma pergunta.");

  const { buildBriefingQaContext, answerBriefingQuestion } = await import(
    "./engine/briefing-qa.server"
  );

  const context = buildBriefingQaContext({
    session: detail.session,
    artifact: detail.artifact,
  });

  const answer = await answerBriefingQuestion({
    question: trimmed,
    context,
    history: detail.briefingQaMessages,
    prospectName: detail.session.meetingObjective.prospectName,
    companyName: detail.session.meetingObjective.companyName,
  });

  const now = new Date().toISOString();
  const nextMessages = [
    ...detail.briefingQaMessages,
    { id: randomUUID(), role: "user" as const, content: trimmed, createdAt: now },
    { id: randomUUID(), role: "assistant" as const, content: answer, createdAt: now },
  ];

  try {
    await repo.updateSession(sessionId, { briefing_qa_messages: nextMessages });
  } catch (err) {
    console.warn("[copilot] falha ao persistir briefing_qa — aplique migration 025:", err);
  }

  return {
    ...detail,
    briefingQaMessages: nextMessages,
  };
}

export async function cancelSession(
  sessionId: string,
  _actor: TeamMember | null,
): Promise<CopilotSessionDetail> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (detail.status !== "live") {
    throw new Error("Só é possível cancelar sessões ao vivo.");
  }

  const sessionRow = await repo.findSessionById(sessionId);

  await repo.updateSession(sessionId, {
    status: "cancelled",
    ended_at: new Date().toISOString(),
    orb_state: "idle",
    meeting_phase: "closing",
  });

  if (sessionRow?.meeting_id) {
    try {
      await dbUpdate("meetings", `id=eq.${sessionRow.meeting_id}`, { status: "cancelled" });
    } catch (err) {
      console.warn("[copilot] falha ao cancelar meeting vinculada:", err);
    }
  }

  return (await getSession(sessionId))!;
}

export async function transcribeAudioChunk(input: {
  audioBase64: string;
  format: string;
}): Promise<{ text: string } | null> {
  if (!isSttConfigured()) {
    throw new Error("OPENROUTER_API_KEY não configurada — STT indisponível.");
  }
  const text = await transcribeAudioBase64(input.audioBase64, input.format);
  if (!text) return null;
  return { text };
}

export async function exportBriefingPdf(sessionId: string): Promise<{ filename: string; base64: string }> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (!detail.artifact) {
    throw new Error("Briefing indisponível — aguarde o processamento ou reprocesse a sessão.");
  }

  const { buildBriefingPdf, buildBriefingFileName } = await import("./engine/briefing-pdf.server");
  const pdfBytes = await buildBriefingPdf({
    artifact: detail.artifact,
    sessionTitle: detail.session.meetingObjective.title,
  });
  const filename = buildBriefingFileName(
    detail.session.meetingObjective.companyName,
    detail.session.meetingObjective.prospectName,
  );

  return {
    filename,
    base64: Buffer.from(pdfBytes).toString("base64"),
  };
}

export async function exportCreativeBriefPdf(sessionId: string): Promise<{
  filename: string;
  base64: string;
  brief: import("./types").CreativeBrief;
}> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (!detail.artifact) {
    throw new Error("Brief criativo indisponível — reprocesse a sessão.");
  }

  const { generateCreativeBrief } = await import("./engine/creative-brief.server");
  const brief = await generateCreativeBrief({
    session: detail.session,
    artifact: detail.artifact,
  });

  const { buildCreativeBriefPdf, buildCreativeBriefFileName } = await import(
    "./engine/creative-brief-pdf.server"
  );
  const pdfBytes = await buildCreativeBriefPdf(brief);
  const filename = buildCreativeBriefFileName(detail.session.meetingObjective.companyName);

  return {
    filename,
    base64: Buffer.from(pdfBytes).toString("base64"),
    brief,
  };
}

function buildHandoffSummary(detail: CopilotSessionDetail): string {
  const diagnosis = (detail.artifact?.diagnosis ?? {}) as Record<string, unknown>;
  const parts = [
    String(diagnosis.situation ?? detail.artifact?.transcript_summary ?? ""),
    diagnosis.mainProblem ? `Problema: ${String(diagnosis.mainProblem)}` : "",
    diagnosis.opportunity ? `Oportunidade: ${String(diagnosis.opportunity)}` : "",
  ].filter(Boolean);
  return parts.join("\n\n").slice(0, 4000);
}

export async function pushSessionToCompany(
  sessionId: string,
  actor: TeamMember | null,
): Promise<{ companyId: string; created: boolean }> {
  const detail = await getSession(sessionId);
  if (!detail) throw new Error("Sessão não encontrada.");
  if (detail.status !== "completed" || !detail.artifact) {
    throw new Error("Envie para Empresas apenas após o diagnóstico estar pronto.");
  }
  if (!detail.prospectId) {
    throw new Error("Vincule um prospect à sessão antes de enviar para Empresas.");
  }

  const prospectRepo = await import("@/domains/prospection/repository.server");
  const companyRepo = await import("@/domains/companies/repository.server");

  const prospect = await prospectRepo.findProspectById(detail.prospectId);
  if (!prospect) throw new Error("Prospect não encontrado.");

  const summary = buildHandoffSummary(detail);
  const title = `Copilot — ${detail.session.meetingObjective.title}`;
  const metadata = {
    copilotSessionId: sessionId,
    coverage: detail.session.overallCoverage,
    knowledgeDepth: detail.session.knowledgeDepth,
    proposalReadiness: detail.session.proposalReadiness.status,
    unknowns: detail.artifact.unknowns.slice(0, 12),
    whatWeLearned: detail.artifact.what_we_learned.slice(0, 15),
  };

  let companyId = prospect.company_id;
  let created = false;

  if (!companyId) {
    const company = await companyRepo.insertCompany({
      name: prospect.name,
      legal_name: null,
      cnpj: null,
      city: prospect.city,
      city_state: prospect.state,
      responsible_name: detail.session.meetingObjective.prospectName,
      whatsapp: prospect.whatsapp ?? prospect.phone,
      email: null,
      website: prospect.website,
      origin: prospect.source ?? "copilot",
      segment: prospect.category,
      stage: "proposta",
      notes: summary,
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
      template_slug: null,
      microvertical_id: null,
      match_level: null,
    });
    companyId = company.id;
    created = true;
    await prospectRepo.patchProspect(detail.prospectId, { company_id: companyId });
  } else {
    const company = await companyRepo.findCompanyById(companyId);
    if (company) {
      const stamp = new Date().toLocaleDateString("pt-BR");
      const notesAppend = `\n\n--- Copilot ${stamp} ---\n${summary.slice(0, 1500)}`;
      const nextStage =
        company.stage === "lead" || company.stage === "contato" ? "proposta" : company.stage;
      await companyRepo.patchCompany(companyId, {
        notes: `${company.notes ?? ""}${notesAppend}`.trim(),
        stage: nextStage,
      });
    }
  }

  await companyRepo.insertActivity({
    company_id: companyId,
    type: "meeting",
    title,
    body: summary,
    metadata,
    author_id: actor,
  });

  const sessionRow = await repo.findSessionById(sessionId);
  if (sessionRow?.meeting_id) {
    try {
      await dbUpdate("meetings", `id=eq.${sessionRow.meeting_id}`, { company_id: companyId });
    } catch (err) {
      console.warn("[copilot] falha ao vincular meeting à empresa:", err);
    }
  }

  return { companyId, created };
}

export async function listRecentSessions(limit = 25) {
  const rows = await repo.findRecentSessions(limit);
  return rows.map((row) => ({
    id: row.id,
    prospectId: row.prospect_id,
    status: row.status,
    title: row.meeting_objective.title,
    prospectName: row.meeting_objective.prospectName,
    companyName: row.meeting_objective.companyName,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    elapsedSeconds: row.elapsed_seconds,
  }));
}

export async function listProspectSessions(prospectId: string) {
  const { computeOverallCoverage } = await import("./engine/diagnostic-engine");
  const rows = await repo.findSessionsByProspect(prospectId);
  return rows.map((row) => {
    const coverage = Array.isArray(row.coverage) ? row.coverage : [];
    return {
      id: row.id,
      status: row.status,
      title: row.meeting_objective.title,
      prospectName: row.meeting_objective.prospectName,
      companyName: row.meeting_objective.companyName,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      elapsedSeconds: row.elapsed_seconds,
      overallCoverage: computeOverallCoverage(coverage),
      knowledgeDepth: row.knowledge_depth ?? 0,
    };
  });
}
