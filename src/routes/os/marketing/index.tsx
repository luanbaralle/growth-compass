import { createFileRoute } from "@tanstack/react-router";
import { MarketingListPage } from "@/domains/marketing/components/MarketingListPage";

export const Route = createFileRoute("/os/marketing/")({
  component: MarketingListPage,
});
