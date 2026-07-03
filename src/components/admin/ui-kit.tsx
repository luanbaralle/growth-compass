import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/* ── Page layout ─────────────────────────────────────────── */

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 animate-fade-up">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand-soft">
              <Icon className="h-4 w-4 text-brand" />
            </div>
          )}
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        </div>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Section({
  title,
  description,
  action,
  children,
  className,
  noPadding,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <section className={cn("admin-card", !noPadding && "p-5 sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="font-display text-base font-semibold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* ── Metrics ─────────────────────────────────────────────── */

type Accent = "brand" | "danger" | "success" | "warning" | "neutral";

const accentStyles: Record<Accent, { card: string; icon: string }> = {
  brand: {
    card: "border-brand/25 bg-brand-soft/60",
    icon: "text-brand bg-brand/15",
  },
  danger: {
    card: "border-red-400/25 bg-red-400/[0.06]",
    icon: "text-red-400 bg-red-400/15",
  },
  success: {
    card: "border-emerald-400/25 bg-emerald-400/[0.06]",
    icon: "text-emerald-400 bg-emerald-400/15",
  },
  warning: {
    card: "border-amber-400/25 bg-amber-400/[0.06]",
    icon: "text-amber-400 bg-amber-400/15",
  },
  neutral: {
    card: "border-border/80 bg-surface-elevated/40",
    icon: "text-muted-foreground bg-surface-elevated",
  },
};

export function StatCard({
  label,
  value,
  sub,
  accent = "brand",
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: Accent;
  icon?: LucideIcon;
}) {
  const styles = accentStyles[accent];
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 transition-colors hover:border-border",
        styles.card,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {Icon && (
          <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", styles.icon)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function PriorityBanner({ label, text }: { label: string; text: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-brand/25 bg-brand-soft/50 p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">{label}</p>
      <p className="mt-2 text-sm font-medium leading-relaxed sm:text-base">{text}</p>
    </div>
  );
}

/* ── Quick link card ───────────────────────────────────────── */

export function QuickLinkCard({
  title,
  description,
  href,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  children?: React.ReactNode;
}) {
  return (
    <div className="admin-card flex flex-col p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/15">
          <Icon className="h-3.5 w-3.5 text-brand" />
        </div>
        {title}
      </div>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}

export function QuickLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      to={href}
      className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-elevated/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-brand/30 hover:bg-brand-soft/40 hover:text-brand"
    >
      {label}
      <ArrowRight className="h-3 w-3" />
    </Link>
  );
}

/* ── Empty state ───────────────────────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 bg-surface-elevated/20 px-6 py-10 text-center">
      {Icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/* ── Severity ──────────────────────────────────────────────── */

export function SeverityBadge({
  severity,
}: {
  severity: "critical" | "high" | "medium";
}) {
  const config = {
    critical: { label: "Crítico", className: "text-red-400 border-red-400/30 bg-red-400/10" },
    high: { label: "Alto", className: "text-amber-400 border-amber-400/30 bg-amber-400/10" },
    medium: { label: "Médio", className: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" },
  }[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

/* ── Alert banner ──────────────────────────────────────────── */

export function AlertBanner({
  variant = "warning",
  title,
  description,
}: {
  variant?: "warning" | "danger";
  title: string;
  description?: string;
}) {
  const styles = {
    warning: "border-amber-400/30 bg-amber-400/[0.06] text-amber-200",
    danger: "border-red-400/30 bg-red-400/[0.06] text-red-200",
  };
  return (
    <div className={cn("rounded-xl border p-4", styles[variant])}>
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/* ── List item ─────────────────────────────────────────────── */

export function ListItem({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border border-border/50 bg-background/30 p-3 text-left transition-colors",
        onClick && "cursor-pointer hover:border-border hover:bg-surface-elevated/50",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/* ── Page skeleton ─────────────────────────────────────────── */

export function PageSkeleton({ title, metricCount = 4 }: { title: string; metricCount?: number }) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: metricCount }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-20 rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}
