/**
 * Resolve company_id obrigatório a partir do prospect vinculado à sessão Copilot.
 * Sem match por nome e sem criação automática de Company/Prospect.
 */
export async function requireProposalCompanyFromSession(
  prospectId: string | null | undefined,
): Promise<{ companyId: string; prospectId: string }> {
  if (!prospectId) {
    throw new Error(
      "Não é possível gerar a proposta: esta sessão não está vinculada a um prospect. Vincule um prospect a uma empresa antes de gerar a proposta.",
    );
  }

  const prospectRepo = await import("@/domains/prospection/repository.server");
  const prospect = await prospectRepo.findProspectById(prospectId);
  if (!prospect) {
    throw new Error(
      "Não é possível gerar a proposta: o prospect vinculado à sessão não foi encontrado.",
    );
  }

  if (!prospect.company_id) {
    throw new Error(
      "Não é possível gerar a proposta: o prospect ainda não está vinculado a uma empresa. Converta/vincule o prospect a uma empresa antes de gerar a proposta.",
    );
  }

  const companyRepo = await import("@/domains/companies/repository.server");
  const company = await companyRepo.findCompanyById(prospect.company_id);
  if (!company) {
    throw new Error(
      "Não é possível gerar a proposta: a empresa vinculada ao prospect não foi encontrada. Verifique o vínculo prospect → empresa antes de gerar a proposta.",
    );
  }

  return { companyId: company.id, prospectId: prospect.id };
}
