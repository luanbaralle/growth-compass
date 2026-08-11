import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Loader2, Plus, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

/* ── Page shell ──────────────────────────────────────────── */

export function OSPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("os-page space-y-8 pb-2", className)}>{children}</div>;
}

/* ── Page layout ─────────────────────────────────────────── */

export function PageHeader({
  title,
  description,
  icon: _Icon,
  actions,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 animate-fade-up">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground/65">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
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
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <section className={cn("dashboard-card", !noPadding && "p-6 sm:p-7", className)}>
      {(title || action) && (
        <div
          className={cn(
            "mb-5 flex items-start justify-between gap-3",
            noPadding && "px-6 pt-6 sm:px-7 sm:pt-7",
          )}
        >
          <div>
            {title && <h2 className="dashboard-section-title">{title}</h2>}
            {description && (
              <p className="dashboard-sub mt-1.5">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/* ── Actions ─────────────────────────────────────────────── */

export function OSRefreshButton({
  loading,
  onClick,
}: {
  loading?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="dashboard-control inline-flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
      aria-label="Atualizar"
    >
      <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
    </button>
  );
}

export function OSPrimaryButton({
  onClick,
  label,
  icon: Icon = Plus,
  type = "button",
}: {
  onClick?: () => void;
  label: string;
  icon?: LucideIcon;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} className="dashboard-btn-primary">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export function OSGhostButton({
  onClick,
  label,
  icon: Icon = Plus,
}: {
  onClick?: () => void;
  label: string;
  icon?: LucideIcon;
}) {
  return (
    <button type="button" onClick={onClick} className="dashboard-btn-ghost">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ── Filters ─────────────────────────────────────────────── */

export function FilterToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-card flex flex-col gap-4 p-4 sm:flex-row sm:flex-wrap sm:items-center">
      {children}
    </div>
  );
}

export function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
        active
          ? "border-brand/30 bg-brand/10 text-brand"
          : "border-border/40 text-muted-foreground/70 hover:border-border/60 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

/* ── Data table ──────────────────────────────────────────── */

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="os-table-wrap overflow-x-auto rounded-xl border border-border/40">
      {children}
    </div>
  );
}

/* ── Metrics ─────────────────────────────────────────────── */

type Accent = "brand" | "danger" | "success" | "warning" | "neutral" | "info" | "purple" | "gold";

const accentMap: Record<Accent, { iconBg: string; iconText: string; bar: string }> = {
  brand: { iconBg: "bg-brand/15", iconText: "text-brand", bar: "bg-brand" },
  success: { iconBg: "bg-emerald-400/15", iconText: "text-emerald-400", bar: "bg-emerald-400" },
  warning: { iconBg: "bg-amber-400/15", iconText: "text-amber-400", bar: "bg-amber-400" },
  gold: { iconBg: "bg-yellow-400/14", iconText: "text-yellow-400", bar: "bg-yellow-400" },
  danger: { iconBg: "bg-red-400/15", iconText: "text-red-400", bar: "bg-red-400" },
  info: { iconBg: "bg-sky-400/15", iconText: "text-sky-400", bar: "bg-sky-400" },
  purple: { iconBg: "bg-violet-400/15", iconText: "text-violet-400", bar: "bg-violet-400" },
  neutral: { iconBg: "bg-surface-elevated/80", iconText: "text-muted-foreground", bar: "bg-border" },
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
  const colors = accentMap[accent];

  return (
    <div className="dashboard-kpi-secondary group">
      <div className={cn("absolute inset-x-0 top-0 h-[2px] rounded-t-[inherit]", colors.bar)} />
      <div className="relative flex h-full flex-col pt-0.5">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                colors.iconBg,
                colors.iconText,
              )}
            >
              <Icon className="h-3 w-3" strokeWidth={1.75} />
            </div>
          )}
          <p className="truncate text-[10px] font-medium uppercase tracking-[0.04em] text-muted-foreground/45">
            {label}
          </p>
        </div>
        <p className="dashboard-kpi-value-secondary mt-3">{value}</p>
        {sub && <p className="mt-1.5 text-[10px] leading-none text-muted-foreground/55">{sub}</p>}
      </div>
    </div>
  );
}

export function PriorityBanner({ label, text }: { label: string; text: string }) {
  return (
    <div className="dashboard-card relative overflow-hidden p-5 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-brand" />
      <p className="dashboard-label text-brand/90">{label}</p>
      <p className="mt-2 text-sm font-medium leading-relaxed text-foreground/90">{text}</p>
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
  children?: ReactNode;
}) {
  return (
    <Link
      to={href}
      className="dashboard-card dashboard-card-interactive flex flex-col gap-3 p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/12 text-brand">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground/90">{title}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground/60">{description}</p>
          )}
        </div>
      </div>
      {children}
    </Link>
  );
}

export function QuickLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <span className="dashboard-link inline-flex items-center gap-1">
      {label}
      <ArrowRight className="h-3 w-3" />
    </span>
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
    <div className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand/10 bg-brand/[0.04] text-brand/45">
          <Icon className="h-8 w-8" strokeWidth={1.25} />
        </div>
      )}
      <p className="text-sm font-medium text-foreground/90">{title}</p>
      {description && (
        <p className="dashboard-sub mt-2 max-w-sm leading-relaxed">{description}</p>
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
    critical: { label: "Crítico", className: "text-red-400 border-red-400/25 bg-red-400/10" },
    high: { label: "Alto", className: "text-amber-400 border-amber-400/25 bg-amber-400/10" },
    medium: { label: "Médio", className: "text-emerald-400 border-emerald-400/25 bg-emerald-400/10" },
  }[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
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
  const bar = variant === "danger" ? "bg-red-400" : "bg-amber-400";
  return (
    <div className="dashboard-card relative overflow-hidden p-5">
      <div className={cn("absolute inset-x-0 top-0 h-[2px]", bar)} />
      <p className="text-sm font-medium text-foreground/90">{title}</p>
      {description && <p className="dashboard-sub mt-1.5">{description}</p>}
    </div>
  );
}

/* ── List item ─────────────────────────────────────────────── */

export function ListItem({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border border-border/30 bg-surface/20 p-3 text-left transition-all duration-200",
        onClick && "cursor-pointer hover:border-border/50 hover:bg-surface-elevated/30",
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
    <OSPage>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-bold">{title}</h1>
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>
      {metricCount > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: metricCount }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      )}
      <Skeleton className="h-16 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </OSPage>
  );
}

export function OSLoadingInline() {
  return (
    <div className="flex items-center justify-center py-12 text-muted-foreground/60">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}
