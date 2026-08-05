import { hasItems } from "@/lib/cases/visibility";
import type { Case } from "@/types/case";
import { CaseCardsBlock, CaseTextBlock } from "./shared/CaseBlockSection";
import { CaseBody, CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "../shared/CaseSection";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "../shared/motion";

interface DesignDetailsSectionsProps {
  caseData: Case;
}

export function DesignDetailsSections({ caseData }: DesignDetailsSectionsProps) {
  const d = caseData.design;
  if (!d) return null;

  const hasTypography = !!d.typography;
  const hasColors = hasItems(d.colors);
  const hasHighlights = hasItems(d.uiHighlights);
  const hasComponents = hasItems(d.components);
  const hasInteractions = hasItems(d.interactions);

  if (!hasTypography && !hasColors && !hasHighlights && !hasComponents && !hasInteractions) {
    return null;
  }

  return (
    <>
      {(hasTypography || hasColors) && (
        <CaseSection id="design-system" variant="elevated" className="py-24 sm:py-32">
          <CaseReveal className="max-w-2xl">
            <CaseEyebrow>Design System</CaseEyebrow>
            <CaseHeading>Tipografia & cores</CaseHeading>
          </CaseReveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            {hasTypography && d.typography && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={fadeUp}
                className="space-y-6"
              >
                <div className="rounded-2xl border border-white/[0.06] bg-surface/30 p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    Heading
                  </p>
                  <p className="mt-3 font-display text-3xl font-bold">{d.typography.heading}</p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-surface/30 p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    Body
                  </p>
                  <CaseBody className="mt-3">{d.typography.body}</CaseBody>
                </div>
              </motion.div>
            )}

            {hasColors && d.colors && (
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={staggerContainer}
                className="space-y-3"
              >
                {d.colors.map((color) => (
                  <motion.li
                    key={color.name}
                    variants={fadeUp}
                    className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-surface/30 p-4"
                  >
                    <span
                      className="h-12 w-12 shrink-0 rounded-lg border border-white/[0.08]"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden
                    />
                    <div>
                      <p className="font-medium">{color.name}</p>
                      <p className="font-mono text-sm text-muted-foreground">{color.hex}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </CaseSection>
      )}

      {hasHighlights && (
        <CaseCardsBlock
          id="ui-highlights"
          eyebrow="Interface"
          title="Destaques de UI"
          cards={d.uiHighlights!.map((h) => ({
            title: h.title,
            description: h.description,
            image: h.image,
          }))}
          columns={2}
        />
      )}

      {hasComponents && (
        <CaseCardsBlock
          id="componentes"
          eyebrow="Componentes"
          title="Peças do design system"
          cards={d.components!.map((c) => ({
            title: c.name,
            description: c.description,
            meta: c.usage,
          }))}
          columns={3}
        />
      )}

      {hasInteractions && (
        <CaseSection id="interacoes" className="py-24 sm:py-32">
          <CaseReveal className="max-w-2xl">
            <CaseEyebrow>Interações</CaseEyebrow>
            <CaseHeading>Microinterações & motion</CaseHeading>
          </CaseReveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer}
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {d.interactions!.map((item) => (
              <motion.div
                key={item.name}
                variants={fadeUp}
                className="rounded-2xl border border-white/[0.06] bg-surface/30 p-6"
              >
                <h3 className="font-semibold">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </CaseSection>
      )}
    </>
  );
}
