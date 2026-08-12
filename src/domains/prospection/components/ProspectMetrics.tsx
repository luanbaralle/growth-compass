import type { ProspectionMetrics } from "@/domains/prospection/types";
import { StatCard, OSMetricGrid } from "@/os/ui";
import { MessageSquare, Percent, Target, TrendingUp, Users } from "lucide-react";

export function ProspectMetricsBar({ metrics }: { metrics: ProspectionMetrics }) {
  return (
    <OSMetricGrid columns={5}>
      <StatCard
        label="Prospectados"
        value={String(metrics.prospected)}
        icon={Target}
        accent="brand"
      />
      <StatCard
        label="Mensagens enviadas"
        value={String(metrics.messagesSent)}
        icon={MessageSquare}
        accent="neutral"
      />
      <StatCard
        label="Respostas"
        value={String(metrics.responses)}
        sub={`${metrics.responseRate}% taxa`}
        icon={TrendingUp}
        accent="success"
      />
      <StatCard
        label="Clientes"
        value={String(metrics.clients)}
        sub={`${metrics.conversionRate}% conversão`}
        icon={Users}
        accent="success"
      />
      <StatCard
        label="Propostas"
        value={String(metrics.proposals)}
        sub={`${metrics.diagnosesSent} diagnósticos`}
        icon={Percent}
        accent="warning"
      />
    </OSMetricGrid>
  );
}
