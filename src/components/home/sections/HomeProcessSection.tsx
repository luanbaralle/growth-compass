import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { processSteps } from "@/lib/home/content";

export function HomeProcessSection() {
  return (
    <SectionShell id="processo" className="border-b border-border/60 py-20 lg:py-28">
      <div className="max-w-2xl">
        <SectionEyebrow>Processo</SectionEyebrow>
        <SectionTitle>Como trabalhamos</SectionTitle>
        <SectionDescription>
          Um processo claro, do diagnóstico à escala — para crescer com consistência.
        </SectionDescription>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-5">
        {processSteps.map((step, index) => (
          <div key={step.number} className="relative">
            <article className="h-full rounded-[1.35rem] border border-border bg-surface/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                {step.number}
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </article>
            {index < processSteps.length - 1 && (
              <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-brand/30 lg:block" />
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
