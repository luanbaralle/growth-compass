import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/os/copilot/$sessionId")({
  component: () => <Outlet />,
});
