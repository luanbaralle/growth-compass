import { studio21Reports } from "./studio21";
import type { ReportCompany, ReportMonth } from "./types";

const COMPANIES: Record<string, ReportCompany> = {
  [studio21Reports.slug]: studio21Reports,
};

export function getReportCompany(slug: string): ReportCompany | undefined {
  return COMPANIES[slug];
}

export function getReportMonth(
  empresa: string,
  mes: string,
): { company: ReportCompany; month: ReportMonth } | undefined {
  const company = getReportCompany(empresa);
  if (!company) return undefined;
  const month = company.months.find((m) => m.slug === mes);
  if (!month) return undefined;
  return { company, month };
}

export type { ReportCompany, ReportMonth } from "./types";
