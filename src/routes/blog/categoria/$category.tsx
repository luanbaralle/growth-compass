import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogCategoryPage } from "@/components/marketing/BlogCategoryPage";
import { blogCategories, type BlogCategory } from "@/lib/blog/content";
import { blogCategorySeoHead } from "@/lib/seo/pages";

const validCategories = blogCategories
  .map((c) => c.id)
  .filter((id): id is BlogCategory => id !== "all");

export const Route = createFileRoute("/blog/categoria/$category")({
  loader: ({ params }) => {
    if (!validCategories.includes(params.category as BlogCategory)) {
      throw notFound();
    }
    return { category: params.category as BlogCategory };
  },
  head: ({ loaderData }) => blogCategorySeoHead(loaderData.category),
  component: BlogCategoryRoute,
});

function BlogCategoryRoute() {
  const { category } = Route.useLoaderData();
  return <BlogCategoryPage category={category} />;
}
