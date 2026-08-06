import { createFileRoute } from "@tanstack/react-router";
import { ProjectListPage } from "@/domains/projects/components/ProjectListPage";

export const Route = createFileRoute("/os/projetos/")({
  component: ProjectListPage,
});
