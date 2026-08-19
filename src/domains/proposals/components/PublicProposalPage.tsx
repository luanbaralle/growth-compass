import type { Proposal } from "../types";
import { ProposalDraftBanner, R1PublicProposalPage } from "./R1PublicProposalPage";

export { ProposalDraftBanner } from "./R1PublicProposalPage";

export function PublicProposalPage({ proposal }: { proposal: Proposal }) {
  return <R1PublicProposalPage proposal={proposal} />;
}

/** @deprecated Use R1PublicProposalPage — mantido para imports legados */
export function AccelerationProposalPage({ proposal }: { proposal: Proposal }) {
  return <R1PublicProposalPage proposal={proposal} />;
}

/** @deprecated Use R1PublicProposalPage */
export function CustomSolutionProposalPage({ proposal }: { proposal: Proposal }) {
  return <R1PublicProposalPage proposal={proposal} />;
}
