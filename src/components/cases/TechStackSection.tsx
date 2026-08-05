import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Box,
  Cloud,
  Code2,
  Database,
  Globe,
  Layers,
  Palette,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

interface TechStackSectionProps {
  technologies: string[];
  deliverables?: string[];
}

function resolveTechIcon(name: string): LucideIcon {
  const key = name.toLowerCase();
  if (key.includes("react") || key.includes("next") || key.includes("vue")) return Layers;
  if (key.includes("node") || key.includes("api")) return Server;
  if (key.includes("database") || key.includes("sql") || key.includes("supabase")) return Database;
  if (key.includes("cloud") || key.includes("aws") || key.includes("vercel")) return Cloud;
  if (key.includes("mobile") || key.includes("app")) return Smartphone;
  if (key.includes("design") || key.includes("figma")) return Palette;
  if (key.includes("web") || key.includes("html")) return Globe;
  if (key.includes("code") || key.includes("typescript")) return Code2;
  return Box;
}

function TechCard({ name, index }: { name: string; index: number }) {
  const Icon = resolveTechIcon(name);

  return (
    <motion.li
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/30 p-6 backdrop-blur-sm transition-all duration-500 hover:border-brand/20 hover:bg-surface/50 hover:shadow-[0_24px_60px_-30px_oklch(0.72_0.19_48/0.2)]"
    >
      <div
        className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-0"
        aria-hidden
      />
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-brand transition-transform duration-500 group-hover:scale-105">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-semibold tracking-tight">{name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        TODO: descrição da tecnologia
      </p>
      <span className="mt-4 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.li>
  );
}

export function TechStackSection({ technologies, deliverables = [] }: TechStackSectionProps) {
  return (
    <CaseSection variant="elevated" className="py-24 sm:py-32 lg:py-40">
      <div className="grid gap-20 lg:grid-cols-[1fr_0.8fr] lg:gap-24">
        <div>
          <CaseReveal>
            <CaseEyebrow>Stack</CaseEyebrow>
            <CaseHeading>Tecnologias</CaseHeading>
          </CaseReveal>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {technologies.map((tech, index) => (
              <TechCard key={tech} name={tech} index={index} />
            ))}
          </motion.ul>
        </div>

        {deliverables.length > 0 && (
          <CaseReveal delay={0.15}>
            <CaseEyebrow>Entregáveis</CaseEyebrow>
            <CaseHeading className="text-2xl sm:text-3xl">O que entregamos</CaseHeading>

            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
              className="mt-10 space-y-3"
            >
              {deliverables.map((item, index) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  className={cn(
                    "flex items-start gap-4 rounded-xl border border-white/[0.04] bg-surface/20 px-5 py-4 transition-colors hover:border-white/[0.08] hover:bg-surface/40",
                  )}
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-brand">
                    {index + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </CaseReveal>
        )}
      </div>
    </CaseSection>
  );
}
