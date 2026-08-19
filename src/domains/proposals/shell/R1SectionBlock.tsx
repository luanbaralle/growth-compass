import { r1LabelClass, r1ScrollAnchor, r1Shell, r1SectionPy } from "./r1-tokens";
import { R1CheckList } from "./R1Lists";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function R1SectionBlock({
  id,
  number,
  title,
  narrative,
  bullets,
  children,
  wide,
  tone = "default",
}: {
  id: string;
  number: string;
  title: string;
  narrative: string;
  bullets: string[];
  children?: ReactNode;
  wide?: boolean;
  tone?: "default" | "elevated" | "muted";
}) {
  return (
    <section
      id={id}
      className={cn(
        wide ? "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" : r1Shell,
        r1ScrollAnchor,
        r1SectionPy,
        tone === "elevated" && "border-y border-white/[0.06] bg-white/[0.015]",
        tone === "muted" && "bg-black/20",
      )}
    >
      <p className={r1LabelClass}>
        {number} — {title}
      </p>
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/70 sm:text-base">{narrative}</p>
      {bullets.length > 0 && (
        <div className={cn("mt-6 rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 sm:p-6", !children && "max-w-3xl")}>
          <R1CheckList items={bullets} />
        </div>
      )}
      {children}
    </section>
  );
}

export function R1CtaBand({
  href,
  label,
  className,
}: {
  href: string | null;
  label: string;
  className?: string;
}) {
  if (!href) return null;
  return (
    <div className={cn("mt-8", className)}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-[13px] font-medium text-black transition-opacity hover:opacity-90 sm:w-auto sm:justify-start sm:py-2.5"
      >
        {label}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
