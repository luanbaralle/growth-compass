export type FinanceEntryType = "monthly" | "setup" | "other";

export type FinanceEntryStatus = "paid" | "pending" | "overdue" | "cancelled";

export interface FinanceEntry {
  id: string;
  company_id: string;
  type: FinanceEntryType;
  description: string;
  amount_cents: number;
  due_date: string;
  paid_at: string | null;
  payment_method: string | null;
  status: FinanceEntryStatus;
  created_at: string;
  updated_at: string;
}

export interface FinanceEntryWithCompany extends FinanceEntry {
  companies: { name: string } | null;
}

export interface FinanceListFilters {
  search?: string;
  status?: FinanceEntryStatus | "all";
  type?: FinanceEntryType | "all";
  companyId?: string;
  sort?: "due_date" | "created_at" | "amount_cents";
  order?: "asc" | "desc";
}

export interface FinanceStatusCounts {
  all: number;
  paid: number;
  pending: number;
  overdue: number;
  cancelled: number;
}

export interface FinanceSummary {
  /** Pendentes com vencimento no mês corrente */
  dueThisMonthCents: number;
  overdueCents: number;
  /** Caixa operacional: vence este mês + atrasados */
  receivableCents: number;
  paidThisMonthCents: number;
  /** Receita recorrente mensal (clientes ativos) */
  mrrCents: number;
  mrrClientCount: number;
  /** Pendentes com vencimento em meses futuros */
  futurePendingCents: number;
}

export const FINANCE_TYPES: FinanceEntryType[] = ["monthly", "setup", "other"];

export const FINANCE_STATUSES: FinanceEntryStatus[] = [
  "paid",
  "pending",
  "overdue",
  "cancelled",
];

export const TYPE_LABELS: Record<FinanceEntryType, string> = {
  monthly: "Mensalidade",
  setup: "Setup",
  other: "Outro",
};

export const STATUS_LABELS: Record<FinanceEntryStatus, string> = {
  paid: "Pago",
  pending: "Pendente",
  overdue: "Atrasado",
  cancelled: "Cancelado",
};

export const PAYMENT_METHODS = [
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
  { value: "transferencia", label: "Transferência" },
  { value: "cartao", label: "Cartão" },
  { value: "outro", label: "Outro" },
] as const;

export function formatMoney(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function parseMoneyToCents(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;
  const amount = Number.parseFloat(normalized.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100);
}

export function centsToFormAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function effectiveFinanceStatus(entry: FinanceEntry): FinanceEntryStatus {
  if (entry.status === "paid" || entry.status === "cancelled") {
    return entry.status;
  }
  const today = new Date().toISOString().slice(0, 10);
  if (entry.due_date < today) return "overdue";
  return entry.status === "overdue" ? "overdue" : "pending";
}

export function isFinanceOverdue(entry: FinanceEntry): boolean {
  return effectiveFinanceStatus(entry) === "overdue";
}
