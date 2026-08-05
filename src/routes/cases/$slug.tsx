import { createFileRoute, notFound } from "@tanstack/react-router";
import { CaseLayout } from "@/components/cases/CaseLayout";
import { getCaseBySlug } from "@/data/cases";
import { caseSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/cases/$slug")({
  loader: ({ params }) => {
    const caseData = getCaseBySlug(params.slug);
    if (!caseData) throw notFound();
    return { caseData };
  },
  head: ({ loaderData }) => caseSeoHead(loaderData.caseData.slug),
  component: CaseDetailRoute,
});

function CaseDetailRoute() {
  const { caseData } = Route.useLoaderData();
  return <CaseLayout caseData={caseData} />;
}
