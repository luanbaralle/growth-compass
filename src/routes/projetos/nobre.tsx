import { createFileRoute } from "@tanstack/react-router";
import { NobreProjectPage } from "@/components/projects/NobreProjectPage";

export const Route = createFileRoute("/projetos/nobre")({
  head: () => ({
    meta: [
      {
        title: "Proposta Comercial | Sistema de Atualização de Proprietários | Nobre Imóveis",
      },
      {
        name: "description",
        content:
          "Proposta executiva de desenvolvimento: sistema integrado ao Imoview para atualização periódica de proprietários via WhatsApp.",
      },
      {
        property: "og:title",
        content: "Proposta Comercial | Nobre Imóveis × Raise One",
      },
      {
        property: "og:description",
        content:
          "Especificação funcional e proposta de investimento para o Sistema de Atualização Periódica de Proprietários.",
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
  component: NobreProjectPage,
});
