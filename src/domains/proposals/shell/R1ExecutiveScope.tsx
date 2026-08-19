import { r1CardHighlightClass } from "./r1-tokens";
import { R1CheckList } from "./R1Lists";

export function R1ExecutiveScope({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div className={r1CardHighlightClass}>
      <p className="text-[15px] font-semibold text-white">{title}</p>
      {subtitle && <p className="mt-2 text-[13px] text-white/40">{subtitle}</p>}
      <div className="mt-6 sm:mt-8">
        <R1CheckList items={items} columns={2} />
      </div>
    </div>
  );
}
