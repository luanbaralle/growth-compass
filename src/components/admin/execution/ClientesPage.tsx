import { useExecutionState } from "@/components/admin/execution/use-execution-state";
import { PersonBadge, TEAM_LABELS } from "@/components/admin/execution/shared";
import { PageHeader, PageSkeleton, Section } from "@/components/admin/ui-kit";
import {
  CLIENT_STATUS_LABELS,
  type ClientStatus,
  type DependencySplit,
  type TeamMember,
} from "@/lib/execution/types";
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
import { Users } from "lucide-react";

function DependencyBar({ label, split }: { label: string; split: DependencySplit }) {
  const segments = [
    { key: "vini", label: "Vini", value: split.vini, color: "bg-brand" },
    { key: "caio", label: "Caio", value: split.caio, color: "bg-blue-400" },
    { key: "sistema", label: "Sistema", value: split.sistema, color: "bg-emerald-400" },
    ...(split.luan
      ? [{ key: "luan", label: "Luan", value: split.luan, color: "bg-purple-400" }]
      : []),
  ].filter((s) => s.value > 0);

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-elevated">
        {segments.map((s) => (
          <div
            key={s.key}
            className={cn(s.color, "transition-all duration-500")}
            style={{ width: `${s.value}%` }}
            title={`${s.label} ${s.value}%`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
        {segments.map((s) => (
          <span key={s.key} className="flex items-center gap-1">
            <span className={cn("h-1.5 w-1.5 rounded-full", s.color)} />
            {s.label} {s.value}%
          </span>
        ))}
      </div>
    </div>
  );
}

const statusStyles: Record<ClientStatus, string> = {
  active: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  paused: "border-red-400/40 text-red-300 bg-red-400/10",
  prospect: "border-amber-400/40 text-amber-300 bg-amber-400/10",
};

export function ClientesPage() {
  const { state, loading, editClient, saveTeamCapacity } = useExecutionState();

  if (loading || !state) {
    return <PageSkeleton title="Clientes" metricCount={0} />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clientes"
        description="Referência rápida + matriz de dependência (pessoa → processo → sistema)"
        icon={Users}
      />

      <div className="space-y-4">
        {state.clients.map((client) => (
          <article
            key={client.id}
            className={cn(
              "admin-card p-5 sm:p-6",
              client.status === "paused" && "border-red-400/25 bg-red-400/[0.03]",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-lg font-semibold">{client.name}</h2>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs font-medium",
                      statusStyles[client.status],
                    )}
                  >
                    {CLIENT_STATUS_LABELS[client.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{client.type}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {client.owners.map((o) => (
                    <PersonBadge key={o} person={o} />
                  ))}
                </div>
              </div>
              <Select
                value={client.status}
                onValueChange={(v) => editClient(client.id, { status: v as ClientStatus })}
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {CLIENT_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <DependencyBar label="Hoje" split={client.dependencyToday} />
              <DependencyBar label="Meta" split={client.dependencyTarget} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground">Observação</Label>
                <Textarea
                  rows={2}
                  className="mt-1.5"
                  defaultValue={client.observation}
                  onBlur={(e) => {
                    if (e.target.value !== client.observation) {
                      editClient(client.id, { observation: e.target.value });
                    }
                  }}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Próxima ação</Label>
                <Input
                  className="mt-1.5"
                  defaultValue={client.nextAction}
                  onBlur={(e) => {
                    if (e.target.value !== client.nextAction) {
                      editClient(client.id, { nextAction: e.target.value });
                    }
                  }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>

      <Section
        title="Capacidade do time"
        description="Atualizar na review de sexta. Vini <5h livres = não fechar cliente novo."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {state.teamCapacity.map((entry) => (
            <TeamCapacityCard key={entry.member} entry={entry} onSave={saveTeamCapacity} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function TeamCapacityCard({
  entry,
  onSave,
}: {
  entry: { member: TeamMember; totalHours: number; committedHours: number; freeHours: number };
  onSave: (member: TeamMember, total: number, committed: number) => void;
}) {
  const alert = entry.freeHours < 5;

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        alert ? "border-red-400/25 bg-red-400/[0.04]" : "border-border/60 bg-background/30",
      )}
    >
      <p className="font-medium">{TEAM_LABELS[entry.member]}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px] text-muted-foreground">Total (h)</Label>
          <Input
            type="number"
            className="mt-1 h-8"
            defaultValue={entry.totalHours}
            onBlur={(e) => {
              const total = parseInt(e.target.value, 10);
              if (!Number.isNaN(total)) onSave(entry.member, total, entry.committedHours);
            }}
          />
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Comprometida (h)</Label>
          <Input
            type="number"
            className="mt-1 h-8"
            defaultValue={entry.committedHours}
            onBlur={(e) => {
              const committed = parseInt(e.target.value, 10);
              if (!Number.isNaN(committed)) onSave(entry.member, entry.totalHours, committed);
            }}
          />
        </div>
      </div>
      <p className={cn("mt-3 font-display text-2xl font-bold tabular-nums", alert && "text-red-400")}>
        {entry.freeHours}h livres
      </p>
      {alert && (
        <p className="mt-1 text-xs text-red-300">No limite — evitar novos fechamentos</p>
      )}
    </div>
  );
}
