export function pctChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function formatPct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1).replace(".", ",")}%`;
}

export function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatInt(n: number) {
  return n.toLocaleString("pt-BR");
}
