import { useSyncExternalStore } from "react";

/** Touch devices use the motion.useTransform path (validated on mobile) */
function subscribe(onStoreChange: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function getServerSnapshot() {
  return false;
}

export function usePreferMotionScroll() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
