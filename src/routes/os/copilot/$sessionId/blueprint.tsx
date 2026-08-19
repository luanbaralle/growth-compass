import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createBlueprintFromCopilot } from "@/domains/proposals/api.server";
import { PageSkeleton } from "@/os/ui";
import { useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/client-errors";

export const Route = createFileRoute("/os/copilot/$sessionId/blueprint")({
  component: CopilotBlueprintRedirect,
});

function CopilotBlueprintRedirect() {
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      try {
        const blueprint = await createBlueprintFromCopilot({ data: { sessionId } });
        await navigate({ to: "/os/propostas/blueprint/$id", params: { id: blueprint.id } });
      } catch (err) {
        toast.error(getErrorMessage(err, "Erro ao criar blueprint."));
        await navigate({ to: "/os/copilot/$sessionId", params: { sessionId } });
      }
    })();
  }, [sessionId, navigate]);

  return <PageSkeleton title="Blueprint comercial" metricCount={0} />;
}
