import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import type { ReactNode } from "react";

interface BlogArticleHeroProps {
  breadcrumbs: ReactNode;
  categoryLabel: string;
  typeLabel: string;
  title: ReactNode;
  excerpt: string;
  author: string;
  publishedAt: string;
  publishedLabel: string;
  modifiedLabel?: string | null;
  readTime: string;
  imageSrc?: string;
  imageAlt: string;
  className?: string;
}

export function BlogArticleHero({
  breadcrumbs,
  categoryLabel,
  typeLabel,
  title,
  excerpt,
  author,
  publishedAt,
  publishedLabel,
  modifiedLabel,
  readTime,
  imageSrc,
  imageAlt,
  className,
}: BlogArticleHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border/60",
        imageSrc ? "min-h-[28rem] lg:min-h-[32rem]" : "",
        className,
      )}
    >
      {imageSrc && (
        <>
          <img
            src={imageSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center lg:object-right"
            fetchPriority="high"
          />
          {/* Funde a foto no background — sólido à esquerda, transparente à direita */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-background from-35% via-background/92 via-55% to-background/25 lg:from-30% lg:via-50% lg:to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70"
            aria-hidden
          />
          {/* Imagem para SEO/schema (oculta visualmente) */}
          <img src={imageSrc} alt={imageAlt} className="sr-only" itemProp="image" />
        </>
      )}

      {!imageSrc && (
        <>
          <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.72_0.19_48_/_0.12),transparent_50%)]"
            aria-hidden
          />
        </>
      )}

      {imageSrc && (
        <div
          className="absolute inset-0 grid-bg opacity-[0.12] mix-blend-overlay"
          aria-hidden
        />
      )}

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pt-8 lg:pb-24">
        {breadcrumbs}

        <div className="mt-8 max-w-2xl lg:mt-10">
          <div className="h-1 w-12 rounded-full bg-brand" aria-hidden />

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-brand/35 bg-brand/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand backdrop-blur-sm">
              {typeLabel}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand/90">
              {categoryLabel}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl lg:leading-[1.08]">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>{author}</span>
            <span aria-hidden>·</span>
            <time dateTime={publishedAt} itemProp="datePublished">
              {publishedLabel}
            </time>
            {modifiedLabel && (
              <>
                <span aria-hidden>·</span>
                <span>Atualizado em {modifiedLabel}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readTime} de leitura
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
