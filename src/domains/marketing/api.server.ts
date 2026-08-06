import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  createMarketingSnapshotSchema,
  listMarketingSnapshotsSchema,
  marketingSnapshotIdSchema,
  updateMarketingSnapshotSchema,
} from "@/domains/marketing/schema";

export const listMarketingSnapshots = createServerFn({ method: "GET" })
  .validator(listMarketingSnapshotsSchema.optional())
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const marketingService = await import("@/domains/marketing/service.server");
      return marketingService.listMarketingSnapshots(data ?? {});
    });
  });

export const createMarketingSnapshot = createServerFn({ method: "POST" })
  .validator(createMarketingSnapshotSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const marketingService = await import("@/domains/marketing/service.server");
      return marketingService.createMarketingSnapshot({
        companyId: data.companyId,
        channel: data.channel,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        investmentCents: data.investmentCents,
        leads: data.leads,
        conversions: data.conversions,
        ctr: data.ctr,
        cpcCents: data.cpcCents,
        cpaCents: data.cpaCents,
        notes: data.notes,
      });
    });
  });

export const updateMarketingSnapshot = createServerFn({ method: "POST" })
  .validator(updateMarketingSnapshotSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const marketingService = await import("@/domains/marketing/service.server");
      const { id, companyId, periodStart, periodEnd, investmentCents, cpcCents, cpaCents, ...rest } =
        data;
      const snapshot = await marketingService.updateMarketingSnapshot(id, companyId, {
        ...rest,
        periodStart,
        periodEnd,
        investmentCents,
        cpcCents,
        cpaCents,
      });
      if (!snapshot) throw new Error("Registro não encontrado.");
      return snapshot;
    });
  });

export const deleteMarketingSnapshot = createServerFn({ method: "POST" })
  .validator(marketingSnapshotIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const marketingService = await import("@/domains/marketing/service.server");
      const removed = await marketingService.deleteMarketingSnapshot(data.id, data.companyId);
      if (!removed) throw new Error("Registro não encontrado.");
      return { ok: true };
    });
  });

export const getMarketingDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const marketingService = await import("@/domains/marketing/service.server");
    return marketingService.getMarketingDashboardStats();
  });
});
