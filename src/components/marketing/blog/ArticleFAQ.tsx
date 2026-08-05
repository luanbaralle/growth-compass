import type { BlogFaqItem } from "@/lib/blog/types";

interface ArticleFAQProps {
  items: BlogFaqItem[];
}

export function ArticleFAQ({ items }: ArticleFAQProps) {
  return (
    <section className="mt-12 border-t border-border/60 pt-10" aria-labelledby="article-faq">
      <h2 id="article-faq" className="text-2xl font-bold tracking-tight">
        Perguntas frequentes
      </h2>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-[1.25rem] border border-border bg-surface/30 px-5 py-4"
          >
            <summary className="cursor-pointer list-none font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
