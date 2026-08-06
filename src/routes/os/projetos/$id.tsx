import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/domains/projects/components/ProjectDetailPage";

export const Route = createFileRoute("/os/projetos/$id")({
  component: ProjectDetailRoute,
});

function ProjectDetailRoute() {
  const { id } = Route.useParams();
  return <ProjectDetailPage projectId={id} />;
}
