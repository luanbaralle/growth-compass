import {
  addProspectInteraction,
  convertProspect,
  deleteProspect,
  getProspect,
  updateProspect,
} from "@/domains/prospection/api.server";
import { ConversationAssistant } from "@/domains/prospection/components/ConversationAssistant";
import { ProspectChecklist } from "@/domains/prospection/components/ProspectChecklist";
import { ProspectOpportunities } from "@/domains/prospection/components/ProspectOpportunities";
import { ProspectTimeline } from "@/domains/prospection/components/ProspectTimeline";
import type { Prospect, ProspectStatus } from "@/domains/prospection/types";
import { SEGMENT_OPTIONS } from "@/domains/prospection/copilot/types";
import {
  PROSPECT_STATUSES,
  STATUS_ACCENT,
  STATUS_LABELS,
  buildWhatsAppUrl,
  formatProspectDate,
  getNextActionUrgency,
  NEXT_ACTION_URGENCY_LABELS,
} from "@/domains/prospection/types";
import { EmptyState, PageHeader, PageSkeleton, Section, OSPage } from "@/os/ui";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Loader2,
  MapPin,
  MessageSquare,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type DetailData = Awaited<ReturnType<typeof getProspect>>;

export function ProspectDetailPage() {
  const { id } = useParams({ from: "/os/prospeccao/$id" });
  const navigate = useNavigate();
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [converting, setConverting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [conversationForm, setConversationForm] = useState({
    sent: "",
    received: "",
    notes: "",
  });

  const load = useCallback(async () => {
    setError("");
    try {
      const result = await getProspect({ data: { id } });
      setData(result);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar prospect."));
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleConvert = async () => {
    setConverting(true);
    try {
      const result = await convertProspect({ data: { id } });
      toast.success(
        result.alreadyConverted
          ? "Prospect já estava convertido."
          : "Convertido em empresa com sucesso.",
      );
      await load();
      if (!result.alreadyConverted) {
        navigate({ to: "/os/empresas/$id", params: { id: result.companyId } });
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao converter."));
    } finally {
      setConverting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProspect({ data: { id } });
      toast.success("Prospect excluído.");
      navigate({ to: "/os/prospeccao" });
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao excluir prospect."));
    } finally {
      setDeleting(false);
    }
  };

  const handleLogConversation = async () => {
    const { sent, received, notes } = conversationForm;
    if (!sent && !received && !notes) return;

    try {
      if (sent) {
        await addProspectInteraction({
          data: {
            prospectId: id,
            type: "message_sent",
            title: "Mensagem enviada",
            body: sent,
            direction: "out",
          },
        });
      }
      if (received) {
        await addProspectInteraction({
          data: {
            prospectId: id,
            type: "message_received",
            title: "Resposta recebida",
            body: received,
            direction: "in",
          },
        });
      }
      if (notes) {
        await addProspectInteraction({
          data: {
            prospectId: id,
            type: "note",
            title: "Nota",
            body: notes,
            direction: "internal",
          },
        });
      }
      setConversationForm({ sent: "", received: "", notes: "" });
      await load();
      toast.success("Conversa registrada.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao registrar conversa."));
    }
  };

  if (loading) return <PageSkeleton title="Prospect" metricCount={0} />;
  if (error || !data) {
    return (
      <EmptyState
        title="Prospect não encontrado"
        description={error || "Verifique o link e tente novamente."}
      />
    );
  }

  const { prospect, interactions, checklist, opportunities } = data;
  const conversations = interactions.filter((i) =>
    ["message_sent", "message_received", "note", "follow_up"].includes(i.type),
  );

  return (
    <OSPage>
      <PageHeader
        title={prospect.name}
        icon={Target}
        actions={
          <>
            <Link to="/os/prospeccao" className="dashboard-btn-ghost">
              <ArrowLeft className="h-4 w-4" />
              Pipeline
            </Link>
            <Link
              to="/os/copilot"
              search={{
                prospectName: prospect.name,
                companyName: prospect.name,
                prospectId: prospect.id,
              }}
              className="dashboard-btn-ghost"
            >
              <Sparkles className="h-4 w-4" />
              Copilot
            </Link>
            {prospect.company_id ? (
              <Link
                to="/os/empresas/$id"
                params={{ id: prospect.company_id }}
                className="dashboard-btn-primary"
              >
                <Building2 className="h-4 w-4" />
                Ver empresa
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => void handleConvert()}
                disabled={converting}
                className="dashboard-btn-primary disabled:opacity-50"
              >
                {converting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Building2 className="h-4 w-4" />
                )}
                Converter em Empresa
              </button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={deleting}
                  className="dashboard-btn-ghost text-destructive hover:text-destructive disabled:opacity-50"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Excluir
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir prospect?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {prospect.company_id
                      ? "O registro de prospecção será removido. A empresa convertida não será excluída."
                      : "Esta ação não pode ser desfeita. Conversas, checklist e histórico serão removidos."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => void handleDelete()}
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        {(prospect.city || prospect.state) && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
            <MapPin className="h-3 w-3 shrink-0 opacity-60" strokeWidth={1.75} />
            {[prospect.city, prospect.state].filter(Boolean).join(", ")}
          </span>
        )}
        <span className="prospect-status-badge">
          <span
            className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_ACCENT[prospect.status])}
            aria-hidden
          />
          {STATUS_LABELS[prospect.status]}
        </span>
        <span className="text-xs text-muted-foreground/50">
          Cadastro {formatProspectDate(prospect.created_at)}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_1fr]">
        <div className="space-y-5">
          <Section title="Informações">
            <ProspectInfoForm prospect={prospect} onSaved={load} />
          </Section>
          <Section title="Próxima ação">
            <NextActionForm prospect={prospect} onSaved={load} />
          </Section>
        </div>

        <div className="space-y-5">
          <Section title="Assistente de Conversa" noPadding>
            <div className="prospect-panel-inner">
              <ConversationAssistant prospectId={prospect.id} onUpdated={load} />
            </div>
          </Section>

          <Tabs defaultValue="diagnostico" className="space-y-4">
            <TabsList className="os-tabs-list justify-start bg-transparent">
              <TabsTrigger
                value="diagnostico"
                className="os-tab-trigger data-[state=active]:bg-surface-elevated/80 data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Diagnóstico
              </TabsTrigger>
              <TabsTrigger
                value="oportunidades"
                className="os-tab-trigger data-[state=active]:bg-surface-elevated/80 data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Oportunidades
              </TabsTrigger>
              <TabsTrigger
                value="conversas"
                className="os-tab-trigger data-[state=active]:bg-surface-elevated/80 data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Conversas
              </TabsTrigger>
              <TabsTrigger
                value="historico"
                className="os-tab-trigger data-[state=active]:bg-surface-elevated/80 data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                Histórico
              </TabsTrigger>
            </TabsList>
            <TabsContent value="diagnostico" className="mt-0">
              <Section title="Checklist" noPadding>
                <div className="prospect-panel-inner">
                  <ProspectChecklist
                    prospectId={prospect.id}
                    items={checklist}
                    onUpdated={load}
                  />
                </div>
              </Section>
            </TabsContent>
            <TabsContent value="oportunidades" className="mt-0">
              <Section title="Oportunidades identificadas" noPadding>
                <div className="prospect-panel-inner">
                  <ProspectOpportunities
                    prospectId={prospect.id}
                    items={opportunities}
                    onUpdated={load}
                  />
                </div>
              </Section>
            </TabsContent>
            <TabsContent value="conversas" className="mt-0 space-y-5">
              <Section title="Registrar conversa">
                <div className="space-y-4">
                  <Field label="Mensagem enviada">
                    <Textarea
                      value={conversationForm.sent}
                      onChange={(e) =>
                        setConversationForm((f) => ({ ...f, sent: e.target.value }))
                      }
                      rows={2}
                      className="text-sm"
                    />
                  </Field>
                  <Field label="Resposta recebida">
                    <Textarea
                      value={conversationForm.received}
                      onChange={(e) =>
                        setConversationForm((f) => ({ ...f, received: e.target.value }))
                      }
                      rows={2}
                      className="text-sm"
                    />
                  </Field>
                  <Field label="Notas">
                    <Textarea
                      value={conversationForm.notes}
                      onChange={(e) =>
                        setConversationForm((f) => ({ ...f, notes: e.target.value }))
                      }
                      rows={2}
                      className="text-sm"
                    />
                  </Field>
                  <Button size="sm" onClick={() => void handleLogConversation()}>
                    <MessageSquare className="h-4 w-4" />
                    Registrar
                  </Button>
                </div>
              </Section>
              <Section title="Memória comercial">
                {conversations.length === 0 ? (
                  <p className="text-sm text-muted-foreground/70">Nenhuma conversa registrada.</p>
                ) : (
                  <ProspectTimeline interactions={conversations} />
                )}
              </Section>
            </TabsContent>
            <TabsContent value="historico" className="mt-0">
              <Section title="Timeline">
                <ProspectTimeline interactions={interactions} />
              </Section>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </OSPage>
  );
}

function ProspectInfoForm({
  prospect,
  onSaved,
}: {
  prospect: Prospect;
  onSaved: () => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [form, setForm] = useState({
    name: prospect.name,
    segmentSlug: prospect.segment_slug ?? "saloes",
    category: prospect.category ?? "",
    city: prospect.city ?? "",
    state: prospect.state ?? "",
    phone: prospect.phone ?? "",
    whatsapp: prospect.whatsapp ?? "",
    instagram: prospect.instagram ?? "",
    website: prospect.website ?? "",
    googleMapsUrl: prospect.google_maps_url ?? "",
    source: prospect.source ?? "",
    ownerId: (prospect.owner_id as TeamMember) ?? "",
    status: prospect.status,
    notes: prospect.notes ?? "",
  });

  useEffect(() => {
    setForm({
      name: prospect.name,
      segmentSlug: prospect.segment_slug ?? "saloes",
      category: prospect.category ?? "",
      city: prospect.city ?? "",
      state: prospect.state ?? "",
      phone: prospect.phone ?? "",
      whatsapp: prospect.whatsapp ?? "",
      instagram: prospect.instagram ?? "",
      website: prospect.website ?? "",
      googleMapsUrl: prospect.google_maps_url ?? "",
      source: prospect.source ?? "",
      ownerId: (prospect.owner_id as TeamMember) ?? "",
      status: prospect.status,
      notes: prospect.notes ?? "",
    });
  }, [prospect]);

  const save = (patch: Partial<typeof form>) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await updateProspect({
        data: {
          id: prospect.id,
          name: next.name,
          segmentSlug: next.segmentSlug || undefined,
          category: next.category || undefined,
          city: next.city || undefined,
          state: next.state || undefined,
          phone: next.phone || undefined,
          whatsapp: next.whatsapp || undefined,
          instagram: next.instagram || undefined,
          website: next.website || undefined,
          googleMapsUrl: next.googleMapsUrl || undefined,
          source: next.source || undefined,
          ownerId: next.ownerId || undefined,
          status: next.status,
          notes: next.notes || undefined,
        },
      });
      onSaved();
    }, 500);
  };

  const whatsAppUrl = buildWhatsAppUrl(form.whatsapp);

  return (
    <div className="space-y-5 text-sm">
      <FieldGroup title="Empresa">
        <Field label="Nome" value={form.name} onChange={(v) => save({ name: v })} />
        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground/70">Segmento</Label>
          <Select value={form.segmentSlug} onValueChange={(v) => save({ segmentSlug: v })}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEGMENT_OPTIONS.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Field label="Categoria" value={form.category} onChange={(v) => save({ category: v })} />
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <Field label="Cidade" value={form.city} onChange={(v) => save({ city: v })} />
          </div>
          <Field label="UF" value={form.state} onChange={(v) => save({ state: v })} />
        </div>
      </FieldGroup>

      <FieldGroup title="Contato">
        <Field label="Telefone" value={form.phone} onChange={(v) => save({ phone: v })} />
        <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => save({ whatsapp: v })} />
        {whatsAppUrl && (
          <a href={whatsAppUrl} target="_blank" rel="noreferrer" className="prospect-link-action">
            Abrir no WhatsApp <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <Field label="Instagram" value={form.instagram} onChange={(v) => save({ instagram: v })} />
        <Field label="Website" value={form.website} onChange={(v) => save({ website: v })} />
        <Field
          label="Google Maps"
          value={form.googleMapsUrl}
          onChange={(v) => save({ googleMapsUrl: v })}
        />
        {form.googleMapsUrl && (
          <a href={form.googleMapsUrl} target="_blank" rel="noreferrer" className="prospect-link-action">
            Abrir no Maps <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </FieldGroup>

      <FieldGroup title="Gestão">
        <Field label="Origem" value={form.source} onChange={(v) => save({ source: v })} />
        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground/70">Responsável</Label>
          <Select
            value={form.ownerId || "none"}
            onValueChange={(v) => save({ ownerId: v === "none" ? "" : (v as TeamMember) })}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">—</SelectItem>
              {TEAM_MEMBERS.map((m) => (
                <SelectItem key={m} value={m}>
                  {TEAM_LABELS[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground/70">Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => save({ status: v as ProspectStatus })}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROSPECT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  <span className="flex items-center gap-2">
                    <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_ACCENT[s])} />
                    {STATUS_LABELS[s]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-medium text-muted-foreground/70">Observações</Label>
          <Textarea
            value={form.notes}
            onChange={(e) => save({ notes: e.target.value })}
            rows={3}
            className="text-sm"
          />
        </div>
      </FieldGroup>
    </div>
  );
}

function NextActionForm({
  prospect,
  onSaved,
}: {
  prospect: Prospect;
  onSaved: () => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [nextAction, setNextAction] = useState(prospect.next_action ?? "");
  const [nextActionDate, setNextActionDate] = useState(prospect.next_action_date ?? "");

  useEffect(() => {
    setNextAction(prospect.next_action ?? "");
    setNextActionDate(prospect.next_action_date ?? "");
  }, [prospect]);

  const save = (action: string, date: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      await updateProspect({
        data: {
          id: prospect.id,
          nextAction: action || undefined,
          nextActionDate: date || "",
        },
      });
      onSaved();
    }, 500);
  };

  const urgency = getNextActionUrgency(nextActionDate);

  return (
    <div className="space-y-4">
      {urgency && (
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium",
            urgency === "overdue" && "bg-red-400/12 text-red-400",
            urgency === "today" && "bg-amber-400/12 text-amber-400",
            urgency === "future" && "bg-brand/8 text-brand/90",
          )}
        >
          {NEXT_ACTION_URGENCY_LABELS[urgency]}
        </span>
      )}
      <Field label="Ação">
        <Input
          value={nextAction}
          onChange={(e) => {
            setNextAction(e.target.value);
            save(e.target.value, nextActionDate);
          }}
          placeholder="Ex: Enviar follow-up"
          className="h-9"
        />
      </Field>
      <Field label="Data">
        <Input
          type="date"
          value={nextActionDate}
          onChange={(e) => {
            setNextActionDate(e.target.value);
            save(nextAction, e.target.value);
          }}
          className="h-9"
        />
      </Field>
    </div>
  );
}

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="prospect-field-group">
      <p className="prospect-field-group-title">{title}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-medium text-muted-foreground/70">{label}</Label>
      {children ?? (
        <Input
          className="h-9"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      )}
    </div>
  );
}
