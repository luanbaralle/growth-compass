import {
  approveBlueprint,
  generateProposalFromBlueprint,
  getBlueprintById,
  updateBlueprint,
} from "@/domains/proposals/api.server";
import {
  buildCommercialThesis,
  categorizeAssumptions,
  collectDecisionItems,
  computeApprovalState,
  groupScopeByPhase,
  STUDIO_SECTIONS,
  summarizeDeliverablePillars,
} from "@/domains/proposals/blueprint/blueprint-studio-view";
import {
  BLUEPRINT_ARCHETYPE_LABELS,
  BLUEPRINT_STATUS_LABELS,
  type BlueprintField,
  type CommercialBlueprintData,
} from "@/domains/proposals/blueprint/types";
import {
  BlueprintArchetypeCard,
  BlueprintAssumptionGroups,
  BlueprintDecisionCard,
  BlueprintDeliverablesSection,
  BlueprintFieldEditorSheet,
  BlueprintNarrativeNav,
  BlueprintScopeSection,
  BlueprintThesisHero,
} from "@/domains/proposals/components/blueprint/BlueprintStudioSections";
import { getErrorMessage } from "@/lib/api/client-errors";
import { OSPage, PageSkeleton } from "@/os/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Save,
  ScrollText,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type EditingField =
  | { kind: "decision"; path: string; label: string; field: BlueprintField }
  | null;

function updateFieldInData(
  data: CommercialBlueprintData,
  path: string,
  field: BlueprintField,
): CommercialBlueprintData {
  const next = structuredClone(data);
  const parts = path.split(".");

  if (parts[0] === "diagnosis" && parts[1]) {
    (next.diagnosis as Record<string, BlueprintField>)[parts[1]] = field;
  } else if (parts[0] === "strategy" && parts[1] === "priority1") {
    next.strategy.priority1 = field;
  }

  return next;
}

