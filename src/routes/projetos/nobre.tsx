import { createFileRoute } from "@tanstack/react-router";
import { NobreArchivedPage } from "@/_archived/projetos/nobre/NobreArchivedPage";

export const Route = createFileRoute("/projetos/nobre")({
  head: () => ({
    meta: [
      { title: "Arquivado | Nobre Imóveis × Raise One" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "description",
        content: "Esta proposta comercial foi arquivada e não está mais disponível.",
      },
    ],
  }),
  component: NobreArchivedPage,
});
