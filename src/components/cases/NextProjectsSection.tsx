import type { CaseNextProject } from "@/types/case";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CaseImage } from "./CaseImage";
import { CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

interface NextProjectsSectionProps {
  projects: CaseNextProject[];
  currentSlug: string;
}

export function NextProjectsSection({ projects, currentSlug }: NextProjectsSectionProps) {
  const filtered = projects.filter((p) => p.slug !== currentSlug);
  if (filtered.length === 0) return null;

  return (
    <CaseSection className="border-t border-white/[0.04] py-24 sm:py-32">
      <CaseReveal>
        <CaseEyebrow>Portfólio</CaseEyebrow>
        <CaseHeading>Mais projetos</CaseHeading>
      </CaseReveal>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((project) => (
          <motion.div key={project.slug} variants={fadeUp}>
            <Link
              to="/cases/$slug"
              params={{ slug: project.slug }}
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/20 transition-all duration-500 hover:border-brand/20 hover:shadow-[0_30px_80px_-40px_oklch(0.72_0.19_48/0.25)]"
            >
              <CaseImage
                src={project.coverImage}
                alt={project.title}
                className="aspect-[16/10] w-full transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <h3 className="font-display text-xl font-bold tracking-tight">{project.title}</h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-sm transition-all group-hover:border-brand/30 group-hover:bg-brand/10">
                  <ArrowUpRight className="h-4 w-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </CaseSection>
  );
}
