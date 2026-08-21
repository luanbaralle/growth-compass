import { createFileRoute } from "@tanstack/react-router";
import { PublicProposalPage } from "@/domains/proposals/components/PublicProposalPage";
import { Route as SlugLayoutRoute } from "../$slug";

export const Route = createFileRoute("/propostas/$slug/")({
  component: PublicProposalIndexRoute,
});

function PublicProposalIndexRoute() {
  const proposal = SlugLayoutRoute.useLoaderData();

  if (!proposal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b] px-6 text-center text-white/70">
        <div>
          <h1 className="text-xl font-semibold text-white">Proposta não encontrada</h1>
          <p className="mt-2 text-sm">Este link pode estar expirado ou a proposta ainda não foi publicada.</p>
        </div>
      </div>
    );
  }

  return <PublicProposalPage proposal={proposal} />;
}
