import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewportOnce } from "./motion";

interface CaseRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function CaseReveal({ children, className, delay = 0, ...props }: CaseRevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: fadeUp.hidden,
        visible: {
          ...fadeUp.visible,
          transition: {
            ...(typeof fadeUp.visible === "object" && "transition" in fadeUp.visible
              ? fadeUp.visible.transition
              : {}),
            delay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface CaseSectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  variant?: "default" | "elevated" | "dark" | "full-bleed";
}

const variantStyles = {
  default: "",
  elevated: "bg-surface/20",
  dark: "bg-surface/40",
  "full-bleed": "",
};

export function CaseSection({
  children,
  className,
  containerClassName,
  id,
  variant = "default",
}: CaseSectionProps) {
  return (
    <section
      id={id}
      className={cn("relative overflow-hidden", variantStyles[variant], className)}
    >
      <div className={cn("mx-auto max-w-7xl px-5 sm:px-8", containerClassName)}>{children}</div>
    </section>
  );
}

export function CaseEyebrow({ children, className }: { children: ReactNode; className?: string }) {
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

export function CaseHeading({
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
        "mt-5 font-display text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.06]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CaseBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "mt-5 max-w-2xl text-base leading-[1.75] text-muted-foreground sm:text-lg sm:leading-[1.8]",
        className,
      )}
    >
      {children}
    </p>
  );
}
