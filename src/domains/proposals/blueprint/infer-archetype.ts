import type { CopilotMeetingArtifact } from "@/domains/copilot/meeting/types";
import { inferProposalTemplate } from "../engine/artifact-to-proposal";
import type { BlueprintArchetype } from "./types";

function buildCorpus(artifact: CopilotMeetingArtifact): string {
  const graph = artifact.evidence_graph ?? [];
  return [
    graph.map((item) => `${item.label} ${item.value}`).join(" "),
    ...(artifact.what_we_learned ?? []),
    String((artifact.diagnosis as Record<string, unknown>).situation ?? ""),
    String((artifact.diagnosis as Record<string, unknown>).mainProblem ?? ""),
    artifact.transcript_summary ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

/** Pontua arquétipo comercial a partir do artefato Copilot. */
export function inferArchetype(artifact: CopilotMeetingArtifact): BlueprintArchetype {
  const template = inferProposalTemplate(artifact);
  if (template === "custom_solution") return "custom_solution";

  const corpus = buildCorpus(artifact);

  const scores: Record<BlueprintArchetype, number> = {
    acceleration: 0,
    acquisition: 0,
    positioning: 0,
    structure: 0,
    custom_solution: 0,
  };

  if (
    /corretor|seguro|consórcio|consorcio|clínica|clinica|saúde|saude|plano de saúde|matrícula|matricula|imobili|yamaha|rodobens/.test(
      corpus,
    )
  ) {
    scores.acceleration += 4;
  }

  if (/google ads|meta ads|tráfego|trafego|aquisição|aquisicao|campanha|lead/.test(corpus)) {
    scores.acquisition += 3;
    scores.acceleration += 2;
  }

  if (/posicionamento|marca|autoridade|credibilidade|conteúdo|conteudo/.test(corpus)) {
    scores.positioning += 3;
  }

  if (/site|landing|lp|tracking|gtm|ga4|crm|integração|integracao|estrutura/.test(corpus)) {
    scores.structure += 2;
  }

  if (/desenvolvimento|software|sistema|api|backend|sob medida/.test(corpus)) {
    scores.custom_solution += 5;
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const top = ranked[0];
  if (top && top[1] > 0) return top[0] as BlueprintArchetype;

  return "acceleration";
}
