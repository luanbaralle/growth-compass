import type { BlueprintArchetype, BlueprintField } from "@/domains/proposals/blueprint/types";
import {
  ARCHETYPE_RATIONALE,
  EVIDENCE_SOURCE_LABELS,
  fieldReviewStatus,
  type DecisionItem,
  type DeliverablePillarSummary,
  type ScopePhaseGroup,
} from "@/domains/proposals/blueprint/blueprint-studio-view";
import { BLUEPRINT_ARCHETYPE_LABELS } from "@/domains/proposals/blueprint/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown, Circle, CircleCheck, CircleDot } from "lucide-react";

function StatusDot({ status }: { status: "confirmed" | "review" }) {
  if (status === "confirmed") {
    return <CircleCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />;
  }
  return <CircleDot className="h-3.5 w-3.5 shrink-0 text-amber-500" />;
}

export function BlueprintThesisHero({
  companyName,
  clientName,
  thesis,
  proposalStateLabel,
  proposalStateTone,
  coveragePercent,
  blockingCount,
  onScrollToValidation,
}: {
  companyName: string;
  clientName: string | null;
  thesis: string;
  proposalStateLabel: string;
  proposalStateTone: "ready" | "conditional" | "blocked";
  coveragePercent: number;
  blockingCount: number;
  onScrollToValidation: () => void;
}) {
  const toneStyles = {
    ready: "border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200",
    conditional: "border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-200",
    blocked: "border-red-500/30 bg-red-500/5 text-red-800 dark:text-red-200",
  };

  return (
    <section className="space-y-4">
      <div
        className={cn(
          "rounded-xl border px-5 py-4",
          toneStyles[proposalStateTone],
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
          {proposalStateTone === "ready" ? "Proposta pronta" : "Proposta condicional"}
        </p>
        <p className="mt-1 text-sm font-medium">{proposalStateLabel}</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-card px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tese comercial
        </p>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {thesis}
        </p>
        <p className="mt-4 text-xs text-muted-foreground">
          {companyName}
          {clientName ? ` · ${clientName}` : ""}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {blockingCount > 0 && (
          <Button variant="outline" size="sm" onClick={onScrollToValidation}>
            {blockingCount} {blockingCount === 1 ? "decisão pendente" : "decisões pendentes"}
          </Button>
        )}
        <span className="text-xs text-muted-foreground">
          Cobertura diagnóstica: {coveragePercent}%
        </span>
      </div>
    </section>
  );
}

export function BlueprintArchetypeCard({ archetype }: { archetype: BlueprintArchetype }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Arquétipo
          </p>
          <p className="mt-1 text-sm font-semibold">{BLUEPRINT_ARCHETYPE_LABELS[archetype]}</p>
        </div>
        <Badge variant="outline" className="text-[10px]">
          Sugestão Copilot
        </Badge>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {ARCHETYPE_RATIONALE[archetype]}
      </p>
    </div>
  );
}

export function BlueprintNarrativeNav({
  sections,
}: {
  sections: readonly { id: string; step: string; title: string; subtitle: string }[];
}) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="min-w-[120px] shrink-0 rounded-lg border border-border/50 bg-card px-3 py-2 transition-colors hover:bg-muted/40"
        >
          <p className="text-[10px] font-semibold text-muted-foreground">{section.step}</p>
          <p className="text-xs font-semibold">{section.title}</p>
          <p className="text-[10px] text-muted-foreground">{section.subtitle}</p>
        </a>
      ))}
    </nav>
  );
}

export function BlueprintDecisionCard({
  item,
  onReview,
}: {
  item: DecisionItem;
  onReview: () => void;
}) {
  const status = fieldReviewStatus(item.field);
  const value = item.field.value.trim() || "Não definido — revisar com base na reunião.";

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
          <p className="mt-2 text-sm leading-relaxed">{value}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px]">
              Fonte: {EVIDENCE_SOURCE_LABELS[item.field.source]}
            </Badge>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-medium",
                status === "confirmed" ? "text-emerald-600" : "text-amber-600",
              )}
            >
              <StatusDot status={status} />
              {status === "confirmed" ? "Confirmado" : "Revisar"}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="shrink-0 text-xs" onClick={onReview}>
          Revisar
        </Button>
      </div>
    </div>
  );
}

