import type { CompanyStageCounts } from "@/domains/companies/types";
import { formatMoney as formatFinanceMoney } from "@/domains/finance/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Megaphone,
  Plus,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import {
  DASHBOARD_DATE_PRESET_OPTIONS,
  formatDashboardDateFilterTrigger,
  getDashboardHeroSubtitle,
  isPresetActive,
  parseLocalDateStr,
  toLocalDateStr,
  type DashboardDateFilter,
  type DashboardDatePreset,
} from "@/os/dashboard-date";
import type { OSDashboardNotification } from "@/os/dashboard-notifications";
import { OSNotificationsInbox } from "@/os/components/OSNotificationsInbox";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

/* ── Utilities ───────────────────────────────────────────── */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function DashboardDateFilter({
  value,
  onChange,
  disabled,
}: {
  value: DashboardDateFilter;
  onChange: (filter: DashboardDateFilter) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"single" | "range">("single");
  const [singleDay, setSingleDay] = useState<Date | undefined>(() =>
    value.kind === "day" ? parseLocalDateStr(value.date) : new Date(),
  );
  const [range, setRange] = useState<DateRange | undefined>(() => {
    if (value.kind === "range") {
      return {
        from: parseLocalDateStr(value.start),
        to: parseLocalDateStr(value.end),
      };
    }
    if (value.kind === "day") {
      const day = parseLocalDateStr(value.date);
      return { from: day, to: day };
    }
    return undefined;
  });

  const syncDraftFromValue = () => {
    if (value.kind === "day") {
      setMode("single");
      setSingleDay(parseLocalDateStr(value.date));
    } else if (value.kind === "range") {
      setMode("range");
      setRange({
        from: parseLocalDateStr(value.start),
        to: parseLocalDateStr(value.end),
      });
    } else {
      setMode("single");
      setSingleDay(new Date());
      setRange(undefined);
    }
  };

  const applyPreset = (preset: DashboardDatePreset) => {
    onChange({ kind: "preset", preset });
    setOpen(false);
  };

  const applyCustom = () => {
    if (mode === "single" && singleDay) {
      onChange({ kind: "day", date: toLocalDateStr(singleDay) });
      setOpen(false);
      return;
    }

    if (mode === "range" && range?.from && range?.to) {
      const start = toLocalDateStr(range.from);
      const end = toLocalDateStr(range.to);
      if (start === end) {
        onChange({ kind: "day", date: start });
      } else {
        onChange({ kind: "range", start, end });
      }
      setOpen(false);
    }
  };

  const canApplyCustom =
    mode === "single" ? Boolean(singleDay) : Boolean(range?.from && range?.to);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) syncDraftFromValue();
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="dashboard-control inline-flex h-10 items-center gap-2 self-start px-3.5 text-xs text-muted-foreground/75 transition-colors hover:text-foreground disabled:opacity-50 sm:self-end"
        >
          <Calendar className="h-3.5 w-3.5 opacity-50" />
          <span>{formatDashboardDateFilterTrigger(value)}</span>
          <ChevronDown className="h-3 w-3 opacity-40" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <div className="border-b border-border/40 p-3">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
            Atalhos
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DASHBOARD_DATE_PRESET_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => applyPreset(option.value)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  isPresetActive(value, option.value)
                    ? "border-brand/30 bg-brand/10 text-brand"
                    : "border-border/40 text-muted-foreground hover:border-border/70 hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-b border-border/40 p-3">
          <div className="mb-3 flex rounded-lg border border-border/40 p-0.5">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-xs transition-colors",
                mode === "single"
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Data específica
            </button>
            <button
              type="button"
              onClick={() => setMode("range")}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-xs transition-colors",
                mode === "range"
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Período
            </button>
          </div>

          {mode === "single" ? (
            <CalendarPicker
              mode="single"
              selected={singleDay}
              onSelect={setSingleDay}
              defaultMonth={singleDay}
              disabled={{ after: new Date() }}
            />
          ) : (
            <CalendarPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              defaultMonth={range?.from ?? new Date()}
              disabled={{ after: new Date() }}
              numberOfMonths={1}
            />
          )}
        </div>

        <div className="flex justify-end p-3">
          <button
            type="button"
            disabled={!canApplyCustom}
            onClick={applyCustom}
            className="dashboard-btn-primary h-8 px-3 text-xs disabled:opacity-40"
          >
            Aplicar
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function formatRelativeMinutes(date: Date): string {
  const diff = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000));
  if (diff < 1) return "agora";
  if (diff === 1) return "há 1 minuto";
  if (diff < 60) return `há ${diff} minutos`;
  const hours = Math.floor(diff / 60);
  if (hours === 1) return "há 1 hora";
  return `há ${hours} horas`;
}

