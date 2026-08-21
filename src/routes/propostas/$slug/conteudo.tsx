import { createFileRoute } from "@tanstack/react-router";
import { SaudeCiaContentPlanPage } from "@/domains/proposals/components/SaudeCiaDownsellPages";
import { isSaudeCiaReferenceProposal } from "@/domains/proposals/components/SaudeCiaReferenceProposalPage";
import { Route as SlugLayoutRoute } from "../$slug";

export const Route = createFileRoute("/propostas/$slug/conteudo")({
  head: () => ({
    meta: [
      { title: "Plano de Conteúdo · Saúde & Cia" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ContentPlanRoute,
});

function ContentPlanRoute() {
  const proposal = SlugLayoutRoute.useLoaderData();

  if (!proposal || !isSaudeCiaReferenceProposal(proposal)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b] px-6 text-center text-white/70">
        <div>
          <h1 className="text-xl font-semibold text-white">Página não encontrada</h1>
          <p className="mt-2 text-sm">Esta frente não está disponível para esta proposta.</p>
        </div>
      </div>
    );
  }

  return <SaudeCiaContentPlanPage proposal={proposal} />;
}
