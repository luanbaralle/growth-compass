import {
  addProspectInteraction,
  getCopilotBundle,
  saveAssistantState,
  updateProspect,
} from "@/domains/prospection/api.server";
import {
  buildConversationContext,
  usesConversationGraph,
} from "@/domains/prospection/copilot/conversation-engine";
import type { CopilotBundle } from "@/domains/prospection/copilot/types";
import { SEGMENT_OPTIONS } from "@/domains/prospection/copilot/types";
import {
  getContinuations,
  getRaiseOneReply,
  personalize,
  rankOpenings,
} from "@/domains/prospection/copilot/engine";
import { buildCanonicalSaloesOpening } from "@/domains/prospection/copilot/opening";
import { SALOES_FOLLOWUP_TEMPLATES } from "@/domains/prospection/copilot/graph/saloes";
import {
  SaloesClosingPanel,
  SaloesConversationPanel,
  SaloesRaiseOnePanel,
} from "@/domains/prospection/components/SaloesCopilotPanels";
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
  const [raiseOneText, setRaiseOneText] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCopilotBundle({ data: { id: prospectId } });
      setBundle(data);
      setSelectedObs(data.state.selected_observations);
      setOpeningText(data.state.opening_text ?? "");
      if (data.conversation?.raiseOne) {
        const r = data.conversation.raiseOne;
        setRaiseOneText(`${r.transition}\n\n${r.connection}\n\n${r.nextStep}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar assistente."));
    } finally {
      setLoading(false);
    }
  }, [prospectId]);

  useEffect(() => {
    void load();
  }, [load]);

  const isSaloes = bundle ? usesConversationGraph(bundle.segmentSlug) : false;
  const step = bundle?.state.step ?? "observations";

  const openings = useMemo(() => {
    if (!bundle) return [];
    return rankOpenings(bundle.segment.openings, selectedObs, 5);
  }, [bundle, selectedObs]);

  const applyState = (state: CopilotBundle["state"]) => {
    setBundle((b) => {
      if (!b) return b;
      const next: CopilotBundle = { ...b, state };
      if (usesConversationGraph(b.segmentSlug)) {
        next.conversation = buildConversationContext(state, b.prospect);
        if (next.conversation.raiseOne) {
          const r = next.conversation.raiseOne;
          setRaiseOneText(`${r.transition}\n\n${r.connection}\n\n${r.nextStep}`);
        }
      }
      return next;
    });
  };

  const persist = async (
    patch: Parameters<typeof saveAssistantState>[0]["data"] extends infer D
      ? Omit<D, "prospectId">
      : never,
  ) => {
    setSaving(true);
    try {
      const state = await saveAssistantState({ data: { prospectId, ...patch } });
      applyState(state);
      return state;
    } finally {
      setSaving(false);
    }
  };

  const toggleObs = (key: string) => {
    setSelectedObs((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const goOpenings = async () => {
    if (selectedObs.length === 0) {
      toast.error("Selecione pelo menos uma observação.");
      return;
    }
    if (isSaloes) {
      const text = buildCanonicalSaloesOpening(selectedObs, {
        name: bundle!.prospect.name,
        city: bundle!.prospect.city,
      });
      setOpeningText(text);
      await persist({
        step: "opening",
        selectedObservations: selectedObs,
        selectedOpeningId: "canonical-saloes",
        openingText: text,
      });
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
    if (isSaloes) {
      await persist({
        step: "conversation",
        replyStatus: "replied",
        currentObjectiveKey: "client_origin",
      });
      await updateProspect({
        data: { id: prospectId, status: "respondeu" },
      });
      onUpdated();
      toast.success("Status atualizado: Respondeu.");
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

  const registerDiscovery = async (input: {
    discoveryKey: string;
    discoveryValue: string;
    inboundReplyText: string;
  }) => {
    const state = await persist({ registerDiscovery: input });
    if (
      input.discoveryKey === "willingness_to_act" &&
      (input.discoveryValue === "yes" || input.discoveryValue === "maybe")
    ) {
      await updateProspect({
        data: { id: prospectId, status: "interessado" },
      });
    }
    if (state.step === "done" && bundle?.conversation?.closingMessage) {
      toast.success("Conversa encaminhada para encerramento.");
    } else if (state.step === "raise_one") {
      toast.success("Oportunidade identificada.");
    } else {
      toast.success("Descoberta registrada.");
    }
    onUpdated();
  };

  const registerRaiseOneSent = async () => {
    if (!raiseOneText.trim()) return;
    await addProspectInteraction({
      data: {
        prospectId,
        type: "message_sent",
        title: "Conexão Raise One enviada",
        body: raiseOneText,
        direction: "out",
      },
    });
    await persist({ step: "done" });
    onUpdated();
    toast.success("Próximo passo registrado.");
  };

  const finishClosing = async () => {
    const msg = bundle?.conversation?.closingMessage;
    if (msg) {
      await addProspectInteraction({
        data: {
          prospectId,
          type: "message_sent",
          title: "Encerramento enviado",
          body: msg,
          direction: "out",
        },
      });
      if (bundle?.state.discoveries.growth_desire === "no_maintain") {
        const d = new Date();
        d.setDate(d.getDate() + 45);
        await updateProspect({
          data: {
            id: prospectId,
            nextAction: "Follow-up satisfeito (30–60 dias)",
            nextActionDate: d.toISOString().slice(0, 10),
          },
        });
      }
    }
    await persist({ step: "done" });
    onUpdated();
    toast.success("Conversa encerrada.");
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
    setRaiseOneText("");
    await persist({
      step: "observations",
      selectedObservations: [],
      selectedOpeningId: null,
      openingText: null,
      openingUsed: false,
      replyStatus: null,
      responseStateKey: null,
      currentObjectiveKey: null,
      discoveries: {},
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

  const showSaloesClosing =
    isSaloes && !!bundle.conversation?.closingMessage && step === "conversation";

  const followUpFirst = personalize(SALOES_FOLLOWUP_TEMPLATES.first, {
    name: bundle.prospect.name,
    city: bundle.prospect.city,
    business: bundle.prospect.name,
  });

  const followUpLast = personalize(SALOES_FOLLOWUP_TEMPLATES.last, {
    name: bundle.prospect.name,
    city: bundle.prospect.city,
    business: bundle.prospect.name,
  });

  const showSaloesClosingFromConversation = showSaloesClosing;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/20 pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
          <MessageCircle className="h-4 w-4 text-brand" strokeWidth={1.75} />
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
                  "flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                  selectedObs.includes(obs.key)
                    ? "prospect-option-card-active border-brand/30"
                    : "border-border/20 bg-surface-elevated/30 hover:border-border/35",
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
          <Button
            size="sm"
            onClick={() => void goOpenings()}
            disabled={saving || selectedObs.length === 0}
          >
            {isSaloes ? "Continuar para abertura" : `Ver aberturas (${selectedObs.length})`}
          </Button>
        </div>
      )}

      {(step === "opening" || (step === "openings" && isSaloes)) && isSaloes && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Abertura oficial</p>
          <p className="text-xs text-muted-foreground">
            Personalize com base nas observações reais. Não invente informações.
          </p>
          <div className="space-y-3 rounded-lg border border-border/20 bg-surface-elevated/30 p-4">
            <Label className="text-xs text-muted-foreground">Editar antes de enviar</Label>
            <Textarea
              value={openingText}
              onChange={(e) => setOpeningText(e.target.value)}
              rows={10}
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
        </div>
      )}

      {step === "openings" && !isSaloes && (
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
                    "prospect-option-card",
                    bundle.state.selected_opening_id === op.id && "prospect-option-card-active",
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
            <div className="space-y-3 rounded-lg border border-border/20 bg-surface-elevated/30 p-4">
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
          {isSaloes && (
            <div className="space-y-2 rounded-lg border border-border/20 bg-surface-elevated/20 p-3 text-sm">
              <p className="text-xs font-medium text-muted-foreground">
                Follow-up sugerido (+2–3 dias)
              </p>
              <p className="whitespace-pre-wrap text-muted-foreground">{followUpFirst}</p>
              <Button size="sm" variant="outline" onClick={() => void copyText(followUpFirst)}>
                <Copy className="h-3.5 w-3.5" />
                Copiar follow-up 1
              </Button>
              <p className="pt-2 text-xs font-medium text-muted-foreground">
                Última tentativa (+5–7 dias)
              </p>
              <p className="whitespace-pre-wrap text-muted-foreground">{followUpLast}</p>
              <Button size="sm" variant="outline" onClick={() => void copyText(followUpLast)}>
                <Copy className="h-3.5 w-3.5" />
                Copiar follow-up 2
              </Button>
            </div>
          )}
          <div className="space-y-2">
            {bundle.segment.noReplyActions.map((action) => (
              <button
                key={action.key}
                type="button"
                onClick={() => void applyNoReply(action.key)}
                className="prospect-option-card"
              >
                <p className="font-medium">{action.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{action.hint}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {isSaloes && step === "conversation" && !showSaloesClosing && (
        <SaloesConversationPanel
          bundle={bundle}
          saving={saving}
          onRegisterDiscovery={registerDiscovery}
          onCopy={(t) => void copyText(t)}
        />
      )}

      {isSaloes && step === "raise_one" && (
        <SaloesRaiseOnePanel
          bundle={bundle}
          saving={saving}
          raiseOneText={raiseOneText}
          onRaiseOneTextChange={setRaiseOneText}
          onCopy={(t) => void copyText(t)}
          onRegisterSent={registerRaiseOneSent}
        />
      )}

      {showSaloesClosingFromConversation && bundle.conversation?.closingMessage && (
        <SaloesClosingPanel
          closingMessage={bundle.conversation.closingMessage}
          onCopy={(t) => void copyText(t)}
          onDone={finishClosing}
          saving={saving}
        />
      )}

      {!isSaloes && (step === "response_state" || step === "continuation") && (
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
                      "prospect-option-card",
                      bundle.state.response_state_key === rs.key && "prospect-option-card-active",
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
                    className="prospect-option-card"
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

      {step === "done" && !showSaloesClosing && (
        <div className="rounded-lg border border-border/20 bg-surface-elevated/30 p-4 text-sm">
          <p className="font-medium">Conversa registrada.</p>
          <p className="mt-1 text-muted-foreground">
            Reinicie o assistente para uma nova abordagem ou continue pelo WhatsApp.
          </p>
          <Button
            size="sm"
            className="mt-3"
            variant="outline"
            onClick={() => void resetAssistant()}
          >
            Nova abordagem
          </Button>
        </div>
      )}
    </div>
  );
}