/* ── Top bar ─────────────────────────────────────────────── */

export function DashboardTopBar({
  activePerson,
  supabaseConnected,
  notifications = [],
  notificationsLoading = false,
  onNotificationMarkRead,
}: {
  activePerson: TeamMember | null;
  supabaseConnected: boolean;
  notifications?: OSDashboardNotification[];
  notificationsLoading?: boolean;
  onNotificationMarkRead?: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md lg:flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
        <input
          type="search"
          placeholder="Buscar no sistema..."
          className="dashboard-control h-10 w-full pl-11 pr-14 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-brand/20 focus:ring-1 focus:ring-brand/10"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border/30 bg-surface-elevated/40 px-1.5 py-0.5 text-[10px] text-muted-foreground/60 md:inline">
          ⌘ K
        </kbd>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div
          className={cn(
            "dashboard-control inline-flex h-10 items-center gap-2 px-3.5 text-xs font-medium",
            supabaseConnected ? "text-emerald-300/90" : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              supabaseConnected
                ? "animate-pulse-dot bg-emerald-400 shadow-[0_0_8px_oklch(0.72_0.17_155/0.55)]"
                : "bg-muted-foreground/40",
            )}
          />
          {supabaseConnected ? "Banco conectado" : "Banco offline"}
        </div>

        <OSNotificationsInbox
          notifications={notifications}
          loading={notificationsLoading}
          onMarkRead={
            onNotificationMarkRead
              ? (id) => onNotificationMarkRead(id)
              : undefined
          }
        />

        {activePerson && (
          <div className="dashboard-control flex h-10 items-center gap-2.5 px-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/12 text-xs font-bold text-brand">
              {TEAM_LABELS[activePerson].charAt(0)}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-xs font-semibold leading-none">{TEAM_LABELS[activePerson]}</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/65">Administrador</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Hero (open — no card) ───────────────────────────────── */

export function DashboardHero({
  userName,
  dateFilter,
  onDateFilterChange,
  dateFilterDisabled,
}: {
  userName: string;
  dateFilter: DashboardDateFilter;
  onDateFilterChange: (filter: DashboardDateFilter) => void;
  dateFilterDisabled?: boolean;
}) {
  return (
    <section className="animate-fade-up pt-2 pb-2">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[1.75rem] font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {getGreeting()}, {userName}! <span aria-hidden>👋</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground/70">
            {getDashboardHeroSubtitle(dateFilter)}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link to="/os/prospeccao" className="dashboard-btn-primary">
              <Plus className="h-4 w-4" />
              Novo lead
            </Link>
            <Link to="/os/empresas" className="dashboard-btn-ghost">
              <Plus className="h-4 w-4" />
              Nova empresa
            </Link>
            <Link to="/os/projetos" className="dashboard-btn-ghost">
              <Plus className="h-4 w-4" />
              Novo projeto
            </Link>
          </div>
          <DashboardDateFilter
            value={dateFilter}
            onChange={onDateFilterChange}
            disabled={dateFilterDisabled}
          />
        </div>
      </div>
    </section>
  );
}

/* ── KPI cards ───────────────────────────────────────────── */

type AccentTone = "brand" | "success" | "warning" | "gold" | "danger" | "info" | "purple";
type SubTone = "muted" | "success" | "brand" | "warning";

const accentMap: Record<
  AccentTone,
  { iconBg: string; iconText: string; bar: string }
> = {
  brand: {
    iconBg: "bg-brand/15",
    iconText: "text-brand",
    bar: "bg-brand",
  },
  success: {
    iconBg: "bg-emerald-400/15",
    iconText: "text-emerald-400",
    bar: "bg-emerald-400",
  },
  warning: {
    iconBg: "bg-amber-400/15",
    iconText: "text-amber-400",
    bar: "bg-amber-400",
  },
  gold: {
    iconBg: "bg-yellow-400/14",
    iconText: "text-yellow-400",
    bar: "bg-yellow-400",
  },
  danger: {
    iconBg: "bg-red-400/15",
    iconText: "text-red-400",
    bar: "bg-red-400",
  },
  info: {
    iconBg: "bg-sky-400/15",
    iconText: "text-sky-400",
    bar: "bg-sky-400",
  },
  purple: {
    iconBg: "bg-violet-400/15",
    iconText: "text-violet-400",
    bar: "bg-violet-400",
  },
};

const subToneClass: Record<SubTone, string> = {
  muted: "text-muted-foreground/55",
  success: "text-emerald-400/85",
  brand: "text-brand/85",
  warning: "text-amber-400/85",
};

export function DashboardKpiGrid({
  children,
  columns = 4,
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}) {
  const columnClass =
    columns === 2
      ? "lg:grid-cols-2"
      : columns === 3
        ? "lg:grid-cols-3"
        : columns === 5
          ? "lg:grid-cols-5"
          : "lg:grid-cols-4";

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", columnClass, className)}>{children}</div>
  );
}

export function DashboardKpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "brand",
  subTone = "muted",
  size = "lg",
  trend,
  trailing,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: AccentTone;
  subTone?: SubTone;
  size?: "lg" | "sm";
  trend?: "up" | "down" | "neutral";
  trailing?: React.ReactNode;
}) {
  const colors = accentMap[accent];
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  const isPrimary = size === "lg";

  if (isPrimary) {
    return (
      <div className="dashboard-kpi-primary group">
        <div className={cn("absolute inset-x-0 top-0 h-[2px] rounded-t-[inherit]", colors.bar)} />

        <div className="relative flex h-full flex-col pt-0.5">
          <div className="flex items-start gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                colors.iconBg,
                colors.iconText,
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </div>
            <p className="min-w-0 flex-1 text-[11px] font-medium uppercase leading-snug tracking-[0.04em] text-muted-foreground/50">
              {label}
            </p>
          </div>

          <p className="dashboard-kpi-value mt-5">{value}</p>

          {sub && (
            <p
              className={cn(
                "mt-2 flex items-center gap-1 text-[11px] leading-snug",
                trend === "up" && "text-emerald-400",
                trend === "down" && "text-red-400",
                !trend && subToneClass[subTone],
              )}
            >
              {TrendIcon && <TrendIcon className="h-3 w-3 shrink-0" strokeWidth={2.5} />}
              {sub}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-kpi-secondary group">
      <div className={cn("absolute inset-x-0 top-0 h-[2px] rounded-t-[inherit]", colors.bar)} />

      <div className="relative flex h-full flex-col pt-0.5">
        <div className="flex items-start gap-2">
          <div
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
              colors.iconBg,
              colors.iconText,
            )}
          >
            <Icon className="h-3 w-3" strokeWidth={1.75} />
          </div>
          <p className="min-w-0 flex-1 text-[10px] font-medium uppercase leading-snug tracking-[0.04em] text-muted-foreground/45">
            {label}
          </p>
        </div>

        <p className="dashboard-kpi-value-secondary mt-3">{value}</p>

        {(sub || trailing) && (
          <div className="mt-1.5 flex items-start justify-between gap-2">
            {sub && (
              <p
                className={cn(
                  "min-w-0 flex-1 text-[10px] leading-snug",
                  trend === "up" && "text-emerald-400",
                  trend === "down" && "text-red-400",
                  !trend && subToneClass[subTone],
                )}
              >
                {TrendIcon && <TrendIcon className="mr-1 inline h-3 w-3 shrink-0" />}
                {sub}
              </p>
            )}
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Pipeline stepper ────────────────────────────────────── */

const PIPELINE_STAGES: Array<{
  key: keyof CompanyStageCounts;
  label: string;
  color: string;
}> = [
  { key: "lead", label: "Lead", color: "bg-brand" },
  { key: "contato", label: "Contato", color: "bg-amber-400" },
  { key: "proposta", label: "Proposta", color: "bg-lime-400" },
  { key: "negociacao", label: "Negociação", color: "bg-sky-400" },
  { key: "ativo", label: "Cliente ativo", color: "bg-emerald-400" },
];

export function DashboardPipeline({ pipeline }: { pipeline: CompanyStageCounts }) {
  const maxCount = Math.max(...PIPELINE_STAGES.map((s) => pipeline[s.key] ?? 0), 1);

  return (
    <section className="dashboard-card p-6 sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="dashboard-section-title">Pipeline comercial</h2>
          <p className="mt-1 text-xs text-muted-foreground/65">Empresas por estágio</p>
        </div>
        <Link to="/os/empresas" className="dashboard-link shrink-0">
          Ver pipeline completo →
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {PIPELINE_STAGES.map((stage, index) => {
          const count = pipeline[stage.key] ?? 0;
          const barWidth = Math.max((count / maxCount) * 100, count > 0 ? 100 : 8);

          return (
            <div key={stage.key} className="flex flex-1 items-start gap-1 sm:gap-0">
              <Link
                to="/os/empresas"
                className="group flex flex-1 flex-col items-center px-1 text-center transition-opacity hover:opacity-90"
              >
                <span className="text-[11px] font-medium text-muted-foreground/70 group-hover:text-muted-foreground">
                  {stage.label}
                </span>
                <span className="mt-1 font-display text-2xl font-bold tracking-tight">{count}</span>
                <div className="mt-3 h-[3px] w-full max-w-[80px] overflow-hidden rounded-full bg-surface-elevated/80">
                  <div
                    className={cn("h-full rounded-full transition-all", stage.color)}
                    style={{ width: `${barWidth}%`, opacity: count > 0 ? 1 : 0.2 }}
                  />
                </div>
              </Link>
              {index < PIPELINE_STAGES.length - 1 && (
                <ChevronRight className="mx-0.5 mt-6 hidden h-4 w-4 shrink-0 text-muted-foreground/25 sm:block" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Panel cards ─────────────────────────────────────────── */

export function DashboardPanel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("dashboard-card flex min-h-[260px] flex-col p-6 sm:p-7", className)}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="dashboard-section-title">{title}</h2>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground/65">{description}</p>
          )}
        </div>
        {action && (
          <Link to={action.href} className="dashboard-link shrink-0">
            {action.label}
          </Link>
        )}
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </section>
  );
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-brand/15 bg-brand/[0.04] text-brand/45">
        <Icon className="h-9 w-9" strokeWidth={1.25} />
      </div>
      <p className="max-w-[15rem] text-sm font-medium leading-snug text-foreground/85">{title}</p>
      <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-muted-foreground/60">
        {description}
      </p>
    </div>
  );
}

export function DashboardSuccessState({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400">
        <CheckCircle2 className="h-9 w-9" strokeWidth={1.5} />
      </div>
      <p className="text-base font-semibold text-foreground/90">{title}</p>
      {subtitle && (
        <p className="mt-1.5 text-xs text-muted-foreground/60">{subtitle}</p>
      )}
    </div>
  );
}

/* ── Finance highlight ───────────────────────────────────── */

export function DashboardFinanceHighlight({
  label,
  value,
  sub,
  icon: Icon,
  href,
  actionLabel,
  accent = "brand",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  href: string;
  actionLabel: string;
  accent?: AccentTone;
}) {
  const colors = accentMap[accent];

  return (
    <Link
      to={href}
      className="dashboard-card dashboard-card-interactive group relative flex min-h-[168px] flex-col overflow-hidden p-6 sm:p-7"
    >
      <div className={cn("absolute inset-x-0 top-0 h-[2px]", colors.bar)} />
      <p className="dashboard-label">{label}</p>
      <p className="dashboard-value-lg mt-4">{value}</p>
      {sub && <p className="mt-2 text-xs text-muted-foreground/70">{sub}</p>}
      <p className="dashboard-link mt-auto pt-6">{actionLabel} →</p>
      <Icon
        className="pointer-events-none absolute -bottom-3 -right-3 h-[88px] w-[88px] text-foreground/[0.03]"
        strokeWidth={0.75}
      />
    </Link>
  );
}

/* ── Marketing chart ─────────────────────────────────────── */

export function DashboardMarketingChart({ hasData }: { hasData: boolean }) {
  return (
    <Link
      to="/os/marketing"
      className="dashboard-card dashboard-card-interactive group relative flex min-h-[180px] flex-col overflow-hidden p-6 sm:p-7"
    >
      <p className="dashboard-label">Marketing</p>
      <p className="mt-1 text-xs text-muted-foreground/60">Últimos 30 dias</p>
      {!hasData && (
        <p className="mt-4 text-xs text-muted-foreground/60">Sem métricas suficientes</p>
      )}
      <p className="dashboard-link relative z-10 mt-auto pt-6">Ver marketing →</p>
      <svg
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[72px] w-full opacity-45"
      >
        <defs>
          <linearGradient id="marketing-wave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.19 48)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.72 0.19 48)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,55 C60,15 120,75 180,35 C240,5 300,65 360,25 C380,15 395,40 400,30 L400,80 L0,80 Z"
          fill="url(#marketing-wave)"
        />
        <path
          d="M0,55 C60,15 120,75 180,35 C240,5 300,65 360,25 C380,15 395,40 400,30"
          fill="none"
          stroke="oklch(0.72 0.19 48)"
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
    </Link>
  );
}

/* ── Quick access ──────────────────────────────────────────── */

export function DashboardQuickAccess({
  items,
}: {
  items: Array<{
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    accent?: AccentTone;
  }>;
}) {
  return (
    <section>
      <h2 className="dashboard-label mb-4">Acesso rápido</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const colors = accentMap[item.accent ?? "brand"];
          return (
            <Link
              key={item.title}
              to={item.href}
              className="dashboard-card dashboard-card-interactive group flex items-center gap-3.5 p-4 sm:p-5"
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  colors.iconBg,
                  colors.iconText,
                )}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground/90">{item.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground/60">{item.description}</p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/25 bg-surface-elevated/20 text-muted-foreground/35 transition-all duration-200 group-hover:border-brand/20 group-hover:text-brand">
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}

        <Link
          to="/os/prospeccao"
          className="dashboard-card dashboard-card-interactive group flex items-center gap-3.5 border-dashed border-border/15 p-4 sm:p-5 hover:border-brand/20 hover:bg-brand/[0.02]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dashed border-brand/25 bg-brand/[0.04] text-brand/70">
            <Plus className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground/90">Criar novo</p>
            <p className="mt-0.5 text-xs text-muted-foreground/60">Lead, empresa ou projeto</p>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-dashed border-brand/20 text-brand/50 group-hover:border-brand/30 group-hover:text-brand">
            <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      </div>
    </section>
  );
}

/* ── Re-export ───────────────────────────────────────────── */

export {
  Building2,
  FolderKanban,
  Megaphone,
  Target,
  UserPlus,
  Users,
  Wallet,
  formatRelativeMinutes,
  formatFinanceMoney,
};
