import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { osLogin, checkOSAuth } from "@/lib/api/auth.functions";
import { Logo } from "@/components/landing/shared/Logo";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/os/login")({
  beforeLoad: async () => {
    const { authenticated } = await checkOSAuth();
    if (authenticated) {
      throw redirect({ to: "/os" });
    }
  },
  head: () => ({
    meta: [{ title: "Raise One OS — Login" }, { name: "robots", content: "noindex" }],
  }),
  component: OSLoginPage,
});

function OSLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [person, setPerson] = useState<TeamMember>("vini");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await osLogin({ data: { password, person, pin: pin || undefined } });
      navigate({ to: "/os" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
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
          <p className="os-login-eyebrow">Sistema operacional interno</p>
        </header>

        <div className="os-login-card">
          <div className="os-login-card-accent" />
          <form onSubmit={handleSubmit} className="os-login-card-body space-y-4">
            <p className="os-login-card-title">Acesso ao painel</p>

            <div className="os-login-field">
              <span className="os-login-field-label">Quem é você?</span>
              <div className="os-login-person-row">
                <div className="os-login-person-avatar" aria-hidden>
                  {TEAM_LABELS[person].charAt(0)}
                </div>
                <Select
                  value={person}
                  onValueChange={(v) => setPerson(v as TeamMember)}
                >
                  <SelectTrigger className="os-login-person-select h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TEAM_LABELS) as TeamMember[]).map((m) => (
                      <SelectItem key={m} value={m}>
                        {TEAM_LABELS[m]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="os-login-field">
              <label htmlFor="os-login-password" className="os-login-field-label">
                Senha do time
              </label>
              <Input
                id="os-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="h-10"
              />
            </div>

            <div className="os-login-field">
              <label htmlFor="os-login-pin" className="os-login-field-label">
                PIN pessoal <span className="normal-case tracking-normal">(opcional)</span>
              </label>
              <Input
                id="os-login-pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Só se configurado no servidor"
                className="h-10"
              />
            </div>

            {error && <p className="os-login-error">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="dashboard-btn-primary os-login-submit justify-center"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar no painel"}
            </button>
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
