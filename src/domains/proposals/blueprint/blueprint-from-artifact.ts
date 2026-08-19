import type { CopilotMeetingArtifact } from "@/domains/copilot/meeting/types";
import type { CopilotSessionSnapshot, EvidenceGraphItem } from "@/domains/copilot/types";
import type { OSCommercialDefaults } from "@/domains/settings/types";
import {
  buildExclusions,
  buildMetricsToTrack,
  buildMovements,
  buildPhase1Deliverables,
  buildPositioningStatement,
  buildPhase1Objective,
  inferAccelerationPlaybookParams,
} from "../engine/acceleration-playbook";
import { countBlueprintFields } from "./evidence-rules";
import { inferArchetype } from "./infer-archetype";
import { defaultModulesForArchetype, getModuleById } from "./proposal-modules";
import type {
  BlueprintArchetype,
  BlueprintField,
  BlueprintReadiness,
  CommercialBlueprintData,
  EvidenceSource,
} from "./types";

function mapEvidenceKind(kind: string): EvidenceSource {
  if (kind === "fact") return "fact";
  if (kind === "inference") return "inference";
  if (kind === "hypothesis") return "hypothesis";
  if (kind === "opportunity") return "opportunity";
  return "inference";
}

function findEvidenceForTopic(
  graph: EvidenceGraphItem[],
  patterns: RegExp[],
): { value: string; source: EvidenceSource; evidenceIds: string[] } | null {
  const matches = graph.filter((item) => {
    const text = `${item.label} ${item.value}`.toLowerCase();
    return patterns.some((p) => p.test(text));
  });
  if (matches.length === 0) return null;
  const primary = matches[0];
  return {
    value: primary.value.trim() || primary.label.trim(),
    source: mapEvidenceKind(primary.kind),
    evidenceIds: matches.map((m) => m.id),
  };
}

function makeField(
  value: string,
  source: EvidenceSource = "inference",
  evidenceIds?: string[],
): BlueprintField {
  return {
    value: value.trim(),
    source,
    evidenceIds,
    approved: source === "fact",
  };
}

function fieldFromDiagnosis(
  diagnosis: Record<string, unknown>,
  key: string,
  graph: EvidenceGraphItem[],
  patterns: RegExp[],
): BlueprintField {
  const fromGraph = findEvidenceForTopic(graph, patterns);
  const fromDiag = String(diagnosis[key] ?? "").trim();
  if (fromGraph?.value) {
    return makeField(fromGraph.value, fromGraph.source, fromGraph.evidenceIds);
  }
  if (fromDiag) return makeField(fromDiag, "inference");
  return makeField("", "hypothesis");
}

function buildDeliverablePillars(
  archetype: BlueprintArchetype,
  params: ReturnType<typeof inferAccelerationPlaybookParams>,
): CommercialBlueprintData["deliverables"] {
  if (archetype === "custom_solution") {
    return [
      {
        pillar: "Discovery",
        items: ["Diagnóstico técnico", "Escopo fechado", "Arquitetura da solução"],
        approved: false,
      },
      {
        pillar: "Build",
        items: ["Desenvolvimento iterativo", "Integrações", "Testes"],
        approved: false,
      },
      {
        pillar: "Go-live",
        items: ["Implantação", "Treinamento", "Documentação"],
        approved: false,
      },
    ];
  }

  const phase1Items = buildPhase1Deliverables(params);
  const byPillar = new Map<string, string[]>();
  for (const item of phase1Items) {
    const [pillar, ...rest] = item.split(": ");
    const label = rest.join(": ") || item;
    const list = byPillar.get(pillar) ?? [];
    list.push(label);
    byPillar.set(pillar, list);
  }

  return [...byPillar.entries()].map(([pillar, items]) => ({
    pillar,
    items,
    approved: false,
  }));
}

