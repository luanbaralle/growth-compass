import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/execucao/producao")({
  beforeLoad: () => {
    throw redirect({ to: "/os" });
  },
});
