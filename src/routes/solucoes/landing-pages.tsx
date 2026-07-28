import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/marketing/SolutionPage";
import { getSolutionPage } from "@/lib/solutions/content";
import { solutionSeoHead } from "@/lib/seo/pages";

const content = getSolutionPage("landing-pages")!;

export const Route = createFileRoute("/solucoes/landing-pages")({
  head: () => solutionSeoHead("landing-pages"),
  component: () => <SolutionPage content={content} />,
});
