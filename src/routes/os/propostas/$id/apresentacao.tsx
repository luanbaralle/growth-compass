import { createFileRoute } from "@tanstack/react-router";
import { ProposalPresentationPage } from "@/domains/proposals/components/ProposalPresentationPage";

export const Route = createFileRoute("/os/propostas/$id/apresentacao")({
  component: ProposalPresentationRoute,
});

function ProposalPresentationRoute() {
  const { id } = Route.useParams();
  return <ProposalPresentationPage proposalId={id} />;
}
