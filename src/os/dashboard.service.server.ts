import * as companyRepo from "@/domains/companies/repository.server";
import * as financeRepo from "@/domains/finance/repository.server";
import { effectiveFinanceStatus } from "@/domains/finance/types";
import * as marketingRepo from "@/domains/marketing/repository.server";
import * as projectRepo from "@/domains/projects/repository.server";
import { isOverdue } from "@/domains/projects/repository.server";
import type { CompanyStageCounts } from "@/domains/companies/types";
import {
  getDashboardDateFilterBounds,
  isDateInRange,
  type DashboardDateFilter,
} from "@/os/dashboard-date";

export interface OSDashboardData {
  companies: {
    leadsToday: number;
    activeClients: number;
    pipeline: CompanyStageCounts;
    recentLeads: Array<{
      id: string;
      name: string;
      created_at: string;
      city: string | null;
    }>;
  };
  projects: {
    inProgress: number;
    overdue: number;
    overdueItems: Array<{
      id: string;
      title: string;
      company_id: string;
      companyName: string | null;
      due_date: string | null;
    }>;
  };
  finance: {
    receivableCents: number;
    overdueCents: number;
    paidThisMonthCents: number;
    mrrCents: number;
    mrrClientCount: number;
    overdueCount: number;
    overdueItems: Array<{
      id: string;
      company_id: string;
      description: string;
      companyName: string | null;
      amount_cents: number;
      due_date: string;
    }>;
  };
  marketing: {
    investmentCents: number;
    leads: number;
    conversions: number;
    snapshotCount: number;
    recentSnapshots: Array<{
      id: string;
      company_id: string;
      companyName: string | null;
      channel: string;
      period_start: string;
      period_end: string;
      investment_cents: number | null;
      leads: number | null;
    }>;
  };
  prospection: {
    prospected: number;
    messagesSent: number;
    responses: number;
    clients: number;
    responseRate: number;
    conversionRate: number;
    upcomingActions: Array<{
      id: string;
      name: string;
      next_action: string | null;
      next_action_date: string | null;
    }>;
  };
}

export async function getOSDashboardData(
  filter: DashboardDateFilter = { kind: "preset", preset: "today" },
): Promise<OSDashboardData> {
  const { start, end } = getDashboardDateFilterBounds(filter);

  const [
    leadsInRange,
    activeClients,
    pipeline,
    allProjects,
    projectStats,
    financeSummary,
    financeCounts,
    allFinance,
    marketingSummary,
    marketingCounts,
    recentSnapshots,
    recentCompanies,
    prospectionMetrics,
  ] = await Promise.all([
    companyRepo.countCompaniesCreatedBetween(start, end),
    companyRepo.countActiveCompanies(),
    companyRepo.countCompaniesByStage(),
    projectRepo.findProjects({ sort: "due_date", order: "asc" }),
    import("@/domains/projects/service.server").then((m) => m.getProjectDashboardStats()),
    financeRepo.getFinanceSummary(),
    financeRepo.countFinanceByStatus(),
    financeRepo.findFinanceEntries({ sort: "due_date", order: "asc" }),
    marketingRepo.getMarketingSummary(),
    marketingRepo.countMarketingByChannel(),
    marketingRepo.findMarketingSnapshots({ sort: "period_start", order: "desc" }),
    companyRepo.findCompanies({ stage: "lead", sort: "created_at", order: "desc" }),
    import("@/domains/prospection/service.server").then((m) => m.getProspectionMetrics()),
  ]);

  const overdueProjects = allProjects
    .filter((p) => isOverdue(p))
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      company_id: p.company_id,
      companyName: p.companies?.name ?? null,
      due_date: p.due_date,
    }));

  const overdueFinance = allFinance
    .filter((entry) => effectiveFinanceStatus(entry) === "overdue")
    .slice(0, 5)
    .map((entry) => ({
      id: entry.id,
      company_id: entry.company_id,
      description: entry.description,
      companyName: entry.companies?.name ?? null,
      amount_cents: entry.amount_cents,
      due_date: entry.due_date,
    }));

  return {
    companies: {
      leadsToday: leadsInRange,
      activeClients,
      pipeline,
      recentLeads: recentCompanies
        .filter((c) => isDateInRange(c.created_at, start, end))
        .slice(0, 5)
        .map((c) => ({
        id: c.id,
        name: c.name,
        created_at: c.created_at,
        city: c.city,
      })),
    },
    projects: {
      inProgress: projectStats.inProgress,
      overdue: projectStats.overdue,
      overdueItems: overdueProjects,
    },
    finance: {
      receivableCents: financeSummary.receivableCents,
      overdueCents: financeSummary.overdueCents,
      paidThisMonthCents: financeSummary.paidThisMonthCents,
      mrrCents: financeSummary.mrrCents,
      mrrClientCount: financeSummary.mrrClientCount,
      overdueCount: financeCounts.overdue,
      overdueItems: overdueFinance,
    },
    marketing: {
      investmentCents: marketingSummary.investmentCents,
      leads: marketingSummary.leads,
      conversions: marketingSummary.conversions,
      snapshotCount: marketingCounts.all,
      recentSnapshots: recentSnapshots.slice(0, 5).map((s) => ({
        id: s.id,
        company_id: s.company_id,
        companyName: s.companies?.name ?? null,
        channel: s.channel,
        period_start: s.period_start,
        period_end: s.period_end,
        investment_cents: s.investment_cents,
        leads: s.leads,
      })),
    },
    prospection: {
      prospected: prospectionMetrics.prospected,
      messagesSent: prospectionMetrics.messagesSent,
      responses: prospectionMetrics.responses,
      clients: prospectionMetrics.clients,
      responseRate: prospectionMetrics.responseRate,
      conversionRate: prospectionMetrics.conversionRate,
      upcomingActions: prospectionMetrics.upcomingActions.slice(0, 5).map((p) => ({
        id: p.id,
        name: p.name,
        next_action: p.next_action,
        next_action_date: p.next_action_date,
      })),
    },
  };
}
