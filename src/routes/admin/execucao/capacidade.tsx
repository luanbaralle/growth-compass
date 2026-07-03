import { createFileRoute } from "@tanstack/react-router";
import { CapacidadePage } from "@/components/admin/execution/CapacidadePage";

export const Route = createFileRoute("/admin/execucao/capacidade")({
  head: () => ({
    meta: [{ title: "Raise One — Capacidade" }, { name: "robots", content: "noindex" }],
  }),
  component: CapacidadePage,
});
