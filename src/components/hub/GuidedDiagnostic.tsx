import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Loader2, Search } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import type { BusinessMatch } from "@/config/microverticals/types";
import type { BrazilCity } from "@/data/brazil-cities";
import { matchBusiness } from "@/lib/business-match";
import { BusinessInput } from "./BusinessInput";
import { CityAutocomplete } from "./CityAutocomplete";
import { BusinessSuggestions } from "./BusinessSuggestions";

type Step = "form" | "loading" | "result";

interface GuidedDiagnosticProps {
  variant?: "default" | "home";
}

export function GuidedDiagnostic({ variant = "default" }: GuidedDiagnosticProps) {
  const isHome = variant === "home";
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("form");
  const [businessInput, setBusinessInput] = useState("");
  const [selectedCity, setSelectedCity] = useState<BrazilCity | null>(null);
  const [cityError, setCityError] = useState("");
  const [businessMatch, setBusinessMatch] = useState<BusinessMatch | null>(null);
  const [searchPreview, setSearchPreview] = useState<string[]>([]);

  useEffect(() => {
    if (step !== "loading") return;
    const timer = setTimeout(() => setStep("result"), 2200);
    return () => clearTimeout(timer);
  }, [step]);

  const handleAnalyze = (e: FormEvent) => {
    e.preventDefault();
    const business = businessInput.trim();
    if (!business) return;

    if (!selectedCity) {
      setCityError("Selecione uma cidade da lista para continuar.");
      return;
    }

    setCityError("");
    const match = matchBusiness(business);
    const previews = match.searchExamples(selectedCity.name).slice(0, 4);

    setBusinessMatch(match);
    setSearchPreview(previews);
    setStep("loading");
  };

  const handleViewAnalysis = () => {
    if (!businessMatch || !selectedCity) return;
    navigate({
      to: "/$segment",
      params: { segment: businessMatch.templateSlug },
      search: {
        cidade: selectedCity.name,
        uf: selectedCity.state,
        negocio: businessMatch.userTerm,
      },
    });
  };

  const resetForm = () => {
    setStep("form");
    setBusinessMatch(null);
    setSearchPreview([]);
  };

  const cityName = selectedCity?.name ?? "";
  const businessLabel = businessMatch?.displayLabel ?? "";

  return (
    <section
      id="diagnostico"
      className={
        isHome
          ? "relative border-t border-border/60 bg-surface/20 pb-16 sm:pb-24"
          : "relative border-t border-border/60 bg-surface/20"
      }
    >
      <div
        className={
          isHome
            ? "mx-auto max-w-5xl px-5 sm:px-8"
            : "mx-auto max-w-xl px-5 py-16 sm:px-8 sm:py-24"
        }
      >
        {!isHome && (
          <div className="mb-8 text-center">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand">
              <span className="h-px w-6 bg-brand" />
              Diagnóstico
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Descubra sua oportunidade de mercado
            </h2>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-background/80 shadow-2xl backdrop-blur-xl">
          {step === "form" && (
            <form
              onSubmit={handleAnalyze}
              className={
                isHome
                  ? "grid gap-4 p-4 sm:p-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end"
                  : "space-y-6 p-6 sm:p-8"
              }
            >
              <div>
                <label
                  htmlFor="business-input"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  O que sua empresa vende?
                </label>
                <BusinessInput
                  id="business-input"
                  value={businessInput}
                  onChange={setBusinessInput}
                />
                {!isHome && (
                  <BusinessSuggestions value={businessInput} onSelect={setBusinessInput} />
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Em qual cidade você atende?
                </label>
                <CityAutocomplete
                  value={selectedCity}
                  onChange={(city) => {
                    setSelectedCity(city);
                    if (city) setCityError("");
                  }}
                  error={cityError}
                />
              </div>

              <button
                type="submit"
                disabled={!businessInput.trim()}
                className={
                  isHome
                    ? "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand transition-all hover:scale-[1.01] disabled:opacity-50 lg:w-auto lg:whitespace-nowrap"
                    : "group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand transition-all hover:scale-[1.01] disabled:opacity-50"
                }
              >
                {isHome ? "Analisar meu mercado gratuitamente" : "Analisar meu mercado"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          )}

          {step === "loading" && businessMatch && selectedCity && (
            <div className="space-y-4 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-soft px-3 py-2 text-sm font-medium text-brand">
                <Check className="h-4 w-4" strokeWidth={2.5} />
                {businessLabel} · {cityName}
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-brand" />
                <p className="text-sm text-muted-foreground">
                  Analisando oportunidades para {businessMatch.userTerm} em {cityName}...
                </p>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-surface-elevated">
                <div
                  className="h-full animate-flow rounded-full bg-brand"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
          )}

          {step === "result" && businessMatch && selectedCity && (
            <div className="space-y-5 p-6 sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-soft px-3 py-2 text-sm font-medium text-brand">
                <Check className="h-4 w-4" strokeWidth={2.5} />
                {businessLabel} · {cityName}
              </div>

              <div>
                <p className="text-lg font-semibold text-brand">
                  Identificamos demanda ativa na sua região.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Termos que pessoas em{" "}
                  <span className="text-foreground">{cityName}</span> costumam pesquisar:
                </p>
              </div>

              <ul className="space-y-2">
                {searchPreview.map((term) => (
                  <li
                    key={term}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface/60 px-4 py-3 text-sm"
                  >
                    <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="font-mono text-foreground">{term}</span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-muted-foreground">
                Vamos mostrar como negócios semelhantes estão capturando essa demanda.
              </p>

              <button
                type="button"
                onClick={handleViewAnalysis}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand transition-all hover:scale-[1.01]"
              >
                Ver análise completa
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Fazer nova análise
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
