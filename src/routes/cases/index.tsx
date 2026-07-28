import { createFileRoute } from "@tanstack/react-router";
import { CasesPage } from "@/components/marketing/CasesPage";
import { casesSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/cases/")({
  head: () => casesSeoHead(),
  component: CasesPage,
});
