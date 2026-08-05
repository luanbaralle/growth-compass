import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { CaseImage } from "../../CaseImage";
import type { CaseGalleryItem } from "@/types/case";
import {
  CaseBody,
  CaseEyebrow,
  CaseHeading,
  CaseReveal,
  CaseSection,
} from "../../shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "../../shared/motion";

interface CaseTextBlockProps {
  eyebrow: string;
  title: string;
  body: string;
  variant?: "default" | "elevated" | "dark";
  centered?: boolean;
  id?: string;
}

export function CaseTextBlock({
  eyebrow,
  title,
  body,
  variant = "default",
  centered = false,
  id,
}: CaseTextBlockProps) {
  return (
    <CaseSection id={id} variant={variant} className="py-24 sm:py-32">
      <CaseReveal className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
        <CaseBody className={centered ? "mx-auto" : undefined}>{body}</CaseBody>
      </CaseReveal>
    </CaseSection>
  );
}

interface CaseListBlockProps {
  eyebrow: string;
  title: string;
  items: string[];
  variant?: "default" | "elevated" | "dark";
  id?: string;
}

export function CaseListBlock({
  eyebrow,
  title,
  items,
  variant = "default",
  id,
}: CaseListBlockProps) {
  return (
    <CaseSection id={id} variant={variant} className="py-24 sm:py-32">
      <CaseReveal className="max-w-2xl">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
      </CaseReveal>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mt-12 grid gap-3 sm:grid-cols-2"
      >
        {items.map((item) => (
          <motion.li
            key={item}
            variants={fadeUp}
            className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-surface/30 px-5 py-4 text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </CaseSection>
  );
}

export interface CaseCardItem {
  title: string;
  description: string;
  meta?: string;
  image?: CaseGalleryItem;
}

interface CaseCardsBlockProps {
  eyebrow: string;
  title: string;
  cards: CaseCardItem[];
  variant?: "default" | "elevated" | "dark";
  columns?: 2 | 3;
  id?: string;
}

export function CaseCardsBlock({
  eyebrow,
  title,
  cards,
  variant = "default",
  columns = 2,
  id,
}: CaseCardsBlockProps) {
  return (
    <CaseSection id={id} variant={variant} className="py-24 sm:py-32">
      <CaseReveal className="max-w-2xl">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
      </CaseReveal>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className={`mt-12 grid gap-4 ${columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}
      >
        {cards.map((card) => (
          <motion.article
            key={card.title}
            variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/30 transition-colors hover:border-white/[0.1]"
          >
            {card.image && (
              <CaseImage src={card.image.src} alt={card.image.alt} className="aspect-[16/10] w-full" />
            )}
            <div className="p-6">
              {card.meta && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/70">
                  {card.meta}
                </p>
              )}
              <h3 className="mt-2 font-semibold tracking-tight">{card.title}</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </CaseSection>
  );
}

interface CaseFAQBlockProps {
  faqs: { question: string; answer: string }[];
  id?: string;
  eyebrow?: string;
  title?: string;
}

export function CaseFAQBlock({
  faqs,
  id,
  eyebrow = "Perguntas",
  title = "Perguntas frequentes",
}: CaseFAQBlockProps) {
  return (
    <CaseSection id={id} className="py-24 sm:py-32">
      <CaseReveal className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
      </CaseReveal>

      <CaseReveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="overflow-hidden rounded-xl border border-white/[0.06] bg-surface/30 px-5"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CaseReveal>
    </CaseSection>
  );
}

interface CaseQuotesBlockProps {
  quotes: { quote: string; author: string; role?: string; context?: string }[];
  id?: string;
  eyebrow?: string;
  title?: string;
  hideHeader?: boolean;
  variant?: "default" | "featured";
}

export function CaseQuotesBlock({
  quotes,
  id,
  eyebrow = "Vozes",
  title = "Citações",
  hideHeader = false,
  variant = "default",
}: CaseQuotesBlockProps) {
  const isFeatured = variant === "featured";

  return (
    <CaseSection id={id} variant={isFeatured ? "default" : "elevated"} className="py-24 sm:py-32 lg:py-40">
      {!hideHeader && (
        <CaseReveal className="mx-auto max-w-2xl text-center">
          <CaseEyebrow>{eyebrow}</CaseEyebrow>
          <CaseHeading>{title}</CaseHeading>
        </CaseReveal>
      )}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className={hideHeader ? "space-y-8" : "mt-16 space-y-8"}
      >
        {quotes.map((item) => (
          <motion.blockquote
            key={`${item.author}-${item.quote.slice(0, 24)}`}
            variants={fadeUp}
            className={
              isFeatured
                ? "mx-auto max-w-5xl px-2 text-center sm:px-4"
                : "mx-auto max-w-3xl rounded-2xl border border-white/[0.06] bg-surface/30 px-8 py-10 text-center"
            }
          >
            <p
              className={
                isFeatured
                  ? "font-display text-[clamp(1.75rem,4.5vw,3.5rem)] font-medium leading-[1.15] tracking-[-0.02em] text-balance"
                  : "text-xl font-medium leading-relaxed sm:text-2xl"
              }
            >
              &ldquo;{item.quote}&rdquo;
            </p>
            <footer className={isFeatured ? "mt-10" : "mt-6"}>
              <cite
                className={
                  isFeatured
                    ? "not-italic text-[11px] font-normal uppercase tracking-[0.22em] text-muted-foreground/45"
                    : "not-italic font-semibold"
                }
              >
                {item.author}
              </cite>
              {item.role && (
                <span
                  className={
                    isFeatured
                      ? "mt-1 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground/35"
                      : "mt-1 block text-sm text-muted-foreground"
                  }
                >
                  {item.role}
                </span>
              )}
              {item.context && (
                <span
                  className={
                    isFeatured
                      ? "mt-2 block text-[10px] uppercase tracking-[0.18em] text-muted-foreground/35"
                      : "mt-2 block text-xs uppercase tracking-wider text-muted-foreground/60"
                  }
                >
                  {item.context}
                </span>
              )}
            </footer>
          </motion.blockquote>
        ))}
      </motion.div>
    </CaseSection>
  );
}

interface CaseGalleryBlockProps {
  eyebrow: string;
  title: string;
  items: CaseGalleryItem[];
  variant?: "default" | "elevated" | "dark";
  id?: string;
}

export function CaseGalleryBlock({
  eyebrow,
  title,
  items,
  variant = "default",
  id,
}: CaseGalleryBlockProps) {
  return (
    <CaseSection id={id} variant={variant} className="py-24 sm:py-32">
      <CaseReveal className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
      </CaseReveal>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item) => (
          <motion.figure
            key={item.src}
            variants={fadeUp}
            className="overflow-hidden rounded-2xl border border-white/[0.06]"
          >
            <CaseImage src={item.src} alt={item.alt} className="aspect-[4/3] w-full" />
            {item.caption && (
              <figcaption className="px-4 py-3 text-xs text-muted-foreground">{item.caption}</figcaption>
            )}
          </motion.figure>
        ))}
      </motion.div>
    </CaseSection>
  );
}

export function CaseTimelineBlock({
  eyebrow,
  title,
  events,
  id,
}: {
  eyebrow: string;
  title: string;
  events: { date?: string; phase?: string; title: string; description: string }[];
  id?: string;
}) {
  return (
    <CaseSection id={id} className="py-24 sm:py-32">
      <CaseReveal className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
      </CaseReveal>

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mx-auto mt-16 max-w-3xl space-y-0"
      >
        {events.map((event, index) => (
          <motion.li
            key={`${event.title}-${index}`}
            variants={fadeUp}
            className="relative flex gap-6 pb-12 last:pb-0"
          >
            {index < events.length - 1 && (
              <span
                className="absolute left-[1.125rem] top-10 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand/30 to-transparent"
                aria-hidden
              />
            )}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-[10px] font-bold text-brand">
              {event.phase ?? event.date ?? String(index + 1).padStart(2, "0")}
            </span>
            <div className="pt-0.5">
              <h3 className="text-lg font-semibold tracking-tight">{event.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {event.description}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </CaseSection>
  );
}

export function CaseChipListBlock({
  eyebrow,
  title,
  items,
  variant = "default",
  id,
}: {
  eyebrow: string;
  title: string;
  items: string[];
  variant?: "default" | "elevated" | "dark";
  id?: string;
}) {
  return (
    <CaseSection id={id} variant={variant} className="py-24 sm:py-32">
      <CaseReveal className="max-w-2xl">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
      </CaseReveal>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mt-10 flex flex-wrap gap-2"
      >
        {items.map((item) => (
          <motion.li
            key={item}
            variants={fadeUp}
            className="rounded-full border border-white/[0.08] bg-surface/40 px-4 py-2 text-sm text-muted-foreground"
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </CaseSection>
  );
}

export function CaseSplitBlock({
  eyebrow,
  title,
  children,
  variant = "default",
  id,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  variant?: "default" | "elevated" | "dark";
  id?: string;
}) {
  return (
    <CaseSection id={id} variant={variant} className="py-24 sm:py-32">
      <CaseReveal className="max-w-2xl">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
      </CaseReveal>
      <div className="mt-12">{children}</div>
    </CaseSection>
  );
}
