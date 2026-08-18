import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/os/propostas/$id")({
  component: () => <Outlet />,
});
