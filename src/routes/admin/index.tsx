import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { checkAdminAuth } from "@/lib/api/leads.functions";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    if (!authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  head: () => ({
    meta: [{ title: "Raise One — Admin Leads" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPanel,
});
