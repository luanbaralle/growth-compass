/**
 * Cliente OpenRouter — camada LLM compartilhada do Raise One OS.
 * @see https://openrouter.ai/docs
 */

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  json?: boolean;
  maxTokens?: number;
}

export function isLlmConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export function getLlmModel(): string {
  return process.env.OPENROUTER_MODEL?.trim() || "google/gemini-2.5-flash";
}

export async function chatCompletion(options: ChatCompletionOptions): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return null;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
      model: options.model ?? getLlmModel(),
      messages: options.messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 1024,
      ...(options.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    console.error("[openrouter] request failed:", res.status, errText.slice(0, 300));
    return null;
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

export async function chatCompletionJson<T>(options: ChatCompletionOptions): Promise<T | null> {
  const content = await chatCompletion({ ...options, json: true });
  if (!content) return null;
  try {
    return JSON.parse(content) as T;
  } catch {
    console.error("[openrouter] invalid JSON response");
    return null;
  }
}
