import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { projects } from "@/lib/home/content";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const projectSlugs: Record<string, string> = {
  Atlas: "atlas",
  UNIP: "unip",
  "Studio 21": "studio21",
  "AMF Imóveis": "amf",
};

export function HomeProjectsSection() {
  return (
    <SectionShell id="casos" className="border-b border-border/60 py-20 lg:py-28">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <SectionEyebrow>Portfólio</SectionEyebrow>
          <SectionTitle>Projetos que geram resultados reais</SectionTitle>
          <SectionDescription>
            Cases reais de marketing, tecnologia e crescimento — do portal imobiliário ao
            sistema interno.
          </SectionDescription>
        </div>
        <Link
          to="/cases"
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand"
        >
          Ver todos os cases
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {projects.map((project) => {
          const slug = projectSlugs[project.name];
          const card = (
            <>
              <div
                className={cn(
                  "relative aspect-[4/5] overflow-hidden bg-gradient-to-br",
                  project.gradient,
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.18),transparent_45%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute left-4 top-4">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      project.tagTone === "blue"
                        ? "bg-blue-500/20 text-blue-200"
                        : "bg-brand/20 text-brand",
                    )}
                  >
                    {project.tag}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-xl font-bold tracking-tight">{project.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/72 opacity-0 transition-opacity group-hover:opacity-100">
                    {project.description}
                  </p>
                </div>
              </div>
            </>
          );

          if (slug) {
            return (
              <Link
                key={project.name}
                to="/cases/$slug"
                params={{ slug }}
                className="group relative overflow-hidden rounded-[1.35rem] border border-border bg-surface/30 transition-transform hover:-translate-y-1"
              >
                {card}
              </Link>
            );
          }

          return (
            <div
              key={project.name}
              className="group relative overflow-hidden rounded-[1.35rem] border border-border bg-surface/30"
            >
              {card}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
