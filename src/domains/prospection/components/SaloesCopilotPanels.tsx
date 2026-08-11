import type { CopilotBundle } from "@/domains/prospection/copilot/types";
import {
  buildResumeContext,
  DISCOVERY_FIELD_LABELS,
  getObjective,
  resolveNextObjective,
} from "@/domains/prospection/copilot/graph/saloes";
import type { SaloesDiscoveries } from "@/domains/prospection/copilot/graph/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useMemo, useState } from "react";

const FIELD_ORDER = [
  "client_origin",
  "current_satisfaction",
  "growth_desire",
  "limitation",
  "willingness_to_act",
];

export function SaloesConversationPanel({
  bundle,
  saving,
  onRegisterDiscovery,
  onCopy,
}: {
  bundle: CopilotBundle;
  saving: boolean;
  onRegisterDiscovery: (input: {
    discoveryKey: string;
    discoveryValue: string;
    inboundReplyText: string;
  }) => Promise<void>;
  onCopy: (text: string) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [nextPreview, setNextPreview] = useState<string | null>(null);

  const conversation = bundle.conversation;
  const objective = conversation?.currentObjective;

  const discoveryEntries = useMemo(() => {
    const labels = conversation?.discoveryLabels ?? {};
    return FIELD_ORDER.filter((key) => labels[key]).map((key) => ({
      key,
      label: DISCOVERY_FIELD_LABELS[key] ?? key,
      value: labels[key]!,
    }));
  }, [conversation?.discoveryLabels]);

  const handleRegister = async () => {
    if (!objective || !selectedChip) return;
    if (!replyText.trim()) return;

    await onRegisterDiscovery({
      discoveryKey: objective.key,
      discoveryValue: selectedChip,
      inboundReplyText: replyText.trim(),
    });

    const merged = {
      ...(bundle.state.discoveries as SaloesDiscoveries),
      [objective.key]: selectedChip,
    } as SaloesDiscoveries;
    const next = resolveNextObjective(merged);
    if (next.key && next.key !== "raise_one" && next.key !== "close_respectful") {
      setNextPreview(getObjective(next.key, merged).title);
    } else if (next.key === "raise_one") {
      setNextPreview("Conectar oportunidade e próximo passo");
    } else if (next.key === "close_respectful") {
      setNextPreview("Encerrar com respeito");
    } else {
      setNextPreview(null);
    }

    setReplyText("");
    setSelectedChip(null);
  };

  if (!objective) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum objetivo pendente. Avance pelo fluxo ou reinicie o assistente.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2 rounded-lg border border-brand/20 bg-brand/5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand">Objetivo atual</p>
        <p className="text-sm font-medium">{objective.title}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Pergunta sugerida
        </p>
        <blockquote className="rounded-lg border border-border/20 bg-surface-elevated/30 px-4 py-3 text-sm italic text-muted-foreground">
          {objective.question}
        </blockquote>
        <Button size="sm" variant="outline" onClick={() => onCopy(objective.question)}>
          <Copy className="h-3.5 w-3.5" />
          Copiar pergunta
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Resposta do prospect</Label>
        <Textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Cole ou escreva aqui o que o prospect respondeu..."
          rows={3}
          className="text-sm"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">O que descobrimos?</p>
        <div className="flex flex-wrap gap-2">
          {objective.answerOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelectedChip(opt.key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                selectedChip === opt.key
                  ? "border-brand/40 bg-brand/10 text-foreground"
                  : "border-border/25 bg-surface-elevated/30 text-muted-foreground hover:border-border/40",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={() => void handleRegister()}
          disabled={saving || !selectedChip || !replyText.trim()}
        >
          Registrar resposta
        </Button>
      </div>

      {discoveryEntries.length > 0 && (
        <div className="space-y-2 rounded-lg border border-border/20 bg-surface-elevated/20 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            O que já sabemos
          </p>
          <ul className="space-y-1 text-sm">
            {discoveryEntries.map((d) => (
              <li key={d.key}>
                <span className="text-muted-foreground">{d.label}:</span> {d.value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {nextPreview && (
        <div className="rounded-lg border border-dashed border-border/30 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Próximo objetivo: </span>
          <span className="font-medium">{nextPreview}</span>
        </div>
      )}

      {bundle.state.discoveries.client_origin && (
        <p className="text-xs text-muted-foreground">
          Retomada sugerida: mencionar &quot;{buildResumeContext(bundle.state.discoveries)}&quot;
        </p>
      )}
    </div>
  );
}

export function SaloesRaiseOnePanel({
  bundle,
  saving,
  raiseOneText,
  onRaiseOneTextChange,
  onCopy,
  onRegisterSent,
}: {
  bundle: CopilotBundle;
  saving: boolean;
  raiseOneText: string;
  onRaiseOneTextChange: (text: string) => void;
  onCopy: (text: string) => void;
  onRegisterSent: () => Promise<void>;
}) {
  const raiseOne = bundle.conversation?.raiseOne;
  if (!raiseOne) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border border-brand/20 bg-brand/5 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand">
          Oportunidade identificada
        </p>
        <p className="text-sm">{raiseOne.opportunity}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conexão sugerida
        </p>
        <p className="text-sm text-muted-foreground">{raiseOne.connection}</p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Mensagem (editar antes de enviar)</Label>
        <Textarea
          value={raiseOneText}
          onChange={(e) => onRaiseOneTextChange(e.target.value)}
          rows={6}
          className="text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => onCopy(raiseOneText)}>
          <Copy className="h-3.5 w-3.5" />
          Copiar
        </Button>
        <Button size="sm" onClick={() => void onRegisterSent()} disabled={saving}>
          Registrar e avançar
        </Button>
      </div>
    </div>
  );
}

export function SaloesClosingPanel({
  closingMessage,
  onCopy,
  onDone,
  saving,
}: {
  closingMessage: string;
  onCopy: (text: string) => void;
  onDone: () => Promise<void>;
  saving: boolean;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Encerramento respeitoso</p>
      <Textarea value={closingMessage} readOnly rows={4} className="text-sm" />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onCopy(closingMessage)}>
          <Copy className="h-3.5 w-3.5" />
          Copiar
        </Button>
        <Button size="sm" onClick={() => void onDone()} disabled={saving}>
          Concluir
        </Button>
      </div>
    </div>
  );
}

export { DISCOVERY_FIELD_LABELS };