function buildAssumptions(
  artifact: CopilotMeetingArtifact,
  params: ReturnType<typeof inferAccelerationPlaybookParams>,
): CommercialBlueprintData["assumptions"] {
  const items: CommercialBlueprintData["assumptions"] = [];

  for (const unknown of artifact.unknowns?.slice(0, 8) ?? []) {
    items.push({ text: unknown, critical: true, approved: false });
  }

  for (const hyp of artifact.hypotheses?.slice(0, 4) ?? []) {
    items.push({ text: hyp, critical: false, approved: false });
  }

  if (params.hasCapacityConstraint && params.capacityNote) {
    items.push({
      text: `Capacidade comercial limitada: ${params.capacityNote}`,
      critical: true,
      approved: false,
    });
  }

  return items;
}

function buildBlockers(
  session: CopilotSessionSnapshot,
  artifact: CopilotMeetingArtifact,
  data: CommercialBlueprintData,
): string[] {
  const blockers: string[] = [];

  if (session.overallCoverage < 60) {
    blockers.push(`Cobertura diagnóstica baixa (${session.overallCoverage}%) — validar na Reunião 2.`);
  }
  if ((artifact.unknowns?.length ?? 0) > 5) {
    blockers.push(`${artifact.unknowns?.length} lacunas críticas mapeadas.`);
  }
  if (!data.diagnosis.problem.value.trim()) {
    blockers.push("Problema principal não definido.");
  }
  if (!data.investment.approved) {
    blockers.push("Investimento comercial não aprovado.");
  }
  for (const modId of data.modules) {
    const mod = getModuleById(modId);
    if (!mod) blockers.push(`Módulo desconhecido: ${modId}`);
  }

  return blockers;
}

function computeReadiness(
  session: CopilotSessionSnapshot,
  artifact: CopilotMeetingArtifact,
  data: CommercialBlueprintData,
): BlueprintReadiness {
  const { total, approved } = countBlueprintFields(data);
  return {
    coveragePercent: session.overallCoverage,
    knowledgeDepth: session.knowledgeDepth,
    unknownsCount: artifact.unknowns?.length ?? 0,
    approvedFieldsCount: approved,
    totalFieldsCount: total,
    modulesSelected: data.modules.length,
    criticalAssumptionsPending: data.assumptions.filter((a) => a.critical && !a.approved).length,
  };
}

