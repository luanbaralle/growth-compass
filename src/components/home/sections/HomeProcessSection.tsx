import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { processSteps } from "@/lib/home/content";
import { ProcessScrollSection } from "./ProcessScrollSection";

export function HomeProcessSection() {
  return (
    <ProcessScrollSection
      id="processo"
      eyebrow="Processo"
      title="Como trabalhamos"
      description="Um processo claro, do diagnóstico à escala — para crescer com consistência."
      steps={processSteps}
      headerExtra={
        <Link
          to="/metodologia"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
        >
          Conhecer a metodologia completa
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    />
  );
}
