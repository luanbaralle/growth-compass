import { createFileRoute } from "@tanstack/react-router";
import { PublicProposalPage } from "@/domains/proposals/components/PublicProposalPage";
import { getProposalBySlug } from "@/domains/proposals/api.server";

export const Route = createFileRoute("/propostas/$slug")({
  loader: async ({ params }) => {
    try {
      return await getProposalBySlug({ data: { slug: params.slug } });
    } catch {
      return null;
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? "Proposta · Raise One" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PublicProposalRoute,
});

function PublicProposalRoute() {
  const proposal = Route.useLoaderData();

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
