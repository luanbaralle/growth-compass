import {
  addProspectInteraction,
  getCopilotBundle,
  saveAssistantState,
  updateProspect,
} from "@/domains/prospection/api.server";
import type { CopilotBundle } from "@/domains/prospection/copilot/types";
import { SEGMENT_OPTIONS } from "@/domains/prospection/copilot/types";
import {
  getContinuations,
  getRaiseOneReply,
  personalize,
  rankOpenings,
} from "@/domains/prospection/copilot/engine";
import { getErrorMessage } from "@/lib/api/client-errors";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, Copy, Loader2, MessageCircle, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export function ConversationAssistant({
  prospectId,
  onUpdated,
}: {
  prospectId: string;
  onUpdated: () => void;
}) {
  const [bundle, setBundle] = useState<CopilotBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedObs, setSelectedObs] = useState<string[]>([]);
  const [openingText, setOpeningText] = useState("");
  const [continuationText, setContinuationText] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCopilotBundle({ data: { id: prospectId } });
      setBundle(data);
      setSelectedObs(data.state.selected_observations);
      setOpeningText(data.state.opening_text ?? "");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar assistente."));
    } finally {
      setLoading(false);
    }
  }, [prospectId]);

  useEffect(() => {
    void load();
  }, [load]);

  const step = bundle?.state.step ?? "observations";

  const openings = useMemo(() => {
    if (!bundle) return [];
    return rankOpenings(bundle.segment.openings, selectedObs, 5);
  }, [bundle, selectedObs]);

  const persist = async (
    patch: Parameters<typeof saveAssistantState>[0]["data"] extends infer D ? Omit<D, "prospectId"> : never,
  ) => {
    setSaving(true);
    try {
      const state = await saveAssistantState({ data: { prospectId, ...patch } });
      setBundle((b) => (b ? { ...b, state } : b));
    } finally {
      setSaving(false);
    }
  };

  const toggleObs = (key: string) => {
    setSelectedObs((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const goOpenings = async () => {
    if (selectedObs.length === 0) {
      toast.error("Selecione pelo menos uma observação.");
      return;
    }
    await persist({ step: "openings", selectedObservations: selectedObs });
  };

  const selectOpening = (id: string, template: string) => {
    const text = personalize(template, {
      name: bundle!.prospect.name,
      city: bundle!.prospect.city,
      business: bundle!.prospect.name,
    });
    setOpeningText(text);
    void persist({
      step: "openings",
      selectedOpeningId: id,
      openingText: text,
      selectedObservations: selectedObs,
    });
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copiado.");
  };

  const markOpeningUsed = async () => {
    if (!openingText.trim()) return;
    await addProspectInteraction({
      data: {
        prospectId,
        type: "message_sent",
        title: "Abertura enviada",
        body: openingText,
        direction: "out",
      },
    });
    await persist({
      step: "awaiting_reply",
      openingUsed: true,
      openingText,
      replyStatus: "waiting",
    });
    await updateProspect({
      data: { id: prospectId, status: "primeiro_contato" },
    });
    onUpdated();
    toast.success("Mensagem registrada.");
  };

  const setReply = async (replied: boolean) => {
    if (!replied) {
      await persist({ step: "no_reply", replyStatus: "no_reply" });
      return;
    }
    try {
      await addProspectInteraction({
        data: {
          prospectId,
          type: "message_received",
          title: "Resposta recebida",
          body: "Prospect respondeu (assistente de conversa).",
          direction: "in",
        },
      });
      await updateProspect({
        data: { id: prospectId, status: "respondeu" },
      });
      await persist({ step: "response_state", replyStatus: "replied" });
      onUpdated();
      toast.success("Status atualizado: Respondeu.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao registrar resposta."));
    }
  };

  const pickResponseState = async (key: string) => {
    await persist({ step: "continuation", responseStateKey: key });
    const conts = bundle ? getContinuations(bundle.segment, key, 3) : [];
    const raiseOne = bundle ? getRaiseOneReply(bundle.segment, key) : undefined;
    const first = raiseOne?.template ?? conts[0]?.template ?? "";
    setContinuationText(
      personalize(first, {
        name: bundle!.prospect.name,
        city: bundle!.prospect.city,
        business: bundle!.prospect.name,
      }),
    );
  };

  const applyNoReply = async (actionKey: string) => {
    const action = bundle?.segment.noReplyActions.find((a) => a.key === actionKey);
    if (!action) return;

    if (action.followUpDays) {
      const d = new Date();
      d.setDate(d.getDate() + action.followUpDays);
      const iso = d.toISOString().slice(0, 10);
      await updateProspect({
        data: {
          id: prospectId,
          nextAction: "Follow-up assistente",
          nextActionDate: iso,
        },
      });
    }
    if (actionKey === "close") {
      await addProspectInteraction({
        data: {
          prospectId,
          type: "note",
          title: "Tentativa encerrada",
          body: action.hint,
          direction: "internal",
        },
      });
      await persist({ step: "done" });
    } else {
      await addProspectInteraction({
        data: {
          prospectId,
          type: "note",
          title: action.label,
          body: action.hint,
          direction: "internal",
        },
      });
      await persist({ step: "done" });
    }
    onUpdated();
    toast.success(action.label);
  };

  const resetAssistant = async () => {
    setSelectedObs([]);
    setOpeningText("");
    setContinuationText("");
    await persist({
      step: "observations",
      selectedObservations: [],
      selectedOpeningId: null,
      openingText: null,
      openingUsed: false,
      replyStatus: null,
      responseStateKey: null,
    });
  };

  const changeSegment = async (slug: string) => {
    await updateProspect({ data: { id: prospectId, segmentSlug: slug } });
    await resetAssistant();
    await load();
  };

  if (loading || !bundle) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const continuations = bundle.state.response_state_key
    ? getContinuations(bundle.segment, bundle.state.response_state_key, 3)
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4 text-brand" />
          <span>{bundle.segment.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={bundle.segmentSlug} onValueChange={(v) => void changeSegment(v)}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
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
          <Button variant="ghost" size="sm" onClick={() => void resetAssistant()} disabled={saving}>
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {step === "observations" && (
        <div className="space-y-3">
          <p className="text-sm font-medium">O que você observou nesta empresa?</p>
          <div className="grid max-h-[280px] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {bundle.segment.observations.map((obs) => (
              <label
                key={obs.key}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-md border border-border/50 px-3 py-2 text-sm transition-colors",
                  selectedObs.includes(obs.key) && "border-brand/40 bg-brand/5",
                )}
              >
                <Checkbox
                  checked={selectedObs.includes(obs.key)}
                  onCheckedChange={() => toggleObs(obs.key)}
                  className="mt-0.5"
                />
                <span>{obs.label}</span>
              </label>
            ))}
          </div>
          <Button size="sm" onClick={() => void goOpenings()} disabled={saving || selectedObs.length === 0}>
            Ver aberturas ({selectedObs.length})
          </Button>
        </div>
      )}

      {step === "openings" && (
        <div className="space-y-3">
            <p className="text-sm font-medium">Escolha uma abertura</p>
            {openings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma abertura para essa combinação. Ajuste as observações.
              </p>
            ) : (
              <div className="space-y-2">
                {openings.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => selectOpening(op.id, op.template)}
                    className={cn(
                      "w-full rounded-lg border border-border/50 p-3 text-left text-sm transition-colors hover:border-brand/30",
                      bundle.state.selected_opening_id === op.id && "border-brand/50 bg-brand/5",
                    )}
                  >
                    <p className="whitespace-pre-wrap text-muted-foreground line-clamp-4">
                      {personalize(op.template, {
                        name: bundle.prospect.name,
                        city: bundle.prospect.city,
                        business: bundle.prospect.name,
                      })}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {openingText && (
              <div className="space-y-2 rounded-lg border border-border/50 p-3">
                <Label className="text-xs text-muted-foreground">Editar antes de enviar</Label>
                <Textarea
                  value={openingText}
                  onChange={(e) => setOpeningText(e.target.value)}
                  rows={6}
                  className="text-sm"
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => void copyText(openingText)}>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar
                  </Button>
                  <Button size="sm" onClick={() => void markOpeningUsed()} disabled={saving}>
                    <Check className="h-3.5 w-3.5" />
                    Marcar como enviada
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

      {step === "awaiting_reply" && (
        <div className="space-y-3">
          <p className="text-sm font-medium">O empresário respondeu?</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => void setReply(false)}>
              Ainda não respondeu
            </Button>
            <Button size="sm" onClick={() => void setReply(true)}>
              Respondeu
            </Button>
          </div>
        </div>
      )}

      {step === "no_reply" && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Próximo passo</p>
          <div className="space-y-2">
            {bundle.segment.noReplyActions.map((action) => (
              <button
                key={action.key}
                type="button"
                onClick={() => void applyNoReply(action.key)}
                className="w-full rounded-lg border border-border/50 p-3 text-left text-sm hover:border-brand/30"
              >
                <p className="font-medium">{action.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{action.hint}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {(step === "response_state" || step === "continuation") && (
        <div className="space-y-3">
          {step === "response_state" && (
            <>
              <p className="text-sm font-medium">Como ele respondeu?</p>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {bundle.segment.responseStates.map((rs) => (
                  <button
                    key={rs.key}
                    type="button"
                    onClick={() => void pickResponseState(rs.key)}
                    className={cn(
                      "rounded-md border border-border/50 px-3 py-2 text-left text-sm hover:border-brand/30",
                      bundle.state.response_state_key === rs.key && "border-brand/50 bg-brand/5",
                    )}
                  >
                    {rs.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "continuation" && bundle.state.response_state_key && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Sugestões de continuidade</p>
              <div className="space-y-2">
                {continuations.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setContinuationText(
                        personalize(c.template, {
                          name: bundle.prospect.name,
                          city: bundle.prospect.city,
                          business: bundle.prospect.name,
                        }),
                      )
                    }
                    className="w-full rounded-lg border border-border/50 p-3 text-left text-sm hover:border-brand/30"
                  >
                    {personalize(c.template, {
                      name: bundle.prospect.name,
                      city: bundle.prospect.city,
                      business: bundle.prospect.name,
                    })}
                  </button>
                ))}
                {getRaiseOneReply(bundle.segment, bundle.state.response_state_key) && (
                  <p className="text-xs text-muted-foreground">
                    Resposta Raise One sugerida no campo abaixo.
                  </p>
                )}
              </div>
              <Textarea
                value={continuationText}
                onChange={(e) => setContinuationText(e.target.value)}
                rows={4}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => void copyText(continuationText)}>
                  <Copy className="h-3.5 w-3.5" />
                  Copiar
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    await addProspectInteraction({
                      data: {
                        prospectId,
                        type: "message_sent",
                        title: "Continuação enviada",
                        body: continuationText,
                        direction: "out",
                      },
                    });
                    await persist({ step: "done" });
                    onUpdated();
                    toast.success("Registrado.");
                  }}
                >
                  Registrar e concluir
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === "done" && (
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-sm">
          <p className="font-medium">Conversa registrada.</p>
          <p className="mt-1 text-muted-foreground">
            Reinicie o assistente para uma nova abordagem ou continue pelo WhatsApp.
          </p>
          <Button size="sm" className="mt-3" variant="outline" onClick={() => void resetAssistant()}>
            Nova abordagem
          </Button>
        </div>
      )}
    </div>
  );
}
