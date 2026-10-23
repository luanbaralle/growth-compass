import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { EASE_OUT, scaleIn, viewportOnce } from "../shared/motion";

interface LiveSiteShowcaseProps {
  url: string;
  displayUrl?: string;
  desktopFallback: string;
  mobileFallback: string;
  title?: string;
  className?: string;
}

function BrowserChrome({ displayUrl }: { displayUrl: string }) {
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
          {displayUrl}
        </span>
      </div>
      <span className="hidden w-[52px] sm:block" aria-hidden />
    </div>
  );
}

function LiveFrame({
  src,
  title,
  fallback,
  className,
}: {
  src: string;
  title: string;
  fallback: string;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  const onLoad = useCallback(() => setReady(true), []);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#F8F5EE]", className)}>
      <img
        src={fallback}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500",
          ready ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      />
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={cn(
          "relative h-full w-full border-0 bg-[#F8F5EE] transition-opacity duration-500",
          ready ? "opacity-100" : "opacity-0",
        )}
        onLoad={onLoad}
      />
    </div>
  );
}

function LivePhone({
  src,
  title,
  fallback,
}: {
  src: string;
  title: string;
  fallback: string;
}) {
  return (
    <div className="relative w-[248px] sm:w-[268px] lg:w-[292px]">
      <div
        className="relative rounded-[2.15rem] bg-[#111] p-[10px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10"
        style={{ aspectRatio: "9 / 19.2" }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-[12px] z-20 h-[18px] w-[38%] -translate-x-1/2 rounded-b-[12px] bg-[#111]"
          aria-hidden
        />
        <div className="relative h-full overflow-hidden rounded-[1.65rem] bg-[#F8F5EE]">
          <LiveFrame src={src} title={title} fallback={fallback} />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[12px] z-20 mx-auto h-[4px] w-[36%] rounded-full bg-white/20"
          aria-hidden
        />
      </div>
    </div>
  );
}

export function LiveSiteShowcase({
  url,
  displayUrl,
  desktopFallback,
  mobileFallback,
  title = "Landing page ao vivo",
  className,
}: LiveSiteShowcaseProps) {
  const host = displayUrl ?? url.replace(/^https?:\/\//, "");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className={cn("relative mx-auto w-full max-w-5xl px-1 sm:max-w-6xl sm:px-0", className)}
    >
      <div
        className="pointer-events-none absolute -inset-x-[8%] -bottom-[18%] h-[55%] rounded-full bg-[#7A1B1B]/25 blur-[80px]"
        aria-hidden
      />

      <div className="relative">
        <div className="sm:pr-[min(38%,14.5rem)] md:pr-[min(36%,15.5rem)] lg:pr-64">
          <div className="relative pb-10">
            <div className="relative overflow-hidden rounded-[1.15rem] border border-white/[0.1] bg-[#0a0a0a]/90 shadow-[0_60px_140px_-40px_rgba(0,0,0,0.95)] ring-1 ring-white/[0.04] sm:rounded-[1.25rem]">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                aria-hidden
              />
              <BrowserChrome displayUrl={host} />
              <div className="h-[min(640px,78vh)]">
                <LiveFrame
                  src={url}
                  title={`${title} — desktop`}
                  fallback={desktopFallback}
                />
              </div>
            </div>
            <div
              className="pointer-events-none absolute -bottom-10 left-[8%] right-[8%] h-16 opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent)]"
              aria-hidden
            >
              <div className="h-full rounded-[1.25rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-md" />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, x: 12 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.2, duration: 0.85, ease: EASE_OUT }}
          className="relative z-10 mx-auto mt-4 flex justify-center sm:absolute sm:bottom-[8%] sm:right-0 sm:mt-0"
        >
          <div
            className="pointer-events-none absolute -inset-4 rounded-[2.4rem] bg-[#C4A35A]/20 blur-2xl"
            aria-hidden
          />
          <LivePhone src={url} title={`${title} — mobile`} fallback={mobileFallback} />
        </motion.div>
      </div>
    </motion.div>
  );
}
