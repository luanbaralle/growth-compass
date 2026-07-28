import { createFileRoute, notFound } from "@tanstack/react-router";
import { CaseStudyPage } from "@/components/marketing/CaseStudyPage";
import { getCaseStudy } from "@/lib/cases/content";
import { caseSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/cases/$slug")({
  loader: ({ params }) => {
    const caseStudy = getCaseStudy(params.slug);
    if (!caseStudy) throw notFound();
    return { caseStudy };
  },
  head: ({ loaderData }) => caseSeoHead(loaderData.caseStudy.slug),
  component: CaseStudyRoute,
});

function CaseStudyRoute() {
  const { caseStudy } = Route.useLoaderData();
  return <CaseStudyPage caseStudy={caseStudy} />;
}
