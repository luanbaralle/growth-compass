export function TechBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 radial-glow opacity-50" />
      <div className="absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
      <div className="absolute -left-24 bottom-1/4 h-48 w-48 rounded-full bg-segment/5 blur-3xl" />
    </div>
  );
}
