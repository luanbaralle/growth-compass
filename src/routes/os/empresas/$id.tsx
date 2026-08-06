import { createFileRoute } from "@tanstack/react-router";
import { CompanyDetailPage } from "@/domains/companies/components/CompanyDetailPage";

export const Route = createFileRoute("/os/empresas/$id")({
  component: CompanyDetailRoute,
});

function CompanyDetailRoute() {
  const { id } = Route.useParams();
  return <CompanyDetailPage companyId={id} />;
}
