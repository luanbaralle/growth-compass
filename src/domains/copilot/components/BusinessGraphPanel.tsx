import type { BusinessProfile, BusinessProfileNode } from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Building2, Network } from "lucide-react";

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

function flattenFacts(nodes: BusinessProfileNode[]): Array<{ label: string; value: string }> {
  const out: Array<{ label: string; value: string }> = [];
  function walk(node: BusinessProfileNode) {
    if (node.value && node.label) {
      out.push({ label: node.label, value: node.value });
    }
    node.children?.forEach(walk);
  }
  nodes.forEach(walk);
  return out;
}

function DomainSection({ node }: { node: BusinessProfileNode }) {
  const facts = flattenFacts(node.children ?? []);
  const icon = DOMAIN_ICONS[node.key] ?? "·";

  if (facts.length === 0 && !node.value) return null;

  return (
    <AccordionItem value={node.key} className="border-border/35">
      <AccordionTrigger className="py-2.5 text-xs font-semibold hover:no-underline">
        <span className="flex items-center gap-2">
          <span className="text-base leading-none">{icon}</span>
          {node.label}
          {facts.length > 0 && (
            <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
              {facts.length}
            </span>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <dl className="space-y-2 pb-1">
          {node.value && (
            <div className="rounded-md bg-muted/20 px-2.5 py-2">
              <dt className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
                {node.label}
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground/90">{node.value}</dd>
            </div>
          )}
          {facts.map((fact) => (
            <div key={`${fact.label}-${fact.value}`} className="flex flex-col gap-0.5 px-1">
              <dt className="text-[10px] text-muted-foreground/75">{fact.label}</dt>
              <dd className="text-xs leading-relaxed text-foreground/85">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </AccordionContent>
    </AccordionItem>
  );
}

export function BusinessGraphPanel({
  profile,
  className,
}: {
  profile: BusinessProfile;
  className?: string;
}) {
  const title = profile.contactName ?? profile.companyName ?? "Prospect";
  const sections = profile.roots.filter(
    (r) => r.children?.length || r.value,
  );

  if (sections.length === 0) {
    return (
      <Card className={cn("border-border/50 shadow-sm", className)}>
        <CardContent className="py-8 text-center">
          <Network className="mx-auto h-8 w-8 text-muted-foreground/30" />
          <p className="mt-3 text-xs text-muted-foreground/70">
            O grafo do negócio aparece conforme a conversa revela informações.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/50 shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold">Business graph</CardTitle>
        </div>
        <p className="text-xs font-medium text-foreground/80">{title}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="multiple" defaultValue={sections.slice(0, 3).map((s) => s.key)}>
          {sections.map((root) => (
            <DomainSection key={root.key} node={root} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
