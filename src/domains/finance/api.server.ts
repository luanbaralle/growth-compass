import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  createFinanceEntrySchema,
  financeEntryFilesSchema,
  financeEntryIdSchema,
  listFinanceEntriesSchema,
  markFinancePaidSchema,
  updateFinanceEntrySchema,
  generateFinanceReceiptSchema,
  financeReceiptPreviewSchema,
  uploadFinanceReceiptSchema,
} from "@/domains/finance/schema";

export const listFinanceEntries = createServerFn({ method: "GET" })
  .validator(listFinanceEntriesSchema.optional())
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const financeService = await import("@/domains/finance/service.server");
      return financeService.listFinanceEntries(data ?? {});
    });
  });

export const createFinanceEntry = createServerFn({ method: "POST" })
  .validator(createFinanceEntrySchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const financeService = await import("@/domains/finance/service.server");
      return financeService.createFinanceEntry(
        {
          companyId: data.companyId,
          type: data.type,
          description: data.description,
          amountCents: data.amountCents,
          dueDate: data.dueDate,
          status: data.status,
          paidAt: data.paidAt || undefined,
          paymentMethod: data.paymentMethod,
          recurring: data.recurring,
          recurringMonths: data.recurringMonths,
        },
        author,
      );
    });
  });

export const updateFinanceEntry = createServerFn({ method: "POST" })
  .validator(updateFinanceEntrySchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const financeService = await import("@/domains/finance/service.server");
      const { id, companyId, amountCents, dueDate, paidAt, paymentMethod, ...rest } = data;
      const entry = await financeService.updateFinanceEntry(
        id,
        companyId,
        {
          ...rest,
          amountCents,
          dueDate,
          paidAt: paidAt || undefined,
          paymentMethod,
        },
        author,
      );
      if (!entry) throw new Error("Lançamento não encontrado.");
      return entry;
    });
  });

export const markFinanceEntryPaid = createServerFn({ method: "POST" })
  .validator(markFinancePaidSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const financeService = await import("@/domains/finance/service.server");
      const entry = await financeService.markFinanceEntryPaid(
        data.id,
        data.companyId,
        {
          paidAt: data.paidAt,
          paymentMethod: data.paymentMethod,
        },
        author,
      );
      if (!entry) throw new Error("Lançamento não encontrado.");
      return entry;
    });
  });

export const deleteFinanceEntry = createServerFn({ method: "POST" })
  .validator(financeEntryIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const financeService = await import("@/domains/finance/service.server");
      const removed = await financeService.deleteFinanceEntry(data.id, data.companyId);
      if (!removed) throw new Error("Lançamento não encontrado.");
      return { ok: true };
    });
  });

export const getFinanceDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const financeService = await import("@/domains/finance/service.server");
    return financeService.getFinanceDashboardStats();
  });
});

export const listFinanceEntryFiles = createServerFn({ method: "GET" })
  .validator(financeEntryFilesSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const financeService = await import("@/domains/finance/service.server");
      return financeService.listFinanceEntryFiles(data.financeEntryId);
    });
  });

export const uploadFinanceReceipt = createServerFn({ method: "POST" })
  .validator(uploadFinanceReceiptSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const financeService = await import("@/domains/finance/service.server");
      return financeService.uploadFinanceReceipt(
        data.companyId,
        data.financeEntryId,
        data.name,
        data.mimeType,
        data.base64,
        author,
      );
    });
  });

export const getFinanceReceiptPreview = createServerFn({ method: "GET" })
  .validator(financeReceiptPreviewSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const financeService = await import("@/domains/finance/service.server");
      return financeService.getFinanceReceiptPreview(data.id, data.companyId);
    });
  });

export const generateFinanceReceipt = createServerFn({ method: "POST" })
  .validator(generateFinanceReceiptSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const financeService = await import("@/domains/finance/service.server");
      return financeService.generateFinanceReceipt(
        {
          financeEntryId: data.id,
          companyId: data.companyId,
          receiptNumber: data.receiptNumber,
          issueDate: data.issueDate,
          companyCode: data.companyCode,
          serviceDescription: data.serviceDescription,
        },
        author,
      );
    });
  });
