import { createFileRoute } from "@tanstack/react-router";
import { ClientContentDetailPage } from "@/client/pages/ClientContentPage";

export const Route = createFileRoute("/client/conteudo/$taskId")({
  component: ClientContentDetailRoute,
});

function ClientContentDetailRoute() {
  const { taskId } = Route.useParams();
  return <ClientContentDetailPage taskId={taskId} />;
}
