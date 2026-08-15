import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { verifyClientMagicLink } from "@/client/auth.functions";

export const Route = createFileRoute("/client/auth/verify")({
  validateSearch: z.object({
    token: z.string().min(16),
  }),
  beforeLoad: async ({ search }) => {
    try {
      await verifyClientMagicLink({ data: { token: search.token } });
      throw redirect({ to: "/client" });
    } catch (err) {
      if (err && typeof err === "object" && "to" in err) {
        throw err;
      }
      throw redirect({
        to: "/client/login",
        search: {
          error: err instanceof Error ? err.message : "Link inválido.",
        },
      });
    }
  },
  component: () => null,
});
