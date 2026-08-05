import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { Case } from "@/types/case";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { CaseParallaxImage } from "./CaseImage";
import { CaseReveal } from "./shared/CaseSection";
import { fadeUp } from "./shared/motion";

interface CaseHeroProps {
  caseData: Case;
}

function HeroCollectionBadge({
  caseNumber,
  caseVertical,
}: {
  caseNumber?: string;
  caseVertical?: string;
}) {
  if (!caseNumber && !caseVertical) return null;

  return (
    <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground/55">
      {caseNumber && <span>Case {caseNumber}</span>}
      {caseNumber && caseVertical && <span className="h-3 w-px bg-white/[0.08]" aria-hidden />}
      {caseVertical && <span className="text-muted-foreground/70">{caseVertical}</span>}
    </div>
  );
}

function HeroEditorialSheet({
  meta,
  compact = false,
}: {
  meta: NonNullable<Case["heroExtended"]>["metaSheet"];
  compact?: boolean;
}) {
  if (!meta) return null;

  return (
    <dl
      className={cn(
        "grid grid-cols-2 border-t border-white/[0.06] sm:grid-cols-4",
        compact ? "mt-6 gap-x-6 gap-y-5 pt-6 sm:gap-x-8" : "mt-8 gap-x-8 gap-y-6 pt-8 sm:gap-x-10",
      )}
    >
      <div>
        <dt className="text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/50">
          Cliente
        </dt>
        <dd className="mt-1.5 space-y-0.5 text-[13px] leading-snug text-foreground/75">
          {meta.client.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </dd>
      </div>
      <div>
        <dt className="text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/50">
          Segmento
        </dt>
        <dd className="mt-1.5 text-[13px] text-foreground/75">{meta.segment}</dd>
      </div>
      <div>
        <dt className="text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/50">
          Serviços
        </dt>
        <dd className="mt-1.5 space-y-0.5 text-[13px] leading-snug text-foreground/75">
          {meta.services.map((service) => (
            <span key={service} className="block">
              {service}
            </span>
          ))}
        </dd>
      </div>
      <div>
        <dt className="text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground/50">
          Período
        </dt>
        <dd className="mt-1.5 text-[13px] text-foreground/75">{meta.period}</dd>
      </div>
    </dl>
  );
}

function HeroPreviewPanel({
  src,
  alt,
  className,
  fillColumn = false,
}: {
  src: string;
  alt: string;
  className?: string;
  fillColumn?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full",
        fillColumn ? "max-w-none" : "max-w-[340px] sm:max-w-[380px] lg:max-w-[420px]",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute rounded-[2.5rem] bg-brand/20 blur-[72px]",
          fillColumn ? "-inset-4" : "-inset-6",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute rounded-[2.25rem] border border-brand/15",
          fillColumn ? "-inset-2" : "-inset-3",
        )}
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.1] bg-surface/50 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl ring-1 ring-inset ring-brand/15 sm:rounded-[1.5rem]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl"
          aria-hidden
        />

        <div
          className={cn(
            "relative overflow-hidden",
            fillColumn ? "aspect-[4/5] w-full" : "aspect-[4/5]",
          )}
        >
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover object-top"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

function HeroLogoPanel({
  logo,
  alt,
  className,
  fillColumn = false,
}: {
  logo: string;
  alt: string;
  className?: string;
  fillColumn?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full",
        fillColumn ? "max-w-none" : "max-w-[340px] sm:max-w-[380px] lg:max-w-[420px]",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute rounded-[2.5rem] bg-brand/20 blur-[72px]",
          fillColumn ? "-inset-4" : "-inset-6",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute rounded-[2.25rem] border border-brand/15",
          fillColumn ? "-inset-2" : "-inset-3",
        )}
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/[0.1] bg-surface/50 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-xl ring-1 ring-inset ring-brand/15 sm:rounded-[1.5rem]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.72_0.19_48/0.08),transparent_55%)]"
          aria-hidden
        />

      <div
        className={cn(
          "relative flex items-center justify-center",
          fillColumn
            ? "aspect-square w-full px-5 py-5 sm:px-6 sm:py-6"
            : "px-10 py-14 sm:px-12 sm:py-16 lg:px-14 lg:py-20",
        )}
      >
        <img
          src={logo}
          alt={alt}
          className={cn(
            "h-auto w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.4)]",
            fillColumn ? "max-w-[min(100%,260px)]" : "max-w-[240px] sm:max-w-[280px] lg:max-w-[320px]",
          )}
        />
        </div>
      </div>
    </div>
  );
}

