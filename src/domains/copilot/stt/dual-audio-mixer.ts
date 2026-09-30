export type DualAudioHandle = {
  mixedStream: MediaStream;
  micStream: MediaStream;
  callStream: MediaStream | null;
  audioContext: AudioContext | null;
};

/**
 * Pede o microfone com fallback — constraints avançadas falham em alguns WebKits.
 */
export async function acquireMicrophoneStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("getUserMedia indisponível (precisa HTTPS).");
  }

  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (first) {
    try {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      throw first;
    }
  }
}

/** True when tab/window capture is unlikely to work (phones, tablets, coarse pointer). */
export function shouldPreferMicOnlyCapture(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return true;
  if (!navigator.mediaDevices?.getDisplayMedia) return true;
  if (window.matchMedia("(pointer: coarse)").matches) return true;
  if (window.matchMedia("(max-width: 767px)").matches) return true;
  const ua = navigator.userAgent || "";
  return /Android|iPhone|iPad|iPod|Mobile|CriOS|FxiOS/i.test(ua);
}

export function isMeetingAudioSupported(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.isSecureContext && location.hostname !== "localhost") return false;
  if (!navigator.mediaDevices?.getUserMedia) return false;
  if (typeof MediaRecorder === "undefined") return false;
  return true;
}

/**
 * Captura áudio da aba/janela (Meet, Zoom no browser, etc.).
 * Em mobile / touch, retorna null — reunião presencial usa só o microfone.
 */
export async function acquireCallAudioStream(): Promise<MediaStream | null> {
  if (shouldPreferMicOnlyCapture()) return null;

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      suppressLocalAudioPlayback: false,
    },
  });

  for (const track of stream.getVideoTracks()) {
    track.stop();
    stream.removeTrack(track);
  }

  if (stream.getAudioTracks().length === 0) {
    stream.getTracks().forEach((t) => t.stop());
    return null;
  }

  return stream;
}

/**
 * Mic-only: grava o stream do microfone direto (sem AudioContext).
 * MediaStreamDestination costuma sair mudo no iOS / Chrome iOS.
 */
export function createMicOnlyHandle(micStream: MediaStream): DualAudioHandle {
  return {
    mixedStream: micStream,
    micStream,
    callStream: null,
    audioContext: null,
  };
}

export async function mixAudioStreams(
  micStream: MediaStream,
  callStream: MediaStream | null,
): Promise<DualAudioHandle> {
  if (!callStream) {
    return createMicOnlyHandle(micStream);
  }

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) {
    return createMicOnlyHandle(micStream);
  }

  const audioContext = new AudioCtx();
  if (audioContext.state === "suspended") {
    try {
      await audioContext.resume();
    } catch {
      // fall through
    }
  }

  const destination = audioContext.createMediaStreamDestination();
  audioContext.createMediaStreamSource(micStream).connect(destination);
  audioContext.createMediaStreamSource(callStream).connect(destination);

  return {
    mixedStream: destination.stream,
    micStream,
    callStream,
    audioContext,
  };
}

export function stopDualAudio(handle: DualAudioHandle | null): void {
  if (!handle) return;
  handle.micStream.getTracks().forEach((t) => t.stop());
  handle.callStream?.getTracks().forEach((t) => t.stop());
  if (handle.mixedStream !== handle.micStream) {
    handle.mixedStream.getTracks().forEach((t) => t.stop());
  }
  if (handle.audioContext) {
    void handle.audioContext.close();
  }
}

/**
 * Safari / Chrome iOS: mp4/aac. Desktop Chrome: webm/opus.
 */
export function pickRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "audio/mp4",
    "audio/aac",
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mpeg",
  ];
  for (const type of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(type)) return type;
    } catch {
      // ignore
    }
  }
  return undefined;
}

export function describeMediaError(err: unknown): string {
  const name = err && typeof err === "object" && "name" in err ? String((err as { name: string }).name) : "";
  const message =
    err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "";

  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return "Permissão de microfone negada. Toque de novo e aceite o aviso do navegador.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "Nenhum microfone encontrado neste aparelho.";
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return "Microfone em uso por outro app. Feche o outro app e tente de novo.";
  }
  if (name === "SecurityError" || !window.isSecureContext) {
    return "Microfone exige conexão segura (HTTPS).";
  }
  if (name === "AbortError") {
    return "Pedido de microfone cancelado. Toque de novo.";
  }
  return message || "Não foi possível acessar o microfone.";
}
