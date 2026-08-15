import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function ClientSection({
  title,
  icon: Icon,
  iconTone = "primary",
  actionLabel,
  actionTo,
  badgeCount,
  children,
  className,
  featured,
}: {
  title: string;
  icon?: LucideIcon;
  iconTone?: "primary" | "amber" | "emerald";
  actionLabel?: string;
  actionTo?: string;
  badgeCount?: number;
  children: ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <section className={cn("client-section", featured && "client-section-featured", className)}>
      <div className="client-section-head">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon ? (
            <span className={cn("client-section-icon", `client-section-icon-${iconTone}`)}>
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>
          ) : null}
          <h2 className="client-section-title">{title}</h2>
          {badgeCount ? <span className="client-badge-count">{badgeCount}</span> : null}
        </div>
        {actionLabel && actionTo ? (
          <Link to={actionTo} className="client-text-link">
            {actionLabel}
          </Link>
        ) : null}
      </div>
      <div className="client-section-body">{children}</div>
    </section>
  );
}
