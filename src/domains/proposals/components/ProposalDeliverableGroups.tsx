import type { ProposalDeliverableGroup } from "../types";
import { r1CardClass } from "../shell/r1-tokens";
import { Check } from "lucide-react";

export function ProposalDeliverableGroups({ groups }: { groups: ProposalDeliverableGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {groups.map((group) => (
        <div key={group.number} className={r1CardClass}>
          <p className="font-mono text-2xl font-bold text-emerald-400/90">{group.number}</p>
          <h3 className="mt-2 text-base font-semibold text-white">{group.title}</h3>
          <ul className="mt-4 space-y-2">
            {group.items.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-white/60">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/80" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
