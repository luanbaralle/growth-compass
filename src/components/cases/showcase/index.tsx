import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { CaseImage } from "../CaseImage";
import { EASE_OUT, scaleIn, viewportOnce } from "../shared/motion";

interface ShowcaseFrameProps {
  src: string;
  alt: string;
  className?: string;
  glow?: boolean;
}

function ShowcaseGlow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -inset-x-[10%] -bottom-[20%] h-[60%] rounded-full bg-brand/10 blur-[80px]",
        className,
      )}
      aria-hidden
    />
  );
}

function BrowserChrome({ displayUrl }: { displayUrl?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#141414]/95 px-4 py-3 backdrop-blur-md sm:px-5">
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
      </div>
      <div className="mx-auto flex min-w-0 max-w-md flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-black/40 px-3 py-1.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" aria-hidden />
        <span className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          {displayUrl ?? "Preview"}
        </span>
      </div>
      <span className="hidden w-[52px] sm:block" aria-hidden />
    </div>
  );
}

function BrowserReflection() {
  return (
    <div
      className="pointer-events-none absolute -bottom-10 left-[8%] right-[8%] h-16 opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      aria-hidden
    >
      <div className="h-full rounded-[1.25rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-md" />
    </div>
  );
}

interface MockupDesktopProps extends ShowcaseFrameProps {
  scrollable?: boolean;
  displayUrl?: string;
  scrollHint?: string;
  animated?: boolean;
}

export function MockupDesktop({
  src,
  alt,
  className,
  glow = true,
  scrollable = false,
  displayUrl,
  scrollHint,
  animated = true,
}: MockupDesktopProps) {
  const frameInner = (
    <div className="relative pb-10">
      <div className="relative overflow-hidden rounded-[1.15rem] border border-white/[0.1] bg-[#0a0a0a]/90 shadow-[0_60px_140px_-40px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/[0.04] backdrop-blur-xl sm:rounded-[1.25rem]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden
        />
        <BrowserChrome displayUrl={displayUrl} />
        {scrollable ? (
          <div className="relative">
            <div
              className="max-h-[min(640px,78vh)] overflow-y-auto overscroll-contain scroll-smooth [scrollbar-width:thin] [scrollbar-color:oklch(0.72_0.19_48/0.4)_transparent]"
              tabIndex={0}
              role="region"
              aria-label={alt}
            >
              <img src={src} alt={alt} className="block h-auto w-full" draggable={false} />
            </div>
            {scrollHint && (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent pb-4 pt-16"
                aria-hidden
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
                  {scrollHint}
                </span>
                <ChevronDown className="mt-1 h-4 w-4 animate-bounce text-brand/60" />
              </div>
            )}
          </div>
        ) : (
          <CaseImage src={src} alt={alt} className="aspect-[16/10] w-full" />
        )}
      </div>
      <BrowserReflection />
    </div>
  );

  const wrappedFrame = glow ? (
    <>
      <ShowcaseGlow />
      {frameInner}
    </>
  ) : (
    frameInner
  );

  if (!animated) {
    return <div className={cn("relative", className)}>{wrappedFrame}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className={cn("relative", className)}
    >
      {wrappedFrame}
    </motion.div>
  );
}

interface MockupResponsiveShowcaseProps {
  desktopSrc: string;
  desktopAlt: string;
  mobileSrc: string;
  mobileAlt: string;
  scrollable?: boolean;
  displayUrl?: string;
  scrollHint?: string;
  className?: string;
}