export function CaseHero({ caseData }: CaseHeroProps) {
  const ext = caseData.heroExtended;
  const useAmbient = ext?.background === "ambient";
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.55], [0, -40]);
  const logoScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.94]);
  const logoY = useTransform(scrollYProgress, [0, 0.55], [0, 24]);
  const useSplitHero = Boolean(
    useAmbient && ext?.headlineLines && (ext?.logo || ext?.panelImage),
  );
  const panelAlt = ext?.metaSheet?.client[0] ?? caseData.title;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden border-b border-white/[0.04]"
    >
      {/* Background layers */}
      {!useAmbient && (
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <CaseParallaxImage
            src={caseData.heroImage}
            alt={`Hero — ${caseData.title}`}
            className="h-full"
          />
        </motion.div>
      )}

      {useAmbient && (
        <div className="absolute inset-0 bg-background" aria-hidden>
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, oklch(0.72 0.19 48 / 0.08), transparent 42%), radial-gradient(circle at 85% 75%, oklch(0.35 0.08 260 / 0.1), transparent 38%)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.025)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>
      )}

      <div
        className={cn(
          "absolute inset-0",
          useAmbient
            ? "bg-gradient-to-b from-background via-background/95 to-background"
            : "bg-gradient-to-b from-background/30 via-background/70 to-background",
        )}
      />
      {!useAmbient && (
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
      )}

      {/* Ambient light orbs */}
      <div
        className="pointer-events-none absolute -left-[10%] top-[15%] h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]"
        aria-hidden
      />
      {useSplitHero && (
        <div
          className="pointer-events-none absolute right-[6%] top-[18%] h-[480px] w-[480px] rounded-full bg-brand/14 blur-[130px]"
          aria-hidden
        />
      )}
      {!useSplitHero && (
        <div
          className="pointer-events-none absolute -right-[5%] bottom-[20%] h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[100px]"
          aria-hidden
        />
      )}

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative flex min-h-[100svh] flex-col"
      >
        <div
          className={cn(
            "mx-auto flex w-full flex-1 flex-col px-5 pb-28 pt-28 sm:px-8 lg:pb-36 lg:pt-32",
            useSplitHero ? "max-w-[92rem] justify-end lg:justify-center" : "max-w-7xl justify-end",
          )}
        >
          <CaseReveal>
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Cases", path: "/cases" },
                { name: caseData.title, path: `/cases/${caseData.slug}` },
              ]}
            />
          </CaseReveal>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
            }}
            className={cn(
              "mt-2 lg:mt-4",
              useSplitHero
                ? "lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:items-start lg:gap-x-10 xl:grid-cols-[minmax(0,13fr)_minmax(0,7fr)] xl:gap-x-12"
                : ext?.headlineLines
                  ? "max-w-3xl"
                  : "max-w-4xl",
            )}
          >
            <div className={cn(useSplitHero && "min-w-0 lg:max-w-none")}>
            {ext?.headlineLines ? (
              <>
                <motion.div variants={fadeUp}>
                  <HeroCollectionBadge
                    caseNumber={ext.caseNumber}
                    caseVertical={ext.caseVertical ?? ext.badge?.split("·").pop()?.trim()}
                  />
                </motion.div>

                {useSplitHero && (ext.logo || ext.panelImage) && (
                  <motion.div variants={fadeUp} className="mt-8 flex justify-center sm:mt-10 lg:hidden">
                    {ext.panelImage ? (
                      <HeroPreviewPanel
                        src={ext.panelImage}
                        alt={`Landing page — ${panelAlt}`}
                        className="max-w-[280px] sm:max-w-[320px]"
                      />
                    ) : (
                      <HeroLogoPanel
                        logo={ext.logo!}
                        alt={panelAlt}
                        className="max-w-[280px] sm:max-w-[320px]"
                      />
                    )}
                  </motion.div>
                )}

                <motion.h1
                  variants={fadeUp}
                  className={cn(
                    "font-display font-bold tracking-[-0.035em] text-balance",
                    useSplitHero
                      ? "mt-4 text-[clamp(2.25rem,3.5vw,3.65rem)] leading-[1.02]"
                      : "mt-6 text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.04] sm:mt-8",
                  )}
                >
                  {ext.headlineLines.map((line, index) => (
                    <span key={line}>
                      {index > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </motion.h1>

                {ext.metaSheet && (
                  <motion.div variants={fadeUp}>
                    <HeroEditorialSheet meta={ext.metaSheet} compact={useSplitHero} />
                  </motion.div>
                )}
              </>
            ) : (
              <>
                {ext?.logo && (
                  <motion.div variants={fadeUp}>
                    <img
                      src={ext.logo}
                      alt={ext.brand ?? caseData.title}
                      className="h-9 w-auto object-contain opacity-90 sm:h-10"
                    />
                  </motion.div>
                )}

                {(ext?.brand || ext?.location) && (
                  <motion.p
                    variants={fadeUp}
                    className="mt-6 font-display text-lg font-semibold tracking-tight sm:text-xl"
                  >
                    {ext.brand}
                    {ext.brand && ext.location && (
                      <span className="mx-2 font-normal text-muted-foreground/50">·</span>
                    )}
                    {ext.location}
                  </motion.p>
                )}

                <motion.span
                  variants={fadeUp}
                  className={cn(
                    "inline-flex items-center rounded-full border border-brand/25 bg-brand/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand backdrop-blur-md",
                    ext?.logo || ext?.brand ? "mt-4" : "mt-8",
                  )}
                >
                  {ext?.badge ?? caseData.category}
                </motion.span>

                {ext?.metaSheet && (
                  <motion.dl
                    variants={fadeUp}
                    className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.08] pt-8 sm:grid-cols-4 sm:gap-x-8"
                  >
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
                        Cliente
                      </dt>
                      <dd className="mt-1.5 text-sm leading-snug text-foreground/80">
                        {ext.metaSheet.client.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
                        Segmento
                      </dt>
                      <dd className="mt-1.5 text-sm text-foreground/80">{ext.metaSheet.segment}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
                        Serviços
                      </dt>
                      <dd className="mt-1.5 text-sm leading-snug text-foreground/80">
                        {ext.metaSheet.services.join(" · ")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
                        Período
                      </dt>
                      <dd className="mt-1.5 text-sm text-foreground/80">{ext.metaSheet.period}</dd>
                    </div>
                  </motion.dl>
                )}

                <motion.h1
                  variants={fadeUp}
                  className="mt-8 font-display text-[clamp(2.75rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-balance"
                >
                  {caseData.title}
                </motion.h1>
              </>
            )}

            {!ext?.headlineLines && (
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed"
              >
                {caseData.subtitle}
              </motion.p>
            )}

            {!ext?.metaSheet && (
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
              >
                <span className="font-medium text-foreground/90">{caseData.client}</span>
                <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
                <span>{caseData.year}</span>
                <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
                <span>{caseData.industry}</span>
              </motion.div>
            )}

            {ext?.heroMetrics && ext.heroMetrics.length > 0 && (
              <motion.div
                variants={fadeUp}
                className={cn(
                  "flex flex-wrap items-end",
                  useSplitHero
                    ? "mt-7 gap-x-10 gap-y-5 border-t border-white/[0.06] pt-7 sm:gap-x-12"
                    : cn(
                        "gap-x-12 gap-y-6 sm:gap-x-14 sm:gap-y-8",
                        ext.headlineLines ? "mt-10 border-t border-white/[0.06] pt-10 sm:mt-12 sm:pt-12" : "mt-12",
                      ),
                )}
              >
                {ext.heroMetrics.map((m, i) => (
                  <div key={m.label}>
                    <p
                      className={cn(
                        "font-display font-bold leading-none tracking-tight",
                        i === 0
                          ? useSplitHero
                            ? "text-4xl sm:text-5xl lg:text-6xl"
                            : "text-5xl sm:text-6xl lg:text-7xl"
                          : useSplitHero
                            ? "text-xl text-muted-foreground/85 sm:text-2xl"
                            : "text-2xl text-muted-foreground/90 sm:text-3xl",
                      )}
                    >
                      {m.value}
                    </p>
                    <p className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80 sm:text-[11px] sm:tracking-[0.2em]">
                      {m.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.div variants={fadeUp} className={cn(useSplitHero ? "mt-7" : "mt-10")}>
              {ext?.ctaLabel && ext?.ctaHref ? (
                <Link
                  to={ext.ctaHref}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                >
                  {ext.ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : caseData.website ? (
                <a
                  href={caseData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold backdrop-blur-xl transition-all hover:border-brand/30 hover:bg-brand/10 hover:shadow-[0_0_40px_-8px_oklch(0.72_0.19_48/0.4)]"
                >
                  Visitar projeto
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <span className="inline-flex cursor-not-allowed items-center gap-2.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-muted-foreground/60 backdrop-blur-xl">
                  Visitar projeto
                  <ArrowUpRight className="h-4 w-4 opacity-40" />
                </span>
              )}
            </motion.div>
            </div>

            {useSplitHero && (ext?.logo || ext?.panelImage) && (
              <motion.div
                variants={fadeUp}
                style={{ scale: logoScale, y: logoY }}
                className="hidden w-full lg:block lg:pt-1"
              >
                {ext.panelImage ? (
                  <HeroPreviewPanel
                    src={ext.panelImage}
                    alt={`Landing page — ${panelAlt}`}
                    fillColumn
                    className="ml-auto max-w-[min(100%,320px)] xl:max-w-[min(100%,360px)]"
                  />
                ) : (
                  <HeroLogoPanel
                    logo={ext.logo!}
                    alt={panelAlt}
                    fillColumn
                    className="ml-auto max-w-[min(100%,320px)] xl:max-w-[min(100%,360px)]"
                  />
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/50"
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.3em]">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom fade into page */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
