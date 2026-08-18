"use client";

import type { ProposalSimulatorDefaults } from "../types";
import { formatCentsBRL } from "../pricing/r1-pricing";
import { useMemo, useState } from "react";

function centsToInput(cents: number): string {
  return String(Math.round(cents / 100));
}

function inputToCents(value: string): number {
  const n = Number(value.replace(/\D/g, ""));
  return Number.isFinite(n) ? n * 100 : 0;
}

export function ProposalInvestmentSimulator({
  defaults,
}: {
  defaults: ProposalSimulatorDefaults;
}) {
  const [mediaBudgetCents, setMediaBudgetCents] = useState(defaults.mediaBudgetCents);
  const [cpcCents, setCpcCents] = useState(defaults.cpcCents);
  const [leadRatePercent, setLeadRatePercent] = useState(defaults.leadRatePercent);
  const [conversionRatePercent, setConversionRatePercent] = useState(defaults.conversionRatePercent);
  const [ltvCents, setLtvCents] = useState(defaults.ltvCents);

  const calc = useMemo(() => {
    const clicks = cpcCents > 0 ? Math.floor(mediaBudgetCents / cpcCents) : 0;
    const leads = Math.round(clicks * (leadRatePercent / 100));
    const conversions = Math.round(leads * (conversionRatePercent / 100));
    const cplCents = leads > 0 ? Math.round(mediaBudgetCents / leads) : 0;
    const cpaCents = conversions > 0 ? Math.round(mediaBudgetCents / conversions) : 0;
    const returnCents = conversions * ltvCents;
    return { clicks, leads, conversions, cplCents, cpaCents, returnCents };
  }, [mediaBudgetCents, cpcCents, leadRatePercent, conversionRatePercent, ltvCents]);

  return (
    <div className="mt-6 space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <p className="text-xs text-white/45">
        Cenário ilustrativo — CPC, CPL e CPA reais só emergem testando no mercado.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field
          label="Investimento em mídia (R$/mês)"
          value={centsToInput(mediaBudgetCents)}
          onChange={(v) => setMediaBudgetCents(inputToCents(v))}
        />
        <Field
          label="CPC estimado (R$)"
          value={(cpcCents / 100).toFixed(2).replace(".", ",")}
          onChange={(v) => setCpcCents(Math.round(Number(v.replace(",", ".")) * 100) || 0)}
        />
        <Field
          label="Taxa clique → lead (%)"
          value={String(leadRatePercent)}
          onChange={(v) => setLeadRatePercent(Number(v) || 0)}
        />
        <Field
          label="Taxa de conversão (%)"
          value={String(conversionRatePercent)}
          onChange={(v) => setConversionRatePercent(Number(v) || 0)}
        />
        <Field
          label="LTV por cliente (R$)"
          value={centsToInput(ltvCents)}
          onChange={(v) => setLtvCents(inputToCents(v))}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Cliques" value={String(calc.clicks)} />
        <Stat label="Leads" value={String(calc.leads)} />
        <Stat label="Conversões" value={String(calc.conversions)} highlight />
        <Stat label="CPL" value={calc.cplCents ? formatCentsBRL(calc.cplCents) : "—"} />
        <Stat label="CPA" value={calc.cpaCents ? formatCentsBRL(calc.cpaCents) : "—"} />
      </div>

      {calc.conversions > 0 && (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90">
          Retorno ilustrativo: {formatCentsBRL(calc.returnCents)} ({calc.conversions} conversões ×{" "}
          {formatCentsBRL(ltvCents)} LTV) — projeção, não garantia.
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-wide text-white/45">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/40"
      />
    </label>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={
        highlight
          ? "rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3"
          : "rounded-xl border border-white/8 bg-black/20 px-4 py-3"
      }
    >
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
