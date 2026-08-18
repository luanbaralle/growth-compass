/**
 * Mapeia itens do evidence graph para objectiveKeys do knowledge graph —
 * aumenta coverage pós-síntese quando a LLM não preenche objectiveKey.
 */
import { getKnowledgeGraph } from "../knowledge";
import type { DiagnosticState, EvidenceGraphItem } from "../types";
import { upsertEvidence } from "./diagnostic-engine";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

const LABEL_PATTERNS: Array<{ key: string; test: RegExp }> = [
  { key: "business_history", test: /\b(anos|mercado|fundad|atua)\b/i },
  { key: "differentiator", test: /diferencial|exclusiv|representante|yamaha|rodobens/i },
  { key: "operation_structure", test: /equipe|estrutura oper|capacidade|atendimentos.*dia/i },
  { key: "product_portfolio", test: /portf[oó]lio|produtos oferecid|mix de produto/i },
  { key: "most_profitable_product", test: /rent[aá]v|lucrativ|margem|produto mais/i },
  { key: "strategic_product_priority", test: /priorid|foco|estrat[eé]gic/i },
  { key: "lead_volume", test: /volume de lead|leads.*m[eê]s|contatos.*m[eê]s|\d+.*por m[eê]s|novos clientes/i },
  { key: "sales_volume", test: /volume de venda|vendas.*m[eê]s/i },
  { key: "conversion_rate", test: /convers[aã]o|taxa de fech/i },
  { key: "referral_dependency", test: /indica/i },
  { key: "primary_acquisition_channel", test: /canal principal|fonte de cliente|aquisi/i },
  { key: "channel_mix", test: /mix de canal|google|instagram|whatsapp/i },
  { key: "agency_history", test: /ag[eê]ncia|terceiriz|social media|tr[aá]fego/i },
  { key: "digital_presence_perception", test: /presen[cç]a digital|shadowban|site|instagram/i },
  { key: "google_ads_history", test: /google ads|an[uú]ncio/i },
  { key: "help_seeking_reason", test: /busca.*marketing|procur.*ajuda|visibilidade|aparecer mais/i },
  { key: "primary_desired_result", test: /resultado desejado|resolver|objetivo principal/i },
  { key: "numeric_growth_target", test: /meta.*cresc|aumentar.*client/i },
  { key: "six_month_success_vision", test: /6 meses|seis meses|sucesso em/i },
  { key: "partner_expectation", test: /expectativa.*parceiro|parceria/i },
  { key: "monthly_marketing_budget", test: /or[cç]amento|budget|invest.*marketing/i },
  { key: "avg_sale_value", test: /ticket|valor m[eé]dio.*venda/i },
  { key: "avg_commission", test: /comiss/i },
  { key: "customer_ltv", test: /ltv|lifetime|mesmo cliente|carteira/i },
  { key: "customer_type", test: /tipo de cliente|pessoa f[ií]sica|\bpf\b|\bpj\b/i },
  { key: "current_icp", test: /\bicp\b|p[uú]blico.alvo|cliente ideal|perfil/i },
  { key: "content_willingness", test: /disposi.*conte[uú]do|produzir conte[uú]do/i },
  { key: "personal_vs_institutional", test: /marca pessoal|como pessoa|imagem pessoal|especialista/i },
  { key: "sales_process_overview", test: /processo comercial|funil|atendimento.*lead/i },
  { key: "service_capacity", test: /capacidade|atender.*boom|equipe pequena/i },
];

export function inferObjectiveKey(
  item: Pick<EvidenceGraphItem, "label" | "value" | "domain" | "objectiveKey">,
): string | undefined {
  if (item.objectiveKey) return item.objectiveKey;

  const labelNorm = normalize(item.label);
  const combined = `${labelNorm} ${normalize(item.value)}`;

  for (const obj of getKnowledgeGraph()) {
    const objLabel = normalize(obj.label);
    if (labelNorm === objLabel) return obj.key;
    if (labelNorm.length >= 6 && (labelNorm.includes(objLabel) || objLabel.includes(labelNorm))) {
      return obj.key;
    }
  }

  for (const { key, test } of LABEL_PATTERNS) {
    if (test.test(item.label) || test.test(combined)) return key;
  }

  return undefined;
}

export function enrichGraphWithObjectiveKeys(
  graph: EvidenceGraphItem[],
): EvidenceGraphItem[] {
  return graph.map((item) => ({
    ...item,
    objectiveKey: inferObjectiveKey(item) ?? item.objectiveKey,
  }));
}

export function applyGraphToDiagnosticState(
  diagnosticState: DiagnosticState,
  graph: EvidenceGraphItem[],
): DiagnosticState {
  let state = { ...diagnosticState };
  const enriched = enrichGraphWithObjectiveKeys(graph);

  for (const item of enriched) {
    if (!item.objectiveKey) continue;
    if (item.kind === "opportunity") continue;
    if (
      (item.source === "consultant_statement" || item.source === "r1_team") &&
      item.kind !== "fact"
    ) {
      continue;
    }
    if (item.source === "ai_inference" && item.kind === "hypothesis") continue;

    const existing = state[item.objectiveKey];
    if (existing?.state === "verified") continue;

    state = upsertEvidence(state, item.objectiveKey, {
      value: item.value,
      confidence: item.confidence,
      source: item.source,
      kind: item.kind === "opportunity" ? "inference" : item.kind,
      status: item.status,
      quote: item.quote ?? item.value,
      capturedAt: new Date().toISOString(),
      segmentIds: item.segmentIds,
    });
  }

  return state;
}
