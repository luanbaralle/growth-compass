import type { DiagnosticDomain } from "../types";

export const DIAGNOSTIC_DOMAIN_LABELS: Record<DiagnosticDomain, string> = {
  business: "Negócio",
  offer: "Oferta",
  customer: "ICP",
  commercial: "Comercial",
  economics: "Economia",
  acquisition: "Aquisição",
  marketing: "Marketing",
  brand: "Marca",
  content: "Conteúdo",
  goals: "Objetivos",
  expectations: "Expectativas",
  investment: "Investimento",
};

export const DIAGNOSTIC_DOMAIN_ORDER: DiagnosticDomain[] = [
  "business",
  "offer",
  "customer",
  "commercial",
  "economics",
  "acquisition",
  "marketing",
  "brand",
  "content",
  "goals",
  "expectations",
  "investment",
];

/** Clarity scores derivados da cobertura por domínio */
export const DOMAIN_CLARITY_LABELS: Record<DiagnosticDomain, string> = {
  business: "Clareza do negócio",
  offer: "Clareza da oferta",
  customer: "Clareza do ICP",
  commercial: "Clareza comercial",
  economics: "Clareza econômica",
  acquisition: "Clareza de aquisição",
  marketing: "Clareza de marketing",
  brand: "Clareza de marca",
  content: "Clareza de conteúdo",
  goals: "Clareza de objetivos",
  expectations: "Clareza de expectativas",
  investment: "Clareza de investimento",
};

const EXTRA_DOMAIN_LABELS: Record<string, string> = {
  company: "Empresa",
  contact: "Contato",
  products: "Produtos",
  risks: "Riscos",
  opportunities: "Oportunidades",
};

/** Rótulo localizado — ignora label persistido em inglês no snapshot/DB. */
export function resolveDomainLabel(domain: string, fallback?: string): string {
  return (
    DIAGNOSTIC_DOMAIN_LABELS[domain as DiagnosticDomain] ??
    EXTRA_DOMAIN_LABELS[domain] ??
    fallback ??
    domain
  );
}
