/**
 * Captura mic + áudio da call (aba do browser), grava chunks e transcreve via OpenRouter.
 */
import { useCallback, useRef, useState } from "react";
import { transcribeCopilotAudio } from "@/domains/copilot/api.server";
import { blobToWavBase64 } from "./audio-wav-encoder";
import {
  acquireCallAudioStream,
  acquireMicrophoneStream,
  mixAudioStreams,
  pickRecorderMimeType,
  stopDualAudio,
  type DualAudioHandle,
} from "./dual-audio-mixer";

export type MeetingAudioStatus =
  | "idle"
  | "unsupported"
  | "mic_denied"
  | "listening"
  | "call_audio_missing"
  | "stt_error";

const CHUNK_MS = 5000;
const MIN_BLOB_BYTES = 2000;

export function useMeetingAudioCapture(options: {
  sessionId: string;
  onTranscript: (text: string) => void;
  onProcessingChange?: (processing: boolean) => void;
}) {
  const { sessionId, onTranscript, onProcessingChange } = options;
  const [status, setStatus] = useState<MeetingAudioStatus>(() =>
    typeof window !== "undefined" && navigator.mediaDevices?.getUserMedia
      ? "idle"
      : "unsupported",
  );
  const [callAudioConnected, setCallAudioConnected] = useState(false);
  const [statusHint, setStatusHint] = useState("");

  const handleRef = useRef<DualAudioHandle | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);
  const sttFailuresRef = useRef(0);
  const transcribeQueueRef = useRef(Promise.resolve());
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  const enqueueTranscription = useCallback(
    (blob: Blob) => {
      if (blob.size < MIN_BLOB_BYTES) return;

      transcribeQueueRef.current = transcribeQueueRef.current.then(async () => {
        onProcessingChange?.(true);
        try {
          const encoded = await blobToWavBase64(blob);
          if (!encoded) {
            sttFailuresRef.current += 1;
            return;
          }

          const result = await transcribeCopilotAudio({
            data: { sessionId, audioBase64: encoded.base64, format: encoded.format },
          });

          if (result?.text) {
            sttFailuresRef.current = 0;
            setStatusHint("");
            onTranscriptRef.current(result.text);
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
              "Falha na transcrição (STT). Verifique OPENROUTER_API_KEY e OPENROUTER_STT_MODEL no .env.",
            );
          }
        }
      });
    },
    [onProcessingChange, sessionId],
  );

  const recordNextChunk = useCallback(
    (stream: MediaStream, mimeType?: string) => {
      if (!activeRef.current) return;

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size >= MIN_BLOB_BYTES) {
          enqueueTranscription(event.data);
        }
      };

      recorder.onstop = () => {
        if (activeRef.current) {
          chunkTimerRef.current = setTimeout(() => recordNextChunk(stream, mimeType), 50);
        }
      };

      recorder.start();
      recorderRef.current = recorder;

      chunkTimerRef.current = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, CHUNK_MS);
    },
    [enqueueTranscription],
  );

  const stop = useCallback(() => {
    activeRef.current = false;
    if (chunkTimerRef.current) {
      clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    stopDualAudio(handleRef.current);
    handleRef.current = null;
    setCallAudioConnected(false);
    setStatusHint("");
    sttFailuresRef.current = 0;
    setStatus((s) => (s === "unsupported" || s === "mic_denied" ? s : "idle"));
  }, []);

  const start = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }

    stop();
    activeRef.current = true;
    sttFailuresRef.current = 0;

    let micStream: MediaStream;
    try {
      micStream = await acquireMicrophoneStream();
    } catch {
      activeRef.current = false;
      setStatus("mic_denied");
      return;
    }

    let callStream: MediaStream | null = null;
    try {
      setStatusHint("Selecione a aba da call e marque Compartilhar áudio da aba…");
      callStream = await acquireCallAudioStream();
    } catch {
      callStream = null;
    }

    if (!activeRef.current) {
      micStream.getTracks().forEach((t) => t.stop());
      callStream?.getTracks().forEach((t) => t.stop());
      return;
    }

    setCallAudioConnected(Boolean(callStream));
    setStatusHint("");

    const handle = mixAudioStreams(micStream, callStream);
    handleRef.current = handle;

    if (callStream) {
      callStream.getAudioTracks()[0]?.addEventListener("ended", () => {
        setCallAudioConnected(false);
        setStatus("call_audio_missing");
        setStatusHint("Áudio da call desconectado — reconecte a aba.");
      });
    }

    const mimeType = pickRecorderMimeType();
    recordNextChunk(handle.mixedStream, mimeType);

    setStatus(callStream ? "listening" : "call_audio_missing");
    if (!callStream) {
      setStatusHint(
        "Só microfone ativo. Para captar a prospect na call, pare e inicie de novo compartilhando a aba com áudio.",
      );
    }
  }, [recordNextChunk, stop]);

  const toggle = useCallback(() => {
    if (status === "listening" || status === "call_audio_missing" || status === "stt_error") {
      stop();
    } else {
      void start();
    }
  }, [start, status, stop]);

  return {
    status,
    callAudioConnected,
    statusHint,
    isListening:
      status === "listening" || status === "call_audio_missing" || status === "stt_error",
    isSupported: status !== "unsupported",
    start,
    stop,
    toggle,
  };
}
