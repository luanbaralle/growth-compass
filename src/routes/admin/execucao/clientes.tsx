import { createFileRoute } from "@tanstack/react-router";
import { ClientesPage } from "@/components/admin/execution/ClientesPage";

export const Route = createFileRoute("/admin/execucao/clientes")({
  head: () => ({
    meta: [{ title: "Raise One — Clientes" }, { name: "robots", content: "noindex" }],
  }),
  component: ClientesPage,
});
