import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname.startsWith("/admin/login")) {
      throw redirect({ to: "/os/login" });
    }
    if (location.pathname.startsWith("/admin/leads")) {
      throw redirect({ to: "/os/empresas" });
    }
    throw redirect({ to: "/os" });
  },
});
