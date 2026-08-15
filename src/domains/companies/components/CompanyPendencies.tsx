import type { CompanyPendency } from "@/domains/companies/company-pendencies";
import { cn } from "@/lib/utils";
import { Section } from "@/os/ui";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

export function CompanyPendencies({
  pendencies,
  onGoToTab,
}: {
  pendencies: CompanyPendency[];
  onGoToTab: (tab: string) => void;
}) {
  if (pendencies.length === 0) {
    return (
      <Section title="Pendências" description="Itens que precisam de atenção neste cliente">
        <div className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400/80" />
          Nenhuma pendência operacional no momento.
        </div>
      </Section>
    );
  }

  const criticalCount = pendencies.filter((p) => p.urgency === "critical").length;

  return (
    <Section
      title="Pendências"
      description={
        criticalCount > 0
          ? `${criticalCount} crítica(s) · ${pendencies.length} no total`
          : `${pendencies.length} item(ns) para resolver`
      }
    >
      <ul className="divide-y divide-border/40">
        {pendencies.map((pendency) => (
          <li key={pendency.id}>
            <PendencyRow pendency={pendency} onGoToTab={onGoToTab} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function PendencyRow({
  pendency,
  onGoToTab,
}: {
  pendency: CompanyPendency;
  onGoToTab: (tab: string) => void;
}) {
  const content = (
    <>
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          pendency.urgency === "critical"
            ? "bg-red-400/10 text-red-400"
            : "bg-amber-400/10 text-amber-400",
        )}
      >
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{pendency.title}</p>
        <p className="text-xs text-muted-foreground">{pendency.subtitle}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 opacity-40" />
    </>
  );

  const rowClass =
    "flex w-full items-start gap-3 py-3 text-left transition-colors hover:text-brand";

  if (pendency.projectId) {
    return (
      <Link to="/os/projetos/$id" params={{ id: pendency.projectId }} className={rowClass}>
        {content}
      </Link>
    );
  }

  if (pendency.contentTaskId) {
    return (
      <Link to="/os/producao" search={{ task: pendency.contentTaskId }} className={rowClass}>
        {content}
      </Link>
    );
  }

  if (pendency.financeEntryId) {
    return (
      <button type="button" onClick={() => onGoToTab("finance")} className={rowClass}>
        {content}
      </button>
    );
  }

  return <div className={cn(rowClass, "cursor-default")}>{content}</div>;
}
