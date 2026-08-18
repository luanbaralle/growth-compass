import type { TranscriptSegment } from "../types";
import { TranscriptTimeline } from "./TranscriptTimeline";
import { Button } from "@/components/ui/button";
import { Copy, FileText } from "lucide-react";
import { toast } from "sonner";

function buildPlainTextTranscript(
  segments: TranscriptSegment[],
  prospectName: string,
): string {
  return segments
    .map((seg) => {
      const who =
        seg.speaker === "consultant"
          ? "Consultor"
          : seg.speaker === "prospect"
            ? prospectName
            : "Desconhecido";
      const time = new Date(seg.startedAt).toLocaleTimeString("pt-BR");
      return `[${time}] ${who}: ${seg.text}`;
    })
    .join("\n");
}

export function MeetingTranscriptPanel({
  transcript,
  prospectName,
  completed,
  summary,
}: {
  transcript: TranscriptSegment[];
  prospectName: string;
  completed?: boolean;
  summary?: string | null;
}) {
  const handleCopy = async () => {
    if (transcript.length === 0) return;
    try {
      await navigator.clipboard.writeText(buildPlainTextTranscript(transcript, prospectName));
      toast.success("Transcript copiado.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <section className="rounded-xl border border-border/50 bg-muted/5">
      <div className="flex items-start justify-between gap-4 border-b border-border/40 px-4 py-3">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            <FileText className="h-3.5 w-3.5" />
            {completed ? "Transcript da reunião" : "Live transcript"}
          </p>
          {completed && (
            <p className="mt-1 text-xs text-muted-foreground">
              {transcript.length} segmento{transcript.length !== 1 ? "s" : ""} salvos no OS
            </p>
          )}
          {summary && completed && (
            <p className="mt-2 text-sm text-foreground/80">{summary}</p>
          )}
        </div>
        {transcript.length > 0 && (
          <Button size="sm" variant="outline" onClick={() => void handleCopy()}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copiar
          </Button>
        )}
      </div>
      <TranscriptTimeline
        transcript={transcript}
        prospectName={prospectName}
        className="border-0 bg-transparent"
        maxHeight={completed ? "max-h-[480px]" : "max-h-64"}
        emptyMessage={
          completed ? "Nenhum segmento registrado nesta reunião." : "Aguardando conversa…"
        }
      />
    </section>
  );
}
