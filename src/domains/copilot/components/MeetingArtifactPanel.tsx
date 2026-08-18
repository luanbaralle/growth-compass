import type { CopilotMeetingArtifact } from "../meeting/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/55">
      {children}
    </p>
  );
}

function ReadinessBadge({ status }: { status?: string }) {
  const normalized = status?.replace("_", " ") ?? "unknown";
  const variant =
    status === "ready"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : status === "partial"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "border-red-500/25 bg-red-500/10 text-red-500/90 dark:text-red-400";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize",
        variant,
      )}
    >
      {normalized}
    </span>
  );
}

export function MeetingArtifactPanel({ artifact }: { artifact: CopilotMeetingArtifact }) {
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  const engagement = artifact.recommended_engagement as Record<string, unknown> | null;
  const knowledgeDepth = artifact.knowledge_depth ?? (diagnosis.knowledgeDepth as number) ?? 0;
  const overallCoverage = (diagnosis.diagnosticCoverage as number) ?? 0;
  const whatWeLearned = artifact.what_we_learned ?? [];
  const synthesis = artifact.meeting_synthesis;
  const synthesisError = synthesis?.synthesisError ?? null;
  const criticalUnknowns = synthesis?.criticalUnknowns ?? [];
  const secondaryUnknowns = synthesis?.secondaryUnknowns ?? [];
  const displayUnknowns =
    criticalUnknowns.length > 0 || secondaryUnknowns.length > 0
      ? [...criticalUnknowns, ...secondaryUnknowns.filter((s) => !criticalUnknowns.includes(s))]
      : artifact.unknowns;

  const confidence =
    engagement?.confidence != null ? Number(engagement.confidence) : null;

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

      {/* Hero diagnosis */}
      <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-muted/20 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-amber-500/80 via-amber-400/40 to-transparent" />
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <SectionLabel>Diagnóstico comercial</SectionLabel>
              <CardTitle className="mt-1.5 text-lg font-semibold tracking-tight">
                {String(diagnosis.contact ?? "Prospect")}
                {diagnosis.company ? (
                  <span className="font-normal text-muted-foreground">
                    {" "}
                    · {String(diagnosis.company)}
                  </span>
                ) : null}
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              {knowledgeDepth > 0 && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/25 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400"
                >
                  Profundidade {knowledgeDepth}%
                </Badge>
              )}
              <ReadinessBadge status={String(diagnosis.proposalReadiness ?? "")} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground/90">
            {String(diagnosis.situation ?? artifact.transcript_summary)}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {artifact.pain_points[0] && (
              <div className="rounded-lg border border-red-500/15 bg-red-500/5 px-3.5 py-3">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-red-600/90 dark:text-red-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Principal problema
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">
                  {artifact.pain_points[0]}
                </p>
              </div>
            )}
            {diagnosis.opportunity && (
              <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 px-3.5 py-3">
                <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-amber-600/90 dark:text-amber-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Oportunidade R1
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">
                  {String(diagnosis.opportunity)}
                </p>
              </div>
            )}
          </div>

          {diagnosis.constraint && (
            <p className="rounded-lg border border-border/40 bg-muted/15 px-3.5 py-2.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/70">Restrição: </span>
              {String(diagnosis.constraint)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* What we learned — grid cards */}
      {whatWeLearned.length > 0 && (
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-sm font-semibold">O que aprendemos</CardTitle>
              <Badge variant="secondary" className="ml-auto text-[10px]">
                {whatWeLearned.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {whatWeLearned.map((item, i) => (
                <li
                  key={`${item.slice(0, 40)}-${i}`}
                  className="flex gap-2.5 rounded-lg border border-border/35 bg-muted/10 px-3 py-2.5 text-sm leading-snug text-foreground/85"
                >
                  <span className="mt-0.5 shrink-0 text-emerald-500/80">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Unknowns + Engagement row */}
      <div className="grid gap-5 lg:grid-cols-2">
        {displayUnknowns.length > 0 && (
          <Card className="border-amber-500/15 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold">Ainda desconhecido</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Esclarecer antes de fechar a proposta
              </p>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-2">
                {displayUnknowns.slice(0, 10).map((u) => (
                  <li
                    key={u}
                    className="rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-xs text-foreground/80"
                  >
                    {u}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {engagement && (
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-foreground/70" />
                <CardTitle className="text-sm font-semibold">Engajamento sugerido</CardTitle>
                {confidence != null && (
                  <Badge variant="outline" className="ml-auto tabular-nums">
                    {confidence}% confiança
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-foreground/85">
                {String(engagement.strategy ?? "Estratégia recomendada")}
              </p>
              {Array.isArray(engagement.phases) && (
                <div className="space-y-2">
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* Collapsible secondary sections */}
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
                      detail?: string;
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
                  Hipóteses
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

      {/* Coverage mini strip in artifact when no sidebar visible on mobile */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-border/40 bg-muted/10 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Coverage</span>
          <span className="font-semibold tabular-nums">{overallCoverage}%</span>
          <Progress value={overallCoverage} className="h-1.5 w-20" />
        </div>
        {knowledgeDepth > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Profundidade</span>
            <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {knowledgeDepth}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
