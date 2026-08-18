/**
 * Speech-to-Text via OpenRouter — /api/v1/audio/transcriptions
 */

export function getSttModel(): string {
  return process.env.OPENROUTER_STT_MODEL?.trim() || "openai/whisper-large-v3";
}

export function isSttConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export async function transcribeAudioBase64(
  audioBase64: string,
  format: string,
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey || !audioBase64) return null;

  const res = await fetch("https://openrouter.ai/api/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(process.env.OPENROUTER_SITE_URL
        ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL }
        : {}),
      ...(process.env.OPENROUTER_APP_NAME
        ? { "X-Title": process.env.OPENROUTER_APP_NAME }
        : { "X-Title": "Raise One OS" }),
    },
    body: JSON.stringify({
      model: getSttModel(),
      language: "pt",
      input_audio: {
        data: audioBase64,
        format: format.replace("audio/", "").replace(";codecs=opus", ""),
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error(
      "[openrouter-stt] failed:",
      res.status,
      `model=${getSttModel()} format=${format}`,
      errText.slice(0, 500),
    );
    return null;
  }

  const data = (await res.json()) as { text?: string };
  const text = data.text?.trim();
  if (!text || text.length < 2) return null;
  return text;
}
