import { createFileRoute } from "@tanstack/react-router";
import { WorkflowTemplateEditorPage } from "@/domains/projects/components/WorkflowTemplateEditorPage";

export const Route = createFileRoute("/os/projetos/templates/$id")({
  component: TemplateEditorRoute,
});

function TemplateEditorRoute() {
  const { id } = Route.useParams();
  return <WorkflowTemplateEditorPage templateId={id} />;
}
