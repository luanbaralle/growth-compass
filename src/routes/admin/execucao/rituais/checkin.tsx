import { createFileRoute } from "@tanstack/react-router";
import { CheckinRitualPage } from "@/components/admin/execution/CheckinRitualPage";

export const Route = createFileRoute("/admin/execucao/rituais/checkin")({
  head: () => ({
    meta: [{ title: "Raise One — Check-in" }, { name: "robots", content: "noindex" }],
  }),
  component: CheckinRitualPage,
});
