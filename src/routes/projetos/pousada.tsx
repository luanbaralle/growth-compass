import { createFileRoute } from "@tanstack/react-router";
import { PousadaProjectPage } from "@/components/projects/PousadaProjectPage";

export const Route = createFileRoute("/projetos/pousada")({
  head: () => ({
    meta: [
      {
        title: "Projeto Pousada Itanhaem | Raise One",
      },
      {
        name: "description",
        content:
          "Sistema Raise de Captacao de Demanda para hoteis e pousadas. Transforme pesquisas no Google em reservas recorrentes.",
      },
      {
        property: "og:title",
        content: "Projeto de Aquisicao de Reservas | Raise One",
      },
      {
        property: "og:description",
        content:
          "Metodologia completa para transformar demanda do Google em reservas para hoteis e pousadas em Itanhaem.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: PousadaProjectPage,
});
