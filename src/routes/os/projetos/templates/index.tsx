import { createFileRoute } from "@tanstack/react-router";
import { WorkflowTemplateListPage } from "@/domains/projects/components/WorkflowTemplateListPage";

export const Route = createFileRoute("/os/projetos/templates/")({
  component: WorkflowTemplateListPage,
});
