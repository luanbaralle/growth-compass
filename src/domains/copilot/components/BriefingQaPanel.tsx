import { askCopilotBriefingQuestion } from "@/domains/copilot/api.server";
import type { BriefingQaMessage } from "@/domains/copilot/types";
import { getErrorMessage } from "@/lib/api/client-errors";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Bot, Brain, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const STARTER_QUESTIONS = [
  "O principal problema do negócio em uma frase?",
  "Quais lacunas impedem montar uma proposta?",
  "O que a R1 deveria priorizar nos próximos 90 dias?",
  "Resuma as oportunidades identificadas.",
];

export function BriefingQaPanel({
  sessionId,
  messages,
  onUpdated,
}: {
  sessionId: string;
  messages: BriefingQaMessage[];
  onUpdated: (detail: Awaited<ReturnType<typeof askCopilotBriefingQuestion>>) => void;
}) {
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, asking]);

  const submit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || asking) return;

    setAsking(true);
    setQuestion("");
    try {
      const detail = await askCopilotBriefingQuestion({
        data: { sessionId, question: trimmed },
      });
      onUpdated(detail);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao responder pergunta."));
      setQuestion(trimmed);
    } finally {
      setAsking(false);
    }
  };

  return (
    <section className="rounded-xl border border-border/50 bg-background/60 shadow-sm">
      <div className="border-b border-border/40 px-5 py-4">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-500/80" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/55">
            Refinar diagnóstico
          </p>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          A IA tem uma hipótese — valide, corrija ou aprofunde com base nas evidências da reunião.
        </p>
      </div>

      <div className="max-h-[360px] min-h-[200px] space-y-3 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground/70">
              Confirme ou ajuste o diagnóstico:
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_QUESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={asking}
                  onClick={() => void submit(prompt)}
                  className="rounded-full border border-border/50 bg-muted/20 px-3 py-1.5 text-left text-xs text-foreground/80 transition hover:border-violet-500/30 hover:bg-violet-500/5 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "border-border/40 bg-muted/15"
                  : "border-violet-500/20 bg-violet-500/5",
              )}
            >
              <div className="mt-0.5 shrink-0">
                {msg.role === "user" ? (
                  <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                ) : (
                  <Bot className="h-3.5 w-3.5 text-violet-500/80" />
                )}
              </div>
              <p className="text-foreground/90">{msg.content}</p>
            </div>
          ))
        )}

        {asking && (
          <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Analisando briefing…
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="space-y-3 border-t border-border/40 px-5 py-4">
        <Textarea
          placeholder="Ex.: O problema principal é baixa demanda previsível? Confirme a oportunidade em consórcio náutico."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          disabled={asking}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit(question);
            }
          }}
          className="min-h-[72px] resize-none text-sm"
        />
        <div className="flex justify-end">
          <Button size="sm" disabled={asking || !question.trim()} onClick={() => void submit(question)}>
            {asking ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="mr-1.5 h-3.5 w-3.5" />
            )}
            Validar
          </Button>
        </div>
      </div>
    </section>
  );
}
