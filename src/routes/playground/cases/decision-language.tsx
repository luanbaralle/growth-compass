import { DecisionLanguageShowcase } from "@/components/cases/premium/decision/DecisionLanguageShowcase";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/playground/cases/decision-language")({
  component: DecisionLanguageRoute,
  head: () => ({
    meta: [{ title: "Playground · Decision Language" }],
  }),
});

function DecisionLanguageRoute() {
  return <DecisionLanguageShowcase />;
}
