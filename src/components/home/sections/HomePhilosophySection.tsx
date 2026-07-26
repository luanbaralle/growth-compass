import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { growthFlow, philosophyBullets } from "@/lib/home/content";
import { ArrowRight, ChevronDown } from "lucide-react";

export function HomePhilosophySection() {
  return (
    <SectionShell className="border-b border-border/60 py-20 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionEyebrow>Filosofia</SectionEyebrow>
          <SectionTitle>Crescimento não acontece por acaso.</SectionTitle>
          <SectionDescription>
            Muitas empresas contratam cinco fornecedores diferentes — uma agência, uma
            produtora, um desenvolvedor, um freelancer e uma consultoria.
          </SectionDescription>
          <p className="mt-4 text-base leading-relaxed text-foreground sm:text-lg">
            Nós reunimos tudo isso em um único parceiro estratégico.
          </p>

          <ul className="mt-8 space-y-4">
            {philosophyBullets.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand-soft text-brand">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <a
            href="#processo"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
          >
            Conhecer nossa jornada
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="relative rounded-[1.75rem] border border-border bg-surface/40 p-6 sm:p-8">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
          <div className="space-y-3">
            {growthFlow.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === growthFlow.length - 1;

              return (
                <div key={step.label}>
                  <div className="flex items-center gap-4 rounded-2xl border border-border/80 bg-background/70 px-4 py-3.5 transition-colors hover:border-brand/30">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <p className="text-sm font-medium text-foreground sm:text-base">{step.label}</p>
                  </div>
                  {!isLast && (
                    <div className="flex justify-center py-1 text-brand/60">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
