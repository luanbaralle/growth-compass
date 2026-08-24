import { createFileRoute, notFound } from "@tanstack/react-router";
import { ReportHub } from "@/domains/reports/components/ReportHub";
import { getReportCompany } from "@/data/reports";

export const Route = createFileRoute("/relatorios/$empresa/")({
  loader: ({ params }) => {
    const company = getReportCompany(params.empresa);
    if (!company) throw notFound();
    return { company };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `Relatórios Google Ads — ${loaderData?.company.name ?? "Raise One"}`,
      },
      {
        name: "description",
        content: `Relatórios mensais de performance do Google Ads — ${loaderData?.company.legalName ?? ""}.`,
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReportHubRoute,
});

function ReportHubRoute() {
  const { company } = Route.useLoaderData();
  return <ReportHub company={company} />;
}
