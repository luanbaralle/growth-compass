import { createFileRoute } from "@tanstack/react-router";
import { PlanejamentoPage } from "@/components/admin/execution/PlanejamentoPage";

export const Route = createFileRoute("/admin/execucao/planejamento")({
  head: () => ({
    meta: [{ title: "Raise One — Planejamento" }, { name: "robots", content: "noindex" }],
  }),
  component: PlanejamentoPage,
});
