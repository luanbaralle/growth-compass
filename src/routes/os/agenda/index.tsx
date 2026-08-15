import { createFileRoute } from "@tanstack/react-router";
import { AgendaPage } from "@/os/pages/AgendaPage";

export const Route = createFileRoute("/os/agenda/")({
  component: AgendaPage,
});
