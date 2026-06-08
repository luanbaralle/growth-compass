import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

interface NavProps {
  ctaHref?: string;
  ctaLabel?: string;
  homeHref?: string;
}

export function Nav({
  ctaHref = "#diagnostico",
  ctaLabel = "Diagnóstico gratuito",
  homeHref,
}: NavProps) {
  const brandLink = homeHref ? (
    <Link to={homeHref} className="flex items-center gap-2.5">
      <Logo />
      <span className="text-[15px] font-semibold tracking-tight">Raise One</span>
    </Link>
  ) : (
    <a href="#top" className="flex items-center gap-2.5">
      <Logo />
      <span className="text-[15px] font-semibold tracking-tight">Raise One</span>
    </a>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {brandLink}
        <a
          href={ctaHref}
          className="group hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand sm:inline-flex"
        >
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}
