import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

const MIN_COLUMN_WIDTH = 72;

export function useResizableTableColumns<K extends string>(
  columnKeys: readonly K[],
  defaultWidths: Record<K, number>,
  storageKey?: string,
) {
  const [widths, setWidths] = useState<Record<K, number>>(() => {
    if (!storageKey || typeof window === "undefined") return defaultWidths;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return defaultWidths;
      const parsed = JSON.parse(raw) as Partial<Record<K, number>>;
      return columnKeys.reduce(
        (acc, key) => {
          const value = parsed[key];
          acc[key] =
            typeof value === "number" && value >= MIN_COLUMN_WIDTH
              ? value
              : defaultWidths[key];
          return acc;
        },
        {} as Record<K, number>,
      );
    } catch {
      return defaultWidths;
    }
  });

  const dragRef = useRef<{
    key: K;
    startX: number;
    startWidth: number;
  } | null>(null);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(widths));
  }, [widths, storageKey]);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const nextWidth = Math.max(
        MIN_COLUMN_WIDTH,
        drag.startWidth + (event.clientX - drag.startX),
      );
      setWidths((prev) =>
        prev[drag.key] === nextWidth ? prev : { ...prev, [drag.key]: nextWidth },
      );
    };

    const onMouseUp = () => {
      dragRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      onMouseUp();
    };
  }, []);

  const startResize = useCallback((key: K, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = {
      key,
      startX: event.clientX,
      startWidth: widths[key],
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [widths]);

  const tableMinWidth = columnKeys.reduce((sum, key) => sum + widths[key], 0);

  return { widths, startResize, tableMinWidth, minColumnWidth: MIN_COLUMN_WIDTH };
}
