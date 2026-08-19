import type { ProposalMovement } from "../types";
import { r1CardClass } from "../shell/r1-tokens";
import { cn } from "@/lib/utils";

const accentByIndex = ["text-emerald-400/90", "text-sky-400/90", "text-amber-400/80"];

export function ProposalMovementsTimeline({ movements }: { movements: ProposalMovement[] }) {
  if (movements.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="relative grid gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="absolute left-[16.67%] right-[16.67%] top-10 hidden h-px bg-white/10 lg:block" />

        {movements.map((movement, index) => (
          <div
            key={movement.number}
            className={cn(
              r1CardClass,
              "relative h-full",
              movement.conditional && "border-amber-500/20 bg-amber-500/[0.03]",
            )}
          >
            <p className={cn("font-mono text-4xl font-bold leading-none", accentByIndex[index])}>
              {movement.number}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{movement.title}</h3>
              {movement.conditional && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300/90">
                  Após validação
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-white/55">{movement.subtitle}</p>
            {movement.duration && (
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/35">
                {movement.duration}
              </p>
            )}
            {movement.objective && (
              <p className="mt-4 text-sm leading-relaxed text-white/60">{movement.objective}</p>
            )}
            <ul className="mt-5 space-y-2.5">
              {movement.deliverables.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-white/65">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
