import { r1ScrollAnchor, r1Shell } from "./r1-tokens";
import { cn } from "@/lib/utils";

export function R1SectionNav({
  sections,
}: {
  sections: Array<{ id: string; label: string }>;
}) {
  if (sections.length < 3) return null;
  return (
    <nav
      className={cn(
        r1Shell,
        r1ScrollAnchor,
        "sticky top-16 z-40 border-y border-white/[0.06] bg-[#090909]/95 py-2.5 backdrop-blur-md sm:py-3",
      )}
    >
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-0.5 text-[11px] text-white/40 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:gap-5 sm:px-0 sm:text-[12px] [&::-webkit-scrollbar]:hidden">
        {sections.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 whitespace-nowrap transition-colors hover:text-white/75"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
