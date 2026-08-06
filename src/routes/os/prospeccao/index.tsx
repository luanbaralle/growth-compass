import { createFileRoute } from "@tanstack/react-router";
import { ProspectPipelinePage } from "@/domains/prospection/components/ProspectPipelinePage";

export const Route = createFileRoute("/os/prospeccao/")({
  component: ProspectPipelinePage,
});
