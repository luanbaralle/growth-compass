import { createFileRoute } from "@tanstack/react-router";
import { BlueprintStudioPage } from "@/domains/proposals/components/BlueprintStudioPage";

export const Route = createFileRoute("/os/propostas/blueprint/$id")({
  component: BlueprintStudioRoute,
});

function BlueprintStudioRoute() {
  const { id } = Route.useParams();
  return <BlueprintStudioPage blueprintId={id} />;
}
