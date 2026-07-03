import type { SegmentConfig } from "@/config/segments/types";
import { ArrowDown, Check, X } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";
import { TechBackground } from "../shared/TechBackground";

function FlowColumn({
  steps,
  outcome,
  variant,
  inView,
  delay,
}: {
  steps: string[];
  outcome: string;
  variant: "win" | "lose";
  inView: boolean;
  delay: number;
}) {
  const isWin = variant === "win";

  return (
    <div
      className={`rounded-2xl border p-6 transition-all duration-700 sm:p-8 ${
        isWin
          ? "border-brand/30 bg-brand-soft/10 shadow-[0_0_40px_-12px] shadow-brand/25"
          : "border-destructive/25 bg-destructive/5"
      } ${inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p
        className={`mb-6 text-xs font-medium uppercase tracking-wider ${
          isWin ? "text-brand" : "text-destructive/80"
        }`}
      >
        {isWin ? "Quando você aparece" : "Quando você não aparece"}
      </p>

      <div className="space-y-1">
        {steps.map((step, i) => (
          <div key={step}>
            <div
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                isWin
                  ? "border-brand/20 bg-background/60"
                  : "border-destructive/15 bg-background/40"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-[10px] font-semibold ${
                  isWin ? "bg-brand/20 text-brand" : "bg-destructive/15 text-destructive"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium text-foreground">{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown
                  className={`h-4 w-4 ${isWin ? "text-brand/50" : "text-destructive/40"}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className={`mt-6 flex items-center gap-3 rounded-xl border px-4 py-3 ${
          isWin ? "border-brand/30 bg-brand-soft/30" : "border-destructive/20 bg-destructive/10"
        }`}
      >
        {isWin ? (
          <Check className="h-5 w-5 shrink-0 text-brand" strokeWidth={2.5} />
        ) : (
          <X className="h-5 w-5 shrink-0 text-destructive" strokeWidth={2.5} />
        )}
        <span className={`text-sm font-semibold ${isWin ? "text-brand" : "text-destructive"}`}>
          {outcome}
        </span>
      </div>
    </div>
  );
}

export function AhaMomentSection({ config }: { config: SegmentConfig }) {
  const { ahaMoment } = config;
  const { ref, inView } = useInView();

  return (
    <SectionWrap className="bg-surface/30" techGlow>
      <TechBackground />
      <div ref={ref} className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{ahaMoment.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
            {ahaMoment.title}{" "}
            <span className="text-brand">{ahaMoment.titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {ahaMoment.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-8">
          <FlowColumn
            steps={ahaMoment.loseFlow}
            outcome={ahaMoment.loseOutcome}
            variant="lose"
            inView={inView}
            delay={0}
          />

          <div
            className={`hidden flex-col items-center justify-center gap-2 lg:flex ${inView ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="h-16 w-px bg-border" />
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              vs
            </span>
            <div className="h-16 w-px bg-border" />
          </div>

          <FlowColumn
            steps={ahaMoment.winFlow}
            outcome={ahaMoment.winOutcome}
            variant="win"
            inView={inView}
            delay={200}
          />
        </div>
      </div>
    </SectionWrap>
  );
}
