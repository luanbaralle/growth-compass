import type { Case } from "@/types/case";
import {
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
import { LessonsSection } from "./shared/LessonsSection";
import { TransformSection } from "./shared/TransformSection";
import { WhyItWorkedSection } from "./shared/WhyItWorkedSection";
import {
  CaseBody,
  CaseEyebrow,
  CaseHeading,
  CaseReveal,
  CaseSection,
} from "./shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

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
        intro={content?.problemIntro}
        pains={data.goals}
        channels={content?.problemChannels ?? []}
        closing={content?.problemClosing}
      />

      <ProcessTimeline steps={data.process} eyebrow="A solução" title={data.solution} />

      <ResultsSection
        metrics={data.metrics}
        deliverables={[]}
        intro={content?.resultsIntro}
      />

      {content?.whyItWorked && content.whyItWorked.length > 0 && (
        <WhyItWorkedSection
          title={content.whyItWorkedTitle}
          intro={content.whyItWorkedIntro}
          items={content.whyItWorked}
          systemFlow={content.systemFlow}
          systemFlowIntro={content.systemFlowIntro}
        />
      )}

      <CaseSection id="reputacao" className="overflow-visible py-24 sm:py-32">
        <CaseReveal className="mx-auto max-w-3xl text-center">
          <hr className="border-white/[0.08]" />
          <CaseHeading className="mt-10 text-2xl sm:text-3xl lg:text-4xl">
            {content?.landingTitle}
          </CaseHeading>
          {content?.landingDescription && (
            <CaseBody className="mx-auto mt-6 max-w-2xl">{content.landingDescription}</CaseBody>
          )}
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

      {content?.lessonsLearned && content.lessonsLearned.length > 0 && (
        <LessonsSection
          title={content.lessonsTitle}
          intro={content.lessonsIntro}
          items={content.lessonsLearned}
        />
      )}

      {content?.agencyDeliverables && content.agencyDeliverables.length > 0 && (
        <DeliverablesScrollSection
          id="entregaveis"
          items={content.agencyDeliverables}
          intro={content.deliverablesIntro}
        />
      )}

      {content?.transformBefore && content?.transformAfter && (
        <TransformSection
          intro={content.transformIntro}
          closing={content.transformClosing}
          before={content.transformBefore}
          after={content.transformAfter}
        />
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
