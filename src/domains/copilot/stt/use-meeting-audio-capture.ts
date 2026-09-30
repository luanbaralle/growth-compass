/**
 * Captura mic (+ áudio da call no desktop), grava chunks e transcreve via OpenRouter.
 *
 * Mobile / iOS: grava o microfone direto (sem AudioContext mixer).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { transcribeCopilotAudio } from "@/domains/copilot/api.server";
import { cleanSttSegmentText } from "@/domains/copilot/engine/transcript-normalizer";
import { blobToWavBase64 } from "./audio-wav-encoder";
import {
  acquireCallAudioStream,
  acquireMicrophoneStream,
  describeMediaError,
  isMeetingAudioSupported,
  mixAudioStreams,
  pickRecorderMimeType,
  shouldPreferMicOnlyCapture,
  stopDualAudio,
  type DualAudioHandle,
} from "./dual-audio-mixer";

export type MeetingAudioStatus =
  | "idle"
  | "requesting"
  | "unsupported"
  | "mic_denied"
  | "listening"
  | "call_audio_missing"
  | "stt_error";

const CHUNK_MS = 6000;
const MIN_BLOB_BYTES = 800;

function cleanupHandle(handle: DualAudioHandle | null) {
  stopDualAudio(handle);
}

export function useMeetingAudioCapture(options: {
  sessionId: string;
  onTranscript: (text: string) => void;
  onProcessingChange?: (processing: boolean) => void;
}) {
  const { sessionId, onTranscript, onProcessingChange } = options;
  const [status, setStatus] = useState<MeetingAudioStatus>("idle");
  const [callAudioConnected, setCallAudioConnected] = useState(false);
  const [micOnlyMode, setMicOnlyMode] = useState(() =>
    typeof window !== "undefined" ? shouldPreferMicOnlyCapture() : true,
  );
  const [statusHint, setStatusHint] = useState("");

  const handleRef = useRef<DualAudioHandle | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);
  const startGenRef = useRef(0);
  const sttFailuresRef = useRef(0);
  const chunksReceivedRef = useRef(0);
  const transcribeQueueRef = useRef(Promise.resolve());
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  // Fix SSR/hydration: re-check support on the client.
  useEffect(() => {
    if (!isMeetingAudioSupported()) {
      setStatus("unsupported");
      if (typeof window !== "undefined" && !window.isSecureContext && location.hostname !== "localhost") {
        setStatusHint("Abra o site em HTTPS para usar o microfone.");
      } else if (typeof MediaRecorder === "undefined") {
        setStatusHint("Este navegador não grava áudio. Tente Chrome no Android ou entrada manual.");
      }
    }
  }, []);

  const clearTimersAndRecorder = useCallback(() => {
    if (chunkTimerRef.current) {
      clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (recorder && recorder.state === "recording") {
      try {
        recorder.onstop = null;
        recorder.stop();
      } catch {
        // ignore
      }
    }
  }, []);

  const enqueueTranscription = useCallback(
    (blob: Blob) => {
      chunksReceivedRef.current += 1;
      if (blob.size < MIN_BLOB_BYTES) return;

      transcribeQueueRef.current = transcribeQueueRef.current.then(async () => {
        if (!activeRef.current) return;
        onProcessingChange?.(true);
        try {
          const encoded = await blobToWavBase64(blob);
          if (!encoded) {
            sttFailuresRef.current += 1;
            if (sttFailuresRef.current >= 2) {
              setStatusHint("Não consegui decodificar o áudio. Toque no mic e tente de novo.");
            }
            return;
          }

          const result = await transcribeCopilotAudio({
            data: { sessionId, audioBase64: encoded.base64, format: encoded.format },
          });

          if (result?.text) {
            const cleaned = cleanSttSegmentText(result.text);
            if (!cleaned) return;
            sttFailuresRef.current = 0;
            setStatusHint("");
            onTranscriptRef.current(cleaned);
          } else {
            sttFailuresRef.current += 1;
          }
        } catch {
          sttFailuresRef.current += 1;
        } finally {
          onProcessingChange?.(false);
          if (sttFailuresRef.current >= 3 && activeRef.current) {
            setStatus("stt_error");
            setStatusHint(
              "Falha na transcrição. Verifique o microfone e tente tocar de novo no botão.",
            );
          }
        }
      });
    },
    [onProcessingChange, sessionId],
  );

  const recordNextChunk = useCallback(
    (stream: MediaStream, mimeType: string | undefined, gen: number) => {
      if (!activeRef.current || startGenRef.current !== gen) return;
      if (typeof MediaRecorder === "undefined") {
        setStatus("unsupported");
        setStatusHint("MediaRecorder indisponível neste navegador.");
        return;
      }

      let recorder: MediaRecorder;
      try {
        recorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);
      } catch {
        try {
          recorder = new MediaRecorder(stream);
        } catch {
          setStatus("unsupported");
          setStatusHint("Este navegador não grava áudio. Use entrada manual.");
          return;
        }
      }

      const parts: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) parts.push(event.data);
      };

      recorder.onerror = () => {
        sttFailuresRef.current += 1;
        setStatusHint("Erro ao gravar áudio. Toque no mic novamente.");
      };

      recorder.onstop = () => {
        if (parts.length > 0) {
          const type = parts[0]?.type || mimeType || "audio/webm";
          enqueueTranscription(new Blob(parts, { type }));
        }
        if (activeRef.current && startGenRef.current === gen) {
          chunkTimerRef.current = setTimeout(
            () => recordNextChunk(stream, mimeType, gen),
            80,
          );
        }
      };

      try {
        recorder.start();
      } catch {
        setStatus("unsupported");
        setStatusHint("Não foi possível iniciar a gravação neste navegador.");
        return;
      }

      recorderRef.current = recorder;

      chunkTimerRef.current = setTimeout(() => {
        if (recorder.state === "recording") {
          try {
            recorder.stop();
          } catch {
            // ignore
          }
        }
      }, CHUNK_MS);
    },
    [enqueueTranscription],
  );

  const stop = useCallback(() => {
    startGenRef.current += 1;
    activeRef.current = false;
    clearTimersAndRecorder();
    cleanupHandle(handleRef.current);
    handleRef.current = null;
    setCallAudioConnected(false);
    setStatusHint("");
    sttFailuresRef.current = 0;
    chunksReceivedRef.current = 0;
    setStatus((s) => (s === "unsupported" ? s : "idle"));
  }, [clearTimersAndRecorder]);

  const start = useCallback(async () => {
    if (!isMeetingAudioSupported()) {
      setStatus("unsupported");
      setStatusHint(
        !window.isSecureContext && location.hostname !== "localhost"
          ? "Abra o site em HTTPS para usar o microfone."
          : "Gravação indisponível neste navegador. Use a entrada manual.",
      );
      return { ok: false as const, error: "unsupported" };
    }

    const gen = startGenRef.current + 1;
    startGenRef.current = gen;

    // Tear down previous session without flipping to idle (avoids UI flicker).
    activeRef.current = false;
    clearTimersAndRecorder();
    cleanupHandle(handleRef.current);
    handleRef.current = null;

    activeRef.current = true;
    sttFailuresRef.current = 0;
    chunksReceivedRef.current = 0;
    setStatus("requesting");
    setStatusHint("Solicitando microfone…");

    let micStream: MediaStream;
    try {
      micStream = await acquireMicrophoneStream();
    } catch (err) {
      if (startGenRef.current !== gen) return { ok: false as const, error: "aborted" };
      activeRef.current = false;
      const msg = describeMediaError(err);
      setStatus("mic_denied");
      setStatusHint(msg);
      return { ok: false as const, error: msg };
    }

    if (startGenRef.current !== gen || !activeRef.current) {
      micStream.getTracks().forEach((t) => t.stop());
      return { ok: false as const, error: "aborted" };
    }

    const preferMicOnly = shouldPreferMicOnlyCapture();
    setMicOnlyMode(preferMicOnly);

    let callStream: MediaStream | null = null;
    if (!preferMicOnly) {
      try {
        setStatusHint("Selecione a aba da call e marque Compartilhar áudio da aba…");
        callStream = await acquireCallAudioStream();
      } catch {
        callStream = null;
      }
    }

    if (startGenRef.current !== gen || !activeRef.current) {
      micStream.getTracks().forEach((t) => t.stop());
      callStream?.getTracks().forEach((t) => t.stop());
      return { ok: false as const, error: "aborted" };
    }

    setCallAudioConnected(Boolean(callStream));

    const handle = await mixAudioStreams(micStream, callStream);
    if (startGenRef.current !== gen || !activeRef.current) {
      cleanupHandle(handle);
      return { ok: false as const, error: "aborted" };
    }
    handleRef.current = handle;

    if (callStream) {
      callStream.getAudioTracks()[0]?.addEventListener("ended", () => {
        setCallAudioConnected(false);
        setStatus("call_audio_missing");
        setStatusHint("Áudio da call desconectado — reconecte a aba.");
      });
    }

    const mimeType = pickRecorderMimeType();
    recordNextChunk(handle.mixedStream, mimeType, gen);

    if (callStream) {
      setStatus("listening");
      setStatusHint("");
    } else if (preferMicOnly) {
      setStatus("listening");
      setStatusHint("Ouvindo a sala… fale perto do microfone.");
    } else {
      setStatus("call_audio_missing");
      setStatusHint(
        "Só microfone ativo. Para captar a prospect na call, compartilhe a aba com áudio.",
      );
    }

    if (preferMicOnly) {
      window.setTimeout(() => {
        if (activeRef.current && startGenRef.current === gen && chunksReceivedRef.current === 0) {
          setStatusHint("Gravando… a primeira transcrição aparece em ~6s.");
        }
      }, 2500);
    }

    return { ok: true as const };
  }, [clearTimersAndRecorder, recordNextChunk]);

  const toggle = useCallback(async () => {
    if (
      status === "listening" ||
      status === "call_audio_missing" ||
      status === "stt_error" ||
      status === "requesting"
    ) {
      if (status === "requesting") return { ok: false as const, error: "busy" };
      stop();
      return { ok: true as const, stopped: true as const };
    }
    return start();
  }, [start, status, stop]);

  return {
    status,
    callAudioConnected,
    micOnlyMode,
    statusHint,
    isListening:
      status === "listening" || status === "call_audio_missing" || status === "stt_error",
    isRequesting: status === "requesting",
    isSupported: status !== "unsupported",
    requiresUserGesture: micOnlyMode,
    start,
    stop,
    toggle,
  };
}
