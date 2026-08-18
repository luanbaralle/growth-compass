import type { CopilotMeetingArtifact } from "../meeting/types";
import type { EvidenceGraphItem, ProposalReadiness } from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  buildLearnedItems,
  computeProposalReadinessPercent,
  groupUnknowns,
  KIND_META,
} from "./diagnosis-helpers";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/55">
      {children}
    </p>
  );
}

export function MeetingArtifactPanel({
  artifact,
  overallCoverage,
  knowledgeDepth: knowledgeDepthProp,
  proposalReadiness,
  evidenceItems = [],
  onScrollToEvidence,
  onViewInTranscript,
  diagnosisValidated,
  onValidateDiagnosis,
}: {
  artifact: CopilotMeetingArtifact;
  overallCoverage?: number;
  knowledgeDepth?: number;
  proposalReadiness?: ProposalReadiness;
  evidenceItems?: EvidenceGraphItem[];
  onScrollToEvidence?: () => void;
  onViewInTranscript?: (segmentIds: string[]) => void;
  diagnosisValidated?: boolean;
  onValidateDiagnosis?: () => void;
}) {
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  const engagement = artifact.recommended_engagement as Record<string, unknown> | null;
  const knowledgeDepth =
    knowledgeDepthProp ?? artifact.knowledge_depth ?? (diagnosis.knowledgeDepth as number) ?? 0;
  const coverage = overallCoverage ?? (diagnosis.diagnosticCoverage as number) ?? 0;
  const synthesis = artifact.meeting_synthesis;
  const synthesisError = synthesis?.synthesisError ?? null;

  const unknownGroups = groupUnknowns({
    critical: synthesis?.criticalUnknowns ?? [],
    secondary: synthesis?.secondaryUnknowns ?? [],
    all: artifact.unknowns,
  });
  const totalGaps =
    unknownGroups.critical.length +
    unknownGroups.important.length +
    unknownGroups.secondary.length;

  const learnedItems = buildLearnedItems(artifact.what_we_learned ?? [], evidenceItems);
  const readinessPercent = proposalReadiness
    ? computeProposalReadinessPercent(proposalReadiness)
    : null;
  const confidence =
    engagement?.confidence != null ? Number(engagement.confidence) : null;
  const companyName = String(diagnosis.company ?? "");
  const contactName = String(diagnosis.contact ?? "Prospect");

  return (
    <div className="space-y-5">
      {synthesisError && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/35 bg-amber-500/8 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Síntese incompleta
            </p>
            <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-300/80">
              {synthesisError}
            </p>
          </div>
        </div>
      )}

      {/* Executive summary */}
      <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-muted/15 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-amber-500/80 via-amber-400/40 to-transparent" />
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <SectionLabel>Resumo executivo</SectionLabel>
              <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                {companyName || contactName}
              </h2>
              {companyName && contactName !== companyName && (
                <p className="mt-0.5 text-sm text-muted-foreground">{contactName}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {onValidateDiagnosis && (
                <Button
                  size="sm"
                  variant={diagnosisValidated ? "secondary" : "default"}
                  className={cn(!diagnosisValidated && "bg-emerald-600 hover:bg-emerald-500")}
                  onClick={onValidateDiagnosis}
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  {diagnosisValidated ? "Diagnóstico validado" : "Validar diagnóstico"}
                </Button>
              )}
            </div>
          </div>

          <div>
            <SectionLabel>O que descobrimos</SectionLabel>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90 sm:text-base">
              {String(diagnosis.situation ?? artifact.transcript_summary)}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {artifact.pain_points[0] && (
              <div className="rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600/90 dark:text-red-400">
                  Problema
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {artifact.pain_points[0]}
                </p>
              </div>
            )}
            {diagnosis.opportunity && (
              <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600/90 dark:text-emerald-400">
                  Oportunidade
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {String(diagnosis.opportunity)}
                </p>
              </div>
            )}
          </div>

          {engagement?.strategy && (
            <div className="rounded-xl border border-border/40 bg-muted/10 px-4 py-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Recomendação
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {String(engagement.strategy)}
              </p>
            </div>
          )}

          {diagnosis.constraint && (
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/70">Restrição: </span>
              {String(diagnosis.constraint)}
            </p>
          )}

          <div className="grid gap-3 border-t border-border/40 pt-4 sm:grid-cols-3">
            <MetricBlock label="Cobertura diagnóstica" value={`${coverage}%`} progress={coverage} />
            <MetricBlock
              label="Confiança do conhecimento"
              value={`${knowledgeDepth}%`}
              progress={knowledgeDepth}
              accent="emerald"
            />
            {readinessPercent != null && (
              <MetricBlock
                label="Prontidão p/ proposta"
                value={`${readinessPercent}%`}
                progress={readinessPercent}
                accent="amber"
                sub={
                  totalGaps > 0
                    ? `${totalGaps} ponto${totalGaps === 1 ? "" : "s"} a validar`
                    : undefined
                }
              />
            )}
          </div>
        </CardContent>
      </Card>

      {learnedItems.length > 0 && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">O que aprendemos</h3>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                {learnedItems.length}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Separação entre fato, inferência, hipótese e oportunidade.
            </p>
            <ul className="mt-4 space-y-2">
              {learnedItems.map((item) => {
                const meta = KIND_META[item.kind];
                return (
                  <li
                    key={item.id}
                    className="flex gap-3 rounded-lg border border-border/35 bg-muted/10 px-3 py-2.5"
                  >
                    <span
                      className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", meta.dot)}
                      title={meta.label}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className={cn("text-[10px]", meta.badge)}>
                          {meta.label}
                        </Badge>
                        {item.segmentIds.length > 0 && onViewInTranscript && (
                          <button
                            type="button"
                            onClick={() => onViewInTranscript(item.segmentIds)}
                            className="text-[10px] font-medium text-violet-600 hover:underline dark:text-violet-400"
                          >
                            Ver no transcript
                          </button>
                        )}
                      </div>
                      {item.title ? (
                        <>
                          <p className="mt-1.5 text-sm font-semibold leading-snug text-foreground/90">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm leading-snug text-muted-foreground">
                            {item.text}
                          </p>
                        </>
                      ) : (
                        <p className="mt-1.5 text-sm leading-snug text-foreground/85">
                          {item.text}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {totalGaps > 0 && (
          <Card className="border-amber-500/15 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold">O que falta descobrir</h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Priorize o que validar antes da proposta comercial.
              </p>
              <div className="mt-4 space-y-4">
                <GapGroup
                  label="Crítico"
                  tone="red"
                  items={unknownGroups.critical}
                />
                <GapGroup
                  label="Importante"
                  tone="amber"
                  items={unknownGroups.important}
                />
                <GapGroup
                  label="Secundário"
                  tone="muted"
                  items={unknownGroups.secondary}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {engagement && (
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-violet-500/80" />
                <h3 className="text-sm font-semibold">Hipótese de solução</h3>
                {confidence != null && (
                  <Badge variant="outline" className="ml-auto tabular-nums">
                    {confidence}% confiança
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Proposta inicial da IA — validar antes de fechar escopo.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                {String(engagement.strategy ?? "Estratégia em elaboração")}
              </p>
              {Array.isArray(engagement.phases) && (
                <div className="mt-4 space-y-2">
                  {(engagement.phases as Array<{ name: string; items: string[] }>).map(
                    (phase, idx) => (
                      <div
                        key={phase.name}
                        className="flex gap-3 rounded-lg border border-border/35 px-3 py-2"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold tabular-nums text-muted-foreground">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground/80">{phase.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {phase.items.join(" · ")}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
              {onScrollToEvidence && evidenceItems.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={onScrollToEvidence}
                >
                  <GitBranch className="mr-1.5 h-3.5 w-3.5" />
                  Ver evidências
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {(artifact.opportunities.length > 0 || artifact.hypotheses.length > 0) && (
        <Accordion type="multiple" className="rounded-xl border border-border/50 px-1">
          {artifact.opportunities.length > 0 && (
            <AccordionItem value="opportunities" className="border-border/40 px-3">
              <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Oportunidades identificadas
                  <Badge variant="secondary" className="ml-1 text-[10px]">
                    {artifact.opportunities.length}
                  </Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 pb-2">
                  {artifact.opportunities.map((o, i) => {
                    const opp = o as {
                      label?: string;
                      value?: string;
                      summary?: string;
                    };
                    const text = opp.summary ?? opp.value ?? opp.label ?? "Oportunidade";
                    return (
                      <li
                        key={i}
                        className="rounded-lg border border-border/30 bg-muted/10 px-3 py-2 text-sm text-foreground/85"
                      >
                        {text}
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {artifact.hypotheses.length > 0 && (
            <AccordionItem value="hypotheses" className="border-border/40 px-3">
              <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                  Hipóteses adicionais
                  <Badge variant="secondary" className="ml-1 text-[10px]">
                    {artifact.hypotheses.length}
                  </Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1.5 pb-2 text-sm text-muted-foreground">
                  {artifact.hypotheses.slice(0, 8).map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-muted-foreground/40">—</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  );
}

function MetricBlock({
  label,
  value,
  progress,
  accent,
  sub,
}: {
  label: string;
  value: string;
  progress: number;
  accent?: "emerald" | "amber";
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border/35 bg-background/50 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-xl font-bold tabular-nums",
          accent === "emerald" && "text-emerald-600 dark:text-emerald-400",
          accent === "amber" && "text-amber-600 dark:text-amber-400",
        )}
      >
        {value}
      </p>
      <Progress
        value={progress}
        className={cn(
          "mt-2 h-1.5",
          accent === "emerald" && "[&>div]:bg-emerald-500",
          accent === "amber" && "[&>div]:bg-amber-500",
        )}
      />
      {sub && <p className="mt-1.5 text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function GapGroup({
  label,
  tone,
  items,
}: {
  label: string;
  tone: "red" | "amber" | "muted";
  items: string[];
}) {
  if (items.length === 0) return null;
  const toneClass =
    tone === "red"
      ? "text-red-600 dark:text-red-400"
      : tone === "amber"
        ? "text-amber-600 dark:text-amber-400"
        : "text-muted-foreground";

  return (
    <div>
      <p className={cn("text-[10px] font-semibold uppercase tracking-wide", toneClass)}>
        {label}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-border/40 bg-muted/15 px-3 py-1 text-xs text-foreground/80"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
