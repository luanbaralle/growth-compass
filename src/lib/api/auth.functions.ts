import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const osLogin = createServerFn({ method: "POST" })
  .validator(
    z.object({
      password: z.string().min(1),
      person: z.enum(["luan", "vini", "caio"]),
      pin: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { verifyPassword, verifyPersonPin, setSession } = await import(
      "@/lib/auth/session.server"
    );
    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("Raise One OS não configurado. Defina ADMIN_PASSWORD no servidor.");
    }
    if (!verifyPassword(data.password)) {
      throw new Error("Senha incorreta.");
    }
    if (!verifyPersonPin(data.person, data.pin ?? "")) {
      throw new Error("PIN incorreto para esta pessoa.");
    }
    setSession(data.person);
    return { ok: true, activePerson: data.person };
  });

export const switchOSPerson = createServerFn({ method: "POST" })
  .validator(
    z.object({
      person: z.enum(["luan", "vini", "caio"]),
      pin: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { requireAuth, verifyPersonPin, setActivePerson } = await import(
      "@/lib/auth/session.server"
    );
    requireAuth();
    if (!verifyPersonPin(data.person, data.pin ?? "")) {
      throw new Error("PIN incorreto.");
    }
    setActivePerson(data.person);
    return { ok: true, activePerson: data.person };
  });

export const osLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { clearSession } = await import("@/lib/auth/session.server");
  clearSession();
  return { ok: true };
});

export const checkOSAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { isAuthenticated, getActivePerson } = await import("@/lib/auth/session.server");
  return {
    authenticated: isAuthenticated(),
    activePerson: getActivePerson(),
  };
});

export const getOSConfigStatus = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env.SUPABASE_URL ?? "";
  let supabaseHost: string | null = null;
  if (url) {
    try {
      supabaseHost = new URL(url).hostname;
    } catch {
      supabaseHost = null;
    }
  }
  return {
    supabaseConfigured: Boolean(url && process.env.SUPABASE_SERVICE_ROLE_KEY),
    supabaseHost,
  };
});
