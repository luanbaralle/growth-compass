import type { Case } from "@/types/case";
import {
  ArrowRight,
  ClipboardList,
  LayoutTemplate,
  MapPin,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import nobreLogo from "@/assets/case-nobre/logo.png";
import { CaseCTA } from "./CaseCTA";
import { CaseHero } from "./CaseHero";
import { DeliverablesScrollSection } from "./DeliverablesScrollSection";
import { ProblemScrollSection } from "./ProblemScrollSection";
import { ProcessTimeline } from "./ProcessTimeline";
import { ResultsSection } from "./ResultsSection";
import { ReputationShowcase } from "./showcase";
import {
  CaseBody,
  CaseEyebrow,
  CaseHeading,
  CaseReveal,
  CaseSection,
} from "./shared/CaseSection";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "./shared/motion";

interface NobreCaseContentProps {
  caseData: Case;
}

const BASTIDORES_ICONS = [ClipboardList, LayoutTemplate, Users, MapPin] as const;

const BASTIDORES_TAGS = [
  ["Marca", "Público", "Posicionamento"],
  ["Calendário", "Produção", "Conteúdo"],
  ["Corretores", "Capacitação", "Escala"],
  ["GMB", "Reviews", "Pós-venda"],
] as const;

function withNobreAssets(caseData: Case): Case {
  return {
    ...caseData,
    coverImage: nobreLogo,
    heroExtended: {
      ...caseData.heroExtended,
      logo: nobreLogo,
    },
  };
}

function getMetricValue(metrics: Case["metrics"], labelIncludes: string): string {
  return metrics.find((m) => m.label.toLowerCase().includes(labelIncludes.toLowerCase()))?.value ?? "—";
}

export function NobreCaseContent({ caseData }: NobreCaseContentProps) {
  const data = withNobreAssets(caseData);
  const content = data.content;
  const [activeStep, setActiveStep] = useState(0);

  const gmbImage = data.gallery[0];
  const rating = getMetricValue(data.metrics, "nota");
  const reviewCount = getMetricValue(data.metrics, "avalia");

  return (
    <div className="case-study">
      <CaseHero caseData={data} />

      <ProblemScrollSection
        id="problema"
        eyebrow="O problema"
        headline={data.challenge}
        pains={data.goals}
        channels={content?.problemChannels ?? []}
        closing={content?.problemClosing}
      />

      <ProcessTimeline steps={data.process} eyebrow="A solução" title={data.solution} />

      <CaseSection id="reputacao" className="overflow-visible py-24 sm:py-32">
        <CaseReveal className="mx-auto max-w-3xl text-center">
          <hr className="border-white/[0.08]" />
          <CaseHeading className="mt-10 text-2xl sm:text-3xl lg:text-4xl">
            {content?.landingTitle}
          </CaseHeading>
          {content?.landingScrollHint && (
            <p className="mt-4 text-sm text-muted-foreground">{content.landingScrollHint}</p>
          )}
          <hr className="mt-10 border-white/[0.08]" />
        </CaseReveal>

        <div className="mt-14 sm:mt-20">
          <ReputationShowcase
            businessName="Nobre Imóveis"
            location="Itanhaém, SP"
            rating={rating}
            reviewCount={reviewCount}
            imageSrc={gmbImage?.src}
            imageAlt={gmbImage?.alt}
            mapsHref={data.website}
            displayUrl="google.com/maps"
          />
        </div>
      </CaseSection>

      <ResultsSection metrics={data.metrics} deliverables={[]} />

      {content?.agencyDeliverables && content.agencyDeliverables.length > 0 && (
        <DeliverablesScrollSection id="entregaveis" items={content.agencyDeliverables} />
      )}

      {content?.transformBefore && content?.transformAfter && (
        <CaseSection id="transformacao" variant="elevated" className="py-24 sm:py-32 lg:py-40">
          <CaseReveal className="mx-auto mb-16 max-w-2xl text-center sm:mb-20">
            <CaseEyebrow>A transformação</CaseEyebrow>
            <CaseHeading>Antes & Depois</CaseHeading>
          </CaseReveal>

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scaleIn}
              className="group"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                  Antes
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-surface/20 p-8 opacity-80 transition-opacity duration-500 group-hover:opacity-100 sm:p-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {content.transformBefore.outcome}
                </p>

                <motion.ul
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={staggerContainer}
                  className="mt-8 space-y-4"
                >
                  {content.transformBefore.channels.map((channel) => (
                    <motion.li
                      key={channel}
                      variants={fadeUp}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-background/40 px-5 py-4"
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/30" />
                      <span className="font-display text-lg font-semibold text-muted-foreground sm:text-xl">
                        {channel}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
              aria-hidden
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand/30 bg-brand/10 shadow-[0_0_40px_-10px_oklch(0.72_0.19_48/0.5)] lg:h-16 lg:w-16">
                <ArrowRight className="h-6 w-6 rotate-90 text-brand lg:rotate-0" />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={scaleIn}
              className="group"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">
                  Depois
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-brand/25 bg-brand/5 p-8 shadow-[0_20px_60px_-30px_oklch(0.72_0.19_48/0.35)] sm:p-10">
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-brand/10"
                  aria-hidden
                />
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand/80">
                  {content.transformAfter.outcome}
                </p>

                <motion.ol
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  variants={staggerContainer}
                  className="relative mt-8 space-y-0"
                >
                  {content.transformAfter.channels.map((step, i) => (
                    <motion.li key={step} variants={fadeUp} className="relative flex flex-col items-stretch">
                      <div className="flex items-center gap-4 rounded-xl border border-brand/25 bg-brand/10 px-5 py-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/15 text-xs font-bold text-brand">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-lg font-semibold sm:text-xl">{step}</span>
                      </div>
                      {i < content.transformAfter.channels.length - 1 && (
                        <span className="my-1 flex justify-center text-brand/40" aria-hidden>
                          ↓
                        </span>
                      )}
                    </motion.li>
                  ))}
                </motion.ol>
              </div>
            </motion.div>
          </div>
        </CaseSection>
      )}

      {content?.faqs && content.faqs.length > 0 && (
        <CaseSection id="bastidores" className="py-24 sm:py-32 lg:py-40">
          <CaseReveal className="mx-auto max-w-2xl text-center">
            <CaseEyebrow>Bastidores</CaseEyebrow>
            <CaseHeading>Como trabalhamos</CaseHeading>
          </CaseReveal>

          <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-14">
            <motion.ol
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer}
              className="space-y-2"
            >
              {content.faqs.map((step, index) => {
                const isActive = activeStep === index;
                const Icon = BASTIDORES_ICONS[index] ?? ClipboardList;

                return (
                  <motion.li key={step.question} variants={fadeUp} className="relative">
                    {index < content.faqs!.length - 1 && (
                      <span
                        className={`absolute left-[1.375rem] top-[calc(100%-0.25rem)] h-3 w-px transition-colors duration-300 ${
                          isActive || activeStep > index ? "bg-brand/40" : "bg-white/[0.08]"
                        }`}
                        aria-hidden
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveStep(index)}
                      aria-current={isActive ? "step" : undefined}
                      className={`group flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-300 sm:px-5 sm:py-5 ${
                        isActive
                          ? "border-brand/30 bg-brand/10 shadow-[0_12px_40px_-24px_oklch(0.72_0.19_48/0.6)]"
                          : "border-white/[0.06] bg-surface/20 hover:border-white/[0.12] hover:bg-surface/30"
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-300 ${
                          isActive
                            ? "border-brand/40 bg-brand/15 text-brand"
                            : "border-white/[0.08] bg-background/40 text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-display text-base font-semibold tracking-tight transition-colors sm:text-lg ${
                            isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          {step.question}
                        </span>
                      </span>
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive ? "text-brand" : "text-muted-foreground/40 group-hover:text-muted-foreground"
                        }`}
                        aria-hidden
                      />
                    </button>
                  </motion.li>
                );
              })}
            </motion.ol>

            <div className="relative min-h-[280px] lg:min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={content.faqs[activeStep]?.question}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/30 p-8 sm:p-10 lg:absolute lg:inset-0"
                >
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/10 blur-3xl"
                    aria-hidden
                  />
                  {(() => {
                    const step = content.faqs![activeStep];
                    const Icon = BASTIDORES_ICONS[activeStep] ?? ClipboardList;
                    const tags = BASTIDORES_TAGS[activeStep] ?? [];

                    return (
                      <>
                        <div className="relative flex items-start gap-5">
                          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand/25 bg-brand/10">
                            <Icon className="h-6 w-6 text-brand" aria-hidden />
                          </span>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand/80">
                              Etapa {String(activeStep + 1).padStart(2, "0")}
                            </p>
                            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                              {step.question}
                            </h3>
                          </div>
                        </div>

                        <CaseBody className="relative mt-8 text-base leading-relaxed text-muted-foreground sm:text-lg">
                          {step.answer}
                        </CaseBody>

                        {tags.length > 0 && (
                          <motion.ul
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="relative mt-8 flex flex-wrap gap-2"
                          >
                            {tags.map((tag) => (
                              <motion.li
                                key={tag}
                                variants={fadeUp}
                                className="rounded-full border border-brand/20 bg-brand/5 px-3 py-1.5 text-xs font-medium text-brand/90"
                              >
                                {tag}
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </CaseSection>
      )}

      <CaseCTA caseData={data} />
    </div>
  );
}
