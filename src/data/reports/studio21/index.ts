import studio21Logo from "@/assets/reports/studio21/studio21-logo.png";
import { studio21Maio } from "./maio";
import { studio21Junho } from "./junho";
import { studio21Julho } from "./julho";
import { studio21Agosto } from "./agosto";
import type { ReportCompany, ReportMonth } from "../types";

export const studio21Reports: ReportCompany = {
  slug: "studio21",
  name: "Studio 21",
  legalName: "Studio 21 Cabeleireiros",
  region: "Itanhaém · Mongaguá · Peruíbe",
  platform: "Google Ads",
  logo: studio21Logo,
  months: [studio21Maio, studio21Junho, studio21Julho, studio21Agosto],
};

export function getStudio21Month(slug: string): ReportMonth | undefined {
  return studio21Reports.months.find((m) => m.slug === slug);
}
