import { randomUUID } from "node:crypto";
import {
  dbDelete,
  dbInsert,
  dbSelect,
  dbUpdate,
  storageDelete,
  storageSignUrl,
  storageUpload,
} from "@/lib/supabase/server";
import type {
  Company,
  CompanyActivity,
  CompanyFile,
  CompanyLink,
  CompanyListFilters,
  CompanyService,
  CompanyStage,
  CompanyStageCounts,
  FileCategory,
} from "./types";
import { COMPANY_STAGES } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function findCompanies(filters: CompanyListFilters = {}): Promise<Company[]> {
  const params: Record<string, string> = {
    select: "*",
  };

  const sort = filters.sort ?? "created_at";
  const order = filters.order ?? "desc";
  params.order = `${sort}.${order}`;

  if (filters.stage && filters.stage !== "all") {
    params.stage = `eq.${filters.stage}`;
  }

  let companies = await dbSelect<Company>("companies", encodeQuery(params));

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    companies = companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        c.segment?.toLowerCase().includes(q) ||
        c.whatsapp?.includes(q) ||
        c.email?.toLowerCase().includes(q),
    );
  }

  return companies;
}

export async function countCompaniesByStage(): Promise<CompanyStageCounts> {
  const counts: CompanyStageCounts = {
    all: 0,
    lead: 0,
    contato: 0,
    proposta: 0,
    negociacao: 0,
    ativo: 0,
    pausado: 0,
    encerrado: 0,
  };

  const all = await dbSelect<Company>("companies", encodeQuery({ select: "stage" }));
  counts.all = all.length;
  for (const row of all) {
    if (row.stage in counts) {
      counts[row.stage as CompanyStage]++;
    }
  }
  return counts;
}

export async function findCompanyById(id: string): Promise<Company | null> {
  const rows = await dbSelect<Company>("companies", encodeQuery({ select: "*", id: `eq.${id}` }));
  return rows[0] ?? null;
}

export async function insertCompany(
  data: Omit<Company, "id" | "created_at" | "updated_at">,
): Promise<Company> {
  const [row] = await dbInsert<Company>("companies", data);
  return row;
}

