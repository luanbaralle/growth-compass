import type { BusinessProfile, BusinessProfileNode } from "../types";
import { resolveDomainLabel } from "../knowledge/domains";
import { cn } from "@/lib/utils";
import { Building2, Network, Search } from "lucide-react";
import { useMemo, useState } from "react";

const DOMAIN_ICONS: Record<string, string> = {
  company: "🏢",
  business: "📋",
  products: "📦",
  offer: "📦",
  customer: "👤",
  acquisition: "📣",
  commercial: "💼",
  economics: "💰",
  marketing: "📱",
  brand: "✨",
  content: "🎬",
  goals: "🎯",
  expectations: "🤝",
  investment: "💳",
  opportunities: "🚀",
  risks: "⚠️",
};

const DOMAIN_ACCENTS: Record<string, string> = {
  company: "border-t-sky-500",
  business: "border-t-violet-500",
  products: "border-t-indigo-500",
  offer: "border-t-blue-500",
  customer: "border-t-emerald-500",
  acquisition: "border-t-orange-500",
  commercial: "border-t-amber-500",
  economics: "border-t-lime-500",
  marketing: "border-t-pink-500",
  brand: "border-t-fuchsia-500",
  content: "border-t-cyan-500",
  goals: "border-t-yellow-500",
  expectations: "border-t-teal-500",
  investment: "border-t-rose-500",
  opportunities: "border-t-amber-400",
  risks: "border-t-red-500",
};

interface FlatFact {
  label: string;
  value: string;
}

function flattenFacts(nodes: BusinessProfileNode[]): FlatFact[] {
  const out: FlatFact[] = [];
  function walk(node: BusinessProfileNode) {
    if (node.value && node.label) {
      out.push({ label: node.label, value: node.value });
    }
    node.children?.forEach(walk);
  }
  nodes.forEach(walk);
  return out;
}

function collectDomainFacts(node: BusinessProfileNode): FlatFact[] {
  const facts = flattenFacts(node.children ?? []);
  if (node.value && node.label && !facts.some((f) => f.label === node.label)) {
    return [{ label: node.label, value: node.value }, ...facts];
  }
  return facts;
}

function DomainCard({
  node,
  highlighted,
}: {
  node: BusinessProfileNode;
  highlighted: boolean;
}) {
  const facts = collectDomainFacts(node);
  const icon = DOMAIN_ICONS[node.key] ?? "·";

  if (facts.length === 0) return null;

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-border/50 bg-card/70 p-4 shadow-sm transition",
        "border-t-[3px]",
        DOMAIN_ACCENTS[node.key] ?? "border-t-muted-foreground",
        highlighted ? "ring-1 ring-sky-500/25" : "",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-lg leading-none">
            {icon}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {resolveDomainLabel(node.key, node.label)}
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {facts.length} {facts.length === 1 ? "atributo" : "atributos"}
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-4 space-y-2.5">
        {facts.map((fact) => (
          <div
            key={`${node.key}-${fact.label}-${fact.value}`}
            className="rounded-lg border border-border/30 bg-muted/15 px-3 py-2.5"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/75">
              {fact.label}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-foreground/90">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function BusinessGraphPanel({
  profile,
  className,
}: {
  profile: BusinessProfile;
  className?: string;
}) {
  const [query, setQuery] = useState("");

  const sections = useMemo(
    () => profile.roots.filter((r) => collectDomainFacts(r).length > 0),
    [profile.roots],
  );

  const totalFacts = useMemo(
    () => sections.reduce((acc, section) => acc + collectDomainFacts(section).length, 0),
    [sections],
  );

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter((section) => {
      const facts = collectDomainFacts(section);
      if (section.label.toLowerCase().includes(q)) return true;
      return facts.some(
        (f) => f.label.toLowerCase().includes(q) || f.value.toLowerCase().includes(q),
      );
    });
  }, [sections, query]);

  const displayName = profile.companyName ?? profile.contactName ?? "Prospect";
  const subtitle = profile.contactName && profile.companyName ? profile.contactName : null;

  if (sections.length === 0) {
    return (
      <section
        className={cn(
          "rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-14 text-center",
          className,
        )}
      >
        <Network className="mx-auto h-10 w-10 text-muted-foreground/25" />
        <p className="mt-4 text-sm font-medium text-foreground/80">Grafo do negócio vazio</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Conforme a conversa avança, atributos do negócio aparecem aqui de forma estruturada.
        </p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-sky-500/[0.05] to-transparent shadow-sm",
        className,
      )}
    >
      <div className="border-b border-border/40 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-sky-500/80" />
              <h2 className="text-base font-semibold">Grafo do negócio</h2>
            </div>
            <p className="mt-2 text-lg font-semibold text-foreground">{displayName}</p>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            <p className="mt-2 text-sm text-muted-foreground">
              {totalFacts} atributos mapeados · {sections.length} domínios
            </p>
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar atributo..."
              className="h-10 w-full rounded-lg border border-border/50 bg-background/80 pl-9 pr-3 text-sm outline-none ring-sky-500/20 focus:ring-2"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {sections.map((section) => {
            const count = collectDomainFacts(section).length;
            return (
              <span
                key={section.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-background/60 px-2.5 py-1 text-[11px] text-muted-foreground"
              >
                <span>{DOMAIN_ICONS[section.key] ?? "·"}</span>
                {resolveDomainLabel(section.key, section.label)}
                <span className="tabular-nums opacity-60">{count}</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {filteredSections.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum atributo corresponde à busca.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSections.map((section) => (
              <DomainCard
                key={section.key}
                node={section}
                highlighted={query.trim().length > 0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
