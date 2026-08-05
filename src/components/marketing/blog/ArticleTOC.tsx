interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface ArticleTOCProps {
  items: TocItem[];
}

export function ArticleTOC({ items }: ArticleTOCProps) {
  const h2Items = items.filter((item) => item.level === 2);
  if (h2Items.length < 4) return null;

  return (
    <nav
      aria-label="Índice do artigo"
      className="mb-10 rounded-[1.25rem] border border-border bg-surface/30 p-5"
    >
      <p className="text-sm font-semibold text-foreground">Neste artigo</p>
      <ol className="mt-3 space-y-2">
        {h2Items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
