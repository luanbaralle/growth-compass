import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { searchCitiesServer } from "@/lib/city-search.server";

export const searchCitiesFn = createServerFn({ method: "GET" })
  .validator(
    z.object({
      query: z.string().min(1).max(80),
      limit: z.number().int().min(1).max(20).optional(),
    }),
  )
  .handler(async ({ data }) => {
    return searchCitiesServer(data.query, data.limit ?? 8);
  });
