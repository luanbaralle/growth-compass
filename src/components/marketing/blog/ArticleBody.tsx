import type { BlogSection } from "@/lib/blog/types";
import { slugifyHeading } from "@/lib/blog/helpers";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";

interface ArticleBodyProps {
  sections: BlogSection[];
}

const linkCardStyles: Record<string, string> = {
  case: "border-brand/30 bg-brand-soft/20",
  segment: "border-blue-500/30 bg-blue-500/5",
  solution: "border-emerald-500/30 bg-emerald-500/5",
  article: "border-border bg-surface/40",
};

export function ArticleBody({ sections }: ArticleBodyProps) {
  return (
    <div className="prose-blog space-y-6">
      {sections.map((section, index) => {
        switch (section.kind) {
          case "paragraph":
            return (
              <p
                key={index}
                className="text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                {section.text}
              </p>
            );

          case "heading": {
            const id = section.id ?? slugifyHeading(section.text);
            if (section.level === 2) {
              return (
                <h2
                  key={index}
                  id={id}
                  className="scroll-mt-24 pt-4 text-2xl font-bold tracking-tight text-foreground"
                >
                  {section.text}
                </h2>
              );
            }
            return (
              <h3
                key={index}
                id={id}
                className="scroll-mt-24 pt-2 text-xl font-semibold tracking-tight text-foreground"
              >
                {section.text}
              </h3>
            );
          }

          case "list":
            if (section.ordered) {
              return (
                <ol key={index} className="ml-5 list-decimal space-y-2 text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={index} className="ml-5 list-disc space-y-2 text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "callout":
            return (
              <aside
                key={index}
                className="rounded-xl border border-brand/25 bg-brand-soft/50 px-5 py-4"
              >
                {section.title && (
                  <p className="text-sm font-semibold text-brand">{section.title}</p>
                )}
                <p
                  className={cn(
                    "text-sm leading-relaxed text-foreground",
                    section.title && "mt-1",
                  )}
                >
                  {section.text}
                </p>
              </aside>
            );

          case "comparison":
            return (
              <div
                key={index}
                className="grid gap-4 overflow-hidden rounded-[1.25rem] border border-border sm:grid-cols-2"
              >
                {[section.left, section.right].map((side) => (
                  <div key={side.title} className="bg-surface/40 p-5 sm:p-6">
                    <h4 className="font-semibold text-foreground">{side.title}</h4>
                    <ul className="mt-3 space-y-2">
                      {side.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );

          case "image":
            return (
              <figure key={index} className="my-10 overflow-hidden rounded-[1.25rem] border border-border">
                <img
                  src={section.src}
                  alt={section.alt}
                  className="aspect-[16/9] w-full object-cover"
                  loading="lazy"
                />
                {section.caption && (
                  <figcaption className="border-t border-border bg-surface/30 px-4 py-3 text-sm text-muted-foreground">
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "quote":
            return (
              <blockquote
                key={index}
                className="border-l-4 border-brand pl-5 italic text-foreground"
              >
                <p className="text-lg leading-relaxed">&ldquo;{section.text}&rdquo;</p>
                {section.author && (
                  <footer className="mt-2 text-sm not-italic text-muted-foreground">
                    — {section.author}
                  </footer>
                )}
              </blockquote>
            );

          case "table":
            return (
              <div
                key={index}
                className="overflow-x-auto rounded-[1.25rem] border border-border"
              >
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface/50">
                      {section.headers.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left font-semibold text-foreground"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-border/60 last:border-0">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-muted-foreground">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "cta":
            return (
              <aside
                key={index}
                className="rounded-[1.35rem] border border-brand/25 bg-brand-soft/30 p-6 text-center sm:p-8"
              >
                <h4 className="text-xl font-bold tracking-tight">{section.title}</h4>
                <p className="mt-2 text-muted-foreground">{section.description}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link
                    to={section.primaryHref}
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand"
                  >
                    {section.primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  {section.secondaryLabel && section.secondaryHref && (
                    <Link
                      to={section.secondaryHref}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-6 py-3 text-sm font-semibold"
                    >
                      {section.secondaryLabel}
                    </Link>
                  )}
                </div>
              </aside>
            );

          case "linkCard": {
            const isInternal = section.href.startsWith("/");
            const cardClass = cn(
              "group flex flex-col rounded-[1.25rem] border p-5 transition-all hover:-translate-y-0.5",
              linkCardStyles[section.type] ?? linkCardStyles.article,
            );
            const content = (
              <>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                  {section.type === "case"
                    ? "Case"
                    : section.type === "segment"
                      ? "Segmento"
                      : section.type === "solution"
                        ? "Solução"
                        : "Artigo"}
                </span>
                <span className="mt-2 flex items-center gap-1.5 font-semibold group-hover:text-brand">
                  {section.label}
                  {isInternal ? (
                    <ArrowRight className="h-3.5 w-3.5" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
                </span>
                {section.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                )}
              </>
            );
            return isInternal ? (
              <Link key={index} to={section.href} className={cardClass}>
                {content}
              </Link>
            ) : (
              <a
                key={index}
                href={section.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {content}
              </a>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

export function extractTableOfContents(sections: BlogSection[]): { id: string; text: string; level: 2 | 3 }[] {
  return sections
    .filter((s): s is Extract<BlogSection, { kind: "heading" }> => s.kind === "heading")
    .map((s) => ({
      id: s.id ?? slugifyHeading(s.text),
      text: s.text,
      level: s.level,
    }));
}
