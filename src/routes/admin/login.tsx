import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { adminLogin, checkAdminAuth } from "@/lib/api/leads.functions";
import { Logo } from "@/components/landing/shared/Logo";
import { TEAM_LABELS, type TeamMember } from "@/lib/execution/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const { authenticated } = await checkAdminAuth();
    if (authenticated) {
      throw redirect({ to: "/admin" });
    }
  },
  head: () => ({
    meta: [{ title: "Raise One — Admin Login" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
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
      await adminLogin({ data: { password, person, pin: pin || undefined } });
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 radial-glow opacity-40" />

      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo />
          <h1 className="font-display text-xl font-bold tracking-tight">Central de Execução</h1>
          <p className="text-center text-sm text-muted-foreground">Acesso restrito ao time</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-card space-y-4 p-6">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Quem é você?</Label>
            <Select value={person} onValueChange={(v) => setPerson(v as TeamMember)}>
              <SelectTrigger>
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

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Senha do time</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">PIN pessoal (opcional)</Label>
            <Input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Só se configurado no servidor"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full rounded-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </Button>
        </form>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
