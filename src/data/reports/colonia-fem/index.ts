import coloniaFemLogo from "@/assets/reports/colonia-fem/colonia-fem-logo.webp";
import printMobile from "@/assets/reports/colonia-fem/print-mobile.png";
import { coloniaFemCiclo01 } from "./ciclo-01";
import type { ReportCompany, ReportMonth } from "../types";

export const coloniaFemReports: ReportCompany = {
  slug: "colonia-fem",
  name: "Colônia FEM",
  legalName: "Pousada Colônia FEM",
  region: "Itanhaém · Litoral Sul · SP",
  platform: "Google Ads",
  logo: coloniaFemLogo,
  carouselImages: [printMobile],
  carouselStyle: "phone",
  conversionLabel: "WhatsApp",
  months: [coloniaFemCiclo01],
};

export function getColoniaFemMonth(slug: string): ReportMonth | undefined {
  return coloniaFemReports.months.find((m) => m.slug === slug);
}
