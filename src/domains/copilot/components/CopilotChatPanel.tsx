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
}: {
  messages: CopilotNarratorMessage[];
  isLive: boolean;
  processing?: boolean;
  onAskSuggestion?: (question: string) => void;
  onSkipSuggestion?: () => void;
}) {
  const { containerRef, endRef } = usePanelScrollToEnd(messages.length, Boolean(processing));

  const lastSuggestion = [...messages].reverse().find((m) => m.tone === "suggestion");

  return (
    <section className="flex flex-col rounded-xl border border-border/50 bg-background/60">
      <div className="border-b border-border/40 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Copilot
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Inteligência em tempo real — grounded no diagnóstico
        </p>
      </div>

      <div
        ref={containerRef}
        className="max-h-[420px] min-h-[280px] space-y-3 overflow-y-auto p-4"
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
        <div className="border-t border-border/40 px-4 py-3">
          <p className="mb-2 text-xs text-muted-foreground">Sugestão ativa:</p>
          <p className="mb-3 text-sm font-medium">{lastSuggestion.suggestedQuestion}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={processing}
              onClick={() => onAskSuggestion(lastSuggestion.suggestedQuestion!)}
            >
              Perguntar
            </Button>
            {onSkipSuggestion && (
              <Button size="sm" variant="ghost" onClick={onSkipSuggestion}>
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
