import { createFileRoute } from "@tanstack/react-router";
import { GabrielFrancaProjectPage } from "./GabrielFrancaProjectPage";

export const Route = createFileRoute("/projetos/gabrielfranca")({
  head: () => ({
    meta: [
      {
        title: "Projetos | Gabriel Franca | Raise One",
      },
      {
        name: "description",
        content:
          "Acompanhe a evolução da plataforma premium de geração de leads para Gabriel Franca e empreendimentos Frizon.",
      },
      {
        property: "og:title",
        content: "Projeto Gabriel Franca | Raise One",
      },
      {
        property: "og:description",
        content:
          "Timeline, escopo, materiais, arquitetura e roadmap da plataforma premium de geração de leads para empreendimentos Frizon.",
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
  component: GabrielFrancaProjectPage,
});
