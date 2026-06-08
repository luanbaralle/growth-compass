import { searchMarketSegments } from "@/config/market-demand";
import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

interface BusinessInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
}

export function BusinessInput({ id, value, onChange }: BusinessInputProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const suggestions = searchMarketSegments(value, 8);
  const showList = open && value.trim().length >= 2 && suggestions.length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlight(0);
  }, [value]);

  const selectSuggestion = (label: string) => {
    onChange(label);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showList) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && suggestions[highlight]) {
      e.preventDefault();
      selectSuggestion(suggestions[highlight].label);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Ex: Pet Shop, Barbearia, Clínica Estética..."
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
        autoFocus
      />

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-56 w-full overflow-auto rounded-xl border border-border bg-surface py-1 shadow-xl"
        >
          {suggestions.map((item, i) => (
            <li key={item.label} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(item.label)}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors",
                  i === highlight
                    ? "bg-brand-soft text-foreground"
                    : "text-foreground hover:bg-surface-elevated",
                )}
              >
                <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.category}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
