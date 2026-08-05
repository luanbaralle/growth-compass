import { motion } from "framer-motion";
import { CaseEyebrow, CaseHeading, CaseSection } from "./shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

interface GoalsSectionProps {
  goals: string[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  return (
    <CaseSection variant="dark" className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>Objetivos</CaseEyebrow>
        <CaseHeading>Metas do projeto</CaseHeading>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {goals.map((goal, index) => (
          <motion.li
            key={goal}
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/30 p-6 backdrop-blur-sm transition-all duration-500 hover:border-brand/20 hover:bg-surface/50 hover:shadow-[0_20px_60px_-30px_oklch(0.72_0.19_48/0.25)]"
          >
            <span className="font-display text-4xl font-bold tracking-tighter text-brand/20 transition-colors group-hover:text-brand/35">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {goal}
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </CaseSection>
  );
}
