import { modulesForArchetype, type ProposalModuleDef } from "./proposal-modules";
import type {
  BlueprintArchetype,
  BlueprintAssumption,
  BlueprintDeliverablePillar,
  BlueprintField,
  BlueprintReadiness,
  CommercialBlueprintData,
  EvidenceSource,
} from "./types";

export type AssumptionCategory = "blocking" | "validate" | "hypothesis";

export interface CategorizedAssumption {
  assumption: BlueprintAssumption;
  index: number;
  category: AssumptionCategory;
}

export interface DecisionItem {
  id: string;
  label: string;
  field: BlueprintField;
  path: string;
}

export interface ScopePhaseGroup {
  phase: 1 | 2 | 3;
  label: string;
  selected: ProposalModuleDef[];
  deferred: ProposalModuleDef[];
}

export interface DeliverablePillarSummary {
  pillar: BlueprintDeliverablePillar;
  index: number;
  confirmedCount: number;
  reviewCount: number;
}

export interface BlueprintApprovalState {
  blockingCount: number;
  canApprove: boolean;
  proposalStateLabel: string;
  proposalStateTone: "ready" | "conditional" | "blocked";
}

export const EVIDENCE_SOURCE_LABELS: Record<EvidenceSource, string> = {
  fact: "Fato",
  inference: "Inferência",
  hypothesis: "Hipótese",
  decision: "Decisão R1",
  opportunity: "Oportunidade",
};

export const ARCHETYPE_RATIONALE: Record<BlueprintArchetype, string> = {
  acceleration:
    "Escolhido porque o negócio possui demanda ou autoridade existente, baixa previsibilidade de aquisição e capacidade operacional que precisa ser respeitada na Fase 1.",
  acquisition:
    "Escolhido porque o foco principal é criar ou escalar um canal mensurável de aquisição com campanhas e funil estruturado.",
  positioning:
    "Escolhido porque o gargalo está em autoridade, credibilidade ou posicionamento antes de escalar mídia paga.",
  structure:
    "Escolhido porque a prioridade é instrumentação digital — site, tracking, CRM ou integrações — antes da escala comercial.",
  custom_solution:
    "Escolhido porque a demanda exige desenvolvimento ou solução sob medida, não apenas aceleração de marketing.",
};

const PHASE_LABELS: Record<1 | 2 | 3, string> = {
  1: "Fase 1 — Estruturar e validar",
  2: "Depois da validação",
  3: "Expansão futura",
};

export function buildCommercialThesis(
  data: CommercialBlueprintData,
  companyName: string,
): string {
  const problem = data.diagnosis.problem.value.trim();
  const objective = data.diagnosis.objective.value.trim();
  const strategy = data.strategy.priority1.value.trim();
  const phase1 = data.solution.phase1.value.trim();
  const constraint = data.diagnosis.constraint?.value.trim();

  const paragraphs: string[] = [];

  if (problem) {
    paragraphs.push(
      constraint
        ? `${companyName} precisa resolver: ${problem}. A operação atual impõe uma restrição — ${constraint.toLowerCase()}.`
        : `${companyName} precisa resolver: ${problem}.`,
    );
  } else if (objective) {
    paragraphs.push(`${companyName} busca ${objective.toLowerCase()}.`);
  }

  if (strategy) {
    paragraphs.push(`Nossa estratégia inicial: ${strategy}`);
  } else if (phase1) {
    paragraphs.push(`Nossa proposta inicial: ${phase1}`);
  }

  if (phase1 && strategy) {
    paragraphs.push(phase1);
  }

  if (paragraphs.length === 0) {
    return `Defina a tese comercial para ${companyName} revisando diagnóstico, estratégia e escopo da Fase 1.`;
  }

  return paragraphs.join("\n\n");
}

