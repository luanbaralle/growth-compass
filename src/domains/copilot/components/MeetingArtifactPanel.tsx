import type { CopilotMeetingArtifact } from "../meeting/types";

export function MeetingArtifactPanel({ artifact }: { artifact: CopilotMeetingArtifact }) {
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  const engagement = artifact.recommended_engagement as Record<string, unknown> | null;
  const knowledgeDepth = artifact.knowledge_depth ?? (diagnosis.knowledgeDepth as number) ?? 0;
  const whatWeLearned = artifact.what_we_learned ?? [];
  const synthesisError =
    (artifact.meeting_synthesis as { synthesisError?: string } | null)?.synthesisError ?? null;

  return (
    <div className="space-y-6 rounded-xl border border-border/50 bg-muted/10 p-5">
      {synthesisError && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
          Síntese incompleta: {synthesisError}
        </div>
      )}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Business diagnosis
        </p>
        <p className="mt-2 text-sm text-foreground/90">
          {String(diagnosis.situation ?? artifact.transcript_summary)}
        </p>
        {knowledgeDepth > 0 && (
          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
            Knowledge depth: {knowledgeDepth}%
          </p>
        )}
      </div>

      {diagnosis.constraint && (
        <div>
          <p className="text-xs font-semibold text-foreground/80">Restrição operacional</p>
          <p className="mt-1 text-sm text-muted-foreground">{String(diagnosis.constraint)}</p>
        </div>
      )}

      {whatWeLearned.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground/80">What we learned</p>
          <ul className="mt-2 space-y-1.5">
            {whatWeLearned.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-emerald-500">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {artifact.pain_points.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground/80">Principal problema</p>
          <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
            {artifact.pain_points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {diagnosis.opportunity && (
        <div>
          <p className="text-xs font-semibold text-foreground/80">Oportunidade R1</p>
          <p className="mt-1 text-sm text-muted-foreground">{String(diagnosis.opportunity)}</p>
        </div>
      )}

      {artifact.opportunities.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground/80">Oportunidades identificadas</p>
          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
            {artifact.opportunities.map((o, i) => {
              const opp = o as { label?: string; value?: string; rationale?: string };
              return (
                <li key={i}>
                  {opp.label ?? opp.value}
                  {opp.rationale ? ` — ${opp.rationale}` : ""}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {artifact.unknowns.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Critical unknowns
          </p>
          <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
            {artifact.unknowns.slice(0, 12).map((u) => (
              <li key={u}>❓ {u}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground/80">
            Não recomendamos finalizar a proposta antes de esclarecer estes pontos.
          </p>
        </div>
      )}

      {artifact.hypotheses.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground/80">Hipóteses</p>
          <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
            {artifact.hypotheses.slice(0, 8).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {engagement && (
        <div>
          <p className="text-xs font-semibold text-foreground/80">Recommended engagement</p>
          <p className="mt-1 text-sm font-medium">
            {String(engagement.strategy ?? "Estratégia recomendada")}
          </p>
          {Array.isArray(engagement.phases) && (
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {(engagement.phases as Array<{ name: string; items: string[] }>).map((phase) => (
                <li key={phase.name}>
                  <span className="font-medium text-foreground/70">{phase.name}:</span>{" "}
                  {phase.items.join(" · ")}
                </li>
              ))}
            </ul>
          )}
          {engagement.confidence != null && (
            <p className="mt-2 text-xs text-muted-foreground">
              Confidence: {String(engagement.confidence)}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}
