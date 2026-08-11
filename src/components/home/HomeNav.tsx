import { Link } from "@tanstack/react-router";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Logo } from "@/components/landing/shared/Logo";
import { solutionsMenu } from "@/lib/home/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";

const WHATSAPP_LEAD_URL =
  buildWhatsAppUrl(
    "Olá! Vim pelo site da Raise One e gostaria de analisar meu mercado e entender oportunidades de crescimento.",
  ) ?? "/#contato";

const navLinks = [
  { label: "Metodologia", href: "/metodologia" },
  { label: "Cases", href: "/cases" },
  { label: "Blog", href: "/blog" },
  { label: "Tecnologia", href: "/tecnologia" },
  { label: "Contato", href: "/#contato" },
];

function isInternalRoute(href: string) {
  return href.startsWith("/") && !href.startsWith("/#");
}

export function HomeNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderNavLink = (href: string, label: string, className?: string) => {
    if (isInternalRoute(href)) {
      return (
        <Link to={href} className={className} onClick={() => setMobileOpen(false)}>
          {label}
        </Link>
      );
    }
    return (
      <a href={href} className={className} onClick={() => setMobileOpen(false)}>
        {label}
      </a>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center">
          <Logo size="nav" />
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-sm text-muted-foreground hover:bg-surface hover:text-foreground data-[state=open]:bg-surface">
                Soluções
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[720px] grid-cols-2 gap-6 p-6">
                  {solutionsMenu.map((group) => (
                    <div key={group.title}>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                        {group.title}
                      </p>
                      <ul className="space-y-2">
                        {group.links.map((link) => (
                          <li key={link.label}>
                            <NavigationMenuLink asChild>
                              {isInternalRoute(link.href) ? (
                                <Link
                                  to={link.href}
                                  className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                                >
                                  {link.label}
                                </Link>
                              ) : (
                                <a
                                  href={link.href}
                                  className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                                >
                                  {link.label}
                                </a>
                              )}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {navLinks.map((link) => (
              <NavigationMenuItem key={link.label}>
                <NavigationMenuLink asChild>
                  {isInternalRoute(link.href) ? (
                    <Link
                      to={link.href}
                      className={cn(
                        "inline-flex h-9 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className={cn(
                        "inline-flex h-9 items-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </a>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_LEAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.01] sm:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Falar no WhatsApp
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/60 bg-background px-4 py-4 lg:hidden">
          {renderNavLink(
            "/solucoes",
            "Soluções",
            "block rounded-lg px-3 py-2.5 text-sm font-medium",
          )}
          {renderNavLink(
            "/programa-de-crescimento",
            "Programa de Crescimento",
            "block rounded-lg px-3 py-2.5 text-sm font-medium text-brand",
          )}
          {navLinks.map((link) =>
            renderNavLink(
              link.href,
              link.label,
              "block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground",
            ),
          )}
          <a
            href={WHATSAPP_LEAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-primary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
