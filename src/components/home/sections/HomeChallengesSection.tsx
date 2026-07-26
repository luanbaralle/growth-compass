import { SectionShell, SectionTitle } from "@/components/home/shared/SectionShell";
import { challenges } from "@/lib/home/content";
import { ArrowDown } from "lucide-react";

export function HomeChallengesSection() {
  return (
    <SectionShell className="border-b border-border/60 py-20 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <SectionTitle className="mt-0">
          Não entregamos campanhas. <span className="text-brand">Entregamos crescimento.</span>
        </SectionTitle>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {challenges.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.problem}
              className="flex flex-col items-center rounded-[1.35rem] border border-border bg-surface/30 px-4 py-6 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-300">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <p className="mt-4 text-sm font-semibold text-foreground">{item.problem}</p>
              <ArrowDown className="my-3 h-4 w-4 text-brand/70" />
              <p className="text-sm font-medium text-brand">{item.solution}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
