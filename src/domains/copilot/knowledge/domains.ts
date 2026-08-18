import type { DiagnosticDomain } from "../types";

export const DIAGNOSTIC_DOMAIN_LABELS: Record<DiagnosticDomain, string> = {
  business: "Business",
  offer: "Offer",
  customer: "ICP",
  commercial: "Commercial",
  economics: "Economics",
  acquisition: "Acquisition",
  marketing: "Marketing",
  brand: "Brand",
  content: "Content",
  goals: "Objectives",
  expectations: "Expectations",
  investment: "Investment",
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
  business: "Business Clarity",
  offer: "Offer Clarity",
  customer: "ICP Clarity",
  commercial: "Commercial Clarity",
  economics: "Economics Clarity",
  acquisition: "Acquisition Clarity",
  marketing: "Marketing Clarity",
  brand: "Brand Clarity",
  content: "Content Clarity",
  goals: "Goal Clarity",
  expectations: "Expectations Clarity",
  investment: "Investment Clarity",
};
