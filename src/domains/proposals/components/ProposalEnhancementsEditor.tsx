import {
  R1_ACCELERATION_PRICING,
  R1_DEFAULT_SIMULATOR,
} from "../pricing/r1-pricing";
import type { ProposalContent, ProposalPricingTier, ProposalSimulatorDefaults } from "../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProposalEnhancementsEditor({
  content,
  onChange,
  enabled,
}: {
  content: ProposalContent;
  onChange: (content: ProposalContent) => void;
  enabled: boolean;
}) {
  if (!enabled) return null;

  const pricing = content.pricing ?? R1_ACCELERATION_PRICING;
  const simulator = content.simulator ?? R1_DEFAULT_SIMULATOR;

  const updateTier = (id: string, patch: Partial<ProposalPricingTier>) => {
    onChange({
      ...content,
      pricing: pricing.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    });
  };

  const updateSimulator = (patch: Partial<ProposalSimulatorDefaults>) => {
    onChange({ ...content, simulator: { ...simulator, ...patch } });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h2 className="text-sm font-semibold">Preços R1 (seção 08)</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Valores padrão de aceleração — editáveis por proposta.
        </p>
        <div className="mt-4 space-y-5">
          {pricing.map((tier) => (
            <div key={tier.id} className="rounded-lg border border-border/40 p-4">
              <p className="text-xs font-semibold text-muted-foreground">{tier.subtitle}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={tier.name}
                    onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor exibido</Label>
                  <Input
                    value={tier.amountLabel}
                    onChange={(e) => updateTier(tier.id, { amountLabel: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <Label>Itens (um por linha)</Label>
                <Textarea
                  value={tier.items.join("\n")}
                  onChange={(e) =>
                    updateTier(tier.id, {
                      items: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                    })
                  }
                  rows={4}
                />
              </div>
              <div className="mt-3 space-y-2">
                <Label>Nota rodapé</Label>
                <Input
                  value={tier.note ?? ""}
                  onChange={(e) => updateTier(tier.id, { note: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card p-5">
        <h2 className="text-sm font-semibold">Simulador CPL/CPA (seção 07)</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SimField
            label="Mídia mensal (R$)"
            value={String(Math.round(simulator.mediaBudgetCents / 100))}
            onChange={(v) =>
              updateSimulator({ mediaBudgetCents: (Number(v.replace(/\D/g, "")) || 0) * 100 })
            }
          />
          <SimField
            label="CPC (R$)"
            value={(simulator.cpcCents / 100).toFixed(2)}
            onChange={(v) =>
              updateSimulator({ cpcCents: Math.round(Number(v.replace(",", ".")) * 100) || 0 })
            }
          />
          <SimField
            label="Clique → lead (%)"
            value={String(simulator.leadRatePercent)}
            onChange={(v) => updateSimulator({ leadRatePercent: Number(v) || 0 })}
          />
          <SimField
            label="Conversão (%)"
            value={String(simulator.conversionRatePercent)}
            onChange={(v) => updateSimulator({ conversionRatePercent: Number(v) || 0 })}
          />
          <SimField
            label="LTV (R$)"
            value={String(Math.round(simulator.ltvCents / 100))}
            onChange={(v) =>
              updateSimulator({ ltvCents: (Number(v.replace(/\D/g, "")) || 0) * 100 })
            }
          />
        </div>
      </div>
    </div>
  );
}

function SimField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
