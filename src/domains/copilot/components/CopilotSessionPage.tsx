import {
  cancelCopilotSession,
  endCopilotSession,
  exportCopilotBriefingPdf,
  exportCopilotCreativeBriefPdf,
  getCopilotSession,
  overrideCopilotEvidence,
  pushCopilotSessionToCompany,
  reprocessCopilotSession,
  startCopilotSession,
} from "@/domains/copilot/api.server";
import { createProposalFromCopilot } from "@/domains/proposals/api.server";
import { getLiveStatusLine } from "@/domains/copilot/engine/session-processor";
import type { CopilotSessionDetail } from "@/domains/copilot/meeting/types";
import type { CopilotSessionSnapshot, SuggestionCard, TranscriptSegment } from "@/domains/copilot/types";
import { BriefingQaPanel } from "./BriefingQaPanel";
import { BusinessGraphPanel } from "./BusinessGraphPanel";
import { CopilotOrb } from "./CopilotOrb";
import { CopilotProcessingView } from "./CopilotProcessingView";
import { CoveragePanel } from "./CoveragePanel";
import { EvidenceGraphPanel } from "./EvidenceGraphPanel";
import { EvidenceOverridePanel } from "./EvidenceOverridePanel";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileDown,
  FileText,
  Loader2,
  Send,
  RefreshCw,
  Square,
  X,
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

