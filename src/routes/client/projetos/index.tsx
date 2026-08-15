import { createFileRoute } from "@tanstack/react-router";
import { ClientProjetosPage } from "@/client/pages/ClientProjectsPage";

export const Route = createFileRoute("/client/projetos/")({
  component: ClientProjetosPage,
});
