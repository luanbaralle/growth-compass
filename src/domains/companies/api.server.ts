import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  addNoteSchema,
  changeStageSchema,
  companyIdSchema,
  createCompanySchema,
  createLinkSchema,
  createServiceSchema,
  fileIdSchema,
  idSchema,
  linkIdSchema,
  listCompaniesSchema,
  serviceIdSchema,
  submitCompanyFormSchema,
  updateCompanySchema,
  updateLinkSchema,
  updateServiceSchema,
  uploadFileSchema,
  uploadLogoSchema,
} from "@/domains/companies/schema";
import { buildLeadWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export const submitLead = createServerFn({ method: "POST" })
  .validator(submitCompanyFormSchema)
  .handler(async ({ data }) => {
    const companyService = await import("@/domains/companies/service.server");
    const company = await companyService.createFromPublicForm(data);

    const whatsappUrl = buildWhatsAppUrl(
      buildLeadWhatsAppMessage({
        name: data.name,
        business: data.displayLabel ?? data.business,
        city: data.city,
        cityState: data.cityState,
        link: data.link,
      }),
    );

    return {
      leadId: company.id,
      whatsappUrl,
    };
  });

export const listCompanies = createServerFn({ method: "GET" })
  .validator(listCompaniesSchema.optional())
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      return companyService.listCompanies(data ?? {});
    });
  });

export const getCompany = createServerFn({ method: "GET" })
  .validator(idSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      const result = await companyService.getCompany(data.id);
      if (!result) throw new Error("Empresa não encontrada.");
      return result;
    });
  });

export const createCompany = createServerFn({ method: "POST" })
  .validator(createCompanySchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const companyService = await import("@/domains/companies/service.server");
      return companyService.createCompany(data, author);
    });
  });

export const updateCompany = createServerFn({ method: "POST" })
  .validator(updateCompanySchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const companyService = await import("@/domains/companies/service.server");
      const { id, ...patch } = data;
      const company = await companyService.updateCompany(id, patch, author);
      if (!company) throw new Error("Empresa não encontrada.");
      return company;
    });
  });

export const deleteCompany = createServerFn({ method: "POST" })
  .validator(idSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      await companyService.deleteCompany(data.id);
      return { ok: true };
    });
  });

export const changeCompanyStage = createServerFn({ method: "POST" })
  .validator(changeStageSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const companyService = await import("@/domains/companies/service.server");
      const company = await companyService.changeStage(data.companyId, data.stage, author);
      if (!company) throw new Error("Empresa não encontrada.");
      return company;
    });
  });

export const addCompanyNote = createServerFn({ method: "POST" })
  .validator(addNoteSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const companyService = await import("@/domains/companies/service.server");
      return companyService.addNote(
        data.companyId,
        data.body,
        author,
        data.title ?? "Anotação",
      );
    });
  });

export const uploadCompanyFile = createServerFn({ method: "POST" })
  .validator(uploadFileSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const companyService = await import("@/domains/companies/service.server");
      return companyService.uploadFile(
        data.companyId,
        data.name,
        data.category,
        data.mimeType,
        data.base64,
        author,
        data.financeEntryId,
      );
    });
  });

export const uploadCompanyLogo = createServerFn({ method: "POST" })
  .validator(uploadLogoSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      return companyService.uploadLogo(data.companyId, data.mimeType, data.base64);
    });
  });

export const removeCompanyLogo = createServerFn({ method: "POST" })
  .validator(companyIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      return companyService.removeLogo(data.companyId);
    });
  });

export const deleteCompanyFile = createServerFn({ method: "POST" })
  .validator(fileIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      const removed = await companyService.deleteFile(data.id, data.companyId);
      if (!removed) throw new Error("Arquivo não encontrado.");
      return { ok: true };
    });
  });

export const getCompanyFileUrl = createServerFn({ method: "GET" })
  .validator(fileIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      const result = await companyService.getFileDownloadUrl(data.id, data.companyId);
      if (!result) throw new Error("Arquivo não encontrado.");
      return result;
    });
  });

export const createCompanyLink = createServerFn({ method: "POST" })
  .validator(createLinkSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      return companyService.createLink(data);
    });
  });

export const updateCompanyLink = createServerFn({ method: "POST" })
  .validator(updateLinkSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      const { id, companyId: _cid, ...patch } = data;
      const link = await companyService.updateLink(id, patch);
      if (!link) throw new Error("Link não encontrado.");
      return link;
    });
  });

export const deleteCompanyLink = createServerFn({ method: "POST" })
  .validator(linkIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      await companyService.deleteLink(data.id);
      return { ok: true };
    });
  });

export const createCompanyService = createServerFn({ method: "POST" })
  .validator(createServiceSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      return companyService.createService(data);
    });
  });

export const updateCompanyService = createServerFn({ method: "POST" })
  .validator(updateServiceSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      const { id, companyId: _cid, ...patch } = data;
      const service = await companyService.updateService(id, patch);
      if (!service) throw new Error("Serviço não encontrado.");
      return service;
    });
  });

export const deleteCompanyService = createServerFn({ method: "POST" })
  .validator(serviceIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const companyService = await import("@/domains/companies/service.server");
      await companyService.deleteService(data.id);
      return { ok: true };
    });
  });

export const getDashboardStats = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const companyService = await import("@/domains/companies/service.server");
    return companyService.getDashboardCompanyStats();
  });
});
