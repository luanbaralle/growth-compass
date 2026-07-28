import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { LandingPage } from "@/components/landing/LandingPage";
import { getSegment, isValidSegment } from "@/config/segments";
import type { SegmentSEO } from "@/config/segments/types";
import { buildPersonalization, matchBusiness } from "@/lib/business-match";
import { segmentSchemas, segmentSeoHead } from "@/lib/seo/pages";
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

/** Apenas dados serializáveis — SegmentConfig inclui ícones React (Lucide). */
interface SegmentLoaderData {
  slug: string;
  seo: SegmentSEO;
}

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
  loader: ({ params }): SegmentLoaderData => {
    if (!isValidSegment(params.segment)) {
      throw notFound();
    }
    const segment = getSegment(params.segment)!;
    return { slug: segment.slug, seo: segment.seo };
  },
  head: ({ loaderData }) =>
    segmentSeoHead({
      title: loaderData.seo.title,
      description: loaderData.seo.description,
      slug: loaderData.slug,
    }),
  component: SegmentPage,
});

function SegmentPage() {
  const { segment: segmentSlug } = Route.useParams();
  const config = getSegment(segmentSlug)!;
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
