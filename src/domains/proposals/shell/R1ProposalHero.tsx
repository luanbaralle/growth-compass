import type { ProposalMetric } from "../types";
import { r1ScrollAnchor, r1ShellWide } from "./r1-tokens";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

export function R1ProposalHero({
  companyName,
  clientName,
  title,
  subtitle,
  templateLabel,
  tagline,
  metrics,
}: {
  companyName: string;
  clientName?: string | null;
  title: string;
  subtitle: string;
  templateLabel: string;
  tagline?: string;
  metrics?: ProposalMetric[];
}) {
  return (
    <header
      id="top"
      className={cn(
        r1ScrollAnchor,
        "relative flex min-h-[85vh] items-center overflow-hidden border-b border-white/[0.06]",
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-0 h-[480px] w-[480px] rounded-full bg-emerald-500/[0.07] blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-[380px] w-[380px] rounded-full bg-sky-500/[0.08] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500/60" />
      </div>

      <div className={cn(r1ShellWide, "relative z-10 py-16 sm:py-20 md:py-24")}>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_280px] lg:gap-16">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-start lg:gap-4">
              <div className="flex flex-col gap-1 text-[11px] text-white/35 sm:flex-row sm:items-center sm:gap-4">
                <span>{companyName}</span>
                {clientName && clientName !== companyName && <span>{clientName}</span>}
              </div>
              <span className="inline-flex w-fit items-center rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/50">
                {templateLabel}
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-balance text-[1.85rem] font-bold leading-[1.08] tracking-tight text-white sm:mt-8 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:mt-6 sm:text-lg">
              {subtitle}
            </p>

            {tagline && (
              <p className="mt-8 max-w-lg border-l-2 border-emerald-500/60 pl-4 text-sm font-medium leading-relaxed text-white/70 sm:mt-10 sm:pl-5 sm:text-base">
                {tagline}
              </p>
            )}

            {metrics && metrics.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:hidden">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-center backdrop-blur-sm sm:rounded-2xl sm:p-4"
                  >
                    <p className="text-lg font-bold tracking-tight text-emerald-400/90 sm:text-2xl">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-[10px] leading-snug text-white/55 sm:text-xs">{metric.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {metrics && metrics.length > 0 && (
            <div className="hidden flex-col gap-4 lg:flex">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm"
                >
                  <p className="text-3xl font-bold tracking-tight text-emerald-400/90">{metric.value}</p>
                  <p className="mt-1.5 text-sm text-white/55">{metric.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/35">
        <ArrowDown className="h-4 w-4 animate-bounce text-emerald-400/70" />
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
      </div>
    </header>
  );
}
