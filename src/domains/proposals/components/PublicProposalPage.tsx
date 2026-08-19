import type { Proposal } from "../types";
import {
  isSaudeCiaReferenceProposal,
  SaudeCiaReferenceProposalPage,
} from "./SaudeCiaReferenceProposalPage";
import { ProposalDraftBanner, R1PublicProposalPage } from "./R1PublicProposalPage";

export { ProposalDraftBanner } from "./R1PublicProposalPage";

export function PublicProposalPage({ proposal }: { proposal: Proposal }) {
  if (isSaudeCiaReferenceProposal(proposal)) {
    return <SaudeCiaReferenceProposalPage proposal={proposal} />;
  }
  return <R1PublicProposalPage proposal={proposal} />;
}

/** @deprecated Use R1PublicProposalPage */
export function AccelerationProposalPage({ proposal }: { proposal: Proposal }) {
  return <PublicProposalPage proposal={proposal} />;
}

/** @deprecated Use R1PublicProposalPage */
export function CustomSolutionProposalPage({ proposal }: { proposal: Proposal }) {
  return <R1PublicProposalPage proposal={proposal} />;
}
