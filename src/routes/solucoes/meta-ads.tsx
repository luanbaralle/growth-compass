import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/marketing/SolutionPage";
import { getSolutionPage } from "@/lib/solutions/content";
import { solutionSeoHead } from "@/lib/seo/pages";

const content = getSolutionPage("meta-ads")!;

export const Route = createFileRoute("/solucoes/meta-ads")({
  head: () => solutionSeoHead("meta-ads"),
  component: () => <SolutionPage content={content} />,
});
