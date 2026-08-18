import type { MeetingSynthesis, TranscriptSegment } from "../types";
import { TranscriptTimeline } from "./TranscriptTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Copy, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type TranscriptView = "original" | "refined";

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

function refinedToSegments(
  turns: NonNullable<MeetingSynthesis["refinedTranscript"]>,
): TranscriptSegment[] {
  return turns.map((turn, index) => ({
    id: `refined-${index}`,
    speaker: turn.speaker as TranscriptSegment["speaker"],
    text: turn.text,
    startedAt: new Date(0).toISOString(),
    sequence: index + 1,
    source: "import" as const,
  }));
}

export function MeetingTranscriptPanel({
  transcript,
  prospectName,
  completed,
  summary,
  refinedTranscript,
  defaultCollapsed,
}: {
  transcript: TranscriptSegment[];
  prospectName: string;
  completed?: boolean;
  summary?: string | null;
  refinedTranscript?: MeetingSynthesis["refinedTranscript"];
  defaultCollapsed?: boolean;
}) {
  const hasRefined = (refinedTranscript?.length ?? 0) > 0;
  const [view, setView] = useState<TranscriptView>(hasRefined ? "refined" : "original");
  const [collapsed, setCollapsed] = useState(defaultCollapsed ?? false);

  const displayTranscript = useMemo(() => {
    if (view === "refined" && refinedTranscript?.length) {
      return refinedToSegments(refinedTranscript);
    }
    return transcript;
  }, [view, refinedTranscript, transcript]);

  const handleCopy = async () => {
    if (displayTranscript.length === 0) return;
    try {
      const text =
        view === "refined" && refinedTranscript?.length
          ? refinedTranscript
              .map((t) => {
                const who =
                  t.speaker === "consultant"
                    ? "Consultor"
                    : t.speaker === "prospect"
                      ? prospectName
                      : "Desconhecido";
                return `${who}: ${t.text}`;
              })
              .join("\n")
          : buildPlainTextTranscript(transcript, prospectName);
      await navigator.clipboard.writeText(text);
      toast.success("Transcript copiado.");
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  if (completed && collapsed) {
    return (
      <Card className="border-border/50 shadow-sm">
        <button
          type="button"
          className="flex w-full items-center justify-between px-5 py-4 text-left"
          onClick={() => setCollapsed(false)}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Transcript da reunião</span>
            <span className="text-xs text-muted-foreground">
              · {transcript.length} segmentos
              {hasRefined ? ` · ${refinedTranscript!.length} turnos corrigidos` : ""}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Expandir</span>
        </button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      <CardHeader className="border-b border-border/40 bg-muted/5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">
                {completed ? "Transcript da reunião" : "Live transcript"}
              </CardTitle>
            </div>
            {completed && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                {view === "refined" && refinedTranscript?.length
                  ? `${refinedTranscript.length} turnos corrigidos (STT + speakers)`
                  : `${transcript.length} segmentos salvos no OS`}
              </p>
            )}
            {summary && completed && (
              <p className="mt-2 line-clamp-2 text-sm text-foreground/75">{summary}</p>
            )}
            {completed && hasRefined && (
              <div className="mt-3 inline-flex rounded-lg border border-border/50 bg-background p-0.5">
                {(["refined", "original"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setView(mode)}
                    className={cn(
                      "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                      view === mode
                        ? "bg-secondary text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {mode === "refined" ? "Corrigido" : "Original (STT)"}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            {completed && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-muted-foreground"
                onClick={() => setCollapsed(true)}
              >
                Recolher
              </Button>
            )}
            {displayTranscript.length > 0 && (
              <Button size="sm" variant="outline" onClick={() => void handleCopy()}>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Copiar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <TranscriptTimeline
          transcript={displayTranscript}
          prospectName={prospectName}
          className="border-0 bg-transparent"
          maxHeight={completed ? "max-h-[420px]" : "max-h-64"}
          showTimestamps={view === "original"}
          emptyMessage={
            completed ? "Nenhum segmento registrado nesta reunião." : "Aguardando conversa…"
          }
          showHeader={false}
        />
      </CardContent>
    </Card>
  );
}
