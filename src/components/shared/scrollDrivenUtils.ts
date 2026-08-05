export function getScrollSectionHeight(itemCount: number, isWide: boolean) {
  const base = isWide ? 220 : 170;
  const perItem = isWide ? 115 : 85;
  return base + Math.max(itemCount, 1) * perItem;
}

export function getItemScrollRange(
  index: number,
  total: number,
  start = 0.16,
  span = 0.64,
) {
  const itemSpan = span / total;
  const itemStart = start + index * itemSpan;
  const itemEnd = itemStart + itemSpan;
  const peak = (itemStart + itemEnd) / 2;
  const fade = itemSpan * 0.28;

  return { start: itemStart, end: itemEnd, peak, fade };
}
