import { Logo } from "@/components/landing/shared/Logo";
import { ArrowRight } from "lucide-react";

export function R1ProposalNav({
  ctaHref,
  ctaLabel,
}: {
  ctaHref: string | null;
  ctaLabel: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#090909]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <a href="#top" className="flex shrink-0 items-center">
          <Logo size="nav" />
        </a>
        {ctaHref ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:border-white/25 hover:bg-white/[0.08] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
          >
            <span className="max-w-[9rem] truncate sm:max-w-none">{ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        ) : (
          <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/40">
            {ctaLabel}
          </span>
        )}
      </div>
    </header>
  );
}
