import { heroManifestoItems } from "@/lib/home/content";

function MarqueeTrack() {
  return (
    <div
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14 lg:gap-16 lg:pr-16"
      aria-hidden
    >
      {heroManifestoItems.map((item) => (
        <span key={item} className="inline-flex shrink-0 items-center gap-10 sm:gap-14 lg:gap-16">
          <span className="text-sm font-semibold uppercase tracking-[0.32em] text-foreground sm:text-base lg:text-lg">
            {item}
          </span>
          <span className="text-brand/55">•</span>
        </span>
      ))}
    </div>
  );
}

export function HeroManifestoMarquee() {
  return (
    <div className="relative border-t border-border/60 bg-background/90 backdrop-blur-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
      />

      <div className="hero-marquee overflow-hidden py-5 sm:py-6">
        <div className="hero-marquee__track animate-marquee flex w-max">
          <MarqueeTrack />
          <MarqueeTrack />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
      />
    </div>
  );
}
