import { createFileRoute, redirect, Outlet, useLocation } from "@tanstack/react-router";
import { ClientShell } from "@/client/shell/ClientShell";
import { ClientProvider, loadClientAuth } from "@/client/shell/use-client-context";

function isPublicClientPath(pathname: string): boolean {
  return pathname === "/client/login" || pathname.startsWith("/client/auth/");
}

export const Route = createFileRoute("/client")({
  beforeLoad: async ({ location }) => {
    if (isPublicClientPath(location.pathname)) {
      return;
    }
    const { authenticated, user } = await loadClientAuth();
    if (!authenticated || !user) {
      throw redirect({ to: "/client/login" });
    }
    return { clientUser: user };
  },
  component: ClientRouteLayout,
});

function ClientRouteLayout() {
  const location = useLocation();
  const { clientUser } = Route.useRouteContext();

  if (isPublicClientPath(location.pathname)) {
    return <Outlet />;
  }

  if (!clientUser) {
    return null;
  }

  return (
    <ClientProvider user={clientUser}>
      <ClientShell />
    </ClientProvider>
  );
}
