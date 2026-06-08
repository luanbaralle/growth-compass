import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { LandingPage } from "@/components/landing/LandingPage";
import { getSegment, isValidSegment } from "@/config/segments";
import { buildPersonalization, matchBusiness } from "@/lib/business-match";
import { captureUtmFromUrl } from "@/lib/utm";

type SegmentSearch = {
  cidade?: string;
  uf?: string;
  servicos?: string;
  negocio?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export const Route = createFileRoute("/$segment")({
  validateSearch: (search: Record<string, unknown>): SegmentSearch => ({
    cidade: typeof search.cidade === "string" ? search.cidade : undefined,
    uf: typeof search.uf === "string" ? search.uf : undefined,
    servicos: typeof search.servicos === "string" ? search.servicos : undefined,
    negocio: typeof search.negocio === "string" ? search.negocio : undefined,
    utm_source: typeof search.utm_source === "string" ? search.utm_source : undefined,
    utm_medium: typeof search.utm_medium === "string" ? search.utm_medium : undefined,
    utm_campaign: typeof search.utm_campaign === "string" ? search.utm_campaign : undefined,
    utm_content: typeof search.utm_content === "string" ? search.utm_content : undefined,
    utm_term: typeof search.utm_term === "string" ? search.utm_term : undefined,
  }),
  loader: ({ params }) => {
    if (!isValidSegment(params.segment)) {
      throw notFound();
    }
    return getSegment(params.segment)!;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData.seo.title },
      { name: "description", content: loaderData.seo.description },
      {
        property: "og:title",
        content: loaderData.seo.ogTitle ?? loaderData.seo.title,
      },
      {
        property: "og:description",
        content: loaderData.seo.ogDescription ?? loaderData.seo.description,
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SegmentPage,
});

function SegmentPage() {
  const config = Route.useLoaderData();
  const { cidade, uf, servicos, negocio } = Route.useSearch();

  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  const servicesList = servicos
    ? servicos
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const businessMatch = negocio ? matchBusiness(negocio) : undefined;
  const personalization = businessMatch
    ? buildPersonalization(businessMatch, cidade, servicesList)
    : undefined;

  return (
    <LandingPage
      config={config}
      context={{
        city: cidade,
        cityState: uf,
        services: servicesList,
        personalization,
        match: businessMatch,
        fromHub: !!negocio && !!cidade,
      }}
    />
  );
}
