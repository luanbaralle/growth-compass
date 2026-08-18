/**
 * Web Speech API — STT em tempo real (Sprint 3).
 * Chrome/Edge: suporte nativo pt-BR. Safari/Firefox: fallback manual.
 */
import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type CopilotSpeechStatus = "idle" | "listening" | "unsupported" | "denied";

export function useCopilotSpeech(options: {
  onFinalTranscript: (text: string) => void;
  lang?: string;
}) {
  const { onFinalTranscript, lang = "pt-BR" } = options;
  const [status, setStatus] = useState<CopilotSpeechStatus>(() =>
    getSpeechRecognition() ? "idle" : "unsupported",
  );
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const lastFinalRef = useRef("");
  const onFinalRef = useRef(onFinalTranscript);
  onFinalRef.current = onFinalTranscript;

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setInterimText("");
    setStatus((s) => (s === "unsupported" || s === "denied" ? s : "idle"));
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setStatus("unsupported");
      return;
    }

    stop();

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus("listening");
      lastFinalRef.current = "";
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setStatus("denied");
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        setStatus("idle");
      }
      setInterimText("");
    };

    recognition.onend = () => {
      setInterimText("");
      setStatus((s) => (s === "denied" || s === "unsupported" ? s : "idle"));
      recognitionRef.current = null;
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result?.[0]) continue;
        const text = result[0].transcript.trim();
        if (!text) continue;
        if (result.isFinal) {
          finalChunk += (finalChunk ? " " : "") + text;
        } else {
          interim += (interim ? " " : "") + text;
        }
      }

      setInterimText(interim);

      if (finalChunk && finalChunk !== lastFinalRef.current) {
        lastFinalRef.current = finalChunk;
        onFinalRef.current(finalChunk);
        setInterimText("");
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setStatus("idle");
    }
  }, [lang, stop]);

  const toggle = useCallback(() => {
    if (status === "listening") {
      stop();
    } else {
      start();
    }
  }, [status, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return {
    status,
    interimText,
    isListening: status === "listening",
    isSupported: status !== "unsupported",
    start,
    stop,
    toggle,
  };
}
