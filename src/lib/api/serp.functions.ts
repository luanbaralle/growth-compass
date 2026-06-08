import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fetchSerpResults } from "@/lib/serp/fetch-serp.server";

const serpItemSchema = z.object({
  name: z.string(),
  isAd: z.boolean().optional(),
  screenshotUrl: z.string().optional(),
  url: z.string().optional(),
  snippet: z.string().optional(),
});

export const getSerpResults = createServerFn({ method: "GET" })
  .validator(
    z.object({
      query: z.string().min(1).max(120),
      mockFallback: z.array(serpItemSchema).min(1).max(10),
    }),
  )
  .handler(async ({ data }) => {
    return fetchSerpResults(data.query, data.mockFallback);
  });
