import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/marketing/SolutionPage";
import { getSolutionPage } from "@/lib/solutions/content";
import { solutionSeoHead } from "@/lib/seo/pages";

const content = getSolutionPage("producao-de-conteudo")!;

export const Route = createFileRoute("/solucoes/producao-de-conteudo")({
  head: () => solutionSeoHead("producao-de-conteudo"),
  component: () => <SolutionPage content={content} />,
});
