import { useEffect, useRef } from "react";

/** Rola apenas o container interno — nunca a página — e ignora o mount inicial. */
export function usePanelScrollToEnd(messageCount: number, tailActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messageCount, tailActive]);

  return { containerRef, endRef };
}
