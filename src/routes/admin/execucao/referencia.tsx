import { createFileRoute } from "@tanstack/react-router";
import { ReferenciaPage } from "@/components/admin/execution/ReferenciaPage";

export const Route = createFileRoute("/admin/execucao/referencia")({
  head: () => ({
    meta: [{ title: "Raise One — Referência" }, { name: "robots", content: "noindex" }],
  }),
  component: ReferenciaPage,
});
