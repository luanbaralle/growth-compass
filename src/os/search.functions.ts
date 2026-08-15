import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().max(200),
});

export const searchOSGlobal = createServerFn({ method: "GET" })
  .validator(searchSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/os/global-search.service.server");
      return service.searchOSGlobal(data.query);
    });
  });
