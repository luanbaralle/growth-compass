import { cn } from "@/lib/utils";

export interface CasePremiumEmptyStateProps {
  componentName: string;
  message?: string;
  className?: string;
}

/**
 * Development-time empty state for premium case components.
 * Surfaces missing required props instead of rendering broken layouts.
 */
export function CasePremiumEmptyState({
  componentName,
  message = "Conteúdo obrigatório ausente.",
  className,
}: CasePremiumEmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-surface/20 px-6 py-10 text-center",
        className,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-brand/70">
        {componentName}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
