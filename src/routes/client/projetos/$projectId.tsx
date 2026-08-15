import { createFileRoute } from "@tanstack/react-router";
import { ClientProjectDetailPage } from "@/client/pages/ClientProjectsPage";

export const Route = createFileRoute("/client/projetos/$projectId")({
  component: ClientProjectDetailRoute,
});

function ClientProjectDetailRoute() {
  const { projectId } = Route.useParams();
  return <ClientProjectDetailPage projectId={projectId} />;
}
