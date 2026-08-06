import { interpolate } from "framer-motion";
import type { CSSProperties } from "react";

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

export interface ScrollWordStyle {
  opacity: number;
  y: number;
  blur: number;
  scale: number;
  zIndex: number;
}

function mapRange(progress: number, input: number[], output: number[]) {
  return interpolate(input, output)(progress);
}

export function computeScrollWordStyle(
  progress: number,
  index: number,
  total: number,
  reduceEffects = false,
): ScrollWordStyle {
  const { start, end, peak, fade } = getItemScrollRange(index, total);

  const opacity = mapRange(
    progress,
    [start, peak - fade, peak, peak + fade, end],
    reduceEffects ? [0.15, 0.3, 1, 0.3, 0.15] : [0.06, 0.22, 1, 0.22, 0.06],
  );

  const scale = reduceEffects
    ? 1
    : mapRange(progress, [start, peak, end], [0.88, 1.06, 0.88]);

  const y = reduceEffects ? 0 : mapRange(progress, [start, peak, end], [48, 0, -48]);

  const blur = reduceEffects ? 0 : mapRange(progress, [start, peak, end], [6, 0, 6]);

  const half = (end - start) / 2;
  const distance = Math.abs(progress - peak);
  const zIndex = distance >= half ? 1 : Math.round((1 - distance / half) * 10) + 2;

  return { opacity, y, blur, scale, zIndex };
}

export function applyScrollWordStyleNested(
  outer: HTMLElement,
  inner: HTMLElement,
  style: ScrollWordStyle,
) {
  outer.style.opacity = String(style.opacity);
  outer.style.zIndex = String(style.zIndex);
  outer.style.visibility = style.opacity < 0.04 ? "hidden" : "visible";
  outer.style.transform = `translate3d(0, ${style.y}px, 0) scale(${style.scale})`;
  inner.style.filter = style.blur > 0.01 ? `blur(${style.blur}px)` : "";
}

export function scrollWordStyleToCss(style: ScrollWordStyle): CSSProperties {
  return {
    opacity: style.opacity,
    zIndex: style.zIndex,
    transform: `translate3d(0, ${style.y}px, 0) scale(${style.scale})`,
    filter: style.blur > 0.01 ? `blur(${style.blur}px)` : undefined,
  };
}

export function mapScrollRange(progress: number, input: number[], output: number[]) {
  return mapRange(progress, input, output);
}
