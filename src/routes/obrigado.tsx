import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, MessageCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "@/components/landing/shared/Footer";
import { Logo } from "@/components/landing/shared/Logo";
import { getSegment } from "@/config/segments";
import {
  clearLeadSummary,
  readLeadSummary,
  type LeadConfirmationSummary,
} from "@/lib/lead-summary";
import { buildLeadWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type ObrigadoSearch = {
  segment?: string;
  negocio?: string;
  cidade?: string;
  uf?: string;
};

export const Route = createFileRoute("/obrigado")({
  validateSearch: (search: Record<string, unknown>): ObrigadoSearch => ({
    segment: typeof search.segment === "string" ? search.segment : undefined,
    negocio: typeof search.negocio === "string" ? search.negocio : undefined,
    cidade: typeof search.cidade === "string" ? search.cidade : undefined,
    uf: typeof search.uf === "string" ? search.uf : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Raise One — Recebemos sua solicitação" },
      {
        name: "description",
        content:
          "Estamos analisando as oportunidades do seu mercado. Em breve entraremos em contato.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ObrigadoPage,
});

function buildAnalysisItems(summary: LeadConfirmationSummary | null, locationLabel?: string) {
  const city = summary?.city ?? locationLabel ?? "sua região";
  const business = summary?.business;
  const presence = summary?.digitalPresence;

  return [
    {
      title: "Mercado local",
      detail: business
        ? `Demanda e volume de buscas para ${business} em ${city}.`
        : `Oportunidades de demanda em ${city}.`,
    },
    {
      title: "Concorrência",
      detail: business
        ? `Quem aparece hoje quando clientes buscam ${business} na região.`
        : "Posicionamento dos concorrentes que capturam esses cliques.",
    },
    {
      title: "Presença digital",
      detail: presence?.detail ?? "Site, redes sociais e visibilidade no Google.",
    },
    {
      title: "Oportunidades de aquisição",
      detail: "Canais e ações para transformar buscas em clientes recorrentes.",
    },
  ];
}

function ObrigadoPage() {
  const { segment: segmentSlug, negocio, cidade, uf } = Route.useSearch();
  const segment = segmentSlug ? getSegment(segmentSlug) : undefined;
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [summary, setSummary] = useState<LeadConfirmationSummary | null>(null);

  useEffect(() => {
    const storedSummary = readLeadSummary();
    if (storedSummary) {
      setSummary(storedSummary);
      clearLeadSummary();
    }

    const storedWhatsapp = sessionStorage.getItem("raise_whatsapp_url");
    if (storedWhatsapp) {
      setWhatsappUrl(storedWhatsapp);
      sessionStorage.removeItem("raise_whatsapp_url");
      return;
    }

    const business = storedSummary?.business ?? negocio;
    const city = storedSummary?.city ?? cidade;
    const cityState = storedSummary?.cityState ?? uf;
    const name = storedSummary?.name ?? "cliente";

    if (business && city) {
      setWhatsappUrl(
        buildWhatsAppUrl(
          buildLeadWhatsAppMessage({
            name,
            business,
            city,
            cityState,
            link: storedSummary?.link,
          }),
        ),
      );
    }
  }, [negocio, cidade, uf]);

  const businessLabel = summary?.business ?? negocio;
  const locationLabel =
    summary?.city && summary?.cityState
      ? `${summary.city}, ${summary.cityState}`
      : summary?.city ?? (cidade && uf ? `${cidade}, ${uf}` : cidade);
  const analysisItems = buildAnalysisItems(summary, locationLabel);
  const searchExamples = summary?.searchExamples ?? [];
  const digitalPresence = summary?.digitalPresence;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8">
          <Link to="/" className="flex shrink-0 items-center">
            <Logo size="nav" />
          </Link>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-20 sm:px-8">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 radial-glow opacity-50" />

        <div className="relative mx-auto max-w-lg animate-fade-up text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-brand/30 bg-brand-soft">
            <Check className="h-8 w-8 text-brand" strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
            Recebemos sua solicitação.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {businessLabel && locationLabel ? (
              <>
                Estamos analisando oportunidades para{" "}
                <span className="text-foreground">{businessLabel}</span> em{" "}
                <span className="text-foreground">{locationLabel}</span>.
              </>
            ) : (
              <>
                Estamos analisando as oportunidades
                {segment ? ` do mercado de ${segment.name.toLowerCase()}` : " do seu mercado"}.
              </>
            )}
          </p>

          <div className="mt-6 rounded-2xl border border-brand/25 bg-brand-soft/40 px-5 py-4 text-left">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Entraremos em contato em até 24 horas
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Nossa equipe vai falar com você pelo WhatsApp informado. Enquanto isso, já
                  estamos cruzando os dados do seu mercado para montar um diagnóstico objetivo.
                </p>
              </div>
            </div>
          </div>

          {(summary || searchExamples.length > 0) && (
            <div className="mt-6 rounded-2xl border border-border bg-surface p-6 text-left sm:p-8">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Resumo do seu diagnóstico
              </p>
              <dl className="space-y-3 text-sm">
                {businessLabel && (
                  <div>
                    <dt className="text-muted-foreground">Negócio</dt>
                    <dd className="font-medium text-foreground">{businessLabel}</dd>
                  </div>
                )}
                {locationLabel && (
                  <div>
                    <dt className="text-muted-foreground">Mercado</dt>
                    <dd className="font-medium text-foreground">{locationLabel}</dd>
                  </div>
                )}
                {digitalPresence && (
                  <div>
                    <dt className="text-muted-foreground">Presença digital</dt>
                    <dd className="font-medium text-foreground">{digitalPresence.label}</dd>
                    <dd className="mt-0.5 text-xs text-muted-foreground">
                      {digitalPresence.detail}
                    </dd>
                  </div>
                )}
              </dl>

              {searchExamples.length > 0 && (
                <div className="mt-5 border-t border-border pt-5">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Termos que estamos mapeando
                  </p>
                  <ul className="space-y-2">
                    {searchExamples.map((term) => (
                      <li
                        key={term}
                        className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm"
                      >
                        <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="font-mono text-foreground">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-border bg-surface p-6 text-left sm:p-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              O que estamos analisando
            </p>
            <ul className="space-y-4">
              {analysisItems.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                    <Check className="h-3 w-3 text-brand" strokeWidth={3} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 space-y-3">
            {whatsappUrl && (
              <>
                <p className="text-sm text-muted-foreground">
                  Quer adiantar? Fale conosco agora pelo WhatsApp.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-primary-foreground shadow-brand transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Falar no WhatsApp agora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </>
            )}
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Voltar ao início
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Retorno garantido em até 24 horas · Sem compromisso
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
