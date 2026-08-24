import { createFileRoute, notFound } from "@tanstack/react-router";
import { ReportMonthView } from "@/domains/reports/components/ReportMonthView";
import { getReportMonth } from "@/data/reports";

export const Route = createFileRoute("/relatorios/$empresa/$mes")({
  loader: ({ params }) => {
    const data = getReportMonth(params.empresa, params.mes);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `Relatório Google Ads — ${loaderData?.company.name ?? ""} · ${loaderData?.month.cycleShort ?? ""}`,
      },
      {
        name: "description",
        content: `Relatório de performance ${loaderData?.month.cycleLabel ?? ""} — ${loaderData?.company.legalName ?? ""}.`,
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReportMonthRoute,
});

function ReportMonthRoute() {
  const { company, month } = Route.useLoaderData();
  return <ReportMonthView company={company} month={month} />;
}
