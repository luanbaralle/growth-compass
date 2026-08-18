/**
 * Extrator baseado em regras — Sprint 1 (sem LLM).
 * Sprint 2 substitui/ complementa com evidence-extractor LLM.
 */
import { getKnowledgeGraph } from "../knowledge";
import type { Evidence, EvidenceKind } from "../types";

export interface ExtractionMatch {
  objectiveKey: string;
  evidence: Evidence;
  inferenceKeys?: Array<{ key: string; evidence: Evidence }>;
}

function evidence(
  value: unknown,
  quote: string,
  kind: EvidenceKind = "fact",
  confidence: Evidence["confidence"] = "medium",
): Evidence {
  return {
    value,
    confidence,
    source: kind === "inference" ? "ai_inference" : "prospect_statement",
    kind,
    quote,
    capturedAt: new Date().toISOString(),
  };
}

function parseNumericRange(text: string): { min: number; max: number } | number | null {
  const range = text.match(/(\d+)\s*[,e]\s*(\d+)/i);
  if (range) {
    const a = parseInt(range[1]!, 10);
    const b = parseInt(range[2]!, 10);
    return { min: Math.min(a, b), max: Math.max(a, b) };
  }
  const single = text.match(/(\d+)/);
  if (single) return parseInt(single[1]!, 10);
  return null;
}

