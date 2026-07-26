import {
  aiFlowDiagram,
  operationalFlowDiagram,
  solutionArchitectureDiagram,
} from "@/lib/projects/nobre-content";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ChevronDown,
  Cloud,
  Database,
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";

const diagramShell = "rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10";

function DiagramCaption({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto mt-6 max-w-2xl text-center text-[13px] leading-relaxed text-white/45">
      {children}
    </p>
  );
}

function DiagramConnector({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center py-2", className)}>
      <div className="h-5 w-px bg-gradient-to-b from-white/20 to-white/5" />
    </div>
  );
}

function DiagramNode({
  label,
  icon: Icon,
  className,
  compact,
}: {
  label: string;
  icon?: LucideIcon;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.1] bg-white/[0.03] text-center",
        compact ? "px-3 py-2.5" : "px-4 py-3.5 sm:px-5 sm:py-4",
        className,
      )}
    >
      {Icon ? (
        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <Icon className="h-3.5 w-3.5 text-white/45" strokeWidth={1.5} />
        </div>
      ) : null}
      <p
        className={cn(
          "font-medium text-white/75",
          Icon ? "mt-2" : "",
          compact ? "text-[11px] leading-snug sm:text-[12px]" : "text-[12px] sm:text-[13px]",
        )}
      >
        {label}
      </p>
    </div>
  );
}

function DiagramSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38">
        {title}
      </p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function SolutionArchitectureDiagram() {
  return (
    <DiagramSection title={solutionArchitectureDiagram.title}>
      <div className={diagramShell}>
        <div className="mx-auto flex max-w-lg flex-col items-stretch">
          <DiagramNode label="Google Cloud" icon={Cloud} />
          <DiagramConnector />
          <DiagramNode label="Aplicação Web" icon={LayoutDashboard} />
          <DiagramConnector />

          <div className="relative py-1">
            <div className="absolute left-1/2 top-0 hidden h-px w-[78%] -translate-x-1/2 bg-white/10 sm:block" />
            <div className="grid grid-cols-1 gap-3 pt-0 sm:grid-cols-3 sm:gap-4 sm:pt-3">
              <div className="flex flex-col items-center">
                <div className="hidden h-3 w-px bg-white/15 sm:block" />
                <DiagramNode label="Imoview API" icon={Database} compact className="w-full" />
              </div>
              <div className="flex flex-col items-center">
                <div className="hidden h-3 w-px bg-white/15 sm:block" />
                <DiagramNode label="WhatsApp Business" icon={MessageCircle} compact className="w-full" />
              </div>
              <div className="flex flex-col items-center">
                <div className="hidden h-3 w-px bg-white/15 sm:block" />
                <DiagramNode label="Google Gemini" icon={Sparkles} compact className="w-full" />
              </div>
            </div>
          </div>

          <DiagramConnector />
          <DiagramNode label="Banco de Dados / Histórico" icon={Database} />
        </div>
      </div>
      <DiagramCaption>{solutionArchitectureDiagram.caption}</DiagramCaption>
    </DiagramSection>
  );
}

export function OperationalFlowDiagram() {
  const { steps, decision, yesAction, noPath } = operationalFlowDiagram;

  return (
    <DiagramSection title={operationalFlowDiagram.title}>
      <div className={diagramShell}>
        <div className="hidden lg:block">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {steps.map((step, i) => (
              <Fragment key={step}>
                <DiagramNode label={step} compact className="min-w-[9rem] shrink-0" />
                {i < steps.length - 1 ? (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/20" />
                ) : null}
              </Fragment>
            ))}
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center">
            <DiagramConnector />
            <DiagramNode label={decision} compact className="min-w-[12rem] border-amber-400/15 bg-amber-400/[0.03]" />

            <div className="relative mt-6 w-full max-w-2xl">
              <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-white/10" />
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex flex-col items-center">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                    Sim
                  </p>
                  <div className="h-3 w-px bg-white/15" />
                  <DiagramNode label={yesAction} compact className="mt-2 w-full border-amber-400/15 bg-amber-400/[0.03]" />
                </div>
                <div className="flex flex-col items-center">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                    Não
                  </p>
                  <div className="h-3 w-px bg-white/15" />
                  <div className="mt-2 flex w-full flex-col items-stretch gap-2">
                    {noPath.map((step, i) => (
                      <Fragment key={step}>
                        <DiagramNode label={step} compact className="w-full" />
                        {i < noPath.length - 1 ? (
                          <ChevronDown className="mx-auto h-3.5 w-3.5 text-white/15" />
                        ) : null}
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="mx-auto flex max-w-sm flex-col items-stretch">
            {steps.map((step, i) => (
              <Fragment key={step}>
                <DiagramNode label={step} compact />
                {i < steps.length - 1 ? (
                  <div className="flex justify-center py-1">
                    <ChevronDown className="h-4 w-4 text-white/15" />
                  </div>
                ) : null}
              </Fragment>
            ))}

            <DiagramConnector />
            <DiagramNode label={decision} compact className="border-amber-400/15 bg-amber-400/[0.03]" />

            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">Sim</p>
                <DiagramNode label={yesAction} compact className="border-amber-400/15 bg-amber-400/[0.03]" />
              </div>
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">Não</p>
                <div className="space-y-2">
                  {noPath.map((step, i) => (
                    <Fragment key={step}>
                      <DiagramNode label={step} compact />
                      {i < noPath.length - 1 ? (
                        <div className="flex justify-center">
                          <ChevronDown className="h-3.5 w-3.5 text-white/15" />
                        </div>
                      ) : null}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DiagramCaption>{operationalFlowDiagram.caption}</DiagramCaption>
    </DiagramSection>
  );
}

export function AiFlowDiagram() {
  const { steps, outcomes } = aiFlowDiagram;
  const stepIcons: (LucideIcon | undefined)[] = [
    MessageCircle,
    Sparkles,
    Sparkles,
    Sparkles,
    Workflow,
  ];

  return (
    <DiagramSection title={aiFlowDiagram.title}>
      <div className={diagramShell}>
        <div className="mx-auto flex max-w-md flex-col items-stretch">
          {steps.map((step, i) => (
            <Fragment key={step}>
              <DiagramNode label={step} icon={stepIcons[i]} compact={i > 0 && i < steps.length - 1} />
              {i < steps.length - 1 ? <DiagramConnector /> : null}
            </Fragment>
          ))}

          <DiagramConnector />

          <div className="relative py-1">
            <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-white/10" />
            <div className="grid grid-cols-2 gap-3 pt-3">
              {outcomes.map((outcome) => (
                <div key={outcome} className="flex flex-col items-center">
                  <div className="h-3 w-px bg-white/15" />
                  <DiagramNode label={outcome} compact className="mt-2 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <DiagramCaption>{aiFlowDiagram.caption}</DiagramCaption>
    </DiagramSection>
  );
}
