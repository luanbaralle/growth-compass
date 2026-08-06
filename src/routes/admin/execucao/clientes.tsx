import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/execucao/clientes")({
  beforeLoad: () => {
    throw redirect({ to: "/os/empresas" });
  },
});
