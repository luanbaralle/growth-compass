import { createFileRoute } from "@tanstack/react-router";
import { ClientResultadosPage } from "@/client/pages/ClientResultsPage";

export const Route = createFileRoute("/client/resultados/")({
  component: ClientResultadosPage,
});
