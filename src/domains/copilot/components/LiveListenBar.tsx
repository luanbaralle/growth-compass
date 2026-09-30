import type { CopilotOrbState } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, AlertCircle, MonitorSpeaker, Loader2 } from "lucide-react";
import type { MeetingAudioStatus } from "../stt/use-meeting-audio-capture";

export function LiveListenBar({
  status,
  callAudioConnected,
  micOnlyMode = false,
  statusHint,
  lastTranscript,
  speakerLabel,
  onToggle,
  disabled,
  compact = false,
  coveragePercent,
}: {
  status: MeetingAudioStatus;
  callAudioConnected: boolean;
  micOnlyMode?: boolean;
  statusHint?: string;
  lastTranscript?: string;
  speakerLabel: string;
  onToggle: () => void;
  disabled?: boolean;
  compact?: boolean;
  coveragePercent?: number;
}) {
  if (status === "unsupported") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {statusHint || "Gravação ao vivo indisponível neste navegador. Use a entrada manual."}
      </div>
    );
  }

  if (status === "mic_denied") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {statusHint || "Microfone bloqueado. Libere nas configurações do navegador."}
        </div>
        <Button type="button" className="h-11 w-full" onClick={onToggle} disabled={disabled}>
          <Mic className="mr-2 h-4 w-4" />
          Tentar microfone de novo
        </Button>
      </div>
    );
  }

  const listening =
    status === "listening" || status === "call_audio_missing" || status === "stt_error";
  const requesting = status === "requesting";

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="lg"
            variant={listening || requesting ? "default" : "secondary"}
            className={cn(
              "h-14 w-14 shrink-0 rounded-full p-0",
              listening && "animate-pulse shadow-lg shadow-foreground/15",
              !listening && !requesting && "ring-2 ring-brand/40",
            )}
            onClick={onToggle}
            disabled={disabled || requesting}
            aria-pressed={listening}
            aria-label={listening ? "Pausar gravação" : "Toque para ouvir"}
          >
            {requesting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : listening ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">
              {requesting
                ? "Pedindo microfone…"
                : listening
                  ? "Ouvindo…"
                  : micOnlyMode
                    ? "Toque para ouvir a sala"
                    : "Toque para gravar"}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {statusHint ||
                (listening
                  ? lastTranscript
                    ? `“${lastTranscript.slice(0, 60)}${lastTranscript.length > 60 ? "…" : ""}”`
                    : "Aguarde ~6s pela 1ª transcrição"
                  : "O microfone só inicia com o seu toque")}
            </p>
          </div>
          {typeof coveragePercent === "number" && (
            <div className="shrink-0 rounded-lg border border-border/40 bg-muted/20 px-2.5 py-1.5 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                Cob.
              </p>
              <p className="text-sm font-bold tabular-nums">{coveragePercent}%</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-3">
        <Button
          type="button"
          size="lg"
          variant={listening || requesting ? "default" : "outline"}
          className={cn(
            "h-14 w-14 rounded-full p-0",
            listening && "animate-pulse shadow-lg shadow-foreground/10",
          )}
          onClick={onToggle}
          disabled={disabled || requesting}
          aria-pressed={listening}
          aria-label={listening ? "Pausar gravação" : "Iniciar gravação"}
        >
          {requesting ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : listening ? (
            <Mic className="h-6 w-6" />
          ) : (
            <MicOff className="h-6 w-6" />
          )}
        </Button>
        <div className="text-left">
          <p className="text-sm font-medium">
            {requesting
              ? "Pedindo microfone…"
              : listening
                ? micOnlyMode
                  ? "Ouvindo a sala…"
                  : "Gravando reunião…"
                : micOnlyMode
                  ? "Ouvir reunião"
                  : "Iniciar gravação"}
          </p>
          <p className="text-xs text-muted-foreground">
            Identificação: <strong>{speakerLabel}</strong>
          </p>
          {listening && (
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-xs",
                micOnlyMode || callAudioConnected
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-amber-600 dark:text-amber-400",
              )}
            >
              {micOnlyMode ? (
                <>
                  <Mic className="h-3 w-3 shrink-0" />
                  Microfone da sala ativo
                </>
              ) : (
                <>
                  <MonitorSpeaker className="h-3 w-3 shrink-0" />
                  {callAudioConnected
                    ? "Áudio da call conectado"
                    : "Só microfone — compartilhe a aba da call"}
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {!listening && !requesting && (
        <p className="text-center text-xs text-muted-foreground/80">
          {micOnlyMode ? (
            <>
              Aponte o celular para a conversa. O Copilot captura o áudio da sala pelo microfone.
            </>
          ) : (
            <>
              Ao iniciar, selecione a aba do Meet/Zoom e marque{" "}
              <strong>Compartilhar áudio da aba</strong> para captar a prospect.
            </>
          )}
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
    micOnlyMode?: boolean;
  },
): string {
  if (options.isProcessing) return "Understanding context…";
  if (options.isTranscribing) return "Transcrevendo áudio da reunião…";
  if (options.isListening && options.lastTranscript) {
    const t = options.lastTranscript;
    return `Último trecho: "${t.slice(0, 80)}${t.length > 80 ? "…" : ""}"`;
  }
  if (options.isListening) {
    return options.micOnlyMode
      ? "Acompanhando a conversa presencial…"
      : "Estou acompanhando a conversa (mic + call)…";
  }
  return baseLine;
}
