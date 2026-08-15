import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const requestClientMagicLink = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const { requestClientMagicLink: request } = await import(
      "@/domains/client-portal/magic-link.server"
    );
    const result = await request(data.email);
    return {
      ok: true,
      message: "Se este e-mail estiver cadastrado, você receberá um link de acesso em instantes.",
      devLink: result.devLink ?? null,
    };
  });

export const verifyClientMagicLink = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string().min(16) }))
  .handler(async ({ data }) => {
    const { verifyClientMagicLinkToken } = await import(
      "@/domains/client-portal/magic-link.server"
    );
    await verifyClientMagicLinkToken(data.token);
    return { ok: true };
  });

export const checkClientAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { getClientSessionUser } = await import("@/lib/client-auth/session.server");
  const user = await getClientSessionUser();
  return {
    authenticated: !!user,
    user,
  };
});

export const clientLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { clearClientSession } = await import("@/lib/client-auth/session.server");
  clearClientSession();
  return { ok: true };
});
