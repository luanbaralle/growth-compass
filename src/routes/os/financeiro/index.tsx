import { createFileRoute } from "@tanstack/react-router";
import { FinanceListPage } from "@/domains/finance/components/FinanceListPage";

export const Route = createFileRoute("/os/financeiro/")({
  component: FinanceListPage,
});
