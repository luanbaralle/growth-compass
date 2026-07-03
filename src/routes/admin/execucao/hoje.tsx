import { createFileRoute } from "@tanstack/react-router";
import { HojePage } from "@/components/admin/execution/HojePage";

export const Route = createFileRoute("/admin/execucao/hoje")({
  head: () => ({
    meta: [{ title: "Raise One — Hoje" }, { name: "robots", content: "noindex" }],
  }),
  component: HojePage,
});
