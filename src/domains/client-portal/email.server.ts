import process from "node:process";

type SendMagicLinkInput = {
  to: string;
  name: string;
  verifyUrl: string;
};

export async function sendClientMagicLinkEmail(input: SendMagicLinkInput): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.CLIENT_EMAIL_FROM ?? process.env.EMAIL_FROM ?? "Raise One <acesso@raiseone.com.br>";

  const subject = "Seu acesso ao Raise One Client";
  const html = `
    <p>Olá, ${escapeHtml(input.name)}.</p>
    <p>Use o link abaixo para entrar no seu painel Raise One. Ele expira em 15 minutos.</p>
    <p><a href="${input.verifyUrl}">Entrar no painel</a></p>
    <p>Se você não solicitou este acesso, ignore este e-mail.</p>
  `.trim();

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[client-portal] Magic link (dev):", input.verifyUrl);
      return { ok: false };
    }
    throw new Error("RESEND_API_KEY não configurada para envio de magic links.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Falha ao enviar e-mail: ${res.status} ${text}`);
  }

  return { ok: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
