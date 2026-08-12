const COMPANY_CODE_STOP_WORDS = new Set([
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "em",
  "para",
  "com",
  "por",
  "a",
  "o",
  "as",
  "os",
]);

export function formatReceiptDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function deriveCompanyCode(name: string): string {
  const words = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[\s\-_/]+/)
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, ""))
    .filter((word) => word.length > 0 && !COMPANY_CODE_STOP_WORDS.has(word.toLowerCase()));

  if (words.length === 0) return "CL";

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

  return words
    .slice(0, 4)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function buildReceiptNumber(
  prefix: string,
  year: number,
  companyCode: string,
  sequence: number,
): string {
  const safePrefix = prefix.trim() || "R1";
  const safeCode = companyCode.trim().toUpperCase() || "CL";
  return `${safePrefix}-${year}-${safeCode}-${String(sequence).padStart(3, "0")}`;
}

export function buildReceiptFileName(receiptNumber: string, description: string): string {
  const safeDescription = description
    .replace(/[<>:"/\\|?*]/g, "")
    .trim()
    .slice(0, 80);
  return `${receiptNumber} - Recibo - ${safeDescription || "Serviços"}.pdf`;
}

export function formatCnpj(value: string | null | undefined): string {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 14) return value;
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

export function formatCpf(value: string | null | undefined): string {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return value;
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}
