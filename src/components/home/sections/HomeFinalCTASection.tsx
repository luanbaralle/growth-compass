import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight } from "lucide-react";

const projectWhatsApp =
  buildWhatsAppUrl(
    "Olá! Vim pelo site da Raise One e gostaria de iniciar um projeto de crescimento.",
  ) ?? "#contato";

export function HomeFinalCTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border/60">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.72_0.19_48_/_0.16),transparent_55%)]" />

      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          Vamos construir o próximo{" "}
          <span className="text-brand">passo</span> da sua empresa?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Conte-nos seu desafio. Nós desenhamos a solução.
        </p>
        <a
          href={projectWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.01]"
        >
          Iniciar um projeto
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}
