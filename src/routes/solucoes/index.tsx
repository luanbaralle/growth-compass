import { createFileRoute } from "@tanstack/react-router";
import { SolucoesPage } from "@/components/marketing/SolucoesPage";
import { solucoesSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/solucoes/")({
  head: () => solucoesSeoHead(),
  component: SolucoesPage,
});
