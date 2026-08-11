export type DashboardDatePreset = "today" | "yesterday" | "last7" | "thisMonth";

export type DashboardDateFilter =
  | { kind: "preset"; preset: DashboardDatePreset }
  | { kind: "day"; date: string }
  | { kind: "range"; start: string; end: string };

export const DASHBOARD_DATE_PRESET_OPTIONS: { value: DashboardDatePreset; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "yesterday", label: "Ontem" },
  { value: "last7", label: "Últimos 7 dias" },
  { value: "thisMonth", label: "Este mês" },
];

export const DEFAULT_DASHBOARD_DATE_FILTER: DashboardDateFilter = {
  kind: "preset",
  preset: "today",
};

/** YYYY-MM-DD in local timezone (avoids UTC off-by-one). */
export function toLocalDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseLocalDateStr(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getDashboardDateFilterBounds(filter: DashboardDateFilter): {
  start: string;
  end: string;
} {
  const today = toLocalDateStr(new Date());

  if (filter.kind === "day") {
    return { start: filter.date, end: filter.date };
  }

  if (filter.kind === "range") {
    return { start: filter.start, end: filter.end };
  }

  switch (filter.preset) {
    case "today":
      return { start: today, end: today };
    case "yesterday": {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const day = toLocalDateStr(d);
      return { start: day, end: day };
    }
    case "last7": {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return { start: toLocalDateStr(d), end: today };
    }
    case "thisMonth": {
      const now = new Date();
      return {
        start: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`,
        end: today,
      };
    }
  }
}

export function isDateInRange(iso: string, start: string, end: string): boolean {
  const day = iso.slice(0, 10);
  return day >= start && day <= end;
}

const dayFmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" });
const dayFmtWithYear = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const monthFmt = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const shortDayFmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" });

function formatDayLabel(dateStr: string, withYear = false): string {
  const date = parseLocalDateStr(dateStr);
  return withYear ? dayFmtWithYear.format(date) : dayFmt.format(date);
}

function isToday(dateStr: string): boolean {
  return dateStr === toLocalDateStr(new Date());
}

function isYesterday(dateStr: string): boolean {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateStr === toLocalDateStr(d);
}

export function formatDashboardDateFilterTrigger(filter: DashboardDateFilter): string {
  if (filter.kind === "day") {
    if (isToday(filter.date)) return `Hoje, ${dayFmt.format(new Date())}`;
    if (isYesterday(filter.date)) return `Ontem, ${formatDayLabel(filter.date)}`;
    return formatDayLabel(filter.date, true);
  }

  if (filter.kind === "range") {
    if (filter.start === filter.end) {
      return formatDashboardDateFilterTrigger({ kind: "day", date: filter.start });
    }
    const startYear = filter.start.slice(0, 4);
    const endYear = filter.end.slice(0, 4);
    const startLabel = shortDayFmt.format(parseLocalDateStr(filter.start));
    const endLabel =
      startYear === endYear
        ? shortDayFmt.format(parseLocalDateStr(filter.end))
        : shortDayFmt.format(parseLocalDateStr(filter.end)) + ` ${endYear}`;
    return `${startLabel} – ${endLabel}`;
  }

  const { start } = getDashboardDateFilterBounds(filter);
  switch (filter.preset) {
    case "today":
      return `Hoje, ${dayFmt.format(new Date())}`;
    case "yesterday":
      return `Ontem, ${formatDayLabel(start)}`;
    case "last7":
      return "Últimos 7 dias";
    case "thisMonth":
      return monthFmt.format(parseLocalDateStr(`${start}T12:00:00`));
  }
}

export function getDashboardHeroSubtitle(filter: DashboardDateFilter): string {
  if (filter.kind === "day") {
    if (isToday(filter.date)) return "Aqui está o resumo da sua operação hoje.";
    if (isYesterday(filter.date)) return "Aqui está o resumo da sua operação de ontem.";
    return `Aqui está o resumo da sua operação em ${formatDayLabel(filter.date, true)}.`;
  }

  if (filter.kind === "range") {
    if (filter.start === filter.end) {
      return getDashboardHeroSubtitle({ kind: "day", date: filter.start });
    }
    const startLabel = formatDayLabel(filter.start);
    const endLabel = formatDayLabel(filter.end, true);
    return `Aqui está o resumo da sua operação de ${startLabel} a ${endLabel}.`;
  }

  switch (filter.preset) {
    case "today":
      return "Aqui está o resumo da sua operação hoje.";
    case "yesterday":
      return "Aqui está o resumo da sua operação de ontem.";
    case "last7":
      return "Aqui está o resumo da sua operação nos últimos 7 dias.";
    case "thisMonth":
      return "Aqui está o resumo da sua operação neste mês.";
  }
}

export function getLeadsKpiCopy(filter: DashboardDateFilter): { label: string; sub: string } {
  if (filter.kind === "day") {
    if (isToday(filter.date)) return { label: "Leads hoje", sub: "Novas empresas hoje" };
    if (isYesterday(filter.date)) return { label: "Leads ontem", sub: "Novas empresas ontem" };
    return { label: "Leads no dia", sub: `Novas empresas em ${formatDayLabel(filter.date)}` };
  }

  if (filter.kind === "range") {
    if (filter.start === filter.end) {
      return getLeadsKpiCopy({ kind: "day", date: filter.start });
    }
    return { label: "Leads no período", sub: "Novas empresas no intervalo" };
  }

  switch (filter.preset) {
    case "today":
      return { label: "Leads hoje", sub: "Novas empresas hoje" };
    case "yesterday":
      return { label: "Leads ontem", sub: "Novas empresas ontem" };
    case "last7":
      return { label: "Leads (7 dias)", sub: "Novas empresas no período" };
    case "thisMonth":
      return { label: "Leads no mês", sub: "Novas empresas no mês" };
  }
}

export function dashboardDateFilterToApiParams(filter: DashboardDateFilter): {
  preset?: DashboardDatePreset;
  startDate?: string;
  endDate?: string;
} {
  if (filter.kind === "day") {
    return { startDate: filter.date, endDate: filter.date };
  }
  if (filter.kind === "range") {
    return { startDate: filter.start, endDate: filter.end };
  }
  return { preset: filter.preset };
}

export function isSameDashboardDateFilter(a: DashboardDateFilter, b: DashboardDateFilter): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "preset" && b.kind === "preset") return a.preset === b.preset;
  if (a.kind === "day" && b.kind === "day") return a.date === b.date;
  if (a.kind === "range" && b.kind === "range") return a.start === b.start && a.end === b.end;
  return false;
}

export function isPresetActive(
  filter: DashboardDateFilter,
  preset: DashboardDatePreset,
): boolean {
  return filter.kind === "preset" && filter.preset === preset;
}
