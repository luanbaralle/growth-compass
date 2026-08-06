import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/os/pages/DashboardPage";

export const Route = createFileRoute("/os/")({
  component: DashboardPage,
});
