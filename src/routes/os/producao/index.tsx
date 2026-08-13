import { createFileRoute } from "@tanstack/react-router";
import { ContentProductionPage } from "@/domains/content-production/components/ContentProductionPage";

export const Route = createFileRoute("/os/producao/")({
  component: ContentProductionPage,
});
