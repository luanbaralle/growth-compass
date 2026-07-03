import { useExecutionState } from "@/components/admin/execution/use-execution-state";
import { TEAM_LABELS } from "@/components/admin/execution/shared";
import { getWeekDeliveries } from "@/lib/execution/helpers";
import type { TeamMember } from "@/lib/execution/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PriorityForm {
  text: string;
  owner: TeamMember;
  dueDate: string;
}

export function PlanningRitualPage() {
  const { state, loading, submitPlanning } = useExecutionState();
  const [priorities, setPriorities] = useState<PriorityForm[]>([
    { text: "", owner: "luan", dueDate: "" },
    { text: "", owner: "vini", dueDate: "" },
    { text: "", owner: "caio", dueDate: "" },
  ]);
  const [blockers, setBlockers] = useState("");
  const [queueVideos, setQueueVideos] = useState(23);
  const [avgDelayDays, setAvgDelayDays] = useState(8);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!state) return;
    const weekItems = getWeekDeliveries(state).slice(0, 3);
    if (weekItems.length > 0) {
      setPriorities(
        weekItems.map((d) => ({
          text: d.title,
          owner: d.owner,
          dueDate: d.dueDate.split("-").reverse().join("/"),
        })),
      );
    }
    setQueueVideos(state.metrics.productionQueue);
    setAvgDelayDays(state.metrics.avgDelayDays);
    if (state.planningSession) {
      setBlockers(state.planningSession.blockers);
      setOutput(
        state.planningSession.priorities.length > 0
          ? buildFromSession(state.planningSession)
          : "",
      );
    }
  }, [state]);

  if (loading || !state) {
    return <div className="animate-pulse text-muted-foreground">Carregando ritual...</div>;
  }

  const weekLabel = `${state.currentWeek} (${formatWeekRange(state.currentWeek)})`;

  const handleSubmit = async () => {
    const filled = priorities.filter((p) => p.text.trim());
    if (filled.length === 0) {
      toast.error("Preencha ao menos 1 prioridade.");
      return;
    }
    const text = await submitPlanning({
      week: state.currentWeek,
      weekLabel,
      priorities: filled,
      blockers,
      queueVideos,
      avgDelayDays,
    });
    if (text) setOutput(text);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copiado para a área de transferência");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link
        to="/admin/execucao/rituais"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos rituais
      </Link>

      <header>
        <h1 className="font-display text-2xl font-bold">Planning semanal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Segunda · 30 min · Gera output para o grupo WhatsApp
        </p>
      </header>

      <section className="rounded-xl border border-border bg-surface/30 p-5 space-y-4">
        <h2 className="font-medium">Agenda</h2>
        <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
          <li>5 min — Ler prioridade #1 do Hub</li>
          <li>10 min — Revisar entregas da semana {state.currentWeek}</li>
          <li>10 min — Cada um declara prioridade #1</li>
          <li>5 min — Bloqueios + quem resolve</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="font-medium">3 prioridades da semana</h2>
        {priorities.map((p, i) => (
          <div key={i} className="rounded-xl border border-border p-4 space-y-3">
            <Label>Prioridade {i + 1}</Label>
            <Input
              value={p.text}
              onChange={(e) => {
                const next = [...priorities];
                next[i] = { ...next[i], text: e.target.value };
                setPriorities(next);
              }}
              placeholder="Entrega da semana"
            />
            <div className="flex flex-wrap gap-3">
              <Select
                value={p.owner}
                onValueChange={(v) => {
                  const next = [...priorities];
                  next[i] = { ...next[i], owner: v as TeamMember };
                  setPriorities(next);
                }}
              >
                <SelectTrigger className="h-9 w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TEAM_LABELS) as TeamMember[]).map((m) => (
                    <SelectItem key={m} value={m}>
                      {TEAM_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="h-9 w-32"
                placeholder="Prazo DD/MM"
                value={p.dueDate}
                onChange={(e) => {
                  const next = [...priorities];
                  next[i] = { ...next[i], dueDate: e.target.value };
                  setPriorities(next);
                }}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <Label>Bloqueios</Label>
        <Textarea
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          placeholder="O que está travando o time?"
          rows={3}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Fila de edição (vídeos)</Label>
          <Input
            type="number"
            min={0}
            className="mt-1"
            value={queueVideos}
            onChange={(e) => setQueueVideos(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div>
          <Label>Atraso médio (dias)</Label>
          <Input
            type="number"
            min={0}
            step={0.5}
            className="mt-1"
            value={avgDelayDays}
            onChange={(e) => setAvgDelayDays(parseFloat(e.target.value) || 0)}
          />
        </div>
      </section>

      <Button onClick={handleSubmit} className="w-full sm:w-auto">
        Gerar planning
      </Button>

      {output && (
        <section className="rounded-xl border border-brand/30 bg-brand-soft p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium">Output WhatsApp</h2>
            <Button size="sm" variant="outline" onClick={copyOutput}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copiar
            </Button>
          </div>
          <pre className="whitespace-pre-wrap text-sm">{output}</pre>
        </section>
      )}
    </div>
  );
}

function formatWeekRange(week: number): string {
  const ranges: Record<number, string> = {
    1: "16–22/06",
    2: "23–29/06",
    3: "30/06–06/07",
    4: "07–13/07",
  };
  return ranges[week] ?? "";
}

function buildFromSession(session: {
  weekLabel: string;
  priorities: { text: string; owner: TeamMember; dueDate: string }[];
  blockers: string;
  queueVideos: number;
  avgDelayDays: number;
}) {
  return [
    `📋 PLANNING — Semana ${session.weekLabel}`,
    "",
    "Prioridades:",
    ...session.priorities.map(
      (p, i) =>
        `${i + 1}. ${p.text} — Dono: ${TEAM_LABELS[p.owner]} — Prazo: ${p.dueDate}`,
    ),
    "",
    "Bloqueios:",
    session.blockers.trim() ? `- ${session.blockers.trim()}` : "- Nenhum",
    "",
    `Fila de edição: ${session.queueVideos} vídeos pendentes (${session.avgDelayDays} dias atraso médio)`,
  ].join("\n");
}
