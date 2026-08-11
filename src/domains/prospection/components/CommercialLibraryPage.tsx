import { SEGMENT_OPTIONS } from "@/domains/prospection/copilot/types";
import { getSegmentCopilot } from "@/domains/prospection/copilot/data";
import { EmptyState, PageHeader, OSPage } from "@/os/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";

/** Visão do copilot — conteúdo operacional vive no Assistente de Conversa de cada prospect. */
export function CommercialLibraryPage() {
  return (
    <OSPage>
      <PageHeader
        title="Copilot de Prospecção"
        description="Componentes por segmento — usados no Assistente de Conversa"
        icon={Sparkles}
        actions={
          <Link to="/os/prospeccao" className="dashboard-btn-ghost">
            <ArrowLeft className="h-4 w-4" />
            Pipeline
          </Link>
        }
      />

      <EmptyState
        title="A biblioteca agora acompanha o vendedor"
        description="Abra qualquer prospect no pipeline. O Assistente de Conversa guia observação → abertura → resposta → continuidade em poucos cliques."
      />

      <div>
        <Link to="/os/prospeccao" className="dashboard-btn-primary inline-flex">
          Ir para o pipeline
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SEGMENT_OPTIONS.map((s) => {
          const copilot = getSegmentCopilot(s.slug);
          return (
            <div key={s.slug} className="os-option-card">
              <p className="font-medium text-foreground/90">{s.name}</p>
              <ul className="mt-2.5 space-y-1 text-xs text-muted-foreground/70">
                <li>{copilot.observations.length} observações</li>
                <li>{copilot.openings.length} aberturas</li>
                <li>{copilot.responseStates.length} respostas</li>
              </ul>
            </div>
          );
        })}
      </div>
    </OSPage>
  );
}
