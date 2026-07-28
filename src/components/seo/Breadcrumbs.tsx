import { JsonLd } from "@/components/seo/JsonLd";
import type { BreadcrumbItem } from "@/lib/seo/schema";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" />}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-foreground">
                    {item.name}
                  </span>
                ) : item.path.startsWith("/#") ? (
                  <a href={item.path} className="transition-colors hover:text-brand">
                    {item.name}
                  </a>
                ) : (
                  <Link to={item.path} className="transition-colors hover:text-brand">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
