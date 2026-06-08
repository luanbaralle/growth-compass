import { Instagram, MessageCircle, TrendingUp } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Logo } from "./Logo";

const WHATSAPP_URL =
  buildWhatsAppUrl(
    "Olá! Vim pelo site da Raise One e gostaria de saber mais sobre crescimento para negócios locais.",
  ) ?? "#";

const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL ?? "#";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-base font-semibold tracking-tight">Raise One</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Especialistas em crescimento e aquisição de clientes para negócios locais.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Política de Privacidade
            </a>
          </nav>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Raise One</span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-brand" />
            Crescimento local
          </span>
        </div>
      </div>
    </footer>
  );
}
