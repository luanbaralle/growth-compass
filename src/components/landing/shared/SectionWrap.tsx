export function SectionWrap({
  children,
  background,
  className = "",
  techGlow = false,
}: {
  children: React.ReactNode;
  /** Full-bleed layer behind content (grid, glow, etc.) */
  background?: React.ReactNode;
  className?: string;
  techGlow?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden border-t border-border/60 ${className}`}>
      {background}
      {techGlow && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
          aria-hidden
        />
      )}
      <div className="relative z-[2] mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">{children}</div>
    </section>
  );
}
