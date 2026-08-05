import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { blogTypeLabels, getArticlesForSegment } from "@/lib/blog/content";
import { blogImageAlt, blogThumbnail } from "@/lib/blog/images";

interface SegmentBlogSectionProps {
  segmentSlug: string;
}

export function SegmentBlogSection({ segmentSlug }: SegmentBlogSectionProps) {
  const articles = getArticlesForSegment(segmentSlug);
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-white/10 bg-black/20 px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
          <BookOpen className="h-4 w-4" />
          Conteúdo para você
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Artigos recomendados do blog
        </h2>
        <p className="mt-2 max-w-2xl text-white/70">
          Guias práticos de growth e marketing para o seu segmento — escritos pela equipe Raise One.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to="/blog/$slug"
              params={{ slug: article.slug }}
              className="group overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5 transition-all hover:border-brand/40 hover:bg-white/10"
            >
              <img
                src={
                  article.featuredImage
                    ? article.featuredImage.replace(/w=\d+&h=\d+/, "w=400&h=225")
                    : blogThumbnail(article.slug)
                }
                alt={blogImageAlt(article.slug)}
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                  {blogTypeLabels[article.type]}
                </span>
                <h3 className="mt-2 flex-1 text-sm font-semibold leading-snug text-white group-hover:text-brand">
                  {article.title}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  Ler artigo
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        >
          Ver todos os artigos
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
