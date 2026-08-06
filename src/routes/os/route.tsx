import { createFileRoute, redirect } from "@tanstack/react-router";
import { OSShell } from "@/os/shell/OSShell";
import { checkOSAuth } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/os")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/os/login") return;
    const { authenticated } = await checkOSAuth();
    if (!authenticated) {
      throw redirect({ to: "/os/login" });
    }
  },
  component: OSShell,
});
