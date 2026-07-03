import { PageHeader } from "@/components/admin/ui-kit";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

const RITUALS = [
  {
    to: "/admin/execucao/rituais/planning",
    title: "Planning semanal",
    day: "Segunda",
    duration: "30 min",
    icon: ClipboardList,
    description: "3 prioridades, bloqueios, fila de edição",
  },
  {
    to: "/admin/execucao/rituais/checkin",
    title: "Check-in operacional",
    day: "Quarta",
    duration: "15 min",
    icon: MessageSquare,
    description: "Fila, atrasos, fora de escopo, editor",
  },
  {
    to: "/admin/execucao/rituais/review",
    title: "Review + métricas",
    day: "Sexta",
    duration: "30 min",
    icon: BarChart3,
    description: "O que fechou, métricas, próxima semana",
  },
] as const;

export function RituaisHubPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Rituais"
        description="Cadência do time — documentação morre sem hábito"
        icon={CalendarCheck}
      />

      <ul className="space-y-3">
        {RITUALS.map((ritual) => (
          <li key={ritual.to}>
            <Link
              to={ritual.to}
              className="group admin-card flex items-start gap-4 p-5 transition-all hover:border-brand/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/15 transition-colors group-hover:bg-brand/20">
                <ritual.icon className="h-5 w-5 text-brand" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-medium">{ritual.title}</h2>
                  <span className="rounded-full border border-border/60 bg-surface-elevated/50 px-2 py-0.5 text-xs text-muted-foreground">
                    {ritual.day} · {ritual.duration}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{ritual.description}</p>
              </div>
              <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
