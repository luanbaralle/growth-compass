import { interpolate } from "framer-motion";
import type { CSSProperties } from "react";

/** Same timing as the original ProblemScrollSection — one word dominant at a time */
export function getScrollSectionHeight(itemCount: number) {
  const base = 170;
  const perItem = 85;
  return base + Math.max(itemCount, 1) * perItem;
}

export function getItemScrollRange(
  index: number,
  total: number,
  start = 0.2,
  span = 0.52,
) {
  const itemSpan = span / total;
  const itemStart = start + index * itemSpan;
  const itemEnd = itemStart + itemSpan;
  const peak = (itemStart + itemEnd) / 2;
  const fade = (itemEnd - itemStart) * 0.28;

  return { start: itemStart, end: itemEnd, peak, fade };
}

export interface ScrollWordStyle {
  opacity: number;
  y: number;
  blur: number;
  scale: number;
  zIndex: number;
}

/** FM13: interpolate(inputRange, outputRange) returns (value) => mapped */
function mapRange(progress: number, input: number[], output: number[]) {
  return interpolate(input, output)(progress);
}

/** Imperative style — useTransform does not follow manual MotionValue.set() on desktop */
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
    reduceEffects ? [0.15, 0.3, 1, 0.3, 0.15] : [0.06, 0.2, 1, 0.2, 0.06],
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

function applyScrollWordStyle(element: HTMLElement, style: ScrollWordStyle) {
  element.style.opacity = String(style.opacity);
  element.style.zIndex = String(style.zIndex);
  element.style.transform = `translate3d(0, ${style.y}px, 0) scale(${style.scale})`;
  element.style.filter = style.blur > 0.01 ? `blur(${style.blur}px)` : "";
}

export function setScrollWordElementStyle(
  element: HTMLElement | null,
  progress: number,
  index: number,
  total: number,
  reduceEffects = false,
) {
  if (!element) return;
  applyScrollWordStyle(element, computeScrollWordStyle(progress, index, total, reduceEffects));
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