export function collectDecisionItems(data: CommercialBlueprintData): DecisionItem[] {
  const items: DecisionItem[] = [
    {
      id: "problem",
      label: "Problema prioritário",
      field: data.diagnosis.problem,
      path: "diagnosis.problem",
    },
    {
      id: "objective",
      label: "Objetivo",
      field: data.diagnosis.objective,
      path: "diagnosis.objective",
    },
  ];

  if (data.diagnosis.constraint?.value.trim()) {
    items.push({
      id: "constraint",
      label: "Restrição",
      field: data.diagnosis.constraint,
      path: "diagnosis.constraint",
    });
  }

  if (data.diagnosis.opportunity?.value.trim()) {
    items.push({
      id: "opportunity",
      label: "Oportunidade",
      field: data.diagnosis.opportunity,
      path: "diagnosis.opportunity",
    });
  }

  items.push({
    id: "strategy",
    label: "Estratégia inicial",
    field: data.strategy.priority1,
    path: "strategy.priority1",
  });

  return items;
}

export function fieldReviewStatus(field: BlueprintField): "confirmed" | "review" {
  if (field.approved && field.source !== "hypothesis") return "confirmed";
  return "review";
}

export function categorizeAssumptions(
  data: CommercialBlueprintData,
): CategorizedAssumption[] {
  return data.assumptions.map((assumption, index) => ({
    assumption,
    index,
    category: assumptionCategory(assumption),
  }));
}

function assumptionCategory(assumption: BlueprintAssumption): AssumptionCategory {
  if (assumption.approved) return "hypothesis";
  if (assumption.critical) return "blocking";
  return "validate";
}

export function groupScopeByPhase(
  archetype: BlueprintArchetype,
  selectedModuleIds: string[],
): ScopePhaseGroup[] {
  const available = modulesForArchetype(archetype);
  const selectedSet = new Set(selectedModuleIds);

  return ([1, 2, 3] as const).map((phase) => {
    const phaseModules = available.filter((m) => m.defaultPhase === phase);
    return {
      phase,
      label: PHASE_LABELS[phase],
      selected: phaseModules.filter((m) => selectedSet.has(m.id)),
      deferred: phaseModules.filter((m) => !selectedSet.has(m.id)),
    };
  });
}

export function summarizeDeliverablePillars(
  deliverables: BlueprintDeliverablePillar[],
): DeliverablePillarSummary[] {
  return deliverables.map((pillar, index) => ({
    pillar,
    index,
    confirmedCount: pillar.approved ? pillar.items.length : 0,
    reviewCount: pillar.approved ? 0 : pillar.items.length,
  }));
}

export function computeApprovalState(
  data: CommercialBlueprintData,
  readiness: BlueprintReadiness,
): BlueprintApprovalState {
  const criticalPending = data.assumptions.filter((a) => a.critical && !a.approved).length;
  const investmentBlocks = !data.investment.approved ? 1 : 0;
  const problemBlocks = !data.diagnosis.problem.value.trim() ? 1 : 0;

  const blockingCount = criticalPending + investmentBlocks + problemBlocks;

  const canApprove =
    blockingCount === 0 &&
    data.diagnosis.problem.value.trim().length > 0 &&
    data.investment.approved;

  let proposalStateTone: BlueprintApprovalState["proposalStateTone"] = "ready";
  if (blockingCount > 0) proposalStateTone = "blocked";
  else if (data.proposalMode === "conditional") proposalStateTone = "conditional";

  let proposalStateLabel = "Pronta para aprovação";
  if (blockingCount > 0) {
    proposalStateLabel =
      blockingCount === 1
        ? "1 decisão bloqueia a aprovação"
        : `${blockingCount} decisões bloqueiam a aprovação`;
  } else if (data.proposalMode === "conditional") {
    proposalStateLabel = "Proposta condicional — revisar antes de enviar";
  }

  return {
    blockingCount,
    canApprove,
    proposalStateLabel,
    proposalStateTone,
  };
}

export const STUDIO_SECTIONS = [
  { id: "diagnosis", step: "01", title: "Diagnóstico", subtitle: "O que entendemos" },
  { id: "decision", step: "02", title: "Decisão", subtitle: "O que vamos fazer" },
  { id: "scope", step: "03", title: "Escopo", subtitle: "O que estamos vendendo" },
  { id: "investment", step: "04", title: "Investimento", subtitle: "Quanto custa" },
  { id: "validation", step: "05", title: "Validação", subtitle: "O que ainda precisamos decidir" },
  { id: "proposal", step: "06", title: "Proposta", subtitle: "Gerar documento" },
] as const;
