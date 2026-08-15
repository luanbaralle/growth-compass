export function formatDelta(value: number | null | undefined): string {
  if (value == null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

export function deltaTone(
  value: number | null | undefined,
  invert?: boolean,
): "positive" | "negative" | "neutral" | undefined {
  if (value == null) return undefined;
  const positive = invert ? value < 0 : value > 0;
  const negative = invert ? value > 0 : value < 0;
  if (positive) return "positive";
  if (negative) return "negative";
  return "neutral";
}

export function greetingPrefix(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
