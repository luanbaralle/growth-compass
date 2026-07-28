import { Footer } from "@/components/landing/shared/Footer";
import { Logo } from "@/components/landing/shared/Logo";
import { Nav } from "@/components/landing/shared/Nav";
import {
  AiFlowDiagram,
  OperationalFlowDiagram,
  SolutionArchitectureDiagram,
} from "./NobreDiagrams";
import projectLeadPhoto from "@/assets/luan-baralle.png";
import { PlatformMockupsSection } from "./NobreMockups";
import {
  acceptanceCriteria,
  architectureNote,
  closingContent,
  cycleDemonstration,
  deliverables,
  dependencies,
  developmentPlan,
  executiveScope,
  executiveSummary,
  futureEvolution,
  ownershipContent,
  platformMockups,
  postCycleRules,
  heroContent,
  investmentContent,
  methodPhases,
  navSections,
  nobreProject,
  operationalArchitecture,
  operationalRules,
  operationalScale,
  outOfScope,
  premises,
  projectBrief,
  projectPricing,
  solutionSummary,
  systemResponsibilities,
  teamResponsibilities,
  technologyPlatform,
  timeline,
  useCases,
} from "./nobre-content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { captureUtmFromUrl } from "@/lib/utm";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Archive,
  CalendarClock,
  Check,
  ChevronDown,
  Database,
  Inbox,
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { Fragment, useEffect, useMemo, type ReactNode } from "react";

const shell = "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8";
const shellWide = "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8";
const labelClass = "text-[11px] font-medium uppercase tracking-[0.2em] text-white/38 sm:tracking-[0.24em]";
const divider = "border-t border-white/[0.06]";
const sectionPy = "py-16 sm:py-24 lg:py-32";
const sectionPyWide = "py-20 sm:py-28 lg:py-36";
const scrollAnchor = "scroll-mt-28 sm:scroll-mt-32";

const archIcons: Record<string, LucideIcon> = {
  database: Database,
  calendar: CalendarClock,
  message: MessageCircle,
  inbox: Inbox,
  sparkles: Sparkles,
  workflow: Workflow,
  dashboard: LayoutDashboard,
};

function InstallmentPrice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "whitespace-nowrap font-semibold tracking-tight text-white tabular-nums",
        className,
      )}
    >
      <span className="text-[0.68em] font-semibold">{projectPricing.installmentsCount}</span>{" "}
      {projectPricing.installmentsAmount}
    </p>
  );
}

function Section({
  id,
  className,
  wide,
  children,
}: {
  id?: string;
  className?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn(wide ? shellWide : shell, scrollAnchor, className)}>
      {children}
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className={labelClass}>{children}</p>;
}

const listCardClass = "rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-7";

function DotListItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("flex items-start gap-2.5 leading-relaxed", className)}>
      <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-white/30" aria-hidden />
      {children}
    </li>
  );
}

function CheckListItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("flex items-start gap-2.5 leading-relaxed", className)}>
      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/55" strokeWidth={2} aria-hidden />
      {children}
    </li>
  );
}

function DotList({
  items,
  className,
  itemClassName,
}: {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
}) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <DotListItem key={item} className={itemClassName}>
          {item}
        </DotListItem>
      ))}
    </ul>
  );
}

function CheckList({
  items,
  className,
  itemClassName,
}: {
  items: readonly string[];
  className?: string;
  itemClassName?: string;
}) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <CheckListItem key={item} className={itemClassName}>
          {item}
        </CheckListItem>
      ))}
    </ul>
  );
}