export function MockupResponsiveShowcase({
  desktopSrc,
  desktopAlt,
  mobileSrc,
  mobileAlt,
  scrollable = false,
  displayUrl,
  scrollHint,
  className,
}: MockupResponsiveShowcaseProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className={cn("relative mx-auto w-full max-w-5xl px-1 sm:max-w-6xl sm:px-0", className)}
    >
      <ShowcaseGlow className="-inset-x-[5%]" />

      <div className="relative">
        {/* Desktop encolhido à esquerda — reserva faixa à direita pro mobile */}
        <div className="sm:pr-[min(36%,13.5rem)] md:pr-[min(34%,14.5rem)] lg:pr-60">
          <MockupDesktop
            src={desktopSrc}
            alt={desktopAlt}
            scrollable={scrollable}
            displayUrl={displayUrl}
            scrollHint={scrollHint}
            glow={false}
            animated={false}
            className="w-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, x: 12 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.2, duration: 0.85, ease: EASE_OUT }}
          className="relative z-10 mx-auto mt-8 flex w-[58%] max-w-[240px] justify-center sm:absolute sm:bottom-[10%] sm:right-0 sm:mt-0 sm:w-[min(34%,14rem)] sm:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px]"
        >
          <div
            className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-brand/15 blur-2xl sm:-inset-4"
            aria-hidden
          />
          <img
            src={mobileSrc}
            alt={mobileAlt}
            className="relative w-full drop-shadow-[0_28px_70px_rgba(0,0,0,0.85)]"
            draggable={false}
            loading="lazy"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function MockupLaptop({ src, alt, className, glow = true }: ShowcaseFrameProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className={cn("relative mx-auto max-w-4xl", className)}
    >
      {glow && <ShowcaseGlow className="scale-90" />}
      <div className="relative">
        <div className="overflow-hidden rounded-t-xl border border-b-0 border-white/[0.08] bg-surface-elevated/70 p-3 pb-0 shadow-2xl">
          <div className="overflow-hidden rounded-t-lg border border-white/[0.06]">
            <CaseImage src={src} alt={alt} className="aspect-[16/10] w-full" />
          </div>
        </div>
        <div
          className="relative mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-xl border border-t-0 border-white/[0.06] bg-gradient-to-b from-surface-elevated to-surface"
          aria-hidden
        />
        <div
          className="mx-auto h-1 w-[18%] rounded-full bg-white/[0.08]"
          aria-hidden
        />
      </div>
    </motion.div>
  );
}

export function MockupMobile({ src, alt, className, glow = true }: ShowcaseFrameProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className={cn("relative mx-auto w-[220px] sm:w-[260px]", className)}
    >
      {glow && <ShowcaseGlow className="scale-75" />}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.1] bg-surface-elevated/80 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
        <div className="absolute left-1/2 top-3 z-10 h-1 w-16 -translate-x-1/2 rounded-full bg-black/40" />
        <CaseImage src={src} alt={alt} className="aspect-[9/19] w-full rounded-[1.5rem]" />
      </div>
    </motion.div>
  );
}

export function ShowcaseFullscreen({ src, alt, className }: ShowcaseFrameProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className={cn("relative -mx-5 sm:-mx-8 lg:-mx-[calc((100vw-80rem)/2+2rem)]", className)}
    >
      <div className="relative overflow-hidden">
        <CaseImage src={src} alt={alt} className="aspect-[21/9] w-full min-h-[280px] sm:min-h-[420px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
      </div>
    </motion.div>
  );
}

interface ShowcaseGridProps {
  items: { src: string; alt: string }[];
  className?: string;
}

export function ShowcaseGrid({ items, className }: ShowcaseGridProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className={cn("grid gap-4 sm:grid-cols-2", className)}
    >
      {items.map((item) => (
        <div
          key={item.src}
          className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/30 transition-colors hover:border-white/[0.12]"
        >
          <CaseImage
            src={item.src}
            alt={item.alt}
            className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      ))}
    </motion.div>
  );
}

interface ShowcaseDetailProps {
  src: string;
  alt: string;
  label?: string;
  className?: string;
}

export function ShowcaseDetail({ src, alt, label, className }: ShowcaseDetailProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className={cn("relative", className)}
    >
      {label && (
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {label}
        </p>
      )}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
        <CaseImage src={src} alt={alt} className="aspect-[3/2] w-full" />
      </div>
    </motion.div>
  );
}
