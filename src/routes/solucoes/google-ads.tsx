import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/marketing/SolutionPage";
import { getSolutionPage } from "@/lib/solutions/content";
import { solutionSeoHead } from "@/lib/seo/pages";

const content = getSolutionPage("google-ads")!;

export const Route = createFileRoute("/solucoes/google-ads")({
  head: () => solutionSeoHead("google-ads"),
  component: () => <SolutionPage content={content} />,
});
