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
import {
  createBlueprintFromCopilot,
  createProposalFromCopilot,
  getBlueprintForCopilotSession,
  getProposalForCopilotSession,
  publishProposal,
} from "@/domains/proposals/api.server";
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
import { scrollOsShellToTop } from "@/os/scroll-os-shell";
import { useOSMeetingMode } from "@/os/shell/OSMeetingMode";
import { OSPage, PageHeader, PageSkeleton } from "@/os/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Mic,
  MoreHorizontal,
  Send,
  Presentation,
  RefreshCw,
  Square,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type MobileLiveTab = "copilot" | "transcript" | "coverage";

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
  const { setMeetingMode } = useOSMeetingMode();
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
  const [creatingBlueprint, setCreatingBlueprint] = useState(false);
  const [linkedProposalId, setLinkedProposalId] = useState<string | null>(null);
  const [linkedBlueprintId, setLinkedBlueprintId] = useState<string | null>(null);
  const [linkedBlueprintStatus, setLinkedBlueprintStatus] = useState<"draft" | "in_review" | "approved" | null>(null);
  const [linkedProposalStatus, setLinkedProposalStatus] = useState<"draft" | "published" | "archived" | null>(null);
  const [publishingProposal, setPublishingProposal] = useState(false);
  const [pushingToCompany, setPushingToCompany] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const autoListenStarted = useRef(false);
  const [diagnosisValidated, setDiagnosisValidated] = useState(false);
  const [highlightSegmentIds, setHighlightSegmentIds] = useState<string[]>([]);
  const [transcriptExpandSignal, setTranscriptExpandSignal] = useState(0);
  const [mobileTab, setMobileTab] = useState<MobileLiveTab>("copilot");
  const evidenceSectionRef = useRef<HTMLDivElement>(null);
  const transcriptSectionRef = useRef<HTMLDivElement>(null);

  const { recordSegment } = useMeetingRecorder(sessionId);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCopilotSession({ data: { sessionId } });
      setDetail(data);
      if (data.status === "completed") {
        try {
          const [proposal, blueprint] = await Promise.all([
            getProposalForCopilotSession({ data: { sessionId } }),
            getBlueprintForCopilotSession({ data: { sessionId } }),
          ]);
          setLinkedProposalId(proposal?.id ?? null);
          setLinkedProposalStatus(proposal?.status ?? null);
          setLinkedBlueprintId(blueprint?.id ?? null);
          setLinkedBlueprintStatus(blueprint?.status ?? null);
        } catch {
          setLinkedProposalId(null);
          setLinkedBlueprintId(null);
        }
      } else {
        setLinkedProposalId(null);
        setLinkedBlueprintId(null);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar sessão."));
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    scrollOsShellToTop();
    void load();
  }, [load, sessionId]);

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

  const handleViewInTranscript = useCallback((segmentIds: string[]) => {
    if (segmentIds.length === 0) return;
    setHighlightSegmentIds(segmentIds);
    setTranscriptExpandSignal((n) => n + 1);
    requestAnimationFrame(() => {
      transcriptSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleScrollToEvidence = useCallback(() => {
    evidenceSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleValidateDiagnosis = useCallback(() => {
    setDiagnosisValidated(true);
    toast.success("Diagnóstico validado.", {
      description: linkedProposalId
        ? "Pronto para revisar a proposta vinculada."
        : "Gere a proposta quando quiser avançar comercialmente.",
    });
  }, [linkedProposalId]);

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
    micOnlyMode,
    statusHint,
    isListening,
    isRequesting,
    isSupported,
    requiresUserGesture,
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

  const handleMicToggle = useCallback(async () => {
    const result = await toggleAudioCapture();
    if (result && "error" in result && result.error && result.error !== "busy" && result.error !== "aborted") {
      if (result.error === "unsupported") {
        toast.error("Microfone indisponível neste navegador.", {
          description: "Use HTTPS ou a entrada manual em Mais.",
        });
      } else {
        toast.error("Não foi possível iniciar o microfone.", {
          description: String(result.error),
        });
      }
    } else if (result && "ok" in result && result.ok && !("stopped" in result && result.stopped)) {
      toast.success("Microfone ativo", {
        description: "Fale perto do celular — a 1ª transcrição leva ~6s.",
      });
    }
  }, [toggleAudioCapture]);

  useEffect(() => {
    const active = Boolean(isLive && !isProcessing);
    setMeetingMode(active);
    return () => setMeetingMode(false);
  }, [isLive, isProcessing, setMeetingMode]);

  useEffect(() => {
    if (!isLive) {
      stopAudioCapture();
      autoListenStarted.current = false;
      return;
    }
    // Mobile / iOS: must start from a user tap — auto-start yields silent AudioContext.
    if (requiresUserGesture || micOnlyMode) return;
    if (!autoListenStarted.current && isSupported) {
      autoListenStarted.current = true;
      void startAudioCapture();
    }
  }, [
    isLive,
    isSupported,
    micOnlyMode,
    requiresUserGesture,
    startAudioCapture,
    stopAudioCapture,
  ]);

  const baseStatusLine = useMemo(
    () => (session ? getLiveStatusLine(session) : ""),
    [session],
  );

  const displayOrb = resolveDisplayOrbState(session?.orbState ?? "idle", {
    isListening,
    isProcessing: analyzing || isTranscribing,
    isLive: Boolean(isLive),
  });

  const displayStatusLine = resolveStatusLine(baseStatusLine, {
    isListening,
    isProcessing: analyzing,
    isTranscribing,
    lastTranscript,
    micOnlyMode,
  });

  const handleReprocess = async () => {
    setReprocessing(true);
    try {
      const data = await reprocessCopilotSession({ data: { sessionId } });
      setDetail(data);
      toast.success("Transcript reprocessado — diagnóstico e proposta vinculada atualizados.");
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

  const handleCreateBlueprint = async () => {
    setCreatingBlueprint(true);
    try {
      const blueprint = await createBlueprintFromCopilot({ data: { sessionId } });
      setLinkedBlueprintId(blueprint.id);
      setLinkedBlueprintStatus(blueprint.status);
      toast.success("Blueprint comercial criado.");
      await navigate({ to: "/os/propostas/blueprint/$id", params: { id: blueprint.id } });
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao criar blueprint."));
    } finally {
      setCreatingBlueprint(false);
    }
  };

  const handleCreateProposal = async () => {
    setCreatingProposal(true);
    try {
      const proposal = await createProposalFromCopilot({ data: { sessionId } });
      setLinkedProposalId(proposal.id);
      setLinkedProposalStatus(proposal.status);
      toast.success("Rascunho de proposta criado.");
      await navigate({ to: "/os/propostas/$id", params: { id: proposal.id } });
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao criar proposta."));
    } finally {
      setCreatingProposal(false);
    }
  };

  const handlePublishProposal = async () => {
    if (!linkedProposalId) return;
    setPublishingProposal(true);
    try {
      await publishProposal({ data: { id: linkedProposalId } });
      setLinkedProposalStatus("published");
      toast.success("Proposta publicada — link pronto para a Reunião 2.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao publicar proposta."));
    } finally {
      setPublishingProposal(false);
    }
  };

  const handleStartPresentation = async () => {
    if (!linkedProposalId) return;
    await navigate({
      to: "/os/propostas/$id/apresentacao",
      params: { id: linkedProposalId },
    });
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
    <OSPage
      className={cn(
        isLive && !isProcessing
          ? "flex h-[100dvh] max-h-[100dvh] min-h-0 max-w-none flex-col space-y-0 overflow-hidden pb-0 md:h-auto md:max-h-none md:max-w-7xl md:space-y-6 md:overflow-visible md:pb-2"
          : "max-w-7xl",
      )}
    >
      {/* ── Header ── */}
      <header
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
          isLive && !isProcessing
            ? "shrink-0 border-b border-border/40 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] md:mb-8 md:border-0 md:px-0 md:py-0 md:pt-0"
            : "mb-8 gap-4",
        )}
      >
        <div className="flex min-w-0 items-center gap-2 sm:items-start sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className={cn("shrink-0", isLive ? "h-9 w-9" : "mt-0.5 h-10 w-10")}
            asChild
          >
            <Link
              to={detail.prospectId ? "/os/prospeccao/$id" : "/os/copilot"}
              {...(detail.prospectId ? { params: { id: detail.prospectId } } : {})}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                className={cn(
                  "truncate font-semibold tracking-tight",
                  isLive ? "text-base md:text-xl" : "text-lg sm:text-xl",
                )}
              >
                <span className="md:hidden">{isLive ? prospectName : "Raise One Copilot"}</span>
                <span className="hidden md:inline">Raise One Copilot</span>
              </h1>
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
                  className="animate-pulse border-red-500/25 bg-red-500/8 text-red-500"
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
            <p
              className={cn(
                "truncate text-muted-foreground",
                isLive ? "hidden text-sm md:mt-1 md:block" : "mt-1 text-sm",
              )}
            >
              {session.meetingObjective.title}
            </p>
            {session.meetingObjective.companyName && (
              <p className="mt-0.5 hidden text-xs text-muted-foreground/70 md:block">
                {session.meetingObjective.prospectName} · {session.meetingObjective.companyName}
              </p>
            )}
          </div>
          {isLive && (
            <div className="flex shrink-0 items-center gap-1.5 md:hidden">
              <div className="rounded-md border border-border/50 bg-muted/15 px-2 py-1 text-xs tabular-nums text-muted-foreground">
                {formatElapsed(session.elapsedSeconds)}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5"
                onClick={() => void handleEnd()}
                disabled={analyzing || cancelling}
              >
                {analyzing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Square className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center gap-2 sm:justify-end",
            isLive && "hidden md:flex",
          )}
        >
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/15 px-3 py-1.5 text-sm tabular-nums text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {formatElapsed(session.elapsedSeconds)}
          </div>
          {isCompleted && detail.artifact && (
            <>
              {linkedBlueprintId ? (
                <Button variant="default" size="sm" asChild>
                  <Link to="/os/propostas/blueprint/$id" params={{ id: linkedBlueprintId }}>
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                    {linkedBlueprintStatus === "approved" ? "Blueprint aprovado" : "Blueprint comercial"}
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => void handleCreateBlueprint()}
                  disabled={creatingBlueprint || detail.status === "processing"}
                >
                  {creatingBlueprint ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Gerar blueprint
                </Button>
              )}

              {linkedProposalId ? (
                <>
                  <Button variant="default" size="sm" onClick={() => void handleStartPresentation()}>
                    <Presentation className="mr-1.5 h-3.5 w-3.5" />
                    Apresentar
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/os/propostas/$id" params={{ id: linkedProposalId }}>
                      <FileText className="mr-1.5 h-3.5 w-3.5" />
                      Abrir proposta
                    </Link>
                  </Button>
                  {linkedProposalStatus === "draft" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handlePublishProposal()}
                      disabled={publishingProposal}
                    >
                      {publishingProposal ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : null}
                      Publicar proposta
                    </Button>
                  )}
                </>
              ) : linkedBlueprintStatus === "approved" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleCreateProposal()}
                  disabled={creatingProposal || detail.status === "processing"}
                >
                  {creatingProposal ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileText className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Gerar proposta
                </Button>
              ) : null}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="mr-1.5 h-3.5 w-3.5" />
                    Mais
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    disabled={exportingBrief || detail.status === "processing"}
                    onClick={() => void handleExportCreativeBrief()}
                  >
                    {exportingBrief ? (
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FileText className="mr-2 h-3.5 w-3.5" />
                    )}
                    Brief criativo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={exportingPdf || detail.status === "processing"}
                    onClick={() => void handleExportPdf()}
                  >
                    {exportingPdf ? (
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FileDown className="mr-2 h-3.5 w-3.5" />
                    )}
                    Exportar PDF
                  </DropdownMenuItem>
                  {detail.prospectId && (
                    <DropdownMenuItem
                      disabled={pushingToCompany || detail.status === "processing"}
                      onClick={() => void handlePushToCompany()}
                    >
                      {pushingToCompany ? (
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Building2 className="mr-2 h-3.5 w-3.5" />
                      )}
                      Enviar p/ Empresa
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={reprocessing || detail.status === "processing"}
                    onClick={() => void handleReprocess()}
                  >
                    {reprocessing ? (
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-3.5 w-3.5" />
                    )}
                    Reprocessar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          {isLive && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-10"
                onClick={() => void handleCancel()}
                disabled={analyzing || cancelling}
              >
                {cancelling ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <X className="mr-1.5 h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">Cancelar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="min-h-10"
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

      {/* ── Meeting objective strip (hidden on mobile live) ── */}
      <Card
        className={cn(
          "mb-6 border-border/50 bg-muted/10 shadow-sm",
          isLive && "hidden md:block",
        )}
      >
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
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px] xl:items-start">
          <div className="min-w-0 space-y-6">
            <MeetingArtifactPanel
              artifact={detail.artifact}
              overallCoverage={session.overallCoverage}
              knowledgeDepth={session.knowledgeDepth}
              proposalReadiness={session.proposalReadiness}
              evidenceItems={evidenceGraphItems}
              onScrollToEvidence={handleScrollToEvidence}
              onViewInTranscript={handleViewInTranscript}
              diagnosisValidated={diagnosisValidated}
              onValidateDiagnosis={handleValidateDiagnosis}
            />
            <BusinessGraphPanel profile={session.businessProfile} />
            <div ref={evidenceSectionRef}>
              <EvidenceGraphPanel
                items={evidenceGraphItems}
                onViewInTranscript={handleViewInTranscript}
              />
            </div>
            <div ref={transcriptSectionRef}>
              <MeetingTranscriptPanel
                transcript={savedTranscript}
                prospectName={prospectName}
                completed
                summary={detail.artifact.transcript_summary}
                refinedTranscript={detail.artifact.meeting_synthesis?.refinedTranscript}
                defaultCollapsed
                highlightSegmentIds={highlightSegmentIds}
                expandSignal={transcriptExpandSignal}
              />
            </div>
            <BriefingQaPanel
              sessionId={sessionId}
              messages={detail.briefingQaMessages}
              onUpdated={setDetail}
            />
          </div>
          <aside className="hidden space-y-4 xl:sticky xl:top-6 xl:block">
            <CoveragePanel
              coverage={session.coverage}
              overall={session.overallCoverage}
              knowledgeDepth={session.knowledgeDepth}
              proposalReadiness={session.proposalReadiness}
            />
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

      {/* ── Live session: mobile meeting mode ── */}
      {isLive && !isProcessing && (
        <div className="relative flex min-h-0 flex-1 flex-col md:hidden">
          <div className="shrink-0 px-3 pt-2">
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-border/40 bg-muted/15 p-1">
              {(
                [
                  ["copilot", "Sugestão"],
                  ["transcript", "Fala"],
                  ["coverage", "Mais"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMobileTab(id)}
                  className={cn(
                    "min-h-9 rounded-lg px-2 text-xs font-medium transition-colors",
                    mobileTab === id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* pb reserves space for the fixed mic dock */}
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
            {mobileTab === "copilot" && (
              <div className="flex min-h-0 flex-col gap-3">
                {(!isListening || audioStatus === "mic_denied" || audioStatus === "unsupported") && (
                  <button
                    type="button"
                    onClick={() => void handleMicToggle()}
                    disabled={isRequesting}
                    className="flex w-full items-center gap-3 rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-left disabled:opacity-70"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-black">
                      {isRequesting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {isRequesting
                          ? "Pedindo microfone…"
                          : audioStatus === "mic_denied"
                            ? "Microfone bloqueado — toque para tentar"
                            : audioStatus === "unsupported"
                              ? "Microfone indisponível"
                              : "Toque para ouvir a sala"}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {statusHint ||
                          (audioStatus === "unsupported"
                            ? "Use HTTPS ou entrada manual em Mais"
                            : "O navegador deve pedir permissão ao tocar")}
                      </span>
                    </span>
                  </button>
                )}
                <CopilotChatPanel
                  messages={session.narratorMessages ?? []}
                  isLive={isLive}
                  processing={analyzing || isTranscribing}
                  onAskSuggestion={(q) => submitSegment(q, "manual_paste")}
                  onSkipSuggestion={handleSkipSuggestion}
                  meetingFocus
                />
              </div>
            )}
            {mobileTab === "transcript" && (
              <div className="flex min-h-0 flex-col gap-2">
                {(!isListening || audioStatus === "mic_denied" || audioStatus === "unsupported") && (
                  <button
                    type="button"
                    onClick={() => void handleMicToggle()}
                    disabled={isRequesting}
                    className="flex w-full items-center gap-3 rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-left disabled:opacity-70"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-black">
                      {isRequesting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">
                        {isRequesting
                          ? "Pedindo microfone…"
                          : audioStatus === "mic_denied"
                            ? "Microfone bloqueado — toque para tentar"
                            : "Toque para ouvir a sala"}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {statusHint || "Sem isso o Copilot não captura a conversa"}
                      </span>
                    </span>
                  </button>
                )}
                {isListening && (
                  <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
                    Ouvindo a sala… {statusHint || "aguarde ~6s pela primeira fala"}
                  </p>
                )}
                {lastTranscript && (
                  <p className="rounded-xl border border-border/40 bg-muted/15 px-3 py-2 text-sm italic text-muted-foreground">
                    Último: “{lastTranscript}”
                  </p>
                )}
                <MeetingTranscriptPanel transcript={savedTranscript} prospectName={prospectName} />
              </div>
            )}
            {mobileTab === "coverage" && (
              <div className="space-y-3 pb-2">
                <CoveragePanel
                  coverage={session.coverage}
                  overall={session.overallCoverage}
                  knowledgeDepth={session.knowledgeDepth}
                  proposalReadiness={session.proposalReadiness}
                  compact
                />
                <ProposalReadinessPanel session={session} />
                <div className="rounded-xl border border-border/40 px-3 py-3">
                  <p className="text-xs font-medium text-muted-foreground">Entrada manual</p>
                  <Textarea
                    className="mt-2"
                    placeholder="Digite o que foi dito…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(["auto", "consultant", "prospect"] as const).map((mode) => (
                      <Button
                        key={mode}
                        size="sm"
                        className="min-h-9"
                        variant={speakerMode === mode ? "secondary" : "ghost"}
                        onClick={() => setSpeakerMode(mode)}
                      >
                        {mode === "auto"
                          ? "Auto"
                          : mode === "consultant"
                            ? "Você"
                            : prospectName.split(" ")[0]}
                      </Button>
                    ))}
                    <Button
                      size="sm"
                      className="min-h-9"
                      onClick={() => submitSegment(draft)}
                      disabled={!draft.trim()}
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Add
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  onClick={() => void handleCancel()}
                  disabled={analyzing || cancelling}
                >
                  Cancelar sessão
                </Button>
              </div>
            )}
          </div>

          {/* Fixed dock — always visible above the fold on mobile */}
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_oklch(0_0_0/0.25)] backdrop-blur-md md:hidden">
            <LiveListenBar
              status={audioStatus}
              callAudioConnected={callAudioConnected}
              micOnlyMode={micOnlyMode}
              statusHint={statusHint}
              lastTranscript={lastTranscript}
              speakerLabel={
                speakerMode === "auto"
                  ? "Automático"
                  : speakerMode === "consultant"
                    ? "Consultor"
                    : prospectName
              }
              onToggle={() => void handleMicToggle()}
              disabled={false}
              compact
              coveragePercent={session.overallCoverage}
            />
          </div>
        </div>
      )}

      {/* ── Live session: desktop ── */}
      {isLive && !isProcessing && (
        <div className="hidden gap-8 md:grid xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0 space-y-6">
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
              micOnlyMode={micOnlyMode}
              statusHint={statusHint}
              lastTranscript={lastTranscript}
              speakerLabel={
                speakerMode === "auto"
                  ? "Automático"
                  : speakerMode === "consultant"
                    ? "Consultor"
                    : prospectName
              }
              onToggle={() => void handleMicToggle()}
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

            {session.businessProfile.roots.some((r) => r.children?.length || r.value) && (
              <BusinessGraphPanel profile={session.businessProfile} />
            )}

            {evidenceGraphItems.length > 0 && (
              <EvidenceGraphPanel items={evidenceGraphItems} />
            )}
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <CoveragePanel
              coverage={session.coverage}
              overall={session.overallCoverage}
              knowledgeDepth={session.knowledgeDepth}
              proposalReadiness={session.proposalReadiness}
            />
            <EvidenceOverridePanel sessionId={sessionId} onUpdated={() => void load()} />
          </aside>
        </div>
      )}

      {/* ── Live without artifact: readiness (desktop) ── */}
      {isLive && !detail.artifact && !isProcessing && (
        <div className="hidden md:block">
          <ProposalReadinessPanel session={session} />
        </div>
      )}

      {/* Mobile metrics for completed */}
      {isCompleted && !isProcessing && (
        <div className="mt-6 space-y-4 xl:hidden">
          <CoveragePanel
            coverage={session.coverage}
            overall={session.overallCoverage}
            knowledgeDepth={session.knowledgeDepth}
            proposalReadiness={session.proposalReadiness}
          />
          <EvidenceOverridePanel sessionId={sessionId} onUpdated={() => void load()} />
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
