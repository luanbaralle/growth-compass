import { createFileRoute } from "@tanstack/react-router";
import { ClientConteudoPage } from "@/client/pages/ClientContentPage";

export const Route = createFileRoute("/client/conteudo/")({
  component: ClientConteudoPage,
});
