import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function ClientPageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("client-page-header", className)}>
      <div className="min-w-0 flex-1 space-y-2">
        {eyebrow ? <p className="client-eyebrow">{eyebrow}</p> : null}
        <h1 className="client-page-title">{title}</h1>
        {description ? <p className="client-page-desc">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
