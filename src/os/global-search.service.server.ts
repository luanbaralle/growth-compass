import * as companyRepo from "@/domains/companies/repository.server";
import { STAGE_LABELS } from "@/domains/companies/types";
import * as contentRepo from "@/domains/content-production/repository.server";
import { STATUS_LABELS } from "@/domains/content-production/types";
import * as projectRepo from "@/domains/projects/repository.server";
import { TYPE_LABELS } from "@/domains/projects/types";
import * as prospectRepo from "@/domains/prospection/repository.server";
import { STATUS_LABELS as PROSPECT_STATUS_LABELS } from "@/domains/prospection/types";
import { ENTITY_ROUTES } from "@/domains/events/types";
import type { GlobalSearchResponse, GlobalSearchResult } from "@/os/global-search";

const LIMIT_PER_KIND = 5;

export async function searchOSGlobal(query: string): Promise<GlobalSearchResponse> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { query: trimmed, results: [] };
  }

  const [companies, projects, prospects, contentTasks] = await Promise.all([
    companyRepo.findCompanies({ search: trimmed, sort: "name", order: "asc" }),
    projectRepo.findProjects({ search: trimmed, sort: "title", order: "asc" }),
    prospectRepo.findProspects({ search: trimmed, sort: "name", order: "asc" }),
    contentRepo.findContentTasks({ search: trimmed }),
  ]);

  const results: GlobalSearchResult[] = [
    ...companies.slice(0, LIMIT_PER_KIND).map((company) => ({
      id: company.id,
      kind: "company" as const,
      title: company.name,
      subtitle: [STAGE_LABELS[company.stage], company.city].filter(Boolean).join(" · ") || "Empresa",
      href: ENTITY_ROUTES.company(company.id),
    })),
    ...projects.slice(0, LIMIT_PER_KIND).map((project) => ({
      id: project.id,
      kind: "project" as const,
      title: project.title,
      subtitle: [project.companies?.name, TYPE_LABELS[project.type]].filter(Boolean).join(" · ") || "Projeto",
      href: ENTITY_ROUTES.project(project.id),
    })),
    ...prospects.slice(0, LIMIT_PER_KIND).map((prospect) => ({
      id: prospect.id,
      kind: "prospect" as const,
      title: prospect.name,
      subtitle: [PROSPECT_STATUS_LABELS[prospect.status], prospect.city].filter(Boolean).join(" · ") || "Prospect",
      href: ENTITY_ROUTES.prospect(prospect.id),
    })),
    ...contentTasks.slice(0, LIMIT_PER_KIND).map((task) => ({
      id: task.id,
      kind: "content_task" as const,
      title: task.title,
      subtitle: [task.companies?.name, STATUS_LABELS[task.status]].filter(Boolean).join(" · ") || "Conteúdo",
      href: ENTITY_ROUTES.content_task(task.id),
    })),
  ];

  return { query: trimmed, results };
}
