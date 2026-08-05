import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { projects, type HomeProject } from "@/lib/home/content";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import unipLogo from "@/assets/case-unip/Logo.jpg";
import studio21Logo from "@/assets/case-studio21/logo metálico.png";

const projectSlugs: Record<string, string> = {
  Atlas: "atlas",
  UNIP: "unip",
  "Studio 21": "studio21",
  "AMF Imóveis": "amf",
};

function ProjectCardBackground({ project }: { project: HomeProject }) {
  if (project.name === "UNIP") {
    return (
      <>
        <div className="absolute inset-0 bg-[#001428]" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#003366] via-[#002244] to-black"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 28%, rgba(255,204,0,0.14), transparent 48%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.04)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          aria-hidden
        />
        <div className="absolute inset-x-0 top-[10%] flex justify-center px-5 pb-16">
          <img
            src={unipLogo}
            alt="UNIP EAD"
            className="w-full max-w-[min(88%,11rem)] object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)] transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
      </>
    );
  }

  if (project.name === "Studio 21") {
    return (
      <>
        <div className="absolute inset-0 bg-[#050505]" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-neutral-950 to-black"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.1), transparent 52%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          aria-hidden
        />
        <div className="absolute inset-x-0 top-12 bottom-[5.5rem] flex -translate-y-2 items-center justify-center px-6">
          <img
            src={studio21Logo}
            alt="Studio 21 Cabeleireiros"
            className="w-full max-w-[min(88%,10.5rem)] object-contain object-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)] transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
      </>
    );
  }

  return (
    <>
      <div className={cn("absolute inset-0 bg-gradient-to-br", project.gradient)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.18),transparent_45%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    </>
  );
}

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
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
              <ProjectCardBackground project={project} />
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
              <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.07] bg-black/60 px-4 pb-4 pt-3 backdrop-blur-md supports-[backdrop-filter]:bg-black/45">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold tracking-tight">{project.name}</h3>
                    <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-white/55 transition-all duration-300 group-hover:line-clamp-none group-hover:text-sm group-hover:text-white/75">
                      {project.description}
                    </p>
                  </div>
                  {slug ? (
                    <ArrowUpRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-brand"
                      aria-hidden
                    />
                  ) : null}
                </div>
              </div>
            </div>
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
