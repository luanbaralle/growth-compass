import { createFileRoute } from "@tanstack/react-router";
import { RituaisHubPage } from "@/components/admin/execution/RituaisHubPage";

export const Route = createFileRoute("/admin/execucao/rituais/")({
  head: () => ({
    meta: [{ title: "Raise One — Rituais" }, { name: "robots", content: "noindex" }],
  }),
  component: RituaisHubPage,
});
