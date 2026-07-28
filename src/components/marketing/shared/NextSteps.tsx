import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export interface NextStepLink {
  label: string;
  description: string;
  href: string;
  internal?: boolean;
}

interface NextStepsProps {
  steps: NextStepLink[];
  title?: string;
}

export function NextSteps({
  steps,
  title = "Continue explorando",
}: NextStepsProps) {
  return (
    <SectionShell className="border-b border-border/60 py-16 lg:py-20">
      <div className="max-w-2xl">
        <SectionEyebrow>Jornada</SectionEyebrow>
        <SectionTitle>{title}</SectionTitle>
        <SectionDescription>
          Cada página leva ao próximo passo. Explore o ecossistema Raise One.
        </SectionDescription>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => {
          const content = (
            <>
              <p className="font-semibold text-foreground">{step.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                Explorar
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </>
          );

          if (step.internal && !step.href.startsWith("/#")) {
            return (
              <Link
                key={step.href}
                to={step.href}
                className="group flex flex-col rounded-[1.35rem] border border-border bg-surface/30 p-5 transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:bg-surface/60"
              >
                {content}
              </Link>
            );
          }

          return (
            <a
              key={step.href}
              href={step.href}
              className="group flex flex-col rounded-[1.35rem] border border-border bg-surface/30 p-5 transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:bg-surface/60"
            >
              {content}
            </a>
          );
        })}
      </div>
    </SectionShell>
  );
}
