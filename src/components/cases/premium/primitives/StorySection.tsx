import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type StorySectionVariant =
  | "default"
  | "elevated"
  | "dark"
  | "fullscreen"
  | "breath"
  | "inset";

const variantStyles: Record<StorySectionVariant, string> = {
  default: "",
  elevated: "bg-surface/20",
  dark: "bg-surface/40",
  fullscreen: "",
  breath: "",
  inset: "bg-surface/10",
};

interface StorySectionProps {
  id: string;
  /** Número do storyboard para debug / QA */
  storyboardId?: string;
  variant?: StorySectionVariant;
  className?: string;
  containerClassName?: string;
  fullBleed?: boolean;
  children: ReactNode;
}

/**
 * Container estático de seção — Fase 1 (sem motion).
 * Base para composição fiel ao storyboard UNIP.
 */
export function StorySection({
  id,
  storyboardId,
  variant = "default",
  className,
  containerClassName,
  fullBleed = false,
  children,
}: StorySectionProps) {
  return (
    <section
      id={id}
      data-storyboard={storyboardId}
      className={cn("relative overflow-hidden", variantStyles[variant], className)}
    >
      <div
        className={cn(
          fullBleed ? "w-full" : "mx-auto max-w-7xl px-5 sm:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function StoryEyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.32em] text-brand/70",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function StoryHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "mt-5 font-display font-bold tracking-[-0.03em] text-balance",
        Tag === "h1"
          ? "text-4xl sm:text-5xl lg:text-6xl lg:leading-[1.02]"
          : "text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.06]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function StoryBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "mt-5 text-base leading-[1.75] text-muted-foreground sm:text-lg sm:leading-[1.8]",
        className,
      )}
    >
      {children}
    </p>
  );
}

interface StoryPlaceholderProps {
  label: string;
  aspectRatio?: string;
  className?: string;
  fullWidth?: boolean;
}

/** Placeholder de asset — Fase 1. Substituído na Fase 4. */
export function StoryPlaceholder({
  label,
  aspectRatio = "aspect-[16/10]",
  className,
  fullWidth = false,
}: StoryPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border border-dashed border-white/10 bg-surface/30",
        aspectRatio,
        fullWidth && "w-full",
        className,
      )}
      role="img"
      aria-label={label}
    >
      <span className="max-w-[80%] text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        TODO: {label}
      </span>
    </div>
  );
}

interface StoryDecisionShellProps {
  headline: string;
  body: string;
  caption?: string;
  className?: string;
}

/** Shell estrutural do bloco Decisão — Fase 2: CaseDecisionBlock */
export function StoryDecisionShell({
  headline,
  body,
  caption,
  className,
}: StoryDecisionShellProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-2xl rounded-2xl border border-brand/20 bg-surface/30 p-8 sm:p-10",
        className,
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">Decisão</p>
      <p className="mt-4 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
        {headline}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{body}</p>
      {caption && (
        <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground/70">{caption}</p>
      )}
    </div>
  );
}
