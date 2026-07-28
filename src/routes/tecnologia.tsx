import { createFileRoute } from "@tanstack/react-router";
import { TecnologiaPage } from "@/components/marketing/TecnologiaPage";
import { tecnologiaSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/tecnologia")({
  head: () => tecnologiaSeoHead(),
  component: TecnologiaPage,
});
