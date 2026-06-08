import { createFileRoute } from "@tanstack/react-router";
import { HubPage } from "@/components/hub/HubPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Raise One — Seu negócio deveria estar recebendo mais clientes",
      },
      {
        name: "description",
        content:
          "Descubra se você está capturando a demanda do seu mercado ou deixando clientes para seus concorrentes. Análise gratuita para negócios locais.",
      },
      {
        property: "og:title",
        content: "Raise One — Especialistas em crescimento para negócios locais",
      },
      {
        property: "og:description",
        content:
          "Todos os dias pessoas pesquisam no Google por serviços que empresas como a sua oferecem. Descubra se você está capturando essa demanda.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HubPage,
});
