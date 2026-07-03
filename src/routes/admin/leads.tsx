import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [{ title: "Raise One — Leads" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPanel,
});
