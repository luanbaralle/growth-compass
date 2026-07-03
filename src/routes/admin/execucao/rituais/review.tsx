import { createFileRoute } from "@tanstack/react-router";
import { ReviewRitualPage } from "@/components/admin/execution/ReviewRitualPage";

export const Route = createFileRoute("/admin/execucao/rituais/review")({
  head: () => ({
    meta: [{ title: "Raise One — Review" }, { name: "robots", content: "noindex" }],
  }),
  component: ReviewRitualPage,
});
