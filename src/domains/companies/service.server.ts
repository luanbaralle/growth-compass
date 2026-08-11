import type { TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import type {
  Company,
  CompanyStage,
  SubmitCompanyFormInput,
  CompanyWithLogo,
} from "./types";
import { STAGE_LABELS } from "./types";

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

  const [activities, files, links, services, logo_url] = await Promise.all([
    repo.findActivities(id),
    repo.findCompanyFiles(id),
    repo.findCompanyLinks(id),
    repo.findCompanyServices(id),
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
  };
}

export async function createCompany(
  input: {
    name: string;
    legal_name?: string;
    cnpj?: string;
    city?: string;
    city_state?: string;
    responsible_id?: TeamMember;
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
    responsible_id: input.responsible_id ?? null,
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
    responsible_id: null,
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

export async function createLink(
  data: Omit<Parameters<typeof repo.insertCompanyLink>[0], "id" | "created_at">,
) {
  return repo.insertCompanyLink(data);
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

export async function createService(
  data: Omit<Parameters<typeof repo.insertCompanyService>[0], "id" | "created_at">,
) {
  return repo.insertCompanyService(data);
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

export async function getDashboardCompanyStats() {
  const [leadsToday, activeClients] = await Promise.all([
    repo.countCompaniesCreatedToday(),
    repo.countActiveCompanies(),
  ]);
  return { leadsToday, activeClients };
}
