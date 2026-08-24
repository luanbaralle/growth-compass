import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ReportSection({
  id,
  eyebrow,
  title,
  intro,
  children,
  elevated,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  elevated?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 py-16 md:py-24",
        elevated && "border-y border-white/[0.06] bg-white/[0.015]",
      )}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-brand/50" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              {eyebrow}
            </span>
          </div>
          <h2 className="font-display text-3xl leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h2>
          {intro ? (
            <p className="mt-6 text-base leading-relaxed text-white/55 md:text-lg">{intro}</p>
          ) : null}
        </div>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
