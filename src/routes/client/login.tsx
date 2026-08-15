import { createFileRoute, redirect } from "@tanstack/react-router";
import { ClientLoginPage } from "@/client/pages/ClientLoginPage";
import { loadClientAuth } from "@/client/shell/use-client-context";

export const Route = createFileRoute("/client/login")({
  beforeLoad: async () => {
    const { authenticated } = await loadClientAuth();
    if (authenticated) {
      throw redirect({ to: "/client" });
    }
  },
  head: () => ({
    meta: [{ title: "Raise One Client — Acesso" }, { name: "robots", content: "noindex" }],
  }),
  component: ClientLoginPage,
});
