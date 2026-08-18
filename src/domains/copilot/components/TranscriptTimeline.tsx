import type { CopilotSessionSnapshot, TranscriptSegment } from "../types";
import { cn } from "@/lib/utils";

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "--:--:--";
  }
}

function speakerLabel(
  speaker: TranscriptSegment["speaker"],
  prospectName: string,
): string {
  if (speaker === "consultant") return "Você";
  if (speaker === "prospect") return prospectName;
  return "Desconhecido";
}

export function TranscriptTimeline({
  transcript,
  prospectName,
  interimText,
  interimSpeaker,
  className,
  maxHeight = "max-h-64",
  emptyMessage = "Aguardando conversa…",
  showHeader = true,
  showTimestamps = true,
}: {
  transcript: TranscriptSegment[];
  prospectName: string;
  interimText?: string;
  interimSpeaker?: TranscriptSegment["speaker"];
  className?: string;
  maxHeight?: string;
  emptyMessage?: string;
  showHeader?: boolean;
  showTimestamps?: boolean;
}) {
  return (
    <section className={cn("rounded-xl border border-border/40 bg-background/50", className)}>
      {showHeader && (
        <div className="border-b border-border/40 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Live transcript
          </p>
        </div>
      )}
      <div className={cn(maxHeight, "space-y-3 overflow-y-auto p-4")}>
        {transcript.length === 0 && !interimText ? (
          <p className="text-sm text-muted-foreground/60">{emptyMessage}</p>
        ) : (
          transcript.map((seg) => (
            <div
              key={seg.id}
              className={cn(
                "grid gap-3 text-sm",
                showTimestamps ? "grid-cols-[72px_1fr]" : "grid-cols-1",
              )}
            >
              {showTimestamps && (
                <time className="pt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground/60">
                  {formatTime(seg.startedAt)}
                </time>
              )}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                  {speakerLabel(seg.speaker, prospectName)}
                  {seg.sequence != null && (
                    <span className="ml-2 font-normal normal-case text-muted-foreground/40">
                      #{seg.sequence}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 leading-relaxed text-foreground/85">{seg.text}</p>
              </div>
            </div>
          ))
        )}
        {interimText && (
          <div className="grid grid-cols-[72px_1fr] gap-3 text-sm italic opacity-70">
            <span className="font-mono text-[11px] text-muted-foreground/50">…</span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/60">
                {speakerLabel(interimSpeaker ?? "unknown", prospectName)}
              </p>
              <p className="mt-0.5">{interimText}…</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function MeetingPhaseBadge({ session }: { session: CopilotSessionSnapshot }) {
  const labels: Record<CopilotSessionSnapshot["meetingPhase"], string> = {
    opening: "Abrindo",
    context: "Contexto",
    discovery: "Discovery",
    deep_discovery: "Aprofundamento",
    qualification: "Qualificação",
    synthesis: "Síntese",
    closing: "Encerrando",
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500/80" />
      <span>{labels[session.meetingPhase]}</span>
      <span className="text-muted-foreground/40">·</span>
      <span className="capitalize">{session.copilotAction}</span>
    </div>
  );
}
