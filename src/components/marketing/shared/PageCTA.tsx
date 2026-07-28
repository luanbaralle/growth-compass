import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight } from "lucide-react";

interface PageCTAProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  whatsappMessage?: string;
}

const defaultWhatsApp =
  buildWhatsAppUrl(
    "Olá! Vim pelo site da Raise One e gostaria de conversar sobre o Programa de Crescimento.",
  ) ?? "/#contato";

export function PageCTA({
  title = "Pronto para dar o próximo passo?",
  description = "Agende uma conversa. Entendemos seu mercado e desenhamos o caminho ideal.",
  ctaLabel = "Agendar conversa",
  whatsappMessage,
}: PageCTAProps) {
  const href =
    whatsappMessage != null
      ? (buildWhatsAppUrl(whatsappMessage) ?? defaultWhatsApp)
      : defaultWhatsApp;

  return (
    <section className="relative overflow-hidden border-t border-border/60">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.72_0.19_48_/_0.16),transparent_55%)]" />

      <div className="relative mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
        <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.01]"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}
