import { createFileRoute } from "@tanstack/react-router";
import { publishDueScheduledContentTasks } from "@/domains/content-production/publish-scheduled.server";

function isAuthorizedCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${secret}`;
}

export const Route = createFileRoute("/api/cron/publish-scheduled-content")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isAuthorizedCronRequest(request)) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const result = await publishDueScheduledContentTasks();
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
