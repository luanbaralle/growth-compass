import { createFileRoute } from "@tanstack/react-router";
import { ProgramaDeCrescimentoPage } from "@/components/marketing/ProgramaDeCrescimentoPage";
import { programaSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/programa-de-crescimento")({
  head: () => programaSeoHead(),
  component: ProgramaDeCrescimentoPage,
});
