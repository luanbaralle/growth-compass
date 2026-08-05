import type { NextStepLink } from "@/components/marketing/shared/NextSteps";
import { allCases, getCaseBySlug, getAllCases } from "@/data/cases";
import type { Case } from "@/types/case";

export type { Case };

/** @deprecated Use `Case` from `@/types/case` */
export type CaseStudy = Case;

export const casesSeo = {
  title: "Cases — Raise One",
  description:
    "Resultados reais de marketing, tecnologia e crescimento. Cases de UNIP, Studio 21, AMF Imóveis, Atlas e mais.",
};

export const caseCategories: { id: string; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "marketing", label: "Marketing" },
  { id: "tecnologia", label: "Tecnologia" },
  { id: "imobiliario", label: "Imobiliário" },
  { id: "ia", label: "IA" },
];

export const caseStudies = allCases;

export function getCaseStudy(slug: string): Case | undefined {
  return getCaseBySlug(slug);
}

export { getAllCases, getCaseBySlug, allCases };

export const casesNextSteps: NextStepLink[] = [
  {
    label: "Programa de Crescimento",
    description: "Como replicamos esses resultados no seu negócio.",
    href: "/programa-de-crescimento",
    internal: true,
  },
  {
    label: "Metodologia",
    description: "O framework por trás de cada case.",
    href: "/metodologia",
    internal: true,
  },
  {
    label: "Fazer diagnóstico",
    description: "Descubra suas oportunidades de crescimento.",
    href: "/diagnostico",
    internal: true,
  },
];