export async function patchCompany(
  id: string,
  data: Partial<Omit<Company, "id" | "created_at" | "updated_at">>,
): Promise<Company | null> {
  const rows = await dbUpdate<Company>("companies", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function removeCompany(id: string): Promise<boolean> {
  const company = await findCompanyById(id);
  const files = await findCompanyFiles(id);
  for (const file of files) {
    try {
      await storageDelete(file.storage_path);
    } catch {
      // storage may already be gone
    }
  }
  if (company?.logo_storage_path) {
    try {
      await storageDelete(company.logo_storage_path);
    } catch {
      // storage may already be gone
    }
  }
  await dbDelete("companies", `id=eq.${id}`);
  return true;
}

export async function findActivities(companyId: string): Promise<CompanyActivity[]> {
  return dbSelect<CompanyActivity>(
    "company_activities",
    encodeQuery({
      select: "*",
      company_id: `eq.${companyId}`,
      order: "created_at.desc",
    }),
  );
}

export async function insertActivity(
  data: Omit<CompanyActivity, "id" | "created_at">,
): Promise<CompanyActivity> {
  const [row] = await dbInsert<CompanyActivity>("company_activities", {
    ...data,
    metadata: data.metadata ?? {},
  });
  return row;
}

export async function findCompanyFiles(companyId: string): Promise<CompanyFile[]> {
  return dbSelect<CompanyFile>(
    "company_files",
    encodeQuery({
      select: "*",
      company_id: `eq.${companyId}`,
      order: "created_at.desc",
    }),
  );
}

export async function insertCompanyFile(
  data: Omit<CompanyFile, "id" | "created_at">,
): Promise<CompanyFile> {
  const [row] = await dbInsert<CompanyFile>("company_files", data);
  return row;
}

export async function findCompanyFile(id: string, companyId: string): Promise<CompanyFile | null> {
  const rows = await dbSelect<CompanyFile>(
    "company_files",
    encodeQuery({ select: "*", id: `eq.${id}`, company_id: `eq.${companyId}` }),
  );
  return rows[0] ?? null;
}

export async function removeCompanyFile(id: string, companyId: string): Promise<boolean> {
  const file = await findCompanyFile(id, companyId);
  if (!file) return false;
  await storageDelete(file.storage_path);
  await dbDelete("company_files", `id=eq.${id}`);
  return true;
}

export async function getFileSignedUrl(storagePath: string): Promise<string> {
  return storageSignUrl(storagePath);
}

export async function findFilesByFinanceEntry(financeEntryId: string): Promise<CompanyFile[]> {
  return dbSelect<CompanyFile>(
    "company_files",
    encodeQuery({
      select: "*",
      finance_entry_id: `eq.${financeEntryId}`,
      order: "created_at.desc",
    }),
  );
}

export async function uploadCompanyLogo(
  companyId: string,
  mimeType: string,
  buffer: Buffer,
): Promise<string> {
  const company = await findCompanyById(companyId);
  if (company?.logo_storage_path) {
    try {
      await storageDelete(company.logo_storage_path);
    } catch {
      // replace logo
    }
  }

  const ext =
    mimeType === "image/png"
      ? ".png"
      : mimeType === "image/webp"
        ? ".webp"
        : mimeType === "image/gif"
          ? ".gif"
          : ".jpg";
  const storagePath = `${companyId}/logo${ext}`;

  await storageUpload(storagePath, buffer, mimeType);
  await patchCompany(companyId, { logo_storage_path: storagePath });
  return storagePath;
}

export async function removeCompanyLogo(companyId: string): Promise<boolean> {
  const company = await findCompanyById(companyId);
  if (!company?.logo_storage_path) return false;

  try {
    await storageDelete(company.logo_storage_path);
  } catch {
    // storage may already be gone
  }

  await patchCompany(companyId, { logo_storage_path: null });
  return true;
}

export async function uploadCompanyFile(
  companyId: string,
  name: string,
  category: FileCategory,
  mimeType: string,
  buffer: Buffer,
  uploadedBy: string | null,
  financeEntryId?: string | null,
): Promise<CompanyFile> {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  const storagePath = `${companyId}/${randomUUID()}${ext}`;

  await storageUpload(storagePath, buffer, mimeType);

  return insertCompanyFile({
    company_id: companyId,
    finance_entry_id: financeEntryId ?? null,
    name,
    storage_path: storagePath,
    category,
    mime_type: mimeType,
    size_bytes: buffer.length,
    uploaded_by: uploadedBy,
  });
}

export async function findCompanyLinks(companyId: string): Promise<CompanyLink[]> {
  return dbSelect<CompanyLink>(
    "company_links",
    encodeQuery({
      select: "*",
      company_id: `eq.${companyId}`,
      order: "created_at.asc",
    }),
  );
}

export async function insertCompanyLink(
  data: Omit<CompanyLink, "id" | "created_at">,
): Promise<CompanyLink> {
  const [row] = await dbInsert<CompanyLink>("company_links", data);
  return row;
}

export async function patchCompanyLink(
  id: string,
  data: Partial<Omit<CompanyLink, "id" | "company_id" | "created_at">>,
): Promise<CompanyLink | null> {
  const rows = await dbUpdate<CompanyLink>("company_links", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function removeCompanyLink(id: string): Promise<boolean> {
  await dbDelete("company_links", `id=eq.${id}`);
  return true;
}

export async function findCompanyServices(companyId: string): Promise<CompanyService[]> {
  return dbSelect<CompanyService>(
    "company_services",
    encodeQuery({
      select: "*",
      company_id: `eq.${companyId}`,
      order: "created_at.asc",
    }),
  );
}

export async function insertCompanyService(
  data: Omit<CompanyService, "id" | "created_at">,
): Promise<CompanyService> {
  const [row] = await dbInsert<CompanyService>("company_services", data);
  return row;
}

export async function patchCompanyService(
  id: string,
  data: Partial<Omit<CompanyService, "id" | "company_id" | "created_at">>,
): Promise<CompanyService | null> {
  const rows = await dbUpdate<CompanyService>("company_services", `id=eq.${id}`, data);
  return rows[0] ?? null;
}

export async function removeCompanyService(id: string): Promise<boolean> {
  await dbDelete("company_services", `id=eq.${id}`);
  return true;
}

export async function countCompaniesCreatedBetween(start: string, end: string): Promise<number> {
  const all = await dbSelect<Company>(
    "companies",
    encodeQuery({ select: "created_at", created_at: `gte.${start}T00:00:00` }),
  );
  return all.filter((c) => c.created_at.slice(0, 10) <= end).length;
}

export async function countCompaniesCreatedToday(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  return countCompaniesCreatedBetween(today, today);
}

export async function countActiveCompanies(): Promise<number> {
  const all = await dbSelect<Company>(
    "companies",
    encodeQuery({ select: "id", stage: "eq.ativo" }),
  );
  return all.length;
}

export { COMPANY_STAGES };
