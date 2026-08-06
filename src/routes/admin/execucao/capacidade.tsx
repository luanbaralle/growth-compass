import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/execucao/capacidade")({
  beforeLoad: () => {
    throw redirect({ to: "/os" });
  },
});
