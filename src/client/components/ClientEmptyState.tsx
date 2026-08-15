import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function ClientEmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "muted",
  compact,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "muted" | "success" | "amber";
  compact?: boolean;
}) {
  return (
    <div className={cn("client-empty", compact && "client-empty-compact")}>
      <div className={cn("client-empty-icon", `client-empty-icon-${tone}`)}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 space-y-1">
        <p className="client-empty-title">{title}</p>
        {description ? <p className="client-empty-desc">{description}</p> : null}
        {action ? <div className="pt-2">{action}</div> : null}
      </div>
    </div>
  );
}
