import * as companyRepo from "@/domains/companies/repository.server";
import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import type { FinanceEntryStatus, FinanceEntryType } from "./types";
import { effectiveFinanceStatus, formatMoney } from "./types";

export async function listFinanceEntries(filters: Parameters<typeof repo.findFinanceEntries>[0]) {
  const [entries, counts, summary] = await Promise.all([
    repo.findFinanceEntries(filters),
    repo.countFinanceByStatus(filters?.companyId),
    repo.getFinanceSummary(filters?.companyId),
  ]);
  return { entries, counts, summary };
}

export async function createFinanceEntry(
  input: {
    companyId: string;
    type: FinanceEntryType;
    description: string;
    amountCents: number;
    dueDate: string;
    status?: FinanceEntryStatus;
    paidAt?: string;
    paymentMethod?: string;
  },
  authorId: TeamMember | null,
) {
  const company = await companyRepo.findCompanyById(input.companyId);
  if (!company) throw new Error("Empresa não encontrada.");

  const status = input.status ?? "pending";
  const paidAt = status === "paid" ? input.paidAt ?? repo.todayIso() : input.paidAt ?? null;

  const entry = await repo.insertFinanceEntry({
    company_id: input.companyId,
    type: input.type,
    description: input.description,
    amount_cents: input.amountCents,
    due_date: input.dueDate,
    paid_at: paidAt,
    payment_method: input.paymentMethod ?? null,
    status,
  });

  if (status === "paid") {
    await companyRepo.insertActivity({
      company_id: input.companyId,
      type: "payment",
      title: "Pagamento registrado",
      body: `${input.description} — ${formatMoney(input.amountCents)}`,
      metadata: { financeEntryId: entry.id, type: input.type },
      author_id: authorId,
    });
  }

  return entry;
}

export async function updateFinanceEntry(
  id: string,
  companyId: string,
  patch: Partial<{
    type: FinanceEntryType;
    description: string;
    amountCents: number;
    dueDate: string;
    status: FinanceEntryStatus;
    paidAt: string;
    paymentMethod: string;
  }>,
  authorId: TeamMember | null,
) {
  const existing = await repo.findFinanceEntryById(id);
  if (!existing || existing.company_id !== companyId) return null;

  const wasPaid = existing.status === "paid";
  const data: Record<string, unknown> = {};

  if (patch.type !== undefined) data.type = patch.type;
  if (patch.description !== undefined) data.description = patch.description;
  if (patch.amountCents !== undefined) data.amount_cents = patch.amountCents;
  if (patch.dueDate !== undefined) data.due_date = patch.dueDate;
  if (patch.paymentMethod !== undefined) data.payment_method = patch.paymentMethod || null;

  if (patch.status !== undefined) {
    data.status = patch.status;
    if (patch.status === "paid") {
      data.paid_at = patch.paidAt ?? existing.paid_at ?? repo.todayIso();
    } else {
      data.paid_at = null;
    }
  } else if (patch.paidAt !== undefined) {
    data.paid_at = patch.paidAt || null;
  }

  const entry = await repo.patchFinanceEntry(id, data);
  if (!entry) return null;

  if (!wasPaid && entry.status === "paid") {
    await companyRepo.insertActivity({
      company_id: companyId,
      type: "payment",
      title: "Pagamento registrado",
      body: `${entry.description} — ${formatMoney(entry.amount_cents)}`,
      metadata: { financeEntryId: entry.id, type: entry.type },
      author_id: authorId,
    });
  }

  return entry;
}

export async function markFinanceEntryPaid(
  id: string,
  companyId: string,
  input: { paidAt?: string; paymentMethod?: string },
  authorId: TeamMember | null,
) {
  return updateFinanceEntry(
    id,
    companyId,
    {
      status: "paid",
      paidAt: input.paidAt ?? repo.todayIso(),
      paymentMethod: input.paymentMethod,
    },
    authorId,
  );
}

export async function deleteFinanceEntry(id: string, companyId: string) {
  const existing = await repo.findFinanceEntryById(id);
  if (!existing || existing.company_id !== companyId) return false;
  return repo.removeFinanceEntry(id);
}

export async function getFinanceDashboardStats() {
  const summary = await repo.getFinanceSummary();
  const counts = await repo.countFinanceByStatus();
  return {
    pendingCents: summary.pendingCents,
    overdueCents: summary.overdueCents,
    paidThisMonthCents: summary.paidThisMonthCents,
    overdueCount: counts.overdue,
  };
}

export async function listFinanceEntryFiles(financeEntryId: string) {
  return companyRepo.findFilesByFinanceEntry(financeEntryId);
}

export async function uploadFinanceReceipt(
  companyId: string,
  financeEntryId: string,
  name: string,
  mimeType: string,
  base64: string,
  authorId: TeamMember | null,
) {
  const entry = await repo.findFinanceEntryById(financeEntryId);
  if (!entry || entry.company_id !== companyId) {
    throw new Error("Lançamento não encontrado.");
  }

  return companyRepo.uploadCompanyFile(
    companyId,
    name,
    "receipt",
    mimeType,
    Buffer.from(base64, "base64"),
    authorId,
    financeEntryId,
  );
}

export { effectiveFinanceStatus };
