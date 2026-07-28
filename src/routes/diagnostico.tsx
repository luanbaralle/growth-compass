import { createFileRoute } from "@tanstack/react-router";
import { DiagnosticoPage } from "@/components/marketing/DiagnosticoPage";
import { diagnosticoSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/diagnostico")({
  head: () => diagnosticoSeoHead(),
  component: DiagnosticoPage,
});
