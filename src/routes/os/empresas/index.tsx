import { createFileRoute } from "@tanstack/react-router";
import { CompanyListPage } from "@/domains/companies/components/CompanyListPage";

export const Route = createFileRoute("/os/empresas/")({
  component: CompanyListPage,
});
