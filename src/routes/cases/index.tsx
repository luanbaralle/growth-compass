import { createFileRoute } from "@tanstack/react-router";
import { CasesListingPage } from "@/components/cases/CasesListingPage";
import { casesSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/cases/")({
  head: () => casesSeoHead(),
  component: CasesListingPage,
});
