import { createFileRoute } from "@tanstack/react-router";
import { ProducaoPage } from "@/components/admin/execution/ProducaoPage";

export const Route = createFileRoute("/admin/execucao/producao")({
  head: () => ({
    meta: [{ title: "Raise One — Produção" }, { name: "robots", content: "noindex" }],
  }),
  component: ProducaoPage,
});
