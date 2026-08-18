import { getKnowledgeGraph } from "../knowledge";
import { isObjectiveSatisfied } from "../engine/diagnostic-engine";
import type { CopilotSessionSnapshot, EvidenceGraphItem, MeetingSynthesis } from "../types";
import type { CopilotMeetingArtifact } from "./types";

export function buildMeetingArtifact(
  snapshot: CopilotSessionSnapshot,
  options?: {
    llmSummary?: string | null;
    synthesis?: MeetingSynthesis | null;
    evidenceGraph?: EvidenceGraphItem[];
    knowledgeDepth?: number;
  },
): Omit<CopilotMeetingArtifact, "created_at"> {
  const synthesis = options?.synthesis;
  const graph = options?.evidenceGraph ?? snapshot.evidenceGraph ?? [];
  const knowledgeDepth = options?.knowledgeDepth ?? snapshot.knowledgeDepth ?? 0;

  const painPoints: string[] = [];
  const goals: string[] = [];
  const unknowns: string[] = [];
  const hypotheses: string[] = [];
  const opportunities: unknown[] = [];

  if (synthesis?.diagnosis.mainProblem) {
    painPoints.push(synthesis.diagnosis.mainProblem);
  }

  const referral = snapshot.diagnosticState.referral_dependency;
  if (isObjectiveSatisfied(referral) && !painPoints.length) {
    painPoints.push("Dependência de canal (indicação)");
  }

  if (synthesis?.diagnosis.constraint) {
    hypotheses.push(`Restrição: ${synthesis.diagnosis.constraint}`);
  }

  for (const item of graph) {
    if (item.kind === "opportunity") {
      opportunities.push({
        label: item.label,
        value: item.value,
        source: item.source,
        confidence: item.confidence,
        rationale: item.quote,
      });
    }
    if (item.kind === "hypothesis") {
      hypotheses.push(`${item.label}: ${item.value}`);
    }
  }

  const helpReason = snapshot.diagnosticState.help_seeking_reason;
  if (helpReason?.evidence?.value) {
    goals.push(String(helpReason.evidence.value));
  }
  const goal = snapshot.diagnosticState.primary_desired_result;
  if (goal?.evidence?.value) {
    goals.push(String(goal.evidence.value));
  }
  if (synthesis?.diagnosis.opportunity) {
    goals.push(synthesis.diagnosis.opportunity);
  }

  if (synthesis?.criticalUnknowns?.length) {
    unknowns.push(...synthesis.criticalUnknowns);
  }
  if (synthesis?.secondaryUnknowns?.length) {
    unknowns.push(...synthesis.secondaryUnknowns);
  }

  for (const obj of getKnowledgeGraph()) {
    const record = snapshot.diagnosticState[obj.key];
    if (!record || record.state === "unknown" || record.state === "exploring") {
      if (obj.proposalCritical && !unknowns.includes(obj.label)) {
        unknowns.push(obj.label);
      }
    }
  }

  const diagnosis = {
    company: snapshot.meetingObjective.companyName,
    contact: snapshot.meetingObjective.prospectName,
    situation: synthesis?.diagnosis.situation ?? summarizeSituation(snapshot),
    mainProblem: synthesis?.diagnosis.mainProblem ?? painPoints[0] ?? null,
    constraint: synthesis?.diagnosis.constraint ?? null,
    opportunity: synthesis?.diagnosis.opportunity ?? null,
    objective: goal?.evidence?.value ?? null,
    capacity: snapshot.diagnosticState.service_capacity?.evidence?.value ?? null,
    diagnosticCoverage: snapshot.overallCoverage,
    knowledgeDepth,
    proposalReadiness: snapshot.proposalReadiness.status,
    businessProfile: snapshot.businessProfile,
  };

  const transcriptSummary =
    options?.llmSummary ??
    synthesis?.diagnosis.situation ??
    (snapshot.transcript.length > 0
      ? `${snapshot.transcript.length} turnos registrados.`
      : "Reunião sem transcript registrado.");

  const whatWeLearned = synthesis?.whatWeLearned ?? [];

  return {
    session_id: snapshot.id,
    transcript_summary: transcriptSummary,
    transcript_segments: snapshot.transcript.map((seg) => ({
      id: seg.id,
      speaker: seg.speaker,
      text: seg.text,
      startedAt: seg.startedAt,
      endedAt: seg.endedAt,
      sequence: seg.sequence,
      confidence: seg.confidence,
      speakerConfidence: seg.speakerConfidence,
      source: seg.source,
      kind: seg.kind,
    })),
    diagnosis,
    opportunities,
    unknowns: [...new Set(unknowns)],
    recommended_engagement:
      opportunities.length > 0 || knowledgeDepth >= 40
        ? {
            strategy: synthesis?.diagnosis.opportunity ?? "Growth Foundation + Demand Generation",
            phases: [
              { name: "Fase 1", items: ["Diagnóstico", "Posicionamento", "Landing", "Tracking"] },
              { name: "Fase 2", items: ["Google Ads", "Funil comercial"] },
              { name: "Fase 3", items: ["CRM", "Conteúdo", "Otimização"] },
            ],
            confidence: Math.min(95, Math.round((knowledgeDepth + snapshot.overallCoverage) / 2)),
          }
        : null,
    pain_points: painPoints,
    goals,
    hypotheses,
    what_we_learned: whatWeLearned,
    evidence_graph: graph,
    knowledge_depth: knowledgeDepth,
    meeting_synthesis: synthesis ?? null,
  };
}

function summarizeSituation(snapshot: CopilotSessionSnapshot): string {
  const parts: string[] = [];
  const portfolio = snapshot.diagnosticState.product_portfolio;
  if (portfolio?.evidence) {
    parts.push(`Oferta: ${portfolio.evidence.value}`);
  }
  const channel = snapshot.diagnosticState.primary_acquisition_channel;
  if (channel?.evidence) {
    parts.push(`Aquisição: ${channel.evidence.value}`);
  }
  const leads = snapshot.diagnosticState.lead_volume;
  if (leads?.evidence) {
    parts.push(`Leads: ${JSON.stringify(leads.evidence.value)}`);
  }
  return parts.length > 0 ? parts.join(". ") + "." : "Diagnóstico parcial — revisar gaps.";
}
