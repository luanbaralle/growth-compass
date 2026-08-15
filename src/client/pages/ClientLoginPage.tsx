import { Link } from "@tanstack/react-router";
import { requestClientMagicLink } from "@/client/auth.functions";
import { Logo } from "@/components/landing/shared/Logo";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";

export function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevLink(null);
    setLoading(true);
    try {
      const result = await requestClientMagicLink({ data: { email } });
      setSent(true);
      setMessage(result.message);
      setDevLink(result.devLink);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="os-login-page dashboard-page-bg">
      <div className="os-login-ambient" aria-hidden>
        <div className="os-login-glow-primary" />
        <div className="os-login-glow-secondary" />
        <div className="os-login-grid" />
      </div>

      <div className="os-login-shell">
        <header className="os-login-brand">
          <Logo size="loginHero" />
          <p className="os-login-eyebrow">Painel do cliente</p>
        </header>

        <div className="os-login-card">
          <div className="os-login-card-accent" />
          <form onSubmit={handleSubmit} className="os-login-card-body space-y-4">
            <p className="os-login-card-title">
              {sent ? "Verifique seu e-mail" : "Acesso seguro"}
            </p>

            {!sent ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Enviaremos um link de acesso para o e-mail cadastrado pela Raise One.
                </p>
                <div className="os-login-field">
                  <label htmlFor="client-login-email" className="os-login-field-label">
                    E-mail
                  </label>
                  <Input
                    id="client-login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="h-10"
                    placeholder="voce@empresa.com"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>{message}</p>
                </div>
                {devLink && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
                    <p className="font-medium text-amber-700 dark:text-amber-300">Modo dev</p>
                    <a href={devLink} className="mt-1 break-all text-primary underline">
                      {devLink}
                    </a>
                  </div>
                )}
                <button
                  type="button"
                  className="text-primary underline-offset-2 hover:underline"
                  onClick={() => {
                    setSent(false);
                    setDevLink(null);
                  }}
                >
                  Usar outro e-mail
                </button>
              </div>
            )}

            {error && <p className="os-login-error">{error}</p>}

            {!sent && (
              <button
                type="submit"
                disabled={loading}
                className="dashboard-btn-primary os-login-submit justify-center"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar link de acesso"}
              </button>
            )}
          </form>
        </div>

        <Link to="/" className="os-login-back">
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
