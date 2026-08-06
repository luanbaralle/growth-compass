import { createFileRoute } from "@tanstack/react-router";
import { ProspectDetailPage } from "@/domains/prospection/components/ProspectDetailPage";

export const Route = createFileRoute("/os/prospeccao/$id")({
  component: ProspectDetailPage,
});
