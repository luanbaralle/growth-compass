import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Raise One — Marketing, Tecnologia e Crescimento",
      },
      {
        name: "description",
        content:
          "Construímos o próximo passo do crescimento da sua empresa. Estratégia, tecnologia e execução — do marketing à plataforma.",
      },
      {
        property: "og:title",
        content: "Raise One — Marketing, Tecnologia e Crescimento",
      },
      {
        property: "og:description",
        content:
          "Parceiros de crescimento digital. Google Ads, conteúdo, IA, automações, portais e soluções sob medida.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});
