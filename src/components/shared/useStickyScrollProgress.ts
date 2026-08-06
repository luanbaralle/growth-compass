import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Progress 0→1 while a tall container scrolls through the viewport.
 * Uses CSS sticky layout — no Framer Motion, no fixed overlays.
 */
export function useStickyScrollProgress(containerRef: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const scrollable = element.offsetHeight - window.innerHeight;

      if (scrollable <= 1) {
        if (progressRef.current !== 0) {
          progressRef.current = 0;
          setProgress(0);
        }
        return;
      }

      const next = Math.min(1, Math.max(0, -rect.top / scrollable));

      if (Math.abs(progressRef.current - next) > 0.0001) {
        progressRef.current = next;
        setProgress(next);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const observer = new ResizeObserver(schedule);
    observer.observe(element);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [containerRef]);

  return progress;
}
