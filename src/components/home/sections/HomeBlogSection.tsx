import { BlogArticleCard } from "@/components/marketing/blog/BlogArticleCard";
import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getHomeFeaturedArticles } from "@/lib/blog/content";
import { homeBlogSection } from "@/lib/home/content";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const carouselNavClassName =
  "static h-9 w-9 translate-x-0 translate-y-0 rounded-full border-border/80 bg-surface/80 text-foreground shadow-sm backdrop-blur-sm hover:border-brand/30 hover:bg-surface hover:text-brand disabled:opacity-30";

export function HomeBlogSection() {
  const articles = getHomeFeaturedArticles();

  if (articles.length === 0) return null;

  return (
    <SectionShell className="border-t border-border/60 py-20 lg:py-28">
      <div className="absolute inset-0 grid-bg opacity-[0.18]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,oklch(0.72_0.19_48_/_0.08),transparent_45%)]"
        aria-hidden
      />

      <Carousel
        opts={{ align: "start", dragFree: false }}
        className="relative"
      >
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <SectionEyebrow>{homeBlogSection.eyebrow}</SectionEyebrow>
            <SectionTitle>{homeBlogSection.title}</SectionTitle>
            <SectionDescription>{homeBlogSection.description}</SectionDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <div className="flex items-center gap-2">
              <CarouselPrevious
                className={carouselNavClassName}
                aria-label="Artigos anteriores"
              />
              <CarouselNext
                className={carouselNavClassName}
                aria-label="Próximos artigos"
              />
            </div>
            <Link
              to="/blog"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand"
            >
              Ver todos os artigos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        <div className="relative mt-10">
          <CarouselContent className="-ml-4">
            {articles.map((article) => (
              <CarouselItem
                key={article.slug}
                className={cn(
                  "pl-4",
                  "basis-full sm:basis-1/2 lg:basis-1/3",
                )}
              >
                <BlogArticleCard
                  article={article}
                  variant="grid"
                  showMeta
                  className="h-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </SectionShell>
  );
}
