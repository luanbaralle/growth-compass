import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { blogTypeLabels, type BlogArticle } from "@/lib/blog/content";
import { blogImageAlt, blogThumbnail } from "@/lib/blog/images";
import { cn } from "@/lib/utils";

interface BlogArticleCardProps {
  article: BlogArticle;
  variant?: "grid" | "list" | "comparativo";
  showMeta?: boolean;
  className?: string;
}

function formatCardDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogArticleCard({
  article,
  variant = "grid",
  showMeta = false,
  className,
}: BlogArticleCardProps) {
  const thumbnail = article.featuredImage
    ? article.featuredImage.replace(/w=\d+&h=\d+/, "w=400&h=225")
    : blogThumbnail(article.slug);
  const alt = blogImageAlt(article.slug);

  if (variant === "list") {
    return (
      <Link
        to="/blog/$slug"
        params={{ slug: article.slug }}
        className={cn(
          "group grid gap-4 overflow-hidden rounded-[1.25rem] border border-border bg-surface/30 transition-all hover:border-brand/25 hover:bg-surface/50 sm:grid-cols-[140px_1fr_auto]",
          className,
        )}
      >
        <img
          src={thumbnail}
          alt={alt}
          className="aspect-[16/10] w-full object-cover sm:aspect-auto sm:h-full sm:min-h-[100px]"
          loading="lazy"
        />
        <div className="px-5 pb-5 pt-0 sm:py-5 sm:pl-0">
          <h3 className="text-lg font-semibold tracking-tight group-hover:text-brand">
            {article.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
        </div>
        <div className="hidden flex-col items-end justify-center gap-2 px-5 pb-5 sm:flex sm:pb-0 sm:pr-5">
          <ArrowRight className="h-4 w-4 text-brand" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/blog/$slug"
      params={{ slug: article.slug }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[1.35rem] border border-border bg-surface/40 transition-all hover:-translate-y-0.5 hover:border-brand/25",
        className,
      )}
    >
      <img
        src={thumbnail}
        alt={alt}
        className="aspect-[16/9] w-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col p-5">
        <span
          className={cn(
            "inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            variant === "comparativo"
              ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
              : "border-brand/20 bg-brand-soft text-brand",
          )}
        >
          {blogTypeLabels[article.type]}
        </span>
        <h3 className="mt-3 flex-1 font-semibold tracking-tight group-hover:text-brand">
          {article.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
        {showMeta && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <time dateTime={article.publishedAt}>{formatCardDate(article.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
          </div>
        )}
        {variant === "grid" && (
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
            Ler {article.type === "guia" ? "guia" : "artigo"}
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </Link>
  );
}
