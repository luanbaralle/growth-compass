import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionShellProps {
  id?: string;
  className?: string;
  children: ReactNode;
  containerClassName?: string;
}

export function SectionShell({
  id,
  className,
  containerClassName,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={cn("relative", className)}>
      <div className={cn("mx-auto max-w-7xl px-5 sm:px-8", containerClassName)}>{children}</div>
    </section>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/80">{children}</p>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function SectionDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg", className)}>
      {children}
    </p>
  );
}
