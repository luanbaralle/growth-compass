import unipLogo from "@/assets/reports/unip/unip-logo.jpg";
import printAdsSerp from "@/assets/reports/unip/print-ads-serp.png";
import printDesktop from "@/assets/reports/unip/print-desktop.png";
import { unipJulho } from "./julho";
import { unipAgosto } from "./agosto";
import type { ReportCompany, ReportMonth } from "../types";

export const unipReports: ReportCompany = {
  slug: "unip",
  name: "UNIP",
  legalName: "UNIP Polo Caraguatatuba",
  region: "Caraguatatuba · São Sebastião · Ilhabela",
  platform: "Google Ads",
  logo: unipLogo,
  carouselImages: [printAdsSerp, printDesktop],
  conversionLabel: "Conversões",
  months: [unipJulho, unipAgosto],
};

export function getUnipMonth(slug: string): ReportMonth | undefined {
  return unipReports.months.find((m) => m.slug === slug);
}
