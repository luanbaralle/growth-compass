import type { TeamMember } from "@/lib/auth/types";
import { encryptSecret, decryptSecret } from "@/lib/secret-crypto.server";
import { dbCount } from "@/lib/supabase/server";
import * as repo from "./repository.server";
import type {
  Company,
  CompanyCredential,
  CompanyOperationItem,
  CompanyStage,
  CredentialPlatform,
  OperationItemType,
  SubmitCompanyFormInput,
  CompanyWithLogo,
} from "./types";
import { STAGE_LABELS } from "./types";

export interface CompanyDeletionBlocker {
  count: number;
  label: string;
}

/** Contagens que impedem hard delete. `company_activities` não bloqueia. */
export async function getCompanyDeletionBlockers(
  id: string,
): Promise<CompanyDeletionBlocker[]> {
  const [
    projects,
    contentTasks,
    financeEntries,
    companyFiles,
    companyUsers,
    marketingSnapshots,
    companyServices,
    prospects,
  ] = await Promise.all([
    dbCount("projects", `select=id&company_id=eq.${id}`),
    dbCount("content_tasks", `select=id&company_id=eq.${id}`),
    dbCount("finance_entries", `select=id&company_id=eq.${id}`),
    dbCount("company_files", `select=id&company_id=eq.${id}`),
    dbCount("company_users", `select=id&company_id=eq.${id}`),
    dbCount("marketing_snapshots", `select=id&company_id=eq.${id}`),
    dbCount("company_services", `select=id&company_id=eq.${id}`),
    dbCount("prospects", `select=id&company_id=eq.${id}`),
  ]);

  const checks: Array<{ count: number; singular: string; plural: string }> = [
    { count: projects, singular: "projeto", plural: "projetos" },
    { count: contentTasks, singular: "conteúdo", plural: "conteúdos" },
    {
      count: financeEntries,
      singular: "lançamento financeiro",
      plural: "lançamentos financeiros",
    },
    { count: companyFiles, singular: "arquivo", plural: "arquivos" },
    {
      count: companyUsers,
      singular: "usuário do portal",
      plural: "usuários do portal",
    },
    {
      count: marketingSnapshots,
      singular: "snapshot de marketing",
      plural: "snapshots de marketing",
    },
    { count: companyServices, singular: "serviço", plural: "serviços" },
    {
      count: prospects,
      singular: "prospect vinculado",
      plural: "prospects vinculados",
    },
  ];

  return checks
    .filter((item) => item.count > 0)
    .map((item) => ({
      count: item.count,
      label: item.count === 1 ? item.singular : item.plural,
    }));
}

function formatCompanyDeletionBlockedMessage(blockers: CompanyDeletionBlocker[]): string {
  const parts = blockers.map((b) => `${b.count} ${b.label}`);
  let list: string;
  if (parts.length === 1) {
    list = parts[0];
  } else if (parts.length === 2) {
    list = `${parts[0]} e ${parts[1]}`;
  } else {
    list = `${parts.slice(0, -1).join(", ")} e ${parts[parts.length - 1]}`;
  }
  return `Não é possível excluir esta empresa porque ela possui: ${list}.`;
}

export async function listCompanies(filters: Parameters<typeof repo.findCompanies>[0]) {
  const [companies, counts] = await Promise.all([
    repo.findCompanies(filters),
    repo.countCompaniesByStage(),
  ]);
  const companiesWithLogo = await attachLogoUrls(companies);
  return { companies: companiesWithLogo, counts };
}

async function attachLogoUrls(companies: Company[]): Promise<CompanyWithLogo[]> {
  return Promise.all(
    companies.map(async (company) => {
      const path = company.logo_storage_path;
      if (!path) {
        return { ...company, logo_url: null };
      }
      try {
        const logo_url = await repo.getFileSignedUrl(path);
        return { ...company, logo_url };
      } catch {
        return { ...company, logo_url: null };
      }
    }),
  );
}

