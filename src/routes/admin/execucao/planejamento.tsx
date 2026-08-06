import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/execucao/planejamento")({
  beforeLoad: () => {
    throw redirect({ to: "/os" });
  },
});
