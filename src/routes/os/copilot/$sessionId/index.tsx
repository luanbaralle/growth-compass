import { createFileRoute } from "@tanstack/react-router";
import { CopilotSessionPage } from "@/domains/copilot/components/CopilotSessionPage";

export const Route = createFileRoute("/os/copilot/$sessionId/")({
  component: CopilotSessionRoute,
});

function CopilotSessionRoute() {
  const { sessionId } = Route.useParams();
  return <CopilotSessionPage sessionId={sessionId} />;
}
