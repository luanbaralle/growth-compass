import type { Case } from "@/types/case";
import { motion } from "framer-motion";
import { CaseImage } from "./CaseImage";
import { CaseBody, CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./shared/CaseSection";
import { fadeUp, slideInLeft, slideInRight, viewportOnce } from "./shared/motion";

interface ChallengeSectionProps {
  caseData: Case;
}

export function ChallengeSection({ caseData }: ChallengeSectionProps) {
  return (
    <>
      {/* Challenge — text focused */}
      <CaseSection variant="elevated" className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <CaseReveal>
            <CaseEyebrow>Desafio</CaseEyebrow>
            <CaseHeading>O problema</CaseHeading>
            <CaseBody className="mx-auto">{caseData.challenge}</CaseBody>
          </CaseReveal>
        </div>
      </CaseSection>

      {/* Full-bleed visual break */}
      <div className="relative -mx-0 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative"
        >
          <CaseImage
            src={caseData.coverImage}
            alt={`Contexto — ${caseData.title}`}
            className="aspect-[21/9] w-full min-h-[240px] sm:min-h-[360px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </motion.div>
      </div>

      {/* Solution — split layout */}
      <CaseSection className="py-24 sm:py-32 lg:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideInLeft}
          >
            <CaseEyebrow>Solução</CaseEyebrow>
            <CaseHeading className="text-3xl sm:text-4xl">O que fizemos</CaseHeading>
            <CaseBody>{caseData.solution}</CaseBody>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={slideInRight}
            className="relative"
          >
            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl bg-brand/5 blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06]">
              <CaseImage
                src={caseData.heroImage}
                alt={`Solução — ${caseData.title}`}
                className="aspect-[4/5] w-full sm:aspect-[3/4]"
              />
            </div>
          </motion.div>
        </div>
      </CaseSection>
    </>
  );
}
