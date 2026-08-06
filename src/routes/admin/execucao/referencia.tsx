import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/execucao/referencia")({
  beforeLoad: () => {
    throw redirect({ to: "/os" });
  },
});
