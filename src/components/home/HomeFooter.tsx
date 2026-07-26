import { Logo } from "@/components/landing/shared/Logo";
import { footerLinks } from "@/lib/home/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  buildWhatsAppUrl("Olá! Vim pelo site da Raise One e gostaria de saber mais.") ?? "#";

const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL ?? "#";
const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL ?? "#";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeFooter() {
  return (
    <footer id="contato" className="border-t border-border/60 bg-surface/20">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-base font-semibold tracking-tight">Raise One</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Marketing, tecnologia e crescimento. Construímos soluções que fazem empresas
              crescerem.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="Empresa" links={footerLinks.empresa} />
          <FooterColumn title="Soluções" links={footerLinks.solucoes} />
          <FooterColumn title="Produtos" links={footerLinks.produtos} />
          <FooterColumn title="Recursos" links={footerLinks.recursos} />
        </div>

        <div className="mt-12 rounded-[1.25rem] border border-border bg-background/50 p-5 sm:p-6">
          <p className="text-sm font-semibold text-foreground">Fale conosco</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <p>WhatsApp: via botão acima</p>
            <p>E-mail: contato@raiseone.com.br</p>
            <p>Atendimento: Seg–Sex, 9h às 18h</p>
            <p>Brasil — atendimento remoto e presencial</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Raise One. Todos os direitos reservados.</span>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Política de Privacidade
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
