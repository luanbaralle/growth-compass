import type { BlogSection } from "@/lib/blog/content";
import { cn } from "@/lib/utils";

interface ArticleBodyProps {
  sections: BlogSection[];
}

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

          case "heading":
            if (section.level === 2) {
              return (
                <h2
                  key={index}
                  className="pt-4 text-2xl font-bold tracking-tight text-foreground"
                >
                  {section.text}
                </h2>
              );
            }
            return (
              <h3 key={index} className="pt-2 text-xl font-semibold tracking-tight text-foreground">
                {section.text}
              </h3>
            );

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

          default:
            return null;
        }
      })}
    </div>
  );
}
