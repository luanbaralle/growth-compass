import { useMotionValue, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";

export interface PinnedScrollProgress {
  /** For useTransform / ScrollProgressBar (FM13) */
  motion: MotionValue<number>;
  /** React state synced in the same RAF tick — reliable for word animations on desktop */
  value: number;
}

/**
 * Reliable scroll progress for pinned sections — avoids Framer Motion 13
 * View Timeline acceleration which can fail silently in some browsers.
 */
export function usePinnedScrollProgress(
  containerRef: RefObject<HTMLElement | null>,
): PinnedScrollProgress {
  const motion = useMotionValue(0);
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const element = containerRef.current;
    if (!element) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const scrollableDistance = element.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 1) {
        motion.set(0);
        if (valueRef.current !== 0) {
          valueRef.current = 0;
          setValue(0);
        }
        return;
      }

      const scrolled = window.scrollY - elementTop;
      const next = Math.min(1, Math.max(0, scrolled / scrollableDistance));
      motion.set(next);

      if (Math.abs(valueRef.current - next) > 0.00005) {
        valueRef.current = next;
        setValue(next);
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
  }, [containerRef, motion, ready]);

  return { motion, value };
}
