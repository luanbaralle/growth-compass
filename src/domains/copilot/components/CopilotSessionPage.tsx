import {
  endCopilotSession,
  getCopilotSession,
  overrideCopilotEvidence,
  startCopilotSession,
} from "@/domains/copilot/api.server";
import { getLiveStatusLine } from "@/domains/copilot/engine/session-processor";
import type { CopilotSessionDetail } from "@/domains/copilot/meeting/types";
import type { CopilotSessionSnapshot, SuggestionCard, TranscriptSegment } from "@/domains/copilot/types";
import { BusinessGraphPanel } from "./BusinessGraphPanel";
import { CopilotOrb } from "./CopilotOrb";
import { CoveragePanel } from "./CoveragePanel";
import {
  LiveListenBar,
  resolveDisplayOrbState,
  resolveStatusLine,
} from "./LiveListenBar";
import { MeetingArtifactPanel } from "./MeetingArtifactPanel";
import { MeetingTranscriptPanel } from "./MeetingTranscriptPanel";
import { CopilotChatPanel } from "./CopilotChatPanel";
import { MeetingPhaseBadge } from "./TranscriptTimeline";
import { useMeetingAudioCapture } from "@/domains/copilot/stt/use-meeting-audio-capture";
import { useMeetingRecorder } from "@/domains/copilot/stt/use-meeting-recorder";
import { getErrorMessage } from "@/lib/api/client-errors";
import { OSPage, PageHeader, PageSkeleton } from "@/os/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Loader2,
  Send,
  Square,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type SpeakerMode = "auto" | "consultant" | "prospect";

function resolveSpeakerForRecording(mode: SpeakerMode): TranscriptSegment["speaker"] {
  if (mode === "auto") return "unknown";
  return mode;
}