export async function getCompany(id: string) {
  const company = await repo.findCompanyById(id);
  if (!company) return null;

  const [activities, files, links, services, credentials, operationItems, logo_url] =
    await Promise.all([
      repo.findActivities(id),
      repo.findCompanyFiles(id),
      repo.findCompanyLinks(id),
      repo.findCompanyServices(id),
      listCredentials(id),
      listOperationItems(id),
      company.logo_storage_path
        ? repo.getFileSignedUrl(company.logo_storage_path)
        : Promise.resolve(null),
    ]);

  return {
    company: { ...company, logo_url } satisfies CompanyWithLogo,
    activities,
    files,
    links,
    services,
    credentials,
    operationItems,
  };
}

export async function createCompany(
  input: {
    name: string;
    legal_name?: string;
    cnpj?: string;
    city?: string;
    city_state?: string;
    responsible_name?: string;
    whatsapp?: string;
    email?: string;
    website?: string;
    origin?: string;
    segment?: string;
    stage?: CompanyStage;
    notes?: string;
  },
  authorId: TeamMember | null,
) {
  const company = await repo.insertCompany({
    name: input.name,
    legal_name: input.legal_name ?? null,
    cnpj: input.cnpj ?? null,
    city: input.city ?? null,
    city_state: input.city_state ?? null,
    responsible_name: input.responsible_name?.trim() || null,
    whatsapp: input.whatsapp ?? null,
    email: input.email || null,
    website: input.website ?? null,
    origin: input.origin ?? null,
    segment: input.segment ?? null,
    stage: input.stage ?? "lead",
    notes: input.notes ?? null,
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    template_slug: null,
    microvertical_id: null,
    match_level: null,
    logo_storage_path: null,
  });

  await repo.insertActivity({
    company_id: company.id,
    type: "system",
    title: "Empresa criada",
    body: `Empresa "${company.name}" cadastrada no sistema.`,
    metadata: { stage: company.stage },
    author_id: authorId,
  });

  return company;
}

export async function createFromPublicForm(input: SubmitCompanyFormInput): Promise<Company> {
  const displayName = input.displayLabel ?? input.business;
  const notesParts = [
    input.negocio && input.negocio !== input.business ? `Digitou: ${input.negocio}` : null,
    input.link ? `Link: ${input.link}` : null,
  ].filter(Boolean);

  const company = await repo.insertCompany({
    name: input.name,
    legal_name: null,
    cnpj: null,
    city: input.city,
    city_state: input.cityState ?? null,
    responsible_name: null,
    whatsapp: input.phone,
    email: null,
    website: input.link ?? null,
    origin: input.source,
    segment: input.segment,
    stage: "lead",
    notes: notesParts.length ? notesParts.join("\n") : `Negócio: ${displayName}`,
    utm_source: input.utmSource ?? null,
    utm_medium: input.utmMedium ?? null,
    utm_campaign: input.utmCampaign ?? null,
    utm_content: input.utmContent ?? null,
    utm_term: input.utmTerm ?? null,
    template_slug: input.templateSlug,
    microvertical_id: input.microverticalId ?? null,
    match_level: input.matchLevel ?? null,
  });

  await repo.insertActivity({
    company_id: company.id,
    type: "system",
    title: "Lead captado via formulário",
    body: `${input.name} solicitou diagnóstico — ${displayName} em ${input.city}.`,
    metadata: {
      source: input.source,
      segment: input.segment,
      templateSlug: input.templateSlug,
    },
    author_id: null,
  });

  return company;
}

export async function updateCompany(
  id: string,
  patch: Partial<Company>,
  authorId: TeamMember | null,
) {
  const existing = await repo.findCompanyById(id);
  if (!existing) return null;

  const { id: _id, created_at: _ca, updated_at: _ua, ...safePatch } = patch as Company;
  const company = await repo.patchCompany(id, safePatch);
  if (!company) return null;

  if (patch.stage && patch.stage !== existing.stage) {
    await repo.insertActivity({
      company_id: id,
      type: "stage_change",
      title: "Estágio alterado",
      body: `${STAGE_LABELS[existing.stage]} → ${STAGE_LABELS[patch.stage as CompanyStage]}`,
      metadata: { from: existing.stage, to: patch.stage },
      author_id: authorId,
    });
  }

  return company;
}

export async function changeStage(
  companyId: string,
  stage: CompanyStage,
  authorId: TeamMember | null,
) {
  return updateCompany(companyId, { stage }, authorId);
}

