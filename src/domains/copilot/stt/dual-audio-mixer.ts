export type DualAudioHandle = {
  mixedStream: MediaStream;
  micStream: MediaStream;
  callStream: MediaStream | null;
  audioContext: AudioContext;
};

export async function acquireMicrophoneStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
}

/**
 * Captura áudio da aba/janela (Meet, Zoom no browser, etc.).
 * O usuário deve marcar "Compartilhar áudio da aba" no diálogo do Chrome.
 */
export async function acquireCallAudioStream(): Promise<MediaStream | null> {
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

export function mixAudioStreams(
  micStream: MediaStream,
  callStream: MediaStream | null,
): DualAudioHandle {
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();

  audioContext.createMediaStreamSource(micStream).connect(destination);

  if (callStream) {
    audioContext.createMediaStreamSource(callStream).connect(destination);
  }

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
  handle.mixedStream.getTracks().forEach((t) => t.stop());
  void handle.audioContext.close();
}

export function pickRecorderMimeType(): string | undefined {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];
  for (const type of candidates) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return undefined;
}

export async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}
