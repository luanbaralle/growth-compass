import * as companyRepo from "@/domains/companies/repository.server";
import { getOSPreferences } from "@/domains/settings/repository.server";
import type { TeamMember } from "@/lib/auth/types";
import { buildReceiptFileName, buildReceiptNumber, deriveCompanyCode } from "./receipt-utils";
import {
  buildRecurringDescription,
  buildRecurringDueDates,
} from "./recurrence-utils";
import * as repo from "./repository.server";
import type { FinanceEntry, FinanceEntryStatus, FinanceEntryType } from "./types";
import { effectiveFinanceStatus, formatMoney } from "./types";

export interface CreateFinanceEntryResult {
  entry: FinanceEntry;
  createdCount: number;
}

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
    recurring?: boolean;
    recurringMonths?: number;
  },
  authorId: TeamMember | null,
): Promise<CreateFinanceEntryResult> {
  const company = await companyRepo.findCompanyById(input.companyId);
  if (!company) throw new Error("Empresa não encontrada.");

  const status = input.status ?? "pending";
  const recurringMonths =
    input.recurring && input.recurringMonths && input.recurringMonths >= 2
      ? input.recurringMonths
      : 1;

  if (recurringMonths === 1) {
    const entry = await insertSingleFinanceEntry(input, status, authorId);
    return { entry, createdCount: 1 };
  }

  const dueDates = buildRecurringDueDates(input.dueDate, recurringMonths);
  const entries: FinanceEntry[] = [];

  for (let index = 0; index < dueDates.length; index++) {
    const dueDate = dueDates[index];
    const isFirst = index === 0;
    const entryStatus = isFirst ? status : "pending";
    const description = buildRecurringDescription(input.description, dueDate);

    const entry = await repo.insertFinanceEntry({
      company_id: input.companyId,
      type: input.type,
      description,
      amount_cents: input.amountCents,
      due_date: dueDate,
      paid_at:
        entryStatus === "paid"
          ? input.paidAt ?? (isFirst ? repo.todayIso() : null)
          : null,
      payment_method: isFirst ? input.paymentMethod ?? null : null,
      status: entryStatus,
    });

    entries.push(entry);

    if (entryStatus === "paid") {
      await companyRepo.insertActivity({
        company_id: input.companyId,
        type: "payment",
        title: "Pagamento registrado",
        body: `${description} — ${formatMoney(input.amountCents)}`,
        metadata: { financeEntryId: entry.id, type: input.type, recurring: true },
        author_id: authorId,
      });
    }
  }

  await companyRepo.insertActivity({
    company_id: input.companyId,
    type: "system",
    title: "Cobranças recorrentes criadas",
    body: `${recurringMonths} lançamentos de ${formatMoney(input.amountCents)}`,
    metadata: {
      financeEntryIds: entries.map((entry) => entry.id),
      recurringMonths,
      firstDueDate: input.dueDate,
    },
    author_id: authorId,
  });

  return { entry: entries[0], createdCount: entries.length };
}