function downloadBase64File(base64: string, filename: string, mimeType: string): void {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function CopilotSessionPage({ sessionId }: { sessionId: string }) {
  const navigate = useNavigate();
  const [detail, setDetail] = useState<CopilotSessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [draft, setDraft] = useState("");
  const [speakerMode, setSpeakerMode] = useState<SpeakerMode>("auto");
  const [overrideKey, setOverrideKey] = useState("");
  const [overrideValue, setOverrideValue] = useState("");
  const [skippedSuggestions, setSkippedSuggestions] = useState<string[]>([]);
  const [reprocessing, setReprocessing] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingBrief, setExportingBrief] = useState(false);
  const [creatingProposal, setCreatingProposal] = useState(false);
  const [pushingToCompany, setPushingToCompany] = useState(false);
  const [cancelling, setCancelling] = useState(false);
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
    if (detail?.status !== "processing") return;
    const t = setInterval(() => {
      void load();
    }, 2500);
    return () => clearInterval(t);
  }, [detail?.status, load]);

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
  const isProcessing = detail?.status === "processing";
  const isCompleted = detail?.status === "completed";
  const isCancelled = detail?.status === "cancelled";

  const savedTranscript = useMemo((): TranscriptSegment[] => {
    const live = session?.transcript ?? [];
    const archived = detail?.artifact?.transcript_segments ?? [];
    if (isCompleted && archived.length > 0) return archived;
    return live;
  }, [session?.transcript, detail?.artifact?.transcript_segments, isCompleted]);

  const evidenceGraphItems = useMemo(() => {
    if (detail?.artifact?.evidence_graph?.length) return detail.artifact.evidence_graph;
    return session?.evidenceGraph ?? [];
  }, [detail?.artifact?.evidence_graph, session?.evidenceGraph]);

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

  const handleReprocess = async () => {
    setReprocessing(true);
    try {
      const data = await reprocessCopilotSession({ data: { sessionId } });
      setDetail(data);
      toast.success("Transcript reprocessado — diagnóstico atualizado.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao reprocessar sessão."));
    } finally {
      setReprocessing(false);
    }
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const { filename, base64 } = await exportCopilotBriefingPdf({ data: { sessionId } });
      downloadBase64File(base64, filename, "application/pdf");
      toast.success("Briefing exportado em PDF.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao exportar briefing."));
    } finally {
      setExportingPdf(false);
    }
  };

  const handleExportCreativeBrief = async () => {
    setExportingBrief(true);
    try {
      const { filename, base64, brief } = await exportCopilotCreativeBriefPdf({
        data: { sessionId },
      });
      downloadBase64File(base64, filename, "application/pdf");
      toast.success(
        brief.generationError
          ? "Brief exportado com avisos — revise o PDF."
          : `Brief criativo gerado (${brief.sections.length} seções).`,
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao gerar brief criativo."));
    } finally {
      setExportingBrief(false);
    }
  };

  const handleCreateProposal = async () => {
    setCreatingProposal(true);
    try {
      const proposal = await createProposalFromCopilot({ data: { sessionId } });
      toast.success("Rascunho de proposta criado.");
      await navigate({ to: "/os/propostas/$id", params: { id: proposal.id } });
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao criar proposta."));
    } finally {
      setCreatingProposal(false);
    }
  };

  const handlePushToCompany = async () => {
    setPushingToCompany(true);
    try {
      const result = await pushCopilotSessionToCompany({ data: { sessionId } });
      toast.success(
        result.created
          ? "Empresa criada com o diagnóstico do Copilot."
          : "Diagnóstico registrado na empresa.",
      );
      await navigate({ to: "/os/empresas/$id", params: { id: result.companyId } });
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao enviar para Empresas."));
    } finally {
      setPushingToCompany(false);
    }
  };

  const handleEnd = async () => {
    stopAudioCapture();
    setAnalyzing(true);
    try {
      const data = await endCopilotSession({
        data: {
          sessionId,
          elapsedSeconds: session?.elapsedSeconds ?? 0,
        },
      });
      setDetail(data);
      toast.success("Sessão encerrada — diagnóstico gerado.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao encerrar sessão."));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancelar a sessão sem gerar diagnóstico?")) return;
    stopAudioCapture();
    setCancelling(true);
    try {
      const data = await cancelCopilotSession({ data: { sessionId } });
      setDetail(data);
      toast.success("Sessão cancelada.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao cancelar sessão."));
    } finally {
      setCancelling(false);
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
    <OSPage className="max-w-7xl">
      {/* ── Header ── */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" className="mt-0.5 shrink-0" asChild>
            <Link
              to={detail.prospectId ? "/os/prospeccao/$id" : "/os/copilot"}
              {...(detail.prospectId ? { params: { id: detail.prospectId } } : {})}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">Raise One Copilot</h1>
              {isProcessing && (
                <Badge
                  variant="outline"
                  className="border-amber-500/25 bg-amber-500/8 text-amber-600"
                >
                  Processando
                </Badge>
              )}
              {isCompleted && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/25 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400"
                >
                  Reunião encerrada
                </Badge>
              )}
              {isLive && (
                <Badge
                  variant="outline"
                  className="border-red-500/25 bg-red-500/8 text-red-500 animate-pulse"
                >
                  Ao vivo
                </Badge>
              )}
              {isCancelled && (
                <Badge variant="outline" className="border-muted-foreground/25 text-muted-foreground">
                  Cancelada
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {session.meetingObjective.title}
            </p>
            {session.meetingObjective.companyName && (
              <p className="mt-0.5 text-xs text-muted-foreground/70">
                {session.meetingObjective.prospectName} · {session.meetingObjective.companyName}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/15 px-3 py-1.5 text-sm tabular-nums text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatElapsed(session.elapsedSeconds)}
          </div>
          {isCompleted && detail.artifact && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => void handleCreateProposal()}
                disabled={creatingProposal || detail.status === "processing"}
              >
                {creatingProposal ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                )}
                Criar proposta
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleExportCreativeBrief()}
                disabled={exportingBrief || detail.status === "processing"}
              >
                {exportingBrief ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                )}
                Brief criativo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleExportPdf()}
                disabled={exportingPdf || detail.status === "processing"}
              >
                {exportingPdf ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileDown className="mr-1.5 h-3.5 w-3.5" />
                )}
                Exportar PDF
              </Button>
              {detail.prospectId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handlePushToCompany()}
                  disabled={pushingToCompany || detail.status === "processing"}
                >
                  {pushingToCompany ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Building2 className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Enviar p/ Empresa
                </Button>
              )}
            </>
          )}
          {isCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleReprocess()}
              disabled={reprocessing || detail.status === "processing"}
            >
              {reprocessing ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              )}
              Reprocessar
            </Button>
          )}
          {isLive && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => void handleCancel()}
                disabled={analyzing || cancelling}
              >
                {cancelling ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <X className="mr-1.5 h-3.5 w-3.5" />
                )}
                Cancelar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleEnd()}
                disabled={analyzing || cancelling}
              >
                {analyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Square className="h-3.5 w-3.5" />
                )}
                Encerrar
              </Button>
            </>
          )}
        </div>
      </header>

      {/* ── Meeting objective strip ── */}
      <Card className="mb-6 border-border/50 bg-muted/10 shadow-sm">
        <CardContent className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/55">
              Objetivo da reunião
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
              {session.meetingObjective.purpose}
            </p>
          </div>
          {isLive && <MeetingPhaseBadge session={session} />}
        </CardContent>
      </Card>

      {/* ── Processing ── */}
      {isProcessing && (
        <CopilotProcessingView mode={reprocessing ? "reprocess" : "end"} />
      )}

      {/* ── Completed: briefing layout ── */}
      {isCompleted && detail.artifact && !isProcessing && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="min-w-0 space-y-5">
            <MeetingArtifactPanel artifact={detail.artifact} />
            <MeetingTranscriptPanel
              transcript={savedTranscript}
              prospectName={prospectName}
              completed
              summary={detail.artifact.transcript_summary}
              refinedTranscript={detail.artifact.meeting_synthesis?.refinedTranscript}
              defaultCollapsed
            />
            <BriefingQaPanel
              sessionId={sessionId}
              messages={detail.briefingQaMessages}
              onUpdated={setDetail}
            />
          </div>
          <aside className="hidden space-y-4 lg:sticky lg:top-6 lg:block">
            <CoveragePanel
              coverage={session.coverage}
              overall={session.overallCoverage}
              knowledgeDepth={session.knowledgeDepth}
              proposalStatus={session.proposalReadiness.status}
            />
            <BusinessGraphPanel profile={session.businessProfile} />
            <EvidenceGraphPanel items={evidenceGraphItems} />
            <EvidenceOverridePanel sessionId={sessionId} onUpdated={() => void load()} />
          </aside>
        </div>
      )}

      {isCancelled && !isProcessing && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Sessão cancelada — nenhum diagnóstico foi gerado.
            </p>
            {savedTranscript.length > 0 && (
              <div className="mt-6 text-left">
                <MeetingTranscriptPanel transcript={savedTranscript} prospectName={prospectName} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {isCompleted && !detail.artifact && !isProcessing && (
        <Card className="border-amber-500/20 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <p className="text-sm text-foreground/85">
              Diagnóstico não disponível — a síntese pode ter falhado ou as migrations 023/024
              podem não estar aplicadas.
            </p>
            <Button variant="outline" onClick={() => void handleReprocess()} disabled={reprocessing}>
              {reprocessing ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              )}
              Reprocessar transcript
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Live session ── */}
      {isLive && !isProcessing && (
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <div className="flex flex-col items-center rounded-2xl border border-border/40 bg-gradient-to-b from-muted/20 to-transparent py-8 text-center">
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

            <MeetingTranscriptPanel transcript={savedTranscript} prospectName={prospectName} />

            <CopilotChatPanel
              messages={session.narratorMessages ?? []}
              isLive={isLive}
              processing={analyzing}
              onAskSuggestion={(q) => submitSegment(q, "manual_paste")}
              onSkipSuggestion={handleSkipSuggestion}
            />

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
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <CoveragePanel
              coverage={session.coverage}
              overall={session.overallCoverage}
              knowledgeDepth={session.knowledgeDepth}
              proposalStatus={session.proposalReadiness.status}
            />
            <BusinessGraphPanel profile={session.businessProfile} />
            <EvidenceGraphPanel items={evidenceGraphItems} />
            <EvidenceOverridePanel sessionId={sessionId} onUpdated={() => void load()} />
          </aside>
        </div>
      )}

      {/* ── Live without artifact: readiness ── */}
      {isLive && !detail.artifact && !isProcessing && (
        <ProposalReadinessPanel session={session} />
      )}

      {/* Mobile metrics for completed */}
      {isCompleted && !isProcessing && (
        <div className="mt-6 space-y-4 lg:hidden">
          <CoveragePanel
            coverage={session.coverage}
            overall={session.overallCoverage}
            knowledgeDepth={session.knowledgeDepth}
            proposalStatus={session.proposalReadiness.status}
          />
          <BusinessGraphPanel profile={session.businessProfile} />
          <EvidenceGraphPanel items={evidenceGraphItems} />
        </div>
      )}
    </OSPage>
  );
}

function ProposalReadinessPanel({ session }: { session: CopilotSessionSnapshot }) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/55">
          Prontidão para proposta
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {session.proposalReadiness.items.map((item) => (
            <div key={item.key} className="flex items-center gap-2 text-xs">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  item.status === "ready" && "bg-emerald-500/15 text-emerald-500",
                  item.status === "partial" && "bg-amber-500/15 text-amber-500",
                  item.status === "missing" && "bg-red-500/10 text-red-400/80",
                )}
              >
                {item.status === "ready" ? "✓" : item.status === "partial" ? "!" : "·"}
              </span>
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
        {session.proposalReadiness.blockers[0] && (
          <p className="mt-3 rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2 text-xs text-amber-600/90 dark:text-amber-400">
            {session.proposalReadiness.blockers[0]}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export async function createSessionAndNavigate(
  navigate: (opts: { to: string; params: { sessionId: string } }) => void,
  input: { prospectName: string; companyName: string; prospectId?: string },
) {
  const detail = await startCopilotSession({ data: input });
  navigate({ to: "/os/copilot/$sessionId", params: { sessionId: detail.session.id } });
}
