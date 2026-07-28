import { createFileRoute } from "@tanstack/react-router";
import { BlogPage } from "@/components/marketing/BlogPage";
import { blogSeoHead } from "@/lib/seo/pages";

export const Route = createFileRoute("/blog/")({
  head: () => blogSeoHead(),
  component: BlogPage,
});
