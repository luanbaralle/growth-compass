import { useCallback, useRef } from "react";
import {
  analyzeCopilotSegment,
  appendCopilotSegment,
} from "@/domains/copilot/api.server";
import { getErrorMessage } from "@/lib/api/client-errors";
import type { CopilotSessionDetail } from "@/domains/copilot/meeting/types";
import type { TranscriptSegment } from "@/domains/copilot/types";
import { toast } from "sonner";

type PendingSegment = {
  segmentId: string;
  speaker: TranscriptSegment["speaker"];
  text: string;
  source: "manual_paste" | "live_stt";
  startedAt: string;
};

const MAX_RETRIES = 3;

export function useMeetingRecorder(sessionId: string) {
  const pendingRef = useRef<PendingSegment[]>([]);
  const processingRef = useRef(false);

  const flushQueue = useCallback(
    async (onUpdate: (detail: CopilotSessionDetail) => void) => {
      if (processingRef.current) return;
      processingRef.current = true;

      try {
        while (pendingRef.current.length > 0) {
          const item = pendingRef.current[0]!;
          let appended = false;

          for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
              const detail = await appendCopilotSegment({
                data: {
                  sessionId,
                  segmentId: item.segmentId,
                  speaker: item.speaker,
                  text: item.text,
                  source: item.source,
                  startedAt: item.startedAt,
                },
              });
              onUpdate(detail);
              appended = true;

              void analyzeCopilotSegment({
                data: { sessionId, segmentId: item.segmentId },
              })
                .then(onUpdate)
                .catch((err) => {
                  console.error("[copilot] analyze failed:", err);
                });

              break;
            } catch (err) {
              if (attempt === MAX_RETRIES - 1) {
                toast.error(getErrorMessage(err, "Erro ao salvar transcript."));
              }
            }
          }

          if (appended) {
            pendingRef.current.shift();
          } else {
            break;
          }
        }
      } finally {
        processingRef.current = false;
      }
    },
    [sessionId],
  );

  const recordSegment = useCallback(
    (
      input: Omit<PendingSegment, "segmentId" | "startedAt"> & {
        segmentId?: string;
        startedAt?: string;
      },
      onUpdate: (detail: CopilotSessionDetail) => void,
    ) => {
      const item: PendingSegment = {
        segmentId: input.segmentId ?? crypto.randomUUID(),
        speaker: input.speaker,
        text: input.text.trim(),
        source: input.source,
        startedAt: input.startedAt ?? new Date().toISOString(),
      };
      if (!item.text) return;

      pendingRef.current.push(item);
      void flushQueue(onUpdate);
    },
    [flushQueue],
  );

  return { recordSegment };
}
