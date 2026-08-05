import { hasItems } from "@/lib/cases/visibility";
import type { Case, CaseMetric } from "@/types/case";
import { CaseCardsBlock } from "./shared/CaseBlockSection";
import { CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "../shared/CaseSection";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "../shared/motion";

interface ResultsExtendedSectionsProps {
  caseData: Case;
}

function ExtendedMetricsBlock({ metrics }: { metrics: CaseMetric[] }) {
  return (
    <CaseSection id="metricas-estendidas" variant="elevated" className="py-24 sm:py-32">
      <CaseReveal className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>Resultados</CaseEyebrow>
        <CaseHeading>Métricas adicionais</CaseHeading>
      </CaseReveal>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {metrics.map((metric) => (
          <motion.div
            key={metric.label}
            variants={fadeUp}
            className="rounded-2xl border border-white/[0.06] bg-surface/30 px-5 py-6 text-center"
          >
            <p className="text-2xl font-bold text-brand sm:text-3xl">{metric.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {metric.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </CaseSection>
  );
}

export function ResultsExtendedSections({ caseData }: ResultsExtendedSectionsProps) {
  const r = caseData.results;
  if (!r) return null;

  return (
    <>
      {hasItems(r.metrics) && <ExtendedMetricsBlock metrics={r.metrics} />}

      {hasItems(r.qualitativeResults) && (
        <CaseCardsBlock
          id="resultados-qualitativos"
          eyebrow="Impacto"
          title="Resultados qualitativos"
          cards={r.qualitativeResults!.map((item) => ({
            title: item.title,
            description: item.description,
          }))}
          columns={2}
        />
      )}

      {hasItems(r.clientWins) && (
        <CaseCardsBlock
          id="vitorias-cliente"
          eyebrow="Cliente"
          title="Vitórias do cliente"
          cards={r.clientWins!.map((item) => ({
            title: item.title,
            description: item.description,
          }))}
          variant="dark"
          columns={3}
        />
      )}
    </>
  );
}
