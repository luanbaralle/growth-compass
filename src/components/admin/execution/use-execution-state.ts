import {
  addProductionCard,
  fetchExecutionState,
  patchBacklogColumn,
  patchClient,
  patchCurrentWeek,
  patchDelegation,
  patchImmediateAction,
  patchMetrics,
  patchPlanDelivery,
  patchProductionCard,
  patchProductionStage,
  patchSopItem,
  patchTeamCapacity,
  removeProductionCard,
  resetSop,
  saveCheckin,
  savePlanning,
  saveReview,
  snapshotHours,
  exportNotionSops,
} from "@/lib/api/execution.functions";
import {
  DELEGATION_CYCLE,
  STATUS_CYCLE,
  buildCheckinWhatsApp,
  buildPlanningWhatsApp,
  buildReviewWhatsApp,
} from "@/lib/execution/helpers";
import type {
  BacklogColumn,
  CheckinSession,
  ClientStatus,
  DelegationStatus,
  ExecutionState,
  PlanningSession,
  ProductionStage,
  ProductionType,
  ReviewSession,
  TaskStatus,
  TeamMember,
} from "@/lib/execution/types";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useExecutionState() {
  const navigate = useNavigate();
  const [state, setState] = useState<ExecutionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchExecutionState();
      setState(data);
    } catch {
      setError("Sessão expirada ou não autorizado.");
      navigate({ to: "/admin/login" });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : "Erro ao salvar.";
    toast.error(msg);
  };

  const cyclePlanStatus = async (id: string, current: TaskStatus) => {
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    try {
      const data = await patchPlanDelivery({ data: { id, status: next } });
      setState(data);
    } catch (err) {
      handleError(err);
    }
  };

  const setPlanStatus = async (id: string, status: TaskStatus) => {
    try {
      const data = await patchPlanDelivery({ data: { id, status } });
      setState(data);
    } catch (err) {
      handleError(err);
    }
  };

  const cycleDelegationStatus = async (id: string, current: DelegationStatus) => {
    const idx = DELEGATION_CYCLE.indexOf(current);
    const next = DELEGATION_CYCLE[(idx + 1) % DELEGATION_CYCLE.length];
    try {
      const data = await patchDelegation({ data: { id, status: next } });
      setState(data);
    } catch (err) {
      handleError(err);
    }
  };

  const updateDelegationHours = async (id: string, hoursRecovered: number) => {
    try {
      const data = await patchDelegation({ data: { id, hoursRecovered } });
      setState(data);
    } catch (err) {
      handleError(err);
    }
  };

  const moveBacklog = async (id: string, column: BacklogColumn) => {
    try {
      const data = await patchBacklogColumn({ data: { id, column } });
      setState(data);
      toast.success("Backlog atualizado");
    } catch (err) {
      handleError(err);
    }
  };

  const toggleAction = async (id: string) => {
    try {
      const data = await patchImmediateAction({ data: { id } });
      setState(data);
    } catch (err) {
      handleError(err);
    }
  };

  const changeWeek = async (week: number) => {
    try {
      const data = await patchCurrentWeek({ data: { week } });
      setState(data);
    } catch (err) {
      handleError(err);
    }
  };

  const updateProductionMetrics = async (productionQueue: number, avgDelayDays: number) => {
    try {
      const data = await patchMetrics({ data: { productionQueue, avgDelayDays } });
      setState(data);
      toast.success("Métricas atualizadas");
    } catch (err) {
      handleError(err);
    }
  };

  const submitPlanning = async (session: Omit<PlanningSession, "updatedAt">) => {
    try {
      const data = await savePlanning({ data: session });
      setState(data);
      toast.success("Planning salvo");
      return buildPlanningWhatsApp(data, data.planningSession);
    } catch (err) {
      handleError(err);
      return "";
    }
  };

  const moveProduction = async (id: string, stage: ProductionStage) => {
    try {
      const data = await patchProductionStage({ data: { id, stage } });
      setState(data);
    } catch (err) {
      handleError(err);
    }
  };

  const createProduction = async (input: {
    title: string;
    clientId: string;
    type: ProductionType;
    owner: TeamMember;
    dueDate: string;
    briefing?: string;
  }) => {
    try {
      const data = await addProductionCard({ data: { ...input, stage: "briefing" } });
      setState(data);
      toast.success("Card criado");
    } catch (err) {
      handleError(err);
    }
  };

  const editProduction = async (
    id: string,
    patch: { title?: string; briefing?: string; notes?: string; dueDate?: string },
  ) => {
    try {
      const data = await patchProductionCard({ data: { id, ...patch } });
      setState(data);
    } catch (err) {
      handleError(err);
    }
  };

  const deleteProduction = async (id: string) => {
    try {
      const data = await removeProductionCard({ data: { id } });
      setState(data);
      toast.success("Card removido");
    } catch (err) {
      handleError(err);
    }
  };

  const editClient = async (
    id: string,
    patch: { nextAction?: string; observation?: string; status?: ClientStatus },
  ) => {
    try {
      const data = await patchClient({ data: { id, ...patch } });
      setState(data);
      toast.success("Cliente atualizado");
    } catch (err) {
      handleError(err);
    }
  };

  const saveTeamCapacity = async (
    member: TeamMember,
    totalHours: number,
    committedHours: number,
  ) => {
    try {
      const data = await patchTeamCapacity({ data: { member, totalHours, committedHours } });
      setState(data);
      toast.success("Capacidade atualizada");
    } catch (err) {
      handleError(err);
    }
  };

  const toggleSopCheck = async (sopId: string, itemId: string) => {
    try {
      const data = await patchSopItem({ data: { sopId, itemId } });
      setState(data);
    } catch (err) {
      handleError(err);
    }
  };

  const resetSopChecklist = async (sopId: string) => {
    try {
      const data = await resetSop({ data: { sopId } });
      setState(data);
      toast.success("Checklist resetado");
    } catch (err) {
      handleError(err);
    }
  };

  const submitCheckin = async (session: Omit<CheckinSession, "updatedAt">) => {
    try {
      const data = await saveCheckin({ data: session });
      setState(data);
      toast.success("Check-in salvo");
      return buildCheckinWhatsApp(data.checkinSession!);
    } catch (err) {
      handleError(err);
      return "";
    }
  };

  const submitReview = async (session: Omit<ReviewSession, "updatedAt">) => {
    try {
      const data = await saveReview({ data: session });
      setState(data);
      toast.success("Review salvo — snapshot de horas registrado");
      return buildReviewWhatsApp(data.reviewSession!);
    } catch (err) {
      handleError(err);
      return "";
    }
  };

  const recordHoursSnapshot = async () => {
    try {
      const data = await snapshotHours();
      setState(data);
      toast.success("Snapshot de horas registrado");
    } catch (err) {
      handleError(err);
    }
  };

  const downloadNotionExport = async (sopId?: string) => {
    try {
      const { markdown, filename } = await exportNotionSops({ data: { sopId } });
      const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Markdown exportado");
    } catch (err) {
      handleError(err);
    }
  };

  return {
    state,
    loading,
    error,
    reload: load,
    cyclePlanStatus,
    setPlanStatus,
    cycleDelegationStatus,
    updateDelegationHours,
    moveBacklog,
    toggleAction,
    changeWeek,
    updateProductionMetrics,
    submitPlanning,
    moveProduction,
    createProduction,
    editProduction,
    deleteProduction,
    editClient,
    saveTeamCapacity,
    toggleSopCheck,
    resetSopChecklist,
    submitCheckin,
    submitReview,
    recordHoursSnapshot,
    downloadNotionExport,
  };
}
