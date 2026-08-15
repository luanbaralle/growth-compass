import { dbInsert, dbSelect, dbUpdate } from "@/lib/supabase/server";
import type { ClientMagicLinkRow, CompanyUser, CompanyUserWithCompany } from "./types";

export async function findCompanyUserByEmail(email: string): Promise<CompanyUserWithCompany | null> {
  const normalized = email.trim().toLowerCase();
  const rows = await dbSelect<CompanyUserWithCompany>(
    "company_users",
    `email=eq.${encodeURIComponent(normalized)}&active=eq.true&select=*,companies(name)&limit=1`,
  );
  return rows[0] ?? null;
}

export async function findCompanyUserById(id: string): Promise<CompanyUserWithCompany | null> {
  const rows = await dbSelect<CompanyUserWithCompany>(
    "company_users",
    `id=eq.${id}&active=eq.true&select=*,companies(name)&limit=1`,
  );
  return rows[0] ?? null;
}

export async function insertCompanyUser(
  data: Pick<CompanyUser, "company_id" | "email" | "name" | "phone">,
): Promise<CompanyUser> {
  const [row] = await dbInsert<CompanyUser>("company_users", {
    company_id: data.company_id,
    email: data.email.trim().toLowerCase(),
    name: data.name.trim(),
    phone: data.phone?.trim() || null,
  });
  return row;
}

export async function insertMagicLink(data: {
  company_user_id: string;
  token_hash: string;
  expires_at: string;
}): Promise<ClientMagicLinkRow> {
  const [row] = await dbInsert<ClientMagicLinkRow>("client_magic_links", data);
  return row;
}

export async function findActiveMagicLinkByHash(tokenHash: string): Promise<
  (ClientMagicLinkRow & { company_users: CompanyUserWithCompany | null }) | null
> {
  const rows = await dbSelect<
    ClientMagicLinkRow & { company_users: CompanyUserWithCompany | null }
  >(
    "client_magic_links",
    `token_hash=eq.${encodeURIComponent(tokenHash)}&used_at=is.null&select=*,company_users(*,companies(name))&limit=1`,
  );
  return rows[0] ?? null;
}

export async function markMagicLinkUsed(id: string): Promise<void> {
  await dbUpdate("client_magic_links", `id=eq.${id}`, {
    used_at: new Date().toISOString(),
  });
}
