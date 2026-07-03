import { useExecutionState } from "@/components/admin/execution/use-execution-state";
import { TEAM_LABELS } from "@/components/admin/execution/shared";
import type { TeamMember } from "@/lib/execution/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export function CheckinRitualPage() {
  const { state, loading, submitCheckin } = useExecutionState();
  const [queueVideos, setQueueVideos] = useState(0);
  const [delayedCount, setDelayedCount] = useState(0);
  const [blockedPerson, setBlockedPerson] = useState<TeamMember | "none">("none");
  const [outOfScopeAppeared, setOutOfScopeAppeared] = useState(false);
  const [outOfScopeDetail, setOutOfScopeDetail] = useState("");
  const [editorStatus, setEditorStatus] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!state) return;
    setQueueVideos(state.metrics.productionQueue);
    setDelayedCount(
      state.productions.filter((p) => p.stage !== "publicado" && p.daysInStage > 3).length,
    );
    if (state.checkinSession) {
      setOutOfScopeAppeared(state.checkinSession.outOfScopeAppeared);
      setOutOfScopeDetail(state.checkinSession.outOfScopeDetail ?? "");
      setEditorStatus(state.checkinSession.editorStatus);
    } else {
      setEditorStatus("Em teste — vídeo até 20/06");
    }
  }, [state]);

  if (loading || !state) {
    return <div className="animate-pulse text-muted-foreground">Carregando...</div>;
  }

  const handleSubmit = async () => {
    const text = await submitCheckin({
      queueVideos,
      delayedCount,
      blockedPerson: blockedPerson === "none" ? undefined : blockedPerson,
      outOfScopeAppeared,
      outOfScopeDetail: outOfScopeDetail || undefined,
      editorStatus,
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
        <h1 className="font-display text-2xl font-bold">Check-in operacional</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quarta · 15 min · 4 perguntas fixas</p>
      </header>

      <div className="space-y-4 rounded-xl border border-border bg-surface/30 p-5">
        <div>
          <Label>1. Fila de edição — quantos vídeos?</Label>
          <Input
            type="number"
            min={0}
            className="mt-1"
            value={queueVideos}
            onChange={(e) => setQueueVideos(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div>
          <Label>2. Algum atrasado &gt;3 dias?</Label>
          <Input
            type="number"
            min={0}
            className="mt-1"
            value={delayedCount}
            onChange={(e) => setDelayedCount(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div>
          <Label>3. Alguém travado?</Label>
          <Select value={blockedPerson} onValueChange={(v) => setBlockedPerson(v as TeamMember | "none")}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Ninguém</SelectItem>
              {(Object.keys(TEAM_LABELS) as TeamMember[]).map((m) => (
                <SelectItem key={m} value={m}>
                  {TEAM_LABELS[m]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>4. Demanda fora de escopo apareceu?</Label>
          <label className="mt-2 flex items-center gap-2">
            <Checkbox
              checked={outOfScopeAppeared}
              onCheckedChange={(v) => setOutOfScopeAppeared(!!v)}
            />
            <span className="text-sm">Sim</span>
          </label>
          {outOfScopeAppeared && (
            <Textarea
              className="mt-2"
              rows={2}
              placeholder="Detalhe..."
              value={outOfScopeDetail}
              onChange={(e) => setOutOfScopeDetail(e.target.value)}
            />
          )}
        </div>
        <div>
          <Label>Editor freelancer — status</Label>
          <Input
            className="mt-1"
            value={editorStatus}
            onChange={(e) => setEditorStatus(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleSubmit}>Salvar check-in</Button>

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