export async function addNote(
  companyId: string,
  body: string,
  authorId: TeamMember | null,
  title = "Anotação",
) {
  return repo.insertActivity({
    company_id: companyId,
    type: "note",
    title,
    body,
    metadata: {},
    author_id: authorId,
  });
}

export async function deleteCompany(id: string) {
  const blockers = await getCompanyDeletionBlockers(id);
  if (blockers.length > 0) {
    throw new Error(formatCompanyDeletionBlockedMessage(blockers));
  }
  return repo.removeCompany(id);
}

export async function uploadFile(
  companyId: string,
  name: string,
  category: Parameters<typeof repo.uploadCompanyFile>[2],
  mimeType: string,
  base64: string,
  authorId: TeamMember | null,
  financeEntryId?: string | null,
) {
  const buffer = Buffer.from(base64, "base64");
  const file = await repo.uploadCompanyFile(
    companyId,
    name,
    category,
    mimeType,
    buffer,
    authorId,
    financeEntryId,
  );

  await repo.insertActivity({
    company_id: companyId,
    type: "file_added",
    title: "Arquivo adicionado",
    body: file.name,
    metadata: { fileId: file.id, category: file.category },
    author_id: authorId,
  });

  return file;
}

export async function deleteFile(id: string, companyId: string) {
  return repo.removeCompanyFile(id, companyId);
}

export async function getFileDownloadUrl(id: string, companyId: string) {
  const file = await repo.findCompanyFile(id, companyId);
  if (!file) return null;
  const url = await repo.getFileSignedUrl(file.storage_path);
  return { url, name: file.name };
}

const LOGO_MAX_BYTES = 2 * 1024 * 1024;

export async function uploadLogo(companyId: string, mimeType: string, base64: string) {
  const company = await repo.findCompanyById(companyId);
  if (!company) throw new Error("Empresa não encontrada.");

  const buffer = Buffer.from(base64, "base64");
  if (buffer.length > LOGO_MAX_BYTES) {
    throw new Error("Logo máximo: 2 MB.");
  }

  await repo.uploadCompanyLogo(companyId, mimeType, buffer);
  const updated = await repo.findCompanyById(companyId);
  const logo_url = updated?.logo_storage_path
    ? await repo.getFileSignedUrl(updated.logo_storage_path)
    : null;

  return { logo_url };
}

export async function removeLogo(companyId: string) {
  const removed = await repo.removeCompanyLogo(companyId);
  if (!removed) throw new Error("Esta empresa não possui logo.");
  return { ok: true };
}

export async function createLink(input: {
  companyId: string;
  type: import("./types").LinkType;
  label: string;
  url: string;
}) {
  return repo.insertCompanyLink({
    company_id: input.companyId,
    type: input.type,
    label: input.label,
    url: input.url,
  });
}

export async function updateLink(
  id: string,
  data: Partial<Omit<Parameters<typeof repo.insertCompanyLink>[0], "id" | "company_id" | "created_at">>,
) {
  return repo.patchCompanyLink(id, data);
}

export async function deleteLink(id: string) {
  return repo.removeCompanyLink(id);
}

export async function createService(input: {
  companyId: string;
  name: string;
  description?: string;
  status?: import("./types").ServiceStatus;
}) {
  return repo.insertCompanyService({
    company_id: input.companyId,
    name: input.name,
    description: input.description ?? null,
    status: input.status ?? "active",
  });
}

export async function updateService(
  id: string,
  data: Partial<Omit<Parameters<typeof repo.insertCompanyService>[0], "id" | "company_id" | "created_at">>,
) {
  return repo.patchCompanyService(id, data);
}

export async function deleteService(id: string) {
  return repo.removeCompanyService(id);
}

