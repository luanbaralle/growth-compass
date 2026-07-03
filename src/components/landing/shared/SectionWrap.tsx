export function SectionWrap({
  children,
  className = "",
  techGlow = false,
}: {
  children: React.ReactNode;
  className?: string;
  techGlow?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden border-t border-border/60 ${className}`}>
      {techGlow && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
          aria-hidden
        />
      )}
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">{children}</div>
    </section>
  );
}
