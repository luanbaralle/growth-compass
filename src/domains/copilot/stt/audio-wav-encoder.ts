/** Converte blob de áudio (webm/ogg) em WAV 16 kHz mono — formato mais compatível com Whisper. */

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i)!);
  }
}

function mixAndResample(audioBuffer: AudioBuffer, targetSampleRate: number): Float32Array {
  const sourceRate = audioBuffer.sampleRate;
  const length = Math.max(1, Math.ceil(audioBuffer.duration * targetSampleRate));
  const samples = new Float32Array(length);

  const channels: Float32Array[] = [];
  for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
    channels.push(audioBuffer.getChannelData(c));
  }

  for (let i = 0; i < length; i++) {
    const srcIdx = (i * sourceRate) / targetSampleRate;
    const idx0 = Math.min(Math.floor(srcIdx), audioBuffer.length - 1);
    const idx1 = Math.min(idx0 + 1, audioBuffer.length - 1);
    const frac = srcIdx - idx0;
    let sample = 0;
    for (const ch of channels) {
      sample += ch[idx0]! * (1 - frac) + ch[idx1]! * frac;
    }
    samples[i] = sample / channels.length;
  }

  return samples;
}

function encodeWavPcm16(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const dataLength = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return buffer;
}

function bytesToBase64(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]!);
  }
  return btoa(binary);
}

const TARGET_SAMPLE_RATE = 16000;

export async function blobToWavBase64(
  blob: Blob,
): Promise<{ base64: string; format: "wav" } | null> {
  if (blob.size < 800) return null;

  const ctx = new AudioContext();
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const samples = mixAndResample(audioBuffer, TARGET_SAMPLE_RATE);
    const wav = encodeWavPcm16(samples, TARGET_SAMPLE_RATE);
    return { base64: bytesToBase64(wav), format: "wav" };
  } catch {
    return null;
  } finally {
    void ctx.close();
  }
}
