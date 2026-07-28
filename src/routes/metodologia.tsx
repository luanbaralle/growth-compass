import { createFileRoute } from "@tanstack/react-router";
import { MetodologiaPage } from "@/components/marketing/MetodologiaPage";
import { metodologiaSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/metodologia")({
  head: () => metodologiaSeoHead(),
  component: MetodologiaPage,
});
