import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { searchOSGlobal } from "@/os/search.functions";
import {
  GLOBAL_SEARCH_KIND_LABELS,
  OS_SEARCH_OPEN_EVENT,
  type GlobalSearchResult,
  type GlobalSearchResultKind,
} from "@/os/global-search";
import { getErrorMessage } from "@/lib/api/client-errors";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Clapperboard,
  FolderKanban,
  LayoutDashboard,
  Loader2,
  Target,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const QUICK_NAV = [
  { label: "Dashboard", href: "/os", icon: LayoutDashboard },
  { label: "Atividade", href: "/os/atividade", icon: LayoutDashboard },
  { label: "Empresas", href: "/os/empresas", icon: Building2 },
  { label: "Projetos", href: "/os/projetos", icon: FolderKanban },
  { label: "Produção", href: "/os/producao", icon: Clapperboard },
  { label: "Prospecção", href: "/os/prospeccao", icon: Target },
] as const;

const KIND_ICONS: Record<GlobalSearchResultKind, typeof Building2> = {
  company: Building2,
  project: FolderKanban,
  prospect: Target,
  content_task: Clapperboard,
};

const KIND_ORDER: GlobalSearchResultKind[] = [
  "company",
  "project",
  "prospect",
  "content_task",
];

export function OSGlobalSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const grouped = useMemo(() => {
    const map = new Map<GlobalSearchResultKind, GlobalSearchResult[]>();
    for (const kind of KIND_ORDER) {
      map.set(kind, []);
    }
    for (const result of results) {
      map.get(result.kind)?.push(result);
    }
    return map;
  }, [results]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setError("");
  }, []);

  const goTo = useCallback(
    (href: string) => {
      close();
      if (href.includes("?")) {
        const url = new URL(href, window.location.origin);
        navigate({
          to: url.pathname,
          search: Object.fromEntries(url.searchParams.entries()),
        });
        return;
      }
      navigate({ to: href });
    },
    [close, navigate],
  );

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OS_SEARCH_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OS_SEARCH_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    const timer = window.setTimeout(() => {
      searchOSGlobal({ data: { query: trimmed } })
        .then((response) => setResults(response.results))
        .catch((err) => setError(getErrorMessage(err, "Erro ao buscar.")))
        .finally(() => setLoading(false));
    }, 200);

    return () => window.clearTimeout(timer);
  }, [open, query]);

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
        <Command shouldFilter={false} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <CommandInput
            placeholder="Buscar empresas, projetos, prospects, conteúdo..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[360px]">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Buscando...
          </div>
        )}

        {!loading && error && <CommandEmpty>{error}</CommandEmpty>}

        {!loading && !error && query.trim().length < 2 && (
          <>
            <CommandGroup heading="Ir para">
              {QUICK_NAV.map((item) => (
                <CommandItem key={item.href} value={`nav-${item.href}`} onSelect={() => goTo(item.href)}>
                  <item.icon className="text-muted-foreground" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandEmpty>Digite ao menos 2 caracteres para buscar entidades.</CommandEmpty>
          </>
        )}

        {!loading && !error && query.trim().length >= 2 && results.length === 0 && (
          <CommandEmpty>Nenhum resultado para &quot;{query.trim()}&quot;.</CommandEmpty>
        )}

        {!loading &&
          !error &&
          KIND_ORDER.map((kind, index) => {
            const items = grouped.get(kind) ?? [];
            if (items.length === 0) return null;
            const Icon = KIND_ICONS[kind];
            return (
              <div key={kind}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={GLOBAL_SEARCH_KIND_LABELS[kind]}>
                  {items.map((result) => (
                    <CommandItem
                      key={`${result.kind}-${result.id}`}
                      value={`${result.kind}-${result.title}-${result.subtitle}`}
                      onSelect={() => goTo(result.href)}
                    >
                      <Icon className="text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{result.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            );
          })}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function OSSearchTrigger({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OS_SEARCH_OPEN_EVENT))}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border/40 bg-surface/30 text-sm text-muted-foreground transition-colors hover:border-brand/20 hover:text-foreground",
        compact ? "h-9 w-9 justify-center px-0" : "h-9 w-full px-3",
        className,
      )}
      aria-label="Buscar no sistema"
    >
      {!compact && <span className="flex-1 text-left text-xs">Buscar...</span>}
      <kbd className="hidden rounded border border-border/30 bg-surface-elevated/40 px-1.5 py-0.5 text-[10px] sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
