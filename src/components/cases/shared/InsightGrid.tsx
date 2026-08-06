import type { CaseInsightItem } from "@/types/case";
import { motion } from "framer-motion";
import { CaseBody } from "./CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./motion";

interface InsightGridProps {
  items: CaseInsightItem[];
  className?: string;
}

export function InsightGrid({ items, className }: InsightGridProps) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerContainer}
      className={`grid gap-5 sm:grid-cols-2 lg:gap-6 ${className ?? "mt-16 lg:mt-20"}`}
    >
      {items.map((item) => (
        <motion.li
          key={item.title}
          variants={fadeUp}
          className="rounded-2xl border border-white/[0.06] bg-surface/30 p-7 sm:p-8"
        >
          <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">{item.title}</h3>
          <CaseBody className="mt-3 text-sm leading-relaxed sm:text-base">{item.description}</CaseBody>
        </motion.li>
      ))}
    </motion.ul>
  );
}
