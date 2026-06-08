/** Lê secrets em runtime (nunca no module scope) — necessário em serverless. */
export function getSerperApiKey(): string | undefined {
  const key = process.env.SERPER_API_KEY?.trim();
  return key || undefined;
}

export function getGoogleCseConfig(): { apiKey?: string; cx?: string } {
  const apiKey = process.env.GOOGLE_CSE_API_KEY?.trim();
  const cx = process.env.GOOGLE_CSE_CX?.trim();
  return {
    apiKey: apiKey || undefined,
    cx: cx || undefined,
  };
}

export function isSerpConfigured(): boolean {
  const { apiKey, cx } = getGoogleCseConfig();
  return !!getSerperApiKey() || !!(apiKey && cx);
}
