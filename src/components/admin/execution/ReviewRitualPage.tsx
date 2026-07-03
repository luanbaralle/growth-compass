import { useExecutionState } from "@/components/admin/execution/use-execution-state";
import { getWeekDeliveries } from "@/lib/execution/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { Copy, Check, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

function formatWeekRange(week: number): string {
  const ranges: Record<number, string> = {
    1: "16–22/06",
    2: "23–29/06",
    3: "30/06–06/07",
    4: "07–13/07",
  };
  return ranges[week] ?? "";
}

export function ReviewRitualPage() {
  const { state, loading, submitReview } = useExecutionState();
  const [completed, setCompleted] = useState<string[]>([]);
  const [notCompleted, setNotCompleted] = useState<{ text: string; reason: string }[]>([]);
  const [queueVideos, setQueueVideos] = useState(0);
  const [avgDelayDays, setAvgDelayDays] = useState(0);
  const [outOfScopeTotal, setOutOfScopeTotal] = useState(0);
  const [outOfScopeRejected, setOutOfScopeRejected] = useState(0);
  const [nextWeekPriorities, setNextWeekPriorities] = useState<string[]>(["", "", ""]);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!state) return;
    setQueueVideos(state.metrics.productionQueue);
    setAvgDelayDays(state.metrics.avgDelayDays);

    const weekItems = getWeekDeliveries(state);
    const done = weekItems.filter((d) => d.status === "done").map((d) => d.title);
    const pending = weekItems
      .filter((d) => d.status !== "done")
      .map((d) => ({ text: d.title, reason: "" }));
    setCompleted(done);
    setNotCompleted(pending);

    if (state.reviewSession) {
      setOutOfScopeTotal(state.reviewSession.outOfScopeTotal);
      setOutOfScopeRejected(state.reviewSession.outOfScopeRejected);
      setNextWeekPriorities(
        state.reviewSession.nextWeekPriorities.length
          ? state.reviewSession.nextWeekPriorities
          : ["", "", ""],
      );
    }
  }, [state]);

  if (loading || !state) {
    return <div className="animate-pulse text-muted-foreground">Carregando...</div>;
  }

  const weekLabel = `${state.currentWeek} (${formatWeekRange(state.currentWeek)})`;

  const handleSubmit = async () => {
    const priorities = nextWeekPriorities.filter((p) => p.trim());
    const text = await submitReview({
      week: state.currentWeek,
      weekLabel,
      completed: completed.filter(Boolean),
      notCompleted: notCompleted.filter((n) => n.text.trim()),
      queueVideos,
      avgDelayDays,
      outOfScopeTotal,
      outOfScopeRejected,
      nextWeekPriorities: priorities,
    });
    if (text) setOutput(text);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/admin/execucao/rituais"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos rituais
      </Link>

      <header>
        <h1 className="font-display text-2xl font-bold">Review + métricas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sexta · 30 min · Semana {weekLabel}
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-border bg-surface/30 p-5">
        <h2 className="font-medium">✅ Fechou esta semana</h2>
        {completed.map((item, i) => (
          <Input
            key={i}
            value={item}
            onChange={(e) => {
              const next = [...completed];
              next[i] = e.target.value;
              setCompleted(next);
            }}
          />
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCompleted([...completed, ""])}
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar
        </Button>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-surface/30 p-5">
        <h2 className="font-medium">❌ Não fechou</h2>
        {notCompleted.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="Entrega"
              value={item.text}
              onChange={(e) => {
                const next = [...notCompleted];
                next[i] = { ...next[i], text: e.target.value };
                setNotCompleted(next);
              }}
            />
            <Input
              className="flex-1"
              placeholder="Motivo"
              value={item.reason}
              onChange={(e) => {
                const next = [...notCompleted];
                next[i] = { ...next[i], reason: e.target.value };
                setNotCompleted(next);
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotCompleted(notCompleted.filter((_, j) => j !== i))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </section>

      <section className="grid gap-4 rounded-xl border border-border bg-surface/30 p-5 sm:grid-cols-2">
        <div>
          <Label>Fila edição (vídeos)</Label>
          <Input
            type="number"
            className="mt-1"
            value={queueVideos}
            onChange={(e) => setQueueVideos(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div>
          <Label>Atraso médio (dias)</Label>
          <Input
            type="number"
            step={0.5}
            className="mt-1"
            value={avgDelayDays}
            onChange={(e) => setAvgDelayDays(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label>Fora de escopo (total)</Label>
          <Input
            type="number"
            className="mt-1"
            value={outOfScopeTotal}
            onChange={(e) => setOutOfScopeTotal(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div>
          <Label>Recusados</Label>
          <Input
            type="number"
            className="mt-1"
            value={outOfScopeRejected}
            onChange={(e) => setOutOfScopeRejected(parseInt(e.target.value, 10) || 0)}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-surface/30 p-5">
        <h2 className="font-medium">➡️ Próxima semana (até 3)</h2>
        {nextWeekPriorities.map((p, i) => (
          <Input
            key={i}
            placeholder={`Prioridade ${i + 1}`}
            value={p}
            onChange={(e) => {
              const next = [...nextWeekPriorities];
              next[i] = e.target.value;
              setNextWeekPriorities(next);
            }}
          />
        ))}
      </section>

      <Button onClick={handleSubmit}>Salvar review</Button>

      {output && (
        <div className="rounded-xl border border-brand/30 bg-brand-soft p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-medium">Output WhatsApp</h2>
            <Button size="sm" variant="outline" onClick={copyOutput}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copiar
            </Button>
          </div>
          <pre className="whitespace-pre-wrap text-sm">{output}</pre>
        </div>
      )}
    </div>
  );
}
