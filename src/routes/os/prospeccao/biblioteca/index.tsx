import { createFileRoute } from "@tanstack/react-router";
import { CommercialLibraryPage } from "@/domains/prospection/components/CommercialLibraryPage";

export const Route = createFileRoute("/os/prospeccao/biblioteca/")({
  component: CommercialLibraryPage,
});
