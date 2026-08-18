import { createFileRoute } from "@tanstack/react-router";
import { ProposalListPage } from "@/domains/proposals/components/ProposalListPage";

export const Route = createFileRoute("/os/propostas/")({
  component: ProposalListPage,
});
