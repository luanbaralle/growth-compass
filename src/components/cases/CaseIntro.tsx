import type { Case } from "@/types/case";
import { motion } from "framer-motion";
import { CaseBody, CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

interface CaseIntroProps {
  caseData: Case;
}

const metaItems = (caseData: Case) =>
  [
    { label: "Cliente", value: caseData.client },
    { label: "Indústria", value: caseData.industry },
    { label: "Categoria", value: caseData.category },
    { label: "Ano", value: String(caseData.year) },
  ] as const;

export function CaseIntro({ caseData }: CaseIntroProps) {
  return (
    <CaseSection className="py-24 sm:py-32 lg:py-40">
      <div className="grid gap-16 lg:grid-cols-[1.4fr_0.6fr] lg:gap-24">
        <CaseReveal>
          <CaseEyebrow>Visão geral</CaseEyebrow>
          <CaseHeading className="max-w-3xl">{caseData.title}</CaseHeading>
          <CaseBody className="max-w-2xl text-lg sm:text-xl">{caseData.description}</CaseBody>
        </CaseReveal>

        <motion.dl
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03]"
        >
          {metaItems(caseData).map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              className="bg-surface/40 px-6 py-5 backdrop-blur-sm transition-colors hover:bg-surface/60"
            >
              <dt className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                {item.label}
              </dt>
              <dd className="mt-2 text-base font-medium tracking-tight">{item.value}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </CaseSection>
  );
}
