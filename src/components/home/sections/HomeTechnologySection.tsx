import { AnimatedStat } from "@/components/home/shared/AnimatedStat";
import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { techProducts, techStats } from "@/lib/home/content";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function HomeTechnologySection() {
  return (
    <SectionShell id="tecnologia" className="border-b border-border/60 py-20 lg:py-28">
      <div className="max-w-3xl">
        <SectionEyebrow>Tecnologia</SectionEyebrow>
        <SectionTitle>Tecnologia desenvolvida pela Raise One</SectionTitle>
        <SectionDescription>
          Não apenas usamos ferramentas — construímos produtos e sistemas que aceleram o
          crescimento dos nossos clientes.
        </SectionDescription>
        <Link
          to="/tecnologia"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
        >
          Conhecer nossa tecnologia
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {techProducts.map((product) => {
          const Icon = product.icon;

          return (
            <article
              key={product.title}
              className="rounded-[1.35rem] border border-border bg-surface/30 p-5 transition-colors hover:border-brand/25"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/80 text-brand">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{product.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-10 rounded-[1.5rem] border border-border bg-surface/20 px-5 py-8 sm:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {techStats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} compact />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
