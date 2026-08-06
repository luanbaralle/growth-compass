import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/execucao/rituais/review")({
  beforeLoad: () => {
    throw redirect({ to: "/os" });
  },
});
