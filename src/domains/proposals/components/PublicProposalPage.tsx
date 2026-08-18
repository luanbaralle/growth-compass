import type { Proposal } from "../types";
import { AccelerationProposalPage } from "./AccelerationProposalPage";
import { CustomSolutionProposalPage } from "./CustomSolutionProposalPage";

export function PublicProposalPage({ proposal }: { proposal: Proposal }) {
  if (proposal.template === "custom_solution") {
    return <CustomSolutionProposalPage proposal={proposal} />;
  }
  return <AccelerationProposalPage proposal={proposal} />;
}