export function CopilotSessionPage({ sessionId }: { sessionId: string }) {
  const [detail, setDetail] = useState<CopilotSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [draft, setDraft] = useState("");
  const [speakerMode, setSpeakerMode] = useState<SpeakerMode>("auto");
  const [overrideKey, setOverrideKey] = useState("");
  const [overrideValue, setOverrideValue] = useState("");
  const [skippedSuggestions, setSkippedSuggestions] = useState<string[]>([]);
  const [manualOpen, setManualOpen] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const autoListenStarted = useRef(false);

  const { recordSegment } = useMeetingRecorder(sessionId);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCopilotSession({ data: { sessionId } });
      setDetail(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar sessão."));
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!detail || detail.status !== "live") return;
    const t = setInterval(() => {
      setDetail((d) =>
        d
          ? {
              ...d,
              session: {
                ...d.session,
                elapsedSeconds: d.session.elapsedSeconds + 1,
              },
            }
          : d,
      );
    }, 1000);
    return () => clearInterval(t);
  }, [detail?.status]);

  const session = detail?.session;
  const prospectName = session?.meetingObjective.prospectName ?? "Prospect";
  const isLive = detail?.status === "live";
  const isCompleted = detail?.status === "completed";

  const savedTranscript = useMemo((): TranscriptSegment[] => {
    const live = session?.transcript ?? [];
    const archived = detail?.artifact?.transcript_segments ?? [];
    if (isCompleted && archived.length > 0) return archived;
    return live;
  }, [session?.transcript, detail?.artifact?.transcript_segments, isCompleted]);

  const onSessionUpdate = useCallback((data: CopilotSessionDetail) => {
    setDetail(data);
    setAnalyzing(false);
    setSkippedSuggestions([]);
  }, []);

  const submitSegment = useCallback(
    (text: string, source: "manual_paste" | "live_stt" = "manual_paste") => {
      if (!text.trim() || !isLive) return;
      setAnalyzing(true);
      recordSegment(
        {
          speaker: resolveSpeakerForRecording(speakerMode),
          text,
          source,
        },
        onSessionUpdate,
      );
      setDraft("");
    },
    [isLive, onSessionUpdate, recordSegment, speakerMode],
  );

  const activeSuggestion = useMemo((): SuggestionCard | null => {
    if (!session?.suggestion || session.suppressSuggestion) return null;
    if (skippedSuggestions.includes(session.suggestion.objectiveKey)) return null;
    return session.suggestion;
  }, [session?.suggestion, session?.suppressSuggestion, skippedSuggestions]);

  const {
    status: audioStatus,
    callAudioConnected,
    statusHint,
    isListening,
    isSupported,
    start: startAudioCapture,
    stop: stopAudioCapture,
    toggle: toggleAudioCapture,
  } = useMeetingAudioCapture({
    sessionId,
    onTranscript: (text) => {
      setLastTranscript(text);
      submitSegment(text, "live_stt");
    },
    onProcessingChange: setIsTranscribing,
  });

  useEffect(() => {
    if (!isLive) {
      stopAudioCapture();
      autoListenStarted.current = false;
      return;
    }
    if (!autoListenStarted.current && isSupported) {
      autoListenStarted.current = true;
      void startAudioCapture();
    }
  }, [isLive, isSupported, startAudioCapture, stopAudioCapture]);

  const baseStatusLine = useMemo(
    () => (session ? getLiveStatusLine(session) : ""),
    [session],
  );

  const displayOrb = resolveDisplayOrbState(session?.orbState ?? "idle", {
    isListening,
    isProcessing: analyzing || isTranscribing,
    isLive,
  });

  const displayStatusLine = resolveStatusLine(baseStatusLine, {
    isListening,
    isProcessing: analyzing,
    isTranscribing,
    lastTranscript,
  });

  const handleEnd = async () => {
    stopAudioCapture();
    setAnalyzing(true);
    try {
      const data = await endCopilotSession({ data: { sessionId } });
      setDetail(data);
      toast.success("Sessão encerrada — diagnóstico gerado.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao encerrar sessão."));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOverride = async () => {
    if (!overrideKey.trim() || !overrideValue.trim()) return;
    setAnalyzing(true);
    try {
      const data = await overrideCopilotEvidence({
        data: { sessionId, objectiveKey: overrideKey, value: overrideValue },
      });
      setDetail(data);
      setOverrideKey("");
      setOverrideValue("");
      toast.success("Descoberta corrigida.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao corrigir."));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSkipSuggestion = () => {
    if (activeSuggestion) {
      setSkippedSuggestions((prev) => [...prev, activeSuggestion.objectiveKey]);
    }
  };

  if (loading) return <PageSkeleton title="Raise One Copilot" metricCount={0} />;
  if (!session || !detail) {
    return (
      <OSPage>
        <PageHeader title="Sessão não encontrada" description="Verifique o link." />
      </OSPage>
    );
  }

  return (
    <OSPage className="max-w-6xl">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link
              to={detail.prospectId ? "/os/prospeccao/$id" : "/os/copilot"}
              {...(detail.prospectId ? { params: { id: detail.prospectId } } : {})}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <PageHeader title="Raise One Copilot" description={session.meetingObjective.title} />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm tabular-nums text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatElapsed(session.elapsedSeconds)}
          </div>
          {isLive && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleEnd()}
              disabled={analyzing}
            >
              {analyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Square className="h-3.5 w-3.5" />
              )}
              Encerrar
            </Button>
          )}
        </div>
      </header>

      <div className="mb-6 rounded-xl border border-border/50 bg-muted/20 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Meeting objective
        </p>
        <p className="mt-2 text-sm text-foreground/90">{session.meetingObjective.purpose}</p>
        {isLive && (
          <div className="mt-3">
            <MeetingPhaseBadge session={session} />
          </div>
        )}
      </div>

      {detail.artifact && <MeetingArtifactPanel artifact={detail.artifact} />}

      {isCompleted && (
        <MeetingTranscriptPanel
          transcript={savedTranscript}
          prospectName={prospectName}
          completed
          summary={detail.artifact?.transcript_summary}
        />
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_220px]">
        <div className="space-y-6">
          {isCompleted && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
              Reunião encerrada — transcript e diagnóstico salvos no OS.
            </div>
          )}

          {isLive && (
            <>
              <div className="flex flex-col items-center py-2 text-center">
                <CopilotOrb state={displayOrb} />
                <p className="mt-5 max-w-md text-sm text-muted-foreground">{displayStatusLine}</p>
                {session.suppressReason && session.copilotAction === "observe" && (
                  <p className="mt-2 text-xs italic text-muted-foreground/70">
                    {session.suppressReason}
                  </p>
                )}
              </div>

              <LiveListenBar
                status={audioStatus}
                callAudioConnected={callAudioConnected}
                statusHint={statusHint}
                lastTranscript={lastTranscript}
                speakerLabel={
                  speakerMode === "auto"
                    ? "Automático"
                    : speakerMode === "consultant"
                      ? "Consultor"
                      : prospectName
                }
                onToggle={toggleAudioCapture}
                disabled={false}
              />

              <MeetingTranscriptPanel
                transcript={savedTranscript}
                prospectName={prospectName}
              />

              <CopilotChatPanel
                messages={session.narratorMessages ?? []}
                isLive={isLive}
                processing={analyzing}
                onAskSuggestion={(q) => submitSegment(q, "manual_paste")}
                onSkipSuggestion={handleSkipSuggestion}
              />
            </>
          )}

          {isLive && (
            <>
              <details className="rounded-xl border border-border/40 px-4 py-3">
                <summary className="cursor-pointer text-xs text-muted-foreground">
                  Correção de falante (opcional)
                </summary>
                <div className="mt-3 flex gap-2">
                  {(["auto", "consultant", "prospect"] as const).map((mode) => (
                    <Button
                      key={mode}
                      size="sm"
                      variant={speakerMode === mode ? "secondary" : "ghost"}
                      onClick={() => setSpeakerMode(mode)}
                    >
                      {mode === "auto"
                        ? "Automático"
                        : mode === "consultant"
                          ? "Você"
                          : prospectName}
                    </Button>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground/70">
                  A gravação nunca para. Use só se a identificação automática errar.
                </p>
              </details>

              <div className="rounded-xl border border-border/40">
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setManualOpen((o) => !o)}
                >
                  Entrada manual
                  {manualOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {manualOpen && (
                  <div className="space-y-3 border-t border-border/40 p-4">
                    <Textarea
                      placeholder="Digite o que foi dito…"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          submitSegment(draft);
                        }
                      }}
                      rows={2}
                    />
                    <Button size="sm" onClick={() => submitSegment(draft)} disabled={!draft.trim()}>
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Adicionar
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {!isCompleted && (
            <details className="rounded-xl border border-border/40 px-4 py-3">
            <summary className="cursor-pointer text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Human override
            </summary>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                placeholder="objectiveKey"
                value={overrideKey}
                onChange={(e) => setOverrideKey(e.target.value)}
              />
              <Input
                placeholder="Valor correto"
                value={overrideValue}
                onChange={(e) => setOverrideValue(e.target.value)}
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => void handleOverride()}
                disabled={analyzing}
              >
                Verificar
              </Button>
            </div>
          </details>
          )}

          {!detail.artifact && <ProposalReadinessPanel session={session} />}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <CoveragePanel coverage={session.coverage} overall={session.overallCoverage} />
          <BusinessGraphPanel profile={session.businessProfile} />
        </aside>
      </div>
    </OSPage>
  );
}

function ProposalReadinessPanel({ session }: { session: CopilotSessionSnapshot }) {
  return (
    <div className="rounded-xl border border-border/40 px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        Proposal readiness
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {session.proposalReadiness.items.map((item) => (
          <div key={item.key} className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "font-mono",
                item.status === "ready" && "text-emerald-500",
                item.status === "partial" && "text-amber-500",
                item.status === "missing" && "text-red-400/80",
              )}
            >
              {item.status === "ready" ? "✓" : item.status === "partial" ? "⚠" : "✕"}
            </span>
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
      {session.proposalReadiness.blockers[0] && (
        <p className="mt-3 text-xs text-amber-600/90 dark:text-amber-400">
          {session.proposalReadiness.blockers[0]}
        </p>
      )}
    </div>
  );
}

export async function createSessionAndNavigate(
  navigate: (opts: { to: string; params: { sessionId: string } }) => void,
  input: { prospectName: string; companyName: string; prospectId?: string },
) {
  const detail = await startCopilotSession({ data: input });
  navigate({ to: "/os/copilot/$sessionId", params: { sessionId: detail.session.id } });
}
