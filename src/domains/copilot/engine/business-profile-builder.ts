import { getObjectiveByKey } from "../knowledge";
import type { BusinessProfile, BusinessProfileNode, DiagnosticState } from "../types";
import { isObjectiveSatisfied } from "./diagnostic-engine";

function formatValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "object" && value !== null && "min" in value && "max" in value) {
    const r = value as { min?: number; max?: number };
    if (r.min != null && r.max != null && r.min !== r.max) return `~${r.min}-${r.max}`;
    return `~${r.min ?? r.max}`;
  }
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function nodeFromObjective(
  key: string,
  diagnosticState: DiagnosticState,
  fallbackLabel?: string,
): BusinessProfileNode | null {
  const record = diagnosticState[key];
  if (!isObjectiveSatisfied(record)) return null;
  const obj = getObjectiveByKey(key);
  const label = obj?.label ?? fallbackLabel ?? key;
  const value = formatValue(record?.evidence?.value);
  if (!value) return null;
  return { key, label, value };
}

export function buildBusinessProfile(
  diagnosticState: DiagnosticState,
  context: { companyName?: string; contactName?: string },
): BusinessProfile {
  const roots: BusinessProfileNode[] = [];

  const companyChildren: BusinessProfileNode[] = [];
  const history = nodeFromObjective("business_history", diagnosticState, "História");
  const diff = nodeFromObjective("differentiator", diagnosticState, "Diferencial");
  if (history) companyChildren.push(history);
  if (diff) companyChildren.push(diff);

  if (context.companyName || companyChildren.length > 0) {
    roots.push({
      key: "company",
      label: "Empresa",
      value: context.companyName,
      children: companyChildren.length > 0 ? companyChildren : undefined,
    });
  }

  const productNodes = [
    nodeFromObjective("product_portfolio", diagnosticState, "Produtos"),
    nodeFromObjective("top_selling_product", diagnosticState, "Mais vende"),
    nodeFromObjective("strategic_product_priority", diagnosticState, "Prioridade"),
  ].filter(Boolean) as BusinessProfileNode[];

  if (productNodes.length > 0) {
    roots.push({
      key: "products",
      label: "Produtos",
      children: productNodes,
    });
  }

  const icpNodes = [
    nodeFromObjective("customer_type", diagnosticState, "Tipo"),
    nodeFromObjective("customer_geography", diagnosticState, "Região"),
    nodeFromObjective("current_icp", diagnosticState, "ICP atual"),
  ].filter(Boolean) as BusinessProfileNode[];

  if (icpNodes.length > 0) {
    roots.push({ key: "customer", label: "Cliente", children: icpNodes });
  }

  const acqNodes = [
    nodeFromObjective("primary_acquisition_channel", diagnosticState, "Canal principal"),
    nodeFromObjective("channel_mix", diagnosticState, "Mix"),
    nodeFromObjective("referral_dependency", diagnosticState, "Indicação"),
  ].filter(Boolean) as BusinessProfileNode[];

  if (acqNodes.length > 0) {
    roots.push({ key: "acquisition", label: "Aquisição", children: acqNodes });
  }

  const commercialLeaves = [
    nodeFromObjective("lead_volume", diagnosticState, "Leads/mês"),
    nodeFromObjective("sales_volume", diagnosticState, "Vendas/mês"),
    nodeFromObjective("service_capacity", diagnosticState, "Capacidade"),
  ].filter(Boolean) as BusinessProfileNode[];

  for (const leaf of commercialLeaves) {
    roots.push(leaf);
  }

  const problem = nodeFromObjective("referral_dependency", diagnosticState);
  if (problem?.value?.toLowerCase().includes("indica")) {
    roots.push({
      key: "problem",
      label: "Problema",
      value: "Dependência de indicação",
    });
  }

  const goal = nodeFromObjective("numeric_growth_target", diagnosticState, "Objetivo");
  if (goal) roots.push({ key: "goal", label: "Objetivo", value: goal.value });

  const marketing = nodeFromObjective("google_ads_history", diagnosticState);
  if (marketing) {
    roots.push({
      key: "marketing",
      label: "Marketing",
      value: marketing.value?.includes("nunca") ? "Nunca fez Google Ads" : marketing.value,
    });
  }

  return {
    companyName: context.companyName,
    contactName: context.contactName,
    roots,
  };
}
