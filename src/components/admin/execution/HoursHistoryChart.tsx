import type { HoursSnapshot } from "@/lib/execution/hours-types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

const chartConfig = {
  hoursRecovered: {
    label: "Horas recuperadas",
    color: "hsl(var(--chart-1))",
  },
  hoursGoal: {
    label: "Meta",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function HoursHistoryChart({
  history,
  goal,
}: {
  history: HoursSnapshot[];
  goal: number;
}) {
  if (!history.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum snapshot ainda. Salve um Review semanal ou registre manualmente.
      </p>
    );
  }

  const data = [...history]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((h) => ({
      label: h.weekLabel.length > 12 ? h.date.slice(5) : h.weekLabel,
      hoursRecovered: h.hoursRecovered,
      hoursGoal: h.hoursGoal,
      source: h.source,
    }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full">
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ReferenceLine y={goal} stroke="hsl(var(--chart-2))" strokeDasharray="4 4" />
        <Bar dataKey="hoursRecovered" fill="var(--color-hoursRecovered)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
