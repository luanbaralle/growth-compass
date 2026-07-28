import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { solutions } from "@/lib/home/content";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const solutionLinks: Record<string, string> = {
  "Aquisição de Clientes": "/solucoes",
  "Conteúdo que conecta": "/solucoes/producao-de-conteudo",
  "Tecnologia sob medida": "/#tecnologia",
  "Inteligência Artificial": "/solucoes",
  "Mercado Imobiliário": "/solucoes",
  "Estratégia & Growth": "/programa-de-crescimento",
};

export function HomeSolutionsSection() {
  return (
    <SectionShell id="solucoes" className="border-b border-border/60 py-20 lg:py-28">
      <div className="max-w-3xl">
        <SectionEyebrow>Soluções</SectionEyebrow>
        <SectionTitle>O que construímos para acelerar seu negócio</SectionTitle>
        <SectionDescription>
          Não listamos serviços — construímos soluções completas de crescimento, do marketing
          à tecnologia.
        </SectionDescription>
        <Link
          to="/solucoes"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
        >
          Ver catálogo completo
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {solutions.map((solution) => {
          const Icon = solution.icon;
          const href = solutionLinks[solution.title] ?? "/solucoes";

          return (
            <article
              key={solution.title}
              className="group flex flex-col rounded-[1.5rem] border border-border bg-surface/40 p-6 transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:bg-surface/70"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand-soft text-brand transition-colors group-hover:bg-brand/15">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{solution.title}</h3>
              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {solution.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
              {href.startsWith("/#") ? (
                <a
                  href={href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
                >
                  Saiba mais
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <Link
                  to={href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
                >
                  Saiba mais
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