function ArchitectureDiagram() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-stretch py-4">
      {operationalArchitecture.map((layer, i) => {
        const Icon = archIcons[layer.icon] ?? Workflow;
        const isFirst = i === 0;
        const isLast = i === operationalArchitecture.length - 1;
        const highlight = "highlight" in layer ? layer.highlight : undefined;

        return (
          <Fragment key={layer.layer}>
            <div
              className={cn(
                "rounded-2xl border px-5 py-5 text-center transition-colors sm:px-8 sm:py-7",
                isFirst && "border-emerald-400/25 bg-emerald-400/[0.06]",
                isLast && "border-sky-400/20 bg-sky-400/[0.04]",
                !isFirst && !isLast && "border-white/[0.1] bg-white/[0.03]",
              )}
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <Icon className="h-4 w-4 text-white/50" strokeWidth={1.5} />
              </div>
              {highlight ? (
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
                  {highlight}
                </p>
              ) : null}
              <p className="mt-3 text-[11px] font-semibold tracking-[0.22em] text-white/45">
                {layer.shortLabel}
              </p>
              <p className="mt-2 text-[15px] font-medium text-white/90">{layer.role}</p>
              <p className="mt-1.5 text-[12px] text-white/40">{layer.responsibility}</p>
            </div>
            {i < operationalArchitecture.length - 1 ? (
              <div className="flex justify-center py-3">
                <div className="h-6 w-px bg-gradient-to-b from-white/20 to-white/5" />
              </div>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}

function OperationalScaleBadge() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-6 sm:px-10 sm:py-8">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white/40">
        {operationalScale.title}
      </p>
      <div className="mt-8 flex flex-col items-center gap-0 sm:flex-row sm:justify-center sm:gap-0">
        {operationalScale.steps.map((step, i) => (
          <Fragment key={step.label}>
            <div className="px-4 py-3 text-center">
              <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{step.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/40">{step.label}</p>
            </div>
            {i < operationalScale.steps.length - 1 ? (
              <ChevronDown className="my-1 h-4 w-4 text-white/20 sm:hidden" />
            ) : null}
            {i < operationalScale.steps.length - 1 ? (
              <span className="hidden px-2 text-white/20 sm:inline">→</span>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function CycleStoryboard() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-center text-[13px] text-white/45">{cycleDemonstration.subtitle}</p>
      <div className="mt-8 space-y-0 sm:mt-12">
        {cycleDemonstration.beats.map((beat, i) => (
          <div key={beat.time} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-6 sm:pb-10">
            <div className="flex w-11 shrink-0 flex-col items-center sm:w-14">
              <span className="text-[12px] font-mono text-white/35">{beat.time}</span>
              {i < cycleDemonstration.beats.length - 1 ? (
                <div className="mt-2 w-px flex-1 bg-white/[0.08]" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[15px] font-medium text-white/90">{beat.title}</p>
              {beat.detail ? (
                <p className="mt-1.5 text-[14px] text-white/50">{beat.detail}</p>
              ) : null}
              {"breakdown" in beat && beat.breakdown ? (
                <div className="mt-4 space-y-2">
                  {beat.breakdown.map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "rounded-lg border px-4 py-2.5 text-[13px]",
                        item.tone === "warning" && "border-amber-400/20 bg-amber-400/[0.05] text-amber-100/80",
                        item.tone === "alert" && "border-rose-400/20 bg-rose-400/[0.05] text-rose-100/80",
                        item.tone === "neutral" && "border-white/[0.08] bg-white/[0.02] text-white/60",
                      )}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              ) : null}
              {"alerts" in beat && beat.alerts ? (
                <div className="mt-4 rounded-xl border border-amber-400/15 bg-[#0c0c0c] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">Painel</p>
                  <div className="mt-3 space-y-2">
                    {beat.alerts.map((alert) => (
                      <p key={alert} className="text-[14px] text-amber-100/85">
                        ⚠ {alert}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BpmUseCase({
  index,
  title,
  event,
  processing,
  action,
  responsible,
}: {
  index: number;
  title: string;
  event: string;
  processing: string;
  action: string;
  responsible: string;
}) {
  const rows = [
    { label: "Evento", value: event },
    { label: "Processamento", value: processing },
    { label: "Ação", value: action },
    { label: "Responsável", value: responsible },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.015]">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <p className="text-[11px] font-mono text-white/25">Caso {String(index).padStart(2, "0")}</p>
        <p className="mt-1 text-[15px] font-medium text-white/90">{title}</p>
      </div>
      <div className="p-5">
        {rows.map((row, i) => (
          <Fragment key={row.label}>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                {row.label}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-white/65">{row.value}</p>
            </div>
            {i < rows.length - 1 ? (
              <div className="flex justify-center py-3">
                <ChevronDown className="h-4 w-4 text-white/15" />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ArchivedBanner() {
  return (
    <div className="border-b border-amber-500/20 bg-amber-500/[0.08]">
      <div className={cn(shell, "flex items-center justify-center gap-2.5 py-3 sm:gap-3 sm:py-3.5")}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-[11px] sm:tracking-[0.22em]">
          <Archive className="h-3.5 w-3.5" strokeWidth={2} />
          Arquivado
        </span>
        <p className="text-[12px] text-amber-100/70 sm:text-[13px]">
          Esta proposta não está mais ativa e permanece disponível apenas para consulta.
        </p>
      </div>
    </div>
  );
}

export function NobreProjectPage() {
  const ctaHref = useMemo(
    () => buildWhatsAppUrl(nobreProject.cta.message) ?? nobreProject.cta.fallbackHref,
    [],
  );

  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  return (
    <div className="min-h-screen bg-[#090909] text-white antialiased">
      <Nav ctaHref={ctaHref} ctaLabel={nobreProject.cta.label} homeHref="/" />
      <ArchivedBanner />

      <main id="top">
        {/* HERO */}
        <header className={cn(shell, scrollAnchor, "border-b border-white/[0.06] pb-10 pt-12 sm:pb-12 sm:pt-16 lg:pb-16 lg:pt-24")}>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-col gap-1 text-[11px] text-white/35 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:text-[12px]">
              <span>{nobreProject.preparedFor}</span>
              <span>
                {nobreProject.date} · v{nobreProject.documentVersion}
              </span>
            </div>
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/45">
              <Archive className="h-3 w-3" strokeWidth={2} />
              Documento arquivado
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl text-[1.65rem] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:mt-8 sm:text-[2rem] sm:leading-[1.12] lg:text-[3rem]">
            {heroContent.title}
          </h1>
          <p className="mt-4 text-[14px] text-white/55">{heroContent.subtitle}</p>
          <p className="mt-3 text-[13px] text-white/40">{heroContent.exclusive}</p>
        </header>

        {/* ESCOPO EXECUTIVO — destaque principal */}
        <Section id="escopo-executivo" className="py-10 sm:py-12 lg:py-16">
          <div className="rounded-2xl border border-white/[0.14] bg-white/[0.04] p-5 sm:p-8 lg:p-10">
            <p className="text-[15px] font-semibold text-white">{executiveScope.title}</p>
            <p className="mt-2 text-[13px] text-white/40">{executiveScope.subtitle}</p>
            <ul className="mt-6 space-y-3 sm:mt-8 sm:columns-2 sm:gap-x-10">
              {executiveScope.items.map((item) => (
                <li key={item} className="flex gap-3 break-inside-avoid text-[13px] text-white/75 sm:text-[14px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/80" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* RESUMO EXECUTIVO */}
        <Section id="resumo" className="pb-10 sm:pb-12 lg:pb-16">
          <div className="rounded-xl border border-white/[0.1] bg-white/[0.03] p-5 sm:p-8 lg:p-10">
            <p className="text-[13px] font-semibold text-white/90">{executiveSummary.title}</p>

            <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.08] sm:mt-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
              {[
                { label: "Investimento", highlight: true, pricing: true as const },
                { label: "Prazo", value: projectBrief.deadline },
                { label: "Cliente", value: projectBrief.client },
                { label: "Status", value: projectBrief.status },
                { label: "Versão", value: projectBrief.version },
              ].map((field) => (
                <div
                  key={field.label}
                  className={cn(
                    "bg-[#0d0d0d] px-4 py-5 sm:px-5 sm:py-6",
                    field.highlight && "sm:col-span-2 lg:col-span-1",
                  )}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 sm:tracking-[0.2em]">
                    {field.label}
                  </p>
                  {"pricing" in field && field.pricing ? (
                    <div className="mt-2">
                      <InstallmentPrice className="text-lg sm:text-xl" />
                      <p className="mt-1.5 text-[13px] text-white/50">
                        ou <span className="font-medium text-white/75">{projectPricing.cash}</span>
                      </p>
                    </div>
                  ) : (
                    <p
                      className={cn(
                        "mt-2 font-semibold tracking-tight text-white",
                        field.highlight ? "text-xl tabular-nums sm:text-2xl" : "text-[14px] sm:text-[15px]",
                      )}
                    >
                      {"value" in field ? field.value : null}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <dl className="mt-8 space-y-4 border-t border-white/[0.06] pt-6 sm:mt-10 sm:pt-8">
              {executiveSummary.items.map((item) => (
                <div key={item.label} className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="text-[13px] text-white/40">{item.label}</dt>
                  <dd className="text-[14px] leading-relaxed text-white/75">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.015] p-5 sm:mt-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
              {solutionSummary.title}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">{solutionSummary.text}</p>
          </div>

          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-[13px] font-medium text-black transition-opacity hover:opacity-90 sm:mt-8 sm:inline-flex sm:w-auto sm:justify-start sm:py-2.5"
          >
            {nobreProject.cta.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </Section>

        {/* NAV */}
        <nav
          className={cn(
            shell,
            scrollAnchor,
            "sticky top-16 z-40 border-y border-white/[0.06] bg-[#090909]/95 py-2.5 backdrop-blur-md sm:py-3",
          )}
        >
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-0.5 text-[11px] text-white/40 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:gap-5 sm:px-0 sm:text-[12px] [&::-webkit-scrollbar]:hidden">
            {navSections.map((item) => (
              <a key={item.href} href={item.href} className="shrink-0 whitespace-nowrap hover:text-white/70">
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* PLANO DE DESENVOLVIMENTO */}
        <Section id="metodo" className={sectionPy}>
          <SectionLabel>{developmentPlan.title}</SectionLabel>
          <p className="mt-3 max-w-xl text-[14px] text-white/45 sm:mt-4">{developmentPlan.intro}</p>

          <div className="mt-10 space-y-0 sm:mt-16">
            {methodPhases.map((phase) => (
              <div key={phase.phase} className={cn("grid gap-5 py-8 sm:gap-8 sm:py-10 lg:grid-cols-[120px_1fr]", divider)}>
                <div>
                  <p className="text-[12px] font-mono text-white/25">{phase.phase}</p>
                  <p className="mt-1 text-lg font-semibold text-white">{phase.title}</p>
                </div>
                <div>
                  <p className="text-[14px] leading-relaxed text-white/65">{phase.objective}</p>
                  <ul className="mt-5 space-y-2.5">
                    {phase.activities.map((activity) => (
                      <DotListItem key={activity} className="text-[13px] text-white/50">
                        {activity}
                      </DotListItem>
                    ))}
                  </ul>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/30">Entrega</p>
                      <p className="mt-2 text-[13px] text-white/65">{phase.deliverable}</p>
                    </div>
                    <div className="rounded-lg border border-emerald-400/10 bg-emerald-400/[0.03] p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-emerald-300/50">
                        Resultado esperado
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-white/65">
                        {phase.expectedResult}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ARQUITETURA — seção central */}
        <Section id="arquitetura" wide className={cn(divider, "border-t bg-white/[0.01]", sectionPyWide)}>
          <div className="mx-auto max-w-4xl">
            <SolutionArchitectureDiagram />
          </div>

          <div className="mt-16 text-center sm:mt-24">
            <SectionLabel>Arquitetura operacional</SectionLabel>
            <p className="mx-auto mt-4 max-w-lg text-[14px] leading-relaxed text-white/45">
              {architectureNote.detail}
            </p>
          </div>
          <div className="mt-12 sm:mt-16">
            <ArchitectureDiagram />
          </div>

          <div className="mx-auto mt-16 max-w-4xl sm:mt-24">
            <AiFlowDiagram />
          </div>
        </Section>

        {/* DEMONSTRAÇÃO DO CICLO — elemento memorável */}
        <Section id="ciclo" wide className={cn(divider, "border-t", sectionPyWide)}>
          <div className="mx-auto max-w-5xl">
            <OperationalFlowDiagram />
          </div>

          <div className="mt-16 text-center sm:mt-24">
            <SectionLabel>{cycleDemonstration.title}</SectionLabel>
          </div>
          <div className="mt-8 sm:mt-12">
            <CycleStoryboard />
          </div>
          <div className="mx-auto mt-12 max-w-3xl sm:mt-20">
            <OperationalScaleBadge />
          </div>
        </Section>

        {/* CASOS DE USO — BPM */}
        <Section id="casos" className={cn(divider, "border-t", sectionPy)}>
          <SectionLabel>Casos de uso</SectionLabel>
          <p className="mt-4 max-w-xl text-[14px] text-white/45">
            Fluxo operacional por evento — Evento, Processamento, Ação, Responsável.
          </p>

          <div className="mt-10 grid gap-6 sm:mt-14 sm:gap-8 lg:grid-cols-3">
            {useCases.map((useCase, i) => (
              <BpmUseCase
                key={useCase.id}
                index={i + 1}
                title={useCase.title}
                event={useCase.event}
                processing={useCase.processing}
                action={useCase.action}
                responsible={useCase.responsible}
              />
            ))}
          </div>
        </Section>

        {/* VISUALIZAÇÃO DA PLATAFORMA — mockups conceituais */}
        <Section id="plataforma" wide className={cn(divider, "border-t", sectionPyWide)}>
          <div className="text-center">
            <SectionLabel>{platformMockups.section.title}</SectionLabel>
            <p className="mx-auto mt-3 max-w-2xl px-1 text-[13px] leading-relaxed text-white/45 sm:mt-4 sm:text-[14px]">
              {platformMockups.section.intro}
            </p>
          </div>
          <div className="mt-10 sm:mt-16">
            <PlatformMockupsSection />
          </div>
        </Section>

        {/* REGRAS + RESPONSABILIDADES */}
        <Section className={cn(divider, "border-t", sectionPy)}>
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            <div className={listCardClass}>
              <SectionLabel>Regras operacionais</SectionLabel>
              <DotList items={operationalRules} className="mt-6" itemClassName="text-[13px] text-white/60" />
            </div>
            <div className={listCardClass}>
              <SectionLabel>Sistema</SectionLabel>
              <DotList items={systemResponsibilities} className="mt-6" itemClassName="text-[13px] text-white/55" />
            </div>
            <div className={listCardClass}>
              <SectionLabel>Equipe</SectionLabel>
              <DotList items={teamResponsibilities} className="mt-6" itemClassName="text-[13px] text-white/55" />
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.01] p-6 sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/30">Pós-ciclo</p>
            <DotList
              items={postCycleRules}
              className="mt-4 grid gap-3 sm:grid-cols-2 sm:space-y-0"
              itemClassName="text-[13px] text-white/50"
            />
          </div>
        </Section>

        {/* GOVERNANÇA — hierarquia visual */}
        <Section id="governanca" className={cn(divider, "border-t", sectionPy)}>
          <SectionLabel>Governança do projeto</SectionLabel>

          <div className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.03] p-6 sm:p-8">
              <p className="text-[14px] font-semibold text-white/85">Critérios de aceite</p>
              <ul className="mt-6 space-y-3">
                {acceptanceCriteria.map((item) => (
                  <li key={item} className="flex gap-3 text-[14px] text-white/70">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/60" strokeWidth={1.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-rose-400/10 bg-rose-400/[0.02] p-6 sm:p-8">
              <p className="text-[14px] font-semibold text-white/85">Não faz parte desta proposta</p>
              <ul className="mt-6 space-y-3">
                {outOfScope.map((item) => (
                  <li key={item} className="flex gap-3 text-[14px] text-white/60">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-white/25" strokeWidth={1.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 grid gap-8 rounded-xl border border-white/[0.05] bg-white/[0.01] p-6 sm:grid-cols-2 sm:p-8">
            <div>
              <p className="text-[12px] uppercase tracking-[0.16em] text-white/30">Premissas</p>
              <DotList items={premises} className="mt-4" itemClassName="text-[13px] text-white/45" />
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-[0.16em] text-white/30">Dependências</p>
              <DotList items={dependencies} className="mt-4" itemClassName="text-[13px] text-white/45" />
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
              <p className="text-[14px] font-semibold text-white/85">{ownershipContent.title}</p>
              <DotList items={ownershipContent.points} className="mt-4" itemClassName="text-[13px] text-white/60" />
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
              <p className="text-[14px] font-semibold text-white/85">{futureEvolution.title}</p>
              <p className="mt-2 text-[13px] text-white/45">{futureEvolution.intro}</p>
              <DotList items={futureEvolution.items} className="mt-4" itemClassName="text-[13px] text-white/55" />
            </div>
          </div>
        </Section>

        {/* ENTREGÁVEIS */}
        <Section id="entregaveis" className={cn(divider, "border-t", sectionPy)}>
          <div className="grid gap-10 sm:gap-16 lg:grid-cols-2">
            <div>
              <SectionLabel>Entregáveis</SectionLabel>
              <CheckList
                items={deliverables}
                className="mt-8 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-3 sm:space-y-0"
                itemClassName="text-[13px] text-white/60 sm:text-[14px]"
              />
            </div>
            <div>
              <SectionLabel>{technologyPlatform.title}</SectionLabel>
              <div className="mt-8 space-y-6">
                {technologyPlatform.groups.map((group) => (
                  <div key={group.label}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                      {group.label}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-white/[0.08] px-3 py-1.5 text-[12px] text-white/55"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className={cn(labelClass, "mt-14")}>Cronograma</p>
              <div className="mt-8 space-y-4">
                {timeline.map((item, i) => (
                  <div key={item.phase} className="flex gap-4">
                    <span className="w-5 shrink-0 text-[12px] font-mono text-white/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-[14px] font-medium text-white/80">{item.phase}</p>
                      <p className="text-[13px] text-white/40">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* INVESTIMENTO */}
        <Section id="investimento" className={cn(divider, "border-t", sectionPy)}>
          <SectionLabel>{investmentContent.title}</SectionLabel>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/45 sm:mt-4">
            {investmentContent.description}
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.025] sm:mt-10">
            <div className="border-b border-white/[0.08] bg-white/[0.02] px-4 py-4 sm:px-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                {investmentContent.badge.title}
              </p>
              <p className="mt-1 text-[13px] text-white/55">{investmentContent.badge.description}</p>
            </div>

            <div className="border-b border-white/[0.08] bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent)] px-4 py-8 sm:px-10 sm:py-10">
              <InstallmentPrice className="text-[1.85rem] leading-none sm:text-[2.25rem] lg:text-[2.5rem]" />
              <p className="mt-3 text-[15px] text-white/50 sm:text-[16px]">
                ou{" "}
                <span className="font-semibold text-white/80">{investmentContent.pricing.cash}</span>
              </p>
              <p className="mt-4 max-w-lg text-[12px] leading-relaxed text-white/40">
                {investmentContent.pricingNote}
              </p>
            </div>

            <div className="px-4 py-8 sm:px-10 sm:py-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {investmentContent.includesLabel}
              </p>
              <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                {investmentContent.includes.map((item) => (
                  <CheckListItem key={item} className="text-[13px] text-white/65">
                    {item}
                  </CheckListItem>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/[0.08] px-4 py-8 sm:px-10 sm:py-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {investmentContent.deadline.title}
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-white">
                {investmentContent.deadline.value}
              </p>
              <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-white/50">
                {investmentContent.deadline.note}
              </p>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-white/40">
                {investmentContent.deadline.startNote}
              </p>
            </div>

            <div className="grid border-t border-white/[0.08] lg:grid-cols-2">
              <div className="border-b border-white/[0.08] px-4 py-8 sm:px-10 sm:py-10 lg:border-b-0 lg:border-r">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  {investmentContent.operationalCosts.title}
                </p>
                <p className="mt-3 text-[13px] text-white/45">{investmentContent.operationalCosts.note}</p>
                <DotList
                  items={investmentContent.operationalCosts.items}
                  className="mt-5"
                  itemClassName="text-[13px] text-white/60"
                />
              </div>

              <div className="px-4 py-8 sm:px-10 sm:py-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  {investmentContent.guarantees.title}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {investmentContent.guarantees.items.map((item) => (
                    <CheckListItem key={item} className="text-[13px] text-white/60">
                      {item}
                    </CheckListItem>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-white/[0.08] px-4 py-8 sm:px-10 sm:py-10">
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-[14px] font-medium text-black transition-opacity hover:opacity-90 sm:inline-flex sm:w-auto sm:justify-start"
              >
                {nobreProject.cta.label}
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-4 text-[12px] text-white/40">{investmentContent.nextStep.text}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.03] px-5 py-5 sm:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200/80">
              {investmentContent.includedSupport.badge}
            </p>
            <p className="mt-2 text-[15px] font-semibold text-white/90">
              {investmentContent.includedSupport.title}
            </p>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-white/50 sm:text-[14px]">
              {investmentContent.includedSupport.description}
            </p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-stretch lg:gap-5">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 sm:p-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  {investmentContent.evolutionPlan.title}
                </p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">
                  {investmentContent.evolutionPlan.optionalLabel}
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-white/50 sm:text-[14px]">
                {investmentContent.evolutionPlan.intro}
              </p>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {investmentContent.evolutionPlan.includesLabel}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {investmentContent.evolutionPlan.items.map((item) => (
                  <CheckListItem key={item} className="text-[13px] text-white/55">
                    {item}
                  </CheckListItem>
                ))}
              </ul>
            </div>

            <aside className="flex flex-col justify-between rounded-2xl border border-white/[0.1] bg-[#0d0d0d] p-5 sm:p-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  {investmentContent.evolutionPlan.investmentLabel.replace(":", "")}
                </p>
                <p className="mt-3 font-semibold tracking-tight text-white tabular-nums">
                  <span className="text-[1.75rem] leading-none sm:text-[2rem]">
                    {investmentContent.evolutionPlan.price}
                  </span>
                  <span className="ml-1 text-[1rem] font-medium text-white/45 sm:text-[1.1rem]">
                    {investmentContent.evolutionPlan.priceSuffix}
                  </span>
                </p>
              </div>
              <p className="mt-6 border-t border-white/[0.08] pt-4 text-[12px] leading-relaxed text-white/42">
                {investmentContent.evolutionPlan.note}
              </p>
            </aside>
          </div>
        </Section>

        {/* FECHAMENTO */}
        <Section className={cn(divider, "border-t", sectionPy)}>
          <SectionLabel>{closingContent.nextSteps.title}</SectionLabel>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-white/45 sm:mt-4">
            {closingContent.nextSteps.intro}
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.02] sm:mt-10">
            <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-4 sm:px-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Da aprovação ao go-live
              </p>
            </div>

            <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {closingContent.nextSteps.steps.map((step, index) => (
                <article
                  key={step.title}
                  className="bg-[#0a0a0a] px-5 py-5 sm:px-6 sm:py-6"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[11px] font-mono tabular-nums text-white/45">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium leading-snug text-white/85">{step.title}</p>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-white/45 sm:text-[13px]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] sm:mt-16">
            <div className="border-b border-white/[0.06] px-5 py-8 sm:px-10 sm:py-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {closingContent.summaryLabel}
              </p>
              <blockquote className="mt-5 border-l border-white/15 pl-5 sm:pl-6">
                <p className="text-[15px] leading-[1.75] text-white/60 sm:text-[16px]">{closingContent.summary}</p>
              </blockquote>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="border-b border-white/[0.06] px-5 py-8 sm:px-10 sm:py-9 lg:border-b-0 lg:border-r">
                <div className="flex items-start gap-5">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/[0.08] sm:h-16 sm:w-16">
                    <img
                      src={projectLeadPhoto}
                      alt={closingContent.projectLead.name}
                      className="h-full w-full scale-[1.1] object-cover object-[center_18%]"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      {closingContent.projectLead.title}
                    </p>
                    <p className="mt-2 text-[16px] font-medium tracking-tight text-white/90">
                      {closingContent.projectLead.name}
                    </p>
                    <p className="mt-1 text-[13px] text-white/50">{closingContent.projectLead.subtitle}</p>
                    <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/45">
                      {closingContent.projectLead.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center px-5 py-8 sm:px-10 sm:py-9 lg:justify-end lg:px-12">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <Logo className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold tracking-tight text-white/90">{closingContent.brand.name}</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-white/40">{closingContent.brand.tagline}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/[0.06] bg-white/[0.015] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <div>
                <p className="text-[12px] tracking-[0.06em] text-white/35">{closingContent.signature}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/22">Proposta comercial</p>
              </div>
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[13px] font-medium text-black transition-opacity hover:opacity-90"
              >
                {nobreProject.cta.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
