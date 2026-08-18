import { getObjectiveByKey, getKnowledgeGraph } from "../knowledge";
import { isObjectiveSatisfied } from "../engine/diagnostic-engine";
import type { CopilotSessionSnapshot } from "../types";
import type { CopilotMeetingArtifact } from "./types";

export function buildMeetingArtifact(
  snapshot: CopilotSessionSnapshot,
  llmSummary?: string | null,
): Omit<CopilotMeetingArtifact, "created_at"> {
  const { diagnosticState, businessProfile, proposalReadiness, transcript, meetingObjective } =
    snapshot;

  const painPoints: string[] = [];
  const goals: string[] = [];
  const unknowns: string[] = [];
  const hypotheses: string[] = [];
  const opportunities: unknown[] = [];

  const referral = diagnosticState.referral_dependency;
  if (isObjectiveSatisfied(referral)) {
    painPoints.push("Dependência de canal (indicação)");
    hypotheses.push("Diversificar aquisição com Google Search + landing page");
  }

  const googleAds = diagnosticState.google_ads_history;
  if (googleAds?.evidence?.value === "Nunca fez Google Ads") {
    opportunities.push({
      label: "Google Search + Landing Page + Tracking",
      confidence: "medium",
      rationale: "Sem histórico de mídia paga — oportunidade de aquisição previsível.",
    });
  }

  const goal = diagnosticState.numeric_growth_target;
  if (goal?.evidence) {
    goals.push(String(goal.evidence.value));
  }

  const helpReason = diagnosticState.help_seeking_reason;
  if (helpReason?.evidence?.value) {
    goals.push(String(helpReason.evidence.value));
  }

  for (const obj of getKnowledgeGraph()) {
    const record = diagnosticState[obj.key];
    if (!record || record.state === "unknown" || record.state === "exploring") {
      if (obj.proposalCritical) unknowns.push(obj.label);
    }
    if (record?.evidence?.kind === "hypothesis") {
      hypotheses.push(`${obj.label}: ${record.evidence.value}`);
    }
  }

  if (proposalReadiness.blockers.length > 1) {
    unknowns.push(...proposalReadiness.blockers.slice(1));
  }

  const diagnosis = {
    company: meetingObjective.companyName,
    contact: meetingObjective.prospectName,
    situation: summarizeSituation(snapshot),
    mainProblem: painPoints[0] ?? null,
    objective: goal?.evidence?.value ?? null,
    capacity: diagnosticState.service_capacity?.evidence?.value ?? null,
    diagnosticCoverage: snapshot.overallCoverage,
    proposalReadiness: proposalReadiness.status,
    businessProfile,
  };

  const transcriptSummary =
    llmSummary ??
    (transcript.length > 0
      ? `${transcript.length} turnos registrados. Último: ${transcript[transcript.length - 1]?.text.slice(0, 120)}…`
      : "Reunião sem transcript registrado.");

  return {
    session_id: snapshot.id,
    transcript_summary: transcriptSummary,
    transcript_segments: transcript.map((seg) => ({
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
      opportunities.length > 0
        ? {
            strategy: "Growth Foundation + Demand Generation",
            phases: [
              { name: "Fase 1", items: ["BrandCore", "Posicionamento", "Landing Page", "Tracking"] },
              { name: "Fase 2", items: ["Conteúdo", "Google Ads"] },
              { name: "Fase 3", items: ["Otimização", "CRM", "Automação"] },
            ],
            confidence: Math.min(95, snapshot.overallCoverage + 20),
          }
        : null,
    pain_points: painPoints,
    goals,
    hypotheses,
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
