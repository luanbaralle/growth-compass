export function ClientPageSkeleton() {
  return (
    <div className="client-page space-y-6" aria-hidden>
      <div className="space-y-3">
        <div className="client-skeleton h-3 w-28" />
        <div className="client-skeleton h-9 w-2/3 max-w-md" />
        <div className="client-skeleton h-4 w-full max-w-lg" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="client-skeleton client-skeleton-kpi" />
        ))}
      </div>
      <div className="client-skeleton h-40 w-full rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="client-skeleton h-52 w-full rounded-2xl" />
        <div className="client-skeleton h-52 w-full rounded-2xl" />
      </div>
    </div>
  );
}
