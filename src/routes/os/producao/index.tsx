import { createFileRoute } from "@tanstack/react-router";
import { ContentProductionPage } from "@/domains/content-production/components/ContentProductionPage";

type ProducaoSearch = {
  task?: string;
};

export const Route = createFileRoute("/os/producao/")({
  validateSearch: (search: Record<string, unknown>): ProducaoSearch => ({
    task: typeof search.task === "string" && search.task.length > 0 ? search.task : undefined,
  }),
  component: ProducaoRoute,
});

function ProducaoRoute() {
  const { task } = Route.useSearch();
  return <ContentProductionPage initialTaskId={task} />;
}
