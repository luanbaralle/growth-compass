import type { CopilotMeetingArtifact } from "../meeting/types";

export function MeetingArtifactPanel({ artifact }: { artifact: CopilotMeetingArtifact }) {
  const diagnosis = artifact.diagnosis as Record<string, unknown>;
  const engagement = artifact.recommended_engagement as Record<string, unknown> | null;

  return (
    <div className="space-y-6 rounded-xl border border-border/50 bg-muted/10 p-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Business diagnosis
        </p>
        <p className="mt-2 text-sm text-foreground/90">
          {String(diagnosis.situation ?? artifact.transcript_summary)}
        </p>
      </div>

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

      {artifact.opportunities.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-foreground/80">Oportunidades</p>
          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
            {artifact.opportunities.map((o, i) => {
              const opp = o as { label?: string; rationale?: string };
              return (
                <li key={i}>
                  {opp.label}
                  {opp.rationale ? ` — ${opp.rationale}` : ""}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {artifact.unknowns.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Still unknown</p>
          <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
            {artifact.unknowns.map((u) => (
              <li key={u}>❓ {u}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground/80">
            Não recomendamos finalizar a proposta antes de esclarecer estes pontos.
          </p>
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
