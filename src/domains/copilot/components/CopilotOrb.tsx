import type { CopilotOrbState } from "../types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const STATE_LABELS: Record<CopilotOrbState, string> = {
  listening: "Listening…",
  understanding: "Understanding context…",
  insight: "Insight detected",
  suggestion: "Explore this",
  capture: "Captured",
  warning: "Attention",
  idle: "Raise One Copilot",
};

export function CopilotOrb({
  state,
  className,
}: {
  state: CopilotOrbState;
  className?: string;
}) {
  const isListening = state === "listening" || state === "idle";
  const isProcessing = state === "understanding";
  const isInsight = state === "insight" || state === "capture";
  const isSuggestion = state === "suggestion";
  const isWarning = state === "warning";

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative flex h-24 w-24 items-center justify-center">
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full opacity-30 blur-xl",
            isWarning && "bg-amber-500",
            isInsight && "bg-emerald-500",
            isSuggestion && "bg-violet-500",
            isProcessing && "bg-sky-500",
            isListening && "bg-foreground/20",
          )}
          animate={
            isListening
              ? { scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }
              : isProcessing
                ? { scale: [1, 1.08, 1], opacity: [0.25, 0.45, 0.25] }
                : isInsight
                  ? { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }
                  : { scale: 1, opacity: 0.25 }
          }
          transition={{ duration: isProcessing ? 1.2 : 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={cn(
            "relative h-14 w-14 rounded-full border border-border/60 shadow-lg",
            isWarning && "border-amber-500/50 bg-amber-500/10",
            isInsight && "border-emerald-500/40 bg-emerald-500/10",
            isSuggestion && "border-violet-500/40 bg-violet-500/10",
            isProcessing && "border-sky-500/30 bg-sky-500/5",
            isListening && "border-border bg-muted/40",
          )}
          animate={
            isListening
              ? { scale: [1, 1.04, 1] }
              : isSuggestion
                ? { scale: [1, 1.06, 1] }
                : { scale: 1 }
          }
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className={cn(
              "absolute inset-[18%] rounded-full",
              isWarning && "bg-amber-400/80",
              isInsight && "bg-emerald-400/70",
              isSuggestion && "bg-violet-400/70",
              isProcessing && "bg-sky-400/60",
              isListening && "bg-foreground/70",
            )}
          />
        </motion.div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
          Raise One Copilot
        </p>
        <p className="mt-1 text-sm font-medium text-foreground/90">{STATE_LABELS[state]}</p>
      </div>
    </div>
  );
}
