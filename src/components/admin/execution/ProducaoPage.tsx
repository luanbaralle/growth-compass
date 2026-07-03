import { useExecutionState } from "@/components/admin/execution/use-execution-state";
import { PersonBadge } from "@/components/admin/execution/shared";
import {
  AlertBanner,
  PageHeader,
  PageSkeleton,
} from "@/components/admin/ui-kit";
import {
  formatDateBR,
  getClientName,
  getNextProductionStage,
  getPrevProductionStage,
  getStalledProductions,
} from "@/lib/execution/helpers";
import {
  PRODUCTION_STAGE_LABELS,
  PRODUCTION_STAGE_ORDER,
  PRODUCTION_TYPE_LABELS,
  type ProductionType,
  type TeamMember,
} from "@/lib/execution/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function ProducaoPage() {
  const { state, loading, moveProduction, createProduction, deleteProduction } =
    useExecutionState();
  const [filterClient, setFilterClient] = useState<string>("all");

  if (loading || !state) {
    return <PageSkeleton title="Produção" metricCount={0} />;
  }

  const stalled = getStalledProductions(state);
  const filtered =
    filterClient === "all"
      ? state.productions
      : state.productions.filter((p) => p.clientId === filterClient);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produção"
        description={`Esteira de vídeo · ${state.metrics.productionQueue} na fila · ${state.metrics.avgDelayDays}d atraso médio`}
        icon={Clapperboard}
        actions={
          <>
            <Select value={filterClient} onValueChange={setFilterClient}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos clientes</SelectItem>
                {state.clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AddProductionDialog clients={state.clients} onCreate={createProduction} />
          </>
        }
      />

      {stalled.length > 0 && (
        <AlertBanner
          variant="warning"
          title={`${stalled.length} card(s) parado(s) há 5+ dias na mesma coluna`}
          description={stalled.map((p) => p.title).join(" · ")}
        />
      )}

      <div className="flex gap-3 overflow-x-auto pb-4">
        {PRODUCTION_STAGE_ORDER.map((stage) => {
          const cards = filtered.filter((p) => p.stage === stage);
          return (
            <div
              key={stage}
              className="flex w-[260px] shrink-0 flex-col rounded-xl border border-border/80 bg-surface/30 shadow-sm"
            >
              <div className="border-b border-border/60 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{PRODUCTION_STAGE_LABELS[stage]}</p>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-elevated px-1.5 text-[10px] font-medium text-muted-foreground">
                    {cards.length}
                  </span>
                </div>
              </div>
              <ul className="flex flex-1 flex-col gap-2 p-2.5">
                {cards.length === 0 && (
                  <li className="px-2 py-6 text-center text-xs text-muted-foreground">
                    Vazio
                  </li>
                )}
                {cards.map((card) => (
                  <li
                    key={card.id}
                    className={cn(
                      "group rounded-lg border bg-background/60 p-3 shadow-sm transition-all hover:border-border hover:shadow-md",
                      card.daysInStage >= 5 && card.stage !== "publicado"
                        ? "border-amber-400/40"
                        : "border-border/50",
                    )}
                  >
                    <p className="text-sm font-medium leading-snug">{card.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {getClientName(state, card.clientId)} ·{" "}
                      {PRODUCTION_TYPE_LABELS[card.type]}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <PersonBadge person={card.owner} />
                      <span className="text-[10px] text-muted-foreground">
                        Prazo {formatDateBR(card.dueDate)}
                      </span>
                    </div>
                    {card.daysInStage > 0 && card.stage !== "publicado" && (
                      <p
                        className={cn(
                          "mt-1.5 text-[10px]",
                          card.daysInStage >= 5 ? "font-medium text-amber-400" : "text-muted-foreground",
                        )}
                      >
                        {card.daysInStage}d nesta coluna
                      </p>
                    )}
                    {card.briefing && (
                      <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
                        {card.briefing}
                      </p>
                    )}
                    {card.notes && (
                      <p className="mt-1 text-[10px] text-amber-300/80">{card.notes}</p>
                    )}
                    <div className="mt-3 flex items-center gap-1 border-t border-border/40 pt-2.5 opacity-60 transition-opacity group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 flex-1 px-1"
                        disabled={!getPrevProductionStage(card.stage)}
                        onClick={() => {
                          const prev = getPrevProductionStage(card.stage);
                          if (prev) moveProduction(card.id, prev);
                        }}
                        title="Mover para etapa anterior"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-destructive hover:text-destructive"
                        onClick={() => deleteProduction(card.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 flex-1 px-1"
                        disabled={!getNextProductionStage(card.stage)}
                        onClick={() => {
                          const next = getNextProductionStage(card.stage);
                          if (next) moveProduction(card.id, next);
                        }}
                        title="Mover para próxima etapa"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddProductionDialog({
  clients,
  onCreate,
}: {
  clients: { id: string; name: string }[];
  onCreate: (input: {
    title: string;
    clientId: string;
    type: ProductionType;
    owner: TeamMember;
    dueDate: string;
    briefing?: string;
  }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [type, setType] = useState<ProductionType>("imovel");
  const [owner, setOwner] = useState<TeamMember>("caio");
  const [dueDate, setDueDate] = useState("");
  const [briefing, setBriefing] = useState("");

  const handleCreate = () => {
    if (!title.trim() || !clientId || !dueDate) return;
    onCreate({ title, clientId, type, owner, dueDate, briefing: briefing || undefined });
    setOpen(false);
    setTitle("");
    setBriefing("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Novo card
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova produção</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Título</Label>
            <Input className="mt-1" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as ProductionType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["imovel", "prova_social", "autoridade"] as ProductionType[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {PRODUCTION_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Dono</Label>
              <Select value={owner} onValueChange={(v) => setOwner(v as TeamMember)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luan">Luan</SelectItem>
                  <SelectItem value="vini">Vini</SelectItem>
                  <SelectItem value="caio">Caio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Prazo</Label>
            <Input
              type="date"
              className="mt-1"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <Label>Briefing (opcional)</Label>
            <Textarea
              className="mt-1"
              rows={2}
              value={briefing}
              onChange={(e) => setBriefing(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} className="w-full">
            Criar card
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
