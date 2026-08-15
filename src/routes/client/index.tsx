import { createFileRoute } from "@tanstack/react-router";
import { ClientHomePage } from "@/client/pages/ClientHomePage";

export const Route = createFileRoute("/client/")({
  component: ClientHomePage,
});