const RULES: Array<{
  test: (t: string) => boolean;
  objectiveKey: string;
  extract: (t: string) => ExtractionMatch | null;
}> = [
  {
    test: (t) => /indicação|indicacao|indicam|referral|maioria.*indica/i.test(t),
    objectiveKey: "referral_dependency",
    extract: (t) => ({
      objectiveKey: "referral_dependency",
      evidence: evidence("Alta dependência de indicação", t, "inference", "high"),
      inferenceKeys: [
        {
          key: "primary_acquisition_channel",
          evidence: evidence("Indicação", t, "inference", "medium"),
        },
      ],
    }),
  },
  {
    test: (t) => /(\d+|\buns\b|\baproximadamente\b).*contatos|leads|chegam|whatsapp/i.test(t),
    objectiveKey: "lead_volume",
    extract: (t) => {
      const num = parseNumericRange(t);
      if (num == null) return null;
      return {
        objectiveKey: "lead_volume",
        evidence: evidence(num, t, "fact", /acho|aproxim|uns/i.test(t) ? "low" : "medium"),
      };
    },
  },
  {
    test: (t) =>
      /fechamos|viram clientes|vendas.*m[eê]s/i.test(t) &&
      !/quero|meta|diferença|novos clientes por/i.test(t),
    objectiveKey: "sales_volume",
    extract: (t) => {
      const num = parseNumericRange(t);
      if (num == null) return null;
      return {
        objectiveKey: "sales_volume",
        evidence: evidence(num, t, "fact", /acho|aproxim/i.test(t) ? "low" : "medium"),
      };
    },
  },
  {
    test: (t) =>
      /cons[oó]rcio|seguro sa[uú]de|seguro auto|plano de sa[uú]de/i.test(t) &&
      !/escolher|prioriz|vender muito mais|trabalhar.*meses/i.test(t),
    objectiveKey: "product_portfolio",
    extract: (t) => {
      const products: string[] = [];
      if (/seguro sa[uú]de|plano de sa[uú]de/i.test(t)) products.push("Seguro Saúde");
      if (/seguro auto/i.test(t)) products.push("Seguro Auto");
      if (/cons[oó]rcio/i.test(t)) products.push("Consórcio");
      if (products.length === 0) return null;
      return {
        objectiveKey: "product_portfolio",
        evidence: evidence(products, t, "fact", "high"),
      };
    },
  },
  {
    test: (t) => /prioriz|trabalhar.*meses|vender muito mais|escolher.*um produto/i.test(t),
    objectiveKey: "strategic_product_priority",
    extract: (t) => {
      const m = t.match(/cons[oó]rcio|seguro|auto|sa[uú]de/i);
      const product = m ? m[0] : t.slice(0, 80);
      return {
        objectiveKey: "strategic_product_priority",
        evidence: evidence(product, t, "fact", "medium"),
      };
    },
  },
  {
    test: (t) => {
      if (/outras empresas|empresas da|empresas do|empresas no|empresas que|diferencia.*empresas/i.test(t)) {
        return false;
      }
      return (
        /\bpessoa f[ií]sica\b|\bpf\b|\bpessoa jur[ií]dica\b|\bpj\b/i.test(t) ||
        /\b(atendemos|trabalhamos com|nossos clientes s[aã]o|vendemos para)\s+empresas\b/i.test(t)
      );
    },
    objectiveKey: "customer_type",
    extract: (t) => ({
      objectiveKey: "customer_type",
      evidence: evidence(
        /\bpessoa jur[ií]dica\b|\bpj\b|\b(atendemos|trabalhamos com|clientes s[aã]o)\s+empresas\b/i.test(t)
          ? "Pessoa jurídica"
          : "Pessoa física",
        t,
        "fact",
        "high",
      ),
    }),
  },
  {
    test: (t) =>
      /cidade|regi[aã]o|clientes v[eê]m|itanha[eé]m/i.test(t) &&
      !/^hoje\b/i.test(t.trim()),
    objectiveKey: "customer_geography",
    extract: (t) => {
      const city = t.match(/\b(itanha[eé]m)\b/i);
      if (!city) return null;
      return {
        objectiveKey: "customer_geography",
        evidence: evidence(city[1], t, "fact", "medium"),
      };
    },
  },
  {
    test: (t) => /google ads|nunca.*google|n[aã]o fizemos.*google/i.test(t),
    objectiveKey: "google_ads_history",
    extract: (t) => ({
      objectiveKey: "google_ads_history",
      evidence: evidence(
        /nunca|n[aã]o/i.test(t) ? "Nunca fez Google Ads" : "Já utilizou Google Ads",
        t,
        "fact",
        "high",
      ),
    }),
  },
  {
    test: (t) => /instagram/i.test(t) && /clientes|traz|vitrine|indica/i.test(t),
    objectiveKey: "channel_mix",
    extract: (t) => ({
      objectiveKey: "channel_mix",
      evidence: evidence("Instagram ativo", t, "fact", "medium"),
    }),
  },
  {
    test: (t) => /quero|meta|diferença|far(iam|ia) diferença|novos clientes por/i.test(t),
    objectiveKey: "numeric_growth_target",
    extract: (t) => {
      const num = parseNumericRange(t);
      if (num == null) return null;
      return {
        objectiveKey: "numeric_growth_target",
        evidence: evidence(num, t, "fact", "medium"),
      };
    },
  },
  {
    test: (t) => /dobro de contatos|capacidade|atender.*mais/i.test(t),
    objectiveKey: "service_capacity",
    extract: (t) => ({
      objectiveKey: "service_capacity",
      evidence: evidence(
        /sim|tranquil|consegue|dobro/i.test(t) ? "Alta" : "Limitada",
        t,
        "inference",
        "medium",
      ),
    }),
  },
  {
    test: (t) => /follow.?up|quando lembramos|n[aã]o fazemos follow/i.test(t),
    objectiveKey: "follow_up_process",
    extract: (t) => ({
      objectiveKey: "follow_up_process",
      evidence: evidence(
        /n[aã]o|nunca/i.test(t) ? "Inexistente" : /lembramos|informal/i.test(t) ? "Informal" : "Definido",
        t,
        "fact",
        "high",
      ),
    }),
  },
  {
    test: (t) =>
      /\b(corretora|seguros|consórcio|consorcio|plano de saúde|yamaha|rodobens)\b/i.test(t) &&
      /\b(minha|nossa|a gente|eu|anos|representante)\b/i.test(t),
    objectiveKey: "business_history",
    extract: (t) => ({
      objectiveKey: "business_history",
      evidence: evidence(t.slice(0, 140), t, "fact", "medium"),
    }),
  },
  {
    test: (t) => /\b(indicação|indicacao|maioria.*indica)\b/i.test(t),
    objectiveKey: "referral_dependency",
    extract: (t) => ({
      objectiveKey: "referral_dependency",
      evidence: evidence("Alta dependência de indicação", t, "inference", "high"),
      inferenceKeys: [
        {
          key: "primary_acquisition_channel",
          evidence: evidence("Indicação", t, "inference", "medium"),
        },
      ],
    }),
  },
  {
    test: (t) => /\b(uns?\s*10|dez)\b.*\b(clientes|possíveis|possiveis|novos)\b/i.test(t),
    objectiveKey: "lead_volume",
    extract: (t) => ({
      objectiveKey: "lead_volume",
      evidence: evidence({ min: 10, max: 10 }, t, "fact", "medium"),
    }),
  },
  {
    test: (t) => /\b(google|internet|orgânico|organico)\b/i.test(t) && /\b(pesquis|encontr|ligou|chegam)\b/i.test(t),
    objectiveKey: "primary_acquisition_channel",
    extract: (t) => ({
      objectiveKey: "primary_acquisition_channel",
      evidence: evidence("Google / busca orgânica", t, "inference", "medium"),
    }),
  },
  {
    test: (t) => /\b(agenda do google|sem crm|não tem crm|nao tem crm|anotações)\b/i.test(t),
    objectiveKey: "sales_process_overview",
    extract: (t) => ({
      objectiveKey: "sales_process_overview",
      evidence: evidence("Processo manual — Google Agenda / anotações", t, "fact", "medium"),
    }),
  },
  {
    test: (t) => /\b(site|instagram|social mídia|social media|marketing)\b/i.test(t) && /\b(tentei|contrat|não deu|nao deu|experiência ruim)\b/i.test(t),
    objectiveKey: "agency_history",
    extract: (t) => ({
      objectiveKey: "agency_history",
      evidence: evidence(t.slice(0, 120), t, "fact", "medium"),
    }),
  },
  {
    test: (t) => /\b(capacidade|atender|equipe|boom|volume)\b/i.test(t) && /\b(preocup|limitad|não consigo|nao consigo)\b/i.test(t),
    objectiveKey: "service_capacity",
    extract: (t) => ({
      objectiveKey: "service_capacity",
      evidence: evidence("Capacidade operacional limitada", t, "inference", "medium"),
    }),
  },
  {
    test: (t) => /sa[uú]de & cia|sa[uú]de e cia|corretora/i.test(t),
    objectiveKey: "business_history",
    extract: (t) => ({
      objectiveKey: "business_history",
      evidence: evidence("Saúde & Cia — corretora", t, "fact", "medium"),
    }),
  },
  {
    test: (t) =>
      /\b(cl[ií]nica|consult[oó]rio|odonto|implante|dentista)\b/i.test(t) &&
      /\b(minha|nossa|a gente|nós|nos)\b/i.test(t),
    objectiveKey: "operation_structure",
    extract: (t) => ({
      objectiveKey: "operation_structure",
      evidence: evidence("Clínica odontológica", t, "fact", "medium"),
    }),
  },
  {
    test: (t) =>
      /\b(ag[eê]ncia|agencia)\b/i.test(t) &&
      /\b(contrat|pegamos|trocamos|saiu|rio grande|dueto)\b/i.test(t),
    objectiveKey: "agency_history",
    extract: (t) => ({
      objectiveKey: "agency_history",
      evidence: evidence(t.slice(0, 120), t, "fact", "medium"),
    }),
  },
  {
    test: (t) =>
      /\b(facebook|instagram|meta)\b/i.test(t) &&
      /\b(lead|anúncio|anuncio|campanha|implante)\b/i.test(t),
    objectiveKey: "primary_acquisition_channel",
    extract: (t) => ({
      objectiveKey: "primary_acquisition_channel",
      evidence: evidence("Meta Ads (Facebook/Instagram)", t, "inference", "medium"),
    }),
  },
  {
    test: (t) =>
      /\b(aumentar|escala|previsibilidade|faturamento|crescer)\b/i.test(t) &&
      /\b(venda|cliente|resultado|meta)\b/i.test(t),
    objectiveKey: "primary_desired_result",
    extract: (t) => ({
      objectiveKey: "primary_desired_result",
      evidence: evidence("Crescimento de faturamento com escala", t, "inference", "medium"),
    }),
  },
  {
    test: (t) =>
      /\b(precis|preciso|ajuda|auxiliar|captar|contratar)\b/i.test(t) &&
      /\b(profissional|equipe|comercial|lead|cliente|estética|estetica|botox)\b/i.test(t),
    objectiveKey: "help_seeking_reason",
    extract: (t) => ({
      objectiveKey: "help_seeking_reason",
      evidence: evidence(t.slice(0, 140), t, "fact", "medium"),
    }),
  },
  {
    test: (t) =>
      /\b(primeira vez|primeiro neg[oó]cio|primeira empresa|primeira vez)\b/i.test(t),
    objectiveKey: "business_history",
    extract: (t) => ({
      objectiveKey: "business_history",
      evidence: evidence("Primeiro negócio como administrador", t, "fact", "medium"),
    }),
  },
  {
    test: (t) =>
      /\b(funil|qualific|lead|comparecer|agendar|orçamento|fechar)\b/i.test(t) &&
      !/\b(o jogo todo|primeiro pilar|prospecção ativa)\b/i.test(t),
    objectiveKey: "sales_process_overview",
    extract: (t) => ({
      objectiveKey: "sales_process_overview",
      evidence: evidence(t.slice(0, 140), t, "fact", "medium"),
    }),
  },
];

export function extractFromText(text: string): ExtractionMatch[] {
  const normalized = text.trim();
  if (!normalized) return [];

  const matches: ExtractionMatch[] = [];
  const seen = new Set<string>();

  for (const rule of RULES) {
    if (!rule.test(normalized)) continue;
    const match = rule.extract(normalized);
    if (!match || seen.has(match.objectiveKey)) continue;
    seen.add(match.objectiveKey);
    matches.push(match);
    for (const inf of match.inferenceKeys ?? []) {
      if (!seen.has(inf.key)) {
        seen.add(inf.key);
        matches.push({ objectiveKey: inf.key, evidence: inf.evidence });
      }
    }
  }

  return matches;
}

export function getObjectiveKeysMentionedInGraph(): string[] {
  return getKnowledgeGraph().map((o) => o.key);
}
