import type { CaseSystemFlowStep } from "@/types/case";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "./motion";

const KIND_STYLES: Record<NonNullable<CaseSystemFlowStep["kind"]>, string> = {
  demand: "border-white/[0.08] bg-surface/20 text-foreground/85",
  system: "border-brand/25 bg-brand/10 text-foreground",
  conversion: "border-white/[0.12] bg-surface/35 text-foreground",
};

function FlowStepPill({
  step,
  index,
  className,
}: {
  step: CaseSystemFlowStep;
  index: number;
  className?: string;
}) {
  const kind = step.kind ?? "system";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-lg border px-3 py-2.5 text-center sm:px-4 sm:py-3",
        KIND_STYLES[kind],
        className,
      )}
    >
      <span className="text-[10px] font-bold tabular-nums tracking-[0.2em] text-brand/75">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="mt-1 font-display text-sm font-semibold leading-tight tracking-tight sm:text-[0.9375rem]">
        {step.label}
      </span>
      {step.hint && (
        <span className="mt-1 text-[11px] leading-snug text-muted-foreground/80">{step.hint}</span>
      )}
    </div>
  );
}

function FlowConnector({ direction }: { direction: "vertical" | "horizontal" }) {
  if (direction === "vertical") {
    return (
      <span className="flex justify-center py-0.5 text-brand/35" aria-hidden>
        ↓
      </span>
    );
  }

  return (
    <ArrowRight
      className="mx-0.5 hidden h-3.5 w-3.5 shrink-0 text-brand/30 lg:block xl:h-4 xl:w-4"
      aria-hidden
    />
  );
}

interface SystemFlowProps {
  steps: CaseSystemFlowStep[];
}

export function SystemFlow({ steps }: SystemFlowProps) {
  return (
    <>
      {/* Mobile + tablet: vertical compacto */}
      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mx-auto mt-8 flex max-w-xs flex-col lg:hidden"
        aria-label="Fluxo do sistema"
      >
        {steps.map((step, index) => (
          <motion.li key={step.label} variants={fadeUp} className="flex flex-col">
            <FlowStepPill step={step} index={index} />
            {index < steps.length - 1 && <FlowConnector direction="vertical" />}
          </motion.li>
        ))}
      </motion.ol>

      {/* Desktop: horizontal */}
      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mx-auto mt-8 hidden max-w-6xl items-center justify-center lg:flex"
        aria-label="Fluxo do sistema"
      >
        {steps.map((step, index) => (
          <motion.li key={step.label} variants={fadeUp} className="flex min-w-0 flex-1 items-center">
            <FlowStepPill step={step} index={index} className="w-full" />
            {index < steps.length - 1 && <FlowConnector direction="horizontal" />}
          </motion.li>
        ))}
      </motion.ol>
    </>
  );
}
