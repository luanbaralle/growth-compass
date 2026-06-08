export function SectionWrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative border-t border-border/60 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">{children}</div>
    </section>
  );
}
