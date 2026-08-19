import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function R1CheckListItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <li className={cn("flex items-start gap-2.5 leading-relaxed", className)}>
      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/55" strokeWidth={2} aria-hidden />
      {children}
    </li>
  );
}

export function R1CheckList({
  items,
  columns = 1,
  className,
}: {
  items: string[];
  columns?: 1 | 2;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ul
      className={cn(
        "space-y-3",
        columns === 2 && "sm:columns-2 sm:gap-x-10",
        className,
      )}
    >
      {items.map((item) => (
        <R1CheckListItem key={item} className={columns === 2 ? "break-inside-avoid text-[13px] text-white/75 sm:text-[14px]" : "text-[14px] text-white/70"}>
          {item}
        </R1CheckListItem>
      ))}
    </ul>
  );
}
