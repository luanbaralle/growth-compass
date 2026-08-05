import type { BlogRelatedLink } from "@/lib/blog/types";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface ArticleRelatedLinksProps {
  links: BlogRelatedLink[];
}

export function ArticleRelatedLinks({ links }: ArticleRelatedLinksProps) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight">Recursos relacionados</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="group flex flex-col rounded-[1.25rem] border border-border bg-surface/30 p-4 transition-all hover:border-brand/25"
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">
              {link.type === "case"
                ? "Case"
                : link.type === "segment"
                  ? "Segmento"
                  : link.type === "solution"
                    ? "Solução"
                    : "Artigo"}
            </span>
            <span className="mt-1 flex items-center gap-1.5 font-semibold group-hover:text-brand">
              {link.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            {link.description && (
              <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
