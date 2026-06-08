import {
  countMoreMarketSuggestions,
  FEATURED_BUSINESS_EXAMPLES,
  getGroupedMarketSuggestions,
} from "@/lib/business-match";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface BusinessSuggestionsProps {
  value: string;
  onSelect: (example: string) => void;
}

function SuggestionChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors",
        selected
          ? "border-brand/50 bg-brand-soft text-foreground"
          : "border-border bg-surface text-muted-foreground hover:border-brand/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export function BusinessSuggestions({ value, onSelect }: BusinessSuggestionsProps) {
  const [expanded, setExpanded] = useState(false);
  const normalizedValue = value.trim().toLowerCase();
  const groups = getGroupedMarketSuggestions();
  const moreCount = countMoreMarketSuggestions();

  const isSelected = (label: string) => normalizedValue === label.toLowerCase();

  const handleFeaturedSelect = (label: string) => {
    onSelect(label);
  };

  const handleExpandedSelect = (label: string) => {
    onSelect(label);
    setExpanded(false);
  };

  return (
    <div className="mt-3 space-y-3">
      <div className="flex flex-wrap gap-2">
        {FEATURED_BUSINESS_EXAMPLES.map((example) => (
          <SuggestionChip
            key={example}
            label={example}
            selected={isSelected(example)}
            onClick={() => handleFeaturedSelect(example)}
          />
        ))}
      </div>

      {expanded && (
        <div className="animate-fade-up space-y-4 border-t border-border/60 pt-4">
          {groups.map((group) => (
            <div key={group.category}>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.labels.map((label) => (
                  <SuggestionChip
                    key={label}
                    label={label}
                    selected={isSelected(label)}
                    onClick={() => handleExpandedSelect(label)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-brand"
      >
        {expanded ? (
          <>
            Ver menos
            <ChevronUp className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            Ver mais segmentos ({moreCount})
            <ChevronDown className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </div>
  );
}
