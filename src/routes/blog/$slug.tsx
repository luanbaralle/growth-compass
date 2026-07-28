import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogArticlePage } from "@/components/marketing/BlogArticlePage";
import { getBlogArticle } from "@/lib/blog/content";
import { blogArticleSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = getBlogArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => blogArticleSeoHead(loaderData.article.slug),
  component: BlogArticleRoute,
});

function BlogArticleRoute() {
  const { article } = Route.useLoaderData();
  return <BlogArticlePage article={article} />;
}
