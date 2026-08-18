import { createFileRoute } from "@tanstack/react-router";
import { ProposalDetailPage } from "@/domains/proposals/components/ProposalDetailPage";

export const Route = createFileRoute("/os/propostas/$id/")({
  component: ProposalDetailRoute,
});

function ProposalDetailRoute() {
  const { id } = Route.useParams();
  return <ProposalDetailPage proposalId={id} />;
}
