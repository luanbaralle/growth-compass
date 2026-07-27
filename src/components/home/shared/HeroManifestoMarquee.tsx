import { heroManifestoItems } from "@/lib/home/content";

function MarqueeSegment({ suffix }: { suffix: string }) {
  return (
    <div className="hero-marquee__segment">
      {heroManifestoItems.map((item) => (
        <span key={`${item}-${suffix}`} className="hero-marquee__item">
          <span className="hero-marquee__label">{item}</span>
          <span className="hero-marquee__dot" aria-hidden>
            •
          </span>
        </span>
      ))}
    </div>
  );
}

export function HeroManifestoMarquee() {
  return (
    <div className="hero-marquee">
      <div aria-hidden className="hero-marquee__rule hero-marquee__rule--top" />
      <div aria-hidden className="hero-marquee__fade hero-marquee__fade--left" />
      <div aria-hidden className="hero-marquee__fade hero-marquee__fade--right" />

      <div className="hero-marquee__viewport">
        <div className="hero-marquee__track" aria-hidden>
          <MarqueeSegment suffix="a" />
          <MarqueeSegment suffix="b" />
          <MarqueeSegment suffix="c" />
          <MarqueeSegment suffix="d" />
        </div>
      </div>

      <div aria-hidden className="hero-marquee__rule hero-marquee__rule--bottom" />
    </div>
  );
}
