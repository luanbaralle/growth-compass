import { createFileRoute } from "@tanstack/react-router";
import { PlanningRitualPage } from "@/components/admin/execution/PlanningRitualPage";

export const Route = createFileRoute("/admin/execucao/rituais/planning")({
  head: () => ({
    meta: [{ title: "Raise One — Planning" }, { name: "robots", content: "noindex" }],
  }),
  component: PlanningRitualPage,
});
