export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand">
      <span className="h-px w-6 bg-brand" />
      {children}
    </div>
  );
}
