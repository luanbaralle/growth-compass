import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getProposalBySlug } from "@/domains/proposals/api.server";

export const Route = createFileRoute("/propostas/$slug")({
  loader: async ({ params }) => {
    try {
      return await getProposalBySlug({ data: { slug: params.slug } });
    } catch {
      return null;
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ?? "Proposta · Raise One" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