export function BlueprintScopeSection({
  groups,
  onToggleModule,
}: {
  groups: ScopePhaseGroup[];
  onToggleModule: (moduleId: string, selected: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const hasContent = group.selected.length > 0 || group.deferred.length > 0;
        if (!hasContent && group.phase > 1) return null;

        return (
          <div key={group.phase} className="space-y-3">
            <div>
              <p className="text-sm font-semibold">{group.label}</p>
              {group.phase === 1 && (
                <p className="text-xs text-muted-foreground">Entram agora na proposta</p>
              )}
              {group.phase > 1 && (
                <p className="text-xs text-muted-foreground">Fora do escopo inicial</p>
              )}
            </div>

            {group.selected.length > 0 && (
              <ul className="space-y-2">
                {group.selected.map((mod) => (
                  <li
                    key={mod.id}
                    className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm"
                  >
                    <CircleCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="flex-1">{mod.label}</span>
                    <Checkbox
                      checked
                      onCheckedChange={() => onToggleModule(mod.id, false)}
                      aria-label={`Remover ${mod.label} do escopo`}
                    />
                  </li>
                ))}
              </ul>
            )}

            {group.deferred.length > 0 && (
              <ul className="space-y-2">
                {group.deferred.map((mod) => (
                  <li
                    key={mod.id}
                    className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm text-muted-foreground"
                  >
                    <Circle className="h-4 w-4 shrink-0 opacity-40" />
                    <span className="flex-1">{mod.label}</span>
                    <Checkbox
                      checked={false}
                      onCheckedChange={() => onToggleModule(mod.id, true)}
                      aria-label={`Incluir ${mod.label} no escopo`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function BlueprintDeliverablesSection({
  pillars,
  onTogglePillar,
}: {
  pillars: DeliverablePillarSummary[];
  onTogglePillar: (index: number, approved: boolean) => void;
}) {
  if (pillars.length === 0) return null;

  return (
    <div className="space-y-3">
      {pillars.map(({ pillar, index, confirmedCount, reviewCount }) => (
        <Collapsible key={pillar.pillar} defaultOpen={!pillar.approved}>
          <div className="rounded-xl border border-border/60 bg-card">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
              <div>
                <p className="text-sm font-semibold">{pillar.pillar}</p>
                <p className="text-xs text-muted-foreground">
                  {pillar.items.length} entregáveis ·{" "}
                  {pillar.approved
                    ? `${confirmedCount} confirmados`
                    : `${reviewCount} para revisar`}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t border-border/40 px-4 py-3">
              <ul className="mb-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                {pillar.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <label className="flex items-center gap-2 text-xs">
                <Checkbox
                  checked={pillar.approved}
                  onCheckedChange={(v) => onTogglePillar(index, v === true)}
                />
                Confirmar entregáveis desta categoria
              </label>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </div>
  );
}

export function BlueprintAssumptionGroups({
  blocking,
  validate,
  hypothesis,
  onToggle,
}: {
  blocking: { assumption: { text: string; critical: boolean; approved: boolean }; index: number }[];
  validate: { assumption: { text: string; critical: boolean; approved: boolean }; index: number }[];
  hypothesis: { assumption: { text: string; critical: boolean; approved: boolean }; index: number }[];
  onToggle: (index: number, approved: boolean) => void;
}) {
  return (
    <div className="space-y-5">
      {blocking.length > 0 && (
        <AssumptionGroup
          title="Bloqueia proposta"
          tone="blocking"
          items={blocking}
          onToggle={onToggle}
        />
      )}
      {validate.length > 0 && (
        <AssumptionGroup
          title="Precisa validar"
          tone="validate"
          items={validate}
          onToggle={onToggle}
        />
      )}
      {hypothesis.length > 0 && (
        <AssumptionGroup
          title="Pode seguir como hipótese"
          tone="hypothesis"
          items={hypothesis}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}

function AssumptionGroup({
  title,
  tone,
  items,
  onToggle,
}: {
  title: string;
  tone: "blocking" | "validate" | "hypothesis";
  items: { assumption: { text: string; approved: boolean }; index: number }[];
  onToggle: (index: number, approved: boolean) => void;
}) {
  const toneStyles = {
    blocking: "border-red-500/20 bg-red-500/5",
    validate: "border-amber-500/20 bg-amber-500/5",
    hypothesis: "border-border/40 bg-muted/20",
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map(({ assumption, index }) => (
          <li
            key={`${assumption.text}-${index}`}
            className={cn("flex items-start gap-3 rounded-lg border px-3 py-2.5", toneStyles[tone])}
          >
            <Checkbox
              checked={assumption.approved}
              onCheckedChange={(v) => onToggle(index, v === true)}
              className="mt-0.5"
            />
            <p className="text-sm leading-relaxed">{assumption.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlueprintFieldEditorSheet({
  open,
  onOpenChange,
  title,
  field,
  onChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  field: BlueprintField;
  onChange: (next: BlueprintField) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Fechar"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l bg-background shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <p className="text-sm font-semibold">{title}</p>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <textarea
            value={field.value}
            onChange={(e) => onChange({ ...field, value: e.target.value })}
            rows={6}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={field.approved}
              onCheckedChange={(v) => onChange({ ...field, approved: v === true })}
            />
            Confirmar decisão
          </label>
          <p className="text-xs text-muted-foreground">
            Fonte: {EVIDENCE_SOURCE_LABELS[field.source]}
          </p>
        </div>
      </div>
    </div>
  );
}
