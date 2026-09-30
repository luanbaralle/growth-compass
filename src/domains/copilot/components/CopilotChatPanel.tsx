import type { CopilotNarratorMessage } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePanelScrollToEnd } from "@/domains/copilot/hooks/use-panel-scroll";
import { Bot, SkipForward } from "lucide-react";

const TONE_STYLES: Record<CopilotNarratorMessage["tone"], string> = {
  welcome: "border-violet-500/25 bg-violet-500/5",
  observation: "border-border/50 bg-muted/20",
  insight: "border-emerald-500/25 bg-emerald-500/5",
  suggestion: "border-violet-500/30 bg-violet-500/8",
  hold: "border-sky-500/20 bg-sky-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
};

export function CopilotChatPanel({
  messages,
  isLive,
  processing,
  onAskSuggestion,
  onSkipSuggestion,
  compact = false,
  fillHeight = false,
  meetingFocus = false,
}: {
  messages: CopilotNarratorMessage[];
  isLive: boolean;
  processing?: boolean;
  onAskSuggestion?: (question: string) => void;
  onSkipSuggestion?: () => void;
  compact?: boolean;
  fillHeight?: boolean;
  /** Mobile meeting: prioritize active suggestion, hide chat chrome. */
  meetingFocus?: boolean;
}) {
  const { containerRef, endRef } = usePanelScrollToEnd(messages.length, Boolean(processing));

  const lastSuggestion = [...messages].reverse().find((m) => m.tone === "suggestion");
  const recent = meetingFocus
    ? messages.filter((m) => m.tone !== "welcome").slice(-6)
    : messages;

  if (meetingFocus) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {lastSuggestion?.suggestedQuestion && onAskSuggestion ? (
          <div className="shrink-0 rounded-2xl border border-brand/25 bg-brand/8 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand/80">
              Pergunte agora
            </p>
            <p className="mt-2 text-base font-semibold leading-snug text-foreground">
              {lastSuggestion.suggestedQuestion}
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                className="min-h-11 flex-1"
                disabled={processing}
                onClick={() => onAskSuggestion(lastSuggestion.suggestedQuestion!)}
              >
                Marcar como perguntado
              </Button>
              {onSkipSuggestion && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-11"
                  onClick={onSkipSuggestion}
                >
                  <SkipForward className="mr-1 h-3.5 w-3.5" />
                  Pular
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="shrink-0 rounded-2xl border border-border/40 bg-muted/15 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Copilot
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {processing
                ? "Analisando a conversa…"
                : "Aguardando o próximo momento de pergunta. Continue a conversa."}
            </p>
          </div>
        )}

        <div ref={containerRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto">
          {recent.length === 0 ? (
            <p className="px-1 text-sm text-muted-foreground/60">
              Insights aparecem aqui conforme a reunião avança.
            </p>
          ) : (
            [...recent].reverse().map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm leading-snug",
                  TONE_STYLES[msg.tone],
                )}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/55">
                  {msg.tone === "suggestion"
                    ? "Sugestão"
                    : msg.tone === "insight"
                      ? "Insight"
                      : msg.tone === "warning"
                        ? "Atenção"
                        : "Nota"}
                </p>
                <p className="mt-1 text-foreground/90">{msg.content}</p>
              </div>
            ))
          )}
          {processing && (
            <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand" />
              Pensando…
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border border-border/50 bg-background/60",
        fillHeight && "min-h-0 flex-1",
      )}
    >
      {!compact && (
        <div className="border-b border-border/40 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Copilot
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Inteligência em tempo real — grounded no diagnóstico
          </p>
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          "space-y-3 overflow-y-auto p-4",
          fillHeight
            ? "min-h-0 flex-1"
            : compact
              ? "max-h-[min(42dvh,320px)] min-h-[160px]"
              : "max-h-[min(42dvh,420px)] min-h-[200px] sm:min-h-[280px]",
        )}
      >
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground/60">
            {isLive ? "Iniciando copilot…" : "Sem mensagens."}
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm leading-relaxed",
                TONE_STYLES[msg.tone],
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Bot className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Raise One Copilot
                </span>
              </div>
              <p className="text-foreground/90">{msg.content}</p>
            </div>
          ))
        )}

        {processing && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-violet-500" />
            Pensando…
          </div>
        )}

        <div ref={endRef} />
      </div>

      {isLive && lastSuggestion?.suggestedQuestion && onAskSuggestion && (
        <div
          className={cn(
            "border-t border-border/40 px-4 py-3",
            compact && "sticky bottom-0 bg-background/95 backdrop-blur-sm",
          )}
        >
          <p className="mb-2 text-xs text-muted-foreground">Sugestão ativa:</p>
          <p className="mb-3 text-sm font-medium leading-snug">{lastSuggestion.suggestedQuestion}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="min-h-10 flex-1"
              disabled={processing}
              onClick={() => onAskSuggestion(lastSuggestion.suggestedQuestion!)}
            >
              Perguntar
            </Button>
            {onSkipSuggestion && (
              <Button size="sm" variant="ghost" className="min-h-10" onClick={onSkipSuggestion}>
                <SkipForward className="mr-1 h-3.5 w-3.5" />
                Pular
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
