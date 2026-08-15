import { createFileRoute } from "@tanstack/react-router";
import { ClientFinanceiroPage } from "@/client/pages/ClientFinancePage";

export const Route = createFileRoute("/client/financeiro/")({
  component: ClientFinanceiroPage,
});
