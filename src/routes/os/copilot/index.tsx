import { createFileRoute } from "@tanstack/react-router";
import { CopilotLandingPage } from "@/domains/copilot/components/CopilotLandingPage";

type LandingSearch = {
  prospectName?: string;
  companyName?: string;
  prospectId?: string;
};

export const Route = createFileRoute("/os/copilot/")({
  validateSearch: (search: Record<string, unknown>): LandingSearch => ({
    prospectName: typeof search.prospectName === "string" ? search.prospectName : undefined,
    companyName: typeof search.companyName === "string" ? search.companyName : undefined,
    prospectId: typeof search.prospectId === "string" ? search.prospectId : undefined,
  }),
  component: CopilotLandingPage,
});
