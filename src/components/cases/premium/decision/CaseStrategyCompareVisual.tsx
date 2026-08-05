import { cn } from "@/lib/utils";

export interface CaseStrategyCompareVisualProps {
  blockCount: number;
  /** Fragmented layout for rejected side */
  fragmented?: boolean;
  className?: string;
}

/**
 * Abstract block grid for {@link CaseStrategyCompare}.
 * Fragmented mode scatters blocks; consolidated mode aligns them evenly.
 */
export function CaseStrategyCompareVisual({
  blockCount,
  fragmented = false,
  className,
}: CaseStrategyCompareVisualProps) {
  const blocks = Array.from({ length: blockCount }, (_, index) => index);

  return (
    <div
      className={cn(
        "flex aspect-[4/3] items-center justify-center rounded-xl border border-white/[0.06] bg-surface/30 p-4",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          "grid w-full gap-2",
          fragmented ? "grid-cols-3" : "grid-cols-3 items-center",
        )}
      >
        {blocks.map((block) => (
          <span
            key={block}
            className={cn(
              "rounded-md bg-white/10",
              fragmented
                ? cn(
                    "h-6",
                    block % 3 === 0 && "col-span-2 h-4 opacity-50",
                    block % 2 === 0 && "translate-x-1",
                  )
                : "h-10",
            )}
          />
        ))}
      </div>
    </div>
  );
}
