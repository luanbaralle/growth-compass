import { getSettings, updateSettings } from "@/domains/settings/api.server";
import type { SettingsPageData } from "@/domains/settings/types";
import { TEAM_LABELS } from "@/lib/auth/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { useOSContext } from "@/os/shell/use-os-context";
import { EmptyState, PageHeader, PageSkeleton, Section, OSPage, ListItem } from "@/os/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Loader2, Settings, Shield, Users, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function SettingsPage() {
  const navigate = useNavigate();
  const { activePerson } = useOSContext();
  const [data, setData] = useState<SettingsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [defaultWhatsApp, setDefaultWhatsApp] = useState("");
  const [opsNotes, setOpsNotes] = useState("");
  const [receiptPrefix, setReceiptPrefix] = useState("R1");
  const [issuerName, setIssuerName] = useState("");
  const [issuerCpf, setIssuerCpf] = useState("");
  const [issuerEmail, setIssuerEmail] = useState("");
  const [issuerPhone, setIssuerPhone] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getSettings();
      setData(result);
      setAgencyName(result.preferences.agencyName);
      setDefaultWhatsApp(result.preferences.defaultWhatsApp);
      setOpsNotes(result.preferences.opsNotes);
      setReceiptPrefix(result.preferences.receiptPrefix);
      setIssuerName(result.preferences.issuerName);
      setIssuerCpf(result.preferences.issuerCpf);
      setIssuerEmail(result.preferences.issuerEmail);
      setIssuerPhone(result.preferences.issuerPhone);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar configurações."));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        data: {
          agencyName,
          defaultWhatsApp,
          opsNotes,
          receiptPrefix,
          issuerName,
          issuerCpf,
          issuerEmail,
          issuerPhone,
        },
      });
      toast.success("Preferências salvas");
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao salvar."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageSkeleton title="Configurações" metricCount={0} />;
  }

  if (error || !data) {
    return (
      <EmptyState
        title="Não foi possível carregar configurações"
        description={error || "Tente novamente."}
      />
    );
  }

  return (
    <OSPage>
      <PageHeader
        title="Configurações"
        description="Preferências da agência, equipe e status do sistema"
        icon={Settings}
        actions={
          activePerson && (
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              Logado como{" "}
              <strong className="text-foreground">
                {activePerson ? TEAM_LABELS[activePerson] : "—"}
              </strong>
            </span>
          )
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Preferências da agência" description="Salvas no Supabase">
          <div className="os-field-group space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="agency-name" className="text-[11px] font-medium text-muted-foreground/70">
                Nome exibido
              </Label>
              <Input
                id="agency-name"
                className="h-9"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Raise One"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="default-whatsapp" className="text-[11px] font-medium text-muted-foreground/70">
                WhatsApp padrão (interno)
              </Label>
              <Input
                id="default-whatsapp"
                className="h-9"
                value={defaultWhatsApp}
                onChange={(e) => setDefaultWhatsApp(e.target.value)}
                placeholder="5513999999999"
                inputMode="tel"
              />
              <p className="text-xs text-muted-foreground/70">
                Referência operacional. Links do site usam VITE_WHATSAPP_NUMBER no .env.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ops-notes" className="text-[11px] font-medium text-muted-foreground/70">
                Notas operacionais
              </Label>
              <Textarea
                id="ops-notes"
                value={opsNotes}
                onChange={(e) => setOpsNotes(e.target.value)}
                placeholder="Processos internos, combinados com clientes..."
                rows={4}
                className="text-sm"
              />
            </div>
            <div className="border-t border-border/30 pt-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                Dados para recibos
              </p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="receipt-prefix" className="text-[11px] font-medium text-muted-foreground/70">
                    Prefixo da numeração
                  </Label>
                  <Input
                    id="receipt-prefix"
                    className="h-9"
                    value={receiptPrefix}
                    onChange={(e) => setReceiptPrefix(e.target.value)}
                    placeholder="R1"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="issuer-name" className="text-[11px] font-medium text-muted-foreground/70">
                    Nome do emissor
                  </Label>
                  <Input
                    id="issuer-name"
                    className="h-9"
                    value={issuerName}
                    onChange={(e) => setIssuerName(e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="issuer-cpf" className="text-[11px] font-medium text-muted-foreground/70">
                      CPF
                    </Label>
                    <Input
                      id="issuer-cpf"
                      className="h-9"
                      value={issuerCpf}
                      onChange={(e) => setIssuerCpf(e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="issuer-phone" className="text-[11px] font-medium text-muted-foreground/70">
                      Telefone
                    </Label>
                    <Input
                      id="issuer-phone"
                      className="h-9"
                      value={issuerPhone}
                      onChange={(e) => setIssuerPhone(e.target.value)}
                      placeholder="(13) 99999-9999"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="issuer-email" className="text-[11px] font-medium text-muted-foreground/70">
                    E-mail
                  </Label>
                  <Input
                    id="issuer-email"
                    className="h-9"
                    value={issuerEmail}
                    onChange={(e) => setIssuerEmail(e.target.value)}
                    placeholder="contato@raiseone.com.br"
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="dashboard-btn-primary disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Salvar preferências
            </button>
          </div>
        </Section>

        <Section title="Equipe" description="Perfis do Raise One OS">
          <div className="divide-y divide-border/20 rounded-xl border border-border/20 bg-surface-elevated/20">
            {data.team.map((member) => (
              <ListItem key={member.id} className="rounded-none border-0 bg-transparent p-3.5 hover:bg-surface-elevated/30">
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{member.label}</span>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs",
                      member.pinConfigured
                        ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                        : "border border-border/40 text-muted-foreground",
                    )}
                  >
                    PIN {member.pinConfigured ? "ativo" : "opcional"}
                  </span>
                </div>
              </ListItem>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            PINs são definidos no servidor via ADMIN_PIN_LUAN, ADMIN_PIN_VINI e ADMIN_PIN_CAIO.
          </p>
        </Section>
      </div>

      <Section title="Status do sistema" description="Variáveis de ambiente (somente leitura)">
        <ul className="grid gap-2 sm:grid-cols-2">
          <StatusRow
            ok={data.system.supabaseConfigured}
            label="Supabase"
            detail={data.system.supabaseHost ?? "Não configurado"}
          />
          <StatusRow
            ok={data.system.adminPasswordConfigured}
            label="Senha do painel"
            detail={data.system.adminPasswordConfigured ? "ADMIN_PASSWORD definida" : "Ausente"}
          />
          <StatusRow
            ok={data.system.sessionSecretConfigured}
            label="Sessão"
            detail={data.system.sessionSecretConfigured ? "SESSION_SECRET definida" : "Ausente"}
          />
          <StatusRow
            ok={data.system.whatsappConfigured}
            label="WhatsApp (site)"
            detail={
              data.system.whatsappConfigured
                ? "VITE_WHATSAPP_NUMBER definido"
                : "Ausente"
            }
          />
        </ul>
      </Section>

      <Section title="Integrações" description="Conexões e modos de operação">
        <div className="grid gap-3 sm:grid-cols-2">
          {data.integrations.map((integration) => (
            <div
              key={integration.id}
              className="rounded-lg border border-border/20 bg-surface-elevated/25 p-4 transition-colors hover:border-border/35"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand" />
                  <span className="font-medium">{integration.label}</span>
                </div>
                <IntegrationBadge mode={integration.mode} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{integration.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Segurança" description="Boas práticas">
        <div className="flex gap-3 rounded-lg border border-border/20 bg-surface-elevated/25 p-4">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Senha e PINs nunca são exibidos nem editáveis por aqui — ficam no .env do servidor.</p>
            <p>O acesso ao OS é protegido por cookie httpOnly com expiração de 7 dias.</p>
            <p>Dados sensíveis de clientes ficam no Supabase com RLS bloqueando acesso público.</p>
          </div>
        </div>
      </Section>
    </OSPage>
  );
}

function StatusRow({
  ok,
  label,
  detail,
}: {
  ok: boolean;
  label: string;
  detail: string;
}) {
  return (
    <li className="flex items-start gap-2.5 rounded-lg border border-border/20 bg-surface-elevated/25 px-3.5 py-3 text-sm">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </li>
  );
}

function IntegrationBadge({ mode }: { mode: "manual" | "api" | "soon" }) {
  const config = {
    manual: { label: "Manual", className: "text-amber-300 border-amber-400/30 bg-amber-400/10" },
    api: { label: "Conectado", className: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10" },
    soon: { label: "Pendente", className: "text-zinc-400 border-zinc-500/30 bg-zinc-500/10" },
  }[mode];

  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", config.className)}>
      {config.label}
    </span>
  );
}