function toSafeCredential(row: repo.CompanyCredentialRow): CompanyCredential {
  return {
    id: row.id,
    company_id: row.company_id,
    platform: row.platform,
    label: row.label,
    username: row.username,
    has_secret: !!row.secret_encrypted,
    url: row.url,
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listCredentials(companyId: string): Promise<CompanyCredential[]> {
  const rows = await repo.findCompanyCredentials(companyId);
  return rows.map(toSafeCredential);
}

export async function createCredential(input: {
  companyId: string;
  platform: CredentialPlatform;
  label: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
}): Promise<CompanyCredential> {
  const row = await repo.insertCompanyCredential({
    company_id: input.companyId,
    platform: input.platform,
    label: input.label.trim(),
    username: input.username?.trim() || null,
    secret_encrypted: input.password?.trim()
      ? encryptSecret(input.password.trim())
      : null,
    url: input.url?.trim() || null,
    notes: input.notes?.trim() || null,
  });
  return toSafeCredential(row);
}

export async function updateCredential(
  id: string,
  companyId: string,
  patch: {
    platform?: CredentialPlatform;
    label?: string;
    username?: string | null;
    password?: string;
    url?: string | null;
    notes?: string | null;
  },
): Promise<CompanyCredential | null> {
  const existing = await repo.findCompanyCredential(id, companyId);
  if (!existing) return null;

  const data: Parameters<typeof repo.patchCompanyCredential>[1] = {};
  if (patch.platform !== undefined) data.platform = patch.platform;
  if (patch.label !== undefined) data.label = patch.label.trim();
  if (patch.username !== undefined) data.username = patch.username?.trim() || null;
  if (patch.url !== undefined) data.url = patch.url?.trim() || null;
  if (patch.notes !== undefined) data.notes = patch.notes?.trim() || null;
  if (patch.password !== undefined) {
    data.secret_encrypted = patch.password.trim()
      ? encryptSecret(patch.password.trim())
      : null;
  }

  const row = await repo.patchCompanyCredential(id, data);
  return row ? toSafeCredential(row) : null;
}

export async function deleteCredential(id: string, companyId: string): Promise<boolean> {
  const existing = await repo.findCompanyCredential(id, companyId);
  if (!existing) return false;
  return repo.removeCompanyCredential(id);
}

export async function revealCredentialPassword(
  id: string,
  companyId: string,
): Promise<{ secret: string }> {
  const row = await repo.findCompanyCredential(id, companyId);
  if (!row) throw new Error("Credencial não encontrada.");
  if (!row.secret_encrypted) throw new Error("Esta credencial não possui senha.");
  return { secret: decryptSecret(row.secret_encrypted) };
}

export async function listOperationItems(
  companyId: string,
): Promise<CompanyOperationItem[]> {
  return repo.findCompanyOperationItems(companyId);
}

export async function createOperationItem(
  input: {
    companyId: string;
    item_type: OperationItemType;
    title: string;
    body?: string;
    url?: string;
    occurred_at?: string;
    project_id?: string;
  },
  authorId: TeamMember | null,
): Promise<CompanyOperationItem> {
  return repo.insertCompanyOperationItem({
    company_id: input.companyId,
    project_id: input.project_id ?? null,
    item_type: input.item_type,
    title: input.title.trim(),
    body: input.body?.trim() || null,
    url: input.url?.trim() || null,
    occurred_at: input.occurred_at?.trim() || null,
    author_id: authorId,
  });
}

export async function updateOperationItem(
  id: string,
  companyId: string,
  patch: {
    item_type?: OperationItemType;
    title?: string;
    body?: string | null;
    url?: string | null;
    occurred_at?: string | null;
    project_id?: string | null;
  },
): Promise<CompanyOperationItem | null> {
  const existing = await repo.findCompanyOperationItem(id, companyId);
  if (!existing) return null;

  const data: Parameters<typeof repo.patchCompanyOperationItem>[1] = {};
  if (patch.item_type !== undefined) data.item_type = patch.item_type;
  if (patch.title !== undefined) data.title = patch.title.trim();
  if (patch.body !== undefined) data.body = patch.body?.trim() || null;
  if (patch.url !== undefined) data.url = patch.url?.trim() || null;
  if (patch.occurred_at !== undefined) data.occurred_at = patch.occurred_at?.trim() || null;
  if (patch.project_id !== undefined) data.project_id = patch.project_id;

  return repo.patchCompanyOperationItem(id, data);
}

export async function deleteOperationItem(id: string, companyId: string): Promise<boolean> {
  const existing = await repo.findCompanyOperationItem(id, companyId);
  if (!existing) return false;
  return repo.removeCompanyOperationItem(id);
}

export async function getDashboardCompanyStats() {
  const [leadsToday, activeClients] = await Promise.all([
    repo.countCompaniesCreatedToday(),
    repo.countActiveCompanies(),
  ]);
  return { leadsToday, activeClients };
}
