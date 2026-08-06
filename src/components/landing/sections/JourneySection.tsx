import type { SegmentConfig } from "@/config/segments/types";
import { useInView } from "@/hooks/use-in-view";
import { Instagram, Search } from "lucide-react";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";
import { TechBackground } from "../shared/TechBackground";

export function JourneySection({ config }: { config: SegmentConfig }) {
  const { journey } = config;
  const { ref, inView } = useInView();

  return (
    <SectionWrap techGlow background={<TechBackground />}>
      <div className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{journey.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
            {journey.title} <span className="text-brand">{journey.titleHighlight}</span>
          </h2>
        </div>

        <div ref={ref} className="relative mt-14">
          {/* Desktop: horizontal timeline */}
          <div className="hidden lg:block">
            <div className="relative mx-auto max-w-6xl">
              <div className="absolute left-8 right-8 top-[2.75rem] h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${journey.steps.length}, minmax(0, 1fr))` }}>
                {journey.steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.label}
                      className={`flex flex-col items-center text-center transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                      style={{ transitionDelay: `${i * 80}ms` }}
                    >
                      <div className="relative z-10 flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-2xl border border-brand/30 bg-surface shadow-[0_0_24px_-4px] shadow-brand/20 transition-colors hover:border-brand/60 hover:bg-surface-elevated">
                        <Icon className="h-5 w-5 text-brand" strokeWidth={2} />
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand font-mono text-[9px] font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                      </div>
                      <p className="mt-4 max-w-[9rem] text-xs font-medium leading-snug text-foreground sm:text-sm">
                        {step.label}
                      </p>
                      {i < journey.steps.length - 1 && (
                        <div className="mt-3 text-brand/40">→</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile / tablet: horizontal scroll */}
          <div className="lg:hidden">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {journey.steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className={`w-[11rem] shrink-0 snap-center transition-all duration-700 ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand-soft">
                          <Icon className="h-4 w-4 text-brand" strokeWidth={2} />
                        </div>
                        <span className="font-mono text-[10px] font-semibold text-brand">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium leading-snug text-foreground">{step.label}</p>
                      {i < journey.steps.length - 1 && (
                        <div className="mt-auto flex justify-center pt-3 text-brand/50">
                          <span className="animate-nudge-down text-lg">↓</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">Deslize para ver a jornada →</p>
          </div>
        </div>

        <div className="relative mx-auto mt-12 grid max-w-3xl gap-4 rounded-2xl border border-border bg-surface/50 p-6 backdrop-blur-sm sm:grid-cols-2 sm:p-8">
          <div className="flex items-start gap-3">
            <Instagram className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">{journey.instagramNote}</p>
          </div>
          <div className="flex items-start gap-3">
            <Search className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <p className="text-sm leading-relaxed text-foreground">{journey.googleNote}</p>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}
