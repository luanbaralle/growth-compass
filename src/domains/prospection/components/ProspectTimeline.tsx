import type { ProspectInteraction } from "@/domains/prospection/types";
import { INTERACTION_TYPE_LABELS, formatProspectDate } from "@/domains/prospection/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";

export function ProspectTimeline({ interactions }: { interactions: ProspectInteraction[] }) {
  if (interactions.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>;
  }

  return (
    <div className="relative space-y-0">
      <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border/60" />
      {interactions.map((item) => (
        <div key={item.id} className="relative flex gap-3 pb-4 pl-0">
          <div className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-brand/40 bg-background" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium">
                {INTERACTION_TYPE_LABELS[item.type] ?? item.title}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatProspectDate(item.occurred_at)}
              </span>
            </div>
            {item.title !== INTERACTION_TYPE_LABELS[item.type] && (
              <p className="mt-0.5 text-xs text-muted-foreground">{item.title}</p>
            )}
            {item.body && (
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{item.body}</p>
            )}
            {item.author_id && (
              <p className="mt-1 text-[10px] text-muted-foreground">
                {TEAM_LABELS[item.author_id as TeamMember] ?? item.author_id}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
