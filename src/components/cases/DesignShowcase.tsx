import type { Case } from "@/types/case";
import { motion } from "framer-motion";
import {
  MockupDesktop,
  MockupLaptop,
  MockupMobile,
  ShowcaseDetail,
  ShowcaseFullscreen,
  ShowcaseGrid,
} from "./showcase";
import { CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

interface DesignShowcaseProps {
  caseData: Case;
}

export function DesignShowcase({ caseData }: DesignShowcaseProps) {
  const [primary, secondary, tertiary, ...rest] = caseData.gallery;
  const gridItems = rest.slice(0, 2);

  return (
    <>
      {/* Intro text */}
      <CaseSection className="py-24 sm:py-32">
        <CaseReveal className="mx-auto max-w-2xl text-center">
          <CaseEyebrow>Design</CaseEyebrow>
          <CaseHeading>Identidade visual</CaseHeading>
        </CaseReveal>
      </CaseSection>

      {/* Fullscreen hero mockup */}
      {primary && (
        <div className="pb-24 sm:pb-32">
          <ShowcaseFullscreen src={primary.src} alt={primary.alt} />
        </div>
      )}

      {/* Desktop + Mobile side by side */}
      {(secondary || tertiary) && (
        <CaseSection className="pb-24 sm:pb-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_auto] lg:gap-20">
            {secondary && (
              <MockupDesktop src={secondary.src} alt={secondary.alt} />
            )}
            {tertiary && (
              <div className="flex justify-center lg:justify-end">
                <MockupMobile src={tertiary.src} alt={tertiary.alt} />
              </div>
            )}
          </div>
        </CaseSection>
      )}

      {/* Laptop centered */}
      {secondary && (
        <CaseSection variant="elevated" className="py-24 sm:py-32">
          <MockupLaptop src={secondary.src} alt={`${secondary.alt} — laptop`} />
        </CaseSection>
      )}

      {/* Grid 2 columns */}
      {gridItems.length >= 2 && (
        <CaseSection className="py-24 sm:py-32">
          <ShowcaseGrid items={gridItems} />
        </CaseSection>
      )}

      {/* Color & Typography details */}
      <CaseSection variant="dark" className="py-24 sm:py-32 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <CaseReveal>
            <CaseEyebrow>Paleta</CaseEyebrow>
            <CaseHeading className="text-2xl sm:text-3xl">Cores</CaseHeading>
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
              className="mt-10 space-y-4"
            >
              {caseData.colors.map((color) => (
                <motion.li
                  key={color.name}
                  variants={fadeUp}
                  className="group flex items-center gap-5 rounded-2xl border border-white/[0.06] bg-surface/30 p-4 transition-colors hover:border-white/[0.1]"
                >
                  <span
                    className="h-14 w-14 shrink-0 rounded-xl border border-white/[0.08] shadow-inner transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden
                  />
                  <div>
                    <p className="font-medium">{color.name}</p>
                    <p className="mt-0.5 font-mono text-sm text-muted-foreground">{color.hex}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </CaseReveal>

          <CaseReveal delay={0.1}>
            <CaseEyebrow>Tipografia</CaseEyebrow>
            <CaseHeading className="text-2xl sm:text-3xl">Type system</CaseHeading>
            <div className="mt-10 space-y-8">
              <div className="rounded-2xl border border-white/[0.06] bg-surface/30 p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Heading
                </p>
                <p className="mt-3 font-display text-3xl font-bold tracking-tight">
                  {caseData.typography.heading}
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.06] bg-surface/30 p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Body
                </p>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                  {caseData.typography.body}
                </p>
              </div>
            </div>
          </CaseReveal>
        </div>

        {/* Detail zoom */}
        {primary && (
          <div className="mt-20">
            <ShowcaseDetail src={primary.src} alt={primary.alt} label="Detalhe ampliado" />
          </div>
        )}
      </CaseSection>
    </>
  );
}
