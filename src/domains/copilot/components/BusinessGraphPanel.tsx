import type { BusinessProfile, BusinessProfileNode } from "../types";
import { cn } from "@/lib/utils";

function TreeNode({ node, depth = 0 }: { node: BusinessProfileNode; depth?: number }) {
  return (
    <div className={cn(depth > 0 && "ml-3 border-l border-border/40 pl-3")}>
      <div className="text-xs">
        <span className="text-muted-foreground">{node.label}</span>
        {node.value ? (
          <span className="ml-1 font-medium text-foreground/90">{node.value}</span>
        ) : null}
      </div>
      {node.children?.map((child) => (
        <div key={child.key} className="mt-1">
          <TreeNode node={child} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

export function BusinessGraphPanel({
  profile,
  className,
}: {
  profile: BusinessProfile;
  className?: string;
}) {
  if (profile.roots.length === 0) {
    return (
      <div className={cn("text-xs text-muted-foreground/70", className)}>
        O grafo do negócio aparece conforme a conversa revela informações.
      </div>
    );
  }

  const title = profile.contactName ?? profile.companyName ?? "Prospect";

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        Business graph
      </p>
      <p className="text-sm font-semibold uppercase tracking-wide text-foreground/90">{title}</p>
      <div className="space-y-2 font-mono text-[11px] leading-relaxed">
        {profile.roots.map((root) => (
          <TreeNode key={root.key} node={root} />
        ))}
      </div>
    </div>
  );
}
