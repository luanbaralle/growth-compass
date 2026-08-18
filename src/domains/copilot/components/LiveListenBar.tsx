import type { CopilotOrbState } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, AlertCircle, MonitorSpeaker } from "lucide-react";
import type { MeetingAudioStatus } from "../stt/use-meeting-audio-capture";

export function LiveListenBar({
  status,
  callAudioConnected,
  statusHint,
  lastTranscript,
  speakerLabel,
  onToggle,
  disabled,
}: {
  status: MeetingAudioStatus;
  callAudioConnected: boolean;
  statusHint?: string;
  lastTranscript?: string;
  speakerLabel: string;
  onToggle: () => void;
  disabled?: boolean;
}) {
  if (status === "unsupported") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Gravação ao vivo requer Chrome ou Edge. Use a entrada manual abaixo.
      </div>
    );
  }

  if (status === "mic_denied") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-600 dark:text-amber-400">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Permissão de microfone negada. Habilite nas configurações do navegador.
      </div>
    );
  }

  const listening =
    status === "listening" || status === "call_audio_missing" || status === "stt_error";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-3">
        <Button
          type="button"
          size="lg"
          variant={listening ? "default" : "outline"}
          className={cn(
            "h-14 w-14 rounded-full p-0",
            listening && "animate-pulse shadow-lg shadow-foreground/10",
          )}
          onClick={onToggle}
          disabled={disabled}
          aria-pressed={listening}
          aria-label={listening ? "Pausar gravação" : "Iniciar gravação"}
        >
          {listening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>
        <div className="text-left">
          <p className="text-sm font-medium">
            {listening ? "Gravando reunião…" : "Iniciar gravação"}
          </p>
          <p className="text-xs text-muted-foreground">
            Identificação: <strong>{speakerLabel}</strong>
          </p>
          {listening && (
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-xs",
                callAudioConnected
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400",
              )}
            >
              <MonitorSpeaker className="h-3 w-3 shrink-0" />
              {callAudioConnected ? "Áudio da call conectado" : "Só microfone — compartilhe a aba da call"}
            </p>
          )}
        </div>
      </div>

      {!listening && (
        <p className="text-center text-xs text-muted-foreground/80">
          Ao iniciar, selecione a aba do Meet/Zoom e marque{" "}
          <strong>Compartilhar áudio da aba</strong> para captar a prospect.
        </p>
      )}

      {statusHint && (
        <p className="text-center text-xs text-amber-600/90 dark:text-amber-400">{statusHint}</p>
      )}

      {lastTranscript && (
        <p className="text-center text-sm italic text-muted-foreground/80">
          &ldquo;{lastTranscript}&rdquo;
        </p>
      )}
    </div>
  );
}

export function resolveDisplayOrbState(
  sessionOrb: CopilotOrbState,
  options: {
    isListening: boolean;
    isProcessing: boolean;
    isLive: boolean;
  },
): CopilotOrbState {
  if (!options.isLive) return "idle";
  if (options.isProcessing) return "understanding";
  if (options.isListening) return "listening";
  return sessionOrb;
}

export function resolveStatusLine(
  baseLine: string,
  options: {
    isListening: boolean;
    isProcessing: boolean;
    isTranscribing: boolean;
    lastTranscript: string;
  },
): string {
  if (options.isProcessing) return "Understanding context…";
  if (options.isTranscribing) return "Transcrevendo áudio da reunião…";
  if (options.isListening && options.lastTranscript) {
    const t = options.lastTranscript;
    return `Último trecho: "${t.slice(0, 80)}${t.length > 80 ? "…" : ""}"`;
  }
  if (options.isListening) return "Estou acompanhando a conversa (mic + call)…";
  return baseLine;
}
