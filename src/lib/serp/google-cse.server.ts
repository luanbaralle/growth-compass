import type { GoogleCseResponse } from "./types";

const CSE_ENDPOINT = "https://www.googleapis.com/customsearch/v1";

export async function fetchGoogleCse(
  query: string,
  apiKey: string,
  cx: string,
  num = 5,
): Promise<GoogleCseResponse> {
  const url = new URL(CSE_ENDPOINT);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("cx", cx);
  url.searchParams.set("q", query);
  url.searchParams.set("num", String(Math.min(num, 10)));
  url.searchParams.set("lr", "lang_pt");
  url.searchParams.set("gl", "br");
  url.searchParams.set("hl", "pt-BR");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    const data = (await res.json()) as GoogleCseResponse;

    if (!res.ok) {
      const reason = data.error?.errors?.[0]?.reason;
      const err = new Error(data.error?.message ?? `Google CSE HTTP ${res.status}`);
      (err as Error & { status?: number; reason?: string }).status = res.status;
      (err as Error & { reason?: string }).reason = reason;
      throw err;
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}
