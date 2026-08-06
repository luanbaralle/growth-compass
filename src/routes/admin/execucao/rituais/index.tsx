import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/execucao/rituais/")({
  beforeLoad: () => {
    throw redirect({ to: "/os" });
  },
});
