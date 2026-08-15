import { findContentTasks } from "@/domains/content-production/repository.server";
import { findMarketingSnapshots } from "@/domains/marketing/repository.server";
import { formatMoney } from "@/domains/marketing/types";
import { findProjects, findChecklistItems } from "@/domains/projects/repository.server";
import { ACTIVE_STATUSES, TYPE_LABELS } from "@/domains/projects/types";
import {
  aggregateSnapshots,
  buildMonthNarrative,
  monthRange,
  pctDelta,
  snapshotOverlapsMonth,
} from "./marketing-metrics.server";
import { translateProjectBlocked, translateProjectStatus } from "./translate";
import type { ClientHomeSummary, ClientPendingAction, ClientProjectPreview } from "./types";

function isInMonth(iso: string, start: string, end: string): boolean {
  const day = iso.slice(0, 10);
  return day >= start && day <= end;
}

const CLIENT_VISIBLE_BLOCK_TYPES = new Set(["client", "approval", "access"]);

export async function buildClientHomeSummary(companyId: string, userName: string): Promise<ClientHomeSummary> {
  const current = monthRange(0);
  const previous = monthRange(-1);

  const [allSnapshots, contentTasks, projects] = await Promise.all([
    findMarketingSnapshots({ companyId }),
    findContentTasks({ companyId }),
    findProjects({ companyId }),
  ]);

  const currentSnapshots = allSnapshots.filter((s) =>
    snapshotOverlapsMonth(s, current.start, current.end),
  );
  const previousSnapshots = allSnapshots.filter((s) =>
    snapshotOverlapsMonth(s, previous.start, previous.end),
  );

  const currentMetrics = aggregateSnapshots(currentSnapshots);
  const previousMetrics = aggregateSnapshots(previousSnapshots);
  const leadsDeltaPct = pctDelta(currentMetrics.leads, previousMetrics.leads);
  const cplDeltaPct =
    currentMetrics.cplCents != null && previousMetrics.cplCents != null
      ? pctDelta(currentMetrics.cplCents, previousMetrics.cplCents)
      : null;

  const narrative = buildMonthNarrative({
    leadsDeltaPct,
    cplDeltaPct,
    leads: currentMetrics.leads,
  });

  const pendingActions: ClientPendingAction[] = [];

  for (const task of contentTasks.filter((t) => t.status === "aprovacao")) {
    pendingActions.push({
      id: `content-${task.id}`,
      kind: "content_approval",
      title: "Aprovar conteúdo",
      subtitle: task.title,
      href: `/client/conteudo/${task.id}`,
    });
  }

  for (const project of projects) {
    const needsClient =
      project.status === "blocked" &&
      project.blocked_by_type &&
      CLIENT_VISIBLE_BLOCK_TYPES.has(project.blocked_by_type);
    if (!needsClient) continue;
    pendingActions.push({
      id: `project-${project.id}`,
      kind: "project_input",
      title: translateProjectBlocked(project.blocked_by_type) ?? "Precisamos de você",
      subtitle: project.blocked_by_detail?.trim() || project.title,
      href: `/client/projetos/${project.id}`,
    });
  }

  const contentsProduced = contentTasks.filter(
    (t) =>
      t.status === "publicado" &&
      (isInMonth(t.updated_at, current.start, current.end) ||
        (t.post_date && isInMonth(t.post_date, current.start, current.end))),
  ).length;

  const contentsInPipeline = contentTasks.filter(
    (t) => !["publicado", "ideia"].includes(t.status),
  ).length;

  const campaignOptimizations = currentSnapshots.filter(
    (s) => s.channel === "google_ads" || s.channel === "meta_ads",
  ).length;

  const landingImprovements = currentSnapshots.filter((s) => s.channel === "landing_page").length;

  const activeProjects = projects
    .filter((p) => ACTIVE_STATUSES.includes(p.status))
    .slice(0, 4);

  const projectPreviews: ClientProjectPreview[] = await Promise.all(
    activeProjects.map(async (project) => {
      const checklist = await findChecklistItems(project.id);
      const total = checklist.length;
      const done = checklist.filter((i) => i.done).length;
      const progressPct = total > 0 ? Math.round((done / total) * 100) : null;
      return {
        id: project.id,
        title: project.title,
        typeLabel: TYPE_LABELS[project.type],
        statusLabel: translateProjectStatus(project.status),
        progressPct,
        href: `/client/projetos/${project.id}`,
      };
    }),
  );

  const contentCounts = {
    emProducao: contentTasks.filter((t) =>
      ["definicao", "agendamento", "gravacao", "edicao", "correcao"].includes(t.status),
    ).length,
    aguardandoAprovacao: contentTasks.filter((t) => t.status === "aprovacao").length,
    programados: contentTasks.filter((t) => t.status === "programado" || t.status === "aprovado")
      .length,
    publicados: contentTasks.filter((t) => t.status === "publicado").length,
  };

  return {
    greetingName: userName.split(/\s+/)[0] ?? userName,
    periodLabel: current.label,
    metrics: {
      leads: currentMetrics.leads,
      investmentCents: currentMetrics.investmentCents,
      conversions: currentMetrics.conversions,
      cplCents: currentMetrics.cplCents,
      leadsDeltaPct,
      cplDeltaPct,
      hasData: currentSnapshots.length > 0,
    },
    pendingActions,
    workSummary: {
      periodLabel: current.label,
      contentsProduced,
      contentsInPipeline,
      campaignOptimizations,
      landingImprovements,
      leadsGenerated: currentMetrics.leads,
      investmentManagedCents: currentMetrics.investmentCents,
    },
    highlight: narrative.highlight,
    projects: projectPreviews,
    contentCounts,
    monthReport: currentSnapshots.length
      ? {
          periodLabel: current.label,
          leads: currentMetrics.leads,
          leadsDeltaPct,
          investmentCents: currentMetrics.investmentCents,
          cplCents: currentMetrics.cplCents,
          cplDeltaPct,
          highlight: narrative.highlight,
          nextFocus: narrative.nextFocus,
        }
      : null,
  };
}

export { formatMoney };
