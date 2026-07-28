import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";
import { homeSeo } from "@/lib/seo/pages";

export const Route = createFileRoute("/")({
  head: () => homeSeo(),
  component: HomePage,
});
