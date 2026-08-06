import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/domains/settings/components/SettingsPage";

export const Route = createFileRoute("/os/configuracoes/")({
  component: SettingsPage,
});