export function buildBlueprintFromArtifact(input: {
  session: CopilotSessionSnapshot;
  artifact: CopilotMeetingArtifact;
  commercial: OSCommercialDefaults;
}): {
  archetype: BlueprintArchetype;
  companyName: string;
  clientName: string | null;
  data: CommercialBlueprintData;
  readiness: BlueprintReadiness;
  internalNotes: string;
} {
  const { session, artifact, commercial } = input;
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  const graph = artifact.evidence_graph ?? [];
  const companyName = session.meetingObjective.companyName;
  const clientName = session.meetingObjective.prospectName || null;
  const archetype = inferArchetype(artifact);
  const params = inferAccelerationPlaybookParams({ artifact, companyName });

  const assets = {
    existingLp: params.assetMode === "existing_lp",
    newLp: params.assetMode === "new_lp" || params.assetMode === "no_lp",
    existingSite: /site\s+(j[aá]|existente|pronto)/.test(
      graph.map((g) => `${g.label} ${g.value}`).join(" ").toLowerCase(),
    ),
    notes:
      params.assetMode === "existing_lp"
        ? "LP existente detectada — instrumentação e validação antes de expandir."
        : undefined,
  };

  const modules = defaultModulesForArchetype(archetype, assets);
  if (!params.includeMetaNow) {
    const idx = modules.indexOf("meta_ads");
    if (idx >= 0) modules.splice(idx, 1);
  }

  const positioning = buildPositioningStatement(params);
  const phase1Obj = buildPhase1Objective(params);
  const engagement = artifact.recommended_engagement as { strategy?: string } | null;

  const proposalMode: "conditional" | "ready" =
    session.overallCoverage < 60 || (artifact.unknowns?.length ?? 0) > 5
      ? "conditional"
      : "ready";

  const data: CommercialBlueprintData = {
    diagnosis: {
      problem: fieldFromDiagnosis(diagnosis, "mainProblem", graph, [
        /problema|desafio|dor|gargalo/,
      ]),
      objective: fieldFromDiagnosis(diagnosis, "situation", graph, [/objetivo|meta|situação|situacao/]),
      constraint: fieldFromDiagnosis(diagnosis, "constraint", graph, [
        /restri|capacidade|limitação|limitacao/,
      ]),
      opportunity: fieldFromDiagnosis(diagnosis, "opportunity", graph, [
        /oportunidade|demanda|potencial/,
      ]),
    },
    strategy: {
      priority1: makeField(
        engagement?.strategy ??
          `Ativar aquisição mensurável via Google Ads para ${companyName}, respeitando capacidade comercial.`,
        "inference",
      ),
      priority2: params.hasCapacityConstraint
        ? makeField("Controlar volume de leads conforme capacidade de atendimento.", "fact")
        : undefined,
      future: buildExclusions(params)
        .slice(0, 3)
        .map((item) => makeField(`Expansão futura: ${item.replace(/^Meta Ads.*$/i, "Meta Ads")}`, "opportunity")),
    },
    solution: {
      phase1: makeField(phase1Obj, "decision"),
      phase2: makeField(
        "Validar canal e funil com dados reais — escala condicionada aos resultados.",
        "decision",
      ),
      phase3: makeField(
        "Escalar ecossistema (remarketing, Meta, CRM, LPs específicas) após validação.",
        "opportunity",
      ),
    },
    assets,
    modules,
    deliverables: buildDeliverablePillars(archetype, params),
    exclusions: buildExclusions(params),
    assumptions: buildAssumptions(artifact, params),
    investment: {
      packageId: "acceleration_v1",
      setupLabel: commercial.implementationAmount,
      mediaLabel: commercial.mediaAmount,
      managementLabel: commercial.managementAmount,
      approved: false,
    },
    metrics: buildMetricsToTrack(params),
    nextDecisions: [
      ...(artifact.unknowns?.slice(0, 6) ?? []),
      "Aprovar investimento e escopo da Fase 1",
    ],
    proposalMode,
    blockers: [],
  };

  if (!data.diagnosis.objective.value && data.diagnosis.problem.value) {
    data.diagnosis.objective = makeField(
      `Estruturar aquisição comercial para ${companyName}`,
      "inference",
    );
  }

  data.blockers = buildBlockers(session, artifact, data);
  const readiness = computeReadiness(session, artifact, data);

  const internalNotes = [
    `Gerado pelo Copilot — cobertura ${session.overallCoverage}%, profundidade ${session.knowledgeDepth}%.`,
    positioning,
    `${graph.length} evidências no grafo.`,
    params.hasCapacityConstraint ? `Restrição de capacidade: ${params.capacityNote ?? "sim"}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    archetype,
    companyName,
    clientName,
    data,
    readiness,
    internalNotes,
  };
}

export function buildMovementsFromBlueprint(data: CommercialBlueprintData): ReturnType<typeof buildMovements> {
  const params = inferAccelerationPlaybookParams({
    artifact: {
      session_id: "",
      transcript_summary: null,
      transcript_segments: [],
      diagnosis: {
        mainProblem: data.diagnosis.problem.value,
        constraint: data.diagnosis.constraint?.value,
        opportunity: data.diagnosis.opportunity?.value,
      },
      opportunities: [],
      unknowns: [],
      recommended_engagement: null,
      pain_points: [],
      goals: [],
      hypotheses: [],
      what_we_learned: [],
      evidence_graph: [],
      knowledge_depth: 0,
      meeting_synthesis: null,
      created_at: "",
    },
    companyName: "",
  });
  return buildMovements({
    ...params,
    assetMode: data.assets.existingLp ? "existing_lp" : data.assets.newLp ? "new_lp" : "no_lp",
    includeMetaNow: data.modules.includes("meta_ads"),
  });
}
