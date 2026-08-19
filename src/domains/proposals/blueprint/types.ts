export type BlueprintArchetype =
  | "acceleration"
  | "acquisition"
  | "positioning"
  | "structure"
  | "custom_solution";

export type BlueprintStatus = "draft" | "in_review" | "approved";

export type BlueprintAuthor = "copilot" | "human";

export type EvidenceSource =
  | "fact"
  | "inference"
  | "hypothesis"
  | "decision"
  | "opportunity";

export interface BlueprintField<T = string> {
  value: T;
  source: EvidenceSource;
  evidenceIds?: string[];
  approved: boolean;
  note?: string;
}

export interface BlueprintDeliverablePillar {
  pillar: string;
  items: string[];
  approved: boolean;
}

export interface BlueprintAssumption {
  text: string;
  critical: boolean;
  approved: boolean;
}

export interface BlueprintInvestment {
  packageId: string;
  setupLabel: string;
  mediaLabel: string;
  managementLabel: string;
  approved: boolean;
}

export interface BlueprintAssets {
  existingLp: boolean;
  newLp: boolean;
  existingSite?: boolean;
  notes?: string;
}

export interface CommercialBlueprintData {
  diagnosis: {
    problem: BlueprintField;
    objective: BlueprintField;
    constraint?: BlueprintField;
    opportunity?: BlueprintField;
  };
  strategy: {
    priority1: BlueprintField;
    priority2?: BlueprintField;
    future: BlueprintField[];
  };
  solution: {
    phase1: BlueprintField;
    phase2?: BlueprintField;
    phase3?: BlueprintField;
  };
  assets: BlueprintAssets;
  modules: string[];
  deliverables: BlueprintDeliverablePillar[];
  exclusions: string[];
  assumptions: BlueprintAssumption[];
  investment: BlueprintInvestment;
  metrics: string[];
  nextDecisions: string[];
  proposalMode: "conditional" | "ready";
  blockers: string[];
}

export interface BlueprintReadiness {
  coveragePercent: number;
  knowledgeDepth: number;
  unknownsCount: number;
  approvedFieldsCount: number;
  totalFieldsCount: number;
  modulesSelected: number;
  criticalAssumptionsPending: number;
}

export interface CommercialBlueprintRow {
  id: string;
  copilot_session_id: string;
  proposal_id: string | null;
  company_name: string;
  client_name: string | null;
  archetype: BlueprintArchetype;
  status: BlueprintStatus;
  version: string;
  parent_version_id: string | null;
  author: BlueprintAuthor;
  blueprint: CommercialBlueprintData;
  readiness: BlueprintReadiness;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
}

export interface CommercialBlueprint extends CommercialBlueprintRow {
  data: CommercialBlueprintData;
}

export const BLUEPRINT_ARCHETYPE_LABELS: Record<BlueprintArchetype, string> = {
  acceleration: "Aceleração comercial",
  acquisition: "Aquisição de demanda",
  positioning: "Posicionamento",
  structure: "Estrutura digital",
  custom_solution: "Projeto sob medida",
};

export const BLUEPRINT_STATUS_LABELS: Record<BlueprintStatus, string> = {
  draft: "Rascunho",
  in_review: "Em revisão",
  approved: "Aprovado",
};

export function rowToBlueprint(row: CommercialBlueprintRow): CommercialBlueprint {
  return {
    ...row,
    data: row.blueprint as CommercialBlueprintData,
  };
}

export function archetypeToProposalTemplate(
  archetype: BlueprintArchetype,
): "acceleration" | "custom_solution" {
  return archetype === "custom_solution" ? "custom_solution" : "acceleration";
}
