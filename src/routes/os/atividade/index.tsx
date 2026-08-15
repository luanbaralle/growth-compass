import { createFileRoute } from "@tanstack/react-router";
import { ActivityFeedPage } from "@/os/pages/ActivityFeedPage";

export const Route = createFileRoute("/os/atividade/")({
  component: ActivityFeedPage,
});
