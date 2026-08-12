const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export function formatCompetencia(isoDate: string): string {
  const [year, month] = isoDate.split("-");
  const monthIndex = Number.parseInt(month, 10) - 1;
  if (!year || monthIndex < 0 || monthIndex > 11) return isoDate;
  return `${MONTHS_PT[monthIndex]}/${year}`;
}

export function addMonthsToIso(isoDate: string, monthsToAdd: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const target = new Date(year, month - 1 + monthsToAdd, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  const clampedDay = Math.min(day, lastDay);
  const resultMonth = target.getMonth() + 1;
  return `${target.getFullYear()}-${String(resultMonth).padStart(2, "0")}-${String(clampedDay).padStart(2, "0")}`;
}

export function buildRecurringDescription(baseDescription: string, dueDate: string): string {
  const competencia = formatCompetencia(dueDate);
  if (baseDescription.includes("{competencia}")) {
    return baseDescription.replaceAll("{competencia}", competencia);
  }
  return `${baseDescription} — competência ${competencia}`;
}

export function buildRecurringDueDates(firstDueDate: string, months: number): string[] {
  return Array.from({ length: months }, (_, index) => addMonthsToIso(firstDueDate, index));
}

export function formatCompetenciaRange(firstDueDate: string, months: number): string {
  if (months <= 1) return formatCompetencia(firstDueDate);
  const lastDueDate = addMonthsToIso(firstDueDate, months - 1);
  return `${formatCompetencia(firstDueDate)} a ${formatCompetencia(lastDueDate)}`;
}
