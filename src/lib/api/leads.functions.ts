import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  clearAdminSession,
  getActivePerson,
  isAdminAuthenticated,
  setActivePerson,
  setAdminSession,
  verifyAdminPassword,
  verifyPersonPin,
} from "@/lib/admin-auth.server";
import { createLead, deleteLead as deleteLeadFromStore, listLeads, updateLeadStatus } from "@/lib/leads/store.server";
import { buildLeadWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const utmSchema = z.object({
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
});

const submitLeadSchema = z
  .object({
    name: z.string().min(2).max(120),
    phone: z.string().min(8).max(20),
    city: z.string().min(2).max(120),
    cityState: z.string().max(2).optional(),
    business: z.string().min(2).max(120),
    segment: z.string().min(1),
    templateSlug: z.string().min(1),
    negocio: z.string().optional(),
    displayLabel: z.string().optional(),
    microverticalId: z.string().optional(),
    matchLevel: z.enum(["exact", "related", "dynamic"]).optional(),
    source: z.enum(["hub", "lp", "direct"]),
    link: z.string().max(200).optional(),
  })
  .merge(utmSchema);

export const submitLead = createServerFn({ method: "POST" })
  .validator(submitLeadSchema)
  .handler(async ({ data }) => {
    const lead = await createLead(data);

    const whatsappUrl = buildWhatsAppUrl(
      buildLeadWhatsAppMessage({
        name: lead.name,
        business: lead.displayLabel ?? lead.business,
        city: lead.city,
        cityState: lead.cityState,
        link: lead.link,
      }),
    );

    return {
      leadId: lead.id,
      whatsappUrl,
    };
  });

export const adminLogin = createServerFn({ method: "POST" })
  .validator(
    z.object({
      password: z.string().min(1),
      person: z.enum(["luan", "vini", "caio"]),
      pin: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("Painel admin não configurado. Defina ADMIN_PASSWORD no servidor.");
    }
    if (!verifyAdminPassword(data.password)) {
      throw new Error("Senha incorreta.");
    }
    if (!verifyPersonPin(data.person, data.pin ?? "")) {
      throw new Error("PIN incorreto para esta pessoa.");
    }
    setAdminSession(data.person);
    return { ok: true, activePerson: data.person };
  });

export const switchAdminPerson = createServerFn({ method: "POST" })
  .validator(
    z.object({
      person: z.enum(["luan", "vini", "caio"]),
      pin: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!isAdminAuthenticated()) {
      throw new Error("Não autorizado.");
    }
    if (!verifyPersonPin(data.person, data.pin ?? "")) {
      throw new Error("PIN incorreto.");
    }
    setActivePerson(data.person);
    return { ok: true, activePerson: data.person };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  clearAdminSession();
  return { ok: true };
});

export const checkAdminAuth = createServerFn({ method: "GET" }).handler(async () => {
  return {
    authenticated: isAdminAuthenticated(),
    activePerson: getActivePerson(),
  };
});

export const getLeads = createServerFn({ method: "GET" }).handler(async () => {
  if (!isAdminAuthenticated()) {
    throw new Error("Não autorizado.");
  }
  return listLeads();
});

export const updateLead = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().uuid(),
      status: z.enum(["new", "contacted", "converted", "lost"]),
      notes: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!isAdminAuthenticated()) {
      throw new Error("Não autorizado.");
    }
    const lead = await updateLeadStatus(data.id, data.status, data.notes);
    if (!lead) throw new Error("Lead não encontrado.");
    return lead;
  });

export const deleteLead = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    if (!isAdminAuthenticated()) {
      throw new Error("Não autorizado.");
    }
    const removed = await deleteLeadFromStore(data.id);
    if (!removed) throw new Error("Lead não encontrado.");
    return { ok: true };
  });