async function insertSingleFinanceEntry(
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
  status: FinanceEntryStatus,
  authorId: TeamMember | null,
) {
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
    receivableCents: summary.receivableCents,
    overdueCents: summary.overdueCents,
    paidThisMonthCents: summary.paidThisMonthCents,
    mrrCents: summary.mrrCents,
    mrrClientCount: summary.mrrClientCount,
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

async function countGeneratedReceiptsForYear(companyId: string, year: number): Promise<number> {
  const files = await companyRepo.findCompanyFiles(companyId);
  const prefix = `${year}-`;
  return files.filter(
    (file) =>
      file.category === "receipt" &&
      file.name.endsWith(".pdf") &&
      file.name.includes(prefix),
  ).length;
}

export async function getFinanceReceiptPreview(financeEntryId: string, companyId: string) {
  const entry = await repo.findFinanceEntryById(financeEntryId);
  if (!entry || entry.company_id !== companyId) {
    throw new Error("Lançamento não encontrado.");
  }

  const company = await companyRepo.findCompanyById(companyId);
  if (!company) throw new Error("Empresa não encontrada.");

  const preferences = await getOSPreferences();
  const issueDate = entry.paid_at ?? repo.todayIso();
  const year = Number.parseInt(issueDate.slice(0, 4), 10);
  const companyCode = deriveCompanyCode(company.legal_name ?? company.name);
  const sequence = (await countGeneratedReceiptsForYear(companyId, year)) + 1;
  const receiptNumber = buildReceiptNumber(
    preferences.receiptPrefix,
    year,
    companyCode,
    sequence,
  );

  return {
    entry: {
      id: entry.id,
      description: entry.description,
      amountCents: entry.amount_cents,
      paidAt: entry.paid_at,
      status: entry.status,
    },
    company: {
      id: company.id,
      name: company.name,
      legalName: company.legal_name ?? company.name,
      cnpj: company.cnpj,
    },
    issuer: {
      name: preferences.issuerName,
      cpf: preferences.issuerCpf,
      email: preferences.issuerEmail,
      phone: preferences.issuerPhone,
    },
    defaults: {
      receiptNumber,
      issueDate,
      companyCode,
      serviceDescription: entry.description,
    },
    issuerConfigured: Boolean(
      preferences.issuerName.trim() &&
        preferences.issuerCpf.trim() &&
        (preferences.issuerEmail.trim() || preferences.issuerPhone.trim()),
    ),
  };
}

export async function generateFinanceReceipt(
  input: {
    financeEntryId: string;
    companyId: string;
    receiptNumber: string;
    issueDate: string;
    companyCode: string;
    serviceDescription: string;
  },
  authorId: TeamMember | null,
) {
  const entry = await repo.findFinanceEntryById(input.financeEntryId);
  if (!entry || entry.company_id !== input.companyId) {
    throw new Error("Lançamento não encontrado.");
  }

  const company = await companyRepo.findCompanyById(input.companyId);
  if (!company) throw new Error("Empresa não encontrada.");

  const preferences = await getOSPreferences();
  if (
    !preferences.issuerName.trim() ||
    !preferences.issuerCpf.trim() ||
    (!preferences.issuerEmail.trim() && !preferences.issuerPhone.trim())
  ) {
    throw new Error(
      "Configure os dados do emissor do recibo em Configurações antes de gerar.",
    );
  }

  const { buildReceiptPdf } = await import("./receipt-pdf.server");
  const pdfBytes = await buildReceiptPdf({
    receiptNumber: input.receiptNumber.trim(),
    issueDate: input.issueDate,
    clientLegalName: company.legal_name ?? company.name,
    clientCnpj: company.cnpj,
    amountCents: entry.amount_cents,
    serviceDescription: input.serviceDescription.trim(),
    issuerName: preferences.issuerName.trim(),
    issuerCpf: preferences.issuerCpf.trim(),
    issuerEmail: preferences.issuerEmail.trim(),
    issuerPhone: preferences.issuerPhone.trim(),
  });

  const fileName = buildReceiptFileName(input.receiptNumber.trim(), entry.description);
  const file = await companyRepo.uploadCompanyFile(
    input.companyId,
    fileName,
    "receipt",
    "application/pdf",
    Buffer.from(pdfBytes),
    authorId,
    input.financeEntryId,
  );

  await companyRepo.insertActivity({
    company_id: input.companyId,
    type: "file_added",
    title: "Recibo gerado",
    body: `${input.receiptNumber.trim()} — ${formatMoney(entry.amount_cents)}`,
    metadata: {
      financeEntryId: input.financeEntryId,
      fileId: file.id,
      receiptNumber: input.receiptNumber.trim(),
    },
    author_id: authorId,
  });

  const url = await companyRepo.getFileSignedUrl(file.storage_path);
  return { file, url };
}

export { effectiveFinanceStatus };
