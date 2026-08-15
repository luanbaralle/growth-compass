import { ClientEmptyState } from "@/client/components/ClientEmptyState";
import { ClientKpiCard } from "@/client/components/ClientKpiCard";
import { ClientPageHeader } from "@/client/components/ClientPageHeader";
import { ClientPageSkeleton } from "@/client/components/ClientPageSkeleton";
import { ClientSection } from "@/client/components/ClientSection";
import { formatDelta } from "@/client/components/client-utils";
import { getClientResultsOverview } from "@/client/results.functions";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatMoney, formatPercent } from "@/domains/marketing/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Megaphone, Sparkles, Target, TrendingUp, Users, Wallet } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  leads: {
    label: "Leads",
    color: "oklch(0.72 0.19 48)",
  },
};

function DeltaCell({ value }: { value: number | null }) {
  if (value == null) return <span className="text-muted-foreground">—</span>;
  return (
    <span
      className={cn(
        "font-semibold tabular-nums",
        value > 0 ? "text-emerald-400" : value < 0 ? "text-rose-400" : "text-muted-foreground",
      )}
    >
      {formatDelta(value)}
    </span>
  );
}

export function ClientResultadosPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["client-results"],
    queryFn: () => getClientResultsOverview(),
  });

  if (isLoading) {
    return <ClientPageSkeleton />;
  }

  if (!data) {
    return (
      <ClientEmptyState
        icon={BarChart3}
        title="Não foi possível carregar"
        description="Tente atualizar a página. Se o problema persistir, fale com a Raise One."
      />
    );
  }

  return (
    <div className="client-page space-y-6">
      <ClientPageHeader
        eyebrow="Performance de marketing"
        title="Resultados"
        description={`Visão consolidada da operação · ${data.periodLabel}`}
      />

      {!data.hasData && (
        <ClientEmptyState
          icon={BarChart3}
          title="Resultados em preparação"
          description="Ainda não há dados cadastrados para este período. Assim que houver métricas disponíveis, elas aparecem aqui."
        />
      )}

      <div className="client-kpi-grid">
        <ClientKpiCard
          label="Investimento"
          icon={Wallet}
          value={formatMoney(data.summary.investmentCents)}
        />
        <ClientKpiCard label="Leads" icon={Users} value={String(data.summary.leads)} />
        <ClientKpiCard
          label="Conversões"
          icon={TrendingUp}
          value={String(data.summary.conversions)}
        />
        <ClientKpiCard
          label="CPL"
          icon={Target}
          value={data.summary.cplCents != null ? formatMoney(data.summary.cplCents) : "—"}
        />
      </div>

      <ClientSection title="Comparativo mensal" icon={BarChart3}>
        <div className="client-data-table-wrap">
          <table className="client-data-table">
            <thead>
              <tr>
                <th>Métrica</th>
                <th className="capitalize">{data.previousPeriodLabel}</th>
                <th className="capitalize">{data.periodLabel}</th>
                <th className="text-right">Variação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Leads</td>
                <td className="tabular-nums">{data.comparison.leads.previous}</td>
                <td className="tabular-nums">{data.comparison.leads.current}</td>
                <td className="text-right">
                  <DeltaCell value={data.comparison.leads.deltaPct} />
                </td>
              </tr>
              <tr>
                <td>Investimento</td>
                <td className="tabular-nums">
                  {formatMoney(data.comparison.investment.previous)}
                </td>
                <td className="tabular-nums">
                  {formatMoney(data.comparison.investment.current)}
                </td>
                <td className="text-right">
                  <DeltaCell value={data.comparison.investment.deltaPct} />
                </td>
              </tr>
              <tr>
                <td>CPL</td>
                <td className="tabular-nums">
                  {data.comparison.cpl.previous != null
                    ? formatMoney(data.comparison.cpl.previous)
                    : "—"}
                </td>
                <td className="tabular-nums">
                  {data.comparison.cpl.current != null
                    ? formatMoney(data.comparison.cpl.current)
                    : "—"}
                </td>
                <td className="text-right">
                  <DeltaCell value={data.comparison.cpl.deltaPct} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ClientSection>

      <ClientSection title="Evolução de leads" icon={TrendingUp}>
        <ChartContainer config={chartConfig} className="aspect-[16/7] min-h-[240px] w-full">
          <BarChart data={data.leadsTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "oklch(0.62 0.01 60)", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={32}
              tick={{ fill: "oklch(0.62 0.01 60)", fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="leads" fill="var(--color-leads)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </ClientSection>

      <section className="grid gap-4 lg:grid-cols-2">
        {data.channels.map((channel) => (
          <ClientSection key={channel.channel} title={channel.label} icon={Megaphone}>
            {channel.periodLabel ? (
              <p className="-mt-2 mb-3 text-xs text-muted-foreground">{channel.periodLabel}</p>
            ) : null}
            {channel.hasData ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                <ChannelMetric label="Investimento" value={formatMoney(channel.investmentCents)} />
                <ChannelMetric label="Leads" value={String(channel.leads)} />
                <ChannelMetric label="Conversões" value={String(channel.conversions)} />
                <ChannelMetric
                  label="CPL"
                  value={channel.cplCents != null ? formatMoney(channel.cplCents) : "—"}
                />
                <ChannelMetric
                  label="CTR"
                  value={channel.ctr != null ? formatPercent(channel.ctr) : "—"}
                />
              </ul>
            ) : (
              <ClientEmptyState
                compact
                icon={Megaphone}
                title="Sem dados neste período"
                description="Quando houver investimento neste canal, os números aparecem aqui."
              />
            )}
          </ClientSection>
        ))}
      </section>

      {data.monthReport.highlight && (
        <ClientSection
          featured
          title={`Seu mês · ${data.monthReport.periodLabel}`}
          icon={Sparkles}
        >
          <p className="text-sm leading-relaxed text-foreground/90">{data.monthReport.highlight}</p>
          {data.monthReport.nextFocus && (
            <div className="client-focus-card mt-4">
              <p className="client-focus-label">Próximo foco</p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                {data.monthReport.nextFocus}
              </p>
            </div>
          )}
        </ClientSection>
      )}
    </div>
  );
}

function ChannelMetric({ label, value }: { label: string; value: string }) {
  return (
    <li className="client-channel-metric">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold tabular-nums">{value}</p>
    </li>
  );
}
