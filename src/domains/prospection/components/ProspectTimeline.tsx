import type { ProspectInteraction, InteractionType } from "@/domains/prospection/types";
import { INTERACTION_TYPE_LABELS, formatProspectDate } from "@/domains/prospection/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

const TYPE_ACCENT: Partial<Record<InteractionType, string>> = {
  message_sent: "border-sky-400/50 bg-sky-400/20",
  message_received: "border-emerald-400/50 bg-emerald-400/20",
  follow_up: "border-amber-400/50 bg-amber-400/20",
  note: "border-violet-400/50 bg-violet-400/20",
  status_change: "border-brand/50 bg-brand/20",
  converted: "border-emerald-400/50 bg-emerald-400/20",
  proposal_sent: "border-cyan-400/50 bg-cyan-400/20",
  diagnosis_sent: "border-violet-400/50 bg-violet-400/20",
};

export function ProspectTimeline({ interactions }: { interactions: ProspectInteraction[] }) {
  if (interactions.length === 0) {
    return <p className="text-sm text-muted-foreground/70">Nenhum evento registrado.</p>;
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute bottom-3 left-[5px] top-3 w-px bg-border/30" />
      {interactions.map((item) => (
        <div key={item.id} className="relative flex gap-3.5 pb-5 pl-0 last:pb-0">
          <div
            className={cn(
              "relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 bg-background",
              TYPE_ACCENT[item.type] ?? "border-border/50 bg-muted/30",
            )}
          />
          <div className="min-w-0 flex-1 rounded-lg border border-border/20 bg-surface-elevated/30 px-3.5 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[13px] font-medium text-foreground/90">
                {INTERACTION_TYPE_LABELS[item.type] ?? item.title}
              </p>
              <span className="text-[11px] text-muted-foreground/60">
                {formatProspectDate(item.occurred_at)}
              </span>
            </div>
            {item.title !== INTERACTION_TYPE_LABELS[item.type] && (
              <p className="mt-0.5 text-xs text-muted-foreground/70">{item.title}</p>
            )}
            {item.body && (
              <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground/80">
                {item.body}
              </p>
            )}
            {item.author_id && (
              <p className="mt-2 text-[10px] text-muted-foreground/50">
                {TEAM_LABELS[item.author_id as TeamMember] ?? item.author_id}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