export function BlueprintStudioPage({ blueprintId }: { blueprintId: string }) {
  const navigate = useNavigate();
  const validationRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [blueprint, setBlueprint] = useState<Awaited<ReturnType<typeof getBlueprintById>> | null>(
    null,
  );
  const [data, setData] = useState<CommercialBlueprintData | null>(null);
  const [editing, setEditing] = useState<EditingField>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const row = await getBlueprintById({ data: { id: blueprintId } });
      setBlueprint(row);
      setData(row.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar blueprint."));
    } finally {
      setLoading(false);
    }
  }, [blueprintId]);

  useEffect(() => {
    void load();
  }, [load]);

  const view = useMemo(() => {
    if (!blueprint || !data) return null;

    const approval = computeApprovalState(data, blueprint.readiness);
    const thesis = buildCommercialThesis(data, blueprint.company_name);
    const decisions = collectDecisionItems(data);
    const scopeGroups = groupScopeByPhase(blueprint.archetype, data.modules);
    const pillarSummaries = summarizeDeliverablePillars(data.deliverables);
    const categorized = categorizeAssumptions(data);

    return {
      approval,
      thesis,
      decisions,
      scopeGroups,
      pillarSummaries,
      blockingAssumptions: categorized.filter((c) => c.category === "blocking"),
      validateAssumptions: categorized.filter((c) => c.category === "validate"),
      hypothesisAssumptions: categorized.filter((c) => c.category === "hypothesis"),
    };
  }, [blueprint, data]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const updated = await updateBlueprint({
        data: { id: blueprintId, blueprint: data as unknown as Record<string, unknown> },
      });
      setBlueprint(updated);
      setData(updated.data);
      toast.success("Blueprint salvo.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao salvar."));
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!view?.approval.canApprove) {
      validationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      toast.error("Resolva as decisões bloqueantes antes de aprovar.");
      return;
    }

    setApproving(true);
    try {
      if (data) {
        await updateBlueprint({
          data: { id: blueprintId, blueprint: data as unknown as Record<string, unknown> },
        });
      }
      const result = await approveBlueprint({ data: { id: blueprintId } });
      setBlueprint(result.blueprint);
      setData(result.blueprint.data);
      toast.success("Blueprint aprovado e proposta gerada.");
      await navigate({ to: "/os/propostas/$id", params: { id: result.proposal.id } });
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao aprovar blueprint."));
    } finally {
      setApproving(false);
    }
  };

  const handleOpenProposal = async () => {
    if (blueprint?.proposal_id) {
      await navigate({ to: "/os/propostas/$id", params: { id: blueprint.proposal_id } });
      return;
    }
    setGenerating(true);
    try {
      const proposal = await generateProposalFromBlueprint({ data: { id: blueprintId } });
      toast.success("Proposta gerada.");
      await navigate({ to: "/os/propostas/$id", params: { id: proposal.id } });
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao gerar proposta."));
    } finally {
      setGenerating(false);
    }
  };

  const scrollToValidation = () => {
    validationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading || !blueprint || !data || !view) return <PageSkeleton />;

  const isApproved = blueprint.status === "approved";

  return (
    <OSPage>
      <header className="mb-8 space-y-4">
        <div className="flex flex-wrap items-start gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link
              to="/os/copilot/$sessionId"
              params={{ sessionId: blueprint.copilot_session_id }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold">Blueprint Comercial</h1>
            <p className="text-sm text-muted-foreground">
              {blueprint.company_name}
              {blueprint.client_name ? ` · ${blueprint.client_name}` : ""} · v
              {blueprint.version}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{BLUEPRINT_STATUS_LABELS[blueprint.status]}</Badge>
            <Badge variant="outline">{BLUEPRINT_ARCHETYPE_LABELS[blueprint.archetype]}</Badge>
          </div>
        </div>

        <BlueprintThesisHero
          companyName={blueprint.company_name}
          clientName={blueprint.client_name}
          thesis={view.thesis}
          proposalStateLabel={view.approval.proposalStateLabel}
          proposalStateTone={view.approval.proposalStateTone}
          coveragePercent={blueprint.readiness.coveragePercent}
          blockingCount={view.approval.blockingCount}
          onScrollToValidation={scrollToValidation}
        />

        <BlueprintArchetypeCard archetype={blueprint.archetype} />

        <BlueprintNarrativeNav sections={STUDIO_SECTIONS} />
      </header>

      <div className="space-y-10 pb-28">
        <section id="diagnosis" className="scroll-mt-24 space-y-4">
          <SectionHeading
            step="01"
            title="Diagnóstico"
            subtitle="O que entendemos da reunião"
          />
          <div className="grid gap-3 md:grid-cols-2">
            {view.decisions
              .filter((d) =>
                ["problem", "objective", "constraint", "opportunity"].includes(d.id),
              )
              .map((item) => (
                <BlueprintDecisionCard
                  key={item.id}
                  item={item}
                  onReview={() =>
                    setEditing({
                      kind: "decision",
                      path: item.path,
                      label: item.label,
                      field: item.field,
                    })
                  }
                />
              ))}
          </div>
        </section>

        <section id="decision" className="scroll-mt-24 space-y-4">
          <SectionHeading
            step="02"
            title="Decisão"
            subtitle="O que vamos fazer na Fase 1"
          />
          <BlueprintDecisionCard
            item={view.decisions.find((d) => d.id === "strategy")!}
            onReview={() => {
              const item = view.decisions.find((d) => d.id === "strategy")!;
              setEditing({
                kind: "decision",
                path: item.path,
                label: item.label,
                field: item.field,
              });
            }}
          />
          {data.solution.phase1.value.trim() && (
            <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground">Fase 1</p>
              <p className="mt-1 text-sm">{data.solution.phase1.value}</p>
            </div>
          )}
        </section>

        <section id="scope" className="scroll-mt-24 space-y-4">
          <SectionHeading
            step="03"
            title="Escopo"
            subtitle="O que estamos propondo vender"
          />
          <BlueprintScopeSection
            groups={view.scopeGroups}
            onToggleModule={(moduleId, selected) => {
              const modules = selected
                ? [...data.modules, moduleId]
                : data.modules.filter((id) => id !== moduleId);
              setData({ ...data, modules });
            }}
          />

          {data.exclusions.length > 0 && (
            <div className="rounded-xl border border-dashed border-border/60 px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground">Fora do escopo inicial</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                {data.exclusions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm font-semibold">Entregáveis por categoria</p>
            <BlueprintDeliverablesSection
              pillars={view.pillarSummaries}
              onTogglePillar={(index, approved) => {
                const deliverables = [...data.deliverables];
                deliverables[index] = { ...deliverables[index], approved };
                setData({ ...data, deliverables });
              }}
            />
          </div>
        </section>

        <section id="investment" className="scroll-mt-24 space-y-4">
          <SectionHeading step="04" title="Investimento" subtitle="Quanto custa" />
          <div className="rounded-xl border border-border/60 bg-card px-5 py-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <InvestmentLine label="Setup" value={data.investment.setupLabel} />
              <InvestmentLine label="Mídia" value={data.investment.mediaLabel} />
              <InvestmentLine label="Gestão" value={data.investment.managementLabel} />
            </div>
            <label className="mt-4 flex items-center gap-2 border-t border-border/40 pt-4 text-sm">
              <Checkbox
                checked={data.investment.approved}
                disabled={isApproved}
                onCheckedChange={(v) =>
                  setData({
                    ...data,
                    investment: { ...data.investment, approved: v === true },
                  })
                }
              />
              Confirmar investimento comercial
            </label>
          </div>
        </section>

        <section ref={validationRef} id="validation" className="scroll-mt-24 space-y-4">
          <SectionHeading
            step="05"
            title="Validação"
            subtitle="O que ainda precisamos decidir"
          />
          {view.blockingAssumptions.length === 0 &&
          view.validateAssumptions.length === 0 &&
          view.hypothesisAssumptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma premissa pendente. Revise investimento e escopo antes de aprovar.
            </p>
          ) : (
            <BlueprintAssumptionGroups
              blocking={view.blockingAssumptions}
              validate={view.validateAssumptions}
              hypothesis={view.hypothesisAssumptions}
              onToggle={(index, approved) => {
                const assumptions = [...data.assumptions];
                assumptions[index] = { ...assumptions[index], approved };
                setData({ ...data, assumptions });
              }}
            />
          )}

          {data.nextDecisions.length > 0 && (
            <div className="rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Próximas decisões com o cliente
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                {data.nextDecisions.slice(0, 6).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section id="proposal" className="scroll-mt-24 space-y-4">
          <SectionHeading step="06" title="Proposta" subtitle="Gerar documento para o cliente" />
          <p className="text-sm text-muted-foreground">
            A proposta pública será renderizada a partir deste blueprint aprovado — diagnóstico,
            escopo, investimento e exclusões refletem as decisões acima.
          </p>
          {blueprint.proposal_id && (
            <Button variant="outline" onClick={() => void handleOpenProposal()}>
              <FileText className="mr-1.5 h-4 w-4" />
              Abrir proposta gerada
            </Button>
          )}
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="text-xs text-muted-foreground">
            {view.approval.canApprove
              ? "Tudo pronto para aprovar."
              : view.approval.proposalStateLabel}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleSave()}
              disabled={saving || isApproved}
            >
              {saving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              Salvar
            </Button>

            {!view.approval.canApprove && !isApproved && (
              <Button variant="secondary" size="sm" onClick={scrollToValidation}>
                <ScrollText className="mr-1.5 h-4 w-4" />
                Revisar pendências
              </Button>
            )}

            {!isApproved && (
              <Button
                size="sm"
                onClick={() => void handleApprove()}
                disabled={approving || !view.approval.canApprove}
              >
                {approving ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                )}
                Aprovar e gerar proposta
              </Button>
            )}

            {isApproved && (
              <Button size="sm" onClick={() => void handleOpenProposal()} disabled={generating}>
                {generating ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-1.5 h-4 w-4" />
                )}
                Abrir proposta
              </Button>
            )}
          </div>
        </div>
      </footer>

      {editing?.kind === "decision" && (
        <BlueprintFieldEditorSheet
          open
          onOpenChange={(open) => !open && setEditing(null)}
          title={editing.label}
          field={editing.field}
          onChange={(field) => {
            setData(updateFieldInData(data, editing.path, field));
            setEditing({ ...editing, field });
          }}
        />
      )}
    </OSPage>
  );
}

function SectionHeading({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {step}
      </p>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function InvestmentLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/30 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
